import { Component } from '@angular/core';
import {AuthService} from "../service/auth/auth.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  constructor(public authService: AuthService, ) {
  }
}
