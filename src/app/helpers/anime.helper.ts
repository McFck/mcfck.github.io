import { AnimeData } from '../models/dataModels';

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

  public static calculateMediumScoreStatistics(data: AnimeData[]): number {
    let sum = 0;
    data.forEach((dataEntry: AnimeData) => {
      if (dataEntry.score) {
        sum += dataEntry.score;
      }
    });
    return sum / data.filter((dataEntry) => dataEntry.score).length;
  }
}
