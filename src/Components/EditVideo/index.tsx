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
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

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

  if (!isEditing) {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">{initialTitle}</h1>
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            Edit
          </button>
        </div>
        <p className="mt-4 whitespace-pre-wrap text-gray-600">
          {initialDescription}
        </p>
      </div>
    )
  }

  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-6">
      <h2 className="mb-4 text-xl font-semibold">Edit Video Details</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
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
