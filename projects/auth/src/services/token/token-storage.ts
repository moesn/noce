import {Injectable} from '@angular/core';

export abstract class NcTokenStorage {
  abstract getToken(): string;

  abstract getRetoken(): string;

  abstract setToken(token: string): void;

  abstract setRetoken(token: string): void;

  abstract clear(): void;
}

@Injectable()
export class NcTokenLocalStorage extends NcTokenStorage {
  private key = 'nc.auth.token';
  private rekey = 'nc.auth.retoken';

  constructor() {
    super();
  }

  getToken(): string {
    return localStorage.getItem(this.key) || '';
  }

  getRetoken(): string {
    return localStorage.getItem(this.rekey) || '';
  }

  setToken(token: string): void {
    localStorage.setItem(this.key, token);
  }

  setRetoken(token: string): void {
    localStorage.setItem(this.rekey, token);
  }

  clear(): void {
    localStorage.clear();
  }
}

@Injectable()
export class NcTokenSessionStorage extends NcTokenStorage {
  private key = 'nc.auth.token';
  private rekey = 'nc.auth.retoken';

  constructor() {
    super();
  }

  getToken(): string {
    return sessionStorage.getItem(this.key) || '';
  }

  getRetoken(): string {
    return sessionStorage.getItem(this.rekey) || '';
  }

  setToken(token: string): void {
    sessionStorage.setItem(this.key, token);
  }

  setRetoken(token: string): void {
    sessionStorage.setItem(this.rekey, token);
  }

  clear(): void {
    sessionStorage.clear();
  }
}
