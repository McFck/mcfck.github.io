import { Component, Input, OnInit } from '@angular/core';
import { ANIME_TYPE } from 'src/app/models/dataModels';

@Component({
  selector: 'app-anime-time',
  templateUrl: './anime-time.component.html',
  styleUrls: ['./anime-time.component.less']
})
export class AnimeTimeComponent implements OnInit {

  @Input()
  allData: Record<ANIME_TYPE, any[]> = {} as any;
  
  constructor() { }

  ngOnInit(): void {
  }

}
