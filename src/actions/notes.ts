'use server'

import { revalidatePath } from 'next/cache'
import { addNote } from '@/apiRequests/notes'

interface FormState {
  success: boolean
  error: string | null
}

export async function addNoteAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const videoId = formData.get('videoId') as string
  const note = formData.get('note') as string

  if (!note?.trim()) {
    return {
      success: false,
      error: 'Note cannot be empty',
    }
  }

  const success = await addNote(videoId, note)

  if (success) {
    revalidatePath('/')
    return {
      success: true,
      error: null,
    }
  } else {
    return {
      success: false,
      error: 'Failed to add note. Please try again.',
    }
  }
}
