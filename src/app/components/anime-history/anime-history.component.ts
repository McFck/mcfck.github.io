import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BASE_ANIME_URL } from 'src/app/constants/generalConsts';
import { ANIME_TYPE, AnimeHistory } from 'src/app/models/dataModels';
import { LanguageContentPipe } from 'src/app/pipes/languageContent.pipe';
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
    private languageContentPipe: LanguageContentPipe,
    private translationService: TranslateService,
    private animeService: AnimeService
  ) {}

  @Input()
  data: Record<ANIME_TYPE, any[]>;

  isHistoryLoading = true;

  history: AnimeHistory[];

  historyFieldName = 'name';
  imageDataPath = BASE_ANIME_URL;

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

        this.history?.forEach((entry:any)=>{
          const fullEntry = this.data?.anime?.find(el => el.anime.id === entry.target.id) || this.data?.manga?.find(el => el.manga.id === entry.target.id)
          entry.target.malUrl = `https://myanimelist.net/${fullEntry.anime ? "anime" : "manga"}/${entry.target.id}`;
        });
      });
  }

  updateHistoryFieldName(): void {
    this.historyFieldName =
      this.translationService.getLanguage() === 'ru' ? 'russian' : 'name';
  }

  goToHistory(url: string, defaultUrl: string): void {
    window.location.href = this.languageContentPipe.transform(url, "ru", defaultUrl);
  }
}
