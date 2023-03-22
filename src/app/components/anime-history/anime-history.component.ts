import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AnimeHistory } from 'src/app/models/dataModels';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';
import { AnimeService } from 'src/app/services/anime.service';
import { TranslateService } from 'src/app/services/translate.service';

@Component({
  selector: 'app-anime-history',
  templateUrl: './anime-history.component.html',
  styleUrls: ['./anime-history.component.less'],
})
export class AnimeHistoryComponent implements OnInit {
  constructor(
    private translationPipe: TranslatePipe,
    private translationService: TranslateService,
    private animeService: AnimeService
  ) {}

  isHistoryLoading = true;

  history: AnimeHistory[];

  historyFieldName = 'name';
  imageDataPath = 'https://shikimori.one';

  ngOnInit(): void {
    this.getHistory();
    this.translationService.localeChange.subscribe(() => {
      this.updateHistoryFieldName();
      this.getHistory();
    });
  }

  getHistory(): void {
    this.isHistoryLoading = true;
    this.animeService
      .getUserHistory()
      .pipe(
        tap(() => {
          this.isHistoryLoading = false;
        })
      )
      .subscribe((fetchedHistory: AnimeHistory[]) => {
        this.history = fetchedHistory;
      });
  }

  updateHistoryFieldName(): void {
    this.historyFieldName =
      this.translationService.getLanguage() === 'ru' ? 'russian' : 'name';
  }

  goToHistory(url: string): void {
    window.location.href = url;
  }
}
