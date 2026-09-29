'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import Header from '../../../components/lv/Header';
import Footer from '../../../components/lv/Footer';
import CouncilHero from '../../../components/lv/CouncilHero';
import StarRating from '../../../components/lv/StarRating';
import ReviewCard from '../../../components/lv/ReviewCard';
import { isSupabaseConfigured, supabase } from '../../../lib/supabase/client';

interface CouncilDetailProps {
  councilId: string;
}

type LiveCouncil = {
  id: string;
  slug: string;
  name: string;
  council_type: string;
  region: string | null;
  website_url: string | null;
  contact_url: string | null;
};

type LiveReview = {
  id: string;
  display_name: string;
  is_resident: boolean;
  district?: string | null;
  rating: number;
  title: string;
  body: string;
  service_name?: string | null;
  created_at: string;
  helpful_count: number;
};

type ServiceSummary = {
  service_name: string | null;
  review_count: number;
  average_rating: number | null;
};

const serviceSlugMap: Record<string, string> = {
  'Parking': 'parking',
  'Housing': 'housing',
  'Education & schools': 'education',
  'Council Tax': 'council-tax',
  'Planning': 'planning',
  'Waste & recycling': 'waste',
  'Highways & roads': 'highways',
};

function serviceCategory(name: string) {
  if (name === 'Parking' || name === 'Highways & roads') return 'Transport';
  if (name === 'Housing' || name === 'Planning') return 'Housing';
  if (name === 'Education & schools') return 'Education';
  if (name === 'Waste & recycling') return 'Environment';
  if (name === 'Council Tax') return 'Finance';
  return 'Council service';
}

