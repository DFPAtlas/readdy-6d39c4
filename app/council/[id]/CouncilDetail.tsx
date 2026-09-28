'use client';

import Link from 'next/link';
import { useState } from 'react';
import Header from '../../../components/lv/Header';
import Footer from '../../../components/lv/Footer';
import CouncilHero from '../../../components/lv/CouncilHero';
import StarRating from '../../../components/lv/StarRating';
import ReviewCard from '../../../components/lv/ReviewCard';

interface CouncilDetailProps {
  councilId: string;
}

export default function CouncilDetail({ councilId }: CouncilDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'reviews' | 'contact'>('overview');
  const [reviewFilter, setReviewFilter] = useState<'newest' | 'highest' | 'lowest'>('newest');
  const [serviceFilter, setServiceFilter] = useState('all');

  const council = {
    id: councilId,
    slug: councilId,
    name: 'Westminster City Council',
    council_type: 'district',
    region: 'London',
    overall_rating: 4.2,
    review_count: 1247,
    five_star: 523,
    four_star: 412,
    three_star: 198,
    two_star: 78,
    one_star: 36,
  };

  const services = [
    { id: 'parking', name: 'Parking', slug: 'parking', rating: 3.5, reviews: 312, category: 'Transport' },
    { id: 'planning', name: 'Planning', slug: 'planning', rating: 3.8, reviews: 189, category: 'Housing' },
    { id: 'housing', name: 'Housing', slug: 'housing', rating: 2.9, reviews: 423, category: 'Housing' },
    { id: 'waste', name: 'Waste & recycling', slug: 'waste', rating: 4.3, reviews: 267, category: 'Environment' },
    { id: 'social', name: 'Adult social care', slug: 'social', rating: 3.6, reviews: 145, category: 'Social care' },
    { id: 'education', name: 'Education & schools', slug: 'education', rating: 4.1, reviews: 198, category: 'Education' },
    { id: 'highways', name: 'Highways & roads', slug: 'highways', rating: 3.2, reviews: 356, category: 'Transport' },
    { id: 'licensing', name: 'Licensing', slug: 'licensing', rating: 3.9, reviews: 87, category: 'Business' },
  ];

  const reviews = [
    {
      id: '1',
      display_name: 'Margaret H.',
      is_resident: true,
      district: 'Westminster',
      rating: 5,
      title: 'Brilliant waste collection service',
      body: 'The new recycling scheme has made it so much easier to sort rubbish. Collection is always on time and the team are courteous.',
      service_name: 'Waste & recycling',
      created_at: '2026-04-28T10:30:00Z',
      helpful_count: 14,
    },
    {
      id: '2',
      display_name: 'James T.',
      is_resident: true,
      district: 'Marylebone',
      rating: 2,
      title: 'Planning application took forever',
      body: 'Submitted a loft conversion application in January and only got approval in April. No communication between the case officer and us at all.',
      service_name: 'Planning',
      created_at: '2026-04-25T14:20:00Z',
      helpful_count: 22,
    },
    {
      id: '3',
      display_name: 'Sarah K.',
      is_resident: true,
      district: 'Westminster',
      rating: 4,
      title: 'Good school admissions process',
      body: 'Online application was straightforward. Got our first choice school. Would have liked more clarity on the waiting list process though.',
      service_name: 'Education & schools',
      created_at: '2026-04-20T09:15:00Z',
      helpful_count: 8,
    },
    {
      id: '4',
      display_name: 'Anonymous',
      is_resident: false,
      district: undefined,
      rating: 1,
      title: 'Parking enforcement is aggressive',
      body: 'Fined within 5 minutes of my permit expiring. No grace period at all. Feels like revenue generation rather than sensible enforcement.',
      service_name: 'Parking',
      created_at: '2026-04-18T16:45:00Z',
      helpful_count: 31,
    },
    {
      id: '5',
      display_name: 'David R.',
      is_resident: true,
      district: 'Westminster',
      rating: 3,
      title: 'Decent but could be better',
      body: 'Generally acceptable service levels. However, phone wait times for council tax queries are far too long. The online portal helps.',
      service_name: 'Council Tax',
      created_at: '2026-04-15T11:00:00Z',
      helpful_count: 5,
    },
  ];

  const contacts = [
    {
      category: 'Housing',
      items: [
        { type: 'phone', label: 'Housing repairs', value: '020 7641 6000' },
        { type: 'email', label: 'Housing', value: 'housing@westminster.gov.uk' },
        { type: 'web', label: 'Housing portal', value: 'westminster.gov.uk/housing' },
      ],
    },
    {
      category: 'Planning',
      items: [
        { type: 'phone', label: 'Planning enquiries', value: '020 7641 2510' },
        { type: 'email', label: 'Planning', value: 'planning@westminster.gov.uk' },
        { type: 'web', label: 'Apply online', value: 'westminster.gov.uk/planning' },
      ],
    },
    {
      category: 'Environment',
      items: [
        { type: 'phone', label: 'Waste & recycling', value: '020 7641 2000' },
        { type: 'email', label: 'Environment', value: 'environment@westminster.gov.uk' },
        { type: 'web', label: 'Bin collection', value: 'westminster.gov.uk/bins' },
      ],
    },
  ];

  const totalRatings = council.five_star + council.four_star + council.three_star + council.two_star + council.one_star;

  const getBarWidth = (count: number) => {
    if (!totalRatings) return '0%';
    return `${(count / totalRatings) * 100}%`;
  };

  const filteredReviews = [...reviews].sort((a, b) => {
    if (reviewFilter === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (reviewFilter === 'highest') return b.rating - a.rating;
    if (reviewFilter === 'lowest') return a.rating - b.rating;
    return 0;
  });

  const filteredServices = serviceFilter === 'all'
    ? services
    : services.filter((s) => s.category === serviceFilter);

  const categories = Array.from(new Set(services.map((s) => s.category)));

  const iconMap: Record<string, string> = {
    phone: 'ri-phone-line',
    email: 'ri-mail-line',
    web: 'ri-global-line',
    chat: 'ri-chat-3-line',
    location: 'ri-map-pin-line',
    post: 'ri-mail-send-line',
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <CouncilHero council={council} />

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-[57px] z-40">
        <div className="px-4 lg:px-8">
          <div className="flex gap-1">
            {(['overview', 'services', 'reviews', 'contact'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-[#0B5FFF] text-[#0B5FFF]'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="px-4 py-6 lg:px-8 max-w-4xl mx-auto">
        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Rating distribution */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Rating distribution</h2>
              <div className="space-y-2">
                {[
                  { stars: 5, count: council.five_star },
                  { stars: 4, count: council.four_star },
                  { stars: 3, count: council.three_star },
                  { stars: 2, count: council.two_star },
                  { stars: 1, count: council.one_star },
                ].map((row) => (
                  <div key={row.stars} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12 shrink-0">
                      <span className="text-sm font-medium text-slate-600">{row.stars}</span>
                      <i className="ri-star-fill text-amber-400 text-xs" />
                    </div>
                    <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0B5FFF] rounded-full transition-all"
                        style={{ width: getBarWidth(row.count) }}
                      />
                    </div>
                    <span className="text-sm text-slate-500 w-10 text-right shrink-0">
                      {row.count.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top services */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Top services</h2>
                <button
                  onClick={() => setActiveTab('services')}
                  className="text-sm font-medium text-[#0B5FFF] hover:text-blue-700 transition-colors cursor-pointer"
                >
                  View all &rarr;
                </button>
              </div>
              <div className="space-y-3">
                {[...services]
                  .sort((a, b) => b.rating - a.rating)
                  .slice(0, 4)
                  .map((s) => (
                    <Link
                      key={s.id}
                      href={`/council/${councilId}/service/${s.slug}`}
                      className="flex items-center justify-between py-2 hover:bg-slate-50 rounded-lg px-2 -mx-2 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-700">{s.name}</span>
                        <span className="text-xs text-slate-400">{s.reviews} reviews</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StarRating rating={Math.round(s.rating)} size="sm" />
                        <span className="text-sm font-semibold text-slate-900">{s.rating.toFixed(1)}</span>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>

            {/* Recent reviews */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Recent reviews</h2>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="text-sm font-medium text-[#0B5FFF] hover:text-blue-700 transition-colors cursor-pointer"
                >
                  View all &rarr;
                </button>
              </div>
              <div className="space-y-4">
                {reviews.slice(0, 3).map((r) => (
                  <ReviewCard key={r.id} review={r} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Services */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setServiceFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer whitespace-nowrap ${
                  serviceFilter === 'all'
                    ? 'bg-[#0B5FFF] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setServiceFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer whitespace-nowrap ${
                    serviceFilter === cat
                      ? 'bg-[#0B5FFF] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredServices.map((s) => (
                <Link
                  key={s.id}
                  href={`/council/${councilId}/service/${s.slug}`}
                  className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{s.name}</h3>
                      <span className="text-xs text-slate-400">{s.reviews} reviews</span>
                    </div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {s.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarRating rating={Math.round(s.rating)} size="sm" />
                    <span className="text-base font-bold text-slate-900">{s.rating.toFixed(1)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Sort by</span>
                <div className="flex bg-slate-100 rounded-lg p-0.5">
                  {(['newest', 'highest', 'lowest'] as const).map((sort) => (
                    <button
                      key={sort}
                      onClick={() => setReviewFilter(sort)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer whitespace-nowrap ${
                        reviewFilter === sort
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {sort === 'newest' ? 'Newest' : sort === 'highest' ? 'Highest' : 'Lowest'}
                    </button>
                  ))}
                </div>
              </div>
              <span className="text-sm text-slate-400">{council.review_count.toLocaleString()} reviews</span>
            </div>

            <div className="space-y-4">
              {filteredReviews.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>

            <div className="text-center pt-4">
              <button className="px-6 py-2.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors cursor-pointer whitespace-nowrap">
                Load more reviews
              </button>
            </div>
          </div>
        )}

        {/* Contact */}
        {activeTab === 'contact' && (
          <div className="space-y-4">
            {contacts.map((group) => (
              <div key={group.category} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
                  <h3 className="text-sm font-semibold text-slate-700">{group.category}</h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {group.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                        <i className={`${iconMap[item.type] || 'ri-global-line'} text-slate-500 text-sm`} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">{item.label}</p>
                        {item.type === 'web' ? (
                          <a
                            href={`https://${item.value}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-[#0B5FFF] hover:underline cursor-pointer"
                          >
                            {item.value}
                          </a>
                        ) : item.type === 'email' ? (
                          <a
                            href={`mailto:${item.value}`}
                            className="text-sm font-medium text-slate-900 hover:text-[#0B5FFF] transition-colors cursor-pointer"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <a
                            href={`tel:${item.value.replace(/\s/g, '')}`}
                            className="text-sm font-medium text-slate-900 hover:text-[#0B5FFF] transition-colors cursor-pointer"
                          >
                            {item.value}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}