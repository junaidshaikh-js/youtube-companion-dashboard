import { NextRequest, NextResponse } from 'next/server'
import { getAccessToken } from '@/libs/youtubeAuth'
import { YOUTUBE_DATA_API_URL } from '@/constants'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const videoId = searchParams.get('videoId')

    if (!videoId) {
      return NextResponse.json(
        { error: 'videoId is required' },
        { status: 400 }
      )
    }

    const accessToken = await getAccessToken()

    const params = new URLSearchParams({
      part: 'snippet',
      videoId: videoId,
      maxResults: '20',
      order: 'relevance',
    })

    const response = await fetch(
      `${YOUTUBE_DATA_API_URL}/commentThreads?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { error: 'Failed to fetch comments', details: error },
        { status: response.status }
      )
    }

    const data = await response.json()

    const comments =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.items?.map((item: any) => ({
        id: item.id,
        author: item.snippet.topLevelComment.snippet.authorDisplayName,
        text: item.snippet.topLevelComment.snippet.textDisplay,
        publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
        likeCount: item.snippet.topLevelComment.snippet.likeCount,
        replyCount: item.snippet.totalReplyCount || 0,
      })) || []

    return NextResponse.json({ comments })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { videoId, text } = body

    if (!videoId || !text) {
      return NextResponse.json(
        { error: 'videoId and text are required' },
        { status: 400 }
      )
    }

    const accessToken = await getAccessToken()

    const response = await fetch(
      `${YOUTUBE_DATA_API_URL}/commentThreads?part=snippet`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          snippet: {
            videoId: videoId,
            topLevelComment: {
              snippet: {
                textOriginal: text,
              },
            },
          },
        }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { error: 'Failed to insert comment', details: error },
        { status: response.status }
      )
    }

    const data = await response.json()

    const comment = {
      id: data.id,
      author: data.snippet.topLevelComment.snippet.authorDisplayName,
      text: data.snippet.topLevelComment.snippet.textDisplay,
      publishedAt: data.snippet.topLevelComment.snippet.publishedAt,
    }

    return NextResponse.json({ comment }, { status: 201 })
  } catch (error) {
    console.error('Error inserting comment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
