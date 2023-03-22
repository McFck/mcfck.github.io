import { Component, Input, OnInit } from '@angular/core';
import { GeneralHelper } from 'src/app/helpers/general.helper';
import { AnimeData, ANIME_TYPE } from 'src/app/models/dataModels';
import { TranslateService } from 'src/app/services/translate.service';

const MINIMUM_ANIME_VALUE = 8;
const MINIMUM_MANGA_VALUE = 7;
const TOP_SELECTION_AMOUNT = 5;

@Component({
  selector: 'app-top-anime',
  templateUrl: './top-anime.component.html',
  styleUrls: ['./top-anime.component.less'],
})
export class TopAnimeComponent implements OnInit {
  @Input() set allData(data: Record<ANIME_TYPE, any[]>) {
    this.topArr = [
      ...this.maxValues(data.anime, TOP_SELECTION_AMOUNT, MINIMUM_ANIME_VALUE),
      ...this.maxValues(data.manga, TOP_SELECTION_AMOUNT, MINIMUM_MANGA_VALUE),
    ];
    this.topArr =  GeneralHelper.shuffle(this.topArr).slice(0, 3);
  }

  topArr: AnimeData[] = [];
  fieldName = 'name';
  imageDataPath = 'https://shikimori.one';

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
    amount: number,
    minimumValue: number
  ): AnimeData[] {
    if (!data || data.length === 0) {
      return [];
    }
    const values = data.sort((a, b) => b.score - a.score);

    if (values.length <= amount) return values;

    const maxN = values[amount - 1];

    return data.reduce(
      (o, v) =>
        v.score >= maxN.score && v.score >= minimumValue ? [...o, v] : o,
      []
    );
  }
}
