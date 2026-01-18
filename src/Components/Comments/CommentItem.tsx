'use client'

import { useState } from 'react'
import DeleteComment from './DeleteComment'
import Replies from './Replies'

interface Comment {
  id: string
  author: string
  text: string
  publishedAt: string
  likeCount: number
  replyCount: number
}

interface CommentItemProps {
  comment: Comment
  onDeleted?: () => void
}

export default function CommentItem({ comment, onDeleted }: CommentItemProps) {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="flex items-start justify-between">
        <div className="font-bold text-gray-900">{comment.author}</div>
        <DeleteComment
          id={comment.id}
          onSuccess={() => onDeleted?.()}
          className="text-gray-400"
        />
      </div>
      <div
        className="mt-2 text-gray-700"
        dangerouslySetInnerHTML={{ __html: comment.text }}
      />
      <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
        <span>{new Date(comment.publishedAt).toLocaleDateString()}</span>
        <span>•</span>
        <span>{comment.likeCount} likes</span>
      </div>

      <div className="mt-2 text-sm text-gray-500">
        <Replies parentId={comment.id} initialReplyCount={comment.replyCount} />
      </div>
    </div>
  )
}
