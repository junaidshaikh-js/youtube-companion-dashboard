import { NextRequest, NextResponse } from 'next/server'
import { youtubeClient, YouTubeAPIError } from '@/libs/youtubeClient'

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

    const params = new URLSearchParams({
      part: 'snippet',
      videoId: videoId,
      maxResults: '20',
      order: 'relevance',
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await youtubeClient<any>(
      `/commentThreads?${params.toString()}`
    )

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
    if (error instanceof YouTubeAPIError) {
      return NextResponse.json(
        { error: 'Failed to fetch comments', details: error.details },
        { status: error.status }
      )
    }
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await youtubeClient<any>(`/commentThreads?part=snippet`, {
      method: 'POST',
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
    })

    const comment = {
      id: data.id,
      author: data.snippet.topLevelComment.snippet.authorDisplayName,
      text: data.snippet.topLevelComment.snippet.textDisplay,
      publishedAt: data.snippet.topLevelComment.snippet.publishedAt,
    }

    return NextResponse.json({ comment }, { status: 201 })
  } catch (error) {
    if (error instanceof YouTubeAPIError) {
      return NextResponse.json(
        { error: 'Failed to insert comment', details: error.details },
        { status: error.status }
      )
    }
    console.error('Error inserting comment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const commentId = searchParams.get('commentId')

    if (!commentId) {
      return NextResponse.json(
        { error: 'commentId is required' },
        { status: 400 }
      )
    }

    await youtubeClient(`/comments?id=${commentId}`, {
      method: 'DELETE',
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    if (error instanceof YouTubeAPIError) {
      return NextResponse.json(
        { error: 'Failed to delete comment', details: error.details },
        { status: error.status }
      )
    }
    console.error('Error deleting comment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
