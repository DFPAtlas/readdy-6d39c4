import Link from "next/link";
import Header from "../../../components/lv/Header";
import Footer from "../../../components/lv/Footer";
const sections = [
  {
    id: "council-services",
    title: "Council services",
    text: "Check the county council website for its current responsibilities and service information.",
    links: [
      ["Hertfordshire County Council", "https://www.hertfordshire.gov.uk/"],
    ],
  },
  {
    id: "schools",
    title: "Schools and children",
    text: "Use official sources for admissions, school information and published education statistics.",
    links: [
      [
        "Hertfordshire education and schools",
        "https://www.hertfordshire.gov.uk/services/schools-and-education/schools-and-education.aspx",
      ],
      [
        "Department for Education statistics",
        "https://explore-education-statistics.service.gov.uk/",
      ],
    ],
  },
  {
    id: "transport",
    title: "Transport and roads",
    text: "Roads, buses and wider transport context have different responsible organisations. Check the original source before making comparisons.",
    links: [
      [
        "Hertfordshire highways and transport",
        "https://www.hertfordshire.gov.uk/services/highways-roads-and-pavements/highways-roads-and-pavements.aspx",
      ],
      [
        "Department for Transport",
        "https://www.gov.uk/government/organisations/department-for-transport",
      ],
    ],
  },
  {
    id: "environment",
    title: "Environment",
    text: "Use current government and agency sources for environmental monitoring and flood information.",
    links: [
      ["Environment Agency data", "https://environment.data.gov.uk/"],
      ["Check flood risk", "https://www.gov.uk/check-flooding"],
    ],
  },
  {
    id: "representation",
    title: "Meetings and representation",
    text: "For councillors, committees, decisions and changes to local government, start with the official council website. We do not score political parties or representatives.",
    links: [
      [
        "Hertfordshire council information",
        "https://www.hertfordshire.gov.uk/about-the-council/about-the-council.aspx",
      ],
    ],
  },
  {
    id: "area-context",
    title: "Area context",
    text: "Population and neighbourhood information help describe an area. Crime data concerns policing and is not a council performance rating.",
    links: [
      [
        "ONS local statistics",
        "https://www.ons.gov.uk/explore-local-statistics/areas/E10000015-hertfordshire",
      ],
      ["Police.uk", "https://www.police.uk/"],
    ],
  },
];
export default function HertfordshireResources() {
  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto p-4 lg:p-8">
        <p className="text-sm text-blue-700">Official resource guide</p>
        <h1 className="text-3xl lg:text-5xl font-bold mt-3">
          Hertfordshire council information
        </h1>
        <p className="text-slate-600 max-w-3xl mt-5">
          Explore original sources for services, public information and local
          decisions. This guide links to the organisations responsible; it does
          not provide a live data dashboard.
        </p>
        <Link
          href="/council-view?council=hertfordshire"
          className="inline-block bg-blue-600 text-white px-5 py-3 rounded-xl mt-6"
        >
          Read and write resident reviews
        </Link>
        <nav aria-label="On this page" className="flex flex-wrap gap-3 my-8">
          {sections.map((s) => (
            <a href={`#${s.id}`} key={s.id} className="text-blue-700 underline">
              {s.title}
            </a>
          ))}
        </nav>
        <div className="grid md:grid-cols-2 gap-5">
          {sections.map((s) => (
            <section
              id={s.id}
              key={s.id}
              className="bg-white border rounded-2xl p-6 scroll-mt-24"
            >
              <h2 className="text-xl font-bold">{s.title}</h2>
              <p className="text-slate-600 mt-3">{s.text}</p>
              <ul className="space-y-3 mt-5">
                {s.links.map(([label, url]) => (
                  <li key={url}>
                    <a
                      className="text-blue-700 underline"
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
