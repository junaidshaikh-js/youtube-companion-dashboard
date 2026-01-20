import { Comment } from '@/types/comment'
import CommentItem from './CommentItem'

interface CommentsListProps {
  comments: Comment[]
  onCommentDeleted: (commentId: string) => void
}

export function CommentsList({
  comments,
  onCommentDeleted,
}: CommentsListProps) {
  return (
    <>
      {comments.length === 0 ? (
        <p className="text-gray-500">No comments yet</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onDeleted={() => onCommentDeleted(comment.id)}
            />
          ))}
        </div>
      )}
    </>
  )
}
