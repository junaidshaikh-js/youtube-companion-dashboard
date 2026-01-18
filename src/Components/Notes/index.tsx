import { Suspense } from 'react'
import AddNote from './AddNote'
import { NotesList } from './NotesList'
import { NotesLoading } from './NotesLoading'

interface NotesProps {
  videoId: string
}

export default function Notes({ videoId }: NotesProps) {
  return (
    <div className="rounded-xl bg-gray-50 p-6">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Video Notes</h2>
      <AddNote videoId={videoId} />
      <Suspense fallback={<NotesLoading />}>
        <NotesList videoId={videoId} />
      </Suspense>
    </div>
  )
}
