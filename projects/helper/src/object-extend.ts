// {}对象深扩展
// @ts-ignore
export const objectExtend = function(...objects: any[]): any {
  // 没有参数或第一个参数不是object
  if (arguments.length === 0 || typeof arguments[0] !== 'object') {
    return false;
    // 一个参数
  } else if (arguments.length === 1) {
    return arguments[0];
  }

  const target = arguments[0];  // 目标对象
  const args = Array.prototype.slice.call(arguments, 1);  // 扩展对象列表

  let src; // 原值
  let val; // 新值

  args.forEach(function(obj: any): void {
    // 不是{}
    if (typeof obj !== 'object' || Array.isArray(obj)) {
      return;
    }

    Object.keys(obj).forEach(function(key): void {
      src = target[key];
      val = obj[key];

      if (val === target) {
        return;
        // 不是对象直接赋值
      } else if (typeof val !== 'object' || val === null) {
        target[key] = val;
        return;
        // 深克隆数组
      } else if (Array.isArray(val)) {
        target[key] = deepCloneArray(val);
        return;
        // 日期或正则
      } else if (isSpecificValue(val)) {
        target[key] = cloneSpecificValue(val);
        return;
        // 原值不是对象或null或数组
      } else if (typeof src !== 'object' || src === null || Array.isArray(src)) {
        target[key] = objectExtend({}, val);
        return;
        // 原值和新值都是object
      } else {
        target[key] = objectExtend(src, val);
        return;
      }
    });
  });

  return target;
};

// 是否是日期或正则表达式
function isSpecificValue(val: any): boolean {
  return (
    val instanceof Date
    || val instanceof RegExp
  ) ? true : false;
}

// 克隆日期或正则
function cloneSpecificValue(val: any): any {
  if (val instanceof Date) {
    return new Date(val.getTime());
  } else if (val instanceof RegExp) {
    return new RegExp(val);
  } else {
    throw new Error('错误的日期或正则');
  }
}

// 数组深克隆
function deepCloneArray(arr: any[]): any {
  const clone: any[] = [];
  arr.forEach(function(item: any, index: any): void {
    if (typeof item === 'object' && item !== null) {
      if (Array.isArray(item)) {
        clone[index] = deepCloneArray(item);
      } else if (isSpecificValue(item)) {
        clone[index] = cloneSpecificValue(item);
      } else {
        clone[index] = objectExtend({}, item);
      }
    } else {
      clone[index] = item;
    }
  });

  return clone;
}
