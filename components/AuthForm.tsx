'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Tab = 'login' | 'signup'

export default function AuthForm() {
  const router = useRouter()
  const [tab,      setTab]      = useState<Tab>('login')
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState('')

  const reset = () => { setError(''); setSuccess('') }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); reset(); setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) { setError(error.message); return }
    router.push('/'); router.refresh()
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault(); reset()
    if (password.length < 6) { setError('비밀번호는 6자 이상이어야 해요'); return }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } },
    })
    setLoading(false)
    if (error) { setError(error.message); return }
    setSuccess('가입 완료! 이메일 인증 후 로그인해주세요 ✉️')
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    })
  }

  const inputCls = 'w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-reddy-400 transition-colors'
  const labelCls = 'block text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1.5'

  return (
    <div className="w-full max-w-[320px]">
      {/* 탭 */}
      <div className="flex border-b border-stone-100 mb-6">
        {(['login', 'signup'] as Tab[]).map(t => (
          <button key={t} onClick={() => { setTab(t); reset() }}
            className={`flex-1 py-2 text-sm font-medium border-b-2 -mb-px transition-colors
              ${tab === t ? 'border-reddy-500 text-reddy-500' : 'border-transparent text-stone-400 hover:text-stone-600'}`}>
            {t === 'login' ? '로그인' : '회원가입'}
          </button>
        ))}
      </div>

      {error   && <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 text-xs text-red-500 mb-4">{error}</div>}
      {success && <div className="bg-green-50 border border-green-100 rounded-xl px-3 py-2.5 text-xs text-green-700 mb-4">{success}</div>}

      <form onSubmit={tab === 'login' ? handleLogin : handleSignup} className="space-y-3">
        {tab === 'signup' && (
          <div>
            <label className={labelCls}>이름</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="홍길동" required className={inputCls} />
          </div>
        )}
        <div>
          <label className={labelCls}>이메일</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@email.com" required className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>비밀번호</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="••••••••" required className={inputCls} />
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-reddy-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-reddy-600 transition-colors disabled:opacity-50">
          {loading ? '처리 중...' : tab === 'login' ? '로그인' : '회원가입'}
        </button>
      </form>

      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-stone-100" />
        <span className="text-xs text-stone-400">또는</span>
        <div className="flex-1 h-px bg-stone-100" />
      </div>

      <button onClick={handleGoogle}
        className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 border border-stone-200 rounded-xl text-sm text-stone-600 hover:bg-stone-50 transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Google로 계속하기
      </button>
    </div>
  )
}
