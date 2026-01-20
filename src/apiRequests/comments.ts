import { apiRequest } from '@/libs/apiClient'

import { Comment } from '@/types/comment'

export async function getComments(videoId: string): Promise<Comment[]> {
  try {
    const data = await apiRequest<{ comments: Comment[] }>(
      `/comments?videoId=${videoId}`,
      { cache: 'no-store' }
    )
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
    const data = await apiRequest<{ comment: Comment }>(`/comments`, {
      method: 'POST',
      body: JSON.stringify({ videoId, text }),
    })
    return data.comment
  } catch (error) {
    console.error('Error posting comment:', error)
    return null
  }
}

export async function getReplies(parentId: string): Promise<Comment[]> {
  try {
    const data = await apiRequest<{ replies: Comment[] }>(
      `/replies?parentId=${parentId}`,
      { cache: 'no-store' }
    )
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
    const data = await apiRequest<{ reply: Comment }>(`/replies`, {
      method: 'POST',
      body: JSON.stringify({ parentId, text }),
    })
    return data.reply
  } catch (error) {
    console.error('Error posting reply:', error)
    return null
  }
}

export async function deleteComment(commentId: string): Promise<boolean> {
  try {
    await apiRequest(`/comments?commentId=${commentId}`, {
      method: 'DELETE',
    })
    return true
  } catch (error) {
    console.error('Error deleting comment:', error)
    return false
  }
}
