import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {API_URL} from "../../app.constants";
import {catchError, map, switchMap, tap, throwError} from "rxjs";
import {Router} from "@angular/router";


export const TOKEN = 'token'
export const AUTHENTICATED_USER = 'authenticatedUser'

@Injectable({
  providedIn: 'root'
})


export class AuthService {

  constructor(private router: Router,private http: HttpClient) {
  }

  executeJWTAuthenticationService(username: string, password: string) {

    return this.http.post<any>(
      `${API_URL}/api/authenticate`, {
        username,
        password
      }).pipe(
      map(
        data => {
          sessionStorage.setItem(AUTHENTICATED_USER, username);
          sessionStorage.setItem(TOKEN, `Bearer ${data.token}`);
          return data;
        }
      )
    );
  }

  getAuthenticatedUser() {
    return sessionStorage.getItem(AUTHENTICATED_USER)
  }

  getAuthenticatedToken() {
    if (this.getAuthenticatedUser()) {
      return sessionStorage.getItem(TOKEN);
    } else {
      return '';
    }
  }

  isUserLoggedIn() {
    const user = sessionStorage.getItem(AUTHENTICATED_USER);
    return !(user === null);
  }

  logout() {
    sessionStorage.removeItem(AUTHENTICATED_USER)
    sessionStorage.removeItem(TOKEN)
  }

  registerNewUser(name: string, username: string, password: string, role: { authority: any }[]) {
    return this.http.post<any>(`${API_URL}/api/sign-up`, { name, username, password, role })
      .pipe(
        switchMap(user => this.executeJWTAuthenticationService(username, password)),
        tap(data => {
          // Set session storage or any other success actions
          sessionStorage.setItem(AUTHENTICATED_USER, username);
          sessionStorage.setItem(TOKEN, `Bearer ${data.token}`);
          this.router.navigate(['tires', '2023-10-30']); // Replace with dynamic date logic as needed
        }),
        catchError(error => {
          console.error(error);
          return throwError(() => new Error('Failed to register new user'));
        })
      );
  }

}


interface RoleAuthority {
  authority: string;
}
