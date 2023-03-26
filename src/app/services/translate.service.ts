import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TranslateService {
  selectedLanguage = 'en';
  data: any = {};

  constructor(private http: HttpClient) {}

  localeChange: EventEmitter<void> = new EventEmitter();

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
          this.selectedLanguage = lang;
          this.localeChange.emit();
        },
        (err) => {
          this.data = {};
          resolve(this.data);
        }
      );
    });
  }
}
