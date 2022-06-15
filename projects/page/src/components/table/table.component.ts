import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {NcEventService, NcHttpService, NcModalComponents} from 'noce/core';
import {__eval, _eval, objectExtend} from 'noce/helper';
import * as _ from 'lodash-es';
import {cloneDeep} from 'lodash-es';
import {NzDrawerRef, NzDrawerService} from 'ng-zorro-antd/drawer';
import {NcFormComponent} from '..';
import {differenceInCalendarDays, format} from 'date-fns';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzUploadFile} from 'ng-zorro-antd/upload';
import {NcTokenService} from 'noce/auth';

@Component({
  selector: 'nc-table',
  templateUrl: 'table.component.html',
  styleUrls: ['table.component.less']
})
export class NcTableComponent implements OnInit, OnDestroy {
  @Input() options: any; // 表格选项
  @Input() navOption: any; // 导航选项
  @Input() tabOption: any; //  标签选项
  _eval = _eval; // 处理动态数据

  user: any; // 当前登录用户

  optionsBak: any; // 备份表格选项
  drawerRef: NzDrawerRef | undefined; // 表单弹窗实例
  navClickEvent: any; // 导航点击事件
  nav: any; // 导航选中项的数据

  tab: any; // 当前标签
  data: any = {}; // 当前操作的数据
  datas: any[] = []; // 表格数据
  datasBak: any[] = []; // 表格数据备份
  searchFields: any = []; // 可搜索的字段

  body: any = { // 传到服务端端查询参数
    range: {time: []}, // 按时间范围过滤
    exact: {}, // 精确查询
    fuzzy: {field: [], keyword: ''} // 模糊搜索, 搜索的字段和关键字
  };
  params: any = {}; // 缓存参数，下载时使用

  idKey: string = ''; // 数据主键
  height: string = ''; // 表格内容区域高度
  navState: string = ''; // 导航状态，从无到有f2t，从有到无t2f

  pageIndex: number = 1; // 当前页数
  total: number = 0; // 表格数据总数
  loading: boolean = false; // 是否加载数据中

  allChecked = false; // 当前页是否全选
  indeterminate = false; // 当前页是否有选
  pageDatas: any = []; // 页面显示的数据
  checkedData = new Set<string>(); // 已选数据
  checkedKeys: string[] = []; // 已选数据的主键

  timeRanges: any; // 时间范围
  disabledDate = (current: Date): boolean => differenceInCalendarDays(current, new Date()) > 0; // 只能选择当前日期之前的时间

  uploading = false; // 文件是否上传中
  fileList: NzUploadFile[] = []; // 文件上传列表

  constructor(private drawer: NzDrawerService,
              private modal: NzModalService,
              private http: NcHttpService,
              private event: NcEventService,
              private token: NcTokenService) {
    const content: any = document.getElementsByTagName('nz-content')[0];
    this.height = content.offsetHeight - 175 + 'px';
    this.user = this.token.getPayload();
  }

  ngOnInit(): void {
    this.idKey = this.options.idKey;

    // 初始选中第一个标签
    if (this.tabOption) {
      this.switchTab(this.tabOption[0]);
    } else if (this.options.view) {
      // 过滤得到可以搜索的字段列表，设置了search并且是当前标签的
      this.searchFields = this.options.view.columns.filter((d: any) => d.search && this.isCureentTab(d.tabIndex));
    }

    // 订阅导航点击事件
    this.navClickEvent = this.event.on('NAV_CLICK').subscribe((res: any) => {
      // 重置tab切换
      this.navState = '';
      // 记录导航项的数据，供自定义操作使用
      this.nav = res;
      // 关联的值
      const mappingValue = res[this.navOption?.idKey];

      // 点击导航时设置关联参数，返回全部时删除关联参数
      if (mappingValue !== undefined) {
        this.body.exact[this.navOption?.mappingKey] = mappingValue;
      } else {
        delete this.body.exact[this.navOption?.mappingKey];
      }

      // 切换回第一页，切换了分页会触发查询，不用执行query
      if (this.pageIndex !== 1) {
        this.pageIndex = 1;
      } else {
        this.query({pageIndex: 1});
      }

      // 执行用户自定义点击事件
      if (this.navOption.click) {
        _eval(this.navOption.click)({nav: this.nav, columns: this.options.view.columns})
      }
    })
  }

  ngOnDestroy(): void {
    // 取消订阅导航点击事件
    if (this.navClickEvent) {
      this.navClickEvent.unsubscribe();
    }
  }

