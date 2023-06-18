import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  AnimeData,
  AnimeHistory,
  AnimeMangaStatistics,
  ANIME_TYPE
} from 'src/app/models/dataModels';
import { AnimeService } from 'src/app/services/anime.service';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';
import { TranslateService } from 'src/app/services/translate.service';
import { AnimeHelper } from 'src/app/helpers/anime.helper';
import { combineLatest, Observable } from 'rxjs';
import { ChartsHelper } from 'src/app/helpers/charts.helper';

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
    this.translationService.localeChange.subscribe(() => {
      for (let type of Object.keys(this.allData)) {
        // this.drawTypeGroupGraphics(type as ANIME_TYPE);
      }
    });
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

      this.allData = {...this.allData};

      // this.drawStatusPie(ANIME_TYPE.ANIME);
      // this.drawStatusPie(ANIME_TYPE.MANGA);

      // this.drawScoreBar(ANIME_TYPE.ANIME);
      // this.drawScoreBar(ANIME_TYPE.MANGA);

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

  // drawTypeGroupGraphics(type: ANIME_TYPE): void {
  //   this.drawStatusPie(type);
  //   this.drawScoreBar(type);
  // }

  // drawStatusPie(type: ANIME_TYPE): void {
  //   const dataMap = new Map<string, { name: string; value: number }>();
  //   this.allData[type].forEach((val) => {
  //     const map = dataMap.get(val.status);
  //     if (!map) {
  //       dataMap.set(val.status, { name: this.translationPipe.transform(`${val.status}_${type}`), value: 1 });
  //     } else {
  //       map.value++;
  //       dataMap.set(val.status, map);
  //     }
  //   });
  //   ChartsHelper.drawChart(
  //     `status-${type}-pie`,
  //     Array.from(dataMap.values()),
  //     'pie',
  //     this.translationPipe.transform(`${type} by status`),
  //     { headerName: this.translationPipe.transform('STATUS'), pointName: this.translationPipe.transform('AMOUNT') }
  //   );
  // }

  // drawScoreBar(type: ANIME_TYPE): void {
  //   const originalData = AnimeHelper.calculateScoreStatistics(this.allData[type]).map((score, index)=>{
  //     return {
  //       name: `${index + 1} ⭐`,
  //       value: score,
  //       x: index + 1
  //     }
  //   });
  //   const tooltip = { headerName: this.translationPipe.transform('SCORE'), pointName: this.translationPipe.transform('AMOUNT') };
  //   ChartsHelper.drawChart(
  //     `score-${type}-bar`,
  //     AnimeHelper.calculateScoreStatistics(this.allData[type]).map((score, index)=>{
  //       return {
  //         name: `${index + 1} ⭐`,
  //         value: score
  //       }
  //     }),
  //     'bar',
  //     this.translationPipe.transform(`${type} by score`),
  //     tooltip,
  //     {  
  //       yAxis: {
  //         visible: false,
  //       },
  //       xAxis: {
  //         allowDecimals: false,
  //         tickInterval: 1,
  //         labels: {
  //           step: 1,
  //         },
  //       },
  //       series: [
  //         {
  //           name: null,
  //           innerSize: '50%',
  //           data: ChartsHelper.prepareChartData(originalData, tooltip),
  //           dataLabels: {
  //             enabled: true,
  //           },
  //           showInLegend: false,
  //         },
  //       ]
  //     }
  //   );
  // }
}
