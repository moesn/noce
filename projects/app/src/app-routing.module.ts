import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NcAuthGuardSerivce} from 'noce/auth';
import {getAppOption} from 'noce/core';
import {NcAppComponent} from './app.component';

const basePath = getAppOption('base');

const routes: Routes = [
  {
    path: basePath,
    canActivateChild: [NcAuthGuardSerivce],
    component: NcAppComponent,
    loadChildren: () => import('noce/page').then(m => m.NcPageModule),
  },
  {path: '', pathMatch: 'full', redirectTo: basePath},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NcAppRoutingModule {
}
