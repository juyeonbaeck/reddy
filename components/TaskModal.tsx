'use client'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { X } from 'lucide-react'
import Link from 'next/link'
import { Task } from '@/lib/supabase'
import { useTasks } from '@/hooks/useTasks'

const CAT_LABEL: Record<string, string> = { Study: '학습', JobApp: '취준', Personal: '개인' }
const CAT_STYLE: Record<string, string> = {
  Study:    'bg-reddy-50 text-reddy-700',
  JobApp:   'bg-blue-50 text-blue-800',
  Personal: 'bg-green-50 text-green-800',
}

type Props = {
  task: Task
  onClose: () => void
  onUpdate?: (updated: Task) => void
}

export default function TaskModal({ task, onClose, onUpdate }: Props) {
  const { toggleDone, deleteTask } = useTasks()

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded ${CAT_STYLE[task.category]}`}>
            {CAT_LABEL[task.category]}
          </span>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
            <X size={18} />
          </button>
        </div>

        <h2 className={`font-serif text-xl leading-snug mb-4 ${task.is_done ? 'line-through text-stone-400' : 'text-stone-900'}`}>
          {task.title}
        </h2>

        <div className="space-y-1.5 mb-4 text-sm text-stone-500">
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
          <button
            onClick={async () => {
              await toggleDone(task.id, !task.is_done)
              onUpdate?.({ ...task, is_done: !task.is_done })
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-colors
              ${task.is_done
                ? 'bg-reddy-50 text-reddy-600 border-reddy-200'
                : 'bg-white text-stone-500 border-stone-200 hover:bg-reddy-50'}`}
          >
            {task.is_done ? '✓ 완료됨' : '○ 완료 표시'}
          </button>
          <Link
            href={`/tasks/${task.id}/edit`}
            className="px-4 py-2 border border-stone-200 rounded-xl text-sm text-stone-600 hover:bg-stone-50 transition-colors"
          >
            ✏️ 수정
          </Link>
          <button
            onClick={async () => {
              if (!confirm('삭제할까요?')) return
              await deleteTask(task.id)
              onClose()
            }}
            className="ml-auto px-4 py-2 border border-red-100 text-red-400 rounded-xl text-sm hover:bg-red-50 transition-colors"
          >
            🗑️ 삭제
          </button>
        </div>
      </div>
    </div>
  )
}
