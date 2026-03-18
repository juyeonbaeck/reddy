'use client'
import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Task } from '@/lib/supabase'
import { useTasks } from '@/hooks/useTasks'

const CAT_LABEL: Record<string, string> = { Study: '학습', JobApp: '취준', Personal: '개인' }
const CAT_STYLE: Record<string, string> = {
  Study:    'bg-reddy-50 text-reddy-700',
  JobApp:   'bg-blue-50 text-blue-800',
  Personal: 'bg-green-50 text-green-800',
}

export default function TaskItem({ task }: { task: Task }) {
  const { toggleDone } = useTasks()
  const router = useRouter()

  return (
    <div
      onClick={() => router.push(`/tasks/${task.id}`)}
      className={`flex items-center gap-3 bg-white border border-stone-100 rounded-xl
        px-3 py-2.5 mb-1.5 cursor-pointer hover:shadow-sm transition-shadow
        ${task.is_done ? 'opacity-50' : ''}`}
    >
      <button
        onClick={e => { e.stopPropagation(); toggleDone(task.id, !task.is_done) }}
        className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-colors
          ${task.is_done ? 'bg-reddy-500 border-reddy-500' : 'border-stone-300 hover:border-reddy-400'}`}
      >
        {task.is_done && <Check size={10} className="text-white" strokeWidth={3} />}
      </button>

      <span className={`text-sm font-medium flex-1
        ${task.is_done ? 'line-through text-stone-400' : 'text-stone-800'}`}>
        {task.title}
      </span>

      <span className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded
        ${CAT_STYLE[task.category]}`}>
        {CAT_LABEL[task.category]}
      </span>
    </div>
  )
}
