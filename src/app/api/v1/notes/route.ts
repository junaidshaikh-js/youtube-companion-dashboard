import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/libs/db'
import Note from '@/models/Note'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const videoId = searchParams.get('videoId')
    const query = searchParams.get('query')

    if (!videoId) {
      return NextResponse.json(
        { error: 'videoId is required' },
        { status: 400 }
      )
    }

    await connectDB()

    // Build filter
    const filter: Record<string, string | object> = { videoId }
    if (query) {
      filter.note = { $regex: query, $options: 'i' }
    }

    const notes = await Note.find(filter).sort({ createdAt: -1 })

    return NextResponse.json({ notes })
  } catch (error) {
    console.error('Error fetching notes:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { videoId, note } = body

    if (!videoId || !note) {
      return NextResponse.json(
        { error: 'videoId and note are required' },
        { status: 400 }
      )
    }

    await connectDB()
    const newNote = await Note.create({ videoId, note })

    return NextResponse.json({ success: true, note: newNote }, { status: 201 })
  } catch (error) {
    console.error('Error creating note:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
