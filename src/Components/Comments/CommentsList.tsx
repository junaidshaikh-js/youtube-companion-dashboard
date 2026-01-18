import { getComments } from '@/apiRequests/comments'

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
            <div
              key={comment.id}
              className="rounded-lg border border-gray-200 p-4"
            >
              <div className="font-bold text-gray-900">{comment.author}</div>
              <div
                className="mt-2 text-gray-700"
                dangerouslySetInnerHTML={{ __html: comment.text }}
              />
              <div className="mt-2 text-sm text-gray-500">
                {new Date(comment.publishedAt).toLocaleDateString()} •{' '}
                {comment.likeCount} likes
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
