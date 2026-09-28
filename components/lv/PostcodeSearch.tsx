'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const POSTCODE_REGEX = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

interface PostcodeSearchProps {
  variant?: 'hero' | 'compact';
}

export default function PostcodeSearch({ variant = 'hero' }: PostcodeSearchProps) {
  const [postcode, setPostcode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const normalisePostcode = (raw: string) => {
    return raw.trim().toUpperCase().replace(/\s/g, '');
  };

  const validate = (value: string) => {
    return POSTCODE_REGEX.test(value.trim());
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      const trimmed = postcode.trim();
      if (!trimmed) {
        setError('Please enter a postcode');
        return;
      }

      if (!validate(trimmed)) {
        setError('Please enter a valid UK postcode, e.g. SW1A 1AA');
        return;
      }

      setIsLoading(true);
      const normalised = normalisePostcode(trimmed);

      try {
        router.push(`/search?postcode=${encodeURIComponent(normalised)}`);
      } catch {
        setError('Something went wrong. Please try again.');
        setIsLoading(false);
      }
    },
    [postcode, router]
  );

  if (variant === 'hero') {
    return (
      <form onSubmit={handleSubmit} className="w-full max-w-xl">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={postcode}
              onChange={(e) => {
                setPostcode(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. SW1A 1AA"
              maxLength={10}
              className="w-full px-5 py-4 text-lg rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0B5FFF] transition-colors"
              aria-label="Enter your postcode"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-4 bg-[#0B5FFF] text-white text-lg font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-colors whitespace-nowrap cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Finding...
              </span>
            ) : (
              'Find your council'
            )}
          </button>
        </div>
        {error && (
          <p className="mt-3 text-sm text-[#E11D48] font-medium">{error}</p>
        )}
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2">
        <input
          type="text"
          value={postcode}
          onChange={(e) => {
            setPostcode(e.target.value);
            if (error) setError('');
          }}
          placeholder="Postcode"
          maxLength={10}
          className="flex-1 px-4 py-2.5 text-sm rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0B5FFF] transition-colors"
          aria-label="Enter your postcode"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2.5 bg-[#0B5FFF] text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors whitespace-nowrap cursor-pointer"
        >
          {isLoading ? '...' : 'Search'}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-[#E11D48] font-medium">{error}</p>}
    </form>
  );
}