import {Injectable} from '@angular/core';
//@ts-ignore
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {NcAuthResult} from './auth-result';
import {NcTokenService} from './token/token.service';
import {HttpClient} from '@angular/common/http';
import {getValueFromObject, isValidJwtToken} from 'noce/helper';
import {getAuthOption} from 'noce/core';

@Injectable()
export class NcAuthService {
  constructor(private http: HttpClient,
              private tokenService: NcTokenService) {
  }

  // 是否认证或者可以刷新认证
  isAuthenticatedOrRefresh(): Observable<boolean> {
    const token = this.tokenService.getToken();
    const retoken = this.tokenService.getRetoken();

    // 访问token和刷新token都存在，刷新token未失效
    if (token && retoken && isValidJwtToken(retoken)) {
      // 访问token失效了
      if (!isValidJwtToken(token)) {
        // 刷新Token，刷新成功返回token是否有效，刷新失败返回false
        return this.refreshToken().pipe(switchMap((res: any) => {
            if (res.isSuccess()) {
              return of(isValidJwtToken(res.getToken()));
            } else {
              return of(false);
            }
          }),
        )
      } else {
        return of(true);
      }
    } else {
      return of(false);
    }
  }

  // 认证登录
  login(data: any): Observable<NcAuthResult> {
    return this.authAction('login', data).pipe(
      switchMap((result: NcAuthResult) => {
        return this.storeAuthResult(result);
      }),
    );
  }

  // 刷新Token
  refreshToken(): Observable<NcAuthResult> {
    const body: any = {};
    body[getAuthOption('refresh.body.accessTokenKey')] = this.tokenService.getToken();
    body[getAuthOption('refresh.body.refreshTokenKey')] = this.tokenService.getRetoken();

    return this.authAction('refresh', body).pipe(
      switchMap((result: NcAuthResult) => {
        return this.storeAuthResult(result);
      }),
    );
  }

  // 退出登录
  logout(): void {
    this.authAction('logout', null).pipe(
      switchMap((result: NcAuthResult) => {
        if (result.isSuccess()) {
          this.tokenService.clear();
        }
        return of(result);
      }),
    ).subscribe();
  }

  // 调用认证接口
  authAction(module: string, data: any): Observable<NcAuthResult> {
    const method = getAuthOption(`${module}.method`);
    const url = this.getActionPath(module);

    return this.http.request(method, url, {body: data})
      .pipe(
        map((res) => {
          return new NcAuthResult(true, res);
        }),
        catchError((res) => {
          return this.handleResponseError(res);
        }),
      );
  }

  // 获取验证码
  getVercode(): Observable<any> {
    const module = 'vercode';
    const method = getAuthOption(`${module}.method`);
    const url = this.getActionPath(module);

    return this.http.request(method, url).pipe(
      map((res: any) => {
        return getValueFromObject(res, getAuthOption('success.vercodeKey'));
      }),
      catchError(() => of()),
    );
  }

  // 获取操作接口
  private getActionPath(action: string): string {
    const actionUrl: string = getAuthOption(`${action}.url`);
    const baseUrl: string = getAuthOption('baseUrl');

    // 如果有baseUrl，则拼接上baseUrl
    return baseUrl ? baseUrl + actionUrl : actionUrl;
  }

  // 存储认证信息
  private storeAuthResult(result: NcAuthResult): Observable<NcAuthResult> {
    if (result.isSuccess()) {
      const accessToken = result.getToken()
      if (accessToken) {
        // 服务时间差处理
        const isValidToken = isValidJwtToken(accessToken);
        // 有token但token无效
        if (accessToken.length !== 0 && !isValidToken) {
          return of(new NcAuthResult(false, '客户端和服务端时间相差过大，调整后登录'));
        } else {
          this.tokenService.set(accessToken, result.getRetoken());
        }
      }
    }
    return of(result);
  }

  // 处理错误
  private handleResponseError(res: any): Observable<NcAuthResult> {
    return of(new NcAuthResult(false, res));
  }
}
