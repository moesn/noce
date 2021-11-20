// 从多层对象中取值，name='key1.key2.key3'
export function getValueFromObject(object = {}, name: string, defaultValue?: any): any {
  const keys = name.split('.');
  // 克隆对象，防止污染
  let level = JSON.parse(JSON.stringify(object));

  keys.forEach((k) => {
    // 当前层和下一层都存在，用下一层替换当前层
    if (level && typeof level[k] !== 'undefined') {
      level = level[k];
    } else {
      level = undefined;
    }
  });

  return typeof level === 'undefined' ? defaultValue : level;
}
