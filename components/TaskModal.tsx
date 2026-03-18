'use client'
import { useState } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { X, Check } from 'lucide-react'
import { Task, supabase } from '@/lib/supabase'
import { useTasks } from '@/hooks/useTasks'

const CATS = [
  { value: 'Study',    label: '학습', active: 'bg-reddy-50 text-reddy-700 border-reddy-400' },
  { value: 'JobApp',   label: '취준', active: 'bg-blue-50 text-blue-800 border-blue-400'   },
  { value: 'Personal', label: '개인', active: 'bg-green-50 text-green-800 border-green-400' },
] as const

type Props = {
  task: Task
  onClose: () => void
  onUpdate?: (updated: Task) => void
}

export default function TaskModal({ task, onClose, onUpdate }: Props) {
  const { toggleDone, deleteTask } = useTasks()

  const initTime = task.start_time ? format(new Date(task.start_time), 'HH:mm') : ''

  const [isDone,      setIsDone]      = useState(task.is_done)
  const [editTitle,   setEditTitle]   = useState(task.title)
  const [editDesc,    setEditDesc]    = useState(task.description ?? '')
  const [editCat,     setEditCat]     = useState(task.category)
  const [editDate,    setEditDate]    = useState(task.date)
  const [editTime,    setEditTime]    = useState(initTime)
  const [showConfirm, setShowConfirm] = useState(false)
  const [saving,      setSaving]      = useState(false)

  const isDirty =
    editTitle.trim() !== task.title ||
    editDesc.trim()  !== (task.description ?? '') ||
    editCat          !== task.category ||
    editDate         !== task.date ||
    editTime         !== initTime

  const handleSave = async () => {
    if (!editTitle.trim()) return
    setSaving(true)
    const updated: Task = {
      ...task,
      title:       editTitle.trim(),
      description: editDesc.trim() || null,
      category:    editCat,
      date:        editDate,
      start_time:  editTime ? `${editDate}T${editTime}:00` : null,
    }
    await supabase.from('tasks').update({
      title:       updated.title,
      description: updated.description,
      category:    updated.category,
      date:        updated.date,
      start_time:  updated.start_time,
    }).eq('id', task.id)
    setSaving(false)
    onUpdate?.(updated)
    setShowConfirm(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (showConfirm) { setShowConfirm(false); return }
      onClose()
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      if (showConfirm) { handleSave(); return }
      if (isDirty) setShowConfirm(true)
    }
  }

  const inputCls = 'w-full bg-transparent focus:outline-none'
  const labelCls = 'block text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1'

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 flex flex-col gap-4">
          {/* 헤더 */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {CATS.map(c => (
                <button
                  key={c.value} type="button"
                  onClick={() => { setEditCat(c.value); if (isDirty || c.value !== editCat) setShowConfirm(false) }}
                  className={`px-3 py-0.5 rounded-full text-xs font-semibold border-2 transition-all
                    ${editCat === c.value ? c.active : 'bg-white text-stone-300 border-stone-200'}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
              <X size={18} />
            </button>
          </div>

          {/* 제목 */}
          <input
            value={editTitle}
            onChange={e => { setEditTitle(e.target.value); setShowConfirm(false) }}
            onKeyDown={handleKeyDown}
            className={`font-serif text-xl text-stone-900 placeholder:text-stone-300 ${inputCls}
              ${isDone ? 'line-through text-stone-400' : ''}`}
            placeholder="제목"
          />

          {/* 날짜 · 시간 */}
          <div className="flex items-center gap-3 text-sm text-stone-400">
            <span>📅</span>
            <input
              type="date"
              value={editDate}
              onChange={e => { setEditDate(e.target.value); setShowConfirm(false) }}
              onKeyDown={handleKeyDown}
              className="text-sm text-stone-500 focus:outline-none focus:text-reddy-500 cursor-pointer"
            />
            <input
              type="time"
              value={editTime}
              onChange={e => { setEditTime(e.target.value); setShowConfirm(false) }}
              onKeyDown={handleKeyDown}
              className="text-sm text-stone-500 focus:outline-none focus:text-reddy-500 cursor-pointer"
            />
          </div>

          {/* 메모 */}
          <textarea
            value={editDesc}
            onChange={e => { setEditDesc(e.target.value); setShowConfirm(false) }}
            onKeyDown={handleKeyDown}
            placeholder="메모를 입력하세요..."
            rows={3}
            className={`text-sm text-stone-700 placeholder:text-stone-300 resize-none
              bg-stone-50 rounded-xl px-4 py-3 focus:outline-none focus:bg-stone-100 transition-colors ${inputCls}`}
          />

          {/* 액션 */}
          <div className="flex items-center gap-2 pt-1 border-t border-stone-100">
            <button
              onClick={() => {
                const next = !isDone
                setIsDone(next)
                onUpdate?.({ ...task, is_done: next })
                toggleDone(task.id, next)
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors
                ${isDone
                  ? 'bg-reddy-50 text-reddy-600 border-reddy-200'
                  : 'bg-white text-stone-500 border-stone-200 hover:bg-reddy-50'}`}
            >
              {isDone ? '✓ 완료됨' : '○ 완료 표시'}
            </button>
            {isDirty && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1 bg-reddy-500 text-white text-xs font-semibold px-3 py-1.5 rounded-xl hover:bg-reddy-600 transition-colors disabled:opacity-50"
              >
                <Check size={11} strokeWidth={3} />
                {saving ? '저장 중...' : '저장'}
              </button>
            )}
            <button
              onClick={async () => {
                if (!confirm('삭제할까요?')) return
                await deleteTask(task.id)
                onClose()
              }}
              className="ml-auto px-3 py-1.5 border border-red-100 text-red-400 rounded-xl text-xs hover:bg-red-50 transition-colors"
            >
              🗑️ 삭제
            </button>
          </div>
        </div>

        {/* 저장 확인 바 */}
        {showConfirm && (
          <div className="flex items-center justify-between bg-reddy-500 px-5 py-3">
            <p className="text-sm text-white">저장할까요?</p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/60">Enter로 확인</span>
              <button
                onClick={() => setShowConfirm(false)}
                className="text-white/70 hover:text-white text-xs px-2 py-1 rounded"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1 bg-white text-reddy-600 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-reddy-50 transition-colors disabled:opacity-50"
              >
                <Check size={12} strokeWidth={3} />
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
