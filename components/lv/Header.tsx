'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PostcodeSearch from './PostcodeSearch';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/councils', label: 'Councils' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
    { href: '/help', label: 'Help' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="flex items-center justify-between px-4 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-2 shrink-0 cursor-pointer">
          <div className="w-8 h-8 bg-[#0B5FFF] rounded-lg flex items-center justify-center">
            <i className="ri-government-line text-white text-lg" />
          </div>
          <span className="font-['Pacifico'] text-xl text-[#0B5FFF]">LocalVerdict</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-700 hover:text-[#0B5FFF] transition-colors cursor-pointer whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-[#0B5FFF] hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label="Search"
          >
            <i className="ri-search-line text-lg" />
          </button>
          <button
            onClick={() => router.push('/login')}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-[#0B5FFF] hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label="Account"
          >
            <i className="ri-user-line text-lg" />
          </button>
          <button
            onClick={() => router.push('/councils')}
            className="flex items-center gap-2 bg-[#0B5FFF] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
          >
            <i className="ri-edit-line" />
            Write a review
          </button>
        </div>

        <button
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          <i className={`${mobileOpen ? 'ri-close-line' : 'ri-menu-line'} text-xl`} />
        </button>
      </div>

      {searchOpen && (
        <div className="border-t border-slate-100 px-4 py-3 lg:px-8 bg-slate-50">
          <div className="max-w-md">
            <PostcodeSearch variant="compact" />
          </div>
        </div>
      )}

      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-100 px-4 py-4 space-y-1 bg-white">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-sm font-medium text-slate-700 hover:text-[#0B5FFF] cursor-pointer"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 flex gap-3">
            <button
              onClick={() => {
                setMobileOpen(false);
                router.push('/login');
              }}
              className="flex-1 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer whitespace-nowrap"
            >
              Sign in
            </button>
            <button
              onClick={() => {
                setMobileOpen(false);
                router.push('/councils');
              }}
              className="flex-1 py-2.5 bg-[#0B5FFF] text-white rounded-lg text-sm font-semibold hover:bg-blue-700 cursor-pointer whitespace-nowrap"
            >
              Write a review
            </button>
          </div>
        </div>
      )}
    </header>
  );
}