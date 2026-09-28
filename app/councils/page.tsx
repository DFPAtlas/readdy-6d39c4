'use client';

import Link from 'next/link';
import { useState } from 'react';
import Header from '../../components/lv/Header';
import Footer from '../../components/lv/Footer';
import StarRating from '../../components/lv/StarRating';
import PostcodeSearch from '../../components/lv/PostcodeSearch';

const councils = [
  { slug: 'westminster', name: 'Westminster City Council', type: 'district', region: 'London', rating: 4.2, reviews: 1247 },
  { slug: 'kent', name: 'Kent County Council', type: 'county', region: 'South East', rating: 3.8, reviews: 892 },
  { slug: 'manchester', name: 'Manchester City Council', type: 'metropolitan', region: 'North West', rating: 4.1, reviews: 1056 },
  { slug: 'surrey', name: 'Surrey County Council', type: 'county', region: 'South East', rating: 4.0, reviews: 734 },
  { slug: 'birmingham', name: 'Birmingham City Council', type: 'metropolitan', region: 'West Midlands', rating: 3.9, reviews: 1543 },
  { slug: 'essex', name: 'Essex County Council', type: 'county', region: 'East of England', rating: 3.7, reviews: 623 },
  { slug: 'leeds', name: 'Leeds City Council', type: 'metropolitan', region: 'Yorkshire', rating: 3.9, reviews: 987 },
  { slug: 'bristol', name: 'Bristol City Council', type: 'unitary', region: 'South West', rating: 4.0, reviews: 834 },
  { slug: 'cambridgeshire', name: 'Cambridgeshire County Council', type: 'county', region: 'East of England', rating: 3.9, reviews: 542 },
  { slug: 'hampshire', name: 'Hampshire County Council', type: 'county', region: 'South East', rating: 4.0, reviews: 1234 },
  { slug: 'camden', name: 'Camden Council', type: 'london_borough', region: 'London', rating: 3.8, reviews: 789 },
  { slug: 'oxfordshire', name: 'Oxfordshire County Council', type: 'county', region: 'South East', rating: 4.0, reviews: 698 },
];

const formatType = (type: string) => {
  switch (type) {
    case 'county': return 'County Council';
    case 'district': return 'District Council';
    case 'unitary': return 'Unitary Authority';
    case 'metropolitan': return 'Metropolitan District';
    case 'london_borough': return 'London Borough';
    default: return type;
  }
};

const typeColours: Record<string, string> = {
  county: 'bg-emerald-50 text-emerald-700',
  district: 'bg-sky-50 text-sky-700',
  unitary: 'bg-violet-50 text-violet-700',
  metropolitan: 'bg-orange-50 text-orange-700',
  london_borough: 'bg-rose-50 text-rose-700',
};

export default function CouncilsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const regions = Array.from(new Set(councils.map((c) => c.region)));
  const types = Array.from(new Set(councils.map((c) => c.type)));

  const filtered = councils.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || c.type === selectedType;
    const matchesRegion = selectedRegion === 'all' || c.region === selectedRegion;
    return matchesSearch && matchesType && matchesRegion;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="px-4 py-8 lg:px-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">All councils</h1>
          <p className="text-slate-500">Browse every local authority in the UK</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search councils..."
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#0B5FFF] transition-colors"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#0B5FFF] transition-colors pr-8 bg-white appearance-none cursor-pointer"
            >
              <option value="all">All types</option>
              {types.map((t) => (
                <option key={t} value={t}>{formatType(t)}</option>
              ))}
            </select>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#0B5FFF] transition-colors pr-8 bg-white appearance-none cursor-pointer"
            >
              <option value="all">All regions</option>
              {regions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <PostcodeSearch variant="compact" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <Link
              key={c.slug}
              href={`/council/${c.slug}`}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0">
                  <span className="text-xs text-slate-400">{c.region}</span>
                  <h3 className="text-base font-semibold text-slate-900 mt-0.5 truncate">{c.name}</h3>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ml-2 ${typeColours[c.type] || 'bg-slate-100 text-slate-600'}`}>
                  {formatType(c.type)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <StarRating rating={Math.round(c.rating)} size="sm" />
                <span className="text-sm font-semibold text-slate-900">{c.rating.toFixed(1)}</span>
                <span className="text-sm text-slate-400">{c.reviews.toLocaleString()} reviews</span>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-search-line text-slate-400 text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No councils found</h3>
            <p className="text-slate-500">Try adjusting your search or filters</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}