import { Observable, of, throwError } from "rxjs";
import { delay, mergeMap } from "rxjs/operators";

export const genericRetryStrategy = ({
    maxRetryAttempts = 3,
    scalingDuration = 1000,
    excludedStatusCodes = []
  }: {
    maxRetryAttempts?: number,
    scalingDuration?: number,
    excludedStatusCodes?: number[]
  } = {}) => (attempts: Observable<any>) => {
    return attempts.pipe(
      mergeMap((error, i) => {
        const retryAttempt = i + 1;
        // if maximum number of retries have been met
        // or response is a status code we don't wish to retry, throw error
        if (
          retryAttempt > maxRetryAttempts ||
          excludedStatusCodes.find(e => e === error.status || e === error?.networkError?.status)
        ) {
          return throwError(error);
        }
        return of(error).pipe(delay(retryAttempt * scalingDuration));
      })
    );
  };