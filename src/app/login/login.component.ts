import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../service/auth/auth.service";
import {NgForm} from "@angular/forms";
import {AppConstants} from '../app.constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  AppConstants = AppConstants;

  username = 'oolaa'
  password = 'pleur'
  errorMessage = 'Invalid Credentials'
  invalidLogin = false
  showSignIn: boolean = true;
  showSignUp: boolean = false;

  // Sign Up variables
  personName: string = '';
  newUsername: string = '';
  newPassword: string = '';
  repeatPassword: string = '';
  selectedRole: string = 'Worker';
  roles: string[] = ['Worker', 'Inspector'];
  error: string = 'User with same name already exists';
  errorEnabled: boolean = false;

  submitted = false;

  @ViewChild('signUpForm') signUpForm!: NgForm;
  registrationSuccess = false;

  constructor(private router: Router,
              private authService: AuthService,) {
  }

  ngOnInit() {
  }

  handleJWTAuthLogin() {
    this.authService.executeJWTAuthenticationService(this.username, this.password)
      .subscribe({
          next: (data) => {
            console.log(data)
            this.router.navigate(['tires', '2023-10-30'])  //TODO Add param to go to today tires.
            this.invalidLogin = false
          },
          error: error => {
            console.log(error)
            this.invalidLogin = true
          }
        }
      )
  }

  handleSignUp(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      // Extract the form values
      const { name, username, password, role } = form.value;
      console.log(name);
      console.log(username);
      console.log(password);
      console.log(role);

      const roles = [{ authority: role }];
      // Pass them to the registration function
      this.authService.registerNewUser(name, username, password, roles).subscribe({
        next: (data) => {
          this.registrationSuccess = true;
        },
        error: (error) => {
          this.errorEnabled = true;
        }
      });
    } else {
      this.registrationSuccess = false;
      // Handle the invalid form case
    }
  }

}

