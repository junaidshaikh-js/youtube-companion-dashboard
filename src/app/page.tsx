import { YouTubeEmbed } from '@next/third-parties/google'
import { getVideoData } from '@/apiRequests/video'
import Comments from '@/Components/Comments'

export default async function Home() {
  const videoData = await getVideoData()

  return (
    <main>
      <h1>Youtube Companion Dashboard</h1>
      {videoData && (
        <div>
          <YouTubeEmbed videoid={videoData.id} />
          <h2 className="h3">{videoData.title}</h2>
          <Comments videoId={videoData.id} />
        </div>
      )}
    </main>
  )
}
