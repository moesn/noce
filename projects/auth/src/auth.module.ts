import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {NcAuthService} from './services/auth.service';
import {NcTokenLocalStorage, NcTokenSessionStorage, NcTokenStorage} from './services/token/token-storage';
import {NcTokenService} from './services/token/token.service';
import {NcAuthComponent} from './components/auth.component';
import {NcLoginComponent} from './components/login/login.component';
import {NcAuthGuardSerivce} from './services/auth-guard.service';
import {NzNotificationModule} from 'ng-zorro-antd/notification';
import {NcAuthRoutingModule} from './auth-routing.module';
import {getAuthOption} from 'noce/core';

const NG_MODULES = [
  CommonModule,
  RouterModule,
  FormsModule,
];

const NZ_MODULES = [
  NzNotificationModule
];

const SERVICES = [
  NcAuthService,
  NcTokenService,
  NcAuthGuardSerivce,
];

const COMPONENTS = [
  NcAuthComponent,
  NcLoginComponent,
];

@NgModule({
  imports: [...NG_MODULES, ...NZ_MODULES, NcAuthRoutingModule],
  declarations: COMPONENTS,
  providers: [
    ...SERVICES,
    // 默认使用sessionStorage，保持登录时使用localStorage
    {provide: NcTokenStorage, useClass: getAuthOption('keepAlive') ? NcTokenLocalStorage : NcTokenSessionStorage},
  ],
})
export class NcAuthModule {
}
