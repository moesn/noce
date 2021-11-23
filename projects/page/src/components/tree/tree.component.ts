import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NzDrawerRef} from 'ng-zorro-antd/drawer';
import {NzTreeComponent} from 'ng-zorro-antd/tree';
import {NcHttpService} from 'noce/core';

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

  constructor(private http: NcHttpService) {
  }

  ngOnInit(): void {
    console.log(this.option)
    this.query();
  }

  query(): void {
    // this.http.post(this.api.query, this.treeSchema?.body || {}).subscribe(res => {
    //   if (res) {
    //     // 有组时，默认选中第一个组并查询表格数据
    //     if (_.isArray(res.data) && res.data.length) {
    //       if (this.treeSchema?.remove) {
    //         res.data = reject(res.data, this.treeSchema?.remove);
    //       }
    //       // @ts-ignore
    //       this.datas = JSON.parse(nm.replaceAll(JSON.stringify(res.data),
    //         `"${this.treeSchema?.primarykey || 'id'}":`, '"key":',
    //         `"${this.treeSchema?.primaryname || 'name'}":`, '"title":',
    //       ));
    //       this.click(this.datas[0]);
    //     }
    //   }
    // });
  }

  click(node: any): void {
    // 设置组，选中状态，触发查询
    this.keys = [node.key];
    // this.treeClick.emit([node.key, node.title]);
  }

  getTreeNode(): any {
    // 返回当前树节点
    return this.dataTree.getTreeNodeByKey(this.keys[0]);
  }

  // 编辑，child是否增加子节点/兄弟节点
  edit(update: boolean, root?: boolean): void {
    // const node = this.getTreeNode();
    // // 树数据转换成表单数据
    // if (update) {
    //   this.formData = _.cloneDeep(node.origin);
    //   this.formData[this.treeSchema?.primarykey || 'id'] = node.origin.key;
    //   this.formData[this.treeSchema?.primaryname || 'name'] = node.origin.title;
    //   // 从上一级node查找父级key和title，默认0和根
    //   this.formData[this.treeSchema?.parentkey || 'pid'] = node.parentNode?.origin.key || this.treeSchema?.rootvalue || 0;
    //   this.formData[this.treeSchema?.parentname || 'pname'] = node.parentNode?.origin.title || '根';
    // } else {
    //   this.formData = {};
    //   if (root) {
    //     // 使用上一级的key和title，默认0和根
    //     this.formData[this.treeSchema?.parentkey || 'pid'] = this.treeSchema?.rootvalue || 0;
    //     this.formData[this.treeSchema?.parentname || 'pname'] = '根';
    //   } else {
    //     this.formData[this.treeSchema?.parentkey || 'pid'] = node.origin.key;
    //     this.formData[this.treeSchema?.parentname || 'pname'] = node.origin.title;
    //   }
    // }
    //
    // // 打开编辑窗口
    // this.drawerRef = this.drawer.create({
    //   nzWidth: (this.treeSchema?.cols || 1) * NmDrawerSize.width.small,
    //   nzContent: NmFormComponent,
    //   nzContentParams: {
    //     cols: this.treeSchema?.cols || 1,
    //     saveapi: this.formData[this.treeSchema?.primarykey || 'id'] ? this.api.update : this.api.create,
    //     formData: this.formData,
    //     formSchema: this.formSchema,
    //   },
    //   nzClosable: false,
    //   nzKeyboard: false,
    //   nzMaskClosable: false,
    // });
    //
    // this.drawerRef.afterClose.subscribe((res: any) => {
    //   if (res) {
    //     // @ts-ignore设置组的key
    //     const newNode = JSON.parse(nm.replaceAll(JSON.stringify(res),
    //       `"${this.treeSchema?.primarykey}":`, '"key":',
    //       `"${this.treeSchema?.primaryname}":`, '"title":',
    //     ));
    //
    //     // 如果是修改
    //     if (this.formData.key) {
    //       // 修改当前节点数据，和显示标题
    //       nm.objectExtend(node.origin, newNode);
    //       node.title = newNode.title;
    //     } else {
    //       // 设置为子节点
    //       newNode.isLeaf = true;
    //       // 根组
    //       if (this.formData[this.treeSchema?.parentkey || 'pid'] === (this.treeSchema?.rootvalue || 0)) {
    //         this.datas = [...this.datas, newNode];
    //       } else {
    //         // 展开节点并插入节点
    //         node.isLeaf = false;
    //         node.setExpanded(true);
    //         node.addChildren([newNode]);
    //       }
    //       // 切换树节点并查询表格数据
    //       this.click(newNode);
    //     }
    //   }
    // });
  }

  // 删除节点
  delete(): void {
    // const node = this.getTreeNode();
    // this.http.delete(this.api.delete, {ids: this.keys}).subscribe(res => {
    //   if (res) {
    //     const parentNode = node.parentNode;
    //     if (parentNode) {
    //       // 最后一个子节点删除时，更新父节点
    //       if (parentNode.getChildren().length === 1) {
    //         parentNode.isLeaf = true;
    //         parentNode.origin.isLeaf = true;
    //       }
    //       // 默认父组并查询表格数据
    //       this.click(parentNode.origin);
    //       // 清除当前节点(非根节点)
    //       node.remove();
    //     } else {
    //       // 删除根组时默认第一组
    //       this.click(this.datas[0]);
    //       // 清除根节点
    //       this.datas = _.reject(this.datas, (d: any) => d.key === node.key);
    //     }
    //   }
    // });
  }
}
