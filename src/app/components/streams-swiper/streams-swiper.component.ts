import {Component, Input, ViewEncapsulation} from '@angular/core';
import { BASE_ANIME_URL } from 'src/app/constants/generalConsts';
import { AnimeData } from 'src/app/models/dataModels';
import {A11y, Mousewheel, Navigation, Pagination, SwiperOptions, EffectCoverflow, Autoplay} from 'swiper';

@Component({
  selector: 'fm-streams-swiper',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './streams-swiper.component.html',
  styleUrls: ['./streams-swiper.component.less'],
})
export class StreamsSwiperComponent {

  @Input() set topArr(val: any) {
    this._topArr = [...val,...val]
  }
  _topArr: AnimeData[] = [];
  @Input()
  fieldName: string;

  imageDataPath = BASE_ANIME_URL;
  
  public config: SwiperOptions = {
    modules: [Navigation, Pagination, A11y, Mousewheel, EffectCoverflow, Autoplay],
    injectStyles: [
      `
      swiper-container {
        width: 330px;
        padding-top: 50px;
        padding-bottom: 50px;
      }
      swiper-slide{
        width: 210px;
      }
      `
    ],
    loop: true,
    speed: 1000,
    autoplay: {
        delay: 2000,
        disableOnInteraction: false
    },
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    coverflowEffect: {
        rotate: 0,
        stretch: 80,
        depth: 200,
        modifier: 1,
        slideShadows: false,
    }
  }
}