  // 查询表格数据
  query(params: any = {}): void {
    // 不分页时前台查询
    if (this.options.view.singlePage && this.datasBak.length) {
      this.datas = cloneDeep(this.datasBak);
      objectExtend(this.body, params);

      const filter = this.body.filter.find((d: any) => d.value);
      const sort = this.body.sort.find((d: any) => d.value);
      const keyword = this.body.fuzzy.keyword

      if (filter) {
        // 查询时把包涵过滤关键字的排前面
        this.datas = _.sortBy(this.datas, (d: any) => !filter.value.includes(d[filter.key]));
      }

      if (sort) {
        this.datas = _.orderBy(this.datas, [sort.key], [sort.value.replace('end', '')]);
      }

      if (keyword) {
        // 查询时把包涵关键字的排前面
        this.datas = _.sortBy(this.datas, d => !JSON.stringify(d).includes(keyword));
      }
    } else {
      // 查询参数
      let body: any = {};
      // 记录分页、过滤、排序等表格查询参数
      objectExtend(this.body, params);

      // 防止切换tab时，导航从无到有时，导航select的重复查询
      if (this.navState === 'f2t' && this.navOption?.selected) {
        this.loading = false;
        return;
      }

      // 没有分页参数页不查询
      if (!this.body.pageIndex || !this.body.pageSize) {
        this.loading = false;
        return;
      }

      // 如果有导航选项 & 当前tab有导航 & 导航必选 & 但没有关联导航，则阻止表格自动查询
      if (this.navOption && this.isCureentTab(this.navOption?.tabIndex) &&
        this.navOption?.selected && this.body.exact[this.navOption?.mappingKey] === undefined) {
        this.loading = false;
        return;
      }

      // 合并用户配置的参数
      if (this.options.view.body) {
        objectExtend(body, __eval.call(this, this.options.view.body));
      }

      // 过滤得到需要搜索的字段列表
      let searches = this.searchFields.filter((d: any) => d.search);
      // 没有设置搜索字段时也是搜索全部可搜索的字段
      if (!searches.length) {
        searches = this.searchFields;
      }
      // 设置搜索字段key
      this.body.fuzzy.field = _.zipWith(searches, (d: any) => d.key);

      // 合并表格查询参数
      objectExtend(body, this.body);

      // 单页时删除分页参数
      if (this.options.view.singlePage) {
        objectExtend(body, {pageIndex: null, pageSize: null});
      }

      // 导航从有到无时删除导航关联字段
      if (this.navState === 't2f' && body.exact) {
        delete body.exact[this.navOption?.mappingKey];
      }

      // 不同tab的timeKey可能不同，替换timeKey
      if (this.options.timeKey && body.range.time) {
        body.range[this.options.timeKey] = body.range.time;
        delete body.range.time;
      }

      // 缓存参数，下载数据时使用
      this.params = body;

      // 清空数据
      this.data = {};
      this.loading = true;

      this.http.query(this.options.view.api, body, this.options.view.parseReq, this.options.view.parseRes).subscribe(
        (res: any) => {
          if (res) {
            // 清除数据
            this.checkedData.clear();
            this.total = res.total;

            if (_.isArray(res.data)) {
              // 是否初始化数据
              res.data.forEach((data: any) => data._isInit = data[this.idKey].toString().startsWith('-') || data.isInit);

              const parse = this.options.view.parseData;
              // 如果需要解析表格数据
              if (parse) {
                res.data.forEach((data: any) => _eval(parse)(data));
              }

              // 表格作为弹窗时反选上已选数据
              res.data.forEach((d: any) => {
                // 单选时非数组，转成数组
                if (!_.isArray(this.checkedKeys)) {
                  this.checkedKeys = [this.checkedKeys];
                }
                // 主键包含在数组里的反选上
                if (this.checkedKeys.includes(d[this.idKey])) {
                  this.checkedData.add(d);
                }
              });
            }

            // 有些接口没有数据返回的是null
            this.datas = res.data || [];
            // 备份数据
            this.datasBak = _.cloneDeep(this.datas);

            this.refreshCheckedStatus();
          }
        },
        () => this.loading = false,
        () => this.loading = false
      );
    }
  }

