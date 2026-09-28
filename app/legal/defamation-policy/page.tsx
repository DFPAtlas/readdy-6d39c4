'use client';

import Header from '../../../components/lv/Header';
import Footer from '../../../components/lv/Footer';

export default function DefamationPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="px-4 py-8 lg:px-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Defamation policy</h1>
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 text-sm text-slate-600 leading-relaxed">
          <p><strong>Our approach.</strong> LocalVerdict believes in free speech and honest public feedback about local government. We do not remove reviews simply because a council dislikes them. However, we take genuine defamation concerns seriously.</p>
          <p><strong>What we remove.</strong> Reviews that contain demonstrably false statements of fact that cause serious harm to a named individual or organisation may be removed after investigation.</p>
          <p><strong>What we do not remove.</strong> Opinions, subjective assessments of service quality, and expressions of frustration with council performance are protected fair comment and will not be removed.</p>
          <p><strong>Process.</strong> If you believe a review is defamatory, email defamation@localverdict.co.uk with: the specific review URL, the exact statement you dispute, why it is false, and any evidence supporting your position.</p>
          <p><strong>Timeline.</strong> We aim to respond to defamation reports within 5 working days. We may seek independent legal advice before making a decision.</p>
          <p><strong>Council responses.</strong> Councils cannot post official responses yet, but this feature is planned. In the meantime, councils may contact us to flag factual inaccuracies.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}