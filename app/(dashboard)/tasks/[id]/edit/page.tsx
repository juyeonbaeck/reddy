import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import TaskForm from '@/components/TaskForm'

export default async function EditTaskPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })
  const { data: task } = await supabase.from('tasks').select('*').eq('id', params.id).single()
  if (!task) notFound()

  return (
    <div className="max-w-lg mx-auto px-6 py-8">
      <TaskForm
        taskId={task.id}
        initial={{
          title:       task.title,
          description: task.description,
          category:    task.category,
          date:        task.date,
          start_time:  task.start_time,
        }}
      />
    </div>
  )
}
