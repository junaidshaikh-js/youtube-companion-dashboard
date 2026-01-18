import { Suspense } from 'react'
import AddComment from '@/Components/AddComment'
import { CommentsList } from './CommentsList'
import { CommentsLoading } from './CommentsLoading'

interface CommentsProps {
  videoId: string
}

export default function Comments({ videoId }: CommentsProps) {
  return (
    <div>
      <AddComment videoId={videoId} />
      <h3 className="mb-4 text-2xl font-bold">Comments</h3>
      <Suspense fallback={<CommentsLoading />}>
        <CommentsList videoId={videoId} />
      </Suspense>
    </div>
  )
}
