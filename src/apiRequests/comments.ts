interface Comment {
  id: string
  author: string
  text: string
  publishedAt: string
  likeCount: number
}

export async function getComments(videoId: string): Promise<Comment[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/comments?videoId=${videoId}`,
      { cache: 'no-store' }
    )
    const data = await response.json()
    return data.comments || []
  } catch (error) {
    console.error('Error fetching comments:', error)
    return []
  }
}

export async function postComment(
  videoId: string,
  text: string
): Promise<Comment | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/comments`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId, text }),
      }
    )

    if (!response.ok) {
      throw new Error('Failed to post comment')
    }

    const data = await response.json()
    return data.comment
  } catch (error) {
    console.error('Error posting comment:', error)
    return null
  }
}
