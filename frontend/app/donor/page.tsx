'use client'

import { useEffect, useMemo, useState } from 'react'
import { Clock3, Crosshair, Leaf, MapPin, PackageCheck, Plus, RefreshCw, ShieldCheck, Truck, Utensils, X } from 'lucide-react'

type DonationStatus = 'Listed' | 'Accepted' | 'Claimed' | 'Picked up' | 'Expired'
type Donation = { id: number; foodName: string; servings: number; createdAt: number; status: DonationStatus; pickedBy?: string }

const statusStyles: Record<DonationStatus, string> = {
  Listed: 'bg-[#eef5df] text-[#557346]',
  Accepted: 'bg-[#eaf0e9] text-[#32654d]',
  Claimed: 'bg-[#fff0dc] text-[#a85d32]',
  'Picked up': 'bg-[#e5f1ec] text-[#2e765c]',
  Expired: 'bg-[#f1eee7] text-[#8d8a7d]',
}

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

function LiveMap({ location, onLocate }: { location: { lat: number; lng: number } | null; onLocate: () => void }) {
  return (
    <div className="relative min-h-[310px] overflow-hidden rounded-[22px] border border-[#dfe7d8] bg-[#e8eee0]">
      <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'linear-gradient(28deg, transparent 48%, #c3d0b7 49%, #c3d0b7 50%, transparent 51%), linear-gradient(112deg, transparent 47%, #d2dbc9 48%, #d2dbc9 50%, transparent 51%), linear-gradient(#d6dfce 1px, transparent 1px), linear-gradient(90deg, #d6dfce 1px, transparent 1px)', backgroundSize: '100% 100%, 100% 100%, 42px 42px, 42px 42px' }} />
      <div className="absolute left-[12%] top-[25%] h-24 w-32 rotate-12 rounded-[50%] bg-[#d5e3c7]/80" />
      <div className="absolute bottom-[17%] right-[8%] h-28 w-44 -rotate-12 rounded-[50%] bg-[#d2e0c4]/80" />
      <div className="absolute left-[47%] top-[45%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        <div className="relative flex size-12 items-center justify-center rounded-full border-4 border-white bg-[#d9825b] text-white shadow-lg"><MapPin className="size-5 fill-current" /><span className="absolute inset-[-10px] animate-ping rounded-full border border-[#d9825b]/50" /></div>
        <div className="mt-2 rounded-full bg-[#183b2f] px-3 py-1 text-[10px] font-bold text-white">Your kitchen</div>
      </div>
      <div className="absolute bottom-4 left-4 rounded-xl border border-white/70 bg-white/90 px-3 py-2 text-[10px] font-semibold text-[#38513f] shadow-sm">Pickup radius · 10 km</div>
      <button onClick={onLocate} className="absolute right-4 top-4 flex items-center gap-2 rounded-xl border border-white bg-white/90 px-3 py-2 text-[10px] font-bold text-[#244d3b] shadow-sm"><Crosshair className="size-3.5" /> {location ? 'Location updated' : 'Use my location'}</button>
    </div>
  )
}

