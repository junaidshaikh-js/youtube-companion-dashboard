let cachedToken: string | null = null
let expiry = 0

export async function getAccessToken() {
  if (cachedToken && Date.now() < expiry) {
    return cachedToken
  }

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: process.env.YOUTUBE_REFRESH_TOKEN!,
      grant_type: 'refresh_token',
    }),
  })

  const data = await res.json()

  cachedToken = data.access_token
  expiry = Date.now() + (data.expires_in - 60) * 1000

  return cachedToken
}
