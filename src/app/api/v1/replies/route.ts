import { NextRequest, NextResponse } from 'next/server'
import { youtubeClient, YouTubeAPIError } from '@/libs/youtubeClient'

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

    const params = new URLSearchParams({
      part: 'snippet',
      parentId: parentId,
      maxResults: '50',
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await youtubeClient<any>(`/comments?${params.toString()}`, {
      cache: 'no-store',
    })

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
    if (error instanceof YouTubeAPIError) {
      return NextResponse.json(
        { error: 'Failed to fetch replies', details: error.details },
        { status: error.status }
      )
    }
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await youtubeClient<any>(`/comments?part=snippet`, {
      method: 'POST',
      body: JSON.stringify({
        snippet: {
          parentId: parentId,
          textOriginal: text,
        },
      }),
    })

    const reply = {
      id: data.id,
      author: data.snippet.authorDisplayName,
      text: data.snippet.textDisplay,
      publishedAt: data.snippet.publishedAt,
      likeCount: data.snippet.likeCount,
    }

    return NextResponse.json({ reply }, { status: 201 })
  } catch (error) {
    if (error instanceof YouTubeAPIError) {
      return NextResponse.json(
        { error: 'Failed to insert reply', details: error.details },
        { status: error.status }
      )
    }
    console.error('Error inserting reply:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
