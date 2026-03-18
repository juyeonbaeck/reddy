import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import Link from 'next/link'
import TaskItem from '@/components/TaskItem'

const QUOTES = [
  '오늘의 노력이 내일의 기회를 만든다.',
  '작은 전진도 전진이다.',
  '준비된 자에게 기회는 반드시 온다.',
  '포기하지 않는 한 실패는 없다.',
  '매일 1%씩 성장하면 1년 후엔 달라진다.',
]

export default async function HomePage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  const today = format(new Date(), 'yyyy-MM-dd')

  const { data: todayTasks } = await supabase
    .from('tasks').select('*').eq('date', today).order('created_at')

  const tasks = todayTasks ?? []
  const done  = tasks.filter((t: any) => t.is_done).length
  const total = tasks.length
  const pct   = total > 0 ? Math.round(done / total * 100) : 0

  const { data: weekApps } = await supabase
    .from('tasks').select('id').eq('category', 'JobApp')
    .gte('date', format(new Date(Date.now() - 7 * 86400000), 'yyyy-MM-dd'))

  const now  = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? '좋은 아침이에요' : hour < 18 ? '안녕하세요' : '수고했어요'
  const quote = QUOTES[now.getDay() % QUOTES.length]
  const displayName = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? '님'

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-reddy-500">{greeting}, {displayName} 👋</h1>
        <p className="text-sm text-stone-400 mt-1">{format(now, 'yyyy년 M월 d일 EEEE', { locale: ko })}</p>
      </div>

      <div className="bg-reddy-500 rounded-2xl px-5 py-4 mb-6 text-white">
        <p className="font-serif text-base leading-relaxed opacity-95">&ldquo;{quote}&rdquo;</p>
        <p className="text-xs mt-2 opacity-50">— Reddy Daily Quote</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: '오늘 일정',    value: total,                  unit: '개', pct },
          { label: '완료',         value: done,                   unit: '개', pct },
          { label: '이번주 지원',  value: weekApps?.length ?? 0,  unit: '곳', pct: Math.min(100, (weekApps?.length ?? 0) * 20) },
        ].map(s => (
          <div key={s.label} className="bg-white border border-stone-100 rounded-xl p-4">
            <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-2">{s.label}</p>
            <p className="text-2xl font-light text-reddy-500">
              {s.value}<span className="text-sm text-stone-400 ml-1">{s.unit}</span>
            </p>
            <div className="h-0.5 bg-stone-100 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-reddy-400 rounded-full transition-all" style={{ width: `${s.pct}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-stone-700">오늘 할 일</h2>
        <Link href="/tasks" className="text-xs text-reddy-500 hover:underline">전체 보기 →</Link>
      </div>

      {tasks.length === 0 ? (
        <p className="text-center text-stone-400 text-sm py-10">
          오늘 일정이 없어요.{' '}
          <Link href="/tasks/new" className="text-reddy-500 underline">추가하기</Link>
        </p>
      ) : (
        tasks.map((t: any) => <TaskItem key={t.id} task={t} />)
      )}
    </div>
  )
}
