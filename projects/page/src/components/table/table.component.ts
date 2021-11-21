import {Component, OnInit} from '@angular/core';
import {getPageOption, NcHttpService, NcNotifyService} from 'noce/core';
import {__eval, _eval, objectExtend} from 'noce/helper';
import {NzTableQueryParams} from 'ng-zorro-antd/table';
import {reject} from 'lodash-es';
import {NzDrawerRef, NzDrawerService} from 'ng-zorro-antd/drawer';
import {NcFormComponent} from '..';

@Component({
  selector: 'nc-table',
  templateUrl: 'table.component.html',
  styleUrls: ['table.component.less']
})
export class NcTableComponent implements OnInit {
  option: any; // 表格选项
  data: any; // 当前操作的数据
  datas: any[] = []; // 表格数据
  searches: any = []; // 可搜索的字段
  fuzzy = {field: [], keyword: ''} // 模糊搜索, 搜索的字段和关键字

  key: string; // 表格数据主键

  pageIndex: number = 1; // 当前页数
  total: number = 0; // 表格数据总数

  drawerRef: NzDrawerRef | any; // 表单弹窗实例

  constructor(private drawer: NzDrawerService,
              private http: NcHttpService,
              private notify: NcNotifyService) {
    this.option = getPageOption('table');
    this.key = this.option.key;
    // 过滤得到可以搜索的字段列表
    this.searches = this.option.view.columns.filter((d: any) => d.search);
  }

  ngOnInit(): void {

  }

  // 查询表格数据
  query(params?: NzTableQueryParams): void {
    let body = {}; // 查询参数

    // 参数扩展，表格查询参数、用户自定义参数
    objectExtend(body, params, this.option.view.body)

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
    this.data = data;

    // form的全局属性配置在第一个form上
    const formOne = this.option.form[0];
    // 打开编辑窗口
    this.drawerRef = this.drawer.create({
      // 配置了宽度使用宽度，没有配置则使用列数乘以最小宽度360
      nzWidth: formOne.width || formOne.cols * 360,
      nzContent: NcFormComponent,
      nzContentParams: {
        // key: this.tableSchema?.key || 'id',
        data: this.data,
        // formSchema: this.formSchema,
        // cols: this.tableSchema?.cols || 1,
        // saveapi: this.data[this.key] ? this.tableSchema?.api.update : this.tableSchema?.api.create,
        // listkey: this.listkey,
        // treekey: this.treekey,
        // update
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

    this.http.delete(this.option.delete.api, __eval.call(this, this.option.delete.body)).subscribe((res: any) => {
      if (res) {
        // 表格数据删除一条
        this.datas = reject(this.datas, (d: any) => d[this.option.key] === data[this.option.key]);
        // 总条数减1
        this.total -= 1;
      }
    });
  }
}
