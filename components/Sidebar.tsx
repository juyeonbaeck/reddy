'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, CalendarDays, CheckSquare, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const NAV = [
  { href: '/',         icon: Home,          label: '홈'     },
  { href: '/calendar', icon: CalendarDays,   label: '캘린더' },
  { href: '/tasks',    icon: CheckSquare,    label: '할 일'  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router   = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="w-[210px] flex-shrink-0 bg-white border-r border-stone-100 flex flex-col">
      {/* 로고 */}
      <div className="px-5 py-5 border-b border-stone-100">
        <p className="font-serif text-[22px] leading-none text-reddy-500 tracking-tight">Reddy</p>
        <p className="text-[11px] text-stone-400 mt-1">취준 생산성 대시보드</p>
      </div>

      {/* 네비 */}
      <nav className="flex-1 px-3 py-3">
        <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest px-2 mb-1">메인</p>
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors mb-0.5
                ${active
                  ? 'bg-reddy-50 text-reddy-600 font-semibold'
                  : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'}`}>
              <Icon size={15} className="flex-shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* 유저 */}
      <div className="px-3 py-3 border-t border-stone-100">
        <button onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-1.5 rounded-lg text-[12px] text-stone-400 hover:bg-stone-50 hover:text-stone-600 transition-colors">
          <LogOut size={13} /> 로그아웃
        </button>
      </div>
    </aside>
  )
}
