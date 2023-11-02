import { TableData } from "../components/anime-stats-lists/anime-stats-lists.component";
import { MAIN_ANIME_STATUSES } from "../constants/generalConsts";

export enum ANIME_TYPE {
  ANIME = 'anime',
  MANGA = 'manga'
}

export interface BadgeMap {
  [key: string]: {
    icon: string;
    template: boolean;
  }
}

export interface AnimeHistory {
  created_at: Date,
  description: string,
  id: number,
  target: AnimeHistoryTarget
}

interface AnimeHistoryTarget {
  aired_on: string,
  chapters: number,
  id: number,
  image: Image,
  kind: ANIME_TYPE,
  name: string,
  malUrl?:string,
  released_on: string,
  russian: string,
  score: string,
  status: string,
  url: string;
  volumes: number;
}

export interface Tooltip {
  headerName: string;
  pointName: string;
}

export interface AnimeData {
  anime?: Anime;
  chapters?: number;
  created_at?: Date;
  episodes?: number;
  id?: number;
  manga?: any; //TODO: Check cases
  rewatches?: number;
  score?: number;
  status?: string;
  text?: string;
  text_html?: string;
  updated_at?: Date;
  user?: User;
  volumes?: number;
  updatedAt?: Date;
  diffMe?: number;
  diffThem?: number
}

export interface ParsedGeneralProfileStats {
  anime: {
    total: number,
    medium: number
  },
  manga: {
    total: number,
    medium: number
  },
  general?: {
    medium?: string
  }
}

export interface CompareUsers {
  left?: LoadedShikiUser;
  right?: LoadedShikiUser;
}

export interface CompareEntries {
  left?: AnimeData[];
  right?: AnimeData[];
  common?: {
    left: AnimeData[],
    right: AnimeData[],
    obj: Anime[]
  };
}

export interface LoadedShikiUser {
  url?: string;
  id?: string;
  avatar?: string;
  image?: ImageAvatar;
  nickname?: string;
  stats?: {
    full_statuses?: {
      anime?: FullStatuses[];
      manga?: FullStatuses[];
    }
    scores?: {
      anime?: Scores[],
      manga?: Scores[]
    }
  };
  userData?: Record<ANIME_TYPE, any[]>
}

interface Scores {
  name: string;
  value: number;
}

export interface FullStatuses {
  id: number;
  grouped_id: string;
  name: string;
  size: number;
  type: string;
}

export interface Anime {
  aired_on?: Date;
  episodes?: number;
  thumbnail?: string;
  episodes_aired?: number;
  id?: number;
  image?: Image;
  poster?: Poster;
  kind?: string;
  name?: string;
  english?: string;
  synonyms?: [];
  malUrl?: string;
  released_on?: string;
  russian?: string;
  score?: string;
  status?: string;
  url?: string;
}

interface ImageAvatar extends Image {
  x16?: string;
  x32?: string;
  x48?: string;
  x64?: string;
}

interface Image {
  original?: string;
  preview?: string;
  x48?: string;
  x96?: string;
}

interface Poster {
  id: string
  main2xUrl: string
  mainAlt2xUrl: string
  mainAltUrl: string
  mainUrl: string
  mini2xUrl: string
  miniAlt2xUrl: string
  miniAltUrl: string
  miniUrl: string
  originalUrl: string
  preview2xUrl: string
  previewAlt2xUrl: string
  previewAltUrl: string
  previewUrl: string
  }

interface UserImage extends Image {
  x16?: string;
  x32?: string;
  x64?: string;
  x80?: string;
  x148?: string;
  x160?: string;
}

interface User {
  avatar?: string;
  id?: number;
  image?: UserImage;
  last_online_at?: Date;
  nickname?: string;
  url?: string;
}

export interface PieChartDTO {
  tooltip: PieChartTooltip;
  chartTitle: string;
  chartDivId: string;
  valuePath: string[];
  dataNamesPath: string[];
}

interface PieChartTooltip {
  header: string;
  point: string;
}

export interface AnimeMangaStatistics {
  totalAmount?: number;
  mediumScore?: string;
  scoreChart?: number[];
}

export interface DataSourceTransfer {
  key: MAIN_ANIME_STATUSES, 
  data: TableData[], 
  summary: {
    episodes: number;
    filtered: number;
  },
  defaultSort?: string;
}

export interface GithubCommitData {
  author: {
    avatar_url: string;
    login: string;
    html_url: string;
  }
  commit: {
    author: {
      date: string;
      email: string;
      name: string;
    }
    url: string;
    message: string;
  }
  html_url: string;
}