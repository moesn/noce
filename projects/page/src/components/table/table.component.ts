import {Component, Input, OnInit} from '@angular/core';
import {NcEventService, NcHttpService} from 'noce/core';
import {__eval, _eval, objectExtend} from 'noce/helper';
import {NzTableQueryParams} from 'ng-zorro-antd/table';
import * as _ from 'lodash-es';
import {reject} from 'lodash-es';
import {NzDrawerRef, NzDrawerService} from 'ng-zorro-antd/drawer';
import {NcFormComponent} from '..';

@Component({
  selector: 'nc-table',
  templateUrl: 'table.component.html',
  styleUrls: ['table.component.less']
})
export class NcTableComponent implements OnInit {
  @Input() option: any; // 表格选项
  @Input() navOption: any; // 导航选项

  data: any; // 当前操作的数据
  datas: any[] = []; // 表格数据
  searches: any = []; // 可搜索的字段

  body: any = { // 传到服务端端查询参数
    exact: {}, // 精确查询
    fuzzy: {field: [], keyword: ''} // 模糊搜索, 搜索的字段和关键字
  };

  key: string = ''; // 数据主键

  pageIndex: number = 1; // 当前页数
  total: number = 0; // 表格数据总数

  drawerRef: NzDrawerRef | any; // 表单弹窗实例

  constructor(private drawer: NzDrawerService,
              private http: NcHttpService,
              private event: NcEventService) {
  }

  ngOnInit(): void {
    this.key = this.option.key;
    // 过滤得到可以搜索的字段列表
    this.searches = this.option.view.columns.filter((d: any) => d.search);

    // 监听导航点击事件
    this.event.on('NAV_CLICK').subscribe(res => {
      // 设置关联查询参数
      this.body.exact[this.navOption.mappingKey] = res.key;
      this.query();
    })
  }

  // 查询表格数据
  query(params?: NzTableQueryParams): void {
    let body = {}; // 查询参数
    objectExtend(this.body, params); // 记录分页、过滤、排序等表格查询参数

    // 如果有导航，但没有关联导航，则阻止表格自动查询
    if (this.navOption && !this.body.exact[this.navOption.mappingKey]) {
      return;
    }

    // 合并表格查询参数
    objectExtend(body, this.body)

    // 合并用户配置的参数
    if (this.option.view.body) {
      objectExtend(body, __eval.call(this, this.option.view.body))
    }

    this.http.query(this.option.view.api, body).subscribe(res => {
      if (res) {
        // 有些接口没有数据返回的是null
        this.datas = res.data || [];
        this.total = res.total;

        const parse = this.option.view.parseData;
        // 如果需要解析表格数据
        if (parse) {
          this.datas.forEach(data => _eval(parse)(data));
        }
      }
    });
  }

  // 修改表格数据
  edit(data: any): void {
    // 更新当前操作的数据
    this.data = _.cloneDeep(data);
    // 附加类型、分组等关联字段
    objectExtend(this.data, this.body.exact)

    // form的全局属性配置在第一个form上
    const formOne = this.option.form[0];

    // 打开编辑前数据处理
    if (formOne.beforeOpen) {
      _eval(formOne.beforeOpen)(this.data)
    }

    // 打开编辑窗口
    this.drawerRef = this.drawer.create({
      // 配置了宽度使用宽度，没有配置则使用列数乘以最小宽度360
      nzWidth: formOne.width || formOne.cols * 360,
      nzContent: NcFormComponent,
      nzContentParams: {
        option: this.option.form,
        key: this.option.key,
        action: _.size(data) ? this.option.update : this.option.create,
        data: this.data
      },
      nzClosable: false,
      nzKeyboard: false,
      nzMaskClosable: false,
    });
  }

  // 删除表格数据
  delete(data: any): void {
    // 更新当前操作的数据
    this.data = data;

    const body = {};
    const action = this.option.delete;

    // 合并用户配置的参数
    if (action.body) {
      objectExtend(body, __eval.call(this, action.body))
    }

    this.http.delete(action.api, body).subscribe((res: any) => {
      if (res) {
        // 表格数据删除一条
        this.datas = reject(this.datas, (d: any) => d[this.option.key] === data[this.option.key]);
        // 总条数减1
        this.total -= 1;
      }
    });
  }
}
