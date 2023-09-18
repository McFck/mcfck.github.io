import { Component, OnInit, ViewChild } from '@angular/core';
import { MatInput } from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-custom-id-field',
  templateUrl: './custom-id-field.component.html',
  styleUrls: ['./custom-id-field.component.less']
})
export class CustomIdFieldComponent implements OnInit {

  enabledField = false;

  public username: MatInput;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  enableEdit(): void {
    this.enabledField = !this.enabledField;
  }

  apply(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([ "anime" ], { queryParams: { username: this.username } })
  }
}
