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
    let url = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/notes?videoId=${videoId}`
    if (query) {
      url += `&query=${encodeURIComponent(query)}`
    }
    const response = await fetch(url, {
      cache: 'no-store',
    })
    if (!response.ok) {
      throw new Error('Failed to fetch notes')
    }
    const data = await response.json()
    return data.notes || []
  } catch (error) {
    console.error('Error fetching notes:', error)
    return []
  }
}

export async function addNote(videoId: string, note: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/notes`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId, note }),
      }
    )
    return response.ok
  } catch (error) {
    console.error('Error adding note:', error)
    return false
  }
}
