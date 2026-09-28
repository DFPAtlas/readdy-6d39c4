'use client';

import Header from '../../../components/lv/Header';
import Footer from '../../../components/lv/Footer';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="px-4 py-8 lg:px-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Cookies</h1>
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 text-sm text-slate-600 leading-relaxed">
          <p><strong>Essential only.</strong> LocalVerdict uses only essential cookies. We do not use analytics, advertising, or third-party tracking cookies.</p>
          <p><strong>What we use.</strong></p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li><strong>lv_session</strong> — Keeps you signed in to your account.</li>
            <li><strong>lv_cookie_consent</strong> — Records your cookie preference so we do not show the banner again.</li>
            <li><strong>csrf_token</strong> — Prevents cross-site request forgery attacks on form submissions.</li>
          </ul>
          <p><strong>Third parties.</strong> We do not share cookie data with third parties. Our cookie banner is our own code; we do not use consent management platforms.</p>
          <p><strong>Managing cookies.</strong> You can block all cookies in your browser settings, but you will not be able to sign in or submit reviews.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}