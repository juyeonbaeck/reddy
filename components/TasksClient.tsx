'use client'
import { useState } from 'react'
import { format } from 'date-fns'
import { Check } from 'lucide-react'
import { Task, supabase } from '@/lib/supabase'
import { useTasks } from '@/hooks/useTasks'
import TaskItem from '@/components/TaskItem'
import TaskModal from '@/components/TaskModal'

const CATS = [
  { value: 'Study',    label: '학습', active: 'bg-reddy-50 text-reddy-700 border-reddy-400' },
  { value: 'JobApp',   label: '취준', active: 'bg-blue-50 text-blue-800 border-blue-400'   },
  { value: 'Personal', label: '개인', active: 'bg-green-50 text-green-800 border-green-400' },
] as const

type Cat    = 'Study' | 'JobApp' | 'Personal'
type Filter = '' | 'Study' | 'JobApp' | 'Personal' | 'done'

const FILTERS: { label: string; value: Filter }[] = [
  { label: '전체', value: '' },
  { label: '학습', value: 'Study' },
  { label: '취준', value: 'JobApp' },
  { label: '개인', value: 'Personal' },
  { label: '완료', value: 'done' },
]

export default function TasksClient() {
  const { tasks, loading, toggleDone, deleteTask } = useTasks()

  const [filter,   setFilter]   = useState<Filter>('')
  const [showAdd,  setShowAdd]  = useState(false)
  const [addTitle, setAddTitle] = useState('')
  const [addCat,   setAddCat]   = useState<Cat>('Study')
  const [addDate,  setAddDate]  = useState(format(new Date(), 'yyyy-MM-dd'))
  const [adding,   setAdding]   = useState(false)
  const [selected, setSelected] = useState<Task | null>(null)

  const filtered = tasks.filter(t => {
    if (filter === 'done') return t.is_done
    if (filter)            return t.category === filter
    return true
  })

  const handleAdd = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!addTitle.trim()) return
    setAdding(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('tasks').insert({
      title:    addTitle.trim(),
      category: addCat,
      date:     addDate,
      is_done:  false,
      user_id:  user!.id,
    })
    setAddTitle('')
    setAddDate(format(new Date(), 'yyyy-MM-dd'))
    setAdding(false)
    setShowAdd(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-serif text-2xl text-reddy-500">할 일</h1>
        <button
          onClick={() => setShowAdd(v => !v)}
          className="bg-reddy-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-reddy-600 transition-colors"
        >
          {showAdd ? '닫기' : '+ 추가'}
        </button>
      </div>

      {/* 필터 */}
      <div className="flex gap-2 flex-wrap mb-4">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors
              ${filter === f.value
                ? 'bg-reddy-500 text-white border-reddy-500'
                : 'bg-white text-stone-500 border-stone-200 hover:border-reddy-300'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 목록 */}
      {loading ? (
        <p className="text-center text-stone-300 text-sm py-12">불러오는 중...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-stone-400 text-sm py-12">
          할 일 없음.{' '}
          <button onClick={() => setShowAdd(true)} className="text-reddy-500 underline">
            추가하기
          </button>
        </p>
      ) : (
        filtered.map(t => <TaskItem key={t.id} task={t} onOpen={setSelected} />)
      )}

      {/* 인라인 추가 폼 */}
      {showAdd && (
        <form
          onSubmit={handleAdd}
          className="bg-white border border-reddy-100 rounded-xl px-4 py-3 mt-2 flex flex-col gap-2.5 shadow-sm"
        >
          <input
            autoFocus
            value={addTitle}
            onChange={e => setAddTitle(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Escape') setShowAdd(false)
              if (e.key === 'Enter') { e.preventDefault(); handleAdd() }
            }}
            placeholder="할 일 제목..."
            className="w-full text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none"
          />
          <div className="flex items-center gap-2 flex-wrap">
            {CATS.map(c => (
              <button
                key={c.value} type="button"
                onClick={() => setAddCat(c.value)}
                className={`px-3 py-0.5 rounded-full text-xs font-semibold border transition-all
                  ${addCat === c.value ? c.active : 'bg-white text-stone-400 border-stone-200'}`}
              >
                {c.label}
              </button>
            ))}
            <input
              type="date"
              value={addDate}
              onChange={e => setAddDate(e.target.value)}
              className="ml-auto text-xs text-stone-500 border border-stone-200 rounded-lg px-2 py-0.5 focus:outline-none focus:border-reddy-300"
            />
            <button
              type="submit"
              disabled={!addTitle.trim() || adding}
              className="w-6 h-6 rounded-full bg-reddy-500 flex items-center justify-center disabled:opacity-40"
            >
              <Check size={12} className="text-white" strokeWidth={3} />
            </button>
          </div>
        </form>
      )}

      {selected && (
        <TaskModal
          task={selected}
          onClose={() => setSelected(null)}
          onUpdate={updated => setSelected(updated)}
        />
      )}
    </div>
  )
}
