import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NcLoginComponent} from './components/login/login.component';
import {NcAuthComponent} from './components/auth.component';

const routes: Routes = [
  {
    path: 'auth',
    component: NcAuthComponent,
    children: [
      {
        path: 'login',
        component: NcLoginComponent
      },
      {path: '', pathMatch: 'full', redirectTo: 'login'},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NcAuthRoutingModule {
}
