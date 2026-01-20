'use server'

import { revalidatePath } from 'next/cache'
import { Comment } from '@/types/comment'
import { postComment, postReply, deleteComment } from '@/apiRequests/comments'

interface FormState {
  success: boolean
  error: string | null
  comment?: Comment
}

export async function addCommentAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const videoId = formData.get('videoId') as string
  const text = formData.get('text') as string

  if (!text?.trim()) {
    return {
      success: false,
      error: 'Comment cannot be empty',
    }
  }

  const result = await postComment(videoId, text)

  if (result) {
    return {
      success: true,
      error: null,
      comment: result,
    }
  } else {
    return {
      success: false,
      error: 'Failed to post comment. Please try again.',
    }
  }
}

export async function addReplyAction(
  prevState: FormState,
  formData: FormData
): Promise<{
  success: boolean
  error: string | null
  comment?: Comment
}> {
  const parentId = formData.get('parentId') as string
  const text = formData.get('text') as string

  if (!text?.trim()) {
    return {
      success: false,
      error: 'Reply cannot be empty',
    }
  }

  const result = await postReply(parentId, text)

  if (result) {
    return {
      success: true,
      error: null,
      comment: result,
    }
  } else {
    return {
      success: false,
      error: 'Failed to post reply. Please try again.',
    }
  }
}

export async function deleteCommentAction(commentId: string): Promise<{
  success: boolean
  error: string | null
}> {
  const result = await deleteComment(commentId)

  if (result) {
    revalidatePath('/')
    return {
      success: true,
      error: null,
    }
  } else {
    return {
      success: false,
      error: 'Failed to delete comment. Please try again.',
    }
  }
}
