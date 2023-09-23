import {
  Component,
  ElementRef,
  Input,
  QueryList,
  ViewChildren
} from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatExpansionPanel } from '@angular/material/expansion';
import { BASE_ANIME_URL, MAIN_ANIME_STATUSES } from 'src/app/constants/generalConsts';
import { AnimeData, DataSourceTransfer } from 'src/app/models/dataModels';
import { TranslateService } from 'src/app/services/translate.service';

export interface TableData {
  name: string;
  russian: string;
  url: string;
  score: number;
  status: string;
  myStatus: string;
  episodesWatched: number;
  text: string;
  episodes: number;
  chapters: number,
  chaptersRead: number,
  kind: string;
}

@Component({
  selector: 'app-anime-stats-lists',
  templateUrl: './anime-stats-lists.component.html',
  styleUrls: ['./anime-stats-lists.component.less']
})
export class AnimeStatsListsComponent {
  @ViewChildren("extensionPanels") 
  extensionPanels: QueryList<MatExpansionPanel>;

  dataSources: DataSourceTransfer[] = [];
  isAnime = false;
  filterValue: Event;
  expansionObj = {
    isAllExpanded: true,
    expandedKeys: []
  }

  @Input() set data(value: AnimeData[]) {
    if (value?.length > 0) {
      const mappedValues: TableData[] = value.map((entry: AnimeData, index) => {
        return {
          name: entry.anime?.name || entry.manga?.name,
          russian: entry.anime?.russian || entry.manga?.russian,
          score: entry.score === 0 ? undefined : entry.score,
          kind: entry.anime?.kind || entry.manga?.kind,
          status: entry.anime?.status || entry.manga?.status,
          myStatus: entry.status,
          text: entry.text,
          episodesWatched: entry.episodes,
          episodes: entry.anime?.episodes,
          chaptersRead: entry.chapters,
          chapters: entry.manga?.chapters,
          thumbnail: entry?.["__typename"] ? (
            entry.anime?.poster?.miniAltUrl || entry.manga?.poster?.miniAltUrl) :
            BASE_ANIME_URL + '/' + (entry.anime?.image?.x48 || entry.manga?.image?.x48),
          url: entry?.["__typename"] ? (entry.anime?.url || entry.manga?.url) : `${BASE_ANIME_URL}/${entry.anime?.url || entry.manga?.url}`,
          malUrl: entry.anime?.malUrl || entry.manga?.malUrl
        };
      });

      let filteredValues: TableData[];
      let totalEpisodes: number;
      for (let status of Object.values(MAIN_ANIME_STATUSES)) {
        totalEpisodes = 0;
        filteredValues = mappedValues.filter((value: TableData)=>value.myStatus === status);
        filteredValues.forEach((entry)=>totalEpisodes += entry.chaptersRead || entry.episodesWatched);
        if (filteredValues.length > 0) {
          this.dataSources.push({key: status, data: filteredValues, summary: {
            episodes: totalEpisodes
          }})
          this.expansionObj.expandedKeys = this.dataSources.map(source=>source.key);
        }
      }
      this.isAnime = value.findIndex((entry)=>entry.anime?.episodes > 0) !== -1;
    }
  }

  constructor(private translationService: TranslateService) {}

  applyFilter(event: Event): void {
    this.filterValue = event;
  }

  updateExpansionValue(value: boolean, source): void {
    const index = this.expansionObj.expandedKeys.indexOf(source.key);
    if (value && index === -1) {
      this.expansionObj.expandedKeys.push(source.key);
    } else if(!value) {
      this.expansionObj.expandedKeys = this.expansionObj.expandedKeys.filter(key=>key!==source.key);
    }
    this.expansionObj.isAllExpanded = this.expansionObj.expandedKeys.length === this.dataSources.length;
  }

  updateExpansionPanels(value: MatCheckboxChange): void {
    if (value.checked) {
      this.extensionPanels.forEach(panel=>panel.open());
    } else {
      this.extensionPanels.forEach(panel=>panel.close());
    }
  }
}
