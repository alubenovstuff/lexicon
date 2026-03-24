// Parent portal loading state
export default function MyStudentLoading() {
  return (
    <div className="min-h-screen bg-[#f4f3f2]" style={{ fontFamily: 'Manrope, sans-serif' }}>

      {/* Top bar skeleton */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 animate-pulse">
        <div className="max-w-xl mx-auto flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gray-100 flex-shrink-0" />
          <div className="flex-1">
            <div className="h-4 w-36 bg-gray-200 rounded mb-1.5" />
            <div className="h-1.5 w-40 bg-gray-100 rounded-full" />
          </div>
        </div>
      </div>

      {/* Section skeletons */}
      <div className="max-w-xl mx-auto px-4 py-6 space-y-3 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="flex items-center gap-4 px-5 py-4">
              <div className="w-9 h-9 rounded-xl bg-gray-100 flex-shrink-0" />
              <div className="flex-1">
                <div className="h-4 w-40 bg-gray-200 rounded" />
              </div>
              <div className="h-6 w-24 bg-gray-100 rounded-full" />
              <div className="w-4 h-4 bg-gray-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
