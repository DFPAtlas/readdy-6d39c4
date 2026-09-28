export async function generateStaticParams() {
  return [
    { id: 'westminster' },
    { id: 'kent' },
    { id: 'manchester' },
    { id: 'surrey' },
    { id: 'birmingham' },
    { id: 'essex' },
  ];
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import Header from '../../../components/lv/Header';
import Footer from '../../../components/lv/Footer';
import StarRating from '../../../components/lv/StarRating';

const serviceCategories = [
  { slug: 'adult-social-care', name: 'Adult Social Care' },
  { slug: 'education', name: 'Education & Schools' },
  { slug: 'housing', name: 'Housing' },
  { slug: 'planning', name: 'Planning' },
  { slug: 'waste', name: 'Waste & Recycling' },
  { slug: 'parking', name: 'Parking' },
  { slug: 'highways', name: 'Highways & Roads' },
  { slug: 'council-tax', name: 'Council Tax' },
];

export default function WriteReviewPage() {
  const params = useParams();
  const router = useRouter();
  const councilId = params.id as string;

  const [overallRating, setOverallRating] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isResident, setIsResident] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [serviceRatings, setServiceRatings] = useState<Record<string, { rating: number; comment: string }>>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push(`/login?next=/council/${councilId}/review`);
        return;
      }
      setAuthChecked(true);
    };
    checkAuth();
  }, [councilId, router]);

  const handleServiceRating = (slug: string, rating: number) => {
    setServiceRatings((prev) => ({
      ...prev,
      [slug]: { ...(prev[slug] || {}), rating },
    }));
  };

  const handleServiceComment = (slug: string, comment: string) => {
    setServiceRatings((prev) => ({
      ...prev,
      [slug]: { ...(prev[slug] || {}), comment },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (overallRating === 0) {
      setError('Please give an overall star rating.');
      return;
    }
    if (title.length < 5 || title.length > 120) {
      setError('Title must be between 5 and 120 characters.');
      return;
    }
    if (body.length < 20 || body.length > 2000) {
      setError('Review body must be between 20 and 2,000 characters.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          council_id: councilId,
          overall_rating: overallRating,
          title,
          body,
          is_resident: isResident,
          service_ratings: Object.entries(serviceRatings)
            .filter(([, v]) => v.rating > 0)
            .map(([slug, v]) => ({ service_slug: slug, rating: v.rating, comment: v.comment })),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Something went wrong. Please try again.');
        setLoading(false);
        return;
      }

      setMessage('Your review has been submitted and is pending checks. Thank you!');
      setTimeout(() => {
        router.push(`/council/${councilId}`);
      }, 2000);
    } catch {
      setError('Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="px-4 py-12 lg:px-8 max-w-2xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-48" />
            <div className="h-64 bg-slate-200 rounded" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="px-4 py-8 lg:px-8 max-w-2xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/councils" className="hover:text-[#0B5FFF] cursor-pointer">Councils</Link>
          <i className="ri-arrow-right-s-line text-slate-300" />
          <Link href={`/council/${councilId}`} className="hover:text-[#0B5FFF] cursor-pointer">{councilId}</Link>
          <i className="ri-arrow-right-s-line text-slate-300" />
          <span className="text-slate-700">Write a review</span>
        </nav>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">Write a review</h1>
        <p className="text-sm text-slate-500 mb-6">Share your experience with this council. Be honest and constructive.</p>

        {message && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Overall rating */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <label className="block text-sm font-semibold text-slate-800 mb-3">
              Overall rating <span className="text-[#E11D48]">*</span>
            </label>
            <div className="flex items-center gap-3">
              <StarRating rating={overallRating} size="lg" interactive onChange={setOverallRating} />
              <span className="text-sm text-slate-500">
                {overallRating > 0 ? `${overallRating} star${overallRating > 1 ? 's' : ''}` : 'Tap a star'}
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Review title <span className="text-[#E11D48]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={5}
              maxLength={120}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#0B5FFF] transition-colors"
              placeholder="e.g. Excellent recycling service, but slow planning"
            />
            <div className="mt-1 text-xs text-slate-400 text-right">{title.length}/120</div>
          </div>

          {/* Body */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Your review <span className="text-[#E11D48]">*</span>
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              minLength={20}
              maxLength={2000}
              rows={6}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#0B5FFF] transition-colors resize-none"
              placeholder="Describe your experience. What went well? What could improve? Be specific and constructive."
            />
            <div className="mt-1 text-xs text-slate-400 text-right">{body.length}/2,000</div>
          </div>

          {/* Resident checkbox */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isResident}
                onChange={(e) => setIsResident(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-[#0B5FFF] border-slate-300 rounded focus:ring-[#0B5FFF]"
              />
              <div>
                <span className="text-sm font-medium text-slate-800">I am a verified resident</span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Checking this will show a verified badge on your review. We may confirm this against your account postcode.
                </p>
              </div>
            </label>
          </div>

          {/* Service ratings toggle */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <button
              type="button"
              onClick={() => setShowServices(!showServices)}
              className="flex items-center justify-between w-full cursor-pointer"
            >
              <span className="text-sm font-semibold text-slate-800">Rate specific services</span>
              <i className={`ri-arrow-down-s-line text-slate-400 transition-transform ${showServices ? 'rotate-180' : ''}`} />
            </button>

            {showServices && (
              <div className="mt-4 space-y-4">
                <p className="text-xs text-slate-500">Rate up to 8 services. Comments are optional (max 500 chars).</p>
                {serviceCategories.map((cat) => (
                  <div key={cat.slug} className="border border-slate-100 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">{cat.name}</span>
                      <div className="flex items-center gap-2">
                        <StarRating
                          rating={serviceRatings[cat.slug]?.rating || 0}
                          size="sm"
                          interactive
                          onChange={(r) => handleServiceRating(cat.slug, r)}
                        />
                        <span className="text-xs text-slate-400 w-12 text-right">
                          {serviceRatings[cat.slug]?.rating > 0 ? `${serviceRatings[cat.slug]?.rating}★` : '—'}
                        </span>
                      </div>
                    </div>
                    <textarea
                      value={serviceRatings[cat.slug]?.comment || ''}
                      onChange={(e) => handleServiceComment(cat.slug, e.target.value)}
                      maxLength={500}
                      rows={2}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-[#0B5FFF] transition-colors resize-none"
                      placeholder={`Optional comment about ${cat.name.toLowerCase()}...`}
                    />
                    <div className="text-xs text-slate-400 text-right mt-0.5">
                      {(serviceRatings[cat.slug]?.comment || '').length}/500
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0B5FFF] text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-colors cursor-pointer whitespace-nowrap"
          >
            {loading ? 'Submitting...' : 'Submit review'}
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}