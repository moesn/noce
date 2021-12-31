// URL Base64解码
export function urlBase64Decode(str: string): string {
  let output = str.replace(/-/g, '+').replace(/_/g, '/');
  switch (output.length % 4) {
    case 0: {
      break;
    }
    case 2: {
      output += '===';
      break;
    }
    case 3: {
      output += '=';
      break;
    }
    default: {
      throw new Error('错误的Base64 URL字符串');
    }
  }
  return b64DecodeUnicode(output);
}

// Base64 解码后转Unicode
export function b64DecodeUnicode(str: any): string {
  return decodeURIComponent(Array.prototype.map.call(b64decode(str), (c: any) => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}

// Base64解码
export function b64decode(str: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '';

  str = String(str).replace(/=+$/, '');

  if (str.length % 4 === 1) {
    throw new Error('错误的Base64字符串');
  }

  for (let bc = 0, bs: any, buffer: any, idx = 0;
       buffer = str.charAt(idx++);
       ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer, bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
  ) {
    buffer = chars.indexOf(buffer);
  }
  return output;
}
