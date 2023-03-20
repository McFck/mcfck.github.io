import { ANIME_TYPE } from "../models/dataModels";

export const MAX_VALUES_REQUEST: Record<ANIME_TYPE, number> = {
    'manga': 5000,
    'anime': 5000
}

export const MAX_ANIME_HISTORY_REQUEST = 2;