  // 修改表格数据
  edit(data: any): void {
    let update = false;

    if (_.size(data)) {
      // 更新当前操作的数据
      this.data = _.cloneDeep(data);
      update = true;
    } else {
      // 新增时附加类型、分组等关联字段
      this.data = objectExtend(data, this.body.exact)
    }

    // form的全局属性配置在第一个form上
    const formOne = this.options.form[0];

    // 打开编辑前数据处理
    if (formOne.beforeOpen) {
      _eval(formOne.beforeOpen)(this.data)
    }

    // 打开编辑窗口
    this.drawerRef = this.drawer.create({
      nzWrapClassName: ['nc', ...location.pathname.split('/'), 'table'].join('-'),
      // 配置了宽度使用宽度，没有配置则使用列数乘以最小宽度360
      nzWidth: formOne.width || formOne.cols * 360,
      nzContent: NcFormComponent,
      nzContentParams: {
        options: _.cloneDeep(this.options.form),
        idKey: this.options.idKey,
        action: update ? this.options.update : this.options.create,
        data: this.data,
        tab: this.tab,
        nav: this.nav
      },
      nzClosable: false,
      nzKeyboard: true,
      nzMaskClosable: true,
    });

    this.drawerRef.afterClose.subscribe((res: any) => {
      // 返回保存成功后的数据
      if (res) {
        const parse = this.options.view.parseData;
        // 如果需要解析表格数据
        if (parse) {
          _eval(parse)(res)
        }

        // 有导航时刷新页面
        if (this.navOption && this.isCureentTab(this.navOption?.tabIndex)) {
          this.query({});
        } else {
          // 编辑前的数据有主键时是修改操作
          if (this.data[this.idKey]) {
            // 查找替换修改数据
            objectExtend(_.find(this.datas, d => d[this.idKey] === this.data[this.idKey]), res);
          } else {
            // 新增时将数据插入到最前面
            this.datas = [res, ...this.datas];
            // 总条数加1
            this.total += 1;
          }
        }
      }
    });
  }

  // 删除表格数据
  delete(data: any): void {
    // 更新当前操作的数据
    this.data = data;

    const action = this.options.delete;
    let body = action.body;

    // 合并用户配置的参数
    if (body) {
      body = __eval.call(this, body)
    }

    this.http.delete(action.api, body, action.parseReq).subscribe((res: any) => {
      if (res) {
        // 表格数据删除一条
        this.datas = _.reject(this.datas, (d: any) => d[this.options.idKey] === data[this.options.idKey]);
        // 总条数减1
        this.total -= 1;
      }
    });
  }

  // 多标签时切换标签事件
  switchTab(tab: any): void {
    // tab切换前无导航
    if (this.tab && !this.isCureentTab(this.navOption?.tabIndex)) {
      this.navState = 'f';
    } else {
      this.navState = 't';
    }

    // 切换导航
    this.tab = tab;
    this.body.fuzzy.keyword = '';

    // tab切换后有导航
    if (this.isCureentTab(this.navOption?.tabIndex)) {
      this.navState += '2t';
    } else {
      this.navState += '2f';
    }

    // 是否显示导航
    this.event.emit('TAB_CLICK', this.isCureentTab(this.navOption?.tabIndex));

    // 备份公共table选项
    if (!this.optionsBak) {
      this.optionsBak = _.cloneDeep(this.options);
    }
    // 合并标签配置到表格配置，合并到新的对象{}，防止选项污染
    this.options = objectExtend({}, this.optionsBak, tab);
    this.idKey = this.options.idKey;

    // 切换回第一页，切换了分页会触发查询，不用执行query
    if (this.pageIndex !== 1) {
      this.pageIndex = 1;
    } else {
      this.query({pageIndex: 1});
    }

    // 过滤得到可以搜索的字段列表，设置了search并且是当前标签的
    this.searchFields = this.options.view.columns.filter((d: any) => d.search && this.isCureentTab(d.tabIndex));
  }

  // 是否当前Tab的内容
  isCureentTab(index: any): boolean {
    // 没有tab直接显示
    if (!this.tabOption) {
      return true
    } else {
      const idx = this.tabOption.findIndex((d: any) => d.title === this.tab.title);

      // 没配、配了一个、配了多个
      if (_.isArray(index)) {
        return index.includes(idx);
      } else {
        return index === undefined || index === idx;
      }
    }
  }

