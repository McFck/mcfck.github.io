import { Component, Input, OnInit } from '@angular/core';
import { AnimeMangaStatistics, ANIME_TYPE } from 'src/app/models/dataModels';

@Component({
  selector: 'app-anime-stats-graphics',
  templateUrl: './anime-stats-graphics.component.html',
  styleUrls: ['./anime-stats-graphics.component.less']
})
export class AnimeStatsGraphicsComponent implements OnInit {

  @Input()
  allData: Record<ANIME_TYPE, any[]> = {} as any;
  
  @Input()
  statistics: Record<ANIME_TYPE, AnimeMangaStatistics> = {} as any;
  
  constructor() { }

  ngOnInit(): void {
  }

}
