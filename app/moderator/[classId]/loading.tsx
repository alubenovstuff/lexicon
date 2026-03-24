// Full-page moderator loading (no shared layout — sidebar is per-page)
export default function ModeratorLoading() {
  return (
    <div className="flex min-h-screen bg-[#faf9f8]" style={{ fontFamily: 'Manrope, sans-serif' }}>

      {/* Sidebar skeleton */}
      <div className="w-64 flex-shrink-0 border-r border-gray-100 bg-white px-5 py-8 flex flex-col gap-6 animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gray-100" />
          <div className="flex-1">
            <div className="h-4 w-24 bg-gray-200 rounded mb-1.5" />
            <div className="h-3 w-16 bg-gray-100 rounded" />
          </div>
        </div>
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 rounded-xl bg-gray-100" />
          ))}
        </div>
      </div>

      {/* Main content skeleton */}
      <main className="ml-0 flex-1 p-8 lg:p-12 animate-pulse">
        {/* Header */}
        <div className="mb-10">
          <div className="h-3 w-32 bg-indigo-100 rounded mb-3" />
          <div className="h-9 w-64 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-80 bg-gray-100 rounded" />
        </div>

        {/* Content cards */}
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl px-6 py-5 shadow-sm">
              <div className="flex items-center gap-5">
                <div className="w-11 h-11 rounded-full bg-gray-100 flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-4 w-36 bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-48 bg-gray-100 rounded" />
                </div>
                <div className="h-6 w-20 bg-gray-100 rounded-full" />
                <div className="h-4 w-24 bg-gray-100 rounded hidden lg:block" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
