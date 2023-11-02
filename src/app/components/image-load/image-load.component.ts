import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'image-load',
  templateUrl: './image-load.component.html',
  styleUrls: ['./image-load.component.less']
})
export class ImageLoadComponent {
  @Input() height:number=300;
  @Input() width:number=200;
}
