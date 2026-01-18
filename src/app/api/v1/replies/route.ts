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
        cache: 'no-store',
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { parentId, text } = body

    if (!parentId || !text) {
      return NextResponse.json(
        { error: 'parentId and text are required' },
        { status: 400 }
      )
    }

    const accessToken = await getAccessToken()

    const response = await fetch(
      `${YOUTUBE_DATA_API_URL}/comments?part=snippet`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          snippet: {
            parentId: parentId,
            textOriginal: text,
          },
        }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { error: 'Failed to insert reply', details: error },
        { status: response.status }
      )
    }

    const data = await response.json()

    const reply = {
      id: data.id,
      author: data.snippet.authorDisplayName,
      text: data.snippet.textDisplay,
      publishedAt: data.snippet.publishedAt,
      likeCount: data.snippet.likeCount,
    }

    return NextResponse.json({ reply }, { status: 201 })
  } catch (error) {
    console.error('Error inserting reply:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
