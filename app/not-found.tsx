import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      className="min-h-screen bg-[#faf9f8] flex flex-col items-center justify-center px-6 text-center"
      style={{ fontFamily: 'Manrope, sans-serif' }}
    >
      <p
        className="text-8xl font-black text-indigo-100 mb-0 leading-none select-none"
        style={{ fontFamily: 'Noto Serif, serif' }}
      >
        404
      </p>
      <h1
        className="text-3xl font-bold text-indigo-900 -mt-4 mb-3"
        style={{ fontFamily: 'Noto Serif, serif' }}
      >
        Страницата не е намерена
      </h1>
      <p className="text-gray-500 text-sm mb-8 max-w-sm leading-relaxed">
        Тази страница не съществува или е преместена. Може би линкът е остарял.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors shadow"
      >
        <span className="material-symbols-outlined text-base">home</span>
        Към началната страница
      </Link>
    </div>
  )
}
