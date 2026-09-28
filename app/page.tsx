'use client';

import Link from 'next/link';
import Header from '../components/lv/Header';
import Footer from '../components/lv/Footer';
import PostcodeSearch from '../components/lv/PostcodeSearch';

const pillars = [
  { icon: 'ri-star-line', title: 'Resident experience', text: 'Verified reviews and service-level ratings, kept separate from official statistics.' },
  { icon: 'ri-database-2-line', title: 'Official public data', text: 'ONS, GOV.UK, council, education, transport, environment and other open sources.' },
  { icon: 'ri-government-line', title: 'Local decisions', text: 'Council structure, meetings, consultations, projects, spending and representation.' },
  { icon: 'ri-map-pin-2-line', title: 'Living here', text: 'Schools, transport, housing, environment, local economy and wider area context.' },
];

const coverage = [
  ['Council services','Roads, social care, libraries, waste, planning and more'],
  ['Schools & children','Local schools, DfE data, admissions and SEND context'],
  ['Transport','Buses, rail context, highways, traffic and active travel'],
  ['Politics & representation','Neutral factual records, committees, meetings and published decisions'],
  ['Projects & consultations','What is happening now, what is planned and what residents can respond to'],
  ['Open data','Every official metric retains a source and snapshot date'],
];

export default function Home() {
  return <div className="min-h-screen bg-slate-50">
    <Header />

    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 opacity-30" style={{backgroundImage:"url('https://readdy.ai/api/search-image?query=modern%20British%20town%20and%20countryside%20aerial%20panorama%20local%20government%20community%20civic%20services%20photorealistic&width=1920&height=760&seq=rylchero&orientation=landscape')",backgroundSize:'cover',backgroundPosition:'center'}} />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-900/50" />
      <div className="relative px-4 py-20 lg:px-8 lg:py-28 max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full bg-blue-500/15 border border-blue-400/20 px-3 py-1 text-xs font-semibold text-blue-200 mb-5">Resident voice + public data + local decisions</span>
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight leading-tight">See what your council does — and what living there is really like.</h1>
          <p className="text-lg lg:text-xl text-slate-300 mt-6 max-w-2xl">Find your council, explore official data, follow local projects and decisions, and read verified resident experiences in one place.</p>
          <div className="mt-9 max-w-xl"><PostcodeSearch /></div>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link href="/council/hertfordshire" className="px-5 py-3 rounded-xl bg-white text-slate-900 font-semibold text-sm hover:bg-slate-100">Explore Hertfordshire dashboard</Link>
            <Link href="/councils" className="px-5 py-3 rounded-xl border border-white/20 bg-white/5 text-white font-semibold text-sm hover:bg-white/10">Browse councils</Link>
          </div>
        </div>
      </div>
    </section>

    <section className="px-4 lg:px-8 py-14 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-9"><h2 className="text-2xl lg:text-3xl font-bold text-slate-900">More than a review site</h2><p className="text-slate-500 mt-2">The platform keeps opinion, official performance data and wider area context clearly separated.</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">{pillars.map(p=><div key={p.title} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"><div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4"><i className={`${p.icon} text-xl`} /></div><h3 className="font-bold text-slate-900">{p.title}</h3><p className="text-sm text-slate-500 mt-2 leading-6">{p.text}</p></div>)}</div>
    </section>

    <section className="bg-white border-y border-slate-200">
      <div className="px-4 lg:px-8 py-14 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div><span className="text-xs font-bold uppercase tracking-wider text-blue-700">Featured concept build</span><h2 className="text-3xl font-bold text-slate-900 mt-2">Hertfordshire civic intelligence dashboard</h2><p className="text-slate-500 mt-4 leading-7">The first full dashboard combines population and council structure, resident service ratings, official facts, local government reorganisation, current projects, transport, schools, environment, representation, crime context and source links.</p><div className="grid grid-cols-2 gap-3 mt-6">{[['1.236m','2024 population'],['10','districts / boroughs'],['124','parish / town councils'],['2028','unitary reorganisation']].map(([v,l])=><div key={l} className="rounded-xl bg-slate-50 border border-slate-200 p-4"><div className="text-2xl font-bold text-slate-900">{v}</div><div className="text-xs text-slate-500 mt-1">{l}</div></div>)}</div><Link href="/council/hertfordshire" className="inline-flex mt-6 px-5 py-3 bg-[#0B5FFF] text-white rounded-xl font-semibold text-sm">Open dashboard →</Link></div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-xl"><div className="rounded-2xl bg-slate-900 p-5 text-white"><div className="flex items-center justify-between"><div><div className="text-xs text-blue-300">Rate Your Local Council</div><div className="text-xl font-bold mt-1">Hertfordshire County Council</div></div><span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-200">Official + resident data</span></div><div className="grid grid-cols-3 gap-3 mt-5">{[['3.6/5','Resident score'],['£1.2bn+','Annual spend'],['4.99%','2026/27 tax rise']].map(([v,l])=><div key={l} className="rounded-xl bg-white/10 p-3"><div className="font-bold">{v}</div><div className="text-[10px] text-slate-300 mt-1">{l}</div></div>)}</div></div><div className="grid grid-cols-2 gap-3 mt-3">{['Local government reorganisation','What’s happening now','Schools & children','Transport & roads','Politics & representation','Open data sources'].map(x=><div key={x} className="rounded-xl bg-white border border-slate-200 p-4 text-sm font-semibold text-slate-700">{x}</div>)}</div></div>
      </div>
    </section>

    <section className="px-4 lg:px-8 py-14 max-w-7xl mx-auto"><div className="flex items-end justify-between gap-4 mb-7"><div><h2 className="text-2xl font-bold text-slate-900">What each area dashboard can cover</h2><p className="text-slate-500 mt-1">Built to grow as more open-data integrations are connected.</p></div></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{coverage.map(([t,d])=><div key={t} className="bg-white border border-slate-200 rounded-2xl p-5"><h3 className="font-semibold text-slate-900">{t}</h3><p className="text-sm text-slate-500 mt-2">{d}</p></div>)}</div></section>

    <section className="px-4 lg:px-8 pb-16 max-w-7xl mx-auto"><div className="rounded-3xl bg-[#0B5FFF] text-white p-8 lg:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"><div><h2 className="text-2xl lg:text-3xl font-bold">Stronger local voices. Clearer public information.</h2><p className="text-blue-100 mt-2 max-w-2xl">Start with a postcode, then move from your council to the services, decisions, projects and local data that affect everyday life.</p></div><Link href="/councils" className="px-6 py-3 rounded-xl bg-white text-[#0B5FFF] font-bold text-sm whitespace-nowrap">Find your council</Link></div></section>

    <Footer />
  </div>;
}
