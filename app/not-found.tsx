'use client';

import Link from 'next/link';
import Header from '../components/lv/Header';
import Footer from '../components/lv/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="flex flex-col items-center justify-center px-4 py-24 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="ri-error-warning-line text-slate-400 text-2xl" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-3">404</h1>
        <p className="text-lg text-slate-500 mb-8">Page not found</p>
        <Link
          href="/"
          className="px-6 py-2.5 bg-[#0B5FFF] text-white font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Go home
        </Link>
      </main>
      <Footer />
    </div>
  );
}
