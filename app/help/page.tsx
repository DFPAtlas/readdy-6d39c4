'use client';

import { useState } from 'react';
import Header from '../../components/lv/Header';
import Footer from '../../components/lv/Footer';

const faqs = [
  {
    question: 'How do I find my council?',
    answer: 'Enter your postcode on the homepage or use the search box at the top of any page. We will show you every council that serves your area.',
  },
  {
    question: 'Who can leave a review?',
    answer: 'Anyone who lives in, works in, or has used services from the council they are reviewing. You do not need an account, but verified residents get a badge on their review.',
  },
  {
    question: 'How are reviews verified?',
    answer: 'We use postcode matching to confirm a reviewer lives in the relevant area. Verified residents see a green badge. Unverified reviews are still published but marked accordingly.',
  },
  {
    question: 'Can I edit or delete my review?',
    answer: 'Yes. If you signed in when submitting, you can edit or delete from your account page. Anonymous reviews cannot be edited after submission.',
  },
  {
    question: 'What services can I review?',
    answer: 'Any council service: housing, planning, waste, adult social care, education, highways, parking, council tax, licensing, environmental health, and more.',
  },
  {
    question: 'Will the council see my review?',
    answer: 'All reviews are publicly visible, including to council staff. We never share your email address or full postcode. Only your display name and district are shown.',
  },
  {
    question: 'What if I have a formal complaint?',
    answer: 'For unresolved complaints, contact the Local Government and Social Care Ombudsman at lgo.org.uk. LocalVerdict is for public feedback, not formal complaints handling.',
  },
  {
    question: 'How are overall ratings calculated?',
    answer: 'The overall rating is a simple average of all star ratings submitted for that council. Each review counts equally, regardless of verification status.',
  },
  {
    question: 'Is LocalVerdict independent?',
    answer: 'Yes. We are not owned by or affiliated with any council, political party, or government body. We are funded by research partnerships and do not take money from councils to alter ratings.',
  },
  {
    question: 'How do I report an abusive review?',
    answer: 'Click the flag icon on any review. Our moderation team reviews reports within 24 hours. Reviews naming individual officers or containing profanity are automatically flagged.',
  },
];

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="px-4 py-8 lg:px-8 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">Help centre</h1>
          <p className="text-slate-500">Answers to common questions about LocalVerdict</p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search help topics..."
              className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#0B5FFF] transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          {filtered.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span className="text-sm font-medium text-slate-800 pr-4">{faq.question}</span>
                <i
                  className={`ri-arrow-down-s-line text-slate-400 shrink-0 transition-transform ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === i && (
                <div className="px-5 pb-4">
                  <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="ri-search-line text-slate-400 text-lg" />
            </div>
            <p className="text-sm text-slate-500">No results for &ldquo;{searchTerm}&rdquo;</p>
          </div>
        )}

        <div className="mt-10 bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-base font-bold text-slate-900 mb-2">Still need help?</h3>
          <p className="text-sm text-slate-500 mb-4">
            Can&apos;t find what you are looking for? Email us and we will get back to you within 24 hours.
          </p>
          <a
            href="mailto:hello@localverdict.co.uk"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#0B5FFF] hover:text-blue-700 transition-colors cursor-pointer"
          >
            <i className="ri-mail-line" />
            hello@localverdict.co.uk
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}