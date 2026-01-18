interface Comment {
  id: string
  author: string
  text: string
  publishedAt: string
  likeCount: number
  replyCount: number
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

export async function getReplies(parentId: string): Promise<Comment[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/replies?parentId=${parentId}`,
      { cache: 'no-store' }
    )
    const data = await response.json()
    return data.replies || []
  } catch (error) {
    console.error('Error fetching replies:', error)
    return []
  }
}

export async function postReply(
  parentId: string,
  text: string
): Promise<Comment | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/replies`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ parentId, text }),
      }
    )

    if (!response.ok) {
      throw new Error('Failed to post reply')
    }

    const data = await response.json()
    return data.reply
  } catch {
    return null
  }
}

export async function deleteComment(commentId: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/comments?commentId=${commentId}`,
      {
        method: 'DELETE',
      }
    )
    return response.ok || response.status === 204
  } catch (error) {
    console.error('Error deleting comment:', error)
    return false
  }
}
