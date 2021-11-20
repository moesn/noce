import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {NcAuthService} from '../auth.service';
import {catchError, map, switchMap} from 'rxjs/operators';
import {NcTokenService} from '../token/token.service';
import {format} from 'date-fns';
import {getAuthOption} from 'noce/core';

@Injectable()
export class NcAuthJWTInterceptor implements HttpInterceptor {

  constructor(private authService: NcAuthService,
              private tokenService: NcTokenService) {
  }

  // 是否是不需要拦截的URL，比如登录接口、刷新Token接口
  private isIgnoreUrl(url: string): boolean {
    const base = getAuthOption('baseUrl');
    const login = getAuthOption('login.url');
    const refresh = getAuthOption('refresh.url');
    const vercode = getAuthOption('vercode.url');

    const ignores: string[] = getAuthOption('interceptor.ignoreUrls');

    ignores.push(base + login);
    ignores.push(base + refresh);
    ignores.push(base + vercode);

    return ignores.includes(url);
  }

  // 返回错误
  private responseError(msg: string): Observable<HttpEvent<any>> {
    return of(new HttpResponse({body: {code: -1, msg}}));
  }

  // 拦截器
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isIgnoreUrl(req.url)) {
      return next.handle(req);
    } else {
      return this.authService.isAuthenticatedOrRefresh().pipe(
        switchMap(authenticated => {
            // 认证Token有效
            if (authenticated) {
              const token = this.tokenService.getToken();
              const JWT = `${getAuthOption('interceptor.token.prefix')} ${token}`.trim();
              const headers: any = {};
              headers[getAuthOption('interceptor.token.key')] = JWT;

              req = req.clone({
                setHeaders: headers,
              });

              // 处理接口异常
              return next.handle(req).pipe(
                map((event: HttpEvent<any>) => {
                  // 获取下载文件名
                  if (event instanceof HttpResponse) {
                    if (event.headers.get('Content-disposition')) {
                      // 没有返回文件名时，使用日期作为文件名
                      const datetime = format(new Date(), 'yyyyMMdd_HHmmss');
                      const file = event.headers.get('Content-disposition') || `filename=${datetime}`;

                      event.body.filename = decodeURI(file.split('filename=')[1]);
                    }
                  }

                  return event;
                }), catchError((err) => {
                  const errMsg = '请联系管理员，' + err.error?.msg || err.message || err.error || err.statusText || err.name || err.status;
                  return this.responseError(errMsg);
                })
              );
              // Token无效，清除Storage
            } else {
              this.tokenService.clear();
              return this.responseError('会话超时，请重新登录');
            }
          }
        ),
      );
    }
  }
}
