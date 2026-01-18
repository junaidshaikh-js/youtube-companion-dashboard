import { getNotes, Note as NoteType } from '@/apiRequests/notes'

interface NotesListProps {
  videoId: string
}

export async function NotesList({ videoId }: NotesListProps) {
  const notes: NoteType[] = await getNotes(videoId)

  if (notes.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 py-8 text-center text-gray-500">
        No notes yet. Add your first note above!
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <div
          key={note._id}
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
        >
          <p className="text-sm whitespace-pre-wrap text-gray-700">
            {note.note}
          </p>
          <div className="mt-2 text-xs text-gray-400">
            {new Date(note.createdAt).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  )
}
