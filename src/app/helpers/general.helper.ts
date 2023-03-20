import * as Highcharts from 'highcharts';
import { TranslatePipe } from '../pipes/translate.pipe';

export class GeneralHelper {
    public static isDefined(value: any): boolean {
        return typeof value !== 'undefined' && value !== null;
    }
}
