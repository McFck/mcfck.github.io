import {
  AfterContentInit,
  AfterViewInit,
  Component,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import { BASE_ANIME_URL } from 'src/app/constants/generalConsts';
import { GeneralHelper } from 'src/app/helpers/general.helper';
import { AnimeData, ANIME_TYPE } from 'src/app/models/dataModels';
import { TranslateService } from 'src/app/services/translate.service';
import Swiper from 'swiper';

const MINIMUM_ANIME_VALUE = 9;
const MINIMUM_MANGA_VALUE = 8;

@Component({
  selector: 'app-top-anime',
  templateUrl: './top-anime.component.html',
  styleUrls: ['./top-anime.component.less'],
})
export class TopAnimeComponent implements OnInit, AfterContentInit {
  @Input() set allData(data: Record<ANIME_TYPE, any[]>) {
    
    for (let type of Object.keys(data)) {
      data[type].forEach((entry:any)=> {
        entry[type].thumbnail = entry?.["__typename"] ? 
        (entry.anime?.poster?.previewAlt2xUrl || entry.manga?.poster?.previewAlt2xUrl) :
        BASE_ANIME_URL + '/' + (entry.anime?.image?.original || entry.manga?.image?.original);
        entry[type].url = entry?.["__typename"] ? (entry.anime?.url || entry.manga?.url) : `${BASE_ANIME_URL}/${entry.anime?.url || entry.manga?.url}`;
      });
    }

    this.topArr = [
      ...this.maxValues(data.anime, MINIMUM_ANIME_VALUE),
      ...this.maxValues(data.manga, MINIMUM_MANGA_VALUE),
    ];
    this.topArr = GeneralHelper.shuffle(this.topArr).slice(0, 3);
  }

  topArr: AnimeData[] = [];
  fieldName = 'name';
  imageDataPath = BASE_ANIME_URL;
  constructor(private translationService: TranslateService) {}

  public getScreenWidth: any;
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
  }

  ngOnInit(): void {
    var mySwiper = new Swiper('.swiper-container', {
      loop: true,
      speed: 1000,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
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
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });

    this.translationService.localeChange.subscribe(() => {
      this.updateFieldName();
    });
  }

  ngAfterContentInit(): void {
    this.getScreenWidth = window.innerWidth;
  }

  updateFieldName(): void {
    this.fieldName =
      this.translationService.getLanguage() === 'ru' ? 'russian' : 'name';
  }

  maxValues(data: AnimeData[], minimumValue: number): AnimeData[] {
    if (!data || data.length === 0) {
      return [];
    }

    return data.reduce((o, v) => (v.score >= minimumValue ? [...o, v] : o), []);
  }
}
