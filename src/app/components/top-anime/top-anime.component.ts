import { Component, Input, OnInit } from '@angular/core';
import { BASE_ANIME_URL } from 'src/app/constants/generalConsts';
import { GeneralHelper } from 'src/app/helpers/general.helper';
import { AnimeData, ANIME_TYPE } from 'src/app/models/dataModels';
import { TranslateService } from 'src/app/services/translate.service';

const MINIMUM_ANIME_VALUE = 9;
const MINIMUM_MANGA_VALUE = 8;

@Component({
  selector: 'app-top-anime',
  templateUrl: './top-anime.component.html',
  styleUrls: ['./top-anime.component.less'],
})
export class TopAnimeComponent implements OnInit {
  @Input() set allData(data: Record<ANIME_TYPE, any[]>) {
    this.topArr = [
      ...this.maxValues(data.anime, MINIMUM_ANIME_VALUE),
      ...this.maxValues(data.manga, MINIMUM_MANGA_VALUE),
    ];
    this.topArr =  GeneralHelper.shuffle(this.topArr).slice(0, 3);
  }

  topArr: AnimeData[] = [];
  fieldName = 'name';
  imageDataPath = BASE_ANIME_URL;
  constructor(private translationService: TranslateService) {}

  ngOnInit(): void {
    this.translationService.localeChange.subscribe(() => {
      this.updateFieldName();
    });
  }

  updateFieldName(): void {
    this.fieldName =
      this.translationService.getLanguage() === 'ru' ? 'russian' : 'name';
  }

  maxValues(
    data: AnimeData[],
    minimumValue: number
  ): AnimeData[] {
    if (!data || data.length === 0) {
      return [];
    }

    return data.reduce(
      (o, v) =>
        v.score >= minimumValue ? [...o, v] : o,
      []
    );
  }
}
