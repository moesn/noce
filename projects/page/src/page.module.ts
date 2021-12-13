import {NgModule} from '@angular/core';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NcPageComponent} from './page.component';
import {NcPageRoutingModule} from './page-routing.module';
import {CommonModule} from '@angular/common';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NcFormComponent, NcListComponent, NcTableComponent, NcTreeComponent} from './components';
import {FormsModule} from '@angular/forms';
import {NzDrawerModule} from 'ng-zorro-antd/drawer';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';
import {NzInputNumberModule} from 'ng-zorro-antd/input-number';
import {NzSwitchModule} from 'ng-zorro-antd/switch';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzSpaceModule} from 'ng-zorro-antd/space';
import {NzTreeSelectModule} from 'ng-zorro-antd/tree-select';
import {NzTreeModule} from 'ng-zorro-antd/tree';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzBadgeModule} from 'ng-zorro-antd/badge';
import {NzListModule} from 'ng-zorro-antd/list';
import {NzCarouselModule} from 'ng-zorro-antd/carousel';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzTabsModule} from 'ng-zorro-antd/tabs';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import {NzPopconfirmModule} from 'ng-zorro-antd/popconfirm';

const NG_MODULES = [
  FormsModule,
];

const NZ_MODULES = [
  NzIconModule,
  NzTableModule,
  NzDividerModule,
  NzFormModule,
  NzDrawerModule,
  NzInputModule,
  NzButtonModule,
  NzToolTipModule,
  NzInputNumberModule,
  NzSwitchModule,
  NzSelectModule,
  NzSpaceModule,
  NzTreeSelectModule,
  NzTreeModule,
  NzCardModule,
  NzBadgeModule,
  NzListModule,
  NzModalModule,
  NzTabsModule,
  NzDropDownModule,
  NzPopconfirmModule,
  NzCarouselModule,
];

const COMPONENTS = [
  NcPageComponent,
  NcTableComponent,
  NcFormComponent,
  NcTreeComponent,
  NcListComponent
];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    ...NG_MODULES,
    ...NZ_MODULES,
    NcPageRoutingModule,
    CommonModule
  ],
})
export class NcPageModule {
}
