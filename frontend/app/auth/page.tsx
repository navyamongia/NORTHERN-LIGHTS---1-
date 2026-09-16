'use client'

import { FormEvent, useState } from 'react'
import { ArrowRight, Building2, CheckCircle2, HandHeart, Leaf, LockKeyhole, Mail, Sparkles, UserRound } from 'lucide-react'
import { authenticate, UserRole } from '@/lib/auth-api'

const roles: Array<{ id: UserRole; label: string; detail: string; icon: typeof Building2 }> = [
  { id: 'donor', label: 'Food donor', detail: 'Hotel, restaurant or campus kitchen', icon: Building2 },
  { id: 'ngo', label: 'NGO partner', detail: 'Community organization or shelter', icon: HandHeart },
]

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [role, setRole] = useState<UserRole>('donor')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (mode === 'signup' && !name.trim()) return setError('Please enter your full name.')
    if (!email.includes('@')) return setError('Please enter a valid work email.')
    if (password.length < 6) return setError('Password must be at least 6 characters.')

    setIsSubmitting(true)
    try {
      const result = await authenticate({ mode, role, name: name.trim(), email, password })
      setSuccess(`${mode === 'signin' ? 'Welcome back' : 'Account created'} — ${result.user.name}.`)
      setPassword('')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Something went wrong.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#fffaf0] text-[#193b2d] lg:grid lg:grid-cols-[0.9fr_1.1fr]">
      <section className="relative hidden overflow-hidden bg-[#193b2d] p-10 text-[#fffaf0] lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div className="absolute -right-28 top-20 size-80 rounded-full border-[52px] border-[#9fbe7d]/20" />
        <div className="absolute -bottom-24 -left-24 size-96 rounded-full border-[70px] border-[#d9825b]/15" />
        <div className="relative flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-[#c8df9c] text-[#193b2d]"><Sparkles className="size-5" /></div><div><p className="font-serif text-xl font-bold tracking-tight">safeplate</p><p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#b9c8a7]">food rescue network</p></div></div>
        <div className="relative max-w-md"><div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-[#e6efd6] text-[#4d774c]"><Leaf className="size-6" /></div><h1 className="font-serif text-5xl font-bold leading-[0.98] tracking-[-0.06em] xl:text-6xl">Good food deserves another table.</h1><p className="mt-6 max-w-sm text-sm leading-7 text-[#c8d4bf]">Choose your role to connect with a local network that turns surplus meals into meaningful support.</p><div className="mt-10 flex items-center gap-3 text-xs text-[#c8d4bf]"><CheckCircle2 className="size-4 text-[#c8df9c]" /> Donor and NGO accounts in one trusted network</div></div>
        <p className="relative text-[10px] text-[#91a98f]">© 2025 SafePlate · Built for communities, by communities.</p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10"><div className="w-full max-w-[440px]">
        <div className="mb-10 flex items-center gap-3 lg:hidden"><div className="flex size-9 items-center justify-center rounded-xl bg-[#c8df9c] text-[#193b2d]"><Sparkles className="size-4" /></div><div><p className="font-serif text-lg font-bold">safeplate</p><p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#75916d]">food rescue network</p></div></div>
        <div className="mb-8"><p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#75916d]">Your place in the network</p><h2 className="font-serif text-4xl font-bold tracking-[-0.055em] text-[#193b2d]">{mode === 'signin' ? 'Sign in to SafePlate.' : 'Join the food rescue network.'}</h2><p className="mt-3 text-sm leading-6 text-[#718473]">{mode === 'signin' ? 'Choose your role, then continue to your workspace.' : 'Create a role-based account for your organization.'}</p></div>
        <div className="mb-5 flex rounded-xl bg-[#f3eddf] p-1"><button type="button" onClick={() => { setMode('signin'); setError(''); setSuccess('') }} className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition ${mode === 'signin' ? 'bg-white text-[#193b2d] shadow-sm' : 'text-[#84927f]'}`}>Sign in</button><button type="button" onClick={() => { setMode('signup'); setError(''); setSuccess('') }} className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition ${mode === 'signup' ? 'bg-white text-[#193b2d] shadow-sm' : 'text-[#84927f]'}`}>Create account</button></div>
        <div className="mb-6"><p className="mb-2 text-[11px] font-bold text-[#48614d]">I am joining as</p><div className="grid gap-2 sm:grid-cols-2">{roles.map((item) => { const Icon = item.icon; return <button type="button" key={item.id} onClick={() => setRole(item.id)} className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${role === item.id ? 'border-[#789b62] bg-[#eef5e5]' : 'border-[#e7dfcf] bg-white hover:border-[#bfcfb2]'}`}><Icon className="size-4 text-[#638b5d]" /><span><span className="block text-[11px] font-bold text-[#36583f]">{item.label}</span><span className="mt-0.5 block text-[9px] text-[#879687]">{item.detail}</span></span></button> })}</div></div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>{mode === 'signup' && <label className="block"><span className="mb-2 block text-[11px] font-bold text-[#48614d]">Full name</span><div className="relative"><UserRound className="absolute left-4 top-3.5 size-4 text-[#94a28f]" /><input value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-xl border border-[#e7dfcf] bg-white py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#a9b2a6] focus:border-[#789b62] focus:ring-4 focus:ring-[#789b62]/10" placeholder="Your name" /></div></label>}
          <label className="block"><span className="mb-2 block text-[11px] font-bold text-[#48614d]">Work email</span><div className="relative"><Mail className="absolute left-4 top-3.5 size-4 text-[#94a28f]" /><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-[#e7dfcf] bg-white py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#a9b2a6] focus:border-[#789b62] focus:ring-4 focus:ring-[#789b62]/10" placeholder="you@organization.org" /></div></label>
          <label className="block"><div className="mb-2 flex items-center justify-between"><span className="text-[11px] font-bold text-[#48614d]">Password</span>{mode === 'signin' && <button type="button" className="text-[10px] font-bold text-[#6a9360]">Forgot password?</button>}</div><div className="relative"><LockKeyhole className="absolute left-4 top-3.5 size-4 text-[#94a28f]" /><input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-[#e7dfcf] bg-white py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#a9b2a6] focus:border-[#789b62] focus:ring-4 focus:ring-[#789b62]/10" placeholder="At least 6 characters" /></div></label>
          {error && <p role="alert" className="rounded-xl bg-[#fff0e9] px-3 py-2.5 text-[11px] font-semibold text-[#a45d42]">{error}</p>}{success && <p role="status" className="rounded-xl bg-[#e8f3e1] px-3 py-2.5 text-[11px] font-semibold text-[#4f7b4d]">{success}</p>}
          <button disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#315d42] py-3.5 text-xs font-bold text-white shadow-[0_10px_24px_rgba(49,93,66,0.18)] transition hover:bg-[#264e36] disabled:cursor-not-allowed disabled:opacity-70">{isSubmitting ? 'Connecting...' : mode === 'signin' ? `Sign in as ${role === 'donor' ? 'donor' : 'NGO'}` : 'Create account'}{!isSubmitting && <ArrowRight className="size-4" />}</button>
        </form>
        <p className="mt-6 text-center text-[10px] text-[#91a08f]">By continuing, you agree to our <button type="button" className="font-bold text-[#5f8659]">Terms of service</button> and <button type="button" className="font-bold text-[#5f8659]">Privacy policy</button>.</p>
      </div></section>
    </main>
  )
}
