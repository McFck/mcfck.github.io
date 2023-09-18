import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { delay, expand, map, reduce, switchMap, takeWhile } from 'rxjs/operators';
import { BASE_ANIME_URL, BASE_BACKEND_URL, MAX_ANIME_HISTORY_REQUEST, MAX_VALUES_REQUEST, SHIKI_DEFAULT_ID } from '../constants/generalConsts';
import { AnimeData, AnimeHistory, ANIME_TYPE } from '../models/dataModels';
import { TranslateService } from './translate.service';
import { Apollo } from 'apollo-angular';
import { GeneralHelper } from '../helpers/general.helper';
import { getUserRatesAnime, getUserRatesManga } from './graphQL/user-rates.graphql';

@Injectable({
  providedIn: 'root',
})
export class AnimeService {
  constructor(private http: HttpClient, private translateService: TranslateService, private apollo: Apollo) {}
  userId = SHIKI_DEFAULT_ID;

  setUserId(username: string): Observable<any> {
    username = encodeURI(username);
      return this.getUserId(username).pipe(map((data: any)=>{
        // if(data?.id) 
        this.userId = data?.id;
        return data;
      })
    );
  }

  useDefaultId(): void {
    this.userId = SHIKI_DEFAULT_ID;
  }

  getUserId(username: string): Observable<any> {
    return this.http.get(`${BASE_ANIME_URL}/api/users/${username}`);
  }

  getGeneralGenresStats(): Observable<any> {
    return this.http.get(`${BASE_BACKEND_URL}/main/genres-stats`);
  }

  /* DEPRECATED */
  getTotalTimeSpentAnime(): Observable<number> {
    return this.http.get<number>(`${BASE_BACKEND_URL}/main/total-time`);
  }

  getUserHistory(): Observable<AnimeHistory[]> {
    return this.http.get<AnimeHistory[]>(`${BASE_ANIME_URL}/api/users/${this.userId}/history?limit=${MAX_ANIME_HISTORY_REQUEST}&locale=${this.translateService.getLanguage()}`);
  }

  getUserList(): Observable<any> {
    return this.http.get(`${BASE_ANIME_URL}/api/v2/user_rates/?user_id=${this.userId}`);
  }

  getAnimeDetailedList(ids:any[], page = 1): Observable<any> {
    if (ids?.length > 0) {
      return this.http.get(`${BASE_ANIME_URL}/api/animes/?ids=${ids.join(',')}&limit=50&page=${page}`);
    }
    return of([]);
  }

  getAnimeList(page = 1): Observable<AnimeData[]> {
    return this.http.get<AnimeData[]>(`${BASE_ANIME_URL}/api/users/${this.userId}/anime_rates?limit=${MAX_VALUES_REQUEST[ANIME_TYPE.ANIME]}&page=${page}`);
  }

  getMangaList(page = 1): Observable<AnimeData[]> {
    return this.http.get<AnimeData[]>(`${BASE_ANIME_URL}/api/users/${this.userId}/manga_rates?limit=${MAX_VALUES_REQUEST[ANIME_TYPE.MANGA]}&page=${page}`);
  }

  getUserRates(page: number, targetType: string, limit?: number): Observable<AnimeData[]> {
    return this.apollo.query({
        query: targetType === "Anime" ? getUserRatesAnime : getUserRatesManga,
        variables: {
            userId: this.userId,
            limit,
            targetType,
            page
        }
    }).pipe(map((result: any)=>result?.data?.userRates), delay(100))
  }

  getDataTypeListGraphQL(type: ANIME_TYPE): Observable<AnimeData[]> {
    // const error: any = new Error(`This is a test value`);
    // return throwError(error);
    return this.fetchPaginatedData(this.getUserRates, GeneralHelper.capitalizeFirstLetter(type));
  }

  getAllAnimeList(): Observable<AnimeData[]> {
    return this.fetchPaginatedData(this.getAnimeList, ANIME_TYPE.ANIME);
  }

  getAllMangaList(): Observable<AnimeData[]> {
    return this.fetchPaginatedData(this.getMangaList, ANIME_TYPE.MANGA);
  }

  fetchPaginatedData<AnimeData>(
    inputMethod: (page: number, type: string) => Observable<AnimeData[]>,
    type: ANIME_TYPE,//ANIME_TYPE, 
    customMaxValue?: number
  ): Observable<AnimeData[]> {
    let isFetching = true;
    let curPage = 1;
    return inputMethod
      .bind(this)
      .call(this, curPage, type)
      .pipe(
      expand((_)=>{
        if (isFetching) {
          return inputMethod
          .bind(this)
          .call(this, curPage, type);
        }
        return EMPTY;
      }),
      takeWhile((fetchedData: AnimeData[]) => {
        if (isFetching) {
          if (fetchedData.length < (50)) {//customMaxValue ?? MAX_VALUES_REQUEST[type]
            isFetching = false;
          } else {
            curPage++;
          }
          return true;
        }
        return false;
      }),
      reduce((acc: AnimeData[], val:AnimeData[]) => {
        acc = [...acc, ...val]
        return acc
      }, [])
      );
  }
}
