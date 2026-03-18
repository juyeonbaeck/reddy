import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Sidebar from '@/components/Sidebar'
import BottomNav from '@/components/BottomNav'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return <main className="min-h-screen">{children}</main>
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <BottomNav />
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-surface">{children}</main>
    </div>
  )
}
