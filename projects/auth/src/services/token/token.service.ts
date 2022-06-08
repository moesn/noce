import {Injectable} from '@angular/core';

import {NcTokenStorage} from './token-storage';
import {decodeJwtPayload} from 'noce/helper';

// 导出token
export let NcToken: NcTokenService;

@Injectable()
export class NcTokenService {
  constructor(private tokenStorage: NcTokenStorage) {
    if (!NcToken) {
      NcToken = this;
    }
  }

  // 设置Token
  set(token: string, retoken: string): void {
    this.tokenStorage.setToken(token);
    this.tokenStorage.setRetoken(retoken);
  }

  // 获取Token
  getToken(): string {
    return this.tokenStorage.getToken();
  }

  // 获取Token内容
  getPayload(): any {
    return decodeJwtPayload(this.getToken());
  }

  // 获取刷新Token
  getRetoken(): string {
    return this.tokenStorage.getRetoken();
  }

  // 清空Token
  clear(): void {
    location.href = '/auth/login';
    sessionStorage.clear();
    localStorage.clear();
  }
}
