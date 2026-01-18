import mongoose from 'mongoose'

const DATABASE_USER = process.env.DATABASE_USER
const DATABASE_USER_PASSWORD = process.env.DATABASE_USER_PASSWORD
const MONGODB_URI = `mongodb+srv://${DATABASE_USER}:${DATABASE_USER_PASSWORD}@youtube-companion.7pevjkf.mongodb.net/?appName=youtube-companion`

if (!DATABASE_USER || !DATABASE_USER_PASSWORD) {
  throw new Error(
    'Please define the DATABASE_USER and DATABASE_USER_PASSWORD environment variables inside .env'
  )
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      return m
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectDB
