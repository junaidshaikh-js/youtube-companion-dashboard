import { apiRequest } from '@/libs/apiClient'

export async function getVideoData() {
  try {
    return await apiRequest('/video')
  } catch (error) {
    console.error('Error fetching video:', error)
    return null
  }
}

export async function updateVideo(title: string, description: string) {
  try {
    return await apiRequest('/video', {
      method: 'PUT',
      body: JSON.stringify({ title, description }),
    })
  } catch (error) {
    console.error('Error updating video:', error)
    return null
  }
}
