'use client';

import Link from 'next/link';
import Header from '../../../components/lv/Header';
import Footer from '../../../components/lv/Footer';

const districts = ['Broxbourne','Dacorum','East Hertfordshire','Hertsmere','North Hertfordshire','St Albans','Stevenage','Three Rivers','Watford','Welwyn Hatfield'];
const services = [
  ['Roads & Highways','3.2','County council'],['Adult Social Care','3.4','County council'],['Children & SEND','3.1','County council'],['Transport','3.8','County council'],['Libraries','4.0','County council'],['Fire & Rescue','4.2','County council'],
];
const projects = [
  ['SEND provision plan 2026–29','In progress','Children & young people'],
  ['Plan for Children and Young People 2026–31','In progress','County strategy'],
  ['Air Quality Strategy 2026','Published','Environment'],
  ['Library opening hours consultation','Consultation','Libraries'],
  ['New Local Transport Plan','Upcoming','Transport'],
  ['HertsLynx on-demand bus expansion','In progress','Transport'],
];
const sources = [
  ['ONS Local Statistics','Population, age and local indicators','https://www.ons.gov.uk/explore-local-statistics/areas/E10000015-hertfordshire'],
  ['Hertfordshire County Council','Services, finance, meetings and consultations','https://www.hertfordshire.gov.uk/'],
  ['GOV.UK','Local government structure and reorganisation','https://www.gov.uk/government/collections/hertfordshire-local-government-reorganisation'],
  ['Department for Education','Schools and education statistics','https://explore-education-statistics.service.gov.uk/'],
  ['Department for Transport','Roads, traffic and transport datasets','https://www.gov.uk/government/organisations/department-for-transport'],
  ['Environment Agency','Flood, river and environmental monitoring','https://environment.data.gov.uk/'],
  ['Police.uk','Neighbourhood and street-level crime context','https://www.police.uk/'],
];

