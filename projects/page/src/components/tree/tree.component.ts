import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NzDrawerRef, NzDrawerService} from 'ng-zorro-antd/drawer';
import {NzTreeComponent} from 'ng-zorro-antd/tree';
import {NcEventService, NcHttpService} from 'noce/core';
import * as _ from 'lodash-es';
import {__eval, arrayToTree, objectExtend} from 'noce/helper';
import {NcFormComponent} from '..';

@Component({
  selector: 'nc-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.less']
})
export class NcTreeComponent implements OnInit {
  @ViewChild('treeComponent', {static: false}) dataTree!: NzTreeComponent;
  @Input() option: any; // 树选项

  drawerRef: NzDrawerRef | undefined; // 表单弹窗实例

  data: any; // 当前操作的数据
  datas: any[] = []; // 树数据
  keys: any[] = []; // 选中的对象key

  constructor(private drawer: NzDrawerService,
              private http: NcHttpService,
              private event: NcEventService) {
  }

  ngOnInit(): void {
    this.query();
  }

  // 查询树数据
  query(): void {
    this.http.post(this.option.api, {}).subscribe(res => {
      if (res) {
        // 有组时，默认选中第一个组并查询表格数据
        if (_.isArray(res.data) && res.data.length) {
          const {key, parentKey, titleKey, rootValue} = this.option;
          // 将数组转换成树型
          this.datas = arrayToTree(res.data, {key, parentKey, titleKey, rootValue});
          // 默认自动点击第一个节点
          this.click(this.datas[0]);
        }
      }
    });
  }

  // 点击树节点
  click(node: any): void {
    // 设置组，选中状态，触发查询
    this.keys = [node.key];
    // 树主键在表格的映射键
    const {mappingKey} = this.option;
    // 发出点击事件
    this.event.emit('NAV_CLICK', {mappingKey, ...node});
  }

  // 获取当前树节点
  getTreeNode(): any {
    return this.dataTree.getTreeNodeByKey(this.keys[0]);
  }

  // 新增或修改树节点
  edit(update: boolean, root?: boolean): void {
    const node = this.getTreeNode();
    const {key, titleKey, parentKey, rootValue} = this.option;
    const parentTitle = '$' + titleKey;

    // 修改时树数据转换成表单数据
    if (update) {
      this.data = _.cloneDeep(node.origin);
      this.data[key] = node.origin.key;
      this.data[titleKey] = node.origin.title;

      // 从上一级node查找父级key和title，默认0和根
      this.data[parentKey] = node.parentNode?.origin.key || rootValue;
    } else {
      // 新增节点数据
      this.data = {};
      // 增加一级节点
      if (root) {
        this.data[parentKey] = rootValue;
        // 增加子节点
      } else {
        this.data[parentKey] = node.origin.key;
        this.data[parentTitle] = node.origin.title;
      }
    }

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
        // 设置UI组件使用的字段
        res.key = res.value = res[key];
        res.title = res[titleKey];

        // 修改
        if (this.data.key) {
          // 修改当前节点数据，和显示标题
          objectExtend(node.origin, res);
          node.title = res.title;
          // 新增
        } else {
          // 设置为子节点
          res.isLeaf = true;
          // 一级节点
          if (this.data[parentKey] === rootValue) {
            this.datas = [...this.datas, res];
          } else {
            // 展开节点并插入节点
            node.isLeaf = false;
            node.setExpanded(true);
            node.addChildren([res]);
          }
          // 切换树节点并查询表格数据
          this.click(res);
        }
      }
    });
  }

  // 删除节点
  delete(): void {
    const node = this.getTreeNode();
    // 更新当前操作的数据
    this.data = node.origin;

    const body = {};
    const action = this.option.delete;

    // 合并用户配置的参数
    if (action.body) {
      objectExtend(body, __eval.call(this, action.body))
    }

    this.http.delete(action.api, body).subscribe(res => {
      if (res) {
        const parentNode = node.parentNode;
        if (parentNode) {
          // 最后一个子节点删除时，更新父节点
          if (parentNode.getChildren().length === 1) {
            parentNode.isLeaf = true;
            parentNode.origin.isLeaf = true;
          }
          // 默认父组并查询表格数据
          this.click(parentNode.origin);
          // 清除当前节点(非根节点)
          node.remove();
        } else {
          // 删除根组时默认第一组
          this.click(this.datas[0]);
          // 清除根节点
          this.datas = _.reject(this.datas, (d: any) => d.key === node.key);
        }
      }
    });
  }
}
