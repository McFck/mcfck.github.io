import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { reduce, takeWhile } from 'rxjs/operators';
import { MAX_ANIME_HISTORY_REQUEST, MAX_VALUES_REQUEST } from '../constants/generalConsts';
import { AnimeData, AnimeHistory, ANIME_TYPE } from '../models/dataModels';
import { TranslateService } from './translate.service';

@Injectable({
  providedIn: 'root',
})
export class AnimeService {
  constructor(private http: HttpClient, private translateService: TranslateService) {}

  baseUrl = 'https://shikimori.one';
  userId = "1121790";

  getUserHistory(): Observable<AnimeHistory[]> {
    return this.http.get<AnimeHistory[]>(`${this.baseUrl}/api/users/${this.userId}/history?limit=${MAX_ANIME_HISTORY_REQUEST}&locale=${this.translateService.getLanguage()}`);
  }

  getUserList(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/v2/user_rates?user_id=${this.userId}`);
  }

  getAnimeList(page = 1): Observable<AnimeData[]> {
    return this.http.get<AnimeData[]>(`${this.baseUrl}/api/users/${this.userId}/anime_rates?limit=${MAX_VALUES_REQUEST[ANIME_TYPE.ANIME]}&page=${page}`);
  }

  getMangaList(page = 1): Observable<AnimeData[]> {
    return this.http.get<AnimeData[]>(`${this.baseUrl}/api/users/${this.userId}/manga_rates?limit=${MAX_VALUES_REQUEST[ANIME_TYPE.MANGA]}&page=${page}`);
  }

  getAllAnimeList(): Observable<AnimeData[]> {
    return this.fetchPaginatedData(this.getAnimeList, ANIME_TYPE.ANIME);
  }

  getAllMangaList(): Observable<AnimeData[]> {
    return this.fetchPaginatedData(this.getMangaList, ANIME_TYPE.MANGA);
  }

  fetchPaginatedData<AnimeData>(
    inputMethod: (page: number) => Observable<AnimeData[]>,
    type: ANIME_TYPE
  ): Observable<AnimeData[]> {
    let isFetching = true;
    let curPage = 1;
    return inputMethod
      .bind(this)
      .call(this, curPage)
      .pipe(
        takeWhile((fetchedData: AnimeData[]) => {
        if (isFetching) {
          if (fetchedData.length < MAX_VALUES_REQUEST[type]) {
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
