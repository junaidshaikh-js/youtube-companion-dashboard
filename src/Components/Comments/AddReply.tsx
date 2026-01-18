'use client'

import { useActionState, useEffect, useRef } from 'react'
import { addReplyAction } from '@/actions/comments'

interface AddReplyProps {
  parentId: string
  onReplyAdded?: (comment: any) => void
}

export default function AddReply({ parentId, onReplyAdded }: AddReplyProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction, isPending] = useActionState(addReplyAction, {
    success: false,
    error: null,
  })

  useEffect(() => {
    if (state.success && state.comment) {
      formRef.current?.reset()
      onReplyAdded?.(state.comment)
    }
  }, [state.success, state.comment, onReplyAdded])

  return (
    <div className="mt-3 rounded-lg border border-gray-100 bg-white p-3 shadow-sm">
      <form ref={formRef} action={formAction}>
        <input type="hidden" name="parentId" value={parentId} />
        <textarea
          name="text"
          placeholder="Write your reply..."
          className="w-full resize-none rounded-md border border-gray-200 p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
          rows={2}
          disabled={isPending}
        />
        <div className="mt-2 flex items-center justify-between">
          <div>
            {state.error && (
              <p className="text-xs text-red-600">{state.error}</p>
            )}
            {state.success && (
              <p className="text-xs text-green-600">
                Reply posted successfully!
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-blue-600 px-3 py-1 text-xs text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isPending ? 'Posting...' : 'Post Reply'}
          </button>
        </div>
      </form>
    </div>
  )
}
