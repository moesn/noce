import {Component} from '@angular/core';
import {getAppOption, getPageOption, ncGetPattern, NcHttpService, NcNotifyService, schemaToOption} from 'noce/core';
import {NavigationEnd, Router} from '@angular/router';
import * as _ from 'lodash-es';

@Component({
  templateUrl: 'page.component.html',
  styleUrls: ['page.component.less']
})
export class NcPageComponent {
  apis: any; // 页面可用服务接口
  table: any; // 左侧表格
  navs: any; // 右侧导航

  navIndex: number = 0; // 当前导航栏

  constructor(private router: Router,
              private notify: NcNotifyService,
              private http: NcHttpService) {
    // 监听路由跳转，跳转时加载新的配置
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.loadOption();
      }
    });
  }

  // 加载页面配置选项
  loadOption(): void {
    // /page/xx/yy -> /schemas/xx/yy.schema.json
    const schemaPath = location.pathname.replace(getAppOption('base'), 'schemas') + '.schema.json';
    // 由于异步渲染的原因，路由跳转时，需要先清除页面
    this.assignOption({});

    // 配置了从后台获取页面可用服务接口
    if (getAppOption('apis')) {
      this.http.queryApis().subscribe(apis => {
        if (apis) {
          this.apis = apis;
          const option = schemaToOption(schemaPath);
          // 转换api为真实服务接口地址
          this.convertApi(option);
          this.convertPattern(option);
          // 转换完成后赋值,减少重绘
          this.assignOption(option);
        }
      })
    } else {
      // 由于配置项需要http获取，在下一个宏任务里延时加载页面配置，页面才会更新
      setTimeout(() => {
        const option = schemaToOption(schemaPath);
        this.convertPattern(option);
        // 转换完成后才能赋值,减少重绘
        this.assignOption(option);
      });

      // 提示配置apis
      if (!this.http.isValidData(getPageOption('apis'))) {
        this.notify.fatal('至少在app、page之一的schema里配置apis')
      }
    }
  }

  // 分配选项
  assignOption(option: any): void {
    this.table = option.table;
    this.navs = option.navs;
  }

  // api转换
  convertApi(option: any): void {
    // {}时查找api属性来替换
    if (_.isPlainObject(option)) {
      // 遍历{}
      _.forEach(option, (val: any, key: string, obj: any) => {
        // 属性是api，并且值为apis.开头时，替换为真实api地址
        if (key === 'api' && val.startsWith('apis.')) {
          obj.api = this.apis[val.substring(5)];
          // {}或[]时递归
        } else if (_.isObject(val)) {
          this.convertApi(val);
        }
      });
    } else if (_.isArray(option)) {
      // 递归遍历[]
      _.forEach(option, scm => this.convertApi(scm));
    }
  }

  // 正则表达式转换
  convertPattern(option: any): void {
    if (_.isPlainObject(option)) {
      // 遍历{}获取form
      _.forEach(option, (val: any, key: string) => {
        if (key === 'form') {
          // 遍历所有表单的所有字段
          val.forEach((form: any) => {
            form.fields.forEach((field: any) => {
              // 配置了正则校验
              if (field.pattern) {
                if (_.isString(field.pattern)) {
                  // 内置表达式根据配置的名称获取正则内容
                  field.pattern = ncGetPattern(field.pattern);
                }
              }
            });
          });
          // {}或[]时递归
        } else if (_.isObject(val)) {
          this.convertPattern(val);
        }
      });
    } else if (_.isArray(option)) {
      // 递归遍历[]
      _.forEach(option, scm => this.convertPattern(scm));
    }
  }
}
