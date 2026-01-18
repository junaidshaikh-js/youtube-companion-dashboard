'use client'

import { useCallback, useEffect, useState } from 'react'
import AddNote from './AddNote'
import { NotesList } from './NotesList'
import { NotesLoading } from './NotesLoading'
import NotesSearch from './NotesSearch'
import { getNotes, Note as NoteType } from '@/apiRequests/notes'

interface NotesProps {
  videoId: string
}

export default function Notes({ videoId }: NotesProps) {
  const [notes, setNotes] = useState<NoteType[]>([])
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const fetchNotes = useCallback(
    async (searchQuery?: string) => {
      setIsLoading(true)
      const data = await getNotes(videoId, searchQuery)
      setNotes(data)
      setIsLoading(false)
    },
    [videoId]
  )

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchNotes(query)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [query, fetchNotes])

  const handleNoteAdded = () => {
    fetchNotes(query)
  }

  return (
    <div className="rounded-xl bg-gray-50 p-6">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Video Notes</h2>
      <AddNote videoId={videoId} onNoteAdded={handleNoteAdded} />
      <div className="mt-6 mb-4">
        <NotesSearch query={query} onQueryChange={setQuery} />
      </div>
      {isLoading ? (
        <NotesLoading />
      ) : (
        <NotesList notes={notes} isSearching={query.length > 0} />
      )}
    </div>
  )
}
