// Shown inside the admin layout (AdminSidebar stays visible)
export default function AdminLoading() {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="mb-10">
        <div className="h-3 w-24 bg-gray-200 rounded mb-3" />
        <div className="h-9 w-48 bg-gray-200 rounded" />
      </div>

      {/* Stat cards row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-gray-100 mb-4" />
            <div className="h-8 w-20 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-28 bg-gray-100 rounded" />
          </div>
        ))}
      </div>

      {/* Stat cards row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-gray-100 mb-4" />
            <div className="h-8 w-16 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-24 bg-gray-100 rounded" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-3 w-20 bg-gray-100 rounded" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-6 px-6 py-4 border-b border-gray-50">
            <div className="h-4 w-48 bg-gray-100 rounded flex-1" />
            <div className="h-4 w-20 bg-gray-100 rounded" />
            <div className="h-6 w-20 bg-gray-100 rounded-full" />
            <div className="h-3 w-12 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
