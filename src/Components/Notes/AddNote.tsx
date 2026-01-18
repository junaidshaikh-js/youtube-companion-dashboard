'use client'

import { useActionState, useEffect, useRef } from 'react'
import { addNoteAction } from '@/actions/notes'

interface AddNoteProps {
  videoId: string
}

export default function AddNote({ videoId }: AddNoteProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction, isPending] = useActionState(addNoteAction, {
    success: false,
    error: null,
  })

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
    }
  }, [state.success])

  return (
    <form ref={formRef} action={formAction} className="mb-6">
      <input type="hidden" name="videoId" value={videoId} />
      <div className="flex flex-col gap-2">
        <textarea
          name="note"
          placeholder="Add a private note for this video..."
          className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          rows={3}
          disabled={isPending}
        />
        <div className="flex items-center justify-between">
          <div className="text-sm">
            {state.error && <p className="text-red-600">{state.error}</p>}
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isPending ? 'Adding...' : 'Add Note'}
          </button>
        </div>
      </div>
    </form>
  )
}
