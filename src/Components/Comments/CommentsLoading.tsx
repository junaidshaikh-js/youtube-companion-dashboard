export function CommentsLoading() {
  return (
    <div className="space-y-4">
      <div className="animate-pulse rounded-lg border border-gray-200 p-4">
        <div className="mb-2 h-4 w-1/4 rounded bg-gray-200"></div>
        <div className="mb-1 h-3 w-3/4 rounded bg-gray-200"></div>
        <div className="h-3 w-2/3 rounded bg-gray-200"></div>
        <div className="mt-2 h-3 w-1/3 rounded bg-gray-200"></div>
      </div>
      <div className="animate-pulse rounded-lg border border-gray-200 p-4">
        <div className="mb-2 h-4 w-1/4 rounded bg-gray-200"></div>
        <div className="mb-1 h-3 w-3/4 rounded bg-gray-200"></div>
        <div className="h-3 w-2/3 rounded bg-gray-200"></div>
        <div className="mt-2 h-3 w-1/3 rounded bg-gray-200"></div>
      </div>
    </div>
  )
}
