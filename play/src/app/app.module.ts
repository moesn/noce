import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NcAppModule} from 'noce/app';

@NgModule({
  declarations: [
    AppComponent
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
