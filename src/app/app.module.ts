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
import { TranslateService } from './services/translate.service';
import { TranslatePipe } from './pipes/translate.pipe';
import { AnimeHistoryComponent } from './components/anime-history/anime-history.component';
import { DateAgoPipe } from './pipes/dateAgo.pipe';
import { AnimeTimeComponent } from './components/anime-time/anime-time.component';

export function setupTranslateServiceFactory(
  service: TranslateService): Function {
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
    AnimeTimeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatMenuModule
  ],
  providers: [
    TranslateService,
    {
      provide: APP_INITIALIZER,
      useFactory: setupTranslateServiceFactory,
      deps: [
        TranslateService
      ],
      multi: true
    },
    TranslatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
