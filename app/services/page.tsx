'use client';

import Link from 'next/link';
import { useState } from 'react';
import Header from '../../components/lv/Header';
import Footer from '../../components/lv/Footer';
import StarRating from '../../components/lv/StarRating';

const services = [
  { slug: 'adult-social-care', name: 'Adult Social Care', category: 'Social care', avgRating: 3.9, reviews: 2847, councils: 85 },
  { slug: 'education', name: 'Education & Schools', category: 'Education', avgRating: 4.1, reviews: 1987, councils: 67 },
  { slug: 'housing', name: 'Housing', category: 'Housing', avgRating: 3.7, reviews: 3124, councils: 92 },
  { slug: 'planning', name: 'Planning Applications', category: 'Housing', avgRating: 3.8, reviews: 2456, councils: 78 },
  { slug: 'highways', name: 'Highways & Roads', category: 'Transport', avgRating: 3.6, reviews: 3567, councils: 88 },
  { slug: 'waste', name: 'Waste & Recycling', category: 'Environment', avgRating: 4.2, reviews: 2892, councils: 94 },
  { slug: 'parking', name: 'Parking', category: 'Transport', avgRating: 3.5, reviews: 4123, councils: 76 },
  { slug: 'council-tax', name: 'Council Tax', category: 'Finance', avgRating: 3.9, reviews: 2654, councils: 89 },
  { slug: 'environmental', name: 'Environmental Health', category: 'Environment', avgRating: 4.0, reviews: 1789, councils: 71 },
  { slug: 'licensing', name: 'Licensing', category: 'Business', avgRating: 3.8, reviews: 1456, councils: 83 },
  { slug: 'benefits', name: 'Benefits & Support', category: 'Finance', avgRating: 3.7, reviews: 2987, councils: 91 },
  { slug: 'library', name: 'Libraries', category: 'Community', avgRating: 4.4, reviews: 1623, councils: 79 },
  { slug: 'children', name: "Children's Services", category: 'Social care', avgRating: 3.9, reviews: 1845, councils: 82 },
  { slug: 'fire', name: 'Fire & Rescue', category: 'Emergency', avgRating: 4.6, reviews: 1234, councils: 45 },
];

const categories = Array.from(new Set(services.map((s) => s.category)));

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = services.filter((s) => {
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="px-4 py-8 lg:px-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">Council services</h1>
          <p className="text-slate-500">Compare how councils perform across every service area</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search services..."
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#0B5FFF] transition-colors"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-2 rounded-lg text-xs font-medium cursor-pointer whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-[#0B5FFF] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-[#0B5FFF] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <Link
              key={s.slug}
              href={`/councils`}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{s.name}</h3>
                  <span className="text-xs text-slate-400">{s.councils} councils</span>
                </div>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {s.category}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <StarRating rating={Math.round(s.avgRating)} size="sm" />
                <span className="text-sm font-semibold text-slate-900">{s.avgRating.toFixed(1)}</span>
                <span className="text-sm text-slate-400">{s.reviews.toLocaleString()} reviews</span>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-search-line text-slate-400 text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No services found</h3>
            <p className="text-slate-500">Try adjusting your search or filters</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}