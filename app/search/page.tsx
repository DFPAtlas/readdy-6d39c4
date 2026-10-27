"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "../../components/lv/Header";
import Footer from "../../components/lv/Footer";
import PostcodeSearch from "../../components/lv/PostcodeSearch";
import CouncilLogo from "../../components/lv/CouncilLogo";
import { councilHref, reviewHref, validPostcode } from "../../lib/navigation";
import { formatCouncilType } from "../../lib/councils";
import {
  lookupPostcode,
  roleLabel,
  roleSummary,
  type PostcodeLookup,
} from "../../lib/postcode";

function GovUkFallback({ intro }: { intro: string }) {
  return (
    <div className="space-y-4">
      <p>{intro}</p>
      <a
        className="inline-block bg-blue-600 text-white px-5 py-3 rounded-xl"
        href="https://www.gov.uk/find-local-council"
        target="_blank"
        rel="noopener noreferrer"
      >
        Find your local council on GOV.UK ↗
      </a>
      <Link className="block text-blue-700 underline" href="/councils">
        Browse the council directory
      </Link>
    </div>
  );
}

function Results({ result }: { result: Extract<PostcodeLookup, { status: "ok" }> }) {
  const twoTier = result.councils.length > 1;
  return (
    <div className="space-y-5">
      <p className="text-slate-700">
        {twoTier
          ? `${result.postcode} has two councils. They look after different services, so pick the one your review is about.`
          : `${result.postcode} is served by:`}
      </p>
      {result.terminated && (
        <p className="rounded-xl bg-amber-50 p-4 text-amber-900">
          This postcode is no longer in use. We have shown the council for where it was.
        </p>
      )}
      <ul className="space-y-4">
        {result.councils.map((c) => (
          <li key={c.slug} className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-start gap-4">
              <CouncilLogo name={c.name} logoUrl={c.logo_url} logoType={c.logo_type} size={48} decorative />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                  {roleLabel(c.role)}
                </p>
                <h2 className="text-lg font-bold text-slate-900 mt-1">{c.name}</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {formatCouncilType(c.council_type)}
                  {c.region ? ` · ${c.region}` : ""}
                </p>
                <p className="text-sm text-slate-600 mt-2">{roleSummary(c.role)}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={councilHref(c.slug)}
                    className="px-4 py-2 rounded-lg bg-[#0B5FFF] text-white text-sm font-medium hover:bg-blue-700"
                  >
                    Read reviews
                  </Link>
                  <Link
                    href={reviewHref(c.slug)}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:border-blue-400"
                  >
                    Write a review
                  </Link>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SearchContent() {
  const postcode = useSearchParams().get("postcode") || "";
  const valid = validPostcode(postcode);
  const [result, setResult] = useState<PostcodeLookup | null>(null);

  useEffect(() => {
    if (!valid) return;
    let cancelled = false;
    setResult(null);
    lookupPostcode(postcode)
      .then((r) => { if (!cancelled) setResult(r); })
      .catch(() => { if (!cancelled) setResult({ status: "unavailable" }); });
    return () => { cancelled = true; };
  }, [postcode, valid]);

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto p-4 py-10 space-y-6">
        <h1 className="text-3xl font-bold">Find the council serving your postcode</h1>

        {!valid && (
          <>
            <p>Please enter a valid UK postcode.</p>
            <PostcodeSearch />
          </>
        )}

        {valid && !result && (
          <p role="status" className="flex items-center gap-2 text-slate-600">
            <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            Finding the councils for your postcode…
          </p>
        )}

        {result?.status === "ok" && <Results result={result} />}

        {result?.status === "not_found" && (
          <div className="space-y-4">
            <p role="alert">
              We couldn’t find <strong>{result.postcode}</strong>. Check it and try again.
            </p>
            <PostcodeSearch />
          </div>
        )}

        {result?.status === "rate_limited" && (
          <GovUkFallback intro="There have been a lot of searches from your connection. Please try again in a minute, or use the government lookup." />
        )}

        {(result?.status === "no_match" || result?.status === "unavailable" || result?.status === "invalid") && (
          <GovUkFallback intro="We couldn’t match this postcode automatically right now. Use the government lookup to find your council, then find it in our directory." />
        )}

        {valid && (
          <p className="text-xs text-slate-500">
            We check your postcode against Office for National Statistics data using postcodes.io,
            from our server. We don’t store the postcode, and your IP address isn’t shared with postcodes.io.
          </p>
        )}
      </main>
      <Footer />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="p-8">Loading…</p>}>
      <SearchContent />
    </Suspense>
  );
}
