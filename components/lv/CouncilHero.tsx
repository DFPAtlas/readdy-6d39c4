'use client';

import Link from 'next/link';
import StarRating from './StarRating';
import { reviewHref } from '../../lib/navigation';
import { formatCouncilType } from '../../lib/councils';
import CouncilLogo from './CouncilLogo';

interface CouncilHeroProps {
  council: {
    id: string;
    name: string;
    slug: string;
    council_type: string;
    region: string;
    overall_rating: number;
    review_count: number;
    ratings_available?: boolean;
    logo_url?: string | null;
    logo_type?: string | null;
    logo_source_url?: string | null;
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
      case 'scottish_council': return 'bg-indigo-50 text-indigo-700';
      case 'welsh_council': return 'bg-red-50 text-red-700';
      case 'ni_district': return 'bg-teal-50 text-teal-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="px-4 py-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-4">
          <div className="min-w-0 flex items-start gap-4">
            <div className="flex flex-col items-center gap-1">
              <CouncilLogo name={council.name} logoUrl={council.logo_url} logoType={council.logo_type} size={64} />
              {council.logo_url && council.logo_source_url && (
                <a href={council.logo_source_url} target="_blank" rel="noopener noreferrer" aria-label={`Image source and licence on Wikimedia Commons for the ${council.name} ${council.logo_type === 'coat_of_arms' ? 'coat of arms' : 'logo'}`} className="text-[10px] text-slate-400 hover:text-slate-600 underline">
                  Image credit
                </a>
              )}
            </div>
            <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getTypeColour(council.council_type)}`}>
                {formatCouncilType(council.council_type)}
              </span>
              <span className="text-xs text-slate-500">{council.region}</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3">{council.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold text-slate-900">
                  {council.ratings_available === false ? 'Reviews unavailable' : council.review_count ? council.overall_rating.toFixed(1) : 'No rating yet'}
                </span>
                {council.ratings_available !== false && <StarRating rating={Math.round(council.overall_rating)} />}
              </div>
              <span className="text-sm text-slate-500">
                {council.ratings_available === false ? '' : `${council.review_count.toLocaleString()} reviews`}
              </span>
            </div>
            </div>
          </div>
          <Link
            href={reviewHref(council.slug)}
            className="shrink-0 bg-[#0B5FFF] text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
          >
            Write a review
          </Link>
        </div>
      </div>
    </div>
  );
}
