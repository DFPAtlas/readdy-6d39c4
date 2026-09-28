'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import Header from '../../components/lv/Header';
import Footer from '../../components/lv/Footer';
import StarRating from '../../components/lv/StarRating';

function SearchResults() {
  const searchParams = useSearchParams();
  const postcode = searchParams.get('postcode') || '';

  const councils = [
    {
      id: 'westminster',
      name: 'Westminster City Council',
      type: 'district',
      tier: 'district',
      region: 'London',
      rating: 4.2,
      reviews: 1247,
      services: 12,
    },
    {
      id: 'greater-london',
      name: 'Greater London Authority',
      type: 'unitary',
      tier: 'county',
      region: 'London',
      rating: 3.9,
      reviews: 856,
      services: 8,
    },
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

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="px-4 py-8 lg:px-8 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
            Your councils
          </h1>
          <p className="text-slate-500">
            Postcode <span className="font-mono font-medium text-slate-700">{postcode}</span>
          </p>
        </div>

        <div className="space-y-4">
          {councils.map((c) => (
            <Link
              key={c.id}
              href={`/council/${c.id}`}
              className="block bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {formatType(c.type)}
                    </span>
                    <span className="text-xs text-slate-400">{c.region}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mb-3">{c.name}</h2>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-slate-900">
                        {c.rating.toFixed(1)}
                      </span>
                      <StarRating rating={Math.round(c.rating)} size="sm" />
                    </div>
                    <span className="text-sm text-slate-400">
                      {c.reviews.toLocaleString()} reviews
                    </span>
                  </div>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-2">
                  <span className="text-xs text-slate-400">{c.services} services</span>
                  <span className="text-sm font-medium text-[#0B5FFF] flex items-center gap-1">
                    See ratings
                    <i className="ri-arrow-right-line" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {councils.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-search-line text-slate-400 text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No councils found</h3>
            <p className="text-slate-500 mb-6">
              We couldn&apos;t find any councils for this postcode. Please check and try again.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-2.5 bg-[#0B5FFF] text-white font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Try another postcode
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function SearchFallback() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="px-4 py-8 lg:px-8 max-w-3xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-48 mb-4" />
          <div className="h-4 bg-slate-200 rounded w-64 mb-8" />
          <div className="h-32 bg-slate-200 rounded mb-4" />
          <div className="h-32 bg-slate-200 rounded" />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchResults />
    </Suspense>
  );
}