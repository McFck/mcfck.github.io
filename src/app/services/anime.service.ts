import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, concat, of, range, throwError, timer} from 'rxjs';
import { catchError, delay, expand, map, mergeMap, reduce, takeWhile, scan, concatMap, retryWhen, toArray, tap } from 'rxjs/operators';
import { BASE_ANIME_URL, BASE_BACKEND_URL, MAX_ANIME_HISTORY_REQUEST, MAX_VALUES_REQUEST, SHIKI_DEFAULT_ID } from '../constants/generalConsts';
import { AnimeData, AnimeHistory, ANIME_TYPE, LoadedShikiUser } from '../models/dataModels';
import { TranslateService } from './translate.service';
import { Apollo } from 'apollo-angular';
import { GeneralHelper } from '../helpers/general.helper';
import { getUserRatesAnime, getUserRatesManga } from './graphQL/user-rates.graphql';
import { genericRetryStrategy } from '../utils/rxjs/RxJs.utils';

const NUMBER_OF_PARALLEL_CALLS = 4;
const PAUSE_BETWEEN_BATCH_CALLS_DURATION = 1500;
const TOO_MANY_REQUESTS_PAUSE_DURATION = 20000;
const FORGIVABLE_ERROR_DURATION = 5000;
const MAX_ALLOWED_ERRORS = 20;

interface PaginatedDataExtendedAttr {
  id?: string,
  limit?: string,
  targetType?: string,
  statuses?: string[]
}

@Injectable({
  providedIn: 'root',
})
export class AnimeService {
  constructor(private http: HttpClient, private translateService: TranslateService, private apollo: Apollo) {}

  private userId = SHIKI_DEFAULT_ID;
  private lastErrTime = 0; // To stop batch request stream
  private lastFailedRequestTime = 0;

  setUserId(username: string): Observable<any> {
    username = encodeURI(username);
      return this.getUserData(username).pipe(map((data: any)=>{
        this.userId = data?.id;
        return data;
      })
    );
  }

  useDefaultId(): void {
    this.userId = SHIKI_DEFAULT_ID;
  }

