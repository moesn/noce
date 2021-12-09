export function ncString() {
}

// @ts-ignore 获取字符串字节长度
String.prototype.byteLength = function (): number {
  let len = 0;
  for (let i = 0; i < this.length; i++) {
    if (this.charCodeAt(i) > 127 || this.charCodeAt(i) === 94) {
      len += 2;
    } else {
      len++;
    }
  }
  return len;
};

// @ts-ignore 获取字符串字符长度
String.prototype.charLength = function (): number {
  let len = 0;
  for (let i = 0; i < this.length; i++) {
    if (this.charCodeAt(i) > 127 || this.charCodeAt(i) === 94) {
      len += 2;
    } else {
      len += 1;
    }
  }
  return len;
};
