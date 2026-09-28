'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import Header from '../../components/lv/Header';
import Footer from '../../components/lv/Footer';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'magic' | 'password'>('magic');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}${next}` },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setMessage('Check your email for the magic link.');
    }
  };

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.push(next);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Sign in</h1>
      <p className="text-sm text-slate-500 mb-6">
        Sign in to write reviews and manage your account.
      </p>

      <div className="flex bg-slate-100 rounded-lg p-0.5 mb-6">
        <button
          onClick={() => { setMode('magic'); setError(''); setMessage(''); }}
          className={`flex-1 py-2 text-xs font-medium rounded-md cursor-pointer whitespace-nowrap ${
            mode === 'magic' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
          }`}
        >
          Magic link
        </button>
        <button
          onClick={() => { setMode('password'); setError(''); setMessage(''); } }
          className={`flex-1 py-2 text-xs font-medium rounded-md cursor-pointer whitespace-nowrap ${
            mode === 'password' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
          }`}
        >
          Password
        </button>
      </div>

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

      <form onSubmit={mode === 'magic' ? handleMagicLink : handlePassword} className="space-y-4">
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

        {mode === 'password' && (
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={mode === 'password'}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#0B5FFF] transition-colors"
              placeholder="••••••••"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-[#0B5FFF] text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors cursor-pointer whitespace-nowrap"
        >
          {loading
            ? 'Please wait...'
            : mode === 'magic'
            ? 'Send magic link'
            : 'Sign in'}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-100 text-center">
        <p className="text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link href={`/signup${next !== '/' ? `?next=${encodeURIComponent(next)}` : ''}`} className="text-[#0B5FFF] font-medium hover:text-blue-700 cursor-pointer">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

function LoginFallback() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-8 animate-pulse">
      <div className="h-8 bg-slate-200 rounded w-32 mb-2" />
      <div className="h-4 bg-slate-200 rounded w-48 mb-6" />
      <div className="h-10 bg-slate-200 rounded mb-4" />
      <div className="h-10 bg-slate-200 rounded mb-4" />
      <div className="h-10 bg-slate-200 rounded" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="px-4 py-12 lg:px-8 max-w-md mx-auto">
        <Suspense fallback={<LoginFallback />}>
          <LoginForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
