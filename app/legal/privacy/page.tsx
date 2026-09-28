'use client';

import Header from '../../../components/lv/Header';
import Footer from '../../../components/lv/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="px-4 py-8 lg:px-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Privacy policy</h1>
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 text-sm text-slate-600 leading-relaxed">
          <p><strong>1. What we collect.</strong> We collect your email address, display name, postcode, and the content of your reviews. We also capture your IP address and user agent on submission for moderation and fraud prevention.</p>
          <p><strong>2. How we use your data.</strong> We use your data to verify reviews, display ratings, and improve the platform. Anonymised data may be used for research and journalism about local government performance.</p>
          <p><strong>3. What we display publicly.</strong> Only your display name, district, and review content are shown publicly. Your email address, full postcode, and IP address are never displayed.</p>
          <p><strong>4. Data sharing.</strong> We do not sell your personal data to third parties. Aggregated anonymised statistics may be shared with researchers and journalists.</p>
          <p><strong>5. Cookies.</strong> We use only essential cookies for authentication and abuse prevention. We do not use tracking or advertising cookies.</p>
          <p><strong>6. Retention.</strong> Review content is retained indefinitely. Account data is deleted when you delete your account.</p>
          <p><strong>7. Your rights.</strong> You have the right to access, correct, or delete your personal data. Contact hello@localverdict.co.uk to exercise these rights.</p>
          <p><strong>8. Data controller.</strong> LocalVerdict is the data controller. Contact details are available in the footer of every page.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}