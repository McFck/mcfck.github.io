import * as Highcharts from 'highcharts';
import { TranslatePipe } from '../pipes/translate.pipe';

export class GeneralHelper {
    public static getPluralForm(value: number, curLanguage: string): number {
        return curLanguage === 'en' ? Number(value != 1):
         (value % 10 === 1 && value % 100 !== 11) ? 0 : value % 10 >= 2 && value % 10 <= 4 && (value % 100 < 10 || value % 100 >= 20) ? 1 : 2;
    }

    public static isDefined(value: any): boolean {
        return typeof value !== 'undefined' && value !== null;
    }

    public static shuffle(array: any[]) {
        let currentIndex = array.length,  randomIndex;
      
        while (currentIndex != 0) {
      
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;

          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      
        return array;
      }
}
