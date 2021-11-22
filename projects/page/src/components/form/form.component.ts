import {Component, OnInit} from '@angular/core';
import {getPageOption, NcHttpService, NcNotifyService} from 'noce/core';
import {NzDrawerRef} from 'ng-zorro-antd/drawer';
import * as _ from 'lodash-es';
import {_eval} from 'noce/helper';

@Component({
  selector: 'nc-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.less']
})
export class NcFormComponent implements OnInit {
  option: any = {}; // 表单选项
  data: any = {}; // 表单数据
  dataBak: any = {}; // 备份编辑的备份
  pwdEye: any = {}; // 存储是否显示密码的状态
  fields: any = []; // 所有表单字段
  passwords: string[] = []; // 密码属性的字段

  key: string = 'id'; // 表单数据的主健,默认id

  maxLabel: number = 1; // 表单标签最大长度
  cols: number = 1; // 表单列数

  isnew: boolean = false; // 是否是新增数据
  saving: boolean = false; // 表单是否保存中

  constructor(private drawerRef: NzDrawerRef,
              private http: NcHttpService,
              private notify: NcNotifyService) {
    this.option = getPageOption('table.form');
    this.key = getPageOption('table.key');
    this.cols = this.option[0].cols;

    // 合并所有表单项
    this.fields = _.flatten(_.zipWith(this.option, (o: any) => o.fields));
    // 计算表单项中标签的最大值
    this.maxLabel = Math.ceil(Math.max(..._.zipWith(this.fields, (d: any) => d.label.byteLength() / 2)));
  }

  ngOnInit(): void {
    // 备份数据
    this.dataBak = _.cloneDeep(this.data);

    // 初始数据为空则是新增
    if (_.size(this.data) === 0) {
      this.isnew = true;
      // 新增数据时，设置默认值
      this.fields.forEach((field: any) => {
        if (field.value) {
          this.data[field.key] = field.value;
        }
      })
    }

    this.renderSelect();
  }

  // 渲染下拉选择框
  renderSelect(): void {
    // 从服务端获取表单下拉选择框的数据
    this.option.forEach((formItem: any) => {
      formItem.fields.forEach((field: any) => {
        if (field.type === 'select') {
          const select = field.select

          // 配置了api，则从服务端获取数据
          if (select.api) {
            this.http.post(select.api, {}).subscribe((res: any) => {
              if (res) {
                // 生成下拉选择项label和value
                const options: any = [];

                res.data.forEach((d: any) => options.push({
                  label: d[select.labelKey],
                  value: d[select.valueKey],
                }));
                // 更新下拉选择数据
                select.options = options;

                // 字段必填且表单数据没有字段值，则默认选上第一个选项
                if (field.required && !this.data[field.key]) {
                  this.data[field.key] = options[0].value;
                }
              }
            });
          } else if (!field.options) {
            field.options = [];
            this.notify.fatal(`Schema表单项（${field.label}）需要配置api或者options`);
          }
        }

        // 密码类型的字段保存时需要加密
        if (field.type === 'password') {
          this.passwords.push(field.key);
        }
      })
    })
  }

  // 打开选择弹窗
  openModal(modal: any): void {

  }

  // 下拉选择框切换事件
  optionChange(value: any, key: string): void {

  }

  // 保存表单数据
  save(): void {
    this.saving = true;
    const body = this.filterData();
    // 备份数据有内容时是修改，调用修改接口，否则调用增加接口
    const action = this.isnew ? getPageOption('table.create') : getPageOption('table.update')

    // 保存前的数据处理
    if(this.option[0].beforeSave){
      _eval(this.option[0].beforeSave)(body);
    }

    this.http.post(action.api, body, this.passwords).subscribe({
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

  // todo
  modalEmpty(): boolean {
    let invalid = false;

    // 如果未修改过, 则不用保存
    if (_.isEqual(this.data, this.dataBak)) {
      invalid = true;
    }

    return invalid;
  }

  // 表单项是否只读
  isReadonly(readonly: boolean | string): boolean {
    if (_.isString(readonly)) {
      return _eval(readonly)(this.data);
    } else {
      return readonly;
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
    }

    return result;
  }

  // 获取错误提示信息
  getErrorTip(control: any, name: string): string {
    if (control.hasError('required')) {
      return '不能为空！';
    } else if (control.hasError('pattern')) {
      return `请输入${name}!`;
    } else if (control.hasError('minlength')) {
      return `长度不能小于${control.errors.minlength.requiredLength}!`;
    }

    return '';
  }
}
