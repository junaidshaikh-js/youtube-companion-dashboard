import { getComments } from '@/apiRequests/comments'
import CommentItem from './CommentItem'

interface CommentsListProps {
  videoId: string
}

export async function CommentsList({ videoId }: CommentsListProps) {
  const comments = await getComments(videoId)

  return (
    <>
      {comments.length === 0 ? (
        <p className="text-gray-500">No comments yet</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </>
  )
}
