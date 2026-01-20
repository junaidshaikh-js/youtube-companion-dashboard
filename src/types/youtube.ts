export interface YouTubeResponse<T> {
  kind: string
  etag: string
  nextPageToken?: string
  pageInfo: {
    totalResults: number
    resultsPerPage: number
  }
  items: T[]
}

export interface YouTubeCommentThread {
  id: string
  snippet: {
    videoId: string
    topLevelComment: {
      id: string
      snippet: {
        authorDisplayName: string
        textDisplay: string
        publishedAt: string
        likeCount: number
      }
    }
    totalReplyCount: number
  }
}

export interface YouTubeComment {
  id: string
  snippet: {
    authorDisplayName: string
    textDisplay: string
    publishedAt: string
    likeCount: number
    parentId?: string
  }
}
