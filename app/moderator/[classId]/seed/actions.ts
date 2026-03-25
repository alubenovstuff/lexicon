'use server'

import { createServiceRoleClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { defaultTemplate } from '@/lib/templates/presets'
import type { Block } from '@/lib/templates/types'

// ─── Data pools ───────────────────────────────────────────────────────────────

const STUDENT_NAMES = [
  { first: 'Мария',      last: 'Иванова' },
  { first: 'Иван',       last: 'Петров' },
  { first: 'София',      last: 'Димитрова' },
  { first: 'Александър', last: 'Стоянов' },
  { first: 'Виктория',   last: 'Христова' },
  { first: 'Никола',     last: 'Георгиев' },
  { first: 'Елена',      last: 'Тодорова' },
  { first: 'Борис',      last: 'Маринов' },
  { first: 'Андреа',     last: 'Симеонова' },
  { first: 'Константин', last: 'Николов' },
  { first: 'Калина',     last: 'Василева' },
  { first: 'Мартин',     last: 'Атанасов' },
  { first: 'Цветелина',  last: 'Попова' },
  { first: 'Стефан',     last: 'Колев' },
  { first: 'Ралица',     last: 'Митева' },
  { first: 'Димитър',    last: 'Йорданов' },
  { first: 'Нора',       last: 'Стефанова' },
  { first: 'Филип',      last: 'Кирилов' },
  { first: 'Михаила',    last: 'Петкова' },
  { first: 'Валентин',   last: 'Бойчев' },
]

const DUMMY_QUESTIONS = [
  {
    text: 'Кажи ни нещо за себе си — кой си ти?',
    type: 'personal' as const,
    allows_text: true,
    allows_media: false,
    answer: 'Аз съм любопитно и весело дете. Обичам да откривам нови неща и да се смея с приятелите си. Имам страст към четенето и природата.',
  },
  {
    text: 'Какво те прави щастлив/а?',
    type: 'personal' as const,
    allows_text: true,
    allows_media: false,
    answer: 'Щастлив/а ме правят времето с приятели, хубавото време навън и когато успея нещо трудно. Обичам и когато цялото семейство е заедно.',
  },
  {
    text: 'Ако беше животно, кое животно щеше да бъдеш и защо?',
    type: 'personal' as const,
    allows_text: true,
    allows_media: false,
    answer: 'Щях да бъда делфин — защото делфините са умни, игриви и живеят в море, което ми харесва много. Обичат да помагат и са верни на приятелите си.',
  },
  {
    text: 'Какво правиш най-добре от всичко?',
    type: 'personal' as const,
    allows_text: true,
    allows_media: false,
    answer: 'Най-добре рисувам! Прекарвам часове с молив и бои. Обичам да рисувам природа и измислени светове.',
  },
  {
    text: 'Какво искаш да станеш, когато пораснеш?',
    type: 'personal' as const,
    allows_text: true,
    allows_media: false,
    answer: 'Искам да стана учен/учена или лекар/лекарка, защото искам да помагам на хората и да открия нещо важно за света.',
  },
  {
    text: 'Едно нещо, което ценя най-много в нашия клас',
    type: 'better_together' as const,
    allows_text: true,
    allows_media: false,
    answer: 'Ценя приятелството и взаимопомощта. Когато имам проблем, винаги има някой, който ще ми помогне. Нашият клас е като второ семейство.',
  },
  {
    text: 'Нещо, което бихме могли да подобрим заедно',
    type: 'better_together' as const,
    allows_text: true,
    allows_media: false,
    answer: 'Можем да сме по-тихи по коридора и да се грижим повече за класната стая. Ако работим заедно, ще направим училището по-добро място за всички.',
  },
  {
    text: 'Ако класната беше супергерой — какви сили би имала?',
    type: 'superhero' as const,
    allows_text: true,
    allows_media: false,
    answer: 'Класната щеше да може да умножава времето, за да може да обясни на всеки поотделно. И щеше да има суперсила да разбира кога детето е тъжно, дори без да казва.',
  },
]

const CLASS_VOICE_QUESTIONS = [
  {
    text: 'Едно нещо, което харесвам в нашия клас',
    answers: [
      'Харесвам как всички си помагаме — това е рядкост.',
      'Атмосферата е приятелска и топла. Никога не съм се чувствал/а сам/а.',
      'Смеем се много заедно и учителите са страхотни.',
      'Класната ни разбира и ни изслушва.',
      'Имаме много забавни моменти дори по време на час.',
    ],
  },
  {
    text: 'Един съвет за бъдещите ученици',
    answers: [
      'Бъдете смели и задавайте въпроси — никой не е „глупав" въпрос!',
      'Помагайте си взаимно и не се страхувайте да сте различни.',
      'Участвайте в извънкласни дейности — там стават най-хубавите приятелства.',
      'Бъдете добри с всички, дори когато е трудно.',
    ],
  },
]

const DUMMY_EVENTS = [
  {
    title: 'Коледен концерт',
    event_date: '2024-12-19',
    note: 'Децата изпяха коледни песни пред родителите в украсената актова зала. Настроението беше вълшебно!',
  },
  {
    title: 'Пролетна екскурзия',
    event_date: '2025-04-10',
    note: 'Посетихме природен парк и минахме по екопътека. Всички бяха възхитени от природата около нас.',
  },
  {
    title: 'Ден на таланта',
    event_date: '2025-05-22',
    note: 'Всяко дете показа своя талант — рисуване, пеене, жонглиране и дори оригами. Незабравимо събитие!',
  },
  {
    title: 'Последен учебен ден',
    event_date: '2025-06-13',
    note: 'Изпратихме учебната година с прегръдки, смях и много снимки. Обещахме си да не забравяме тези спомени.',
  },
]

const DUMMY_POLLS = [
  'Най-голям шегаджия в класа',
  'Бъдеща поп звезда',
  'Душата на класа',
  'Бъдещ президент',
]

const MESSAGES = [
  'Ти си страхотен/страхотна съученик! Винаги ни разсмиваш в точния момент и правиш класа по-весел.',
  'Благодаря ти, че винаги ми помагаш, когато имам нужда. Ти си истински/истинска приятел/приятелка.',
  'Много ми харесва твоята усмивка и позитивна нагласа — правиш класа по-светъл само с присъствието си.',
  'Ти си един от най-добрите хора, которе познавам. Радвам се, че сме в един клас.',
  'Много те уважавам — винаги си честен/честна и справедлив/справедлива с всички.',
  'Твоята енергия и ентусиазъм правят всяко занятие по-интересно. Не се променяй!',
  'Благодаря ти, че ме изслуша, когато ми беше трудно. Много ми помогна.',
  'С теб учението е по-лесно и по-забавно. Надявам се да продължим да сме приятели.',
]

// ─── seedDummyData ────────────────────────────────────────────────────────────

export async function seedDummyData(
  classId: string,
  studentCount: number,
): Promise<{ error: string | null }> {
  const admin = createServiceRoleClient()
  const count = Math.min(Math.max(studentCount, 1), 20)

  try {
    // 1. Questions
    const qRows = DUMMY_QUESTIONS.map((q, i) => ({
      class_id: classId,
      text: q.text,
      type: q.type,
      is_system: false,
      allows_text: q.allows_text,
      allows_media: q.allows_media,
      order_index: 100 + i,
    }))
    const cvRows = CLASS_VOICE_QUESTIONS.map((q, i) => ({
      class_id: classId,
      text: q.text,
      type: 'class_voice',
      is_system: false,
      allows_text: true,
      allows_media: false,
      order_index: 110 + i,
    }))
    const { data: createdQ, error: qErr } = await admin
      .from('questions')
      .insert([...qRows, ...cvRows])
      .select('id, text, type')
    if (qErr) return { error: qErr.message }

    // 2. Students
    const studentRows = STUDENT_NAMES.slice(0, count).map(({ first, last }) => ({
      class_id: classId,
      first_name: first,
      last_name: last,
      invite_accepted_at: new Date().toISOString(),
    }))
    const { data: students, error: sErr } = await admin
      .from('students')
      .insert(studentRows)
      .select('id, first_name, last_name')
    if (sErr) return { error: sErr.message }

    const allStudents = students ?? []

    // 3. Answers (personal / better_together / superhero) — same for every student
    const individualQs = (createdQ ?? []).filter(q =>
      ['personal', 'better_together', 'superhero'].includes(q.type),
    )
    const answerRows = allStudents.flatMap(student =>
      individualQs.map(q => {
        const template = DUMMY_QUESTIONS.find(d => d.text === q.text)
        return {
          student_id: student.id,
          question_id: q.id,
          text_content: template?.answer ?? 'Дъми отговор за тестване.',
          status: 'approved',
        }
      }),
    )
    if (answerRows.length > 0) {
      const { error: aErr } = await admin.from('answers').insert(answerRows)
      if (aErr) return { error: aErr.message }
    }

    // 4. Class voice answers (anonymous)
    const cvQs = (createdQ ?? []).filter(q => q.type === 'class_voice')
    const voiceRows = cvQs.flatMap(q => {
      const template = CLASS_VOICE_QUESTIONS.find(d => d.text === q.text)
      const texts = template?.answers ?? ['Дъми анонимен отговор.']
      return texts.map(content => ({ class_id: classId, question_id: q.id, content }))
    })
    if (voiceRows.length > 0) {
      await admin.from('class_voice_answers').insert(voiceRows)
    }

    // 5. Events (no photos)
    const eventRows = DUMMY_EVENTS.map((e, i) => ({
      class_id: classId,
      title: e.title,
      event_date: e.event_date,
      note: e.note,
      order_index: i + 1,
      photos: [],
    }))
    await admin.from('events').insert(eventRows)

    // 6. Polls
    const pollRows = DUMMY_POLLS.map((question, i) => ({
      class_id: classId,
      question,
      order_index: i + 1,
    }))
    const { data: polls } = await admin
      .from('class_polls')
      .insert(pollRows)
      .select('id')

    // 7. Poll votes — each student votes for the next student (round-robin)
    if ((polls ?? []).length > 0 && allStudents.length > 1) {
      const voteRows = (polls ?? []).flatMap((poll, pi) =>
        allStudents.map((voter, vi) => {
          const offset = (pi + 1 + vi) % allStudents.length
          const nominee = allStudents[offset === vi ? (offset + 1) % allStudents.length : offset]
          return {
            poll_id: poll.id,
            voter_student_id: voter.id,
            nominee_student_id: nominee.id,
          }
        }),
      )
      await admin.from('class_poll_votes').insert(voteRows)
    }

    // 8. Peer messages — each student gets 2 approved messages
    if (allStudents.length > 1) {
      const msgRows = allStudents.flatMap((recipient, ri) =>
        [0, 1].map(j => {
          const authorIdx = (ri + j + 1) % allStudents.length
          return {
            recipient_student_id: recipient.id,
            author_student_id: allStudents[authorIdx].id,
            content: MESSAGES[(ri * 2 + j) % MESSAGES.length],
            status: 'approved',
          }
        }),
      )
      await admin.from('peer_messages').insert(msgRows)
    }

    // 9. Wire seeded IDs into the class layout blocks
    const personalIds = (createdQ ?? []).filter(q => q.type === 'personal').map(q => q.id)
    const cvIds       = (createdQ ?? []).filter(q => q.type === 'class_voice').map(q => q.id)
    const pollIds     = (polls ?? []).map(p => p.id)

    const { data: classRow } = await admin
      .from('classes')
      .select('layout')
      .eq('id', classId)
      .single()

    const currentBlocks: Block[] =
      (classRow?.layout as Block[] | null) ??
      defaultTemplate.blocks.map(b => ({ ...b }))

    let pIdx = 0, cvIdx = 0, pollIdx = 0
    const updatedBlocks = currentBlocks.map(b => {
      if (b.type === 'question' && personalIds[pIdx] != null)
        return { ...b, config: { ...b.config, questionId: personalIds[pIdx++] } }
      if (b.type === 'class_voice' && cvIds[cvIdx] != null)
        return { ...b, config: { ...b.config, questionId: cvIds[cvIdx++] } }
      if (b.type === 'poll' && pollIds[pollIdx] != null)
        return { ...b, config: { ...b.config, pollId: pollIds[pollIdx++] } }
      return b
    })

    await admin.from('classes').update({ layout: updatedBlocks }).eq('id', classId)

    revalidatePath(`/moderator/${classId}`)
    revalidatePath(`/lexicon/${classId}`)
    return { error: null }
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Неочаквана грешка' }
  }
}

// ─── clearClassData ───────────────────────────────────────────────────────────

export async function clearClassData(classId: string): Promise<{ error: string | null }> {
  const admin = createServiceRoleClient()
  try {
    // Students cascade → answers, peer_messages, class_poll_votes
    await admin.from('students').delete().eq('class_id', classId)
    // Polls (votes already gone via cascade)
    await admin.from('class_polls').delete().eq('class_id', classId)
    // Events
    await admin.from('events').delete().eq('class_id', classId)
    // Class voice answers
    await admin.from('class_voice_answers').delete().eq('class_id', classId)
    // Class-specific questions (cascade → answers already gone)
    await admin.from('questions').delete().eq('class_id', classId).eq('is_system', false)

    revalidatePath(`/moderator/${classId}`)
    return { error: null }
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Неочаквана грешка' }
  }
}
