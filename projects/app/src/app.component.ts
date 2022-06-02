import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NzMenuModeType} from 'ng-zorro-antd/menu';
import {getAppOption, getAuthOption, NcEventService, NcHttpService, NcRegExp, NcStoreService} from 'noce/core';
import {NcAuthService, NcTokenService} from 'noce/auth';
import {Router} from "@angular/router";

export const themeChangeEvents: any = [];

export const addThemeChangeListener = (ctx: any, func: string) => {
  themeChangeEvents.push({ctx, func});
};

@Component({
  selector: 'nc-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.less']
})
export class NcAppComponent implements OnInit {
  collapsible = false // 左侧菜单是否可折叠
  isCollapsed = false; // 是否收缩左侧菜单
  navs: any = []; // 顶部导航列表
  menu: any = []; // 左侧菜单列表
  logo: string; // 系统logo图标地址
  title: string; // 系统标题
  menuMode: NzMenuModeType; // 左侧菜单宽度
  menuWidth: number; // 左侧菜单宽度
  background: string; // 登录背景图片

  username = ''; // 登录用户名
  isAuthed = false; // 是否已认证，已认证才显示顶部Header
  keyword = ''; // 关键字搜索

  passwd: any = {}; // 修改密码选项
  pwding = false; // 是否修改密码中
  saving = false; // 表单是否保存中
  pwdData = {oldPwd: '', newPwd: ''}; // 修改密码表单数据
  pwdEye: any = {}; // 存储是否显示密码的状态
  pwdReg: any = NcRegExp.find((reg: any) => reg.name === '密码')!; // 密码正则校验
  isRawPwd = false; // 是否时原始密码

  constructor(private http: HttpClient,
              private authService: NcAuthService,
              private route: Router,
              private store: NcStoreService,
              private event: NcEventService,
              private ncHttp: NcHttpService,
              private token: NcTokenService) {
    this.logo = getAppOption('images.logo');
    this.title = getAppOption('title');
    this.collapsible = getAppOption('layout.collapsible');
    this.menuMode = getAppOption('layout.menuMode');
    this.menuWidth = getAppOption('layout.menuWidth');
    this.background = getAppOption('images.background');
    this.passwd = getAuthOption('passwd');

    const payload = token.getPayload()
    this.username = payload[getAuthOption('payload.usernameKey')];
    // 初始默认密码强制修改
    this.pwding = this.isRawPwd = sessionStorage.getItem('isRawPwd') === 'true';
  }

  ngOnInit(): void {
    const path = location.pathname;
    // 认证界面不需要查询导航菜单接口
    if (path !== '/' && !path.startsWith('/auth')) {
      this.isAuthed = true;

      // 有顶部导航
      if (getAppOption('layout.navApi')) {
        this.navs = this.store.getNav();

        // 导航只需要查询一次
        if (this.navs) {
          // 查询当前导航的菜单
          this.queryMenu(path.split('/')[1]);
        } else {
          this.queryNavs();
        }
      } else {
        // 查询菜单
        this.queryMenu('');
      }
    }
  }

// 展开当前导航页面的父级菜单
  menuOpen(menu: any): boolean {
    let open = false;
    menu.children.forEach((child: any) => {
      if (location.pathname.includes(child.link)) {
        open = true;
      }
    });
    return open && this.menuMode !== 'vertical';
  }

// 查询顶部导航
  queryNavs(): void {
    const api = getAppOption('layout.navApi');
    this.http.request(api.method, api.url, {body: {}})
      .subscribe((res: any) => {
          if (res) {
            this.navs = res.data;
            this.store.setNav(this.navs)
            // 查询第一个导航的菜单
            this.queryMenu(this.navs[0].link);
          }
        }
      );
  }

  // 查询左侧菜单
  queryMenu(key: string): void {
    const api = getAppOption('layout.menuApi');
    this.http.request(api.method, api.url, {body: {key}})
      .subscribe((res: any) => {
          if (res) {
            this.menu = res.data;

            // 登录时跳转到第一个页面
            if (location.pathname === '/' + getAppOption('base')) {
              const homePage = getAppOption('base') +
                (this.menu.length && this.menu[0].link ? '/' + this.menu[0].link : '') +
                (this.menu.children && this.menu.children.length && this.menu.children[0].link ? '/' + this.menu.children[0].link : '');
              this.route.navigateByUrl(homePage).then();
            }
          }
        }
      );
  }

  // 触发搜索事件
  search(): void {
    this.event.emit('SEARCH', this.keyword);
  }

  // 修改密码
  updatePwd(): void {
    this.saving = true;
    const url = getAuthOption('baseUrl') + this.passwd.url;
    const body: any = {};

    body[this.passwd.body.oldKey] = this.pwdData.oldPwd;
    body[this.passwd.body.newKey] = this.pwdData.newPwd;
    body[this.passwd.body.idKey] = this.token.getPayload()[getAuthOption('payload.userIdKey')];

    this.ncHttp.post(url, body, undefined, [this.passwd.body.oldKey, this.passwd.body.newKey]).subscribe({
      next: (res: any) => {
        // 密码修改成功后需退出重新登录
        if (res) {
          this.logout();
        }
      },
      error: () => this.saving = false,
      complete: () => this.saving = false
    });
  }

  // 触发退出事件
  logout(): void {
    this.authService.logout();
  }
}
