'use client'

import { useMemo, useState } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Download,
  FileText,
  Filter,
  LayoutDashboard,
  Leaf,
  LogOut,
  Menu,
  PackageCheck,
  Search,
  Settings,
  ShieldCheck,
  Truck,
  Users,
  X,
} from 'lucide-react'

type Status = 'Needs review' | 'Approved' | 'Scheduled'

type Request = {
  organization: string
  type: string
  amount: string
  location: string
  submitted: string
  status: Status
}

const requests: Request[] = [
  { organization: 'Hope Kitchen', type: 'Prepared meals', amount: '85 servings', location: '3.2 km', submitted: '12 min ago', status: 'Needs review' },
  { organization: 'The Green Spoon', type: 'Bakery surplus', amount: '120 servings', location: '1.8 km', submitted: '28 min ago', status: 'Approved' },
  { organization: 'Ivy Hall University', type: 'Prepared meals', amount: '240 servings', location: '5.4 km', submitted: '1 hr ago', status: 'Scheduled' },
  { organization: 'Harvest & Co.', type: 'Fresh produce', amount: '42 boxes', location: '4.6 km', submitted: '2 hrs ago', status: 'Needs review' },
  { organization: 'Open Arms Shelter', type: 'Prepared meals', amount: '64 servings', location: '6.1 km', submitted: '3 hrs ago', status: 'Approved' },
]

const weeklyImpact = [42, 58, 49, 72, 64, 81, 88]

function Brand() {
  return <div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-xl bg-[#c8df9c] text-[#183b2f]"><Leaf className="size-5" /></div><div className="leading-none"><p className="font-serif text-[19px] font-bold tracking-[-0.03em] text-white">safeplate</p><p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#a7b9ad]">admin console</p></div></div>
}

function NavItem({ icon: Icon, label, active = false, count }: { icon: typeof LayoutDashboard; label: string; active?: boolean; count?: string }) {
  return <button className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[12px] font-semibold transition ${active ? 'bg-[#c8df9c] text-[#183b2f]' : 'text-[#aec0b5] hover:bg-white/10 hover:text-white'}`}><Icon className="size-4" /><span>{label}</span>{count && <span className="ml-auto rounded-full bg-[#d9825b] px-2 py-0.5 text-[9px] font-bold text-[#183b2f]">{count}</span>}</button>
}

function StatusBadge({ status }: { status: Status }) {
  const styles = { 'Needs review': 'bg-[#fff0d0] text-[#a76d2a]', Approved: 'bg-[#e1f1de] text-[#4f8756]', Scheduled: 'bg-[#e0edf0] text-[#4b7f8a]' }
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold ${styles[status]}`}>{status}</span>
}

function StatCard({ label, value, change, positive = true, icon: Icon }: { label: string; value: string; change: string; positive?: boolean; icon: typeof Users }) {
  return <div className="rounded-2xl border border-[#e2e9df] bg-white p-5"><div className="flex items-start justify-between"><div className="flex size-9 items-center justify-center rounded-xl bg-[#edf5e8] text-[#51835c]"><Icon className="size-4" /></div><span className={`flex items-center gap-1 text-[10px] font-bold ${positive ? 'text-[#57935e]' : 'text-[#c17a53]'}`}>{positive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}{change}</span></div><p className="mt-5 text-[11px] font-medium text-[#78877c]">{label}</p><p className="mt-1 font-serif text-[28px] font-bold tracking-[-0.05em] text-[#1c4233]">{value}</p></div>
}

