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
    { href: '/councils', label: 'Councils' },
    { href: '/council/hertfordshire', label: 'Data' },
    { href: '/about', label: 'About' },
    { href: '/help', label: 'Help' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="flex items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-3 shrink-0 cursor-pointer">
          <div className="w-9 h-9 bg-[#0B5FFF] rounded-xl flex items-center justify-center shadow-sm">
            <i className="ri-government-line text-white text-xl" />
          </div>
          <div className="leading-tight">
            <div className="font-bold text-slate-900 text-sm lg:text-base">Rate Your Local Council</div>
            <div className="hidden sm:block text-[10px] text-slate-500">Real people. Clear public data.</div>
          </div>
        </Link>

        <div className="hidden xl:block flex-1 max-w-md mx-4">
          <PostcodeSearch variant="compact" />
        </div>

        <nav className="hidden lg:flex items-center gap-5">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-slate-700 hover:text-[#0B5FFF] transition-colors whitespace-nowrap">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <button onClick={() => setSearchOpen(!searchOpen)} className="xl:hidden w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-[#0B5FFF] hover:bg-slate-50" aria-label="Search">
            <i className="ri-search-line text-lg" />
          </button>
          <button onClick={() => router.push('/login')} className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-[#0B5FFF] hover:bg-slate-50" aria-label="Account">
            <i className="ri-user-line text-lg" />
          </button>
          <button onClick={() => router.push('/councils')} className="bg-[#0B5FFF] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 whitespace-nowrap">
            Write a review
          </button>
        </div>

        <button className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-50" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? 'Close menu' : 'Open menu'}>
          <i className={`${mobileOpen ? 'ri-close-line' : 'ri-menu-line'} text-xl`} />
        </button>
      </div>

      {searchOpen && <div className="border-t border-slate-100 px-4 py-3 lg:px-8 bg-slate-50"><div className="max-w-md"><PostcodeSearch variant="compact" /></div></div>}

      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-100 px-4 py-4 space-y-1 bg-white">
          <div className="mb-3"><PostcodeSearch variant="compact" /></div>
          {navItems.map((item) => <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="block py-2.5 text-sm font-medium text-slate-700 hover:text-[#0B5FFF]">{item.label}</Link>)}
          <div className="pt-3 border-t border-slate-100 flex gap-3">
            <button onClick={() => router.push('/login')} className="flex-1 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700">Sign in</button>
            <button onClick={() => router.push('/councils')} className="flex-1 py-2.5 bg-[#0B5FFF] text-white rounded-lg text-sm font-semibold">Write a review</button>
          </div>
        </div>
      )}
    </header>
  );
}
