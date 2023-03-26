import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { AnimeComponent } from './components/anime/anime.component';
import { MoviesComponent } from './components/movies/movies.component';
import { MiscComponent } from './components/misc/misc.component';
import { LandingComponent } from './components/landing/landing.component';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateService } from './services/translate.service';
import { TranslatePipe } from './pipes/translate.pipe';
import { AnimeHistoryComponent } from './components/anime-history/anime-history.component';
import { DateAgoPipe } from './pipes/dateAgo.pipe';
import { AnimeTimeComponent } from './components/anime-time/anime-time.component';
import { TopAnimeComponent } from './components/top-anime/top-anime.component';
import { AnimeStatsGraphicsComponent } from './components/anime-stats-graphics/anime-stats-graphics.component';
import { AnimeStatsListsComponent } from './components/anime-stats-lists/anime-stats-lists.component';
import { AnimeStatsTableComponent } from './components/anime-stats-table/anime-stats-table.component';

export function setupTranslateServiceFactory(
  service: TranslateService
): Function {
  return () => service.use('en');
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AnimeComponent,
    MoviesComponent,
    MiscComponent,
    LandingComponent,
    TranslatePipe,
    DateAgoPipe,
    AnimeHistoryComponent,
    AnimeTimeComponent,
    TopAnimeComponent,
    AnimeStatsGraphicsComponent,
    AnimeStatsListsComponent,
    AnimeStatsTableComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule
  ],
  providers: [
    TranslateService,
    {
      provide: APP_INITIALIZER,
      useFactory: setupTranslateServiceFactory,
      deps: [TranslateService],
      multi: true,
    },
    TranslatePipe
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
