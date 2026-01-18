'use client'

import { useState } from 'react'
import { deleteCommentAction } from '@/actions/comments'
import ConfirmDialog from '../Common/ConfirmDialog'

interface DeleteCommentProps {
  id: string
  onSuccess: () => void
  isReply?: boolean
  className?: string
}

export default function DeleteComment({
  id,
  onSuccess,
  isReply = false,
  className = '',
}: DeleteCommentProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    setIsDialogOpen(false)
    setIsDeleting(true)
    const result = await deleteCommentAction(id)
    if (result.success) {
      onSuccess()
    } else {
      alert(result.error || 'Failed to delete comment')
    }
    setIsDeleting(false)
  }

  return (
    <>
      <ConfirmDialog
        isOpen={isDialogOpen}
        title="Delete Comment"
        message="Are you sure you want to permanently delete this comment? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDialogOpen(false)}
      />
      <button
        onClick={handleDeleteClick}
        disabled={isDeleting}
        className={`${
          isDeleting ? 'opacity-50' : 'opacity-100'
        } transition-all hover:text-red-500 ${className}`}
        title={`Delete ${isReply ? 'reply' : 'comment'}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={isReply ? 'h-3 w-3' : 'h-4 w-4'}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </>
  )
}
