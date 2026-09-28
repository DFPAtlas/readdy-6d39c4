'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import Header from '../../components/lv/Header';
import Footer from '../../components/lv/Footer';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [postcode, setPostcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName, postcode },
        emailRedirectTo: `${window.location.origin}${next}`,
      },
    });

    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
    } else {
      setMessage('Account created. Please check your email to verify before you can post reviews.');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Create an account</h1>
      <p className="text-sm text-slate-500 mb-6">
        Sign up to write reviews and manage your account.
      </p>

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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#0B5FFF] transition-colors"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-slate-700 mb-1">
            Display name
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            minLength={2}
            maxLength={40}
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#0B5FFF] transition-colors"
            placeholder="How you appear on reviews"
          />
        </div>

        <div>
          <label htmlFor="postcode" className="block text-sm font-medium text-slate-700 mb-1">
            Postcode
          </label>
          <input
            id="postcode"
            type="text"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            required
            maxLength={10}
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#0B5FFF] transition-colors"
            placeholder="e.g. SW1A 1AA"
          />
          <p className="text-xs text-slate-400 mt-1">Used to verify your local council.</p>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#0B5FFF] transition-colors"
            placeholder="At least 8 characters"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-[#0B5FFF] text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors cursor-pointer whitespace-nowrap"
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-100 text-center">
        <p className="text-sm text-slate-500">
          Already have an account?{' '}
          <Link href={`/login${next !== '/' ? `?next=${encodeURIComponent(next)}` : ''}`} className="text-[#0B5FFF] font-medium hover:text-blue-700 cursor-pointer">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

function SignupFallback() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-8 animate-pulse">
      <div className="h-8 bg-slate-200 rounded w-40 mb-2" />
      <div className="h-4 bg-slate-200 rounded w-56 mb-6" />
      <div className="h-10 bg-slate-200 rounded mb-4" />
      <div className="h-10 bg-slate-200 rounded mb-4" />
      <div className="h-10 bg-slate-200 rounded mb-4" />
      <div className="h-10 bg-slate-200 rounded" />
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="px-4 py-12 lg:px-8 max-w-md mx-auto">
        <Suspense fallback={<SignupFallback />}>
          <SignupForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}