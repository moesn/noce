import {Component, OnInit} from '@angular/core';
import {NcHttpService} from 'noce/core';
import {NzDrawerRef} from 'ng-zorro-antd/drawer';
import * as _ from 'lodash-es';
import {toArray, uniqBy} from 'lodash-es';
import {__eval, _eval, arrayToTree, objectExtend} from 'noce/helper';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NcTableComponent} from '..';

@Component({
  selector: 'nc-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.less']
})
export class NcFormComponent implements OnInit {
  options: any = {}; // 表单选项
  key: string = ''; // 表单数据的主健
  data: any = {}; // 表单数据
  action = {api: '', body: {}}; // 表单数据保存接口

  dataBak: any = {}; // 备份编辑的备份
  pwdEye: any = {}; // 存储是否显示密码的状态
  fields: any = []; // 所有表单字段
  passwords: string[] = []; // 密码属性的字段
  nameKeys: string[] = []; // 表单数据中用于显示的字段

  maxLabel: number = 1; // 表单标签最大长度
  cols: number = 1; // 表单列数

  isnew: boolean = false; // 是否是新增数据
  saving: boolean = false; // 表单是否保存中

  constructor(private drawerRef: NzDrawerRef,
              private modal: NzModalService,
              private http: NcHttpService) {
  }

  ngOnInit(): void {
    this.cols = this.options[0].cols;

    // 合并所有表单项
    this.fields = _.flatten(_.zipWith(this.options, (o: any) => o.fields));
    // 计算表单项中标签的最大值
    this.maxLabel = Math.ceil(Math.max(..._.zipWith(this.fields, (d: any) => d.label.byteLength() / 2)));

    // 备份数据
    this.dataBak = _.cloneDeep(this.data);

    // 初始数据为空则是新增
    if (!this.data[this.key]) {
      this.isnew = true;

      // 新增数据时，设置默认值
      this.fields.forEach((field: any) => {
        if (field.value !== undefined) {
          this.data[field.key] = field.value;
        }
      })
    }

    this.renderSelect();
  }

  // 渲染下拉选择框
  renderSelect(): void {
    // 从服务端获取表单下拉选择框的数据
    this.options.forEach((formItem: any) => {
      formItem.fields.forEach((field: any) => {
        // 下拉选择框
        if (field.type === 'select') {
          const select = field.select
          const body = {};

          // 合并用户配置的参数
          if (select.body) {
            objectExtend(body, __eval.call(this, select.body))
          }

          // 配置了api，则从服务端获取数据
          if (select.api) {
            this.http.post(select.api, body).subscribe((res: any) => {
              if (res) {
                // 生成下拉选择项label和value
                const options: any = [];

                res.data.forEach((d: any) => options.push({
                  label: d[select.nameKey],
                  value: d[select.valueKey],
                }));
                // 更新下拉选择数据
                select.options = options;

                // 字段必填且表单数据没有字段值，则默认选上第一个选项
                if (field.required && !this.data[field.key]) {
                  this.data[field.key] = select.options[0]?.value;
                  // 触发事件
                  this.optionChange(select);
                }
              }
            });
          }
        }

        // 树型下拉选择框
        if (field.type === 'treeselect') {
          const tree = field.treeselect
          const body = {};

          // 合并用户配置的参数
          if (tree.body) {
            objectExtend(body, __eval.call(this, tree.body))
          }

          this.http.post(tree.api, body).subscribe((res: any) => {
            if (res) {
              // 将列表转换成树型结构，更新下拉选择数据
              tree.nodes = arrayToTree(res.data, tree);

              // 字段必填且表单数据没有字段值，则默认选上第一个选项
              if (field.required && !this.data[field.key]) {
                this.data[field.key] = tree.nodes[0]?.value;
                // 触发事件
                this.optionChange(tree);
              }
            }
          });
        }

        // 密码类型的字段保存时需要加密
        if (field.type === 'password') {
          this.passwords.push(field.key);
        }
      })
    })
  }

