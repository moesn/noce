// 数组转树, 数据列表，id的key，pid的pkey，根id
export const arrayToTree =
  function (items: object[], options: { key: string, parentKey: string, titleKey: string, rootValue: string | number }): object[] {
    const {key, parentKey, titleKey, rootValue} = options;

    let res: any = null;
    const map: any = {};

    items.forEach((item: any) => {
      // 支持UI组件使用的字段
      item.key = item.value = item[key];
      item.title = item[titleKey];

      const id = item[key];
      const pid = item[parentKey];

      // 子节点
      const children = map[pid] = (map[pid] || []);

      // 初始化结果
      if (!res && pid === rootValue) {
        res = children;
      }

      children.push(item);

      item.children = map[id] || (map[id] = []);
    });

    setLeaf(res);
    return res;
  };

// 设置是否叶子节点
const setLeaf = function (res: any): void {
  res.forEach((d: any) => {
    if (d.children && d.children.length) {
      d.isLeaf = false;
      setLeaf(d.children);
    } else {
      d.isLeaf = true;
      delete d.children;
    }
  });
};
