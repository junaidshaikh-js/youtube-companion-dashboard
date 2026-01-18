import { NextRequest, NextResponse } from 'next/server'
import { getAccessToken } from '@/libs/youtubeAuth'
import { YOUTUBE_DATA_API_URL } from '@/constants'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const parentId = searchParams.get('parentId')

    if (!parentId) {
      return NextResponse.json(
        { error: 'parentId is required' },
        { status: 400 }
      )
    }

    const accessToken = await getAccessToken()

    const params = new URLSearchParams({
      part: 'snippet',
      parentId: parentId,
      maxResults: '50',
    })

    const response = await fetch(
      `${YOUTUBE_DATA_API_URL}/comments?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { error: 'Failed to fetch replies', details: error },
        { status: response.status }
      )
    }

    const data = await response.json()

    const replies =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.items?.map((item: any) => ({
        id: item.id,
        author: item.snippet.authorDisplayName,
        text: item.snippet.textDisplay,
        publishedAt: item.snippet.publishedAt,
        likeCount: item.snippet.likeCount,
      })) || []

    return NextResponse.json({ replies })
  } catch (error) {
    console.error('Error fetching replies:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