  getUserData(username: string): Observable<LoadedShikiUser> {
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
    return this.http.get<AnimeHistory[]>(`${BASE_ANIME_URL}/api/users/${this.userId}/history?limit=${MAX_ANIME_HISTORY_REQUEST}&locale=${this.translateService.getLanguage()}`).pipe(
      retryWhen(genericRetryStrategy({
        scalingDuration: PAUSE_BETWEEN_BATCH_CALLS_DURATION,
        excludedStatusCodes: [500],
        maxRetryAttempts: MAX_ALLOWED_ERRORS
      }))
    );
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

  getAnimeList(page = 1, extendedAttributes?: PaginatedDataExtendedAttr): Observable<AnimeData[]> {
    return this.http.get<AnimeData[]>(`${BASE_ANIME_URL}/api/users/${extendedAttributes.id || this.userId}/anime_rates?limit=${MAX_VALUES_REQUEST[ANIME_TYPE.ANIME]}&page=${page}`);
  }

  getMangaList(page = 1, extendedAttributes?: PaginatedDataExtendedAttr): Observable<AnimeData[]> {
    return this.http.get<AnimeData[]>(`${BASE_ANIME_URL}/api/users/${extendedAttributes.id || this.userId}/manga_rates?limit=${MAX_VALUES_REQUEST[ANIME_TYPE.MANGA]}&page=${page}`);
  }

  getUserRates(page = 1, extendedAttributes: PaginatedDataExtendedAttr): Observable<AnimeData[]> {
    return this.apollo.query({
        query: extendedAttributes.targetType === "Anime" ? getUserRatesAnime : getUserRatesManga,
        variables: {
            userId: extendedAttributes.id || this.userId,
            limit: extendedAttributes.limit,
            targetType: extendedAttributes.targetType,
            page
        }
    }).pipe(map((result: any)=>result?.data?.userRates))
  }

  getDataTypeListGraphQL(type: ANIME_TYPE, id?: string): Observable<AnimeData[]> {
    // const error: any = new Error(`This is a test value`);
    // return throwError(error);
    return this.fetchPaginatedData(this.getUserRates, {id, targetType: GeneralHelper.capitalizeFirstLetter(type)});
  }

  getDataTypeListGraphQLParallel(type: ANIME_TYPE, size: number, extendedAttributes?: PaginatedDataExtendedAttr): Observable<AnimeData[]> {
    return this.fetchDataInParallel(this.getUserRates, size, {
      id: extendedAttributes?.id, 
      targetType: GeneralHelper.capitalizeFirstLetter(type), 
      statuses: extendedAttributes?.statuses
    }).pipe(
        toArray(),
        map(items=>GeneralHelper.flatten(items))
    );
  }

  getAllAnimeList(id?: string): Observable<AnimeData[]> {
    return this.fetchPaginatedData(this.getAnimeList, {id, targetType: ANIME_TYPE.MANGA}).pipe(
      retryWhen(genericRetryStrategy({
        scalingDuration: PAUSE_BETWEEN_BATCH_CALLS_DURATION,
        excludedStatusCodes: [500],
        maxRetryAttempts: MAX_ALLOWED_ERRORS
      })),
      catchError(()=>of([])));
  }

  getAllMangaList(id?: string): Observable<AnimeData[]> {
    return this.fetchPaginatedData(this.getMangaList, {id, targetType: ANIME_TYPE.MANGA}).pipe(
    retryWhen(genericRetryStrategy({
        scalingDuration: PAUSE_BETWEEN_BATCH_CALLS_DURATION,
        excludedStatusCodes: [500],
        maxRetryAttempts: MAX_ALLOWED_ERRORS
    })),
    catchError(()=>of([])));
  }

  rateLimit(
    source$: Observable<any>,
    count: number,
    period: number,
    errorTimeout: number
  ): Observable<any> {
    let lastErrorTime = 0;

    return source$.pipe(
      scan((records, value) => {
        const now = Date.now();
        const since = now - period;
  
        // Keep a record of all values received within the last period.
  
        records = records.filter((record) => record.until > since);
        if (records.length >= count) {
          // until is the time until which the value should be delayed.
  
          const firstRecord = records[0];
          const lastRecord = records[records.length - 1];
          const until = firstRecord.until + (period * Math.floor(records.length / count));
  
          // concatMap is used below to guarantee the values are emitted
          // in the same order in which they are received, so the delays
          // are cumulative. That means the actual delay is the difference
          // between the until times.
  
          records.push({
            delay: (lastRecord.until < now) ?
              (until - now) :
              (until - lastRecord.until),
            until,
            value
          });
        } else {
          records.push({
            delay: 0,
            until: now,
            value
          });
        }
        return records;
  
      }, []),
      concatMap((records) => {
        const lastRecord = records[records.length - 1];
        const observable = of(lastRecord.value);
  
        if (this.lastErrTime > 0) {
          const timeSinceError = Date.now() - this.lastErrTime;
          if (timeSinceError < errorTimeout) {
            // Wait for the error timeout to complete
            return concat(
              timer(errorTimeout - timeSinceError),
              observable
            );
          } else {
            // Error timeout has already passed, continue without delay
            this.lastErrTime = 0;
            return observable;
          }
        }
  
        return lastRecord.delay ? observable.pipe(delay(lastRecord.delay)) : observable;
      })
    );
  }

  // Get data with a batch of requests (respecting limits)
  fetchDataInParallel(
    inputMethod: (page: number, extendedAttributes) => Observable<AnimeData[]>,
    size: number,
    extendedAttributes?: PaginatedDataExtendedAttr
  ): Observable<AnimeData[]> {
    let totalErrors = 0;
    let errorsBetweenBatches = 0;
    if (size > 0) {
      const chunks = Math.max(Math.ceil(size / MAX_VALUES_REQUEST[ANIME_TYPE.ANIME]), 1);
      return this.rateLimit(
        range(1, chunks),
        NUMBER_OF_PARALLEL_CALLS,
        PAUSE_BETWEEN_BATCH_CALLS_DURATION,
        TOO_MANY_REQUESTS_PAUSE_DURATION
      ).pipe(
        mergeMap(page => {
          if (page === 0) return [];
            return inputMethod.bind(this).call(this, page, extendedAttributes).pipe(
            delay(250),
            tap(_=>errorsBetweenBatches = 0),
            retryWhen(errors => {
              return errors.pipe(concatMap((e, i) => {
                const timeBefore = this.lastFailedRequestTime;
                const timeNow = Date.now();
                totalErrors++;
                errorsBetweenBatches++;
                this.lastFailedRequestTime = Date.now();
                if (e?.networkError?.status === 429 && totalErrors < MAX_ALLOWED_ERRORS) {
                  if ((timeNow - timeBefore) > FORGIVABLE_ERROR_DURATION) {
                    return of(e).pipe(delay(100)); // May be caused by older requests still being pretty fresh
                  }
                  this.lastErrTime = timeNow;
                  return of(e).pipe(delay(10000 + errorsBetweenBatches * 200));
                }
                return throwError(e)
              }));
            })
          )
        }
        )) as Observable<AnimeData[]>;
    }
    return of([]);
  }

  // Get data page by page
  fetchPaginatedData<AnimeData>(
    inputMethod: (page: number, extendedAttributes) => Observable<AnimeData[]>,
    extendedAttributes?: PaginatedDataExtendedAttr
  ): Observable<AnimeData[]> {
    let isFetching = true;
    let curPage = 1;
    return inputMethod
      .bind(this)
      .call(this, curPage, extendedAttributes)
      .pipe(
      expand((_)=>{
        if (isFetching) {
          return inputMethod
          .bind(this)
          .call(this, curPage, extendedAttributes);
        }
        return EMPTY;
      }),
      takeWhile((fetchedData: AnimeData[]) => {
        if (isFetching) {
          if (fetchedData.length < (extendedAttributes.limit || MAX_VALUES_REQUEST[extendedAttributes?.targetType?.toLowerCase()])) {
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

