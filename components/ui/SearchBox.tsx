'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBoxProps {
  placeholder?: string;
  searchPath?: string;
  paramName?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const POSTCODE_REGEX = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

export default function SearchBox({
  placeholder = 'Enter your postcode...',
  searchPath = '/search',
  paramName = 'postcode',
  size = 'md',
  className = '',
}: SearchBoxProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const sizeClasses: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-4 text-lg',
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      const trimmed = value.trim();
      if (!trimmed) {
        setError('Please enter a postcode');
        return;
      }
      if (!POSTCODE_REGEX.test(trimmed)) {
        setError('Please enter a valid UK postcode');
        return;
      }

      setLoading(true);
      try {
        router.push(`${searchPath}?${paramName}=${encodeURIComponent(trimmed.toUpperCase().replace(/\s/g, ''))}`);
      } catch {
        setError('Something went wrong. Please try again.');
        setLoading(false);
      }
    },
    [value, router, searchPath, paramName]
  );

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError('');
            }}
            placeholder={placeholder}
            maxLength={10}
            className={`w-full pl-9 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0B5FFF] transition-colors ${sizeClasses[size]}`}
            aria-label={placeholder}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`bg-[#0B5FFF] text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors cursor-pointer whitespace-nowrap ${sizeClasses[size]}`}
        >
          {loading ? '...' : 'Search'}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-red-600 font-medium">{error}</p>}
    </form>
  );
}