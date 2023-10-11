import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
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
import { TranslatePipe } from './components/shared/pipes/translate.pipe';
import { AnimeHistoryComponent } from './components/anime-history/anime-history.component';
import { DateAgoPipe } from './components/shared/pipes/dateAgo.pipe';
import { AnimeTimeComponent } from './components/anime-time/anime-time.component';
import { TopAnimeComponent } from './components/top-anime/top-anime.component';
import { AnimeStatsGraphicsComponent } from './components/anime-stats-graphics/anime-stats-graphics.component';
import { AnimeStatsListsComponent } from './components/anime-stats-lists/anime-stats-lists.component';
import { AnimeStatsTableComponent } from './components/anime-stats-table/anime-stats-table.component';
import { ResponsiveTemplateDirective } from './directives/ResponsiveTemplateDirective';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SwiperDirective } from './directives/SwiperDirective';
import { StreamsSwiperComponent } from './components/streams-swiper/streams-swiper.component';
import { NgTemplateNameDirective } from './directives/TemplateNameDirective';
import { LanguageContentPipe } from './components/shared/pipes/languageContent.pipe';
import { GraphQLModule } from './graphql.module';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { CustomIdFieldComponent } from './components/custom-id-field/custom-id-field.component';
import { FormsModule } from '@angular/forms';
import { EmptyTypedDataComponent } from './components/empty-typed-data/empty-typed-data.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { RedirectBlockComponent } from './components/redirect-block/redirect-block.component';
import { CompareComponent } from './components/compare/compare.component';
import { SharedModule } from './components/shared/shared.module';
import { CmpUserCardComponent } from './components/compare/cmp-user-card/cmp-user-card.component';
import {MatTabsModule} from '@angular/material/tabs';
import { CompareTableComponent } from './components/compare/compare-table/compare-table.component';
import { CompareListsComponent } from './components/compare/compare-lists/compare-lists.component';

export function setupTranslateServiceFactory(
  service: TranslateService
): Function {
  return () => localStorage.getItem("locale") ? service.use(localStorage.getItem("locale")) : service.use('en');
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AnimeComponent,
    MoviesComponent,
    MiscComponent,
    LandingComponent,
    AnimeHistoryComponent,
    AnimeTimeComponent,
    TopAnimeComponent,
    AnimeStatsGraphicsComponent,
    AnimeStatsListsComponent,
    AnimeStatsTableComponent,
    ResponsiveTemplateDirective,
    SwiperDirective,
    NgTemplateNameDirective,
    StreamsSwiperComponent,
    CustomIdFieldComponent,
    EmptyTypedDataComponent,
    RedirectBlockComponent,
    CompareComponent,
    CmpUserCardComponent,
    CompareTableComponent,
    CompareListsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    SharedModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatButtonModule,
    MatTabsModule,
    FlexLayoutModule,
    GraphQLModule,
    FormsModule,
    SharedModule
  ],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink) {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: 'https://shikimori.me/api/graphql',
          }),
          defaultOptions: {
            watchQuery: {
              fetchPolicy: 'no-cache',
              errorPolicy: 'all',
            },
            query: {
              fetchPolicy: 'no-cache',
              errorPolicy: 'all',
            },
          }
        };
      },
      deps: [HttpLink],
    },
    TranslateService,
    {
      provide: APP_INITIALIZER,
      useFactory: setupTranslateServiceFactory,
      deps: [TranslateService],
      multi: true,
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
