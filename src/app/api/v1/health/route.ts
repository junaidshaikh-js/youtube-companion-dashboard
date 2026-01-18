import { NextResponse } from 'next/server'
import connectDB from '@/libs/db'

export async function GET() {
  let dbStatus = 'disconnected'
  try {
    await connectDB()
    dbStatus = 'connected'
  } catch (error) {
    console.error('Database connection error in health check:', error)
  }

  return NextResponse.json({
    status: 'ok',
    database: dbStatus,
    timestamp: new Date().toISOString(),
  })
}
