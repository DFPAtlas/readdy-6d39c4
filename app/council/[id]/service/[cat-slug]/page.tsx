'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '../../../../components/lv/Header';
import Footer from '../../../../components/lv/Footer';
import StarRating from '../../../../components/lv/StarRating';
import ReviewCard from '../../../../components/lv/ReviewCard';

export async function generateStaticParams() {
  return [
    { id: 'westminster', 'cat-slug': 'waste' },
    { id: 'westminster', 'cat-slug': 'parking' },
    { id: 'westminster', 'cat-slug': 'planning' },
    { id: 'westminster', 'cat-slug': 'housing' },
    { id: 'kent', 'cat-slug': 'highways' },
    { id: 'kent', 'cat-slug': 'education' },
    { id: 'manchester', 'cat-slug': 'benefits' },
    { id: 'surrey', 'cat-slug': 'waste' },
    { id: 'birmingham', 'cat-slug': 'housing' },
    { id: 'essex', 'cat-slug': 'education' },
  ];
}

export default function ServiceDetailPage() {
  const params = useParams();
  const councilId = params.id as string;
  const catSlug = params['cat-slug'] as string;
  const [reviewFilter, setReviewFilter] = useState<'newest' | 'highest' | 'lowest'>('newest');

  const service = {
    name: catSlug === 'waste' ? 'Waste & Recycling' : catSlug === 'parking' ? 'Parking' : 'Planning',
    slug: catSlug,
    category: catSlug === 'waste' ? 'Environment' : catSlug === 'parking' ? 'Transport' : 'Housing',
    rating: 4.2,
    reviews: 267,
    description:
      catSlug === 'waste'
        ? 'Rubbish collection, recycling, garden waste, bulky item collection, and street cleaning services.'
        : catSlug === 'parking'
        ? 'Parking permits, pay-and-display, resident parking schemes, enforcement, and appeals.'
        : 'Planning applications, building control, permitted development, and enforcement.',
  };

  const contacts = [
    { type: 'phone', label: 'Main line', value: '020 7641 2000' },
    { type: 'email', label: 'Email', value: `${catSlug}@westminster.gov.uk` },
    { type: 'web', label: 'Online', value: `westminster.gov.uk/${catSlug}` },
  ];

  const reviews = [
    {
      id: '1',
      display_name: 'Margaret H.',
      is_resident: true,
      district: 'Westminster',
      rating: 5,
      title: 'Brilliant new recycling scheme',
      body: 'The new separate food waste collection has made composting so much easier. Collection is always on time.',
      service_name: service.name,
      created_at: '2026-04-28T10:30:00Z',
      helpful_count: 14,
    },
    {
      id: '2',
      display_name: 'James T.',
      is_resident: true,
      district: 'Marylebone',
      rating: 3,
      title: 'Missed collection twice this month',
      body: 'Twice the bin lorry failed to collect our recycling. Had to wait another week. Phone line was constantly engaged.',
      service_name: service.name,
      created_at: '2026-04-25T14:20:00Z',
      helpful_count: 9,
    },
    {
      id: '3',
      display_name: 'Sarah K.',
      is_resident: true,
      district: 'Westminster',
      rating: 4,
      title: 'Garden waste service worth the fee',
      body: 'Pay £65 a year for the garden waste bin and it gets collected fortnightly without fail. Good value.',
      service_name: service.name,
      created_at: '2026-04-20T09:15:00Z',
      helpful_count: 11,
    },
  ];

  const filteredReviews = [...reviews].sort((a, b) => {
    if (reviewFilter === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (reviewFilter === 'highest') return b.rating - a.rating;
    if (reviewFilter === 'lowest') return a.rating - b.rating;
    return 0;
  });

  const iconMap: Record<string, string> = {
    phone: 'ri-phone-line',
    email: 'ri-mail-line',
    web: 'ri-global-line',
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="px-4 py-6 lg:px-8 max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/councils" className="hover:text-[#0B5FFF] cursor-pointer">
            Councils
          </Link>
          <i className="ri-arrow-right-s-line text-slate-300" />
          <Link href={`/council/${councilId}`} className="hover:text-[#0B5FFF] cursor-pointer">
            Westminster
          </Link>
          <i className="ri-arrow-right-s-line text-slate-300" />
          <span className="text-slate-700">{service.name}</span>
        </nav>

        {/* Service header */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {service.category}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">{service.name}</h1>
              <p className="text-sm text-slate-500">{service.description}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-3xl font-bold text-slate-900">{service.rating.toFixed(1)}</div>
              <StarRating rating={Math.round(service.rating)} />
              <div className="text-sm text-slate-400 mt-1">{service.reviews} reviews</div>
            </div>
          </div>
        </div>

        {/* Contacts */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Contact this service</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {contacts.map((c, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                  <i className={`${iconMap[c.type]} text-slate-500`} />
                </div>
                <div>
                  <p className="text-xs text-slate-400">{c.label}</p>
                  {c.type === 'web' ? (
                    <a
                      href={`https://${c.value}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-[#0B5FFF] hover:underline cursor-pointer"
                    >
                      {c.value}
                    </a>
                  ) : c.type === 'email' ? (
                    <a
                      href={`mailto:${c.value}`}
                      className="text-sm font-medium text-slate-900 hover:text-[#0B5FFF] transition-colors cursor-pointer"
                    >
                      {c.value}
                    </a>
                  ) : (
                    <a
                      href={`tel:${c.value.replace(/\s/g, '')}`}
                      className="text-sm font-medium text-slate-900 hover:text-[#0B5FFF] transition-colors cursor-pointer"
                    >
                      {c.value}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Reviews</h2>
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
      </main>

      <Footer />
    </div>
  );
}