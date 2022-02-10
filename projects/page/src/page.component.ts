import {Component, OnDestroy} from '@angular/core';
import {getAppOption, NcEventService, ncGetPattern, NcHttpService, NcNotifyService, schemaToOption} from 'noce/core';
import {NavigationEnd, Router} from '@angular/router';
import * as _ from 'lodash-es';
import {objectExtend} from 'noce/helper';

@Component({
  templateUrl: 'page.component.html',
  styleUrls: ['page.component.less']
})
export class NcPageComponent implements OnDestroy {
  className: string = 'nc' + location.pathname.split('/').join('-'); // 样式名称，自定义样式时可用
  apis: any; // 页面可用服务接口
  table: any; // 左侧表格
  navs: any; // 右侧导航
  tabs: any; // 多标签表格

  navIndex: number = 0; // 当前导航栏
  navShow: boolean = true; // 是否显示导航

  routerEvent: any; // 路由跳转订阅
  reloadEvent: any; // 页面重载订阅
  tabClickEvent: any; // 标签点击事件

  constructor(private router: Router,
              private notify: NcNotifyService,
              private http: NcHttpService,
              private event: NcEventService) {
    // 监听路由跳转，跳转时加载新的配置
    this.routerEvent = router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.loadOption(true);
      }
    });

    // 监听重载页面事件
    this.reloadEvent = this.event.on('RELOAD_PAGE').subscribe((_: any) => {
      this.loadOption(false);
    });

    // 订阅标签点击事件
    this.tabClickEvent = this.event.on('TAB_CLICK').subscribe((navShow: any) => {
      this.navShow = navShow;
    })
  }

  // 组件销毁时取消事件订阅
  ngOnDestroy(): void {
    this.routerEvent.unsubscribe();
    this.reloadEvent.unsubscribe();
    this.tabClickEvent.unsubscribe();
  }

  // 加载页面配置选项
  loadOption(force: boolean): void {
    // 新页面重置是否显示导航
    this.navShow = true;

    // /page/xx/yy -> /schemas/xx/yy.schema.json
    const schemaPath = location.pathname.replace(getAppOption('base'), 'schemas') + '.schema.json';
    // 由于异步渲染的原因，路由跳转时，需要先清除页面
    this.assignOption({}, false);

    const options = schemaToOption(schemaPath);

    // 配置了从后台获取页面可用服务接口
    if (getAppOption('apis')) {
      this.http.queryApis().subscribe((apis: any) => {
        if (apis) {
          // 合并服务接口和用户配置的接口
          this.apis = objectExtend(options.apis, apis);
          // 转换api为真实服务接口地址
          this.convertApi(options);
          this.convertPattern(options);
          // 转换完成后赋值,减少重绘
          this.assignOption(options, force);
        }
      })
    } else {
      if (this.http.isValidData(options.apis)) {
        // 由于配置项需要http获取，在下一个宏任务里延时加载页面配置，页面才会更新
        setTimeout(() => {
          this.apis = options.apis;
          // 转换api为真实服务接口地址
          this.convertApi(options);
          this.convertPattern(options);
          // 转换完成后才能赋值,减少重绘
          this.assignOption(options, force);
        });
      } else {
        // 提示配置apis
        this.notify.fatal('至少在app、page之一的schema里配置apis')
      }
    }
  }

  // 分配选项
  assignOption(options: any, force: boolean): void {
    // 强制刷新整个页面时，延迟渲染table，避免出现横向滚动条
    if (force) {
      setTimeout(() => this.table = options.table);
    } else {
      this.table = options.table;
    }
    this.navs = options.navs;
    this.tabs = options.tabs;
  }

  // api转换
  convertApi(options: any): void {
    // {}时查找api属性来替换
    if (_.isPlainObject(options)) {
      // 遍历{}
      _.forEach(options, (val: any, key: string, obj: any) => {
        // 属性是api，并且值为apis.开头时，替换为真实api地址
        if (key === 'api' && val.startsWith('apis.')) {
          obj.api = this.apis[val.substring(5)];
          // {}或[]时递归
        } else if (_.isObject(val)) {
          this.convertApi(val);
        }
      });
    } else if (_.isArray(options)) {
      // 递归遍历[]
      _.forEach(options, scm => this.convertApi(scm));
    }
  }

  // 正则表达式转换
  convertPattern(options: any): void {
    if (_.isPlainObject(options)) {
      // 遍历{}获取form
      _.forEach(options, (val: any, key: string) => {
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
    } else if (_.isArray(options)) {
      // 递归遍历[]
      _.forEach(options, scm => this.convertPattern(scm));
    }
  }
}
