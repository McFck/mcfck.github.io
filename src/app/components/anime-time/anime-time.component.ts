import { Component, Input, OnInit } from '@angular/core';
import {
  CHAPTER_DURATION,
  MANGA_TIME_CALCULATION_STATUSES,
  VOLUME_DURATION,
} from 'src/app/constants/mangaConsts';
import { AnimeData, ANIME_TYPE } from 'src/app/models/dataModels';
import { AnimeService } from 'src/app/services/anime.service';

@Component({
  selector: 'app-anime-time',
  templateUrl: './anime-time.component.html',
  styleUrls: ['./anime-time.component.less'],
})
export class AnimeTimeComponent implements OnInit {

  constructor(private animeService: AnimeService) {}

  @Input() set allData(value : Record<ANIME_TYPE, any[]>) {
    this._allData = value;
    if (value.anime?.length > 0) {
      // this.animeService.fetchPaginatedData(this.animeService.getAnimeDetailedList.bind(this.animeService, this._allData?.anime?.map((v)=>v.anime.id)), ANIME_TYPE.ANIME, 50).subscribe((r)=>console.log("R",r))
      //this.animeService.getAnimeDetailedList(this._allData?.anime?.map((v)=>v.anime.id))?.subscribe((a)=>console.log("DETAILED", a))
    }
  }
  _allData: Record<ANIME_TYPE, any[]> = {} as any;

  mangaHours = 0;
  animeHours = 0;

  ngOnInit(): void {
    // this.calculateAnimeHours();
    // this.calculateMangaHours();
  }

  calculateMangaHours(): void {
    let volumeDuration = 0;
    let chapterDuration = 0;

    this.allData[ANIME_TYPE.MANGA]?.forEach((entry: AnimeData) => {
      volumeDuration = (entry.volumes ?? 0) * VOLUME_DURATION;
      chapterDuration = (entry.chapters ?? 0) * CHAPTER_DURATION;
      if (MANGA_TIME_CALCULATION_STATUSES.indexOf(entry?.manga?.status) !== -1) {
        this.mangaHours += Math.max((entry.rewatches ?? 0) * chapterDuration, (entry.rewatches ?? 0) * volumeDuration);
      }
      this.mangaHours += Math.max(volumeDuration, chapterDuration);
    });
  }

  calculateAnimeHours(): void {
    let volumeDuration = 0;
    let chapterDuration = 0;

    this.allData[ANIME_TYPE.MANGA]?.forEach((entry: AnimeData) => {
      volumeDuration = (entry.volumes ?? 0) * VOLUME_DURATION;
      chapterDuration = (entry.chapters ?? 0) * CHAPTER_DURATION;
      if (MANGA_TIME_CALCULATION_STATUSES.indexOf(entry?.manga?.status) !== -1) {
        this.mangaHours += Math.max((entry.rewatches ?? 0) * chapterDuration, (entry.rewatches ?? 0) * volumeDuration);
      }
      this.mangaHours += Math.max(volumeDuration, chapterDuration);
    });
  }
}
