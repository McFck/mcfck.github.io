import gql from 'graphql-tag';

export const getUserRatesAnime = gql`
query($page: Int = 1, $limit: Int = 50, $userId: ID, $targetType: UserRateTargetTypeEnum!) {
    userRates(page: $page, userId: $userId, limit: $limit, targetType:$targetType){
      anime {
        episodes,
        id,
        duration,
        genres {
          id,
          name
        }
        poster {
          originalUrl,
          previewAlt2xUrl,
          miniAltUrl
        }
        kind,
        english,
        russian,
        name,
        synonyms,
        status,
        url
      }
      chapters,
      createdAt,
      episodes,
      id,
      rewatches,
      score,
      status,
      text,
      updatedAt,
      volumes
    }
}
`

export const getUserRatesManga = gql`
query($page: Int = 1, $limit: Int = 50, $userId: ID, $targetType: UserRateTargetTypeEnum!) {
  userRates(page: $page, userId: $userId, limit: $limit, targetType:$targetType){
    manga {
      chapters,
      id,
      genres {
        id,
        name
      }
      poster {
        originalUrl,
        previewAlt2xUrl,
        miniAltUrl
      }
      kind,
      english,
      russian,
      name,
      synonyms,
      status,
      url
    }
    chapters,
      createdAt,
      episodes,
      id,
      rewatches,
      score,
      status,
      text,
      updatedAt,
      volumes
  }
}
`