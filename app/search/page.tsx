"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "../../components/lv/Header";
import Footer from "../../components/lv/Footer";
import PostcodeSearch from "../../components/lv/PostcodeSearch";
import { validPostcode } from "../../lib/navigation";
function SearchContent() {
  const postcode = useSearchParams().get("postcode") || "";
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto p-4 py-10 space-y-6">
        <h1 className="text-3xl font-bold">
          Find the council serving your postcode
        </h1>
        {validPostcode(postcode) ? (
          <>
            <p>
              Postcode: <strong>{postcode}</strong>
            </p>
            <p>
              Automatic postcode matching is being prepared. Use the government
              lookup to confirm the authority responsible for your area, then
              find it in our directory.
            </p>
            <a
              className="inline-block bg-blue-600 text-white px-5 py-3 rounded-xl"
              href="https://www.gov.uk/find-local-council"
              target="_blank"
              rel="noopener noreferrer"
            >
              Find your local council on GOV.UK ↗
            </a>
            <p className="text-sm text-slate-600">
              You will enter your postcode on GOV.UK. We do not send it
              automatically.
            </p>
            <Link className="block text-blue-700 underline" href="/councils">
              Browse the council directory
            </Link>
          </>
        ) : (
          <>
            <p>Please enter a valid UK postcode.</p>
            <PostcodeSearch />
          </>
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
