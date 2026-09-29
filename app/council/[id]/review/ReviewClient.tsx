'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Header from '../../../../components/lv/Header';
import Footer from '../../../../components/lv/Footer';
import StarRating from '../../../../components/lv/StarRating';
import { isSupabaseConfigured, supabase } from '../../../../lib/supabase/client';

type ServiceOption = { id: string; name: string };

export default function ReviewClient({ councilId }: { councilId: string }){
  const [rating,setRating] = useState(0);
  const [serviceId,setServiceId] = useState('');
  const [services,setServices] = useState<ServiceOption[]>([]);
  const [councilDbId,setCouncilDbId] = useState('');
  const [councilName,setCouncilName] = useState(councilId);
  const [title,setTitle] = useState('');
  const [body,setBody] = useState('');
  const [submitted,setSubmitted] = useState(false);
  const [saving,setSaving] = useState(false);
  const [error,setError] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const load = async () => {
      const [{ data: council }, { data: serviceRows }] = await Promise.all([
        supabase.from('councils').select('id,name').eq('slug', councilId).maybeSingle(),
        supabase.from('services').select('id,name').order('name'),
      ]);

      if (council) {
        setCouncilDbId(council.id);
        setCouncilName(council.name);
      }
      if (serviceRows) setServices(serviceRows as ServiceOption[]);
    };

    load();
  }, [councilId]);

  const submit = async (e:React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isSupabaseConfigured) {
      setError('Supabase is not configured in this environment.');
      return;
    }

    if (!rating || title.trim().length < 5 || body.trim().length < 20) return;

    setSaving(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      window.location.href = `/login?next=${encodeURIComponent(`/council/${councilId}/review`)}`;
      return;
    }

    let resolvedCouncilId = councilDbId;
    if (!resolvedCouncilId) {
      const { data: council } = await supabase.from('councils').select('id').eq('slug', councilId).maybeSingle();
      resolvedCouncilId = council?.id || '';
    }

    if (!resolvedCouncilId) {
      setSaving(false);
      setError('Council record could not be found.');
      return;
    }

    const selectedService = services.find(s => s.id === serviceId);

    const { error: insertError } = await supabase.from('reviews').insert({
      council_id: resolvedCouncilId,
      user_id: session.user.id,
      display_name: session.user.user_metadata?.display_name || 'Anonymous',
      rating,
      title: title.trim(),
      body: body.trim(),
      service_id: selectedService?.id || null,
      service_name: selectedService?.name || null,
      is_resident: false,
      verification_status: 'unverified',
      moderation_status: 'pending',
      status: 'live',
    });

    setSaving(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setSubmitted(true);
  };

  return <div className="min-h-screen bg-slate-50">
    <Header />
    <main className="px-4 lg:px-8 py-8 max-w-2xl mx-auto">
      <nav className="text-sm text-slate-500 mb-6 flex gap-2"><Link href="/councils" className="hover:text-blue-700">Councils</Link><span>/</span><Link href={`/council/${councilId}`} className="hover:text-blue-700">{councilName}</Link><span>/</span><span className="text-slate-800">Write a review</span></nav>
      <h1 className="text-3xl font-bold text-slate-900">Share your council experience</h1>
      <p className="text-slate-500 mt-2">Reviews are submitted to the live Supabase moderation queue. Resident verification is handled separately.</p>
      <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800"><b>Live submission:</b> your review will not appear publicly until it passes the moderation workflow. A resident badge cannot be self-assigned.</div>

      {error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {submitted ? <section className="mt-6 bg-white border border-emerald-200 rounded-2xl p-8 text-center"><div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto"><i className="ri-check-line text-2xl"/></div><h2 className="text-xl font-bold mt-4">Review submitted</h2><p className="text-sm text-slate-500 mt-2">Your review is in the moderation queue. It will appear publicly only after approval.</p><Link href={`/council/${councilId}`} className="inline-flex mt-5 text-sm font-semibold text-blue-700">Back to council →</Link></section> :
      <form onSubmit={submit} className="mt-6 space-y-5">
        <section className="bg-white border border-slate-200 rounded-2xl p-6"><label className="text-sm font-semibold text-slate-800">Overall rating</label><div className="mt-3"><StarRating rating={rating} size="lg" interactive onChange={setRating}/></div></section>
        <section className="bg-white border border-slate-200 rounded-2xl p-6"><label className="text-sm font-semibold text-slate-800">Service used</label><select value={serviceId} onChange={e=>setServiceId(e.target.value)} className="w-full mt-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"><option value="">Choose a service (optional)</option>{services.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></section>
        <section className="bg-white border border-slate-200 rounded-2xl p-6"><label className="text-sm font-semibold text-slate-800">Review title</label><input required minLength={5} maxLength={120} value={title} onChange={e=>setTitle(e.target.value)} className="w-full mt-2 px-3 py-2.5 rounded-xl border border-slate-200 text-sm" placeholder="Summarise your experience"/><div className="text-xs text-slate-400 mt-1 text-right">{title.length}/120</div></section>
        <section className="bg-white border border-slate-200 rounded-2xl p-6"><label className="text-sm font-semibold text-slate-800">Your experience</label><textarea required minLength={20} maxLength={2000} rows={7} value={body} onChange={e=>setBody(e.target.value)} className="w-full mt-2 px-3 py-2.5 rounded-xl border border-slate-200 text-sm resize-none" placeholder="What happened, what worked, and what could improve?"/><div className="text-xs text-slate-400 mt-1 text-right">{body.length}/2000</div></section>
        <button disabled={saving || !rating || title.trim().length<5 || body.trim().length<20} className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold disabled:opacity-40">{saving ? 'Submitting…' : 'Submit review'}</button>
      </form>}
    </main>
    <Footer />
  </div>;
}
