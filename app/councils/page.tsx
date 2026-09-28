'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import Header from '../../components/lv/Header';
import Footer from '../../components/lv/Footer';
import PostcodeSearch from '../../components/lv/PostcodeSearch';

const councils = [
  { slug: 'hertfordshire', name: 'Hertfordshire County Council', type: 'County Council', region: 'East of England', featured: true },
  { slug: 'westminster', name: 'Westminster City Council', type: 'City Council', region: 'London' },
  { slug: 'kent', name: 'Kent County Council', type: 'County Council', region: 'South East' },
  { slug: 'manchester', name: 'Manchester City Council', type: 'Metropolitan Council', region: 'North West' },
  { slug: 'surrey', name: 'Surrey County Council', type: 'County Council', region: 'South East' },
  { slug: 'birmingham', name: 'Birmingham City Council', type: 'Metropolitan Council', region: 'West Midlands' },
  { slug: 'essex', name: 'Essex County Council', type: 'County Council', region: 'East of England' },
  { slug: 'cambridgeshire', name: 'Cambridgeshire County Council', type: 'County Council', region: 'East of England' },
  { slug: 'hampshire', name: 'Hampshire County Council', type: 'County Council', region: 'South East' },
  { slug: 'oxfordshire', name: 'Oxfordshire County Council', type: 'County Council', region: 'South East' },
];

export default function CouncilsPage() {
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('all');

  const regions = useMemo(() => Array.from(new Set(councils.map(c => c.region))).sort(), []);
  const filtered = councils.filter(c => (region === 'all' || c.region === region) && c.name.toLowerCase().includes(search.toLowerCase()));

  return <div className="min-h-screen bg-slate-50">
    <Header />
    <main className="px-4 lg:px-8 py-10 max-w-6xl mx-auto">
      <div className="max-w-2xl mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Council directory</span>
        <h1 className="text-3xl font-bold text-slate-900 mt-2">Find a council or local area</h1>
        <p className="text-slate-500 mt-2">Search by authority name or postcode. Live national authority data will replace the concept directory during the API phase.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px_1fr] gap-3 bg-white border border-slate-200 rounded-2xl p-4 mb-7 shadow-sm">
        <div className="relative"><i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search councils..." className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"/></div>
        <select value={region} onChange={e=>setRegion(e.target.value)} className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white"><option value="all">All regions</option>{regions.map(r=><option key={r}>{r}</option>)}</select>
        <PostcodeSearch variant="compact" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(c=><Link key={c.slug} href={`/council/${c.slug}`} className={`group bg-white border rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg ${c.featured?'border-blue-300 ring-2 ring-blue-50':'border-slate-200 hover:border-blue-200'}`}>
          <div className="flex items-start justify-between gap-3">
            <div><span className="text-xs text-slate-400">{c.region}</span><h2 className="font-bold text-slate-900 mt-1 group-hover:text-blue-700">{c.name}</h2></div>
            {c.featured && <span className="text-[10px] font-bold rounded-full bg-blue-50 text-blue-700 px-2 py-1">FULL DASHBOARD</span>}
          </div>
          <div className="mt-5 flex items-center justify-between"><span className="text-xs font-medium text-slate-500">{c.type}</span><span className="text-sm font-semibold text-blue-700">Explore →</span></div>
          {c.featured && <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">Resident experience, official facts, projects, schools, transport, local decisions and open data.</p>}
        </Link>)}
      </div>

      {filtered.length===0 && <div className="text-center py-16 text-slate-500">No matching councils in the current concept directory.</div>}
    </main>
    <Footer />
  </div>;
}
