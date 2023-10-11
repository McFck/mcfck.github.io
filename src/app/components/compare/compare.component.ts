import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { combineLatest, of, zip } from 'rxjs';
import { catchError, concatMap, map, switchMap, take } from 'rxjs/operators';
import { AnimeHelper } from 'src/app/helpers/anime.helper';
import { ANIME_TYPE, AnimeData, CompareUsers, LoadedShikiUser } from 'src/app/models/dataModels';
import { AnimeService } from 'src/app/services/anime.service';
import { TranslatePipe } from '../shared/pipes/translate.pipe';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.less']
})
export class CompareComponent implements OnInit, AfterViewInit {

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private animeService: AnimeService,
    private cdr: ChangeDetectorRef,
    private translatePipe: TranslatePipe
    ) { }

  @ViewChild('errorConnection', { static: false }) errorConnection:TemplateRef<any>;
  @ViewChild('progressConnection', { static: false }) progressConnection:TemplateRef<any>;
  @ViewChild('establishedConnection', { static: false }) establishedConnection:TemplateRef<any>;

  objectKeys = Object.keys;
  connectionRefsConfig: any = {
    'errorConnection': false,
    'progressConnection': true,
    'establishedConnection': false,
  };
  errorMessage: string;

  users: CompareUsers = {};

  ids = [];
  isLoading = false;
  isProcessed = false;

  dataEmitter: EventEmitter<CompareUsers> = new EventEmitter();
  someData: CompareUsers;

  tabStatus = {};
  active = 1;

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(take(1)).subscribe((r)=>{
      this.ids = r?.["ids"]?.split(',',2);
      if(this.ids) {
        this.isLoading = true;
        of(this.ids).pipe(
          switchMap(ids=>
          {
            const observables = ids.map(id=>this.animeService.getUserData(id));
            return combineLatest(observables);
          }),
          catchError(()=>of([]))
        ).subscribe(users=>{
          this.users.left = users[0];
          this.users.right = users[1];
          this.isLoading = false;
        });
      }
    });
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges()
  }

  userFetchProcess(user: LoadedShikiUser, type: string): void {
    this.users[type] = user;

    const ids = [this.users.left?.id, this.users.right?.id].filter(Boolean);
    const queryParams: Params = ids.length > 0 ? { ids: ids.join(',') } : { ids: null };
    this.router.navigate(
      [], 
      {
        relativeTo: this.activatedRoute,
        queryParams, 
        queryParamsHandling: 'merge',
      });
    if (user?.id) {
      this.changeConnectionIcon("progressConnection");
    }
  }

  changeConnectionIcon(newValue: string, message: string = null): void {
    this.isProcessed = newValue === 'establishedConnection';
    for(let key of this.objectKeys(this.connectionRefsConfig)) {
      this.connectionRefsConfig[key] = key === newValue;
    }
    this.errorMessage = message;
  }

  fetchCompareData(state: string): void {
    if (state === "establishedConnection") return;
    if (!this.users.left || !this.users.right || this.users.left.id === this.users.right.id) {
      this.changeConnectionIcon("errorConnection", this.translatePipe.transform("USER_LOADING_ERROR"));
    } else {
      this.changeConnectionIcon("progressConnection");
      this.errorMessage = null;
      const observables = [];
      Object.keys(this.users).forEach(key=>{
        const totalAnime = AnimeHelper.calculateTotalEntries(this.users[key].stats.full_statuses.anime);
        const totalManga = AnimeHelper.calculateTotalEntries(this.users[key].stats.full_statuses.manga);
        observables.push(combineLatest([
          this.animeService.getDataTypeListGraphQLParallel(ANIME_TYPE.ANIME, totalAnime, {id: this.users[key].id}).pipe(catchError(()=>this.animeService.getAllAnimeList(this.users[key].id))),
          this.animeService.getDataTypeListGraphQLParallel(ANIME_TYPE.MANGA, totalManga, {id: this.users[key].id}).pipe(catchError(()=>this.animeService.getAllMangaList(this.users[key].id)))
        ]).pipe(map(data=>{
          return {
            type: key,
            data
          }
        })));
      })
  
      this.isLoading = true;

      observables[0].pipe(
        concatMap(leftResult=>{
        return zip(of(leftResult), observables[1]);
        }),
        catchError((e)=> {
          this.changeConnectionIcon('errorConnection', this.translatePipe.transform("DATA_LOADING_ERROR"));
          this.isLoading = false;
          throw e;
        })
      ).subscribe((result: {type: string, data: any[]}[])=>
        {
          if (!result) {
            this.changeConnectionIcon('errorConnection', this.translatePipe.transform("DATA_LOADING_ERROR"));
          } else {
            result.forEach(entry=>{
              this.users[entry.type].userData = {};
              this.users[entry.type].userData[ANIME_TYPE.ANIME] = entry.data[0];
              this.users[entry.type].userData[ANIME_TYPE.MANGA] = entry.data[1];
            });
            this.someData = this.users;
            this.changeConnectionIcon("establishedConnection");
            this.cdr.detectChanges();
            this.dataEmitter.emit(this.users);
            this.isLoading = false;
          }
      });
    }
  }
}
