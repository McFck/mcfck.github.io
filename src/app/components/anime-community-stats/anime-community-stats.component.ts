import { Component, Input, OnInit } from '@angular/core';
import { GeneralHelper } from 'src/app/helpers/general.helper';
import { ANIME_TYPE, AnimeData } from 'src/app/models/dataModels';

const NUMBER_OF_TOP_ENTRIES = 5;

@Component({
  selector: 'anime-community-stats',
  templateUrl: './anime-community-stats.component.html',
  styleUrls: ['./anime-community-stats.component.less']
})
export class AnimeCommunityStatsComponent implements OnInit {

  @Input()
  data: Record<ANIME_TYPE, any[]> = {} as any;

  types = Object.values(ANIME_TYPE);
  liked: Record<ANIME_TYPE, AnimeData[]> = {} as any;
  disliked: Record<ANIME_TYPE, AnimeData[]> = {} as any;

  constructor() { }

  ngOnInit(): void {
    for(let status of Object.values(ANIME_TYPE)) {
      this.data[status]?.forEach(entry=>{
        entry.diffMe = entry.score === 0 ? 0 : entry.score - entry[status].score;
        entry.diffThem = entry.score === 0 ? 0 : entry[status].score - entry.score;
      })
      this.liked[status] = this.parseIndexArray(GeneralHelper.getTopNi(NUMBER_OF_TOP_ENTRIES, this.data[status], "diffMe"), this.data[status]);
      this.disliked[status] = this.parseIndexArray(GeneralHelper.getTopNi(NUMBER_OF_TOP_ENTRIES, this.data[status], "diffThem"), this.data[status]);
    }
  }

  private parseIndexArray(indexObjArr: {index, val}[], searchArray: AnimeData[]): AnimeData[] {
    if (indexObjArr.some(e=>e.val === -Infinity)) return [];
    const result = [];
    for(let i = NUMBER_OF_TOP_ENTRIES - 1; i >= 0; i--) {
      result.push(searchArray[indexObjArr[i].index]);
    }
    return result;
  }
}
