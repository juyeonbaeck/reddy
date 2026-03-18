'use client'
import { useState } from 'react'
import { useTasks } from '@/hooks/useTasks'
import { CalendarMonthly, CalendarWeekly, CalendarDaily } from '@/components/CalendarViews'
import TaskModal from '@/components/TaskModal'
import { Task } from '@/lib/supabase'

const TABS = ['월별', '주별', '일별'] as const
type Tab = typeof TABS[number]

export default function CalendarPage() {
  const [tab, setTab] = useState<Tab>('월별')
  const { tasks, loading, updateTask } = useTasks()
  const [selected, setSelected] = useState<Task | null>(null)

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="flex gap-1 mb-6 border-b border-stone-100">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 text-sm font-medium border-b-2 -mb-px transition-colors
              ${tab === t
                ? 'border-reddy-500 text-reddy-500'
                : 'border-transparent text-stone-400 hover:text-stone-600'}`}>
            {t}
          </button>
        ))}
      </div>
      {loading ? (
        <p className="text-sm text-stone-400 text-center py-12">불러오는 중...</p>
      ) : (
        <>
          {tab === '월별' && <CalendarMonthly tasks={tasks} onOpen={setSelected} onToggle={(id, is_done) => updateTask(id, { is_done })} />}
          {tab === '주별' && <CalendarWeekly  tasks={tasks} onOpen={setSelected} onToggle={(id, is_done) => updateTask(id, { is_done })} />}
          {tab === '일별' && <CalendarDaily   tasks={tasks} onOpen={setSelected} onToggle={(id, is_done) => updateTask(id, { is_done })} />}
        </>
      )}

      {selected && (
        <TaskModal
          task={selected}
          onClose={() => setSelected(null)}
          onUpdate={updated => { setSelected(updated); updateTask(updated.id, updated) }}
        />
      )}
    </div>
  )
}
