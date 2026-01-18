'use client'

import { useState } from 'react'
import { getReplies } from '@/apiRequests/comments'
import AddReply from './AddReply'

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
}

export default function CommentItem({ comment }: CommentItemProps) {
  const [replies, setReplies] = useState<Comment[]>([])
  const [showReplies, setShowReplies] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [localReplyCount, setLocalReplyCount] = useState(comment.replyCount)

  const fetchReplies = async () => {
    setIsLoading(true)
    try {
      const data = await getReplies(comment.id)
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

  const handleReplyAdded = async () => {
    setLocalReplyCount((prev) => prev + 1)
    // Small delay to allow YouTube API to index the new comment
    setTimeout(async () => {
      await fetchReplies()
    }, 1500)
    setShowReplies(true)
    setShowReplyForm(false)
  }

  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="font-bold text-gray-900">{comment.author}</div>
      <div
        className="mt-2 text-gray-700"
        dangerouslySetInnerHTML={{ __html: comment.text }}
      />
      <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <span>{new Date(comment.publishedAt).toLocaleDateString()}</span>
          <span>•</span>
          <span>{comment.likeCount} likes</span>
        </div>

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
      </div>

      {showReplyForm && (
        <AddReply parentId={comment.id} onReplyAdded={handleReplyAdded} />
      )}

      {showReplies && (
        <div className="mt-4 space-y-4 border-l-2 border-gray-100 pl-6">
          {replies.map((reply) => (
            <div key={reply.id} className="py-2">
              <div className="text-sm font-bold text-gray-900">
                {reply.author}
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
