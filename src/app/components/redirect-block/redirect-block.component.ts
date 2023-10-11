import { Component, Input, OnInit } from '@angular/core';
import { SHIKI_DEFAULT_ID } from 'src/app/constants/generalConsts';

@Component({
  selector: 'app-redirect-block',
  templateUrl: './redirect-block.component.html',
  styleUrls: ['./redirect-block.component.less']
})
export class RedirectBlockComponent implements OnInit {

  @Input() set left(value) {
    this._left = value?.id || SHIKI_DEFAULT_ID;
  }

  public _left;
  
  constructor() { }

  ngOnInit(): void {
  }

}
