import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NcPageComponent} from './page.component';

const routes: Routes = [
  {
    path: '**',
    component: NcPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NcPageRoutingModule {
}
