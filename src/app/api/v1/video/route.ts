import { NextResponse } from 'next/server'
import { youtubeClient, YouTubeAPIError } from '@/libs/youtubeClient'

export async function GET() {
  try {
    const params = new URLSearchParams({
      part: 'id,snippet',
      id: '1ynsm05FvM0',
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await youtubeClient<any>(`/videos?${params.toString()}`)

    const responseData = {
      id: data.items[0].id,
      title: data.items[0].snippet.title,
      description: data.items[0].snippet.description,
      thumbnail: data.items[0].snippet.thumbnails.high.url,
    }

    return NextResponse.json(responseData)
  } catch (error) {
    if (error instanceof YouTubeAPIError) {
      return NextResponse.json(
        { error: 'Failed to fetch video data', details: error.details },
        { status: error.status }
      )
    }
    console.error('Error fetching video:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  try {
    const { title, description } = await req.json()
    const videoId = '1ynsm05FvM0' // Hardcoded for now as per current GET logic

    if (!title || !description) {
      return NextResponse.json(
        { error: 'title and description are required' },
        { status: 400 }
      )
    }

    // 1. Fetch the current snippet first.
    // videos.update requires the full snippet object or fields will be deleted.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getData = await youtubeClient<any>(
      `/videos?part=snippet&id=${videoId}`
    )

    if (!getData.items || getData.items.length === 0) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    const currentSnippet = getData.items[0].snippet

    // 2. Update the snippet with new title and description
    const updatedSnippet = {
      ...currentSnippet,
      title,
      description,
    }

    // 3. Send the update request
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData = await youtubeClient<any>(`/videos?part=snippet`, {
      method: 'PUT',
      body: JSON.stringify({
        id: videoId,
        snippet: updatedSnippet,
      }),
    })

    return NextResponse.json({
      success: true,
      data: {
        id: updateData.id,
        title: updateData.snippet.title,
        description: updateData.snippet.description,
      },
    })
  } catch (error) {
    if (error instanceof YouTubeAPIError) {
      return NextResponse.json(
        { error: 'Failed to update video', details: error.details },
        { status: error.status }
      )
    }
    console.error('Error updating video:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
