import {Component, Input, OnInit} from '@angular/core';
import {NzDrawerRef, NzDrawerService} from 'ng-zorro-antd/drawer';
import {NcEventService, NcHttpService} from 'noce/core';
import * as _ from 'lodash-es';
import {NcFormComponent} from 'noce/page/src/components';
import {__eval, objectExtend} from 'noce/helper';

@Component({
  selector: 'nc-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class NcListComponent implements OnInit {
  @Input() option: any; // 列表选项
  drawerRef: NzDrawerRef | undefined; // 表单弹窗实例

  data: any; // 当前操作的数据
  datas: any[] = []; // 列表数据
  key: string = ''; // 数据主键

  constructor(private drawer: NzDrawerService,
              private http: NcHttpService,
              private event: NcEventService) {
  }

  ngOnInit(): void {
    this.key = this.option.key;
    this.query();
  }

  // 查询列表
  query(): void {
    this.http.query(this.option.api, {}).subscribe((res: any) => {
      if (res) {
        // 有数据时，默认选中第一个并查询表格数据
        if (_.isArray(res.data) && res.data.length) {
          this.datas = res.data;
          this.click(this.datas[0]);
        }
      }
    });
  }

  // 点击
  click(data: any): void {
    // 更新选中状态
    this.data = data;
    // 树主键在表格的映射键
    const {mappingKey} = this.option;
    // 发出点击事件
    this.event.emit('NAV_CLICK', {mappingKey, ...data});
  }

  // 编辑
  edit(update: boolean): void {
    // 克隆数据，避免修改失败时需要还原
    this.data = _.cloneDeep(update ? this.data : {});

    // form的全局属性配置在第一个form上
    const formOne = this.option.form[0];

    // 打开编辑窗口
    this.drawerRef = this.drawer.create({
      nzWidth: formOne.width || formOne.cols * 360,
      nzContent: NcFormComponent,
      nzContentParams: {
        option: this.option.form,
        key: this.option.key,
        action: update ? this.option.update : this.option.create,
        data: this.data
      },
      nzClosable: false,
      nzKeyboard: false,
      nzMaskClosable: false,
    });

    this.drawerRef.afterClose.subscribe((res: any) => {
      if (res) {
        if (this.data.id) {
          // 根据数据主键查询
          const param: any = {};
          param[this.key] = this.data[this.key];
          // 修改，查找替换修改数据
          objectExtend(_.find(this.datas, param), res);
        } else {
          // 新增，设置id并插入到最前面
          this.datas = [res, ...this.datas];
          // 切换节点并查询表格数据
          this.click(res);
        }
      }
    });
  }

  // 删除节点
  delete(): void {
    const body = {};
    const action = this.option.delete;

    // 合并用户配置的参数
    if (action.body) {
      objectExtend(body, __eval.call(this, action.body))
    }

    this.http.delete(action.api, body).subscribe(res => {
      if (res) {
        this.datas = _.reject(this.datas, (d: any) => this.data[this.key] === d[this.key]);
        // 删除时默认选择第一个
        this.click(this.datas[0]);
      }
    });
  }
}
