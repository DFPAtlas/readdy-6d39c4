"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../../components/lv/Header";
import Footer from "../../components/lv/Footer";
import { isSupabaseConfigured, supabase } from "../../lib/supabase/client";
type Service = {
  slug: string;
  name: string;
  category: string;
  description: string | null;
};
export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured)
        throw new Error("The service directory is temporarily unavailable.");
      const { data, error } = await supabase
        .from("services")
        .select("slug,name,category,description")
        .order("name");
      if (error) throw new Error("The service directory could not be loaded.");
      setServices(data || []);
    }
    load()
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto p-4 lg:p-8">
        <h1 className="text-3xl font-bold">Council services</h1>
        <p className="mt-2 text-slate-600">
          Choose a service, then select the council you used. Responsibilities
          vary by authority.
        </p>
        <label className="block mt-6">
          Search services
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full border rounded-xl p-3 mt-2"
            type="search"
          />
        </label>
        {loading && (
          <p role="status" className="mt-6">
            Loading services…
          </p>
        )}
        {error && (
          <p role="alert" className="mt-6">
            {error}
          </p>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {services
            .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
            .map((s) => (
              <Link
                key={s.slug}
                href={`/councils?service=${encodeURIComponent(s.slug)}`}
                className="border rounded-2xl p-5 bg-white hover:border-blue-500"
              >
                <p className="text-xs text-slate-500">{s.category}</p>
                <h2 className="font-bold mt-2">{s.name}</h2>
                <p className="text-sm text-slate-600 mt-2">{s.description}</p>
                <p className="text-blue-700 mt-4">Choose a council →</p>
              </Link>
            ))}
        </div>
        {!loading &&
          !error &&
          !services.filter((s) =>
            s.name.toLowerCase().includes(search.toLowerCase()),
          ).length && <p className="mt-6">No services match your search.</p>}
      </main>
      <Footer />
    </>
  );
}