export default function DonorDashboard() {
  const [donations, setDonations] = useState<Donation[]>([
    { id: 1, foodName: 'Vegetable rice bowls', servings: 42, createdAt: Date.now() - 42 * 60 * 1000, status: 'Accepted', pickedBy: 'Hope Kitchen' },
    { id: 2, foodName: 'Fresh sandwich trays', servings: 28, createdAt: Date.now() - 3 * 60 * 60 * 1000, status: 'Picked up', pickedBy: 'Open Arms Shelter' },
    { id: 3, foodName: 'Bakery assortment', servings: 64, createdAt: Date.now() - 28 * 60 * 60 * 1000, status: 'Picked up', pickedBy: 'The Green Spoon' },
  ])
  const [foodName, setFoodName] = useState('')
  const [servings, setServings] = useState('')
  const [createdAt, setCreatedAt] = useState(() => new Date().toISOString().slice(0, 16))
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [now, setNow] = useState(Date.now())
  const [notice, setNotice] = useState('')

  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(timer) }, [])

  const activeDonations = donations.filter((donation) => donation.status !== 'Picked up' && donation.status !== 'Expired')
  const totalServings = donations.reduce((sum, donation) => sum + donation.servings, 0)
  const createDonation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!foodName.trim() || Number(servings) <= 0) return
    setDonations((current) => [{ id: Date.now(), foodName: foodName.trim(), servings: Number(servings), createdAt: new Date(createdAt).getTime() || Date.now(), status: 'Listed' }, ...current])
    setFoodName(''); setServings(''); setCreatedAt(new Date().toISOString().slice(0, 16)); setNotice('Donation listed for the next 2 hours.')
  }
  const locate = () => {
    if (!navigator.geolocation) { setNotice('Location is not available in this browser.'); return }
    navigator.geolocation.getCurrentPosition((position) => { setLocation({ lat: position.coords.latitude, lng: position.coords.longitude }); setNotice('Your live location is now visible to the pickup team.') }, () => setNotice('Location permission was not granted. Showing your saved pickup area.'))
  }
  const countdown = (donation: Donation) => {
    const remaining = Math.max(0, donation.createdAt + 2 * 60 * 60 * 1000 - now)
    return `${String(Math.floor(remaining / 3600000)).padStart(2, '0')}:${String(Math.floor((remaining % 3600000) / 60000)).padStart(2, '0')}:${String(Math.floor((remaining % 60000) / 1000)).padStart(2, '0')}`
  }
  const history = useMemo(() => donations.filter((donation) => donation.status === 'Picked up' || donation.status === 'Expired'), [donations])

  return <main className="min-h-screen bg-[#fbf7ed] text-[#254638]">
    <header className="border-b border-[#e3e8dd] bg-[#fffdf8]/90 px-5 py-4 backdrop-blur md:px-10"><div className="mx-auto flex max-w-[1240px] items-center justify-between"><div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-[#183b2f] text-[#c8df9c]"><Leaf className="size-5" /></div><div><p className="font-serif text-xl font-bold tracking-tight text-[#183b2f]">safeplate</p><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#899985]">food donor workspace</p></div></div><div className="flex items-center gap-3"><div className="hidden text-right sm:block"><p className="text-xs font-bold text-[#254638]">Ivy Hall University</p><p className="text-[10px] text-[#899985]">Verified donor</p></div><div className="flex size-9 items-center justify-center rounded-full bg-[#d9825b] text-xs font-bold text-[#183b2f]">IH</div></div></div></header>
    <div className="mx-auto max-w-[1240px] px-5 py-8 md:px-10"><div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#7d977c]">Donor dashboard</p><h1 className="font-serif text-4xl font-bold tracking-[-0.04em] text-[#183b2f]">Make surplus matter.</h1><p className="mt-2 max-w-xl text-sm leading-6 text-[#718171]">List surplus food in under a minute and let nearby community partners coordinate the pickup.</p></div><div className="flex items-center gap-2 rounded-full bg-[#e8f0df] px-3 py-2 text-[11px] font-bold text-[#557346]"><ShieldCheck className="size-4" /> Partner account verified</div></div>
      {notice && <div role="status" className="mb-6 flex items-center justify-between rounded-2xl border border-[#d5e3c7] bg-[#eef5df] px-4 py-3 text-xs font-semibold text-[#557346]"><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss notification"><X className="size-4" /></button></div>}
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <section className="rounded-[24px] border border-[#dfe7d8] bg-white p-6 shadow-[0_16px_50px_rgba(43,72,53,0.05)]"><div className="mb-6 flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7d977c]">New donation</p><h2 className="mt-1 font-serif text-2xl font-bold text-[#183b2f]">Share food today</h2></div><div className="flex size-10 items-center justify-center rounded-xl bg-[#f4eee3] text-[#d9825b]"><Plus className="size-5" /></div></div><form onSubmit={createDonation} className="flex flex-col gap-4"><label className="flex flex-col gap-2 text-xs font-bold text-[#38513f]">Food name<input required value={foodName} onChange={(e) => setFoodName(e.target.value)} placeholder="e.g. Vegetable rice bowls" className="rounded-xl border border-[#dfe7d8] bg-[#fffdf8] px-3 py-3 text-sm font-normal outline-none ring-[#9fbd85] placeholder:text-[#a7b3a5] focus:ring-2" /></label><label className="flex flex-col gap-2 text-xs font-bold text-[#38513f]">Servings available<input required min="1" type="number" value={servings} onChange={(e) => setServings(e.target.value)} placeholder="e.g. 50" className="rounded-xl border border-[#dfe7d8] bg-[#fffdf8] px-3 py-3 text-sm font-normal outline-none ring-[#9fbd85] placeholder:text-[#a7b3a5] focus:ring-2" /></label><label className="flex flex-col gap-2 text-xs font-bold text-[#38513f]">Time of creation<input required type="datetime-local" value={createdAt} onChange={(e) => setCreatedAt(e.target.value)} className="rounded-xl border border-[#dfe7d8] bg-[#fffdf8] px-3 py-3 text-sm font-normal outline-none ring-[#9fbd85] focus:ring-2" /></label><div className="rounded-xl bg-[#f7f4eb] p-3 text-[11px] leading-5 text-[#718171]"><Clock3 className="mr-1 inline size-3.5 text-[#d9825b]" /> Each listing stays active for <strong className="text-[#38513f]">2 hours</strong> or until it is picked up.</div><button className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-[#183b2f] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#244d3b]"><Plus className="size-4" /> List donation</button></form></section>
        <section><div className="mb-3 flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7d977c]">Live location</p><h2 className="mt-1 font-serif text-2xl font-bold text-[#183b2f]">Your pickup point</h2></div><button onClick={locate} className="rounded-xl border border-[#dfe7d8] bg-white p-2.5 text-[#557346]" aria-label="Refresh location"><RefreshCw className="size-4" /></button></div><LiveMap location={location} onLocate={locate} /><p className="mt-3 flex items-center gap-2 text-[11px] text-[#899985]"><MapPin className="size-3.5 text-[#d9825b]" /> {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Location sharing is off · click Use my location to enable it'}</p></section>
      </div>
      <section className="mt-10"><div className="mb-4 flex items-end justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7d977c]">Active listings</p><h2 className="mt-1 font-serif text-2xl font-bold text-[#183b2f]">Track your donations</h2></div><div className="hidden items-center gap-5 sm:flex"><div><p className="text-[10px] text-[#899985]">Total servings</p><p className="text-lg font-bold text-[#183b2f]">{totalServings}</p></div><div><p className="text-[10px] text-[#899985]">Active now</p><p className="text-lg font-bold text-[#183b2f]">{activeDonations.length}</p></div></div></div><div className="grid gap-4 lg:grid-cols-3">{activeDonations.map((donation) => <article key={donation.id} className="rounded-2xl border border-[#dfe7d8] bg-white p-5"><div className="flex items-start justify-between"><div className="flex size-10 items-center justify-center rounded-xl bg-[#eef5df] text-[#557346]"><Utensils className="size-4" /></div><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyles[donation.status]}`}>{donation.status}</span></div><h3 className="mt-4 text-sm font-bold text-[#254638]">{donation.foodName}</h3><p className="mt-1 text-[11px] text-[#899985]">{donation.servings} servings · listed {formatTime(donation.createdAt)}</p><div className="mt-5 flex items-center justify-between border-t border-[#edf0e9] pt-4"><div><p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#899985]">Time left</p><p className="font-mono text-lg font-bold text-[#d9825b]">{countdown(donation)}</p></div><div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#557346]"><PackageCheck className="size-3.5" /> {donation.pickedBy ?? 'Waiting for NGO'}</div></div></article>)}</div></section>
      <section className="mt-10"><div className="mb-4 flex items-end justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7d977c]">Donation history</p><h2 className="mt-1 font-serif text-2xl font-bold text-[#183b2f]">Earlier contributions</h2></div><button className="hidden items-center gap-2 rounded-xl border border-[#dfe7d8] bg-white px-3 py-2 text-[11px] font-bold text-[#557346] sm:flex"><Truck className="size-3.5" /> Export log</button></div><div className="overflow-hidden rounded-2xl border border-[#dfe7d8] bg-white">{history.map((donation) => <div key={donation.id} className="flex flex-col gap-3 border-b border-[#edf0e9] p-4 last:border-0 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-xl bg-[#f4eee3] text-[#d9825b]"><Truck className="size-4" /></div><div><p className="text-xs font-bold text-[#254638]">{donation.foodName}</p><p className="text-[10px] text-[#899985]">{donation.servings} servings · {formatTime(donation.createdAt)} · {donation.pickedBy}</p></div></div><span className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyles[donation.status]}`}>{donation.status}</span></div>)}{history.length === 0 && <p className="p-6 text-sm text-[#899985]">Your completed donations will appear here.</p>}</div></section>
    </div>
  </main>
}
