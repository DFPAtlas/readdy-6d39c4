'use client';

import Link from 'next/link';
import StarRating from './StarRating';

interface CouncilHeroProps {
  council: {
    id: string;
    name: string;
    slug: string;
    council_type: string;
    region: string;
    overall_rating: number;
    review_count: number;
  };
}

export default function CouncilHero({ council }: CouncilHeroProps) {
  const getTypeColour = (type: string) => {
    switch (type) {
      case 'county': return 'bg-emerald-50 text-emerald-700';
      case 'district': return 'bg-sky-50 text-sky-700';
      case 'unitary': return 'bg-violet-50 text-violet-700';
      case 'metropolitan': return 'bg-orange-50 text-orange-700';
      case 'london_borough': return 'bg-rose-50 text-rose-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

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
    <div className="bg-white border-b border-slate-200">
      <div className="px-4 py-6 lg:px-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getTypeColour(council.council_type)}`}>
                {formatType(council.council_type)}
              </span>
              <span className="text-xs text-slate-500">{council.region}</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3">{council.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-slate-900">
                  {council.overall_rating.toFixed(1)}
                </span>
                <StarRating rating={Math.round(council.overall_rating)} />
              </div>
              <span className="text-sm text-slate-500">
                {council.review_count.toLocaleString()} reviews
              </span>
            </div>
          </div>
          <Link
            href={`/council/${council.slug}/review`}
            className="shrink-0 bg-[#0B5FFF] text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
          >
            Write a review
          </Link>
        </div>
      </div>
    </div>
  );
}