import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import Link from 'next/link'
import { TaskDoneToggle, TaskDeleteBtn } from '@/components/TaskActions'

export default async function TaskDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })
  const { data: task } = await supabase.from('tasks').select('*').eq('id', params.id).single()
  if (!task) notFound()

  const CAT_LABEL: Record<string, string> = { Study: '학습', JobApp: '취준', Personal: '개인' }
  const CAT_STYLE: Record<string, string> = {
    Study:    'bg-reddy-50 text-reddy-700',
    JobApp:   'bg-blue-50 text-blue-800',
    Personal: 'bg-green-50 text-green-800',
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-8">
      <Link href="/tasks" className="text-sm text-stone-400 hover:text-reddy-500 mb-5 inline-block">
        ← 목록으로
      </Link>
      <div className="bg-white border border-stone-100 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <h1 className={`font-serif text-2xl leading-snug ${task.is_done ? 'line-through text-stone-400' : 'text-stone-900'}`}>
            {task.title}
          </h1>
          <span className={`text-xs font-semibold px-2 py-1 rounded flex-shrink-0 uppercase tracking-wide ${CAT_STYLE[task.category]}`}>
            {CAT_LABEL[task.category]}
          </span>
        </div>

        <div className="space-y-2 mb-4 text-sm text-stone-500">
          <div className="flex items-center gap-2">
            <span>📅</span>
            {format(new Date(task.date), 'yyyy년 M월 d일 (EEE)', { locale: ko })}
            {task.start_time && ` · ${format(new Date(task.start_time), 'HH:mm')}`}
          </div>
          <div className="flex items-center gap-2">
            <span>{task.is_done ? '✅' : '○'}</span>
            {task.is_done ? '완료' : '미완료'}
          </div>
        </div>

        {task.description && (
          <div className="bg-stone-50 rounded-xl px-4 py-3 text-sm text-stone-700 leading-relaxed mb-5">
            {task.description}
          </div>
        )}

        <div className="flex gap-2 pt-4 border-t border-stone-100">
          <TaskDoneToggle id={task.id} isDone={task.is_done} />
          <Link href={`/tasks/${task.id}/edit`}
            className="px-4 py-2 border border-stone-200 rounded-xl text-sm text-stone-600 hover:bg-stone-50 transition-colors">
            ✏️ 수정
          </Link>
          <TaskDeleteBtn id={task.id} />
        </div>
      </div>
    </div>
  )
}
