import {Pipe, PipeTransform} from '@angular/core';
import { TranslatePipe } from './translate.pipe';

@Pipe({
    name: 'dateAgo',
    pure: false
})
export class DateAgoPipe implements PipeTransform {

    constructor(private translatePipe: TranslatePipe) {}

    transform(value: any, args?: any): any {
        if (value) {
            const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
            if (seconds < 29)
                return this.translatePipe.transform('TIME_NOW');
            const intervals: { [key: string]: number } = {
                'year': 31536000,
                'month': 2592000,
                'week': 604800,
                'day': 86400,
                'hour': 3600,
                'minute': 60,
                'second': 1
            };
            let counter;
            for (const i in intervals) {
                counter = Math.floor(seconds / intervals[i]);
                if (counter > 0)
                    if (counter === 1) {
                        return counter + ' ' + this.translatePipe.transform(`${i}_ago`);
                    } else {
                        return counter + ' ' + this.translatePipe.transform(`${i}s_ago`);
                    }
            }
        }
        return value;
    }

}