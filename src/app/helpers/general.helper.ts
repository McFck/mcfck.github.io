import * as Highcharts from 'highcharts';
import { TranslatePipe } from '../components/shared/pipes/translate.pipe';
import { Anime } from '../models/dataModels';
import { MatPaginator } from '@angular/material/paginator';

export class GeneralHelper {
  public static getPluralForm(value: number, curLanguage: string): number {
    return curLanguage === 'en'
      ? Number(value != 1)
      : value % 10 === 1 && value % 100 !== 11
      ? 0
      : value % 10 >= 2 &&
        value % 10 <= 4 &&
        (value % 100 < 10 || value % 100 >= 20)
      ? 1
      : 2;
  }

  public static isDefined(value: any): boolean {
    return typeof value !== 'undefined' && value !== null;
  }

  public static shuffle(array: any[]) {
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  public static capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  public static selectValidLocaleName(data: Anime): string {
    if (data?.english) return data?.english;
    if (data?.synonyms) {
      const englishSynonym = data.synonyms.find(synonym=>/^[~`\s!@#$%^&*()_+=[\]\{}|;':",.\/<>?a-zA-Z0-9-]+$/.test(synonym));
      if (englishSynonym) return englishSynonym;
    }
    return data.name;
  }

  public static flatten(arr: any[]): any[] {
    return arr.reduce(function (flat, toFlatten) {
      return flat.concat(Array.isArray(toFlatten) ? GeneralHelper.flatten(toFlatten) : toFlatten);
    }, []);
  }

  public static translatePaginator(paginator: MatPaginator, translatePipe: TranslatePipe): void {
    if (paginator?._intl) {
      paginator._intl.itemsPerPageLabel =
        translatePipe.transform('ItemsPerPage');
      paginator._intl.nextPageLabel = translatePipe.transform('NextPage');
      paginator._intl.previousPageLabel =
        translatePipe.transform('PreviousPage');
      paginator._intl.getRangeLabel = (
        page: number,
        pageSize: number,
        length: number
      ) => {
        if (length == 0 || pageSize == 0) {
          return translatePipe.transform('OUT_OF', {
            first: 0,
            second: length,
          });
        }

        length = Math.max(length, 0);

        const startIndex = page * pageSize;

        // If the start index exceeds the list length, do not try and fix the end index to the end.
        const endIndex =
          startIndex < length
            ? Math.min(startIndex + pageSize, length)
            : startIndex + pageSize;

        return translatePipe.transform('N_OUT_OF', {
          first: startIndex + 1,
          second: endIndex,
          third: length,
        });
      };
      paginator._intl.changes.next();
    }
  }

  public static isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
}
