import {Component, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
// @ts-ignore
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import * as _ from 'lodash-es';
import {isEqual, isPlainObject, keyBy, mapValues, omit, pickBy} from 'lodash-es';
import {NcCryptService, NcNotifyService} from '.';
import {NzModalService} from 'ng-zorro-antd/modal';
import {saveAs} from 'file-saver';
import {getAppOption} from '..';
import {_eval} from 'noce/helper';

// 发送到后台的查询参数
export interface NcQueryParams {
  limit?: number; // 查询多少条数据
  page?: number; // 查询第几页，兼容支持page的项目
  offset?: number; // 查询偏移，兼容支持offset的项目
  filter?: object; // 过滤{key:['value']}
  sort?: object; // 排序{key:'asc'}
  fuzzy?: {
    field: [],
    keyword: string
  };
  exact?: object; // {key: value}
  exclude?: object; // {key: value}
  range?: object; // {key: value}
}

@Injectable()
export class NcHttpService {
  // 返回默认http
  client = this.http;

  lastQuery = { //最近查询
    page: '',
    url: '',
    time: 0,
    bodyY: {}
  };

  constructor(private http: HttpClient,
              private crypt: NcCryptService,
              private notify: NcNotifyService,
              private modalService: NzModalService) {
  }

  // 查询页面接口
  queryApis(): Observable<any> {
    // key取路由最后一个路径
    const key = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);

    return this.http.post(getAppOption('apis.url'), {key}).pipe(
      map((res: any) => {
        if (this.isValidResponse(res)) {
          // 无效值返回false
          return res.data;
        } else {
          this.notify.error(res.msg || '操作失败');
          return false;
        }
      })
    );
  }

  // 查询数据
  query(url: string, body: any, parseReq?: string, parseRes?: string): Observable<any> {
    url = this.redirectUrl(url);

    // 假装查询，常用于前端筛选/过滤/排序等
    if (url === null) {
      return of(true)
    }

    const bodyY = this.buildBody(body);

    // 防止相同页面一秒内重复查询
    if (location.pathname === this.lastQuery.page && url === this.lastQuery.url && (new Date().getTime() - this.lastQuery.time < 1000)
      && _.isEqual(JSON.stringify(this.lastQuery.bodyY), JSON.stringify(bodyY))
    ) {
      return of(false);
    }

    // 记录最近一次查询
    this.lastQuery = {url, time: new Date().getTime(), bodyY, page: location.pathname};

    // 用户自定义数据处理
    if (parseReq) {
      _eval(parseReq)(bodyY);
    }

    // 发送post请求
    return this.http.post(url, bodyY).pipe(
      map((res: any) => {
        // 返回数据状态码code是1
        if (this.isValidResponse(res)) {
          res.total = res.total || res.count;

          // 用户自定义数据处理
          if (parseRes) {
            _eval(parseRes)(res.data);
          }

          return res;
        } else {
          this.notify.error(res.msg || '系统错误');
          return false;
        }
      })
    );
  }

  // 编辑数据
  post(url: string, body: any, options?: { parseReq?: string, parseRes: string, successMsg: string }, encrypt?: string[]): Observable<any> {
    url = this.redirectUrl(url);

    const {parseReq, parseRes, successMsg} = options || {};

    // 不能复制FormData，例如上传数据
    if (!(body instanceof FormData)) {
      // 复制数据，防止异常时表单数据变化
      body = _.cloneDeep(body);
    }

    // 加密数据
    if (encrypt) {
      encrypt.forEach(key => {
        if (body[key]) {
          body[key] = this.crypt.encrypt(body[key]);
        }
      });
    }

    // 用户自定义数据处理
    if (parseReq) {
      _eval(parseReq)(body);
    }

    // 发送post请求
    return this.http.post(url, this.buildBody(body)).pipe(
      map((res: any) => {
        if (this.isValidResponse(res)) {
          // 用户自定义数据处理
          if (parseRes) {
            _eval(parseRes)(res.data);
          }

          if (successMsg) {
            this.notify.success(successMsg);
          }
          return res;
        } else {
          this.notify.error(res.msg || '系统错误');
          return false;
        }
      })
    );
  }

  // 删除数据
  delete(url: string, body: any, parseReq?: string): any {
    url = this.redirectUrl(url);

    // 是否不需要删除确认
    const nocon = sessionStorage.getItem(url);

    // 用户自定义数据处理
    if (parseReq) {
      _eval(parseReq)(body);
    }

    if (nocon === 'true') {
      return this.post(url, body);
    } else {
      const modal = this.modalService.confirm({
        nzTitle: '警告',
        nzContent: NcConfirmComponent,
        nzComponentParams: {url},
        nzClosable: false,
        nzMaskClosable: true,
        nzOnOk: () => {
          this.post(url, body).subscribe((res: any) => modal.close(res));
          return false;
        }
      });
      return modal.afterClose;
    }
  }

  // 下载文件
  download(url: string, body?: any, blob?: boolean, filename?: string, parseReq?: string): void {
    url = this.redirectUrl(url);

    // 删除分页参数
    delete body.pageIndex;
    delete body.pageSize;

    const bodyY = this.buildBody(body);

    // 用户自定义数据处理
    if (parseReq) {
      _eval(parseReq)(bodyY);
    }

    // 直链下载
    if (url.includes('.') || url.includes('?')) {
      const filename = url.substr(url.lastIndexOf('/') + 1);
      saveAs(url, filename);
      // 请求下载流
    } else if (blob) {
      this.http.post(url, bodyY, {responseType: 'blob'}).pipe(
        map((data: any) => {
          if (data) {
            const blob = new Blob([data], {type: ''});
            saveAs(blob, filename || data.filename);
          } else {
            this.notify.error('系统错误');
          }
        })
      ).subscribe();
      // 获取直链下载
    } else {
      this.http.post(url, bodyY).pipe(
        map((res: any) => {
          if (this.isValidResponse(res)) {
            const fname = res.data.substr(res.data.lastIndexOf('/') + 1);
            saveAs(res.data, filename || fname);
          } else {
            this.notify.error(res.msg || '系统错误');
          }
        })
      ).subscribe();
    }
  }

  // 构建查询参数
  buildBody(body: any): any {
    // 需要处理的表格通用参数
    const {pageIndex, pageSize, sort, filter, fuzzy, exact, exclude, range} = body;

    // 取出除了表格通用参数外的其他自定义参数，自定义参数不需要处理
    const bodyY: NcQueryParams = omit(body, ['pageIndex', 'pageSize', 'sort', 'filter', 'fuzzy', 'exact', 'exclude', 'range']);

    // 计算查询位置
    if (pageIndex && pageSize) {
      bodyY.limit = pageSize;
      bodyY.page = pageIndex;
      bodyY.offset = pageSize * (pageIndex - 1);
    }

    // 计算排序字段
    if (this.isValidData(sort)) {
      const sortT = sort.filter((d: any) => this.isValidData(d.value));
      if (sortT.length) {
        bodyY.sort = mapValues(keyBy(sortT, 'key'), d => d.value.replace('end', ''));
      }
    }

    // 计算过滤字段
    if (this.isValidData(filter)) {
      const filterR = filter.filter((d: any) => this.isValidData(d.value));
      if (filterR.length) {
        bodyY.filter = mapValues(keyBy(filterR, 'key'), 'value');
      }
    }

    // 处理模糊查询
    if (this.isValidData(fuzzy) && this.isValidData(fuzzy.field) && this.isValidData(fuzzy.keyword)) {
      bodyY.fuzzy = fuzzy;
    }

    // 处理精确查询
    if (this.isValidData(exact)) {
      bodyY.exact = pickBy(exact, d => this.isValidData(d));
    }

    // 处理排除查询
    if (this.isValidData(exclude)) {
      bodyY.exclude = pickBy(exclude, d => this.isValidData(d));
    }

    // 处理范围查询
    if (this.isValidData(range)) {
      bodyY.range = pickBy(range, d => this.isValidData(d));
    }

    // 返回包括自定义参数和处理后的通用参数
    return bodyY;
  }

  // 判断是否是有效值
  isValidData(data: any): boolean {
    return data !== '' && data !== null && data !== undefined && !isEqual(data, {}) && !isEqual(data, []);
  }

  // 判断响应是否正确
  isValidResponse(res: any): boolean {
    // 返回数据是{}对象，并且状态码正确
    return isPlainObject(res) && (res.code === getAppOption('okCode'));
  }

  // 测试
  redirectUrl(url: string): string {
    // todo delete
    if (!location.origin.includes('10.3.0.33') && url.includes('api')) {
      if (location.origin.includes('8888')) {
        // zj
        return 'http://172.16.2.135:8888' + url;
      } else if (location.origin.includes('9999')) {
        // ld
        return 'http://10.3.2.1:9999' + url;
      }
    }

    return url
  }
}

// 删除确认弹窗
@Component({
  template: `
    <span>确认删除?</span>
    <label nz-checkbox [(ngModel)]="check" (ngModelChange)="change($event)" style="float: right">不再提示</label>
  `,
})
export class NcConfirmComponent {
  check = false;
  url = '';

  constructor() {
  }

  // 设置当前页面删除是否需要警告
  change(e: boolean): void {
    sessionStorage.setItem(this.url, e.toString());
  }
}
