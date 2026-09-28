'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import Header from '../../components/lv/Header';
import Footer from '../../components/lv/Footer';
import StarRating from '../../components/lv/StarRating';

interface Review {
  id: string;
  council_name: string;
  service_name: string;
  rating: number;
  title: string;
  body: string;
  status: 'pending_auto_check' | 'pending_manual_review' | 'live' | 'removed';
  created_at: string;
}

function AccountContent() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [displayName, setDisplayName] = useState('');
  const [postcode, setPostcode] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login?next=/account');
        return;
      }
      setUser(session.user);
      setDisplayName(session.user.user_metadata?.display_name || '');
      setPostcode(session.user.user_metadata?.postcode || '');

      // Load mock reviews
      setReviews([
        {
          id: '1',
          council_name: 'Westminster City Council',
          service_name: 'Waste & Recycling',
          rating: 5,
          title: 'Brilliant new recycling scheme',
          body: 'The new separate food waste collection has made composting so much easier.',
          status: 'live',
          created_at: '2026-04-28T10:30:00Z',
        },
        {
          id: '2',
          council_name: 'Westminster City Council',
          service_name: 'Planning',
          rating: 2,
          title: 'Planning application took forever',
          body: 'Submitted a loft conversion in January and only got approval in April.',
          status: 'live',
          created_at: '2026-04-25T14:20:00Z',
        },
        {
          id: '3',
          council_name: 'Camden Council',
          service_name: 'Housing',
          rating: 4,
          title: 'Repair handled quickly',
          body: 'Reported a leaky roof on Monday and it was fixed by Wednesday.',
          status: 'pending_manual_review',
          created_at: '2026-04-20T09:15:00Z',
        },
      ]);

      setLoading(false);
    };
    checkAuth();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    const { error: updateError } = await supabase.auth.updateUser({
      data: { display_name: displayName, postcode },
    });

    setSaving(false);
    if (updateError) {
      setError(updateError.message);
    } else {
      setMessage('Profile updated.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('This will permanently delete your account and all reviews. Are you sure?')) return;
    await supabase.auth.signOut();
    router.push('/');
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Live</span>;
      case 'pending_auto_check':
        return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">Checking</span>;
      case 'pending_manual_review':
        return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-50 text-orange-700">In review</span>;
      case 'removed':
        return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-700">Removed</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="px-4 py-12 lg:px-8 max-w-3xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-48" />
            <div className="h-32 bg-slate-200 rounded" />
            <div className="h-32 bg-slate-200 rounded" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="px-4 py-8 lg:px-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Your account</h1>

        {/* Profile */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Profile</h2>

          {message && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 text-slate-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Display name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                minLength={2}
                maxLength={40}
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#0B5FFF] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Postcode</label>
              <input
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                maxLength={10}
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#0B5FFF] transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-[#0B5FFF] text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors cursor-pointer whitespace-nowrap"
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Your reviews</h2>
          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-slate-500 mb-4">You haven&apos;t submitted any reviews yet.</p>
              <Link
                href="/councils"
                className="inline-block px-5 py-2.5 bg-[#0B5FFF] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Write your first review
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="border border-slate-100 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{r.council_name}</p>
                      <p className="text-xs text-slate-400">{r.service_name}</p>
                    </div>
                    {statusBadge(r.status)}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <StarRating rating={r.rating} size="sm" />
                    <span className="text-sm font-semibold text-slate-900">{r.title}</span>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2">{r.body}</p>
                  <p className="text-xs text-slate-400 mt-2" suppressHydrationWarning={true}>
                    {new Date(r.created_at).toLocaleDateString('en-GB')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-xl border border-red-200 p-6">
          <h2 className="text-lg font-bold text-red-700 mb-4">Delete account</h2>
          <p className="text-sm text-slate-500 mb-4">
            This will permanently delete your account and all associated reviews. This action cannot be undone.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="px-5 py-2.5 border border-red-300 text-red-700 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors cursor-pointer whitespace-nowrap"
          >
            Delete my account
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="px-4 py-12 lg:px-8 max-w-3xl mx-auto animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-48 mb-6" />
          <div className="h-32 bg-slate-200 rounded mb-4" />
          <div className="h-32 bg-slate-200 rounded" />
        </main>
        <Footer />
      </div>
    }>
      <AccountContent />
    </Suspense>
  );
}