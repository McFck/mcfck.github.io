import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DEFAULT_LANGUAGE } from 'src/app/constants/generalConsts';
import { TranslateService } from 'src/app/services/translate.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
})
export class HeaderComponent implements OnInit {
  active = 1;
  displayedText: string;

  headerRoutes = [
    { route: '/anime', title: 'Anime' },
    { route: '/games', title: 'Games' },
  ];

  utilityRoutes = [
    { route: '/anime/compare', title: 'Comparator'},
    { route: '/anime/recommendations', title: 'Recommendations'},
  ]

  selectedLanguage = DEFAULT_LANGUAGE;

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private responsive: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.active = this.headerRoutes.findIndex(
          (routeObj) => val.url?.includes(routeObj.route)
        );
        this.displayedText = this.utilityRoutes.find(
          (routeObj) => val.url?.includes(routeObj.route)
        )?.title;
      }
    });

    this.translateService.localeChange.subscribe(()=>{
      this.selectedLanguage = this.translateService.getLanguage();
    })
  }

  localize(language: string): void {
    this.translateService.use(language);
  }
}
