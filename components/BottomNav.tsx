'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, CalendarDays, CheckSquare, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const NAV = [
  { href: '/',         icon: Home,        label: '홈'     },
  { href: '/calendar', icon: CalendarDays, label: '캘린더' },
  { href: '/tasks',    icon: CheckSquare,  label: '할 일'  },
]

export default function BottomNav() {
  const pathname = usePathname()
  const router   = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white border-t border-stone-100 flex items-stretch"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {NAV.map(({ href, icon: Icon, label }) => {
        const active = pathname === href || (href !== '/' && pathname.startsWith(href))
        return (
          <Link key={href} href={href}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 pt-2 pb-1 text-[10px] font-medium transition-colors
              ${active ? 'text-reddy-500' : 'text-stone-400'}`}>
            <Icon size={22} strokeWidth={active ? 2.5 : 1.5} />
            {label}
          </Link>
        )
      })}
      <button
        onClick={handleLogout}
        className="flex-1 flex flex-col items-center justify-center gap-0.5 pt-2 pb-1 text-[10px] font-medium text-stone-400 active:bg-stone-50"
      >
        <LogOut size={22} strokeWidth={1.5} />
        로그아웃
      </button>
    </nav>
  )
}
