import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AuthForm from '@/components/AuthForm'

export default async function LoginPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  if (session) redirect('/')

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex w-[280px] flex-shrink-0 bg-reddy-500 flex-col justify-between p-10 relative overflow-hidden">
        <div className="absolute w-56 h-56 rounded-full border-[40px] border-white/5 -bottom-16 -right-16" />
        <div className="absolute w-32 h-32 rounded-full border-[28px] border-white/[0.04] top-12 right-6" />
        <div>
          <p className="font-serif text-3xl text-white tracking-tight">Reddy</p>
          <p className="text-xs text-white/50 mt-1">취준 생산성 대시보드</p>
        </div>
        <div className="relative z-10">
          <p className="font-serif text-base text-white/90 leading-relaxed">
            &ldquo;준비된 자에게<br />기회는 반드시 온다.&rdquo;
          </p>
          <p className="text-xs text-white/40 mt-2 italic">— Reddy Daily Quote</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <AuthForm />
      </div>
    </div>
  )
}
