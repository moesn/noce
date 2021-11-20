import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NzNotificationModule} from 'ng-zorro-antd/notification';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {NzInputModule} from 'ng-zorro-antd/input';
import {DateOnlyPipe, DateTimePipe, TimeOnlyPipe} from './pipes/date.pipe';
import {FileSizePipe} from './pipes/size.pipe';
import {NcConfirmComponent, NcHttpService} from './services/http.service';
import {NcNotifyService} from './services/notify.service';
import {NcCryptBase64Service, NcCryptRSAService, NcCryptService} from './services/crypt.service';
import {getAppOption, schemaToOption} from './schemas/schema-to-option';
import {NcStoreService} from 'noce/core/services';

schemaToOption('/schemas/app.schema.json');
schemaToOption('/schemas/auth.schema.json');

const NG_MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
];

const NZ_MODULES = [
  NzNotificationModule,
  NzInputModule,
  NzCheckboxModule,
];

const PIPES = [
  DateTimePipe,
  DateOnlyPipe,
  TimeOnlyPipe,
  FileSizePipe
];

const SERVICES = [
  NcHttpService,
  NcNotifyService,
  NcStoreService,
];

const COMPONENTS = [
  NcConfirmComponent,
];

@NgModule({
  imports: [...NG_MODULES, ...NZ_MODULES],
  exports: [...PIPES],
  declarations: [...PIPES, ...COMPONENTS],
  providers: [
    ...SERVICES,
    {provide: NcCryptService, useClass: getAppOption('encryptMode') === 'rsa' ? NcCryptRSAService : NcCryptBase64Service},
  ],
})
export class NcCoreModule {
}
