import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, skip, startWith } from 'rxjs/operators';
import { TranslateService } from './services/translate.service';
import { Title } from '@angular/platform-browser';
import { TranslatePipe } from './pipes/translate.pipe';
import { register } from 'swiper/element/bundle';
import { SUPPORTED_LANGUAGES } from './constants/generalConsts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  title = 'personal';

  constructor(
    private router: Router,
    private translationService: TranslateService,
    private translationPipe: TranslatePipe,
    private titleService: Title
  ) {
    register();
  }

  ngOnInit() {
    setTimeout(() => {
      this.titleService.setTitle(this.translationPipe.transform('TITLE'));
    });

    this.translationService.localeChange.pipe(skip(1)).subscribe(() => {
      setTimeout(() => {
        this.titleService.setTitle(this.translationPipe.transform('TITLE'));
      });
      localStorage.setItem("locale", this.translationService.getLanguage());
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        setTimeout(() => {
          this.titleService.setTitle(this.translationPipe.transform('TITLE'));
        });

        if (localStorage.getItem("locale")) {
          this.translationService.use(localStorage.getItem("locale"));
        } else {
          const userLanguage = navigator.language.slice(0,2);
          SUPPORTED_LANGUAGES.includes(userLanguage) && this.translationService.use(userLanguage) && localStorage.setItem("locale", userLanguage);
        }
      });
  }
}
