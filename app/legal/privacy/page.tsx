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
          <p><strong>1. What we collect.</strong> We collect your email address, display name, postcode, and the content of your reviews. Our authentication and hosting providers may process technical request information to operate and protect the service.</p>
          <p><strong>2. How we use your data.</strong> We use your data to operate accounts, moderate reviews and display published resident feedback. Entering a postcode does not itself verify residency. When you use the postcode search, our server sends that postcode to postcodes.io (operated by Ideal Postcodes Ltd) to find your council; your IP address is not passed on and the search postcode is not stored. Anonymised data may be used for research and journalism about local government performance.</p>
          <p><strong>3. What we display publicly.</strong> Only your display name, district, and review content are shown publicly. Your email address, full postcode, and IP address are never displayed.</p>
          <p><strong>4. Data sharing.</strong> We do not sell your personal data to third parties. Aggregated anonymised statistics may be shared with researchers and journalists.</p>
          <p><strong>5. Cookies.</strong> Authentication, draft reviews and the storage-notice preference use browser localStorage. See our browser storage policy for details. We do not include analytics or advertising scripts.</p>
          <p><strong>6. Retention.</strong> Published reviews remain available until removed by the author or through moderation. You can delete your own reviews from your account. Account deletion requests are handled manually through support; signing out does not delete your account.</p>
          <p><strong>7. Your rights.</strong> You have the right to access, correct, or delete your personal data. Contact hello@localverdict.co.uk to exercise these rights.</p>
          <p><strong>8. Data controller.</strong> Rate Your Local Council is operated by Digital Footprint. Contact support using the details on our Contact page for questions about personal data.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
