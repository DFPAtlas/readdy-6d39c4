"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import CouncilDetail from "../../app/council/[id]/CouncilDetail";
import ReviewClient from "../../app/council/[id]/review/ReviewClient";
import ServiceDetailClient from "../../app/council/[id]/service/[cat-slug]/ServiceDetailClient";
import Header from "./Header";
import Footer from "./Footer";
function Content({ kind }: { kind: "council" | "review" | "service" }) {
  const params = useSearchParams();
  const council = params.get("council") || "";
  const service = params.get("service") || "";
  if (!/^[a-z0-9-]{1,120}$/.test(council))
    return (
      <>
        <Header />
        <main className="max-w-3xl mx-auto p-8">
          <h1 className="text-2xl font-bold">Choose a council</h1>
          <Link href="/councils" className="text-blue-700 underline">
            Browse the council directory
          </Link>
        </main>
        <Footer />
      </>
    );
  if (kind === "review")
    return (
      <ReviewClient key={council} councilId={council} serviceSlug={service} />
    );
  if (kind === "service")
    return (
      <ServiceDetailClient
        key={`${council}:${service}`}
        councilId={council}
        slug={service}
      />
    );
  return <CouncilDetail key={council} councilId={council} />;
}
export default function QueryPage({
  kind,
}: {
  kind: "council" | "review" | "service";
}) {
  return (
    <Suspense
      fallback={
        <main className="p-8" role="status">
          Loading…
        </main>
      }
    >
      <Content kind={kind} />
    </Suspense>
  );
}
