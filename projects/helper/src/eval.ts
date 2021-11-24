import {isNumber, isObject} from 'lodash-es';

// 代替eval
export const _eval = function (this: any, fn: string): Function {
  return Function('"use strict";return (' + fn + ')').call(this);
}

// 动态数据转换，例：$this.data.id$ 转换成 this.data.id的值
export const __eval = function (this: any, data: any): any {
  // 将对象转成字符串
  if (isObject(data)) {
    data = JSON.stringify(data);
  }

  // 记录数字前面的字符串位置
  let pres: number[] = [];
  // 记录数字后面的字符串位置
  let sufs: number[] = [];

  // 分割字符串
  let strs = data.split('$');

  // 记录数字前后的字符串位置
  strs = strs.map((d: string, i: number) => {
    let str = d.startsWith('this.') ? _eval.call(this, d) : d;

    if (isNumber(str)) {
      pres.push(i - 1);
      sufs.push(i + 1);
    }

    return str;
    // 替换数字前后的字符串，去掉引号，防止数字转换成字符串
  }).map((d: string, i: number) => {
    if (pres.includes(i)) {
      d = d.toString().replace(/(.*)"/, '$1');
    } else if (sufs.includes(i)) {
      d = d.toString().replace('"', '')
    }

    return d;
  })

  return JSON.parse(strs.join(''));
};