function Card({title, badge, children, className=''}:{title:string;badge?:string;children:React.ReactNode;className?:string}){
  return <section className={`bg-white border border-slate-200 rounded-2xl p-5 shadow-sm ${className}`}>
    <div className="flex items-center justify-between gap-3 mb-4"><h2 className="font-bold text-slate-900">{title}</h2>{badge&&<span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-blue-50 text-blue-700">{badge}</span>}</div>{children}
  </section>;
}

function Status({value}:{value:string}){
  const cls = value==='Published'?'bg-emerald-50 text-emerald-700':value==='Consultation'?'bg-amber-50 text-amber-700':value==='Upcoming'?'bg-slate-100 text-slate-600':'bg-blue-50 text-blue-700';
  return <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${cls}`}>{value}</span>;
}

export default function HertfordshireDashboard(){
  return <div className="min-h-screen bg-slate-50 text-slate-900">
    <Header/>

    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 opacity-25" style={{backgroundImage:"url('https://readdy.ai/api/search-image?query=Hertfordshire%20English%20countryside%20towns%20villages%20aerial%20panorama%20green%20landscape%20civic%20dashboard%20banner%20photorealistic&width=1800&height=520&seq=herts-dashboard&orientation=landscape')",backgroundSize:'cover',backgroundPosition:'center'}}/>
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-900/55"/>
      <div className="relative px-4 lg:px-8 py-10 lg:py-14">
        <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-8">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 text-xs text-slate-300 mb-4"><Link href="/">Home</Link><span>/</span><Link href="/councils">Councils</Link><span>/</span><span className="text-white">Hertfordshire</span></div>
            <h1 className="text-3xl lg:text-5xl font-bold tracking-tight">Hertfordshire County Council</h1>
            <p className="mt-3 text-slate-300 max-w-2xl">A single place for resident experience, official public data, council activity and local-area context.</p>
            <div className="flex flex-wrap gap-2 mt-5"><span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-semibold">County Council</span><span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold">East of England</span><span className="px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-semibold">Public data snapshot · Sep 2026</span></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 min-w-0 xl:min-w-[620px]">
            {[['1,236,191','Population (2024)'],['40','Median age'],['10','Districts / boroughs'],['124','Parish / town councils']].map(([v,l])=><div key={l} className="rounded-xl border border-white/15 bg-white/10 backdrop-blur p-4"><div className="text-xl font-bold">{v}</div><div className="text-xs text-slate-300 mt-1">{l}</div></div>)}
          </div>
        </div>
      </div>
    </section>

    <main className="px-4 lg:px-8 py-6 max-w-[1600px] mx-auto">
      <div className="grid grid-cols-1 xl:grid-cols-[230px_minmax(0,1fr)] gap-6">
        <aside className="xl:sticky xl:top-20 xl:self-start bg-white border border-slate-200 rounded-2xl p-3 shadow-sm">
          {['Overview','Resident Ratings','Council Services','Politics & Representation','Projects & Consultations','Schools','Transport','Roads & Highways','Adult Social Care','Children & SEND','Environment','Local Economy','Crime Context','Meetings & Decisions','Spending & Finance','Open Data','Compare Areas'].map((x,i)=><a key={x} href={`#${x.toLowerCase().replaceAll(' ','-').replaceAll('&','and')}`} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm ${i===0?'bg-blue-50 text-blue-700 font-semibold':'text-slate-600 hover:bg-slate-50'}`}><i className={`${['ri-dashboard-line','ri-star-line','ri-list-check-2','ri-government-line','ri-road-map-line'][i%5]} text-base`}/>{x}</a>)}
        </aside>

        <div className="space-y-5" id="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <Card title="Resident Rating" badge="Resident opinion">
              <div className="grid grid-cols-[120px_1fr] gap-5 items-center"><div><div className="text-5xl font-bold text-blue-700">3.6<span className="text-xl text-slate-400"> / 5</span></div><div className="text-amber-400 text-xl tracking-[-2px] mt-2">★★★★☆</div><p className="text-xs text-slate-500 mt-2">Concept score until verified resident data is live.</p></div><div className="space-y-2">{services.map(([n,r])=><div key={n} className="grid grid-cols-[125px_1fr_28px] gap-2 items-center text-xs"><span className="text-slate-600">{n}</span><div className="h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full rounded-full bg-blue-500" style={{width:`${Number(r)*20}%`}}/></div><b>{r}</b></div>)}</div></div>
            </Card>
            <Card title="Official Facts" badge="Official data">
              <div className="grid grid-cols-2 gap-3">{[['£1.2bn+','Annual spend delivering 500+ services'],['4.99%','2026/27 county council tax increase'],['10','District / borough councils'],['500+','Council services delivered']].map(([v,l])=><div key={l} className="rounded-xl bg-slate-50 p-3"><div className="text-xl font-bold text-slate-900">{v}</div><p className="text-xs text-slate-500 mt-1">{l}</p></div>)}</div>
              <a href="https://www.hertfordshire.gov.uk/about-the-council/how-the-council-works/council-tax-in-hertfordshire.aspx" target="_blank" className="inline-flex mt-4 text-xs font-semibold text-blue-700">Official HCC source ↗</a>
            </Card>
            <Card title="Council Structure" badge="Official data">
              <div className="space-y-3"><div className="rounded-xl bg-blue-50 border border-blue-100 p-3"><b className="text-sm">Hertfordshire County Council</b><p className="text-xs text-slate-600 mt-1">Strategic county services including education, highways, social care and transport.</p></div><div className="text-center text-slate-300">↓</div><div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3"><b className="text-sm">10 District / Borough Councils</b><p className="text-xs text-slate-600 mt-1">Planning, housing, leisure, waste collection and other local services.</p></div><div className="rounded-xl bg-slate-50 p-3"><b className="text-sm">124 Parish / Town Councils</b><p className="text-xs text-slate-600 mt-1">Community-level representation and services.</p></div></div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card title="Local Government Reorganisation" badge="Official data">
              <p className="text-sm text-slate-600 mb-5">Government has decided, subject to Parliamentary approval, to replace the current county and district/borough structure with four unitary councils.</p>
              <div className="space-y-5 border-l-2 border-blue-100 pl-5">{[['16 Jul 2026','Decision announced','Four unitary authorities selected for Hertfordshire.'],['May 2027','Shadow elections','Expected elections for the new unitary councils.'],['1 Apr 2028','Vesting day','New councils take over existing county and district/borough responsibilities.']].map(([d,t,b])=><div key={d} className="relative"><span className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-blue-50"/><div className="text-xs font-semibold text-blue-700">{d}</div><div className="font-semibold text-sm mt-1">{t}</div><p className="text-xs text-slate-500 mt-1">{b}</p></div>)}</div>
              <a href="https://www.gov.uk/government/collections/hertfordshire-local-government-reorganisation" target="_blank" className="inline-flex mt-5 text-xs font-semibold text-blue-700">View government source ↗</a>
            </Card>
            <Card title="What’s Happening Now" badge="Council activity">
              <div className="divide-y divide-slate-100">{projects.map(([n,s,c])=><div key={n} className="py-3 first:pt-0 flex items-start justify-between gap-3"><div><div className="text-sm font-semibold">{n}</div><div className="text-xs text-slate-500 mt-1">{c}</div></div><Status value={s}/></div>)}</div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <Card title="Transport & Roads" badge="Official + contextual data">
              <div className="grid grid-cols-2 gap-2 mb-4">{['Buses','Rail','Roads','Active Travel'].map(x=><div key={x} className="rounded-xl bg-slate-50 p-3 text-sm font-semibold">{x}</div>)}</div><ul className="space-y-2 text-xs text-slate-600"><li>• County-managed highways and road maintenance context</li><li>• Local bus and concessionary travel information</li><li>• Rail links shown as wider-area context, not council performance</li><li>• Cycling and walking infrastructure plans</li></ul>
            </Card>
            <Card title="Schools & Children" badge="Official data"><div className="space-y-3">{['Schools in Hertfordshire','Find a school','Children’s services','SEND strategy and support'].map(x=><div key={x} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-sm"><span>{x}</span><span className="text-blue-600">↗</span></div>)}</div></Card>
            <Card title="Environment" badge="Official data"><div className="space-y-3">{['Air quality strategy','Local Nature Recovery Strategy','Flood risk and river levels','Waste & recycling context','Biodiversity and conservation'].map(x=><div key={x} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-sm"><span>{x}</span><span className="text-emerald-600">↗</span></div>)}</div></Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5" id="politics-and-representation">
            <Card title="Politics & Representation" badge="Neutral factual record">
              <p className="text-sm text-slate-600">This area should show councillors, wards, committees, published attendance, declarations of interest, motions and recorded votes where available. The platform does not score or rank parties, candidates or elected representatives.</p>
              <div className="grid grid-cols-2 gap-3 mt-4">{['Find your councillor','Council meetings','Committees','Declarations & registers'].map(x=><div key={x} className="rounded-xl border border-slate-200 p-3 text-sm font-medium">{x}</div>)}</div>
            </Card>
            <Card title="Crime Context" badge="Not a council score"><p className="text-sm text-slate-600">Neighbourhood crime data can add local context, but policing is separate from Hertfordshire County Council. Any crime figures should therefore be presented independently from council service ratings.</p><a href="https://www.police.uk/" target="_blank" className="inline-flex mt-4 text-xs font-semibold text-blue-700">Police.uk data ↗</a></Card>
          </div>

          <Card title="Districts in Hertfordshire" badge="ONS geography"><div className="grid grid-cols-2 md:grid-cols-5 gap-3">{districts.map(d=><button key={d} className="rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 px-3 py-3 text-sm font-medium text-left">{d}</button>)}</div></Card>

          <Card title="Open Data Sources" badge="Source-first design" className="mb-8"><div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">{sources.map(([n,d,u])=><a key={n} href={u} target="_blank" className="rounded-xl border border-slate-200 p-4 hover:border-blue-200 hover:bg-blue-50/40 transition-colors"><div className="font-semibold text-sm">{n}</div><p className="text-xs text-slate-500 mt-1">{d}</p><div className="text-xs font-semibold text-blue-700 mt-3">Open source ↗</div></a>)}</div><p className="text-[11px] text-slate-400 mt-4">Resident scores shown on this concept page are placeholders until authenticated review data is connected. Official facts should retain source and snapshot dates when production APIs are wired.</p></Card>
        </div>
      </div>
    </main>
    <Footer/>
  </div>;
}
