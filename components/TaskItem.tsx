'use client'
import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Task, supabase } from '@/lib/supabase'

const CAT_LABEL: Record<string, string> = { Study: '학습', JobApp: '취준', Personal: '개인' }
const CAT_STYLE: Record<string, string> = {
  Study:    'bg-reddy-50 text-reddy-700',
  JobApp:   'bg-blue-50 text-blue-800',
  Personal: 'bg-green-50 text-green-800',
}

export default function TaskItem({ task, onOpen }: { task: Task; onOpen?: (task: Task) => void }) {
  const router = useRouter()
  const [done, setDone] = useState(task.is_done)

  useEffect(() => { setDone(task.is_done) }, [task.is_done])

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const next = !done
    setDone(next)  // 즉시 반영
    await supabase.from('tasks').update({ is_done: next }).eq('id', task.id)
  }

  return (
    <div
      onClick={() => onOpen ? onOpen(task) : router.push(`/tasks/${task.id}`)}
      className={`flex items-center gap-3 bg-white border border-stone-100 rounded-xl
        px-3 py-2.5 mb-1.5 cursor-pointer hover:shadow-sm transition-shadow
        ${done ? 'opacity-50' : ''}`}
    >
      <button
        onClick={handleToggle}
        className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-colors
          ${done ? 'bg-reddy-500 border-reddy-500' : 'border-stone-300 hover:border-reddy-400'}`}
      >
        {done && <Check size={10} className="text-white" strokeWidth={3} />}
      </button>

      <span className={`text-sm font-medium flex-1
        ${done ? 'line-through text-stone-400' : 'text-stone-800'}`}>
        {task.title}
      </span>

      <span className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded
        ${CAT_STYLE[task.category]}`}>
        {CAT_LABEL[task.category]}
      </span>
    </div>
  )
}
