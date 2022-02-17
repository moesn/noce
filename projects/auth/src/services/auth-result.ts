import {getValueFromObject} from 'noce/helper';
import {getAuthOption} from 'noce/core';

export class NcAuthResult {
  private readonly token: string = '';
  private readonly retoken: string = '';
  private readonly redirect: string = '';
  private readonly message: string = '';

  constructor(private success: boolean,
              private response: any) {
    if (success) {
      this.token = getValueFromObject(response, getAuthOption('success.accessTokenKey'));
      this.retoken = getValueFromObject(response, getAuthOption('success.refreshTokenKey'));
      this.redirect = getValueFromObject(response, getAuthOption('success.redirectKey'));
      this.message = getValueFromObject(response, 'msg');
    } else {
      this.message = '请联系管理员，' + (response.error?.msg || response.statusText || response.error || response.message || response.name || response.status)
    }
  }

  getResponse(): any {
    return this.response;
  }

  getToken(): string {
    return this.token;
  }

  getRetoken(): string {
    return this.retoken;
  }

  getRedirect(): string {
    return this.redirect;
  }

  getMessage(): string {
    return this.message;
  }

  isSuccess(): boolean {
    return this.success;
  }

  isFailure(): boolean {
    return !this.success;
  }
}
