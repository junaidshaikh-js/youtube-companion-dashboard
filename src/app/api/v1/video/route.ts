import { NextResponse } from 'next/server'
import { getAccessToken } from '@/libs/youtubeAuth'
import { YOUTUBE_DATA_API_URL } from '@/constants'

export async function GET() {
  try {
    const accessToken = await getAccessToken()

    const params = new URLSearchParams({
      part: 'id,snippet',
      id: '1ynsm05FvM0',
    })

    const response = await fetch(
      `${YOUTUBE_DATA_API_URL}/videos?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { error: 'Failed to fetch video data', details: error },
        { status: response.status }
      )
    }

    const data = await response.json()

    const responseData = {
      id: data.items[0].id,
      title: data.items[0].snippet.title,
      description: data.items[0].snippet.description,
      thumbnail: data.items[0].snippet.thumbnails.high.url,
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Error fetching video:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
