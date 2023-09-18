import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import * as Highcharts from 'highcharts';
import more from 'highcharts/highcharts-more';
import {
  GENERAL_PARAMETERS_NAME_MAP,
  MAIN_ANIME_GENRES_MAP,
  MAIN_ANIME_STATUSES,
} from 'src/app/constants/generalConsts';
import { AnimeHelper } from 'src/app/helpers/anime.helper';
import { ChartsHelper } from 'src/app/helpers/charts.helper';
import {
  AnimeMangaStatistics,
  ANIME_TYPE,
  AnimeData,
} from 'src/app/models/dataModels';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';
import { AnimeService } from 'src/app/services/anime.service';
import { TranslateService } from 'src/app/services/translate.service';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';

more(Highcharts);
NoDataToDisplay(Highcharts);

@Component({
  selector: 'app-anime-stats-graphics',
  templateUrl: './anime-stats-graphics.component.html',
  styleUrls: ['./anime-stats-graphics.component.less'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnimeStatsGraphicsComponent implements OnInit, AfterViewInit {
  @Input() set allData(value: any) {
    this._allData = {...value};

    if (
      Object.keys(this._allData).length !== 0 &&
      this._allData.constructor === Object
    ) {
      this.ready = true;
      this.cdr.detectChanges();
      for (let type of Object.keys(this._allData)) {
        this.drawGeneralStatistics(type as ANIME_TYPE);
        this._allData[type].map(entry=>{
          entry[type].genres?.map(genre=>genre.id)?.forEach(id=>(id in this.genresStatistics) ? this.genresStatistics[id]++ : this.genresStatistics[id] = 0);
        })
      }
      this.drawRadarGraph();
    } else {
      this.ready = false;
      this.cdr.detectChanges();
    }
  }

  @Input()
  statistics: Record<ANIME_TYPE, AnimeMangaStatistics> = {} as any;

  _allData: Record<ANIME_TYPE, any[]> = {} as any;
  _legendMap: Record<ANIME_TYPE, any[]> = {} as any;

  ready = false;

  generalTypes: string[] = ['anime', 'manga'];
  generalParametersNames = GENERAL_PARAMETERS_NAME_MAP;

  episodesCounters = {
    anime: 0,
    manga: 0,
  };

  animeStatusesColorsArr: string[] = [
    '#fcd581',
    '#C6ECAE',//PLANNED
    '#94C9A9',//WATCHING
    '#777DA7',//WATCHED
    '#885053',//HOLD
    '#FE5F55'//DROPPED
  ];

  genresStatistics = {};

  curUrl: string;

  constructor(
    private translationPipe: TranslatePipe,
    private translationService: TranslateService,
    private animeService: AnimeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.curUrl = location.href;

    // this.animeService.getGeneralGenresStats().subscribe((data) => {
    //   this.genresStatistics = data;
    //   this.drawRadarGraph();
    // });
  }

  ngAfterViewInit(): void {
    this.translationService.localeChange.subscribe(() => {
      if (this.curUrl === location.href) {
        for (let type of Object.keys(this._allData)) {
          this.drawGeneralStatistics(type as ANIME_TYPE);
        }
        this.drawRadarGraph();
      }
    });
  }

  drawRadarGraph(): void {
    const chartTitle = this.translationPipe.transform('GENRES_TITLE');
    const categories = [...Object.keys(MAIN_ANIME_GENRES_MAP)];
    const series = [
      {
        type: 'area',
        data: [] as any,
      },
    ];

    if (Object.keys(this.genresStatistics).length !== 0) {
      Object.values(MAIN_ANIME_GENRES_MAP).forEach((categoryId) => series[0].data.push(this.genresStatistics[categoryId] || 0));
    }

    const chartHeight = window.innerWidth < 900 ? 'auto' : '50%';

    for (let i = 0; i < categories.length; i++) {
      categories[i] = this.translationPipe.transform(categories[i]);
    }
    ChartsHelper.drawChart(
      'radar',
      [],
      null,
      chartTitle,
      {
        headerName: this.translationPipe.transform('STATUS'),
        pointName: this.translationPipe.transform('AMOUNT'),
      },
      {
        chart: {
          polar: true,
          backgroundColor: null,
          height: chartHeight,
          spacingLeft: 45,
          spacingRight: 45,
        },
        xAxis: {
          categories,
          tickmarkPlacement: 'on',
        },
        yAxis: {
          gridLineInterpolation: 'polygon',
          min: 0,
        },
        tooltip: {
          enabled: false,
        },
        plotOptions: {
          series: {
            color: 'rgb(103 122 255 / 76%)',
          },
        },
        legend: false,
        series,
        lang: {
          noData: this.translationPipe.transform('NO_DATA_CHART'),
        },
      }
    );
  }

  drawGeneralStatistics(type: string): void {
    if (!this._allData[type]?.length) return;
    this._legendMap[type] = [];
    this.episodesCounters[type] = 0;
    const series: { name: any; color: string; data: number[] }[] = []; //, grouping: boolean
    Object.keys(MAIN_ANIME_STATUSES).forEach((status, index) => {
      series.push({
        name: status.toLowerCase(),
        color: this.animeStatusesColorsArr[index],
        data: [0]
      });
    });

    this._allData[type]?.forEach((dataSet: any) => {
      let found = series.find((s) => s.name === dataSet.status);
      found.data[0]++;
      this.episodesCounters[type] +=
        type === ANIME_TYPE.ANIME ? dataSet.episodes : dataSet.chapters;
    });

    series.forEach((s) => {
      s.name = this.translationPipe.transform(`${s.name}_${type}`);
    });

    ChartsHelper.drawChart(
      type,
      [],
      'bar',
      this.translationPipe.transform(`${type} by status`),
      {
        headerName: this.translationPipe.transform('STATUS'),
        pointName: this.translationPipe.transform('AMOUNT'),
      },
      {
        chart: {
          height: 140,
          type: 'bar',
          backgroundColor: null,
          events: {
            load: (e: any) => {
              let chart: any = e.target;
              let curLegendEntity;
              chart.series.forEach((s: any) => {
                curLegendEntity = {
                  color: s.data[0].color,
                  name: s.name,
                  number: s.data[0].y,
                };
                if (this._legendMap[type]?.length > 0) {
                  this._legendMap[type].push(curLegendEntity);
                } else {
                  this._legendMap[type] = [curLegendEntity];
                }
              });
            },
          },
        },
        plotOptions: {
          series: {
            borderRadius: 3,
            borderWidth: 0,
            stacking: 'normal',
          },
        },
        tooltip: {
          enabled: false,
        },
        xAxis: {
          visible: false,
        },
        yAxis: {
          visible: false,
          max: this._allData[type].length,
          endOnTick: false,
        },
        legend: false,
        series,
      }
    );
  }

  drawTypeGroupGraphics(type: ANIME_TYPE): void {
    if (this._allData[type]?.length > 0) {
      this.drawStatusPie(type);
      this.drawScoreBar(type);
    }
  }

  drawScoreBar(type: ANIME_TYPE): void {
    const originalData = AnimeHelper.calculateScoreStatistics(
      this._allData[type]
    ).map((score, index) => {
      return {
        name: `${index + 1} ⭐`,
        value: score,
        x: index + 1,
      };
    });
    const tooltip = {
      headerName: this.translationPipe.transform('SCORE'),
      pointName: this.translationPipe.transform('AMOUNT'),
    };
    ChartsHelper.drawChart(
      `score-${type}-bar`,
      AnimeHelper.calculateScoreStatistics(this._allData[type]).map(
        (score, index) => {
          return {
            name: `${index + 1} ⭐`,
            value: score,
          };
        }
      ),
      'bar',
      this.translationPipe.transform(`${type} by score`),
      tooltip,
      {
        yAxis: {
          visible: false,
        },
        xAxis: {
          allowDecimals: false,
          tickInterval: 1,
          labels: {
            step: 1,
          },
        },
        series: [
          {
            name: null,
            innerSize: '50%',
            data: ChartsHelper.prepareChartData(originalData, tooltip),
            dataLabels: {
              enabled: true,
            },
            showInLegend: false,
          },
        ],
      }
    );
  }

  drawStatusPie(type: ANIME_TYPE): void {
    const dataMap = new Map<string, { name: string; value: number }>();
    this._allData[type].forEach((val) => {
      const map = dataMap.get(val.status);
      if (!map) {
        dataMap.set(val.status, {
          name: this.translationPipe.transform(`${val.status}_${type}`),
          value: 1,
        });
      } else {
        map.value++;
        dataMap.set(val.status, map);
      }
    });
    ChartsHelper.drawChart(
      `status-${type}-pie`,
      Array.from(dataMap.values()),
      'pie',
      this.translationPipe.transform(`${type} by status`),
      {
        headerName: this.translationPipe.transform('STATUS'),
        pointName: this.translationPipe.transform('AMOUNT'),
      }
    );
  }
}
