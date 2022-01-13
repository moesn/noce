import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NzMenuModeType} from 'ng-zorro-antd/menu';
import {getAppOption, NcEventService, NcStoreService} from 'noce/core';
import {NcAuthService} from 'noce/auth';

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
  loginBg: string; // 登录背景图片

  isAuthed = false; // 是否已认证，已认证才显示顶部Header
  keyword = ''; // 关键字搜索

  constructor(private http: HttpClient,
              private authService: NcAuthService,
              private store: NcStoreService,
              private event: NcEventService) {
    this.logo = getAppOption('images.logo');
    this.title = getAppOption('title');
    this.collapsible = getAppOption('layout.collapsible');
    this.menuMode = getAppOption('layout.menuMode');
    this.menuWidth = getAppOption('layout.menuWidth');
    this.loginBg = getAppOption('images.loginBg');
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
          }
        }
      );
  }

  // 触发搜索事件
  search(): void {
    this.event.emit('SEARCH', this.keyword);
  }

  // 触发退出事件
  logout(): void {
    this.authService.logout();
  }
}
