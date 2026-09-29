'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import Header from '../../components/lv/Header';
import Footer from '../../components/lv/Footer';
import PostcodeSearch from '../../components/lv/PostcodeSearch';
import { isSupabaseConfigured, supabase } from '../../lib/supabase/client';

type CouncilListItem = {
  slug: string;
  name: string;
  council_type: string;
  region: string | null;
  review_count?: number;
  average_rating?: number | null;
};

const fallbackCouncils: CouncilListItem[] = [
  { slug: 'hertfordshire', name: 'Hertfordshire County Council', council_type: 'county', region: 'East of England', review_count: 0, average_rating: null },
  { slug: 'westminster', name: 'Westminster City Council', council_type: 'london_borough', region: 'London' },
  { slug: 'kent', name: 'Kent County Council', council_type: 'county', region: 'South East' },
  { slug: 'manchester', name: 'Manchester City Council', council_type: 'metropolitan', region: 'North West' },
  { slug: 'surrey', name: 'Surrey County Council', council_type: 'county', region: 'South East' },
  { slug: 'birmingham', name: 'Birmingham City Council', council_type: 'metropolitan', region: 'West Midlands' },
  { slug: 'essex', name: 'Essex County Council', council_type: 'county', region: 'East of England' },
  { slug: 'cambridgeshire', name: 'Cambridgeshire County Council', council_type: 'county', region: 'East of England' },
  { slug: 'hampshire', name: 'Hampshire County Council', council_type: 'county', region: 'South East' },
  { slug: 'oxfordshire', name: 'Oxfordshire County Council', council_type: 'county', region: 'South East' },
];

function formatCouncilType(type: string) {
  return type
    .replace('london_borough', 'London Borough')
    .replace('metropolitan', 'Metropolitan Council')
    .replace('county', 'County Council')
    .replace('unitary', 'Unitary Authority')
    .replace('district', 'District Council')
    .replace(/_/g, ' ');
}

export default function CouncilsPage() {
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('all');
  const [councils, setCouncils] = useState<CouncilListItem[]>(fallbackCouncils);
  const [dataMode, setDataMode] = useState<'live' | 'fallback'>(isSupabaseConfigured ? 'live' : 'fallback');

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const load = async () => {
      const { data: councilRows, error: councilError } = await supabase
        .from('councils')
        .select('slug,name,council_type,region')
        .order('name');

      const { data: summaryRows } = await supabase
        .from('council_review_summary')
        .select('slug,review_count,average_rating');

      if (councilError || !councilRows) {
        setDataMode('fallback');
        return;
      }

      const summaryBySlug = new Map(
        (summaryRows || []).map((row: any) => [row.slug, row])
      );

      setCouncils(
        councilRows.map((c: any) => {
          const summary = summaryBySlug.get(c.slug) as any;
          return {
            slug: c.slug,
            name: c.name,
            council_type: c.council_type,
            region: c.region,
            review_count: summary?.review_count ?? 0,
            average_rating: summary?.average_rating == null ? null : Number(summary.average_rating),
          };
        })
      );
      setDataMode('live');
    };

    load();
  }, []);

  const regions = useMemo(
    () => Array.from(new Set(councils.map(c => c.region).filter(Boolean) as string[])).sort(),
    [councils]
  );

  const filtered = councils.filter(c =>
    (region === 'all' || c.region === region) &&
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return <div className="min-h-screen bg-slate-50">
    <Header />
    <main className="px-4 lg:px-8 py-10 max-w-6xl mx-auto">
      <div className="max-w-2xl mb-8">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Council directory</span>
          <span className={`text-[10px] font-bold rounded-full px-2 py-1 ${dataMode === 'live' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
            {dataMode === 'live' ? 'LIVE SUPABASE' : 'FALLBACK DATA'}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mt-2">Find a council or local area</h1>
        <p className="text-slate-500 mt-2">Browse authority records and resident review summaries from the live council data layer.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px_1fr] gap-3 bg-white border border-slate-200 rounded-2xl p-4 mb-7 shadow-sm">
        <div className="relative"><i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search councils..." className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"/></div>
        <select value={region} onChange={e=>setRegion(e.target.value)} className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white"><option value="all">All regions</option>{regions.map(r=><option key={r}>{r}</option>)}</select>
        <PostcodeSearch variant="compact" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(c => {
          const featured = c.slug === 'hertfordshire';
          return <Link key={c.slug} href={`/council/${c.slug}`} className={`group bg-white border rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg ${featured?'border-blue-300 ring-2 ring-blue-50':'border-slate-200 hover:border-blue-200'}`}>
            <div className="flex items-start justify-between gap-3">
              <div><span className="text-xs text-slate-400">{c.region || 'Region not set'}</span><h2 className="font-bold text-slate-900 mt-1 group-hover:text-blue-700">{c.name}</h2></div>
              {featured && <span className="text-[10px] font-bold rounded-full bg-blue-50 text-blue-700 px-2 py-1">FULL DASHBOARD</span>}
            </div>
            <div className="mt-5 flex items-center justify-between"><span className="text-xs font-medium text-slate-500">{formatCouncilType(c.council_type)}</span><span className="text-sm font-semibold text-blue-700">Explore →</span></div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">{c.review_count ?? 0} live reviews</span>
              <span className="font-semibold text-slate-700">{c.average_rating == null ? 'No rating yet' : `${c.average_rating.toFixed(2)} / 5`}</span>
            </div>
          </Link>;
        })}
      </div>

      {filtered.length===0 && <div className="text-center py-16 text-slate-500">No matching councils found.</div>}
    </main>
    <Footer />
  </div>;
}
