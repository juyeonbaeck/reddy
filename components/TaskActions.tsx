'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export function TaskDoneToggle({ id, isDone }: { id: string; isDone: boolean }) {
  const [done, setDone] = useState(isDone)
  const router = useRouter()

  const toggle = async () => {
    const next = !done
    setDone(next)
    await supabase.from('tasks').update({ is_done: next }).eq('id', id)
    router.refresh()
  }

  return (
    <button onClick={toggle}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-colors
        ${done
          ? 'bg-reddy-50 text-reddy-600 border-reddy-200'
          : 'bg-white text-stone-500 border-stone-200 hover:bg-reddy-50'}`}>
      {done ? '✓ 완료됨' : '○ 완료 표시'}
    </button>
  )
}

export function TaskDeleteBtn({ id }: { id: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('삭제할까요?')) return
    await supabase.from('tasks').delete().eq('id', id)
    router.push('/tasks')
    router.refresh()
  }

  return (
    <button onClick={handleDelete}
      className="ml-auto px-4 py-2 border border-red-100 text-red-400 rounded-xl text-sm hover:bg-red-50 transition-colors">
      🗑️ 삭제
    </button>
  )
}
