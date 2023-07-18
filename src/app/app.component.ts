import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, skip, startWith } from 'rxjs/operators';
import { TranslateService } from './services/translate.service';
import { Title } from '@angular/platform-browser';
import { TranslatePipe } from './pipes/translate.pipe';
import { register } from 'swiper/element/bundle';
import { DEFAULT_LANGUAGE } from './constants/generalConsts';

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

        localStorage.getItem("locale") && this.translationService.use(localStorage.getItem("locale"));

        const queryParams = this.router.parseUrl(event.url).queryParams;
        if (
          queryParams['lang'] &&
          queryParams['lang'] !== this.translationService.getLanguage()
        ) {
          this.translationService.use(queryParams['lang']);
        }
      });
  }
}
