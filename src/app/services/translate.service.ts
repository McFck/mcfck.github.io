import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TranslateService {

  data: any = {};

  constructor(private http: HttpClient) {}

  localeChange: EventEmitter<void> = new EventEmitter();
  
  use(lang: string): Promise<{}> {
    return new Promise<{}>(resolve => {
      const langPath = `assets/i18n/${lang || 'en'}.json`;

      this.http.get(langPath).subscribe(
        response => {
          this.data = response || {};
          resolve(this.data);
          this.localeChange.emit();
        },
        err => {
          this.data = {};
          resolve(this.data);
        }
      );
    });
  }
}