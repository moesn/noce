import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NcAppModule, NcCustomComponents} from 'noce/app';
import {ProbeComponent} from './probe/probe.component';

NcCustomComponents.push({
  path: 'probe',
  component: ProbeComponent
})

@NgModule({
  declarations: [
    AppComponent,
    ProbeComponent
  ],
  imports: [
    NcAppModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
