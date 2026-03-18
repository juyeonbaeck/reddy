'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase, Task } from '@/lib/supabase'

export function useTasks(date?: string) {
  const [tasks,   setTasks]   = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const channelId = useRef(`tasks-${Math.random().toString(36).slice(2)}`)

  useEffect(() => {
    const fetch = async () => {
      let q = supabase.from('tasks').select('*').order('date').order('created_at')
      if (date) q = q.eq('date', date)
      const { data } = await q
      setTasks(data ?? [])
      setLoading(false)
    }
    fetch()

    const ch = supabase
      .channel(channelId.current)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, fetch)
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
