import {Component, Input, OnInit} from '@angular/core';
import {NzDrawerRef, NzDrawerService} from 'ng-zorro-antd/drawer';
import {NcEventService, NcHttpService, NcNotifyService} from 'noce/core';
import * as _ from 'lodash-es';
import {__eval, _eval, objectExtend} from 'noce/helper';
import {NcFormComponent} from '..';

@Component({
  selector: 'nc-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class NcListComponent implements OnInit {
  @Input() options: any; // 列表选项
  drawerRef: NzDrawerRef | undefined; // 表单弹窗实例

  data: any = {}; // 当前操作的数据
  datas: any[] = []; // 列表数据
  key: string = ''; // 数据主键
  loading: boolean = false; // 是否加载数据中
  _isInit: boolean = false; // 是否是系统内置数据

  constructor(private drawer: NzDrawerService,
              private http: NcHttpService,
              private notify: NcNotifyService,
              private event: NcEventService) {
  }

  ngOnInit(): void {
    this.key = this.options.key;
    this.query();
  }

  // 查询列表
  query(): void {
    this.loading = true;
    this.http.query(this.options.api, {}, this.options.parseReq, this.options.parseRes).subscribe(
      (res: any) => {
        if (res) {
          // 有数据时
          if (_.isArray(res.data) && res.data.length) {
            const parse = this.options.parseData;
            // 如果需要解析表格数据
            if (parse) {
              res.data.forEach((data: any) => _eval(parse)(data));
            }

            this.datas = res.data;
            // 默认选中第一个并查询表格数据
            if (this.options.selected) {
              this.click(this.datas[0]);
            }
          }
        }
      },
      () => this.loading = false,
      () => this.loading = false
    );
  }

  // 返回全部
  rollback(): void {
    this.data = {};
    // 发出点击事件
    this.event.emit('NAV_CLICK', this.data);
  }

  // 点击
  click(data: any): void {
    this._isInit = data[this.key]?.toString().startsWith('-');
    // 更新选中状态
    this.data = data;
    // 发出点击事件
    this.event.emit('NAV_CLICK', data);
  }

  // 编辑
  edit(update: boolean): void {
    // 克隆数据，避免修改失败时需要还原
    const data = _.cloneDeep(update ? this.data : {});

    // form的全局属性配置在第一个form上
    const formOne = this.options.form[0];

    // 打开编辑窗口
    this.drawerRef = this.drawer.create({
      nzWrapClassName: ['nc', ...location.pathname.split('/'), 'list'].join('-'),
      nzWidth: formOne.width || formOne.cols * 360,
      nzContent: NcFormComponent,
      nzContentParams: {
        options: this.options.form,
        key: this.options.key,
        action: update ? this.options.update : this.options.create,
        data: data
      },
      nzClosable: false,
      nzKeyboard: false,
      nzMaskClosable: false,
    });

    this.drawerRef.afterClose.subscribe((res: any) => {
      if (res) {
        if (data.id) {
          // 根据数据主键查询
          const param: any = {};
          param[this.key] = data[this.key];
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
    // 内置数据不可删除
    if (this._isInit) {
      this.notify.warning('内置数据不可删除');
      return;
    }

    const body = {};
    const action = this.options.delete;

    // 合并用户配置的参数
    if (action.body) {
      objectExtend(body, __eval.call(this, action.body))
    }

    this.http.delete(action.api, body,action.parseReq).subscribe((res: any) => {
      if (res) {
        this.datas = _.reject(this.datas, (d: any) => this.data[this.key] === d[this.key]);
        // 删除时默认选择第一个
        this.click(this.datas[0]);
      }
    });
  }
}
