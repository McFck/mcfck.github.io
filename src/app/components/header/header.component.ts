import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from 'src/app/services/translate.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
})
export class HeaderComponent implements OnInit {
  active = 1;

  headerRoutes = [
    { route: '/anime', title: 'Anime' },
    { route: '/movies', title: 'Movies' },
  ];

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private responsive: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.active = this.headerRoutes.findIndex(
          (routeObj) => val.url === routeObj.route
        );
      }
    });
  }

  localize(language: string): void {
    this.translateService.use(language);
  }
}
