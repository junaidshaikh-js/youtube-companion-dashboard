import { apiRequest } from '@/libs/apiClient'
import { Video } from '@/types/video'

export async function getVideoData(): Promise<Video | null> {
  try {
    return await apiRequest<Video>('/video')
  } catch (error) {
    console.error('Error fetching video:', error)
    return null
  }
}

interface UpdateVideoResponse {
  success: boolean
  data: {
    id: string
    title: string
    description: string
  }
}

export async function updateVideo(
  title: string,
  description: string
): Promise<UpdateVideoResponse | null> {
  try {
    return await apiRequest<UpdateVideoResponse>('/video', {
      method: 'PUT',
      body: JSON.stringify({ title, description }),
    })
  } catch (error) {
    console.error('Error updating video:', error)
    return null
  }
}
