import { AnimeData, FullStatuses, LoadedShikiUser, ParsedGeneralProfileStats } from '../models/dataModels';

export class AnimeHelper {
  public static calculateScoreStatistics(data: AnimeData[]): number[] {
    const scoreArr: number[] = new Array(10).fill(0);
    for (let i = 0; i < data.length; i++) {
      if (data[i]?.score && data[i].score > 0) {
        scoreArr[data[i].score - 1]++;
      }
    }
    return scoreArr;
  }

  public static calculateMediumScoreStatistics(data: AnimeData[], len?: number): number {
    let sum = 0;
    data.forEach((dataEntry: AnimeData) => {
      if (dataEntry.score) {
        sum += dataEntry.score;
      }
    });
    return sum / (len || data.filter((dataEntry) => dataEntry.score).length) || 0;
  }

  public static calculateTotalEntries(dataObj: FullStatuses[]): number {
    let result = 0;
    dataObj.forEach(entry=>result+=entry.size);
    return result;
  }

  public static parseUserProfileStats(user: LoadedShikiUser): ParsedGeneralProfileStats {
    const result: ParsedGeneralProfileStats = {
      anime: {
        total: 0,
        medium: 0
      },
      manga: {
        total: 0,
        medium: 0
      },
      general: {
        medium: '0'
      }
    }

    result.anime.total = AnimeHelper.calculateTotalEntries(user.stats.full_statuses.anime);
    result.manga.total = AnimeHelper.calculateTotalEntries(user.stats.full_statuses.manga);

    let amount = 0;
    result.anime.medium = parseFloat(AnimeHelper.calculateMediumScoreStatistics(user.stats.scores.anime.map(entry=>{
      amount+= entry.value;
      return {
        score: entry.value*(Number(entry.name))
      }
    }), amount).toFixed(1));
    
    amount = 0;
    result.manga.medium = parseFloat(AnimeHelper.calculateMediumScoreStatistics(user.stats.scores.manga.map(entry=>{
      amount+= entry.value;
      return {
        score: entry.value*(Number(entry.name))
      }
    }), amount).toFixed(1));

    result.general.medium = !result.anime.medium || !result.manga.medium ? 
    (result.anime.medium || result.manga.medium) + '' :
    ((result.anime.medium + result.manga.medium) / 2).toFixed(1);
    
    return result;
  }
}
