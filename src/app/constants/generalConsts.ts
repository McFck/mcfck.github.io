import { ANIME_TYPE } from '../models/dataModels';
import { environment } from 'src/environments/environment';

export const MAX_VALUES_REQUEST: Record<ANIME_TYPE, number> = {
  manga: 5000,
  anime: 5000,
};

export const MAX_ANIME_HISTORY_REQUEST = 2;

export const BASE_ANIME_URL = 'https://shikimori.me';
export const BASE_BACKEND_URL = environment.production ? 'https://babunov-personal.ru' : 'http://localhost:3000';

export enum MAIN_ANIME_STATUSES {
  PLANNED = 'planned',
  WATCHING = 'watching',
  COMPLETED = 'completed',
  ON_HOLD = 'on_hold',
  DROPPED = 'dropped',
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
  'Suspense': 41,
  'Romance': 22,
  'Sci-Fi': 24,
  'Ecchi': 9
}