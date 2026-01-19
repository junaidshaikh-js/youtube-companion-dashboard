import { getAccessToken } from '@/libs/youtubeAuth'
import { YOUTUBE_DATA_API_URL } from '@/constants'

export class YouTubeAPIError extends Error {
  status: number
  details: any

  constructor(message: string, status: number, details: any) {
    super(message)
    this.status = status
    this.details = details
  }
}

export async function youtubeClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const accessToken = await getAccessToken()
  const url = `${YOUTUBE_DATA_API_URL}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T
  }

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: 'Unknown error' }))
    throw new YouTubeAPIError(
      'YouTube API request failed',
      response.status,
      errorData
    )
  }

  return response.json()
}
