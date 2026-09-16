'use client'

import { useMemo, useState } from 'react'
import {
  ArrowUpRight,
  Bell,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  HandHeart,
  LayoutDashboard,
  Leaf,
  MapPin,
  Menu,
  PackageCheck,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
  Utensils,
  X,
  Zap,
} from 'lucide-react'

type Role = 'Admin' | 'Donor' | 'NGO'

const roleContent = {
  Admin: {
    eyebrow: 'Operations overview',
    title: 'Good morning, Aria',
    description: 'Here’s what’s happening across the SafePlate network today.',
    primary: 'Review requests',
    metrics: [
      { label: 'Meals redirected', value: '12,840', change: '+18.4%', icon: Utensils, tone: 'green' },
      { label: 'Active donors', value: '48', change: '+6 this month', icon: Building2, tone: 'blue' },
      { label: 'Partner NGOs', value: '24', change: '92% response rate', icon: HandHeart, tone: 'amber' },
      { label: 'CO₂ prevented', value: '8.6t', change: '+12.8%', icon: Leaf, tone: 'violet' },
    ],
  },
  Donor: {
    eyebrow: 'Donor workspace',
    title: 'Make today’s surplus count',
    description: 'Post available food in under a minute and connect with a nearby NGO.',
    primary: 'Post a donation',
    metrics: [
      { label: 'Meals donated', value: '2,480', change: '+22.1% this year', icon: Utensils, tone: 'green' },
      { label: 'Successful pickups', value: '86', change: '98% completion rate', icon: Truck, tone: 'blue' },
      { label: 'People served', value: '1,920', change: '+340 this month', icon: Users, tone: 'amber' },
      { label: 'Waste avoided', value: '1.2t', change: 'This quarter', icon: Leaf, tone: 'violet' },
    ],
  },
  NGO: {
    eyebrow: 'NGO workspace',
    title: 'Find food near your community',
    description: 'Browse verified donations, reserve what you need, and plan your next pickup.',
    primary: 'Browse donations',
    metrics: [
      { label: 'Meals received', value: '4,280', change: '+28.4% this year', icon: Utensils, tone: 'green' },
      { label: 'Active reservations', value: '06', change: '2 need pickup today', icon: PackageCheck, tone: 'blue' },
      { label: 'People supported', value: '2,140', change: '+180 this month', icon: Users, tone: 'amber' },
      { label: 'Pickup radius', value: '10 km', change: 'Change location', icon: MapPin, tone: 'violet' },
    ],
  },
} as const

const donations = [
  { title: 'Freshly baked bread & pastries', donor: 'The Green Spoon', distance: '1.8 km away', quantity: '120 servings', time: 'Pickup by 6:30 PM', tag: 'Bakery', color: 'peach' },
  { title: 'Vegetable biryani & raita', donor: 'Ivy Hall University', distance: '3.2 km away', quantity: '85 servings', time: 'Pickup by 8:00 PM', tag: 'Prepared meal', color: 'sage' },
  { title: 'Seasonal fruit boxes', donor: 'Harvest & Co.', distance: '4.6 km away', quantity: '42 boxes', time: 'Pickup tomorrow, 9 AM', tag: 'Produce', color: 'yellow' },
]

const activity = [
  { title: 'The Green Spoon donated 120 servings', detail: 'Just now · Ready for pickup', icon: Utensils, tone: 'green' },
  { title: 'Hope Kitchen claimed a donation', detail: '18 min ago · 85 servings', icon: Check, tone: 'blue' },
  { title: 'Pickup completed at Ivy Hall', detail: '42 min ago · 64 servings', icon: Truck, tone: 'amber' },
]

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex size-9 items-center justify-center rounded-xl bg-[#c8df9c] text-[#102a2a] shadow-[0_6px_18px_rgba(215,243,107,0.24)]">
        <Sparkles className="size-5" strokeWidth={2.5} />
        <span className="absolute -right-1 -top-1 size-2 rounded-full bg-[#d9825b]" />
      </div>
      <div className="leading-none">
        <p className="font-serif text-[19px] font-bold tracking-[-0.03em] text-white">safeplate</p>
        <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#a6b9b7]">food network</p>
      </div>
    </div>
  )
}

