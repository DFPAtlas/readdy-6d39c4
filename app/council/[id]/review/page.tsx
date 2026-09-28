'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import Header from '../../../components/lv/Header';
import Footer from '../../../components/lv/Footer';
import StarRating from '../../../components/lv/StarRating';

const serviceCategories = ['Adult Social Care','Education & Schools','Housing','Planning','Waste & Recycling','Parking','Highways & Roads','Council Tax'];

export default function WriteReviewPage(){
  const params = useParams();
  const councilId = String(params.id || '');
  const [rating,setRating] = useState(0);
  const [service,setService] = useState('');
  const [title,setTitle] = useState('');
  const [body,setBody] = useState('');
  const [submitted,setSubmitted] = useState(false);

  const submit = (e:React.FormEvent) => {
    e.preventDefault();
    if(rating && title.trim().length >= 5 && body.trim().length >= 20) setSubmitted(true);
  };

  return <div className="min-h-screen bg-slate-50">
    <Header />
    <main className="px-4 lg:px-8 py-8 max-w-2xl mx-auto">
      <nav className="text-sm text-slate-500 mb-6 flex gap-2"><Link href="/councils" className="hover:text-blue-700">Councils</Link><span>/</span><Link href={`/council/${councilId}`} className="hover:text-blue-700">{councilId}</Link><span>/</span><span className="text-slate-800">Write a review</span></nav>
      <h1 className="text-3xl font-bold text-slate-900">Share your council experience</h1>
      <p className="text-slate-500 mt-2">Rate the service you experienced. Verification and live submission will connect in the Supabase production phase.</p>
      <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"><b>Concept mode:</b> this form validates the UX but does not save reviews yet. “Verified resident” badges will only be awarded by the production verification flow.</div>

      {submitted ? <section className="mt-6 bg-white border border-emerald-200 rounded-2xl p-8 text-center"><div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto"><i className="ri-check-line text-2xl"/></div><h2 className="text-xl font-bold mt-4">Review flow validated</h2><p className="text-sm text-slate-500 mt-2">No data was stored because this build is still in concept mode.</p><Link href={`/council/${councilId}`} className="inline-flex mt-5 text-sm font-semibold text-blue-700">Back to council →</Link></section> :
      <form onSubmit={submit} className="mt-6 space-y-5">
        <section className="bg-white border border-slate-200 rounded-2xl p-6"><label className="text-sm font-semibold text-slate-800">Overall rating</label><div className="mt-3"><StarRating rating={rating} size="lg" interactive onChange={setRating}/></div></section>
        <section className="bg-white border border-slate-200 rounded-2xl p-6"><label className="text-sm font-semibold text-slate-800">Service used</label><select value={service} onChange={e=>setService(e.target.value)} className="w-full mt-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"><option value="">Choose a service (optional)</option>{serviceCategories.map(s=><option key={s}>{s}</option>)}</select></section>
        <section className="bg-white border border-slate-200 rounded-2xl p-6"><label className="text-sm font-semibold text-slate-800">Review title</label><input required minLength={5} maxLength={120} value={title} onChange={e=>setTitle(e.target.value)} className="w-full mt-2 px-3 py-2.5 rounded-xl border border-slate-200 text-sm" placeholder="Summarise your experience"/><div className="text-xs text-slate-400 mt-1 text-right">{title.length}/120</div></section>
        <section className="bg-white border border-slate-200 rounded-2xl p-6"><label className="text-sm font-semibold text-slate-800">Your experience</label><textarea required minLength={20} maxLength={2000} rows={7} value={body} onChange={e=>setBody(e.target.value)} className="w-full mt-2 px-3 py-2.5 rounded-xl border border-slate-200 text-sm resize-none" placeholder="What happened, what worked, and what could improve?"/><div className="text-xs text-slate-400 mt-1 text-right">{body.length}/2000</div></section>
        <button disabled={!rating || title.trim().length<5 || body.trim().length<20} className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold disabled:opacity-40">Validate review flow</button>
      </form>}
    </main>
    <Footer />
  </div>;
}
