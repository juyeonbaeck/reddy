'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase, Task } from '@/lib/supabase'

export function useTasks(date?: string) {
  const [tasks,   setTasks]   = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const channelId = useRef(`tasks-${Math.random().toString(36).slice(2)}`)

  useEffect(() => {
    const fetchAll = async () => {
      let q = supabase.from('tasks').select('*').order('date').order('created_at')
      if (date) q = q.eq('date', date)
      const { data } = await q
      setTasks(data ?? [])
      setLoading(false)
    }
    fetchAll()

    const ch = supabase
      .channel(channelId.current)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tasks' },
        (payload) => {
          const t = payload.new as Task
          if (date && t.date !== date) return
          setTasks(prev => [...prev, t].sort((a, b) =>
            a.date < b.date ? -1 : a.date > b.date ? 1 :
            a.created_at < b.created_at ? -1 : 1
          ))
        }
      )
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tasks' },
        (payload) => {
          const t = payload.new as Task
          setTasks(prev => prev.map(existing => existing.id === t.id ? t : existing))
        }
      )
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'tasks' },
        (payload) => {
          const id = (payload.old as { id: string }).id
          setTasks(prev => prev.filter(existing => existing.id !== id))
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(ch) }
  }, [date])

  const toggleDone = async (id: string, is_done: boolean) => {
    await supabase.from('tasks').update({ is_done }).eq('id', id)
  }

  const deleteTask = async (id: string) => {
    await supabase.from('tasks').delete().eq('id', id)
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
  }

  return { tasks, loading, toggleDone, deleteTask, updateTask }
}
