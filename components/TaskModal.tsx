'use client'
import { useState } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { X } from 'lucide-react'
import { Task, supabase } from '@/lib/supabase'
import { useTasks } from '@/hooks/useTasks'

const CATS = [
  { value: 'Study',    label: '학습', active: 'bg-reddy-50 text-reddy-700 border-reddy-400' },
  { value: 'JobApp',   label: '취준', active: 'bg-blue-50 text-blue-800 border-blue-400'   },
  { value: 'Personal', label: '개인', active: 'bg-green-50 text-green-800 border-green-400' },
] as const

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

  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDesc,  setEditDesc]  = useState(task.description ?? '')
  const [editCat,   setEditCat]   = useState(task.category)
  const [editDate,  setEditDate]  = useState(task.date)
  const [editTime,  setEditTime]  = useState(
    task.start_time ? format(new Date(task.start_time), 'HH:mm') : ''
  )
  const [saving, setSaving] = useState(false)

  const inputCls = 'w-full px-3 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-reddy-400 transition-colors'
  const labelCls = 'block text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1.5'

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
    setIsEditing(false)
  }

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
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4">
          {isEditing ? (
            <span className="text-sm font-semibold text-reddy-500">수정</span>
          ) : (
            <span className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded ${CAT_STYLE[task.category]}`}>
              {CAT_LABEL[task.category]}
            </span>
          )}
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
            <X size={18} />
          </button>
        </div>

        {isEditing ? (
          /* ── 수정 폼 ── */
          <div className="space-y-3">
            <div>
              <label className={labelCls}>제목</label>
              <input
                autoFocus
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>카테고리</label>
              <div className="flex gap-2">
                {CATS.map(c => (
                  <button
                    key={c.value} type="button"
                    onClick={() => setEditCat(c.value)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold border-2 transition-all
                      ${editCat === c.value ? c.active : 'bg-white text-stone-400 border-stone-200'}`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>날짜</label>
                <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>시작 시간</label>
                <input type="time" value={editTime} onChange={e => setEditTime(e.target.value)} className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>메모</label>
              <textarea
                value={editDesc}
                onChange={e => setEditDesc(e.target.value)}
                rows={3}
                className={`${inputCls} resize-none`}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSave}
                disabled={!editTitle.trim() || saving}
                className="flex-1 bg-reddy-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-reddy-600 transition-colors disabled:opacity-50"
              >
                {saving ? '저장 중...' : '저장'}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 border border-stone-200 rounded-xl text-sm text-stone-500 hover:bg-stone-50 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          /* ── 상세 보기 ── */
          <>
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
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 border border-stone-200 rounded-xl text-sm text-stone-600 hover:bg-stone-50 transition-colors"
              >
                ✏️ 수정
              </button>
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
          </>
        )}
      </div>
    </div>
  )
}
