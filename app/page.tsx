'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Header from '../components/lv/Header';
import Footer from '../components/lv/Footer';
import PostcodeSearch from '../components/lv/PostcodeSearch';
import StarRating from '../components/lv/StarRating';

const councils = [
  {
    slug: 'westminster',
    name: 'Westminster City Council',
    type: 'City Council',
    region: 'London',
    rating: 4.2,
    reviews: 1247,
  },
  {
    slug: 'kent',
    name: 'Kent County Council',
    type: 'County Council',
    region: 'South East',
    rating: 3.8,
    reviews: 892,
  },
  {
    slug: 'manchester',
    name: 'Manchester City Council',
    type: 'City Council',
    region: 'North West',
    rating: 4.1,
    reviews: 1056,
  },
  {
    slug: 'surrey',
    name: 'Surrey County Council',
    type: 'County Council',
    region: 'South East',
    rating: 4.0,
    reviews: 734,
  },
  {
    slug: 'birmingham',
    name: 'Birmingham City Council',
    type: 'City Council',
    region: 'West Midlands',
    rating: 3.9,
    reviews: 1543,
  },
  {
    slug: 'essex',
    name: 'Essex County Council',
    type: 'County Council',
    region: 'East of England',
    rating: 3.7,
    reviews: 623,
  },
];

function AnimatedCounter({
  target,
  suffix = '',
  duration = 2000,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {/* Hero */}
      <section className="relative bg-slate-900 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url('https://readdy.ai/api/search-image?query=Aerial%20view%20of%20a%20typical%20British%20town%20with%20council%20buildings%2C%20parks%2C%20and%20residential%20streets%20on%20an%20overcast%20day%2C%20muted%20colours%2C%20soft%20natural%20light%2C%20civic%20architecture%20mixed%20with%20greenery%2C%20photorealistic%2C%20wide%20landscape%20composition&width=1920&height=700&seq=lvhero1&orientation=landscape')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-900/70" />
        <div className="relative px-4 py-20 lg:py-28 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              How&apos;s your council really doing?
            </h1>
            <p className="text-lg lg:text-xl text-slate-300 mb-10 max-w-xl">
              Read verified reviews from residents. Share your own experience. Hold local authorities to account.
            </p>
            <PostcodeSearch />
          </div>
        </div>
      </section>

      {/* Live Counter */}
      <section className="bg-white border-b border-slate-200">
        <div className="px-4 py-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-slate-900">
                <AnimatedCounter target={48213} />
              </div>
              <div className="text-sm text-slate-500">reviews submitted</div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-slate-200" />
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-slate-900">
                <AnimatedCounter target={382} />
              </div>
              <div className="text-sm text-slate-500">councils covered</div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-slate-200" />
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-slate-900">
                <AnimatedCounter target={156} suffix="+" />
              </div>
              <div className="text-sm text-slate-500">service categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Councils */}
      <section className="px-4 py-14 lg:px-8 bg-white">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900">Featured councils</h2>
          <Link
            href="/councils"
            className="text-sm font-medium text-[#0B5FFF] hover:text-blue-700 transition-colors cursor-pointer"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {councils.map((c) => (
            <Link
              key={c.slug}
              href={`/council/${c.slug}`}
              className="group block bg-slate-50 rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-xs font-medium text-slate-500">{c.region}</span>
                  <h3 className="text-base font-semibold text-slate-900 mt-0.5 group-hover:text-[#0B5FFF] transition-colors">
                    {c.name}
                  </h3>
                </div>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
                  {c.type}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <StarRating rating={Math.round(c.rating)} size="sm" />
                <span className="text-sm font-semibold text-slate-900">{c.rating.toFixed(1)}</span>
                <span className="text-sm text-slate-400">{c.reviews.toLocaleString()} reviews</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-14 lg:px-8 bg-slate-50">
        <div className="text-center mb-10">
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-2">How it works</h2>
          <p className="text-slate-500">Three simple steps to make your voice heard</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '1',
              title: 'Find',
              desc: 'Enter your postcode to discover which councils serve your area.',
              icon: 'ri-search-line',
            },
            {
              step: '2',
              title: 'Rate',
              desc: 'Share your honest experience with council services you have used.',
              icon: 'ri-star-line',
            },
            {
              step: '3',
              title: 'Read',
              desc: 'Browse thousands of verified reviews to see how your council compares.',
              icon: 'ri-article-line',
            },
          ].map((item) => (
            <div key={item.step} className="bg-white rounded-xl border border-slate-200 p-6 text-center">
              <div className="w-12 h-12 bg-[#0B5FFF]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className={`${item.icon} text-[#0B5FFF] text-xl`} />
              </div>
              <div className="text-xs font-bold text-[#0B5FFF] mb-2 uppercase tracking-wider">
                Step {item.step}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-14 lg:px-8 bg-[#0B5FFF]">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            Ready to share your experience?
          </h2>
          <p className="text-blue-100 mb-8">
            Your review helps other residents make informed decisions and holds councils accountable for the services they deliver.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/councils"
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-[#0B5FFF] font-semibold rounded-xl hover:bg-blue-50 transition-colors whitespace-nowrap text-center cursor-pointer"
            >
              Write a review
            </Link>
            <Link
              href="/councils"
              className="w-full sm:w-auto px-8 py-3.5 border border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-colors whitespace-nowrap text-center cursor-pointer"
            >
              Browse all councils
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}