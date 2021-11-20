import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NcAuthGuardSerivce} from 'noce/auth';
import {getAppOption} from 'noce/core';
import {NcAppComponent} from './app.component';

const routes: Routes = [
  {
    path: getAppOption('base'),
    canActivateChild: [NcAuthGuardSerivce],
    component: NcAppComponent,
    loadChildren:  () => import('noce/page').then(m => m.NcPageModule),
  },
  {path: '', pathMatch: 'full', redirectTo: getAppOption('base')},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NcAppRoutingModule {
}
