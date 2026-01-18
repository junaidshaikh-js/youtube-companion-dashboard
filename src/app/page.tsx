import { YouTubeEmbed } from '@next/third-parties/google'
import { getVideoData } from '@/apiRequests/video'
import Comments from '@/Components/Comments'
import EditVideo from '@/Components/EditVideo'

export default async function Home() {
  const videoData = await getVideoData()

  if (!videoData) {
    return <div>Loading...</div>
  }

  return (
    <main className="mx-auto max-w-4xl p-8">
      <div className="mb-8 overflow-hidden rounded-xl shadow-lg">
        <YouTubeEmbed videoid={videoData.id} height={450} width={800} />
      </div>

      <EditVideo
        initialTitle={videoData.title}
        initialDescription={videoData.description}
      />

      <Comments videoId={videoData.id} />
    </main>
  )
}
