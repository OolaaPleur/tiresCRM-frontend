import { Injectable } from '@angular/core';
import {HttpHandler, HttpRequest} from "@angular/common/http";
import {AuthService} from "../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService {

  constructor(private authenticationService : AuthService) { }

  intercept (request: HttpRequest<any>, next: HttpHandler) {
    // let username = 'oolaa'; //TODO REMOVE WHEN IMPLEMENT AUTH
    // let password = 'pleur';
    // let basicAuthHeaderString = 'Basic ' + window.btoa(username + ':' + password);

    let basicAuthHeaderString = this.authenticationService.getAuthenticatedToken();;
    let username = this.authenticationService.getAuthenticatedUser();

    if(basicAuthHeaderString && username) {
      request = request.clone({
        setHeaders : {
          Authorization : basicAuthHeaderString
        }
      })
    }
    return next.handle(request);
  }
}
