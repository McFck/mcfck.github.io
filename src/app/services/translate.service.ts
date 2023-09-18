import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { DEFAULT_LANGUAGE } from '../constants/generalConsts';

@Injectable({ providedIn: 'root' })
export class TranslateService {
  selectedLanguage = 'en';
  data: any = {};

  constructor(private http: HttpClient) {}

  localeChange: BehaviorSubject<void> = new BehaviorSubject<void>(null);

  getLanguage(): string {
    return this.selectedLanguage;
  }

  use(lang: string): Promise<{}> {
    return new Promise<{}>((resolve) => {
      const langPath = `assets/i18n/${lang || 'en'}.json`;

      this.http.get(langPath).subscribe(
        (response) => {
          this.data = response || {};
          resolve(this.data);
          const previous = this.selectedLanguage;
          this.selectedLanguage = lang;
          previous !== this.selectedLanguage && this.localeChange.next();
        },
        (err) => {
          if (lang == DEFAULT_LANGUAGE) {
            this.data = {};
            resolve(this.data);
          } else {
            this.use(DEFAULT_LANGUAGE)
          }
        }
      );
    });
  }
}
