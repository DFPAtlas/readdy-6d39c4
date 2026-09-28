'use client';

import Link from 'next/link';
import Header from '../../components/lv/Header';
import Footer from '../../components/lv/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main>
        {/* Hero */}
        <section className="bg-slate-900 text-white px-4 py-16 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">About LocalVerdict</h1>
            <p className="text-lg text-slate-300 leading-relaxed">
              We believe local government should be transparent, accountable, and responsive to the people it serves.
              LocalVerdict is an independent platform where residents can share honest reviews of their council&apos;s services.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="px-4 py-14 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: 'ri-shield-check-line',
                  title: 'Verified reviews',
                  desc: 'Every reviewer confirms they live in the area. No fake reviews, no manipulation.',
                },
                {
                  icon: 'ri-community-line',
                  title: 'Community powered',
                  desc: 'Built by residents, for residents. Your voice drives real change in local services.',
                },
                {
                  icon: 'ri-bar-chart-line',
                  title: 'Data you can trust',
                  desc: 'All ratings are publicly visible. Councils cannot hide or suppress feedback.',
                },
              ].map((item) => (
                <div key={item.title} className="text-center">
                  <div className="w-12 h-12 bg-[#0B5FFF]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <i className={`${item.icon} text-[#0B5FFF] text-xl`} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="px-4 py-14 lg:px-8 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-2">How LocalVerdict works</h2>
              <p className="text-slate-500">Simple, transparent, and built for residents</p>
            </div>
            <div className="space-y-8">
              {[
                {
                  step: '01',
                  title: 'Find your council',
                  desc: 'Enter your postcode and we show you every local authority that serves your area — county, district, or unitary.',
                },
                {
                  step: '02',
                  title: 'Rate your experience',
                  desc: 'Give an overall star rating and optionally rate specific services like housing, waste, or education.',
                },
                {
                  step: '03',
                  title: 'Share your story',
                  desc: 'Write a brief review explaining what went well and what could improve. Keep it factual and constructive.',
                },
                {
                  step: '04',
                  title: 'See the bigger picture',
                  desc: 'Browse reviews from other residents, compare council performance, and hold your authority to account.',
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-5">
                  <div className="shrink-0">
                    <div className="w-12 h-12 bg-[#0B5FFF] rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{item.step}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="px-4 py-14 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { value: '382', label: 'UK councils covered' },
                { value: '48,000+', label: 'Verified reviews' },
                { value: '156', label: 'Service categories' },
                { value: '2024', label: 'Founded' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-14 lg:px-8 bg-[#0B5FFF]">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Help us improve local government</h2>
            <p className="text-blue-100 mb-8">
              Your review could be the one that pushes a council to fix a broken service or celebrate what works.
            </p>
            <Link
              href="/councils"
              className="inline-block px-8 py-3.5 bg-white text-[#0B5FFF] font-semibold rounded-xl hover:bg-blue-50 transition-colors whitespace-nowrap cursor-pointer"
            >
              Write a review
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}