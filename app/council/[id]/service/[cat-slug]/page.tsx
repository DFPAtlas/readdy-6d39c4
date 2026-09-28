'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '../../../../../components/lv/Header';
import Footer from '../../../../../components/lv/Footer';

const labels: Record<string, { name: string; category: string; description: string }> = {
  waste: { name: 'Waste & Recycling', category: 'Environment', description: 'Rubbish collection, recycling, garden waste and street-cleaning services.' },
  parking: { name: 'Parking', category: 'Transport', description: 'Parking permits, resident schemes, enforcement and appeals.' },
  planning: { name: 'Planning', category: 'Housing & development', description: 'Planning applications, building control, permitted development and enforcement.' },
  housing: { name: 'Housing', category: 'Housing', description: 'Housing services, support and local housing responsibilities.' },
  highways: { name: 'Highways & Roads', category: 'Transport', description: 'Road maintenance, highways, traffic and related services.' },
  education: { name: 'Education & Schools', category: 'Education', description: 'Schools, admissions and education services.' },
};

export default function ServiceDetailPage() {
  const params = useParams();
  const councilId = String(params.id || '');
  const slug = String(params['cat-slug'] || 'service');
  const service = labels[slug] || { name: slug.replaceAll('-', ' ').replace(/\b\w/g, c => c.toUpperCase()), category: 'Council service', description: 'Service information, public data and resident experience.' };

  return <div className="min-h-screen bg-slate-50">
    <Header />
    <main className="px-4 lg:px-8 py-8 max-w-5xl mx-auto">
      <nav className="text-sm text-slate-500 mb-6 flex gap-2"><Link href="/councils" className="hover:text-blue-700">Councils</Link><span>/</span><Link href={`/council/${councilId}`} className="hover:text-blue-700">{councilId}</Link><span>/</span><span className="text-slate-800">{service.name}</span></nav>
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <span className="inline-flex text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">{service.category}</span>
        <h1 className="text-3xl font-bold text-slate-900 mt-3">{service.name}</h1>
        <p className="text-slate-500 mt-3 max-w-2xl">{service.description}</p>
      </section>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        <section className="bg-white border border-slate-200 rounded-2xl p-5"><h2 className="font-bold">Resident experience</h2><p className="text-sm text-slate-500 mt-2">Verified ratings and reviews will appear here when the Supabase review pipeline is connected.</p></section>
        <section className="bg-white border border-slate-200 rounded-2xl p-5"><h2 className="font-bold">Official performance data</h2><p className="text-sm text-slate-500 mt-2">Service-specific government and council metrics will remain separately labelled and sourced.</p></section>
        <section className="bg-white border border-slate-200 rounded-2xl p-5"><h2 className="font-bold">Updates & decisions</h2><p className="text-sm text-slate-500 mt-2">Relevant projects, consultations, meetings and decisions will be linked to their official source.</p></section>
      </div>
      <Link href={`/council/${councilId}/review`} className="inline-flex mt-6 px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold">Review this council →</Link>
    </main>
    <Footer />
  </div>;
}
