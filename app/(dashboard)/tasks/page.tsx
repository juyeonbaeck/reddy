import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import TaskItem from '@/components/TaskItem'

export default async function TasksPage({
  searchParams,
}: { searchParams: { cat?: string; done?: string } }) {
  const supabase = createServerComponentClient({ cookies })

  let query = supabase.from('tasks').select('*').order('date').order('created_at')
  if (searchParams.cat)          query = query.eq('category', searchParams.cat)
  if (searchParams.done === '1') query = query.eq('is_done', true)

  const { data: tasks } = await query
  const list = tasks ?? []

  const FILTERS = [
    { label: '전체', href: '/tasks' },
    { label: '학습', href: '/tasks?cat=Study' },
    { label: '취준', href: '/tasks?cat=JobApp' },
    { label: '개인', href: '/tasks?cat=Personal' },
    { label: '완료', href: '/tasks?done=1' },
  ]

  const activeCat  = searchParams.cat ?? ''
  const activeDone = searchParams.done === '1'

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-serif text-2xl text-reddy-500">할 일</h1>
        <Link href="/tasks/new"
          className="bg-reddy-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-reddy-600 transition-colors">
          + 추가
        </Link>
      </div>

      <div className="flex gap-2 flex-wrap mb-4">
        {FILTERS.map(f => {
          const isActive =
            f.href === '/tasks'        ? (!activeCat && !activeDone) :
            f.href === '/tasks?done=1' ? activeDone :
            activeCat === (f.href.split('=')[1] ?? '')
          return (
            <Link key={f.href} href={f.href}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors
                ${isActive
                  ? 'bg-reddy-500 text-white border-reddy-500'
                  : 'bg-white text-stone-500 border-stone-200 hover:border-reddy-300'}`}>
              {f.label}
            </Link>
          )
        })}
      </div>

      {list.length === 0 ? (
        <p className="text-center text-stone-400 text-sm py-12">
          할 일 없음.{' '}
          <Link href="/tasks/new" className="text-reddy-500 underline">추가하기</Link>
        </p>
      ) : (
        list.map((t: any) => <TaskItem key={t.id} task={t} />)
      )}
    </div>
  )
}