export default function AdminDashboard() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [filter, setFilter] = useState<'All' | Status>('All')
  const [reviewed, setReviewed] = useState<string[]>([])
  const filteredRequests = useMemo(() => filter === 'All' ? requests : requests.filter((request) => request.status === filter), [filter])

  const markReviewed = (organization: string) => setReviewed((current) => current.includes(organization) ? current : [...current, organization])

  return <div className="min-h-screen bg-[#fbf7ed] text-[#1c4233]
  "><div className="flex min-h-screen"><aside className={`fixed inset-y-0 left-0 z-30 flex w-[250px] flex-col bg-[#183b2f] px-5 py-6 transition-transform lg:static lg:translate-x-0 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}><div className="flex items-center justify-between px-1"><Brand /><button onClick={() => setMenuOpen(false)} className="text-[#aec0b5] lg:hidden" aria-label="Close menu"><X className="size-5" /></button></div><div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.06] p-1"><div className="flex items-center gap-3 rounded-xl bg-white/10 px-3 py-2.5 text-[12px] font-bold text-white"><span className="flex size-6 items-center justify-center rounded-lg bg-[#c8df9c] text-[#183b2f]"><ShieldCheck className="size-3.5" /></span>Admin workspace<Check className="ml-auto size-3.5 text-[#c8df9c]" /></div></div><p className="mb-3 mt-10 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[#78998c]">Control center</p><nav className="flex flex-col gap-1"><NavItem icon={LayoutDashboard} label="Overview" active /><NavItem icon={PackageCheck} label="Donation requests" count="12" /><NavItem icon={Users} label="Users & partners" /><NavItem icon={Truck} label="Pickup operations" /><NavItem icon={FileText} label="Reports & impact" /></nav><p className="mb-3 mt-9 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[#78998c]">System</p><nav className="flex flex-col gap-1"><NavItem icon={Settings} label="Settings" /><NavItem icon={CircleHelp} label="Help center" /></nav><div className="mt-auto rounded-2xl bg-[#244d3b] p-4"><p className="text-[11px] font-bold text-[#c8df9c]">Network health</p><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[92%] rounded-full bg-[#c8df9c]" /></div><p className="mt-2 text-[10px] text-[#b2c4b8]">92% response rate this month</p></div><div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-5"><div className="flex size-8 items-center justify-center rounded-full bg-[#f9c6a6] text-[11px] font-bold text-[#7b4536]">AS</div><div><p className="text-[11px] font-semibold text-white">Aria Sharma</p><p className="text-[10px] text-[#78998c]">Super admin</p></div><button className="ml-auto text-[#aec0b5]" aria-label="Account menu"><ChevronDown className="size-4" /></button></div></aside>{menuOpen && <button className="fixed inset-0 z-20 bg-[#183b2f]/40 lg:hidden" onClick={() => setMenuOpen(false)} aria-label="Close navigation" />}<main className="min-w-0 flex-1"><header className="flex h-[76px] items-center justify-between border-b border-[#e2e9df] bg-[#fffdf8]/90 px-5 backdrop-blur sm:px-8 lg:px-10"><button onClick={() => setMenuOpen(true)} className="mr-3 text-[#43615c] lg:hidden" aria-label="Open menu"><Menu className="size-5" /></button><div className="hidden items-center gap-2 text-[11px] font-medium text-[#849088] sm:flex"><span className="text-[#b3bdb5]">SafePlate</span><span>/</span><span className="text-[#3b5c55]">Admin overview</span></div><div className="ml-auto flex items-center gap-3"><div className="hidden items-center gap-2 rounded-xl border border-[#e2e9df] bg-white px-3 py-2 text-[11px] text-[#8b9890] md:flex"><Search className="size-3.5" />Search operations<kbd className="ml-4 rounded border border-[#e0e7df] bg-[#f7f9f5] px-1.5 py-0.5 text-[9px]">⌘ K</kbd></div><button className="relative rounded-xl border border-[#e2e9df] bg-white p-2.5 text-[#61766e]" aria-label="Notifications"><Bell className="size-4" /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-[#d9825b]" /></button></div></header><div className="mx-auto max-w-[1450px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#7a948a]"><span className="size-1.5 rounded-full bg-[#c8df9c]" />Operations overview</div><h1 className="font-serif text-[36px] font-bold leading-none tracking-[-0.055em] text-[#1c4233] sm:text-[44px]">Good morning, Aria</h1><p className="mt-3 max-w-xl text-[13px] leading-relaxed text-[#74837b]">Keep the SafePlate network moving. Here is the latest across donations, partners, and pickups.</p></div><div className="flex gap-2"><button className="flex items-center gap-2 rounded-xl border border-[#dfe8dc] bg-white px-4 py-3 text-[11px] font-bold text-[#426953]"><Download className="size-4" />Export report</button><button className="flex items-center gap-2 rounded-xl bg-[#244d3b] px-4 py-3 text-[11px] font-bold text-white shadow-[0_8px_18px_rgba(36,77,59,0.14)]"><PackageCheck className="size-4" />Review queue</button></div></div><section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Meals redirected" value="12,840" change="18.4%" icon={PackageCheck} /><StatCard label="Active donors" value="48" change="6 this month" icon={Users} /><StatCard label="Partner NGOs" value="24" change="92% response" icon={ShieldCheck} /><StatCard label="CO₂ prevented" value="8.6t" change="12.8%" icon={Leaf} /></section><section className="mt-6 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]"><div className="rounded-2xl border border-[#e2e9df] bg-white p-5 sm:p-6"><div className="flex items-start justify-between"><div><h2 className="font-serif text-[20px] font-bold tracking-[-0.04em] text-[#1c4233]">Network impact</h2><p className="mt-1 text-[11px] text-[#87938c]">Meals redirected across the last seven days</p></div><button className="rounded-lg border border-[#e2e9df] px-3 py-2 text-[10px] font-bold text-[#5f7568]">This week <ChevronDown className="ml-1 inline size-3" /></button></div><div className="mt-8 flex h-[170px] items-end gap-3 sm:gap-5">{weeklyImpact.map((height, index) => <div key={index} className="flex flex-1 flex-col items-center gap-3"><div className="relative flex h-[140px] w-full items-end"><div className={`w-full rounded-t-lg ${index === 6 ? 'bg-[#8eb76e]' : 'bg-[#dcebd7]'}`} style={{ height: `${height}%` }} /></div><span className="text-[10px] font-medium text-[#9aa69e]">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</span></div>)}</div><div className="mt-5 flex items-center gap-2 border-t border-[#edf0eb] pt-4 text-[10px] text-[#7f8d83]"><span className="size-2 rounded-full bg-[#8eb76e]" />12,840 meals redirected <span className="ml-auto font-bold text-[#56915e]">+18.4% vs last week</span></div></div><div className="rounded-2xl bg-[#dcebd7] p-6"><div className="flex items-center justify-between"><div className="flex size-10 items-center justify-center rounded-xl bg-white/70 text-[#5b9462]"><ShieldCheck className="size-5" /></div><span className="rounded-full bg-white/60 px-2.5 py-1 text-[9px] font-bold text-[#5b8563]">LIVE STATUS</span></div><h2 className="mt-12 font-serif text-[25px] font-bold leading-tight tracking-[-0.04em] text-[#244f3d]">Everything is moving.</h2><p className="mt-3 max-w-[270px] text-[11px] leading-relaxed text-[#62816b]">All critical services are online and partner response times are healthy.</p><div className="mt-7 grid grid-cols-2 gap-3"><div className="rounded-xl bg-white/60 p-3"><p className="text-[9px] text-[#6f9177]">Avg. response</p><p className="mt-1 font-serif text-[20px] font-bold text-[#244f3d]">18 min</p></div><div className="rounded-xl bg-white/60 p-3"><p className="text-[9px] text-[#6f9177]">On-time pickup</p><p className="mt-1 font-serif text-[20px] font-bold text-[#244f3d]">96%</p></div></div></div></section><section className="mt-6 rounded-2xl border border-[#e2e9df] bg-white p-5 sm:p-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="font-serif text-[20px] font-bold tracking-[-0.04em] text-[#1c4233]">Donation request queue</h2><p className="mt-1 text-[11px] text-[#87938c]">Review and coordinate activity across the network.</p></div><div className="flex flex-wrap gap-2"><div className="flex items-center gap-1 rounded-xl border border-[#e2e9df] bg-[#fffdf8] p-1">{(['All', 'Needs review', 'Approved', 'Scheduled'] as const).map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-lg px-3 py-2 text-[10px] font-bold ${filter === item ? 'bg-[#244d3b] text-white' : 'text-[#7b8b80]'}`}>{item}</button>)}</div><button className="rounded-xl border border-[#e2e9df] p-2.5 text-[#6c8274]" aria-label="Filter requests"><Filter className="size-4" /></button></div></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead><tr className="border-b border-[#edf0eb] text-[9px] uppercase tracking-[0.12em] text-[#9aa69e]"><th className="pb-3 font-bold">Organization</th><th className="pb-3 font-bold">Donation type</th><th className="pb-3 font-bold">Quantity</th><th className="pb-3 font-bold">Distance</th><th className="pb-3 font-bold">Submitted</th><th className="pb-3 font-bold">Status</th><th className="pb-3 text-right font-bold">Action</th></tr></thead><tbody>{filteredRequests.map((request) => <tr key={request.organization} className="border-b border-[#f0f2ed] last:border-0"><td className="py-4"><p className="text-[11px] font-bold text-[#315549]">{request.organization}</p></td><td className="py-4 text-[10px] text-[#74837b]">{request.type}</td><td className="py-4 text-[10px] font-semibold text-[#496858]">{request.amount}</td><td className="py-4 text-[10px] text-[#74837b]">{request.location}</td><td className="py-4 text-[10px] text-[#8b9890]"><span className="flex items-center gap-1"><Clock3 className="size-3" />{request.submitted}</span></td><td className="py-4"><StatusBadge status={reviewed.includes(request.organization) ? 'Approved' : request.status} /></td><td className="py-4 text-right">{request.status === 'Needs review' && !reviewed.includes(request.organization) ? <button onClick={() => markReviewed(request.organization)} className="rounded-lg bg-[#edf5e8] px-3 py-2 text-[10px] font-bold text-[#4f8559] hover:bg-[#dcebd7]">Approve</button> : <span className="text-[10px] font-medium text-[#a0aba3]">No action</span>}</td></tr>)}</tbody></table>{filteredRequests.length === 0 && <p className="py-8 text-center text-[11px] text-[#87938c]">No requests in this view.</p>}</div></section></div></main></div></div>
}
