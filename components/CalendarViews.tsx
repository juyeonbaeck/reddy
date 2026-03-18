'use client'
import { useState } from 'react'
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  startOfWeek, endOfWeek, isSameMonth, isToday, isSameDay, addDays,
} from 'date-fns'
import { ko } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Task } from '@/lib/supabase'
import TaskItem from './TaskItem'

const DAYS = ['일', '월', '화', '수', '목', '금', '토']

const navBtn = 'p-1.5 border border-stone-200 rounded-lg hover:bg-reddy-50 transition-colors'
const navTitle = 'font-serif text-xl text-reddy-500 text-center min-w-[150px]'

type ViewProps = {
  tasks: Task[]
  onOpen: (task: Task) => void
  onToggle: (id: string, is_done: boolean) => void
}

// ── Monthly ───────────────────────────────────────────────
export function CalendarMonthly({ tasks, onOpen, onToggle }: ViewProps) {
  const [cur, setCur]      = useState(new Date())
  const [sel, setSel]      = useState(new Date())

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(cur), { weekStartsOn: 0 }),
    end:   endOfWeek(endOfMonth(cur),     { weekStartsOn: 0 }),
  })

  const tasksOn      = (d: Date) => tasks.filter(t => isSameDay(new Date(t.date), d))
  const selectedTasks = tasksOn(sel)

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center gap-3 mb-4">
        <button className={navBtn} onClick={() => setCur(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))}>
          <ChevronLeft size={15} className="text-stone-400" />
        </button>
        <h2 className={navTitle}>{format(cur, 'yyyy년 M월', { locale: ko })}</h2>
        <button className={navBtn} onClick={() => setCur(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))}>
          <ChevronRight size={15} className="text-stone-400" />
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[11px] font-semibold text-stone-400 tracking-widest py-1">{d}</div>
        ))}
      </div>

      {/* 날짜 셀 */}
      <div className="grid grid-cols-7 gap-0.5 mb-5">
        {days.map(day => {
          const dots    = tasksOn(day)
          const outside = !isSameMonth(day, cur)
          const today   = isToday(day)
          const isSel   = isSameDay(day, sel)

          return (
            <div key={day.toISOString()} onClick={() => setSel(day)}
              className={`flex flex-col items-center gap-1 py-1.5 rounded-lg cursor-pointer transition-colors
                ${outside ? 'opacity-25' : 'hover:bg-reddy-50'}
                ${isSel ? 'bg-reddy-50 ring-1 ring-reddy-300' : ''}`}>
              <span className={`w-6 h-6 flex items-center justify-center text-xs font-medium rounded-full
                ${today ? 'bg-reddy-500 text-white' : 'text-stone-700'}`}>
                {format(day, 'd')}
              </span>
              <div className="flex gap-0.5">
                {dots.slice(0, 3).map(t => (
                  <div key={t.id} className={`w-1 h-1 rounded-full
                    ${t.category === 'Study' ? 'bg-reddy-400' : t.category === 'JobApp' ? 'bg-blue-500' : 'bg-green-500'}`} />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* 선택 날 태스크 */}
      <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
        {format(sel, 'M월 d일 (EEE)', { locale: ko })} 일정
      </p>
      {selectedTasks.length === 0
        ? <p className="text-sm text-stone-400 text-center py-6">일정 없음</p>
        : selectedTasks.map(t => <TaskItem key={t.id} task={t} onOpen={onOpen} onToggle={onToggle} />)
      }
    </div>
  )
}

// ── Weekly ────────────────────────────────────────────────
export function CalendarWeekly({ tasks, onOpen, onToggle }: ViewProps) {
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }))
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const tasksOn = (d: Date) => tasks.filter(t => isSameDay(new Date(t.date), d))

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <button className={navBtn} onClick={() => setWeekStart(d => addDays(d, -7))}>
          <ChevronLeft size={15} className="text-stone-400" />
        </button>
        <h2 className={navTitle}>
          {format(weekStart, 'M/d')} — {format(addDays(weekStart, 6), 'M/d')}
        </h2>
        <button className={navBtn} onClick={() => setWeekStart(d => addDays(d, 7))}>
          <ChevronRight size={15} className="text-stone-400" />
        </button>
      </div>

      {days.map((day, i) => {
        const dayTasks = tasksOn(day)
        const today    = isToday(day)
        return (
          <div key={day.toISOString()} className="mb-4">
            <p className={`text-xs font-semibold uppercase tracking-wider mb-1.5
              ${today ? 'text-reddy-500' : 'text-stone-400'}`}>
              {DAYS[i]}요일 · {format(day, 'M/d')}
            </p>
            {dayTasks.length === 0
              ? <p className="text-xs text-stone-300 pl-1 pb-1">일정 없음</p>
              : dayTasks.map(t => <TaskItem key={t.id} task={t} onOpen={onOpen} onToggle={onToggle} />)
            }
          </div>
        )
      })}
    </div>
  )
}

// ── Daily ─────────────────────────────────────────────────
export function CalendarDaily({ tasks, onOpen, onToggle }: ViewProps) {
  const [day, setDay] = useState(new Date())
  const dayTasks = tasks.filter(t => isSameDay(new Date(t.date), day))
  const done     = dayTasks.filter(t => t.is_done).length
  const total    = dayTasks.length
  const pct      = total > 0 ? Math.round(done / total * 100) : 0

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <button className={navBtn} onClick={() => setDay(d => addDays(d, -1))}>
          <ChevronLeft size={15} className="text-stone-400" />
        </button>
        <h2 className={navTitle}>{format(day, 'M월 d일 (EEE)', { locale: ko })}</h2>
        <button className={navBtn} onClick={() => setDay(d => addDays(d, 1))}>
          <ChevronRight size={15} className="text-stone-400" />
        </button>
      </div>

      {total > 0 && (
        <div className="mb-4">
          <p className="text-xs text-stone-400 mb-1">{done} / {total} 완료</p>
          <div className="h-1 bg-stone-100 rounded-full overflow-hidden">
            <div className="h-full bg-reddy-500 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

      {dayTasks.length === 0
        ? <p className="text-sm text-stone-400 text-center py-8">일정 없음</p>
        : dayTasks.map(t => <TaskItem key={t.id} task={t} onOpen={onOpen} onToggle={onToggle} />)
      }
    </div>
  )
}