export default function CouncilDetail({ councilId }: CouncilDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'reviews' | 'contact'>('overview');
  const [reviewFilter, setReviewFilter] = useState<'newest' | 'highest' | 'lowest'>('newest');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [council, setCouncil] = useState<LiveCouncil | null>(null);
  const [reviews, setReviews] = useState<LiveReview[]>([]);
  const [serviceSummaries, setServiceSummaries] = useState<ServiceSummary[]>([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [liveError, setLiveError] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      setLiveError('');

      const { data: councilRow, error: councilError } = await supabase
        .from('councils')
        .select('id,slug,name,council_type,region,website_url,contact_url')
        .eq('slug', councilId)
        .maybeSingle();

      if (councilError || !councilRow) {
        setLiveError('Live council data could not be loaded.');
        setLoading(false);
        return;
      }

      const [{ data: reviewRows }, { data: serviceRows }] = await Promise.all([
        supabase
          .from('reviews')
          .select('id,display_name,is_resident,district,rating,title,body,service_name,created_at,helpful_count')
          .eq('council_id', councilRow.id)
          .eq('status', 'live')
          .eq('moderation_status', 'live')
          .order('created_at', { ascending: false })
          .limit(100),
        supabase
          .from('service_review_summary')
          .select('service_name,review_count,average_rating')
          .eq('council_id', councilRow.id),
      ]);

      setCouncil(councilRow as LiveCouncil);
      setReviews((reviewRows || []) as LiveReview[]);
      setServiceSummaries((serviceRows || []).map((row: any) => ({
        service_name: row.service_name,
        review_count: Number(row.review_count || 0),
        average_rating: row.average_rating == null ? null : Number(row.average_rating),
      })));
      setLoading(false);
    };

    load();
  }, [councilId]);

  const ratingCounts = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    reviews.forEach(r => {
      if (r.rating >= 1 && r.rating <= 5) counts[r.rating - 1] += 1;
    });
    return counts;
  }, [reviews]);

  const averageRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const heroCouncil = {
    id: council?.id || councilId,
    slug: council?.slug || councilId,
    name: council?.name || councilId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    council_type: council?.council_type || 'district',
    region: council?.region || 'Live data pending',
    overall_rating: averageRating,
    review_count: reviews.length,
  };

  const services = serviceSummaries
    .filter(s => s.service_name)
    .map((s, index) => ({
      id: `${index}-${s.service_name}`,
      name: s.service_name as string,
      slug: serviceSlugMap[s.service_name as string] || (s.service_name as string).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      rating: s.average_rating || 0,
      reviews: s.review_count,
      category: serviceCategory(s.service_name as string),
    }));

  const filteredReviews = [...reviews].sort((a, b) => {
    if (reviewFilter === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (reviewFilter === 'highest') return b.rating - a.rating;
    return a.rating - b.rating;
  });

  const filteredServices = serviceFilter === 'all'
    ? services
    : services.filter(s => s.category === serviceFilter);

  const categories = Array.from(new Set(services.map(s => s.category)));
  const totalRatings = reviews.length;
  const getBarWidth = (count: number) => totalRatings ? `${(count / totalRatings) * 100}%` : '0%';

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <CouncilHero council={heroCouncil} />

      <div className="bg-white border-b border-slate-200 sticky top-[57px] z-40">
        <div className="px-4 lg:px-8">
          <div className="flex gap-1">
            {(['overview', 'services', 'reviews', 'contact'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${activeTab === tab ? 'border-[#0B5FFF] text-[#0B5FFF]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="px-4 py-6 lg:px-8 max-w-4xl mx-auto">
        {loading && <div className="bg-white border border-slate-200 rounded-xl p-6 text-sm text-slate-500">Loading live council data…</div>}
        {liveError && <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">{liveError}</div>}

        {!loading && activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Resident rating distribution</h2>
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">{isSupabaseConfigured ? 'LIVE SUPABASE' : 'ENV NOT CONFIGURED'}</span>
              </div>
              <div className="space-y-2">
                {[5,4,3,2,1].map(stars => {
                  const count = ratingCounts[stars - 1];
                  return <div key={stars} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12 shrink-0"><span className="text-sm font-medium text-slate-600">{stars}</span><i className="ri-star-fill text-amber-400 text-xs" /></div>
                    <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-[#0B5FFF] rounded-full" style={{ width: getBarWidth(count) }} /></div>
                    <span className="text-sm text-slate-500 w-10 text-right shrink-0">{count}</span>
                  </div>;
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold text-slate-900">Services</h2><button onClick={() => setActiveTab('services')} className="text-sm font-medium text-[#0B5FFF]">View all →</button></div>
              {services.length === 0 ? <p className="text-sm text-slate-500">No live service review data yet.</p> :
                <div className="space-y-3">{[...services].sort((a,b)=>b.rating-a.rating).slice(0,4).map(s => (
                  <Link key={s.id} href={`/council/${councilId}/service/${s.slug}`} className="flex items-center justify-between py-2 hover:bg-slate-50 rounded-lg px-2 -mx-2">
                    <div><span className="text-sm font-medium text-slate-700">{s.name}</span><span className="text-xs text-slate-400 ml-3">{s.reviews} reviews</span></div>
                    <div className="flex items-center gap-2"><StarRating rating={Math.round(s.rating)} size="sm" /><span className="text-sm font-semibold">{s.rating.toFixed(1)}</span></div>
                  </Link>
                ))}</div>}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold text-slate-900">Recent reviews</h2><button onClick={() => setActiveTab('reviews')} className="text-sm font-medium text-[#0B5FFF]">View all →</button></div>
              {reviews.length === 0 ? <p className="text-sm text-slate-500">No live reviews yet.</p> : <div className="space-y-4">{reviews.slice(0,3).map(r => <ReviewCard key={r.id} review={{...r, district:r.district || undefined, service_name:r.service_name || undefined}} />)}</div>}
            </div>
          </div>
        )}

        {!loading && activeTab === 'services' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => setServiceFilter('all')} className={`px-3 py-1.5 rounded-full text-xs font-medium ${serviceFilter === 'all' ? 'bg-[#0B5FFF] text-white' : 'bg-slate-100 text-slate-600'}`}>All</button>
              {categories.map(cat => <button key={cat} onClick={() => setServiceFilter(cat)} className={`px-3 py-1.5 rounded-full text-xs font-medium ${serviceFilter === cat ? 'bg-[#0B5FFF] text-white' : 'bg-slate-100 text-slate-600'}`}>{cat}</button>)}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredServices.map(s => <Link key={s.id} href={`/council/${councilId}/service/${s.slug}`} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md">
                <div className="flex items-start justify-between mb-3"><div><h3 className="font-semibold">{s.name}</h3><span className="text-xs text-slate-400">{s.reviews} reviews</span></div><span className="text-xs px-2 py-0.5 rounded-full bg-slate-100">{s.category}</span></div>
                <div className="flex items-center gap-2"><StarRating rating={Math.round(s.rating)} size="sm" /><span className="font-bold">{s.rating.toFixed(1)}</span></div>
              </Link>)}
            </div>
          </div>
        )}

        {!loading && activeTab === 'reviews' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex bg-slate-100 rounded-lg p-0.5">{(['newest','highest','lowest'] as const).map(sort => <button key={sort} onClick={() => setReviewFilter(sort)} className={`px-3 py-1.5 rounded-md text-xs font-medium ${reviewFilter===sort?'bg-white shadow-sm':'text-slate-500'}`}>{sort}</button>)}</div>
              <span className="text-sm text-slate-400">{reviews.length} live reviews</span>
            </div>
            {filteredReviews.length === 0 ? <div className="bg-white rounded-xl border border-slate-200 p-6 text-sm text-slate-500">No live reviews yet.</div> : filteredReviews.map(r => <ReviewCard key={r.id} review={{...r, district:r.district || undefined, service_name:r.service_name || undefined}} />)}
          </div>
        )}

        {!loading && activeTab === 'contact' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Official council links</h2>
            <p className="text-sm text-slate-500 mb-5">These links come from the council record in the live data table.</p>
            <div className="flex flex-wrap gap-3">
              {council?.website_url && <a href={council.website_url} target="_blank" rel="noopener noreferrer" className="px-4 py-2.5 rounded-lg bg-[#0B5FFF] text-white text-sm font-medium">Council website</a>}
              {council?.contact_url && <a href={council.contact_url} target="_blank" rel="noopener noreferrer" className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium">Contact page</a>}
              {!council?.website_url && !council?.contact_url && <span className="text-sm text-slate-500">Official contact links have not been populated yet.</span>}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