  // 切换状态
  switch(state: boolean, data: any, column: any): void {
    // 更新当前操作的数据
    this.data = data;

    // 切换状态为true时调用enable接口，反之disable接口
    const action = state ? column.switch.enable : column.switch.disable;
    let body = action.body;

    // 合并用户配置的参数
    if (body) {
      body = __eval.call(this, body)
    }

    this.http.post(action.api, body,
      {parseReq: action.parseReq, parseRes: action.parseRes, successMsg: action.successMsg}
    ).subscribe((res: any) => {
      if (res) {
        this.data[column.key] = state ? column.switch.on : column.switch.off;
      }
    });
  }

  // switch是否只读
  isTrue(value: boolean | string, data: any): boolean {
    if (_.isString(value)) {
      const payload = this.token.getPayload()
      return _eval(value)({...data, user: payload});
    } else {
      return value;
    }
  }

  // 格式化显示颜色
  formatColor(data: any, color: string): any {
    // 动态颜色获取
    if (color.startsWith('d=>')) {
      color = _eval(color)(data);
    }

    return 'ant-' + color
  }

  // 格式化确认提示内容
  formatConfirm(confirm: string): any {
    if (confirm.startsWith('d=>')) {
      confirm = _eval(confirm)({total: this.total});
    }

    return confirm;
  }

  // 格式化数据显示
  formatData(data: any, column: any): any {
    let res = '';
    const cformat = column.format

    // 需要格式化
    if (cformat) {
      // 使用自定义方法格式数据
      if (cformat.startsWith('d=>')) {
        res = _eval(cformat)(data);
      } else {
        // 使用内置管道格式化
        try {
          switch (cformat) {
            case 'datetime':
              data = data.replace('T', ' ').substr(0, 19);
              res = format(new Date(data), 'yyyy-MM-dd HH:mm:ss');
              break;
            default:
          }
        } catch (_) {
          // 捕获数据异常
        }
      }
    } else {
      // 超长数据省略显示
      const maxChar = column.ellipsis

      if (data && data.toString().length > maxChar) {
        res = data.toString().substring(0, maxChar);
      } else {
        res = data;
      }
    }

    return res;
  }

  // 表格扩展按钮点击事件
  actionClick(action: any, data?: any): void {
    // 克隆选项，防止动态参数只能赋值一次
    const option = _.cloneDeep(action.click);
    // 表格列操作时，记录当前操作数据
    if (data) {
      this.data = data;
    }

    // 自定义页面
    if (option.component) {
      this.modal.create({
        nzWrapClassName: ['nc', ...location.pathname.split('/'), action.icon].filter(d => !!d).join('-'),
        nzWidth: option.width || 720,
        nzStyle: {top: '12px'},
        nzBodyStyle: {padding: '0'},
        nzContent: NcModalComponents[option.component],
        nzComponentParams: {parent: data, apis: option.apis},
        nzClosable: false,
        nzMaskClosable: true,
        nzFooter: null
      });
    }
    // 表格弹窗
    else if (option.table) {
      const view = option.table.view;
      // 不能重载页面
      view.reload = false;

      // 合并用户配置的参数
      if (view.body) {
        view.body = __eval.call(this, view.body);
      }

      // 合并tab页的参数
      if (option.tabs) {
        option.tabs.forEach((tab: any) => {
          if (tab.view?.body) {
            tab.view.body = __eval.call(this, tab.view.body);
          }
        });
      }

      this.modal.create({
        nzWrapClassName: ['nc', ...location.pathname.split('/'), action.icon].filter(d => !!d).join('-'),
        nzWidth: view.width,
        nzStyle: {top: '12px'},
        nzBodyStyle: {padding: '0'},
        nzContent: NcTableComponent,
        nzComponentParams: {options: option.table, tabOption: option.tabs},
        nzClosable: false,
        nzMaskClosable: true,
        nzFooter: null
      });
      // 仅调用接口
    } else if (option.api) {
      // 转换用户参数
      const body = option.body ? __eval.call(this, option.body) : {};
      if (option.api === this.options.view.api) {
        // 筛选表格数据
        Object.assign(this.body, body);

        if (this.pageIndex !== 1) {
          this.pageIndex = 1;
        } else {
          this.query({pageIndex: 1});
        }
      } else {
        // 需要提交查询参数
        if (option.params) {
          objectExtend(body, this.params);
        }

        // 选择数据后点击时，需要提交数据主键集合
        if (option.checkToClick) {
          objectExtend(body, {ids: this.getCheckedKeys()});
        }

        this.loading = option.refresh || !!data;

        // 下载
        if (option.method === 'download') {
          this.http.download(option.api, body, option.blob);
          this.loading = false;
        } else {
          // 调用接口后需要刷新时重新查询数据
          this.http.post(option.api, body,
            {parseReq: option.parseReq, parseRes: option.parseRes, successMsg: option.successMsg}
          ).subscribe((res: any) => {
              if (res && option.refresh) {
                this.query();
              } else {
                // 接口异常时停止加载状态
                this.loading = false
                // 表格列操作时，合并操作后的数据
                if (data) {
                  objectExtend(this.data, res.data);
                }
              }
            }, // 接口错误时停止加载状态
            () => this.loading = false
          );
        }
      }
    }
  }

