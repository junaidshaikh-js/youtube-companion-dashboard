import { apiRequest } from '@/libs/apiClient'

export interface Note {
  _id: string
  videoId: string
  note: string
  createdAt: string
  updatedAt: string
}

export async function getNotes(
  videoId: string,
  query?: string
): Promise<Note[]> {
  try {
    let endpoint = `/notes?videoId=${videoId}`
    if (query) {
      endpoint += `&query=${encodeURIComponent(query)}`
    }
    const data = await apiRequest<{ notes: Note[] }>(endpoint, {
      cache: 'no-store',
    })
    return data.notes || []
  } catch (error) {
    console.error('Error fetching notes:', error)
    return []
  }
}

export async function addNote(videoId: string, note: string): Promise<boolean> {
  try {
    await apiRequest(`/notes`, {
      method: 'POST',
      body: JSON.stringify({ videoId, note }),
    })
    return true
  } catch (error) {
    console.error('Error adding note:', error)
    return false
  }
}
