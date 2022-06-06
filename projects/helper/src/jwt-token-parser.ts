import {urlBase64Decode} from './base64';

function invalidJwt(): void {
  location.href = '/auth/login';
  throw new Error('无效的JWT');
}

// 解码JWT Token Paylod
export function decodeJwtPayload(token: string): any {
  if (token.length === 0) {
    invalidJwt();
  }

  const parts = token.split('.');
  // jwt 由三部分组成
  if (parts.length !== 3) {
    invalidJwt();
  }

  let payload;
  // 解析中间部分的内容
  try {
    payload = urlBase64Decode(parts[1]);
  } catch (e) {
    invalidJwt();
  }

  if (!payload) {
    invalidJwt();
  } else {
    return JSON.parse(payload);
  }
}

// 验证是否是有效的JWT Token
export function isValidJwtToken(token: string): boolean {
  if (token.length === 0) {
    return false;
  }

  // token过期时间
  const date = new Date(0);
  const payload = decodeJwtPayload(token);

  if (payload) {
    // JWT时间精确到秒
    date.setUTCSeconds(payload.hasOwnProperty('exp') ? payload.exp : Number.MAX_SAFE_INTEGER);
  }

  // 处理服务器和客户端时间差问题
  const now = new Date();
  now.setUTCMilliseconds(parseInt(localStorage.getItem('td') || '0'));

  // 当前时间小于过期时间，则token有效
  return now < date;
}
