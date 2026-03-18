'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Task } from '@/lib/supabase'
import { useTasks } from '@/hooks/useTasks'
import TaskItem from '@/components/TaskItem'
import TaskModal from '@/components/TaskModal'

export default function HomeTaskList({ date }: { date: string }) {
  const { tasks, updateTask, toggleDone } = useTasks(date)
  const [selected, setSelected] = useState<Task | null>(null)

  if (tasks.length === 0) {
    return (
      <p className="text-center text-stone-400 text-sm py-10">
        오늘 일정이 없어요.{' '}
        <Link href="/tasks/new" className="text-reddy-500 underline">추가하기</Link>
      </p>
    )
  }

  return (
    <>
      {tasks.map(t => (
        <TaskItem key={t.id} task={t} onOpen={setSelected}
          onToggle={(id, is_done) => { updateTask(id, { is_done }); toggleDone(id, is_done) }} />
      ))}
      {selected && (
        <TaskModal
          task={selected}
          onClose={() => setSelected(null)}
          onUpdate={updated => { setSelected(updated); updateTask(updated.id, updated) }}
        />
      )}
    </>
  )
}
