"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../../../../../components/lv/Header";
import Footer from "../../../../../components/lv/Footer";
import ReviewCard from "../../../../../components/lv/ReviewCard";
import {
  isSupabaseConfigured,
  supabase,
} from "../../../../../lib/supabase/client";
import { councilHref, reviewHref } from "../../../../../lib/navigation";
import { canonicalService } from "../../../../../lib/services";

type Review = Parameters<typeof ReviewCard>[0]["review"];
type Service = {
  id: string;
  name: string;
  description: string | null;
  category: string;
};
export default function ServiceDetailClient({
  councilId,
  slug,
}: {
  councilId: string;
  slug: string;
}) {
  const [service, setService] = useState<Service | null>(null);
  const [councilName, setCouncilName] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sort, setSort] = useState("newest");
  const [rating, setRating] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    async function load() {
      if (!isSupabaseConfigured)
        throw new Error("Reviews are temporarily unavailable.");
      const [c, s] = await Promise.all([
        supabase
          .from("councils")
          .select("id,name")
          .eq("slug", councilId)
          .maybeSingle(),
        supabase
          .from("services")
          .select("id,name,description,category")
          .eq("slug", canonicalService(slug))
          .maybeSingle(),
      ]);
      if (c.error || s.error)
        throw new Error(
          "Service information could not be loaded. Please try again.",
        );
      if (!c.data || !s.data)
        throw new Error(
          "This council or service is not available in the directory.",
        );
      const result = await supabase
        .from("reviews")
        .select(
          "id,display_name,is_resident,district,rating,title,body,service_name,created_at,helpful_count",
        )
        .eq("council_id", c.data.id)
        .eq("service_id", s.data.id)
        .eq("status", "live")
        .eq("moderation_status", "live")
        .order("created_at", { ascending: false })
        .limit(1000);
      if (result.error)
        throw new Error("Reviews could not be loaded. Please try again.");
      if (active) {
        setCouncilName(c.data.name);
        setService(s.data);
        setReviews(result.data || []);
      }
    }
    load()
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [councilId, slug]);
  const filtered = reviews
    .filter((r) => rating === "all" || r.rating === Number(rating))
    .sort((a, b) =>
      sort === "highest"
        ? b.rating - a.rating
        : sort === "lowest"
          ? a.rating - b.rating
          : Date.parse(b.created_at) - Date.parse(a.created_at),
    );
  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto p-4 lg:p-8 space-y-6">
        <Link href={councilHref(councilId)} className="text-blue-700 underline">
          ← {councilName || "Back to council"}
        </Link>
        {loading && <p role="status">Loading service reviews…</p>}
        {error && (
          <p role="alert" className="rounded-xl bg-amber-50 p-5 text-amber-900">
            {error}
          </p>
        )}
        {service && (
          <>
            <section className="bg-white border rounded-2xl p-6">
              <p className="text-sm text-slate-500">
                {councilName} · {service.category}
              </p>
              <h1 className="text-3xl font-bold mt-2">{service.name}</h1>
              <p className="mt-3 text-slate-600">
                {service.description ||
                  "Read resident experiences of this service. Check the council website to confirm its responsibilities."}
              </p>
              <p className="mt-4">
                {reviews.length
                  ? `${(reviews.reduce((n, r) => n + r.rating, 0) / reviews.length).toFixed(1)} / 5 · ${reviews.length} published reviews (up to the latest 1,000)`
                  : "No published reviews yet."}
              </p>
              <Link
                className="inline-block mt-5 rounded-xl bg-blue-600 text-white px-5 py-3"
                href={reviewHref(councilId, canonicalService(slug))}
              >
                Review this service
              </Link>
            </section>
            <div className="flex flex-wrap gap-4">
              <label>
                Sort{" "}
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="border rounded-lg p-2"
                >
                  <option value="newest">Newest</option>
                  <option value="highest">Highest rating</option>
                  <option value="lowest">Lowest rating</option>
                </select>
              </label>
              <label>
                Rating{" "}
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="border rounded-lg p-2"
                >
                  <option value="all">All ratings</option>
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>
                      {r} stars
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {filtered.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
            {!filtered.length && (
              <p>No published reviews match these filters.</p>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
