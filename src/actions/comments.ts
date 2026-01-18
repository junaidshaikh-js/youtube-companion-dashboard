'use server'

import { revalidatePath } from 'next/cache'
import { postComment } from '@/apiRequests/comments'

interface FormState {
  success: boolean
  error: string | null
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
    revalidatePath('/')
    return {
      success: true,
      error: null,
    }
  } else {
    return {
      success: false,
      error: 'Failed to post comment. Please try again.',
    }
  }
}
