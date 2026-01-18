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

    const accessToken = await getAccessToken()

    // 1. Fetch the current snippet first.
    // videos.update requires the full snippet object or fields will be deleted.
    const getResponse = await fetch(
      `${YOUTUBE_DATA_API_URL}/videos?part=snippet&id=${videoId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!getResponse.ok) {
      const error = await getResponse.json()
      return NextResponse.json(
        { error: 'Failed to fetch video for update', details: error },
        { status: getResponse.status }
      )
    }

    const getData = await getResponse.json()
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
    const updateResponse = await fetch(
      `${YOUTUBE_DATA_API_URL}/videos?part=snippet`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: videoId,
          snippet: updatedSnippet,
        }),
      }
    )

    if (!updateResponse.ok) {
      const error = await updateResponse.json()
      return NextResponse.json(
        { error: 'Failed to update video', details: error },
        { status: updateResponse.status }
      )
    }

    const updateData = await updateResponse.json()

    return NextResponse.json({
      success: true,
      data: {
        id: updateData.id,
        title: updateData.snippet.title,
        description: updateData.snippet.description,
      },
    })
  } catch (error) {
    console.error('Error updating video:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
