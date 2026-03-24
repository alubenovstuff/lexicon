import { redirect } from 'next/navigation'

export default async function StudentReaderRedirect({
  params,
}: {
  params: Promise<{ classId: string; studentId: string }>
}) {
  const { classId, studentId } = await params
  redirect(`/lexicon/${classId}/student/${studentId}`)
}
