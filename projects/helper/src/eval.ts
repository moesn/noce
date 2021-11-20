import {isObject} from 'lodash-es';

// 代替eval
export const _eval = function (this: any, fn: string): Function {
  return Function('"use strict";return (' + fn + ')').call(this);
}

export const __eval = function (this: any, data: any): any {
  // 将对象转成字符串
  if (isObject(data)) {
    data = JSON.stringify(data);
  }
  // 分割字符串
  const strs = data.split('$');

  // 例：$this.data.id$ 转换成 this.data.id的值
  return JSON.parse(strs.map((d: string) => d.startsWith('this.') ? _eval.call(this, d) : d).join(''));
};
