import { YouTubeEmbed } from '@next/third-parties/google'
import { getVideoData } from '@/apiRequests/video'
import Comments from '@/Components/Comments'
import EditVideo from '@/Components/EditVideo'
import Notes from '@/Components/Notes'

export default async function Home() {
  const videoData = await getVideoData()

  if (!videoData) {
    return <div>Loading...</div>
  }

  return (
    <main className="mx-auto p-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <div className="max-w-full rounded-xl p-4 shadow-lg">
          <YouTubeEmbed videoid={videoData.id} style="max-width:100%" />
        </div>
        <EditVideo
          initialTitle={videoData.title}
          initialDescription={videoData.description}
        />
      </div>

      <div className="max grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="lg:border-r lg:pr-4">
          <Notes videoId={videoData.id} />
        </div>
        <Comments videoId={videoData.id} />
      </div>
    </main>
  )
}
