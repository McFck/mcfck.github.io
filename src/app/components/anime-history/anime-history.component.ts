import { Component, Input, OnInit } from '@angular/core';
import { AnimeHistory } from 'src/app/models/dataModels';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';
import { TranslateService } from 'src/app/services/translate.service';

@Component({
  selector: 'app-anime-history',
  templateUrl: './anime-history.component.html',
  styleUrls: ['./anime-history.component.less']
})
export class AnimeHistoryComponent implements OnInit {

  constructor(
    private translationPipe: TranslatePipe,
    private translationService: TranslateService
  ) { }

  @Input()
  history: AnimeHistory[];

  historyFieldName = 'name';
  imageDataPath = "https://shikimori.one";

  ngOnInit(): void {
    this.translationService.localeChange.subscribe(() => {
      this.updateHistoryFieldName();
    });
  }

  updateHistoryFieldName(): void {
    this.historyFieldName = this.translationService.getLanguage() === 'ru' ? 'russian' : 'name';
  }

}
