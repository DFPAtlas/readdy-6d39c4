'use client';

import Header from '../../../components/lv/Header';
import Footer from '../../../components/lv/Footer';

export default function CommunityGuidelinesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="px-4 py-8 lg:px-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Community guidelines</h1>
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 text-sm text-slate-600 leading-relaxed">
          <p><strong>Be honest.</strong> Only review councils and services you have direct experience with. Do not fabricate experiences or post on behalf of others without their permission.</p>
          <p><strong>Be constructive.</strong> Criticism is welcome, but explain what went wrong and how it could improve. Vague rants help nobody.</p>
          <p><strong>No naming individuals.</strong> Do not name specific council officers, staff, or elected members in your reviews. Focus on the service, not the person.</p>
          <p><strong>No abuse.</strong> Profanity, threats, hate speech, and discriminatory language will result in immediate removal and possible account suspension.</p>
          <p><strong>No spam.</strong> Do not post the same review multiple times, use reviews for commercial promotion, or include irrelevant links.</p>
          <p><strong>Be factual.</strong> Avoid speculation about internal council decisions you are not privy to. Stick to what actually happened to you.</p>
          <p><strong>Respect privacy.</strong> Do not include personal information about yourself or others beyond what the review form requests.</p>
          <p><strong>One review per experience.</strong> You may update your review if your experience changes, but do not submit multiple reviews for the same service in quick succession.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}