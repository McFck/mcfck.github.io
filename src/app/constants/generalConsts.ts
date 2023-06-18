import { ANIME_TYPE } from '../models/dataModels';

export const MAX_VALUES_REQUEST: Record<ANIME_TYPE, number> = {
  manga: 5000,
  anime: 5000,
};

export const MAX_ANIME_HISTORY_REQUEST = 2;

export const BASE_ANIME_URL = 'https://shikimori.me';
export const BASE_BACKEND_URL = 'http://localhost:3000'; //CHANGE ME;

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