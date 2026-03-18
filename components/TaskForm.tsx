'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { supabase, Task } from '@/lib/supabase'

type FormProps = { initial?: Partial<Task>; taskId?: string }

const CATS = [
  { value: 'Study',    label: '학습', active: 'bg-reddy-50 text-reddy-700 border-reddy-400'  },
  { value: 'JobApp',   label: '취준', active: 'bg-blue-50  text-blue-800  border-blue-400'   },
  { value: 'Personal', label: '개인', active: 'bg-green-50 text-green-800 border-green-400'  },
] as const

export default function TaskForm({ initial, taskId }: FormProps) {
  const router = useRouter()
  const isEdit = !!taskId

  const [title,     setTitle]     = useState(initial?.title       ?? '')
  const [desc,      setDesc]      = useState(initial?.description ?? '')
  const [date,      setDate]      = useState(initial?.date        ?? format(new Date(), 'yyyy-MM-dd'))
  const [startTime, setStartTime] = useState(
    initial?.start_time ? format(new Date(initial.start_time), 'HH:mm') : ''
  )
  const [cat,     setCat]     = useState<'Study' | 'JobApp' | 'Personal'>((initial?.category as any) ?? 'Study')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) { setError('제목을 입력해주세요'); return }
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    const payload = {
      title:       title.trim(),
      description: desc.trim() || null,
      category:    cat,
      date,
      start_time:  startTime ? `${date}T${startTime}:00` : null,
      user_id:     user!.id,
    }

    const { error: err } = isEdit
      ? await supabase.from('tasks').update(payload).eq('id', taskId)
      : await supabase.from('tasks').insert(payload)

    if (err) { setError(err.message); setLoading(false); return }
    router.push('/tasks')
    router.refresh()
  }

  const inputCls = 'w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-reddy-400 transition-colors'
  const labelCls = 'block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-stone-100 rounded-2xl p-6">
      <h1 className="font-serif text-xl text-reddy-500 mb-5">
        {isEdit ? '할 일 수정' : '새 할 일 추가'}
      </h1>

      <div className="mb-4">
        <label className={labelCls}>제목</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)}
          placeholder="할 일을 입력하세요" className={inputCls} />
      </div>

      <div className="mb-4">
        <label className={labelCls}>카테고리</label>
        <div className="flex gap-2">
          {CATS.map(c => (
            <button key={c.value} type="button" onClick={() => setCat(c.value)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border-2 transition-all
                ${cat === c.value ? c.active : 'bg-white text-stone-400 border-stone-200'}`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className={labelCls}>날짜</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>시작 시간 (선택)</label>
          <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className={inputCls} />
        </div>
      </div>

      <div className="mb-5">
        <label className={labelCls}>메모 (선택)</label>
        <textarea value={desc as string} onChange={e => setDesc(e.target.value)}
          placeholder="추가 메모를 입력하세요" rows={3}
          className={`${inputCls} resize-none`} />
      </div>

      {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

      <div className="flex gap-2">
        <button type="submit" disabled={loading}
          className="flex-1 bg-reddy-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-reddy-600 transition-colors disabled:opacity-50">
          {loading ? '저장 중...' : isEdit ? '수정 완료' : '저장'}
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-5 py-2.5 border border-stone-200 rounded-xl text-sm text-stone-500 hover:bg-stone-50 transition-colors">
          취소
        </button>
      </div>
    </form>
  )
}
