import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export type Task = {
  id: string
  user_id: string
  title: string
  description?: string | null
  category: 'Study' | 'JobApp' | 'Personal'
  is_done: boolean
  start_time?: string | null
  date: string
  created_at: string
}

export const supabase = createClientComponentClient()
