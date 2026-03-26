'use server'

import { createServiceRoleClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { seedDefaultClass } from '@/lib/templates/defaultSeed'

// ─── Student names pool ───────────────────────────────────────────────────────

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

// ─── Answer pools per question text ──────────────────────────────────────────
// Each pool should have ≥20 items so every student gets a unique answer.

const ANSWER_POOLS: Record<string, string[]> = {
  'Ако бях животно, щях да бъда:': [
    'Делфин — умен, игрив и обича да е с приятели.',
    'Орел — свободен и вижда всичко отгоре.',
    'Котка — независима, но пълна с любов за избраните.',
    'Куче — верен и винаги щастлив да вижда близките.',
    'Лисица — хитра и любопитна към всичко.',
    'Леопард — елегантен, бърз и тих.',
    'Папагал — обича да говори и да имитира.',
    'Вълк — силен и верен на своята глутница.',
    'Прилеп — нощна птица с особено чувство за ориентация.',
    'Слон — добра памет и грижа за семейството.',
    'Пингвин — малко несръчен, но много сладък.',
    'Хамелеон — умее да се приспособява навсякъде.',
    'Тигър — смел и самоуверен.',
    'Жираф — вижда надалеч и е над всички.',
    'Бухал — мъдър и наблюдателен.',
    'Катерица — енергична и пести всичко за по-късно.',
    'Кит — спокоен, дълбок и пътува далеч.',
    'Колибри — малък, но невероятно бърз.',
    'Лъв — роден лидер с голямо сърце.',
    'Медуза — мистериозна и светеща в тъмното.',
  ],
  'Ако имах вълшебна пръчка, щях да:': [
    'Направя да няма болести по света.',
    'Дам на всяко дете на планетата дом и храна.',
    'Спра замърсяването на океаните веднага.',
    'Науча всички езици на света за миг.',
    'Направя домашните да се пишат сами.',
    'Спра войните по целия свят.',
    'Дам способност на всеки човек да лети.',
    'Направя зоопарковете ненужни — животните свободни.',
    'Върна изчезналите животински видове.',
    'Направя дните по-дълги с още 4 часа.',
    'Дам дар на музика на всеки, който мечтае за него.',
    'Изградя библиотека с всяка книга, написана някога.',
    'Направя пластмасата да изчезне от природата.',
    'Преведа всички книги на всички езици.',
    'Дам на всеки човек по едно дърво да посади.',
    'Направя слънцето да грее и вали само когато е нужно.',
    'Създам приложение, което предотвратява лъжите.',
    'Съградя мост между всяка страна в света.',
    'Направя всяко дете да може да ходи на училище.',
    'Спра гладуването на всеки на Земята.',
  ],
  'Най-хубавото в приятелството е:': [
    'Да знаеш, че винаги има някой за теб.',
    'Смехът, който не можеш да обясниш на другите.',
    'Да можеш да бъдеш себе си без маски.',
    'Споделените тайни, които ви свързват завинаги.',
    'Да има кой да те подкрепи в лошите дни.',
    'Безусловното приемане — и хубавите, и лошите ти страни.',
    'Споделените спомени, за които се смеете и след години.',
    'Да знаеш, че грешките ти ще бъдат простени.',
    'Честността — истинският приятел ти казва и неудобното.',
    'Да имаш кой да те изслуша без да те осъжда.',
    'Дребните жестове — съобщение точно когато ти трябва.',
    'Заедно дори скучното да е забавно.',
    'Подкрепата, когато се съмняваш в себе си.',
    'Да расте заедно с теб и да те разбира.',
    'Да имаш кой да сподели пицата с теб в петък вечер.',
    'Тишината, която не е неудобна.',
    'Да те защити пред другите.',
    'Общите интереси, за които часове наред говорите.',
    'Доверието — можеш да му кажеш всичко.',
    'Чувството, че не си сам в нищо.',
  ],
  'Моята тайна суперсила е:': [
    'Умея да разсмивам всеки, дори когато е тъжен.',
    'Запомням абсолютно всичко, което прочета веднъж.',
    'Мога да успокоявам животни — те ме слушат!',
    'Намирам изгубени неща на всички около мен.',
    'Готвя страхотно и всички просят рецептите ми.',
    'Усещам кога някой е тъжен, преди да го е казал.',
    'Уча нови неща изключително бързо.',
    'Никога не се губя, дори в непознат град.',
    'Мога да рисувам портрет за под 5 минути.',
    'Имам страхотна памет за имена и лица.',
    'Разбирам животни — те ме следват навсякъде.',
    'Измислям смешни истории на момента.',
    'Успявам да помиря карещи се приятели.',
    'Свиря на всеки инструмент само с ухото.',
    'Мога да се събудя без будилник точно навреме.',
    'Решавам математически задачи в главата си.',
    'Правя перфектни снимки от пръв опит.',
    'Умея да разчитам хора само по погледа.',
    'Организирам всичко идеално — никога не закъснявам.',
    'Намирам четирилистна детелина навсякъде!',
  ],
  'Мечтая да отида:': [
    'в Япония', 'в Исландия', 'в Нова Зеландия', 'в Канада', 'в Норвегия',
    'в Австралия', 'в Бразилия', 'в Перу', 'в Египет', 'в Индия',
    'в Гърция', 'в Ирландия', 'в Шотландия', 'в Швейцария', 'в Португалия',
    'в Тайланд', 'в Аржентина', 'в Мароко', 'във Финландия', 'в Мексико',
  ],
  'Най-интересният ден тази година беше:': [
    'Денят на екскурзията — никога няма да го забравя.',
    'Когато направихме театрален спектакъл пред родителите.',
    'Ден на науката — правехме експерименти.',
    'Когато спечелихме математическото състезание.',
    'Денят, когато класът ни победи на спортния турнир.',
    'Когато гост-лектор ни разказа за Космоса.',
    'Денят на посещение в исторически музей.',
    'Когато изненадахме учителката за рождения й ден.',
    'Денят на четене на открито в парка.',
    'Когато заснехме наш кратък филм за конкурса.',
    'Посещението в планетариума.',
    'Когато направихме собствен журнал на класа.',
    'Денят на международната кухня — ядохме от всички страни.',
    'Когато организирахме благотворителен базар.',
    'Денят на лагера — палатки и звезди.',
    'Когато поканихме родители да ни разкажат за професиите си.',
    'Денят на дебата — говорихме за климата.',
    'Когато правихме биологична градина в двора.',
    'Посещението в съдебна зала за урок по право.',
    'Денят, когато спечелихме конкурс за рисунка.',
  ],
  'Представи си, че можеш да си учител за един ден. Какво щеше да направиш?': [
    'Проведа целия час навън в природата.',
    'Направя урока изцяло с игри и викторини.',
    'Позволя на децата да учат каквото искат.',
    'Донеса домашни любимци в клас.',
    'Направя кино-час с образователен филм.',
    'Замести урока с готвене на традиционно ястие.',
    'Организирам ролева игра с исторически личности.',
    'Проведа математика само с пъзели.',
    'Напиша послания на всяко дете за силните му страни.',
    'Изведа класа на посещение в интересно място.',
    'Позволя на децата да бъдат учителите.',
    'Направя ден без оценки — само учене от любопитство.',
    'Разкажа за нещо, за което никой не пита в учебника.',
    'Организирам STEM предизвикателство за целия час.',
    'Направя нещо артистично с цялата класна стая.',
    'Покажа как науката е навсякъде около нас.',
    'Проведа урок по медитация и концентрация.',
    'Нарисуваме заедно голяма картина на класа.',
    'Разкажа историята на нашия град.',
    'Организирам дебат за важна тема за децата.',
  ],
}

// ─── Class voice answer pools ─────────────────────────────────────────────────

const VOICE_POOLS: Record<string, string[]> = {
  'Какъв е нашият клас? Опиши го с две или три думи': [
    'весел и приятелски', 'шумен и забавен', 'сплотен', 'креативен', 'приятелски',
    'любопитен', 'енергичен', 'мили и дружни', 'спортен', 'интелигентен',
    'весел и приятелски', 'шумен и забавен', 'сплотен', 'приятелски', 'енергичен',
  ],
  'Кой предмет харесваш най-много:': [
    'математика', 'биология', 'литература', 'история', 'физика',
    'химия', 'изобразително', 'музика', 'физическо', 'информатика',
    'математика', 'биология', 'история', 'литература', 'физическо',
  ],
  'А по кой предмет ти е най-трудно?': [
    'химия', 'физика', 'математика', 'граматика', 'история',
    'биология', 'немски', 'физика', 'математика', 'химия',
    'граматика', 'история', 'биология', 'физика', 'немски',
  ],
  'Каква е за теб класната/класния? Опиши го с три думи': [
    'добра', 'справедлива', 'умна', 'търпелива', 'строга',
    'весела', 'грижовна', 'мъдра', 'отдадена', 'разбираща',
    'подкрепяща', 'креативна', 'вдъхновяваща', 'честна', 'добра',
  ],
}

// ─── Events pool ──────────────────────────────────────────────────────────────

const EVENTS_POOL = [
  { title: 'Тържествено начало на учебната година',    event_date: '2024-09-16', note: 'Срещнахме се отново след лятото — нови лица, нови мечти, старо приятелство.' },
  { title: 'Есенна разходка в природата',              event_date: '2024-10-18', note: 'Берахме листа и правихме хербарий. Природата ни показа стотици цветове.' },
  { title: 'Хелоуин в клас',                           event_date: '2024-10-31', note: 'Маски, тиква и много смях — учителката също се маскира!' },
  { title: 'Коледен концерт',                          event_date: '2024-12-18', note: 'Изпяхме коледни песни пред родителите. Залата беше украсена с хиляди светлинки.' },
  { title: 'Нова година — класно парти',               event_date: '2024-12-20', note: 'Изпроводихме годината заедно — с торта, балони и списък с мечти за 2025.' },
  { title: 'Ден на влюбените — послания в клас',       event_date: '2025-02-14', note: 'Всеки написа тайно послание за класа. Прочетохме ги на глас и се разплакахме от смях.' },
  { title: 'Пролетна екскурзия',                       event_date: '2025-04-10', note: 'Посетихме природен парк. Вървяхме по екопътека и видяхме реален водопад.' },
  { title: 'Ден на Земята',                            event_date: '2025-04-22', note: 'Засадихме дръвчета в двора на училището. Нашата малка гора вече расте.' },
  { title: 'Ден на таланта',                           event_date: '2025-05-23', note: 'Рисуване, пеене, жонглиране, оригами — всеки показа по нещо своё. Незабравимо!' },
  { title: 'Последен учебен ден',                      event_date: '2025-06-13', note: 'Прегръдки, сълзи и смях. Обещахме си да се помним за цял живот.' },
]

// ─── Peer messages pool ───────────────────────────────────────────────────────

const MESSAGES = [
  'Ти си страхотен/страхотна съученик! Винаги ни разсмиваш в точния момент.',
  'Благодаря ти, че винаги ми помагаш, когато имам нужда. Истински приятел/приятелка!',
  'Много ми харесва твоята усмивка — правиш класа по-светъл само с присъствието си.',
  'Ти си един от най-добрите хора, которе познавам. Радвам се, че сме в един клас.',
  'Много те уважавам — честен/честна и справедлив/справедлива с всички.',
  'Твоята енергия прави всяко занятие по-интересно. Не се променяй!',
  'Благодаря ти, че ме изслуша, когато ми беше трудно. Помогна ми много.',
  'С теб учението е по-лесно и по-забавно. Надявам се да продължим да сме приятели.',
  'Обичам твоето чувство за хумор — без теб класът щеше да е наполовина по-тъп.',
  'Винаги си там за хората около теб. Рядко срещан талант!',
  'Напомняш ми да не се отказвам. Благодаря за тихата подкрепа.',
  'С теб дори понеделникът изглежда поносим!',
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pickRoundRobin<T>(pool: T[], index: number): T {
  return pool[index % pool.length]
}

// ─── seedDummyData ────────────────────────────────────────────────────────────

export async function seedDummyData(
  classId: string,
  studentCount: number,
): Promise<{ error: string | null }> {
  const admin = createServiceRoleClient()
  const count = Math.min(Math.max(studentCount, 1), 20)

  try {
    // 1. Ensure class has questions + polls + layout (idempotent via re-seed)
    //    Only re-seed if there are no questions yet.
    const { data: existingQs } = await admin
      .from('questions')
      .select('id, text, type, allows_text')
      .eq('class_id', classId)
      .eq('is_system', false)

    let questions = existingQs ?? []

    if (questions.length === 0) {
      // Class was created without seedDefaultClass → seed it now
      const { error: seedErr } = await seedDefaultClass(classId, admin)
      if (seedErr) return { error: seedErr }

      const { data: freshQs } = await admin
        .from('questions')
        .select('id, text, type, allows_text')
        .eq('class_id', classId)
        .eq('is_system', false)
      questions = freshQs ?? []
    }

    // 2. Create students
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

    // 3. Answers for personal questions (text only; video skipped — no real media)
    const textQs = questions.filter(q =>
      q.type === 'personal' && q.allows_text
    )
    const answerRows = allStudents.flatMap((student, si) =>
      textQs.map(q => {
        const pool = ANSWER_POOLS[q.text]
        return {
          student_id: student.id,
          question_id: q.id,
          text_content: pool ? pickRoundRobin(pool, si) : `Отговорът на ${student.first_name}.`,
          status: 'approved',
        }
      })
    )
    if (answerRows.length > 0) {
      const { error: aErr } = await admin.from('answers').insert(answerRows)
      if (aErr) return { error: aErr.message }
    }

    // 4. Class voice answers
    const voiceQs = questions.filter(q => q.type === 'class_voice')
    const voiceRows = voiceQs.flatMap(q => {
      const pool = VOICE_POOLS[q.text] ?? ['Дъми отговор.']
      // Each student gives one answer → use round-robin from pool
      return allStudents.map((_, si) => ({
        class_id: classId,
        question_id: q.id,
        content: pickRoundRobin(pool, si),
      }))
    })
    if (voiceRows.length > 0) {
      await admin.from('class_voice_answers').insert(voiceRows)
    }

    // 5. Events — add if class has fewer than 3
    const { data: existingEvents } = await admin
      .from('events')
      .select('id')
      .eq('class_id', classId)
    if ((existingEvents ?? []).length < 3) {
      const eventRows = EVENTS_POOL.map((e, i) => ({
        class_id: classId,
        title: e.title,
        event_date: e.event_date,
        note: e.note,
        order_index: (existingEvents?.length ?? 0) + i + 1,
        photos: [],
      }))
      await admin.from('events').insert(eventRows)
    }

    // 6. Poll votes — use existing polls, fall back to none
    const { data: polls } = await admin
      .from('class_polls')
      .select('id')
      .eq('class_id', classId)

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
        })
      )
      await admin.from('class_poll_votes').insert(voteRows)
    }

    // 7. Peer messages — 3 per student
    if (allStudents.length > 1) {
      const msgRows = allStudents.flatMap((recipient, ri) =>
        [0, 1, 2].map(j => {
          const authorIdx = (ri + j + 1) % allStudents.length
          return {
            recipient_student_id: recipient.id,
            author_student_id: allStudents[authorIdx].id,
            content: pickRoundRobin(MESSAGES, ri * 3 + j),
            status: 'approved',
          }
        })
      )
      await admin.from('peer_messages').insert(msgRows)
    }

    // 8. Wire layout blocks with correct question/poll IDs
    const voiceIds    = voiceQs.map(q => q.id)
    const pollIds     = (polls ?? []).map(p => p.id)

    const { data: classRow } = await admin
      .from('classes')
      .select('layout')
      .eq('id', classId)
      .single()

    if (classRow?.layout) {
      const blocks = classRow.layout as Array<{ type: string; config: Record<string, unknown> }>
      let cvIdx = 0
      let sbIdx = 0
      const updated = blocks.map(b => {
        if (b.type === 'class_voice' && voiceIds[cvIdx] != null)
          return { ...b, config: { ...b.config, questionId: voiceIds[cvIdx++] } }
        if (b.type === 'subjects_bar' && voiceIds[cvIdx + sbIdx] != null)
          return { ...b, config: { ...b.config, questionId: voiceIds[cvIdx + sbIdx++] } }
        if (b.type === 'polls_grid')
          return { ...b, config: { ...b.config, pollIds } }
        if (b.type === 'poll' && pollIds.length > 0)
          return { ...b, config: { ...b.config, pollId: pollIds[0] } }
        return b
      })
      await admin.from('classes').update({ layout: updated }).eq('id', classId)
    }

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
    // Poll votes already gone; delete polls themselves
    await admin.from('class_polls').delete().eq('class_id', classId)
    // Events
    await admin.from('events').delete().eq('class_id', classId)
    // Class voice answers
    await admin.from('class_voice_answers').delete().eq('class_id', classId)
    // Class-specific questions
    await admin.from('questions').delete().eq('class_id', classId).eq('is_system', false)

    revalidatePath(`/moderator/${classId}`)
    return { error: null }
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Неочаквана грешка' }
  }
}
