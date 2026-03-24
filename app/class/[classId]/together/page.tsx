import { redirect } from 'next/navigation'

export default async function TogetherRedirect({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params
  redirect(`/lexicon/${classId}`)
}
