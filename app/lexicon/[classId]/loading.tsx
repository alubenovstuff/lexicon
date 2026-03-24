// Lexicon public page loading state
export default function LexiconLoading() {
  return (
    <div className="min-h-screen bg-[#faf9f8]" style={{ fontFamily: 'Manrope, sans-serif' }}>

      {/* Header skeleton */}
      <header className="sticky top-0 z-50 border-b border-[#eeeeed] bg-[#faf9f8]/90 backdrop-blur-md animate-pulse">
        <div className="max-w-screen-xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-200" />
            <div className="h-5 w-40 bg-gray-200 rounded" />
          </div>
          <div className="flex gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-4 w-20 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </header>

      {/* Content skeleton */}
      <div className="max-w-screen-xl mx-auto px-6 py-10 animate-pulse">

        {/* Hero image skeleton */}
        <div className="rounded-[2rem] bg-gray-200 aspect-[16/7] mb-12" />

        {/* Section header */}
        <div className="flex items-center justify-between mb-8">
          <div className="h-7 w-48 bg-gray-200 rounded" />
          <div className="h-4 w-20 bg-gray-100 rounded" />
        </div>

        {/* Student cards row */}
        <div className="flex gap-6 mb-16">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex-none w-48">
              <div className="bg-white p-5 rounded-[2.5rem]">
                <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4" />
                <div className="h-5 w-28 bg-gray-200 rounded mx-auto mb-2" />
                <div className="h-3 w-32 bg-gray-100 rounded mx-auto" />
              </div>
            </div>
          ))}
        </div>

        {/* Section header */}
        <div className="h-7 w-40 bg-gray-200 rounded mb-8" />

        {/* Two-col grid */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-100 rounded-[2rem] h-60" />
          <div className="bg-gray-100 rounded-[2rem] h-60" />
        </div>
      </div>

      {/* Bottom nav placeholder */}
      <div className="fixed bottom-0 left-0 w-full h-24 bg-[#faf9f8]/80 backdrop-blur-xl rounded-t-[2rem] border-t border-gray-100 animate-pulse">
        <div className="flex justify-around items-center h-full px-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-xl bg-gray-200" />
              <div className="h-3 w-12 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
