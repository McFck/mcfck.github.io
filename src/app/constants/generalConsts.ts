import { ANIME_TYPE, BadgeMap } from '../models/dataModels';
import { environment } from 'src/environments/environment';

export const DEFAULT_LANGUAGE = 'en';
export const SUPPORTED_LANGUAGES = ['en', 'ru'];

export const MAX_VALUES_ANY_REQUEST = 50;

export const MAX_VALUES_REQUEST: Record<ANIME_TYPE, number> = {
  manga: 50,
  anime: 50
  // manga: 5000,
  // anime: 5000,
};

export const MAX_ANIME_HISTORY_REQUEST = 2;

export const BASE_ANIME_URL = 'https://shikimori.one';
export const BASE_BACKEND_URL = environment.production ? 'https://babunov-personal.ru' : 'http://localhost:3000';

export const SHIKI_DEFAULT_ID = "1121790";

export enum MAIN_ANIME_STATUSES {
  REWATCHING = 'rewatching',
  PLANNED = 'planned',
  WATCHING = 'watching',
  COMPLETED = 'completed',
  ON_HOLD = 'on_hold',
  DROPPED = 'dropped'
}

export const GENERAL_PARAMETERS_NAME_MAP = {
  anime: {
    episodes: 'Episodes',
    total: 'TOTAL_WATCHED_ANIME',
  },
  manga: {
    episodes: 'Chapters',
    total: 'TOTAL_READ_MANGA',
  },
};

export const MAIN_ANIME_GENRES_MAP = {
  'Action': 1,
  'Adventure': 2,
  'Comedy': 4,
  'Drama': 8,
  'Slice of Life': 36,
  'Fantasy': 10,
  'Supernatural': 37,
  'Horror': 14,
  'Mystery': 7,
  'Thriller': 41,
  'Romance': 22,
  'Sci-Fi': 24,
  'Ecchi': 9
}

export const BADGES_MAP: BadgeMap = {
  "Hidden gem": {
    icon: "💎",
    template: false
  },
  "Watched in original": {
    icon: "japan",
    template: true
  }
}