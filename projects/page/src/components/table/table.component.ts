import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {NcEventService, NcHttpService} from 'noce/core';
import {__eval, _eval, objectExtend} from 'noce/helper';
import * as _ from 'lodash-es';
import {reject} from 'lodash-es';
import {NzDrawerRef, NzDrawerService} from 'ng-zorro-antd/drawer';
import {NcFormComponent} from '..';
import {differenceInCalendarDays, format} from 'date-fns';

@Component({
  selector: 'nc-table',
  templateUrl: 'table.component.html',
  styleUrls: ['table.component.less']
})
export class NcTableComponent implements OnInit, OnDestroy {
  @Input() options: any; // 表格选项
  @Input() navOption: any; // 导航选项
  @Input() tabOption: any; //  标签选项

  optionsBak: any; // 备份表格选项
  drawerRef: NzDrawerRef | undefined; // 表单弹窗实例
  navClickEvent: any; // 导航点击事件
  nav: any; // 导航选中项的数据

  tab: any; // 当前标签
  data: any = {}; // 当前操作的数据
  datas: any[] = []; // 表格数据
  searchFields: any = []; // 可搜索的字段

  body: any = { // 传到服务端端查询参数
    range: {}, // 按时间范围过滤
    exact: {}, // 精确查询
    fuzzy: {field: [], keyword: ''} // 模糊搜索, 搜索的字段和关键字
  };

  key: string = ''; // 数据主键
  height: string = ''; // 表格内容区域高度

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

  constructor(private drawer: NzDrawerService,
              private http: NcHttpService,
              private event: NcEventService) {
    const content: any = document.getElementsByTagName('nz-content')[0];
    this.height = content.offsetHeight - 150 + 'px';
  }

  ngOnInit(): void {
    this.key = this.options.key;

    // 初始选中第一个标签
    if (this.tabOption) {
      this.switchTab(this.tabOption[0]);
    } else {
      // 过滤得到可以搜索的字段列表，设置了search并且是当前标签的
      this.searchFields = this.options.view.columns.filter((d: any) => d.search && this.isCureentTab(d.tabIndex));
    }

    // 订阅导航点击事件
    this.navClickEvent = this.event.on('NAV_CLICK').subscribe(res => {
      // 记录导航项的数据，供自定义操作使用
      this.nav = res;
      // 关联的值
      const mappingValue = res[this.navOption.key];
      // 点击导航时设置关联参数，返回全部时删除关联参数
      if (mappingValue) {
        this.body.exact[this.navOption.mappingKey] = mappingValue;
      } else {
        delete this.body.exact[this.navOption.mappingKey];
      }

      // 切换回第一页，切换了分页会触发查询，不用执行query
      if (this.pageIndex !== 1) {
        this.pageIndex = 1;
      } else {
        this.query({pageIndex: 1});
      }
    })
  }

  ngOnDestroy(): void {
    // 取消订阅导航点击事件
    this.navClickEvent.unsubscribe();
  }

  // 查询表格数据
  query(params?: any): void {
    // 清空数据
    this.data = {};
    this.datas = [];
    this.loading = true;

    // 查询参数
    let body = {};
    // 记录分页、过滤、排序等表格查询参数
    objectExtend(this.body, params);

    // 没有分页参数页不查询
    if (!this.body.pageIndex || !this.body.pageSize) {
      return;
    }

    // 如果有导航，但没有关联导航，则阻止表格自动查询
    if (this.navOption && this.navOption.selected && !this.body.exact[this.navOption.mappingKey]) {
      return;
    }

    // 合并用户配置的参数
    if (this.options.view.body) {
      objectExtend(this.body, __eval.call(this, this.options.view.body));
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

    // 前端分页时删除分页参数
    if (this.options.view.frontPagination) {
      objectExtend(body, {pageIndex: null, pageSize: null});
    }

    this.http.query(this.options.view.api, body).subscribe(
      res => {
        if (res) {
          // 有些接口没有数据返回的是null
          this.datas = res.data || [];
          this.total = res.total;

          const parse = this.options.view.parseData;
          // 如果需要解析表格数据
          if (parse) {
            this.datas.forEach(data => _eval(parse)(data));
          }

          // 表格作为弹窗时反选上已选数据
          this.datas.forEach((d: any) => {
            // 单选时非数组，转成数组
            if (!_.isArray(this.checkedKeys)) {
              this.checkedKeys = [this.checkedKeys];
            }
            // 主键包含在数组里的反选上
            if (this.checkedKeys.includes(d[this.key])) {
              this.checkedData.add(d);
            }
          });

          this.refreshCheckedStatus();
        }
      },
      () => this.loading = false,
      () => this.loading = false
    );
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
      // 配置了宽度使用宽度，没有配置则使用列数乘以最小宽度360
      nzWidth: formOne.width || formOne.cols * 360,
      nzContent: NcFormComponent,
      nzContentParams: {
        options: this.options.form,
        key: this.options.key,
        action: update ? this.options.update : this.options.create,
        data: this.data
      },
      nzClosable: false,
      nzKeyboard: false,
      nzMaskClosable: false,
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
        if (this.navOption) {
          this.query({});
        } else {
          // 编辑前的数据有主键时是修改操作
          if (this.data[this.key]) {
            // 查找替换修改数据
            objectExtend(_.find(this.datas, d => d[this.key] === this.data[this.key]), res);
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

    this.http.delete(action.api, body).subscribe((res: any) => {
      if (res) {
        // 表格数据删除一条
        this.datas = reject(this.datas, (d: any) => d[this.options.key] === data[this.options.key]);
        // 总条数减1
        this.total -= 1;
      }
    });
  }

  // 多标签时切换标签事件
  switchTab(tab: any): void {
    this.tab = tab;
    // 是否显示导航
    this.event.emit('TAB_CLICK', this.isCureentTab(this.navOption.tabIndex));

    // 备份公共table选项
    if (!this.optionsBak) {
      this.optionsBak = _.cloneDeep(this.options);
    }
    // 合并标签配置到表格配置，合并到新的对象{}，防止选项污染
    this.options = objectExtend({}, this.optionsBak, tab);

    // 切换回第一页，切换了分页会触发查询，不用执行query
    this.pageIndex = 1;

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

    this.http.delete(action.api, body, true).subscribe();
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
              res = format(data, 'yyyy-MM-dd HH:mm:ss');
              break;
            default:
          }
        } catch (_) {
          // 捕获数据异常
        }
      }
      // 直接返回
    } else {
      return data;
    }

    return res;
  }

  // 表格扩展按钮点击事件
  actionClick(click: any): void {
    // 仅调用接口
    if (click.api) {
      const body = __eval.call(this, click.body);
      this.http.post(click.api, body).subscribe();
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
    // 排序结束时保存排序
    if (!this.options.dragable) {
      this.http.post(this.options.dragSort.api, _.map(this.datas, this.key)).subscribe();
    }
  }

  // 选择时间范围
  timeChange(event: any): void {
    // 处理时间后查询数据
    if (event && event.length === 2) {
      this.body.range[this.options.timeKey] = [
        format(event[0], 'yyyy-MM-dd HH:mm'),
        format(event[1], 'yyyy-MM-dd HH:mm')
      ]
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
        if (d[this.key] === data[this.key]) {
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
    return Array.from(this.checkedData).some((item: any) => item[this.key] === data[this.key]);
  }

  // 重新加载页面
  reloadPage(): void {
    this.event.emit('RELOAD_PAGE');
  }
}
