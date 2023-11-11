import { Component } from '@angular/core';
import {TireEntity, TiresService} from "./service/tires.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tiresCrm';

  tires: TireEntity[] = [];

  constructor() {
  }

  ngOnInit() {

  }

}
