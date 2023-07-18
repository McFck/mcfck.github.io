import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnimeComponent } from './components/anime/anime.component';
import { LandingComponent } from './components/landing/landing.component';
import { MiscComponent } from './components/misc/misc.component';
import { MoviesComponent } from './components/movies/movies.component';

const routes: Routes = [
  { path: 'anime', component: AnimeComponent },
  { path: 'games', component: MoviesComponent },
  { path: 'misc', component: MiscComponent },
  { path: '', component: LandingComponent },
]


@NgModule({
  imports: [RouterModule.forRoot(routes,{paramsInheritanceStrategy: 'always'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
