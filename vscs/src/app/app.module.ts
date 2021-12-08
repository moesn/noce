import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NcAppModule, NcCustomComponents} from 'noce/app';
import {ProbeComponent} from './probe/probe.component';
import {FormsModule} from '@angular/forms';
import {NzCardModule} from 'ng-zorro-antd/card';
import {CommonModule} from '@angular/common';
import {SettingComponent} from './setting/setting.component';
import {AboutComponent} from './about/about.component';
import {NzDescriptionsModule} from 'ng-zorro-antd/descriptions';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzSpaceModule} from 'ng-zorro-antd/space';
import {NzStatisticModule} from 'ng-zorro-antd/statistic';
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {NzFormModule} from 'ng-zorro-antd/form';
import { NzTableModule } from 'ng-zorro-antd/table';

const NG_MODULES = [
  CommonModule,
  FormsModule,
];

const NZ_MODULES = [
  NzCardModule,
  NzTableModule,
  NzFormModule,
  NzDescriptionsModule,
  NzSpaceModule,
  NzStatisticModule,
  NzDividerModule,
  NzIconModule,
];

NcCustomComponents.push(...[
  {
    path: 'probe',
    component: ProbeComponent
  },
  {
    path: 'setting',
    component: SettingComponent
  },
  {
    path: 'about',
    component: AboutComponent
  }
])

@NgModule({
  declarations: [
    AppComponent,
    ProbeComponent,
    SettingComponent,
    AboutComponent
  ],
  imports: [
    ...NG_MODULES,
    ...NZ_MODULES,
    NcAppModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
