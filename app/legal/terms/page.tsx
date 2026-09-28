'use client';

import Header from '../../../components/lv/Header';
import Footer from '../../../components/lv/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="px-4 py-8 lg:px-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Terms of use</h1>
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 text-sm text-slate-600 leading-relaxed">
          <p><strong>1. Acceptance of terms.</strong> By using LocalVerdict you agree to these terms. If you do not agree, please do not use the platform.</p>
          <p><strong>2. Eligibility.</strong> You must be at least 16 years old to submit reviews. Reviews must be based on genuine personal experience with the council in question.</p>
          <p><strong>3. Acceptable content.</strong> Reviews must be honest, factual, and constructive. You must not name individual council officers, use profanity, post threats, or include discriminatory language. Reviews in ALL CAPS or containing obvious spam may be removed.</p>
          <p><strong>4. Account responsibility.</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.</p>
          <p><strong>5. Intellectual property.</strong> You retain ownership of content you submit but grant LocalVerdict a perpetual licence to publish, display, and analyse it.</p>
          <p><strong>6. Termination.</strong> We may suspend or terminate accounts that repeatedly violate these terms or our community guidelines.</p>
          <p><strong>7. Disclaimer.</strong> LocalVerdict is an independent platform and is not affiliated with any local authority. Ratings reflect resident opinion, not official government assessment.</p>
          <p><strong>8. Governing law.</strong> These terms are governed by the laws of England and Wales.</p>
          <p><strong>9. Changes.</strong> We may update these terms from time to time. Continued use after changes constitutes acceptance.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
