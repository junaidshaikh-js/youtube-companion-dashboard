'use client'

import { useActionState, useEffect, useRef } from 'react'
import { addCommentAction } from '@/actions/comments'
import { Comment } from '@/types/comment'

interface AddCommentProps {
  videoId: string
  onCommentAdded?: (comment: Comment) => void
}

export default function AddComment({
  videoId,
  onCommentAdded,
}: AddCommentProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction, isPending] = useActionState(addCommentAction, {
    success: false,
    error: null,
  })

  useEffect(() => {
    if (state.success && state.comment) {
      formRef.current?.reset()
      onCommentAdded?.(state.comment)
    }
  }, [state.success, state.comment])

  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <h4 className="mb-3 text-lg font-semibold">Add a Comment</h4>
      <form ref={formRef} action={formAction}>
        <input type="hidden" name="videoId" value={videoId} />
        <textarea
          name="text"
          placeholder="Write your comment..."
          className="w-full resize-none rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          rows={3}
          disabled={isPending}
        />
        <div className="mt-3 flex items-center justify-between">
          <div>
            {state.error && (
              <p className="text-sm text-red-600">{state.error}</p>
            )}
            {state.success && (
              <p className="text-sm text-green-600">
                Comment posted successfully!
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isPending ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>
    </div>
  )
}
