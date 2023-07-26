import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  AnimeData,
  AnimeMangaStatistics,
  ANIME_TYPE
} from 'src/app/models/dataModels';
import { AnimeService } from 'src/app/services/anime.service';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';
import { TranslateService } from 'src/app/services/translate.service';
import { AnimeHelper } from 'src/app/helpers/anime.helper';
import { combineLatest, Observable } from 'rxjs';

@Component({
  selector: 'app-anime',
  templateUrl: './anime.component.html',
  styleUrls: ['./anime.component.less'],
})
export class AnimeComponent implements OnInit, AfterViewInit {
  constructor(
    private animeService: AnimeService,
    private cdr: ChangeDetectorRef,
    private translationPipe: TranslatePipe,
    private translationService: TranslateService
  ) {}

  allData: Record<ANIME_TYPE, any[]> = {} as any;
  
  statistics: Record<ANIME_TYPE, AnimeMangaStatistics> = {} as any;
  
  isLoading = true;

  active = 1;

  ngOnInit(): void {
    this.isLoading = true;
    // this.translationService.localeChange.subscribe(() => {
    // });
  }

  ngAfterViewInit(): void {
    combineLatest([
      this.animeService.getAllAnimeList(),
      this.animeService.getAllMangaList()
    ]).subscribe(([animeData, mangaData]: [AnimeData[], AnimeData[]]) => {
      this.isLoading = false;
      this.cdr.detectChanges();

      this.allData[ANIME_TYPE.ANIME] = animeData;
      this.allData[ANIME_TYPE.MANGA] = mangaData;

      for (let type of Object.keys(this.allData)) {
        this.allData[type].forEach((entry:any)=>{
          entry[type].malUrl = `https://myanimelist.net/${type}/${entry[type].id}`;
        });
      }

      this.allData = {...this.allData};

      this.statistics[ANIME_TYPE.ANIME] = {
        mediumScore: AnimeHelper.calculateMediumScoreStatistics(animeData).toFixed(2),
        totalAmount: animeData.length
      };

      this.statistics[ANIME_TYPE.MANGA] = {
        mediumScore: AnimeHelper.calculateMediumScoreStatistics(mangaData).toFixed(2),
        totalAmount: mangaData.length
      }
    });
  }
}
