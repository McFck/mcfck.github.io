import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, startWith } from 'rxjs/operators';
import { TranslateService } from './services/translate.service';
import { Title } from '@angular/platform-browser';
import { TranslatePipe } from './pipes/translate.pipe';
import { register } from 'swiper/element/bundle'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'personal';
  
  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private translationService: TranslateService,
    private translationPipe: TranslatePipe,
    private titleService: Title
    ) {
      register();
    }
  
  ngOnInit() {
    this.translationService.localeChange.pipe(startWith()).subscribe(()=>{
      this.titleService.setTitle(this.translationPipe.transform("TITLE"));

      const queryParams = this.router.parseUrl(this.router.url).queryParams;
      if (queryParams["lang"]) {
        this.router.navigate(
          [], 
          {
            relativeTo: this.activatedRoute,
            queryParams: { lang: this.translationService.getLanguage() },
            queryParamsHandling: 'merge'
          });
      }
    })

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const queryParams = this.router.parseUrl(event.url).queryParams;
      if (queryParams["lang"]) {
        this.translationService.use(queryParams["lang"]);
      }
    });
  }

}
