'use client'

import { useState } from 'react'
import { updateVideo } from '@/apiRequests/video'
import { useRouter } from 'next/navigation'

interface EditVideoProps {
  initialTitle: string
  initialDescription: string
}

export default function EditVideo({
  initialTitle,
  initialDescription,
}: EditVideoProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuggesting, setIsSuggesting] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const [prevInitialTitle, setPrevInitialTitle] = useState(initialTitle)
  const [prevInitialDescription, setPrevInitialDescription] =
    useState(initialDescription)

  if (
    initialTitle !== prevInitialTitle ||
    initialDescription !== prevInitialDescription
  ) {
    setPrevInitialTitle(initialTitle)
    setPrevInitialDescription(initialDescription)
    if (!isEditing) {
      setTitle(initialTitle)
      setDescription(initialDescription)
    }
  }

  const handleUpdate = async () => {
    setIsSubmitting(true)
    setError(null)

    const result = await updateVideo(title, description)

    if (result && result.success) {
      setIsEditing(false)
      router.refresh()
    } else {
      setError('Failed to update video. Please try again.')
    }
    setIsSubmitting(false)
  }

  const handleSuggestTitles = async () => {
    setIsSuggesting(true)
    setError(null)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/suggestions/title`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description }),
        }
      )
      const data = await response.json()
      if (data.suggestions) {
        setSuggestions(data.suggestions)
      } else {
        setError('Failed to get suggestions.')
      }
    } catch (err) {
      setError('Error fetching suggestions.')
    } finally {
      setIsSuggesting(false)
    }
  }

  if (!isEditing) {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="h3 text-3xl font-bold text-gray-900">{title}</h1>
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            Edit
          </button>
        </div>
        <p className="mt-4 whitespace-pre-wrap text-gray-600">{description}</p>
      </div>
    )
  }

  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-6">
      <h2 className="mb-4 text-xl font-semibold">Edit Video Details</h2>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <button
              onClick={handleSuggestTitles}
              disabled={isSuggesting}
              className="flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800 disabled:text-gray-400"
              title="Suggest AI Titles"
            >
              {isSuggesting ? (
                <span className="animate-pulse">Thinking...</span>
              ) : (
                <>
                  <span>✨</span>
                  <span>Suggest Titles</span>
                </>
              )}
            </button>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />

          {suggestions.length > 0 && (
            <div className="mt-2 space-y-2">
              <p className="text-xs font-medium text-gray-500">
                AI Suggestions:
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setTitle(suggestion)
                      setSuggestions([])
                    }}
                    className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700 transition-colors hover:bg-blue-100"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              setIsEditing(false)
              setTitle(initialTitle)
              setDescription(initialDescription)
              setSuggestions([])
              setError(null)
            }}
            disabled={isSubmitting}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={isSubmitting}
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-blue-400"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
