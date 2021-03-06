import {NgModule} from '@angular/core';
import {NcAppComponent} from './app.component';
import {BrowserModule} from '@angular/platform-browser';
import {NcAppRoutingModule} from './app-routing.module';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NcAuthJWTInterceptor, NcAuthModule} from 'noce/auth';
import {NcCoreModule} from 'noce/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NZ_I18N, zh_CN} from 'ng-zorro-antd/i18n';
import zh from '@angular/common/locales/zh';
import {registerLocaleData} from '@angular/common';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NZ_CONFIG, NzConfig} from 'ng-zorro-antd/core/config';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {FormsModule} from '@angular/forms';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzFormModule} from 'ng-zorro-antd/form';

registerLocaleData(zh);

export const ncNzConfig: NzConfig = {
  message: {
    nzTop: 60
  },
  notification: {
    nzBottom: 0,
    nzPlacement: 'bottomLeft'
  },
  table: {
    nzSize: 'small',
    nzBordered: false,
    nzShowQuickJumper: true,
    nzShowSizeChanger: true,
    nzSimple: false,
    nzHideOnSinglePage: false,
  },
  card: {
    nzSize: 'small',
    nzBorderless: true,
    nzHoverable: true,
  },
  drawer: {
    nzMaskClosable: true,
  },
  modal: {
    nzMaskClosable: true,
  }
};

const NG_MODULES = [
  BrowserModule,
  BrowserAnimationsModule,
  HttpClientModule,
  FormsModule,
];

const NZ_MODULES = [
  NzLayoutModule,
  NzMenuModule,
  NzIconModule,
  NzDropDownModule,
  NzButtonModule,
  NzInputModule,
  NzModalModule,
  NzFormModule,
];

@NgModule({
  declarations: [NcAppComponent],
  imports: [
    ...NG_MODULES,
    ...NZ_MODULES,
    NcCoreModule,
    NcAuthModule,
    NcAppRoutingModule
  ],
  providers: [
    {provide: NZ_CONFIG, useValue: ncNzConfig},
    {provide: NZ_I18N, useValue: zh_CN},
    {provide: HTTP_INTERCEPTORS, useClass: NcAuthJWTInterceptor, multi: true},
  ]
})
export class NcAppModule {
}
