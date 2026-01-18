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