  // 打开选择弹窗
  openModal(field: any): void {
    const modal = field.modal
    // 弹窗使用简化分页
    const view = {simple: true, checkable: true}
    objectExtend(modal, {view});

    const modalRef = this.modal.create({
      nzWidth: modal.width,
      nzStyle: {top: '12px'},
      nzBodyStyle: {padding: '0 0 12px 0'},
      nzContent: NcTableComponent,
      // 弹窗选项、已选数据主键
      nzComponentParams: {options: modal, checkedKeys: this.data[field.key]},
      nzClosable: false,
      nzFooter: [
        {
          label: '确定',
          onClick: (comp: NcTableComponent) => {
            // 集合转成数组，多选时数据去重，单选时取第一个数据
            const multiple = modal.view.multiple;
            const arr = toArray(comp.checkedData);
            const data: any = multiple ? uniqBy(arr, modal.key) : arr[0];

            // 设置关联字段和名称
            if (multiple) { // 多选
              // 需要提交到后台的数据
              this.data[field.key] = _.zipWith(data, (d: any) => d[modal.key]);
              // 表单显示的内容
              this.data[field.nameKey] = _.zipWith(data, (d: any) => d[modal.nameKey]);
            } else { // 单选
              // 需要提交到后台的数据
              this.data[field.key] = data[modal.key];
              // 表单显示的内容
              this.data[field.nameKey] = data[modal.nameKey];
            }

            // 记录用于显示的字段，保存前需要删除
            if (!this.nameKeys.includes(field.nameKey)) {
              this.nameKeys.push(field.nameKey);
            }

            // 关闭弹窗
            modalRef.close();
          }
        }
      ]
    });
  }

  // 下拉选择框切换事件
  optionChange(select: any): void {
    // 处理监听的点击事件
    if (select.onClick) {
      _eval(select.onClick)(this.data);
    }
  }

  // 保存表单数据
  save(): void {
    this.saving = true;
    const body = this.filterData();

    // 合并用户配置的参数
    if (this.action.body) {
      objectExtend(body, __eval.call(this, this.action.body))
    }

    // 删除用于显示的字段
    this.nameKeys.forEach(key => delete body[key]);

    // 保存前的数据处理
    const beforeSave = this.options[0].beforeSave;
    if (beforeSave) {
      _eval(beforeSave)(body);
    }

    this.http.post(this.action.api, body, this.passwords).subscribe({
      next: (res: any) => {
        if (res) {
          // 保存成功，关闭弹窗
          this.drawerRef.close(res.data);
        }
      },
      // 接口调用错误
      error: () => this.saving = false,
      // 接口调用完成
      complete: () => this.saving = false
    });
  }

  // 去除无效的表单数据
  filterData(): any {
    // 克隆表单数据，避免保存出错时需要恢复表单数据
    let body = _.cloneDeep(this.data);

    // 修改时去除未修改的字段，保留key字段
    if (!this.isnew) {
      body = _.omitBy(body, (v: any, k: string) => k !== this.key && _.isEqual(this.dataBak[k], v));
    }

    return body;
  }

  // 关闭表单窗口
  close(): void {
    this.drawerRef.close();
  }

  // 数据是否还是原样
  isOriginal(): boolean {
    let invalid = false;

    // 如果未修改过, 则不用保存
    if (_.isEqual(this.data, this.dataBak)) {
      invalid = true;
    }

    return invalid;
  }

  // 是否只读、是否必填、是否显示
  isTrue(value: boolean | string): boolean {
    if (_.isString(value)) {
      return _eval(value)(this.data);
    } else {
      return value;
    }
  }

  // 计算表单项宽度
  getSpan(field: any): number {
    // 动态显示时，备份是否必填
    if (_.isString(field.show) && field._required === undefined) {
      field._required = field.required;
    }

    if (this.isTrue(field.show)) {
      // 动态显示时，使用备份的是否必填配置
      field.required = field._required || field.required;
      return field.span || 24 / this.cols;
    } else {
      // 动态隐藏时，隐藏后设置为非必填
      field.required = false;
      return 0
    }
  }

  // 获取提示文字
  getPlaceholder(field: any): string {
    let result = '';

    if (['input', 'textarea'].includes(field.type)) {
      const min = field.input.minLength;
      const max = field.input.maxLength;
      result += min === max ? `长度${max}` : `长度${min} ~ ${max}`;
    }

    if (field.pattern) {
      result += result ? '的' : '';
      result += `${field.pattern.name}`;

      const tip = field.pattern.tip;
      // 使用正则校验的输入提示
      if (tip) {
        field.input.maxLength = 128;
        result = tip;
      }
    }

    return result;
  }

  // 获取错误提示信息
  getErrorTip(control: any, pattern: any): string {
    if (control.hasError('required')) {
      return '不能为空！';
    } else if (control.hasError('pattern')) {
      return pattern.tip || `请输入${pattern.name}!`;
    } else if (control.hasError('minlength')) {
      return `长度不能小于${control.errors.minlength.requiredLength}!`;
    }

    return '';
  }
}
