import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
} from '@angular/core';
import {
  AnimeData,
  AnimeMangaStatistics,
  ANIME_TYPE,
  LoadedShikiUser
} from 'src/app/models/dataModels';
import { AnimeService } from 'src/app/services/anime.service';
import { AnimeHelper } from 'src/app/helpers/anime.helper';
import { combineLatest, of } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { GeneralHelper } from 'src/app/helpers/general.helper';
import { ActivatedRoute } from '@angular/router';
import { SHIKI_DEFAULT_ID } from 'src/app/constants/generalConsts';

@Component({
  selector: 'app-anime',
  templateUrl: './anime.component.html',
  styleUrls: ['./anime.component.less'],
})
export class AnimeComponent implements OnInit, AfterViewInit {
  constructor(
    private animeService: AnimeService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  allData: Record<ANIME_TYPE, any[]> = {} as any;
  isAnyDataFetched = false;
  tabStatus = {};
  
  statistics: Record<ANIME_TYPE, AnimeMangaStatistics> = {} as any;
  
  isLoading = true;
  currentUser: LoadedShikiUser = {};
  username;

  active = 1;


  dataStatusEmitter: EventEmitter<any> = new EventEmitter();
  ngOnInit(): void {
    this.isLoading = true;
    this.username = this.route.snapshot.queryParams?.["username"];
    if (this.username) {
      this.animeService.setUserId(this.username).pipe(catchError(()=>of(null))).subscribe((result: LoadedShikiUser)=>{
        if (!result) {
          this.currentUser = null;
          this.isLoading = false;
          this.cdr.detectChanges();
        } else {
          this.currentUser = result;
          this.dataStatusEmitter.emit();
        }
      });
    } else {
      this.animeService.getUserData(SHIKI_DEFAULT_ID).pipe(catchError(()=>of(null))).subscribe((result)=>{
        if (!result) {
          this.currentUser = null;
          this.isLoading = false;
          this.cdr.detectChanges();
        } else {
          this.currentUser = result;
          this.animeService.useDefaultId();
          this.dataStatusEmitter.emit();
        }
      });
    }
  }

  ngAfterViewInit(): void {
    this.dataStatusEmitter.pipe(take(1), switchMap(()=>{
      const totalAnime = AnimeHelper.calculateTotalEntries(this.currentUser.stats.full_statuses.anime);
      const totalManga = AnimeHelper.calculateTotalEntries(this.currentUser.stats.full_statuses.manga);
      return combineLatest([
        // this.animeService.getDataTypeListGraphQL(ANIME_TYPE.ANIME).pipe(catchError(()=>this.animeService.getAllAnimeList())),
        // this.animeService.getDataTypeListGraphQL(ANIME_TYPE.MANGA).pipe(catchError(()=>this.animeService.getAllMangaList()))
        this.animeService.getDataTypeListGraphQLParallel(ANIME_TYPE.ANIME, totalAnime).pipe(catchError(()=>this.animeService.getAllAnimeList())),
        this.animeService.getDataTypeListGraphQLParallel(ANIME_TYPE.MANGA, totalManga).pipe(catchError(()=>this.animeService.getAllMangaList()))
      ])
    })).subscribe(([animeData, mangaData]: [AnimeData[], AnimeData[]]) => {
      console.debug("DONE?", {animeData, mangaData})
      this.isLoading = false;
      this.cdr.detectChanges();
      
      if (!animeData && !mangaData) {
        this.currentUser = null;
      } else {
        this.allData[ANIME_TYPE.ANIME] = animeData;
        this.allData[ANIME_TYPE.MANGA] = mangaData;
  
        for (let type of Object.keys(this.allData)) {
          this.allData[type].forEach((entry:any)=>{
            entry[type].name = entry?.["__typename"] ? GeneralHelper.selectValidLocaleName(entry.anime || entry.manga) : (entry.anime?.name || entry.manga?.name);
            entry[type].malUrl = `https://myanimelist.net/${type}/${entry[type].id}`;
          });
        }
  
        this.allData = {...this.allData};
        this.isAnyDataFetched = !!(this.allData?.anime || this.allData?.manga);
  
        this.statistics[ANIME_TYPE.ANIME] = {
          mediumScore: AnimeHelper.calculateMediumScoreStatistics(animeData).toFixed(2),
          totalAmount: animeData.length
        };
  
        this.statistics[ANIME_TYPE.MANGA] = {
          mediumScore: AnimeHelper.calculateMediumScoreStatistics(mangaData).toFixed(2),
          totalAmount: mangaData.length
        }
      }
    });
  }
}
