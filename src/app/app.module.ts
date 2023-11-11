import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TireListComponent } from './tire-list/tire-list.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {HttpInterceptorService} from "./service/http/http-interceptor.service";
import {FormsModule} from "@angular/forms";
import {DatePipe} from "@angular/common";
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './error/error.component';
import { MenuComponent } from './menu/menu.component';

@NgModule({
  declarations: [
    AppComponent,
    TireListComponent,
    LoginComponent,
    ErrorComponent,
    MenuComponent
  ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
      AppRoutingModule
    ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
