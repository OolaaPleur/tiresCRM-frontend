import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteGuardService } from './service/route-guard.service';
import { TireListComponent } from './tire-list/tire-list.component';
import {LoginComponent} from "./login/login.component";
import {ErrorComponent} from "./error/error.component";  // Update this path to your actual component path

const routes: Routes = [
  { path: '', component: LoginComponent  },//canActivate, RouteGuardService
  { path: 'login', component: LoginComponent },
  { path: 'tires', component: TireListComponent, canActivate:[RouteGuardService] },
  { path: 'tires/:date', component: TireListComponent, canActivate:[RouteGuardService] },


  { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
