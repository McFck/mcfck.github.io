import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-empty-typed-data',
  templateUrl: './empty-typed-data.component.html',
  styleUrls: ['./empty-typed-data.component.less']
})
export class EmptyTypedDataComponent implements OnInit {

  @Input()
  type: string;
  
  constructor() { }

  ngOnInit(): void {
  }

}
