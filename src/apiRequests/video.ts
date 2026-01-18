export async function getVideoData() {
  let videoData = null

  try {
    videoData = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/video`
    ).then((res) => res.json())
  } catch (error) {
    console.error('Error fetching video:', error)
  }

  return videoData
}

export async function updateVideo(title: string, description: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/video`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      }
    )

    if (!response.ok) {
      throw new Error('Failed to update video')
    }

    return await response.json()
  } catch (error) {
    console.error('Error updating video:', error)
    return null
  }
}
