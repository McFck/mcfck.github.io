import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { BASE_ANIME_URL, MAIN_ANIME_STATUSES } from 'src/app/constants/generalConsts';
import { AnimeData } from 'src/app/models/dataModels';
import { TableListComponent } from '../shared/table-list/table-list.component';

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
  styleUrls: ['./anime-stats-lists.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class AnimeStatsListsComponent extends TableListComponent<TableData> implements AfterViewInit {

  isAnime = false;

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
          updatedAt: entry?.updatedAt,
          chapters: entry.manga?.chapters,
          thumbnail: entry?.["__typename"] ? (
            entry.anime?.poster?.miniUrl || entry.manga?.poster?.miniUrl) :
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
          this.dataSources.push({
            key: status, 
            data: filteredValues,
            defaultSort: 'score',
            summary: {
              episodes: totalEpisodes,
              filtered: null
            }
          })
        }
      }
      this.isAnime = value.findIndex((entry)=>entry.anime?.episodes > 0) !== -1;
      this.dataSources.find(entry=>entry.key === MAIN_ANIME_STATUSES.PLANNED).defaultSort = "updatedAt";
    }
  }

  constructor(cdr: ChangeDetectorRef) {
    super(cdr)
  }

  ngAfterViewInit(): void {
    this.afterViewInitRoutine();
  }

  updateFilteredData(filteredData: TableData[], sourceKey: string): void {
    let episodes = 0;
    filteredData.forEach((entry)=>episodes += entry.chaptersRead || entry.episodesWatched);
    this.dataSources.find(source=>source.key === sourceKey).summary.filtered = episodes;
    this.dataSources = [...this.dataSources];
    this.updateTableVisibility(filteredData.length === 0, sourceKey);
  }
}
