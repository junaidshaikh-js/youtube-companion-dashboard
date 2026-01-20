'use client'

import { useState, useEffect } from 'react'
import AddComment from '@/Components/AddComment'
import { CommentsList } from './CommentsList'
import { CommentsLoading } from './CommentsLoading'
import { getComments } from '@/apiRequests/comments'
import { Comment } from '@/types/comment'

interface CommentsProps {
  videoId: string
}

export default function Comments({ videoId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true)
      const data = await getComments(videoId)
      setComments(data)
      setIsLoading(false)
    }
    fetchComments()
  }, [videoId])

  const handleCommentAdded = (newComment: Comment) => {
    setComments((prev) => [newComment, ...prev])
  }

  const handleCommentDeleted = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId))
  }

  if (isLoading) {
    return <CommentsLoading />
  }

  return (
    <div>
      <AddComment videoId={videoId} onCommentAdded={handleCommentAdded} />
      <h3 className="mb-4 text-2xl font-bold">Comments</h3>
      <CommentsList
        comments={comments}
        onCommentDeleted={handleCommentDeleted}
      />
    </div>
  )
}
