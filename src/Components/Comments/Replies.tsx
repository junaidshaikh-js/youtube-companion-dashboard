'use client'

import { useState } from 'react'
import { Comment } from '@/types/comment'
import { getReplies } from '@/apiRequests/comments'
import AddReply from './AddReply'
import DeleteComment from './DeleteComment'

interface RepliesProps {
  parentId: string
  initialReplyCount: number
}

export default function Replies({ parentId, initialReplyCount }: RepliesProps) {
  const [replies, setReplies] = useState<Comment[]>([])
  const [showReplies, setShowReplies] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [localReplyCount, setLocalReplyCount] = useState(initialReplyCount)

  const fetchReplies = async () => {
    setIsLoading(true)
    try {
      const data = await getReplies(parentId)
      setReplies(data)
    } catch (error) {
      console.error('Error fetching replies:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleReplies = async () => {
    if (!showReplies && replies.length === 0 && localReplyCount > 0) {
      await fetchReplies()
    }
    setShowReplies(!showReplies)
  }

  const handleReplyAdded = (newReply: Comment) => {
    setLocalReplyCount((prev) => prev + 1)
    setReplies((prev) => [...prev, newReply])
    setShowReplies(true)
    setShowReplyForm(false)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="font-medium text-gray-600 transition-colors hover:text-blue-600"
        >
          Reply
        </button>

        {localReplyCount > 0 && (
          <button
            onClick={toggleReplies}
            className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
            disabled={isLoading}
          >
            {isLoading
              ? 'Loading replies...'
              : showReplies
                ? 'Hide replies'
                : `${localReplyCount} ${
                    localReplyCount === 1 ? 'reply' : 'replies'
                  }`}
          </button>
        )}
      </div>

      {showReplyForm && (
        <AddReply parentId={parentId} onReplyAdded={handleReplyAdded} />
      )}

      {showReplies && (
        <div className="space-y-4 border-l-2 border-gray-100 pl-6">
          {replies.map((reply) => (
            <div key={reply.id} className="group py-2">
              <div className="flex items-start justify-between">
                <div className="text-sm font-bold text-gray-900">
                  {reply.author}
                </div>
                <DeleteComment
                  id={reply.id}
                  isReply
                  onSuccess={() => {
                    setReplies((prev) => prev.filter((r) => r.id !== reply.id))
                    setLocalReplyCount((prev) => Math.max(0, prev - 1))
                  }}
                  className="text-gray-400 opacity-0 group-hover:opacity-100"
                />
              </div>
              <div
                className="mt-1 text-sm text-gray-700"
                dangerouslySetInnerHTML={{ __html: reply.text }}
              />
              <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                <span>{new Date(reply.publishedAt).toLocaleDateString()}</span>
                <span>•</span>
                <span>{reply.likeCount} likes</span>
              </div>
            </div>
          ))}
          {isLoading && (
            <p className="text-xs text-gray-400">Fetching replies...</p>
          )}
        </div>
      )}
    </div>
  )
}