  // 拖放
  drop(event: CdkDragDrop<string[]>): void {
    if (this.options.dragable) {
      moveItemInArray(this.datas, event.previousIndex, event.currentIndex);
    }
  }

  // 拖拽排序
  sort() {
    // 切换拖拽状态
    this.options.dragable = !this.options.dragable;
    const body = {ids: _.map(this.datas, this.idKey)};

    // 排序结束时保存排序
    if (!this.options.dragable) {
      this.http.post(this.options.dragSort.api, body,
        {parseReq:this.options.dragSort.parseReq, parseRes:this.options.dragSort.parseRes,successMsg:this.options.dragSort.successMsg}).subscribe();
    }
  }

  // 选择时间范围
  timeChange(event: any): void {
    // 处理时间后查询数据
    if (event && event.length === 2) {
      this.body.range.time = [
        format(event[0], 'yyyy-MM-dd HH:mm:ss'),
        format(event[1], 'yyyy-MM-dd HH:mm:ss')
      ]
    } else {
      this.body.range.time = [];
    }
    this.query();
  }

  // 更新已选ID集合
  updateCheckedSet(data: any, checked: boolean): void {
    // 选择且没被选择时add
    if (checked && !this.isChecked(data)) {
      // 不是多选时清除已选
      if (!this.options.view.multiple) {
        this.checkedData.clear();
      }
      this.checkedData.add(data);
    } else {
      // 删除所有id相同的
      this.checkedData.forEach((d: any) => {
        if (d[this.idKey] === data[this.idKey]) {
          this.checkedData.delete(d);
        }
      });
    }
  }

  // 选择/反选
  onItemChecked(data: any, checked: boolean): void {
    this.updateCheckedSet(data, checked);
    this.refreshCheckedStatus();
  }

  // 全选
  onAllChecked(value: boolean): void {
    this.pageDatas.forEach((item: any) => this.updateCheckedSet(item, value));
    this.refreshCheckedStatus();
  }

  // 当前页面展示数据改变
  onCurrentPageDataChange($event: any): void {
    this.pageDatas = $event;
    this.refreshCheckedStatus();
  }

  // 刷新选择状态
  refreshCheckedStatus(): void {
    this.allChecked = this.pageDatas.every((item: any) => this.isChecked(item));
    this.indeterminate = this.pageDatas.some((item: any) => this.isChecked(item)) && !this.allChecked;
  }

  // 是否已选择
  isChecked(data: any): boolean {
    return Array.from(this.checkedData).some((item: any) => item[this.idKey] === data[this.idKey]);
  }

  // 获取已选数据的主键集合
  getCheckedKeys(): string[] {
    return _.zipWith(_.toArray(this.checkedData), (d: any) => d[this.idKey]);
  }

  // 手动上传
  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = [file];
    return false;
  };

  // 上传
  upload(option: any, data?: any, key?: any): void {
    const formData = new FormData();
    this.fileList.forEach((file: any) => {
      formData.append('file', file);
    });

    // 合并用户配置的参数
    if (option.body) {
      this.data = data;
      _.forEach(__eval.call(this, option.body), (val: any, key: string) => {
        formData.append(key, val);
      })
    }

    this.uploading = true;
    this.http.post(option.api, formData).subscribe(
      (res: any) => {
        if (res) {
          this.uploading = false;
          this.fileList = [];
          // 上传完成后刷新
          this.query();
        }
      }, () => this.uploading = false, () => this.uploading = false
    );
  }

  // 下载
  download(action: any, data: any): void {
    this.http.download(action.api, data, action.blob, action.filename, action.parseReq);
  }

  // ngFor性能优化
  trackByIndex(index: number): any {
    return index;
  };

  // 重新加载页面
  reloadPage(): void {
    this.event.emit('RELOAD_PAGE');
  }
}