function Sidebar({ role, setRole, open, onClose }: { role: Role; setRole: (role: Role) => void; open: boolean; onClose: () => void }) {
  const nav = [
    { label: 'Overview', icon: LayoutDashboard },
    { label: 'Donations', icon: PackageCheck, count: role === 'NGO' ? '12' : undefined },
    { label: role === 'Donor' ? 'My impact' : 'People & partners', icon: role === 'Donor' ? Leaf : Users },
    { label: 'Pickups', icon: Truck },
  ]
  return (
    <aside className={`fixed inset-y-0 left-0 z-30 flex w-[258px] flex-col bg-[#183b2f] px-5 py-6 transition-transform duration-300 lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between px-1">
        <Logo />
        <button onClick={onClose} className="text-[#a6b9b7] lg:hidden" aria-label="Close menu"><X className="size-5" /></button>
      </div>
      <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.06] p-1">
        {(['Admin', 'Donor', 'NGO'] as Role[]).map((item) => (
          <button key={item} onClick={() => setRole(item)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[12px] font-semibold transition ${role === item ? 'bg-[#c8df9c] text-[#183b2f]' : 'text-[#b8c8c6] hover:bg-white/10'}`}>
            <span className={`flex size-6 items-center justify-center rounded-lg ${role === item ? 'bg-[#183b2f]/10' : 'bg-white/10'}`}>
              {item === 'Admin' ? <ShieldCheck className="size-3.5" /> : item === 'Donor' ? <Building2 className="size-3.5" /> : <HandHeart className="size-3.5" />}
            </span>
            <span>{item} view</span>
            {role === item && <Check className="ml-auto size-3.5" />}
          </button>
        ))}
      </div>
      <p className="mb-3 mt-10 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[#789290]">Workspace</p>
      <nav className="flex flex-col gap-1">
        {nav.map((item, index) => {
          const Icon = item.icon
          return <button key={item.label} className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-left text-[12px] font-medium transition ${index === 0 ? 'bg-white/10 text-white' : 'text-[#a6b9b7] hover:bg-white/[0.06] hover:text-white'}`}><Icon className={`size-4 ${index === 0 ? 'text-[#c8df9c]' : ''}`} /><span>{item.label}</span>{item.count && <span className="ml-auto rounded-full bg-[#d9825b] px-1.5 py-0.5 text-[9px] font-bold text-[#183b2f]">{item.count}</span>}</button>
        })}
      </nav>
      <p className="mb-3 mt-9 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[#789290]">Manage</p>
      <nav className="flex flex-col gap-1">
        <button className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-[12px] font-medium text-[#a6b9b7] hover:bg-white/[0.06] hover:text-white"><Settings className="size-4" />Settings</button>
        <button className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-[12px] font-medium text-[#a6b9b7] hover:bg-white/[0.06] hover:text-white"><CircleHelp className="size-4" />Help center</button>
      </nav>
      <div className="mt-auto rounded-2xl bg-[#1d4948] p-4">
        <div className="mb-3 flex items-center justify-between"><span className="flex size-8 items-center justify-center rounded-xl bg-[#c8df9c] text-[#183b2f]"><Leaf className="size-4" /></span><span className="text-[10px] font-bold text-[#c8df9c]">+18.4%</span></div>
        <p className="text-[12px] font-semibold text-white">Your impact is growing</p>
        <p className="mt-1 text-[10px] leading-relaxed text-[#a6b9b7]">Together, our network saved 2.4 tons of food this month.</p>
        <button className="mt-3 flex items-center gap-1 text-[10px] font-bold text-[#c8df9c]">View impact <ArrowUpRight className="size-3" /></button>
      </div>
      <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-5"><div className="flex size-8 items-center justify-center rounded-full bg-[#f9c6a6] text-[11px] font-bold text-[#7b4536]">AS</div><div className="min-w-0"><p className="truncate text-[11px] font-semibold text-white">Aria Sharma</p><p className="truncate text-[10px] text-[#789290]">Network admin</p></div><ChevronDown className="ml-auto size-4 text-[#789290]" /></div>
    </aside>
  )
}

function MetricCard({ metric }: { metric: (typeof roleContent.Admin.metrics)[number] }) {
  const Icon = metric.icon
  const tone = { green: 'bg-[#e5f6d2] text-[#4b8b42]', blue: 'bg-[#dfeff2] text-[#428493]', amber: 'bg-[#fff0d0] text-[#b67c32]', violet: 'bg-[#eae6fa] text-[#7761ad]' }[metric.tone]
  return <div className="rounded-2xl border border-[#e3e8e1] bg-white p-5 shadow-[0_8px_24px_rgba(43,67,53,0.035)]"><div className="flex items-start justify-between"><div className={`flex size-9 items-center justify-center rounded-xl ${tone}`}><Icon className="size-4" /></div><ArrowUpRight className="size-4 text-[#a8b4ad]" /></div><p className="mt-5 text-[11px] font-medium text-[#79867e]">{metric.label}</p><div className="mt-1 flex items-end justify-between gap-2"><p className="font-serif text-[28px] font-bold tracking-[-0.05em] text-[#163b39]">{metric.value}</p><span className="mb-1 text-[10px] font-bold text-[#569755]">{metric.change}</span></div></div>
}

export default function Home() {
  const [role, setRole] = useState<Role>('Admin')
  const [menuOpen, setMenuOpen] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [claimed, setClaimed] = useState<string[]>([])
  const content = roleContent[role]
  const visibleDonations = useMemo(() => showAll ? donations : donations.slice(0, 2), [showAll])
  const handleClaim = (title: string) => setClaimed((current) => current.includes(title) ? current : [...current, title])

  return <div className="min-h-screen bg-[#fbf7ed] text-[#163b39]">
    <div className="flex min-h-screen">
      <Sidebar role={role} setRole={(next) => { setRole(next); setMenuOpen(false) }} open={menuOpen} onClose={() => setMenuOpen(false)} />
      {menuOpen && <button className="fixed inset-0 z-20 bg-[#183b2f]/40 lg:hidden" onClick={() => setMenuOpen(false)} aria-label="Close navigation" />}
      <main className="min-w-0 flex-1">
        <header className="flex h-[76px] items-center justify-between border-b border-[#e3e8e1] bg-[#fffdf8]/80 px-5 backdrop-blur sm:px-8 lg:px-10">
          <button onClick={() => setMenuOpen(true)} className="mr-3 text-[#43615c] lg:hidden" aria-label="Open menu"><Menu className="size-5" /></button>
          <div className="hidden items-center gap-2 text-[11px] font-medium text-[#849088] sm:flex"><span className="text-[#b3bdb5]">Workspace</span><span>/</span><span className="text-[#3b5c55]">{role} overview</span></div>
          <div className="ml-auto flex items-center gap-3"><div className="hidden items-center gap-2 rounded-xl border border-[#e3e8e1] bg-white px-3 py-2 text-[11px] text-[#8b9890] md:flex"><Search className="size-3.5" />Search anything <kbd className="ml-4 rounded border border-[#e0e7df] bg-[#f7f9f5] px-1.5 py-0.5 text-[9px]">⌘ K</kbd></div><button className="relative rounded-xl border border-[#e3e8e1] bg-white p-2.5 text-[#61766e]" aria-label="Notifications"><Bell className="size-4" /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-[#d9825b]" /></button></div>
        </header>
        <div className="mx-auto max-w-[1450px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#7a948a]"><span className="size-1.5 rounded-full bg-[#a4cd48]" />{content.eyebrow}</div><h1 className="font-serif text-[34px] font-bold leading-none tracking-[-0.055em] text-[#163b39] sm:text-[42px]">{content.title}</h1><p className="mt-3 max-w-lg text-[13px] leading-relaxed text-[#74837b]">{content.description}</p></div><button className="flex w-fit items-center gap-2 rounded-xl bg-[#244d3b] px-4 py-3 text-[11px] font-bold text-white shadow-[0_8px_18px_rgba(23,63,61,0.14)] transition hover:bg-[#285c57]"><Plus className="size-4" />{content.primary}</button></section>
          <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{content.metrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}</section>
          <section className="mt-6 grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-2xl border border-[#e3e8e1] bg-white p-5 shadow-[0_8px_24px_rgba(43,67,53,0.035)] sm:p-6"><div className="flex items-start justify-between"><div><p className="font-serif text-[20px] font-bold tracking-[-0.04em] text-[#163b39]">{role === 'NGO' ? 'Available near you' : role === 'Donor' ? 'Your recent donations' : 'Network activity'}</p><p className="mt-1 text-[11px] text-[#87938c]">{role === 'NGO' ? 'Fresh opportunities within 10 km of your location' : 'A live view of your food redistribution network'}</p></div><button onClick={() => setShowAll(!showAll)} className="flex items-center gap-1 text-[10px] font-bold text-[#4d8d72]">{showAll ? 'Show less' : 'View all'}<ArrowUpRight className="size-3" /></button></div>{role === 'NGO' ? <div className="mt-5 flex flex-col gap-3">{visibleDonations.map((donation) => <div key={donation.title} className="group flex flex-col gap-4 rounded-xl border border-[#edf0eb] p-3.5 transition hover:border-[#cbdcc3] sm:flex-row sm:items-center"><div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${donation.color === 'peach' ? 'bg-[#fce4d2] text-[#bb744e]' : donation.color === 'sage' ? 'bg-[#dcecd5] text-[#5a8b50]' : 'bg-[#fff0bd] text-[#af8131]'}`}><Utensils className="size-5" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="truncate text-[12px] font-bold text-[#31514a]">{donation.title}</p><span className="rounded-full bg-[#f1f5ed] px-2 py-0.5 text-[9px] font-semibold text-[#749078]">{donation.tag}</span></div><p className="mt-1 text-[10px] text-[#829089]">{donation.donor} · {donation.distance}</p><div className="mt-2 flex flex-wrap gap-3 text-[10px] text-[#667a71]"><span className="flex items-center gap-1"><Users className="size-3 text-[#9fb195]" />{donation.quantity}</span><span className="flex items-center gap-1"><Clock3 className="size-3 text-[#9fb195]" />{donation.time}</span></div></div><button onClick={() => handleClaim(donation.title)} disabled={claimed.includes(donation.title)} className={`rounded-lg px-3 py-2 text-[10px] font-bold transition ${claimed.includes(donation.title) ? 'bg-[#e6f2df] text-[#55904d]' : 'bg-[#c8df9c] text-[#244a40] hover:bg-[#c5e65a]'}`}>{claimed.includes(donation.title) ? 'Reserved' : 'View & reserve'}</button></div>)}</div> : <div className="mt-5 flex flex-col gap-1">{activity.map((item) => { const Icon = item.icon; return <div key={item.title} className="flex items-center gap-3 rounded-xl px-2 py-3 hover:bg-[#f7f9f5]"><div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${item.tone === 'green' ? 'bg-[#e5f6d2] text-[#5e9b4f]' : item.tone === 'blue' ? 'bg-[#e0eff1] text-[#508d9a]' : 'bg-[#fff0d0] text-[#b78438]'}`}><Icon className="size-4" /></div><div className="min-w-0 flex-1"><p className="truncate text-[11px] font-semibold text-[#3d5b53]">{item.title}</p><p className="mt-1 text-[10px] text-[#91a098]">{item.detail}</p></div><ArrowUpRight className="size-3.5 text-[#b8c2ba]" /></div> })}</div>}<div className="mt-4 flex items-center gap-2 rounded-xl bg-[#f4f8ee] px-3 py-2.5 text-[10px] text-[#67806f]"><Zap className="size-3.5 text-[#91bb45]" />Live updates are synced across your network</div></div>
            <div className="rounded-2xl bg-[#dcebd7] p-6"><div className="flex items-center justify-between"><div className="flex size-10 items-center justify-center rounded-xl bg-white/70 text-[#589263]"><MapPin className="size-5" /></div><span className="rounded-full bg-white/60 px-2.5 py-1 text-[9px] font-bold text-[#5b8563]">LIVE MAP</span></div><h2 className="mt-12 max-w-[240px] font-serif text-[25px] font-bold leading-tight tracking-[-0.04em] text-[#244f3d]">Food is moving where it matters.</h2><p className="mt-3 max-w-[260px] text-[11px] leading-relaxed text-[#62816b]">{role === 'NGO' ? 'There are 12 active donations within your preferred pickup radius.' : 'See every donation and pickup happening across your community.'}</p><div className="relative mt-8 h-[138px] overflow-hidden rounded-xl border border-white/60 bg-[#bfe4cd]"><div className="absolute -left-5 top-8 size-32 rounded-full border-[18px] border-[#a9d5bd]/70" /><div className="absolute right-4 top-3 size-40 rounded-full border-[16px] border-[#a9d5bd]/60" /><div className="absolute bottom-3 left-1/2 size-20 rounded-full border-[11px] border-[#a9d5bd]/60" /><span className="absolute left-[22%] top-[35%] flex size-5 items-center justify-center rounded-full border-2 border-white bg-[#d9825b] shadow-md"><span className="size-1.5 rounded-full bg-white" /></span><span className="absolute left-[55%] top-[50%] flex size-5 items-center justify-center rounded-full border-2 border-white bg-[#77b66f] shadow-md"><span className="size-1.5 rounded-full bg-white" /></span><span className="absolute right-[18%] top-[25%] flex size-5 items-center justify-center rounded-full border-2 border-white bg-[#77b66f] shadow-md"><span className="size-1.5 rounded-full bg-white" /></span></div><button className="mt-5 flex items-center gap-1 text-[10px] font-bold text-[#3e7655]">Open full map <ArrowUpRight className="size-3" /></button></div>
          </section>
          <section className="mt-5 flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#e3e8e1] bg-white px-5 py-4 sm:flex-row sm:items-center sm:px-6"><div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-xl bg-[#fff0d0] text-[#b67c32]"><CalendarDays className="size-4" /></div><div><p className="text-[11px] font-bold text-[#405e55]">This week’s collective impact</p><p className="mt-0.5 text-[10px] text-[#8a9890]">The SafePlate community is making a difference.</p></div></div><div className="flex items-center gap-5"><div><p className="font-serif text-[18px] font-bold text-[#315d4e]">3,840</p><p className="text-[9px] text-[#92a097]">meals redirected</p></div><div className="h-7 w-px bg-[#e3e8e1]" /><div><p className="font-serif text-[18px] font-bold text-[#315d4e]">1.8t</p><p className="text-[9px] text-[#92a097]">waste avoided</p></div><button className="hidden size-8 items-center justify-center rounded-lg bg-[#f3f7ef] text-[#5c8e68] sm:flex"><ArrowUpRight className="size-4" /></button></div></section>
        </div>
      </main>
    </div>
  </div>
}
