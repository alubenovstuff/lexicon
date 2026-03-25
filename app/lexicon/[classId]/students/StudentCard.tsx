'use client'

import Link from 'next/link'
import HarryPortrait from '../HarryPortrait'

interface Props {
  student: { id: string; first_name: string; last_name: string; photo_url: string | null }
  classId: string
}

export default function StudentCard({ student, classId }: Props) {
  const initials = `${student.first_name[0]}${student.last_name[0]}`.toUpperCase()

  return (
    <Link href={`/lexicon/${classId}/student/${student.id}`} className="group">
      <div className="bg-white p-5 rounded-[2.5rem] text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
        {/* Golden ring frame */}
        <div
          className="w-20 h-20 mx-auto mb-4 rounded-full p-[3px]"
          style={{
            background: 'linear-gradient(135deg, #c8a96e 0%, #f0d89a 40%, #a0722a 60%, #f0d89a 100%)',
            boxShadow: '0 4px 16px rgba(160,114,42,0.3)',
          }}
        >
          <HarryPortrait
            src={student.photo_url}
            alt={student.first_name}
            initials={initials}
            variant="circle"
            className="w-full h-full rounded-full overflow-hidden"
          />
        </div>
        <h4 className="text-base font-semibold text-[#3632b7] leading-tight" style={{ fontFamily: 'Noto Serif, serif' }}>
          {student.first_name}
        </h4>
        <p className="text-xs text-stone-400 mt-0.5">{student.last_name}</p>
      </div>
    </Link>
  )
}
