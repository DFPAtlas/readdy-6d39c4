'use client';

import StarRating from './StarRating';

interface Review {
  id: string;
  display_name: string;
  is_resident: boolean;
  district?: string;
  rating: number;
  title: string;
  body: string;
  service_name?: string;
  created_at: string;
  helpful_count: number;
}

export default function ReviewCard({ review }: { review: Review }) {
  const badgeText = review.is_resident
    ? `Verified resident in ${review.district || 'this area'}`
    : 'Resident status unverified';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
            <i className="ri-user-line text-slate-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{review.display_name}</p>
            <p className={`text-xs flex items-center gap-1 ${review.is_resident ? 'text-emerald-700' : 'text-slate-400'}`}>
              <i className={`${review.is_resident ? 'ri-check-double-line' : 'ri-information-line'} text-xs`} />
              {badgeText}
            </p>
          </div>
        </div>
        <StarRating rating={review.rating} size="sm" />
      </div>

      <h4 className="text-sm font-semibold text-slate-800 mb-1.5">{review.title}</h4>
      <p className="text-sm text-slate-600 leading-relaxed mb-3 line-clamp-3">{review.body}</p>

      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          {review.service_name && (
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">
              {review.service_name}
            </span>
          )}
          <span suppressHydrationWarning={true}>
            {new Date(review.created_at).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>
        <button className="flex items-center gap-1 hover:text-slate-600 transition-colors cursor-pointer">
          <i className="ri-thumb-up-line" />
          Helpful ({review.helpful_count})
        </button>
      </div>
    </div>
  );
}