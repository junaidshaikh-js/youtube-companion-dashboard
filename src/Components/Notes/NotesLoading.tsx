export function NotesLoading() {
  return (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-24 rounded-lg bg-gray-200"></div>
      ))}
    </div>
  )
}
