import { Component, Input, OnInit } from '@angular/core';
import { AnimeData } from 'src/app/models/dataModels';
import {A11y, Mousewheel, Navigation, Pagination, SwiperOptions, EffectCoverflow, Autoplay} from 'swiper';

@Component({
  selector: 'anime-community-data-swiper',
  templateUrl: './data-swiper.component.html',
  styleUrls: ['./data-swiper.component.less']
})
export class DataSwiperComponent implements OnInit {

  constructor() { }

  @Input()
  data: AnimeData[];

  @Input()
  isUserScoreHigher: boolean;

  ngOnInit(): void {
  }

  public config: SwiperOptions = {
    modules: [Navigation, Pagination, A11y, Mousewheel, EffectCoverflow, Autoplay],
    speed: 1000,
    centerInsufficientSlides: true,
    grabCursor: true,
    slidesPerView: 'auto',
    watchOverflow: true,
    freeMode: true
  }

}
