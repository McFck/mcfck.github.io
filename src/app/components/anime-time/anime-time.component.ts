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
export class AnimeTimeComponent {
  constructor(private animeService: AnimeService) {}

  @Input() set allData(value: Record<ANIME_TYPE, any[]>) {
    this._allData = value;
    if (value.anime?.length > 0) {
      this.calculateAnimeTime();
      // this.animeService
      //   .getTotalTimeSpentAnime()
      //   .subscribe((totalTime) => {
          // this.animeDays = totalTime / 60 / 24;
          // this.totalAnimeDays = this.animeDays.toFixed(2);
          // this.totalDaysSpent = (this.mangaDays + this.animeDays).toFixed(0);
      //   });
    }
    if (value.manga?.length > 0) {
      this.calculateMangaTime();
    }
    
    if(this.mangaDays || this.animeDays) {
      this.totalDaysSpent = (this.mangaDays + this.animeDays).toFixed(0);
    }
  }
  _allData: Record<ANIME_TYPE, any[]> = {} as any;

  mangaDays = 0;
  animeDays = 0;

  totalMangaDays:string = "?";
  totalAnimeDays:string = "?";
  totalDaysSpent: string = "?";

  calculateAnimeTime(): void {
    let totalTime = 0;
    let checked = false;
    this._allData.anime?.forEach(entry=> {
      if(entry.anime.duration) {
        totalTime += (entry.anime.duration * entry.episodes * (entry.rewatches === 0 ? 1 : entry.rewatches + 1));
        checked = true;
      }
    });

    if(checked) {
      this.animeDays = totalTime / 60 / 24;
      this.totalAnimeDays = this.animeDays.toFixed(2);
    }
  }

  calculateMangaTime(): void {
    let volumeDuration = 0;
    let chapterDuration = 0;

    this._allData?.[ANIME_TYPE.MANGA]?.forEach((entry: AnimeData) => {
      volumeDuration = (entry.volumes ?? 0) * VOLUME_DURATION;
      chapterDuration = (entry.chapters ?? 0) * CHAPTER_DURATION;
      if (
        MANGA_TIME_CALCULATION_STATUSES.indexOf(entry?.manga?.status) !== -1
      ) {
        this.mangaDays += Math.max(
          (entry.rewatches ?? 0) * chapterDuration,
          (entry.rewatches ?? 0) * volumeDuration
        ) / 60 / 24;
      }
      this.mangaDays += Math.max(volumeDuration, chapterDuration) / 60 / 24;
    });

    this.totalMangaDays = this.mangaDays.toFixed(2);
  }
}
