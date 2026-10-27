"use client";

import Icon from "../../../../components/lv/Icon";

import Link from "next/link";
import { councilHref, reviewHref } from "../../../../lib/navigation";
import { draftKey, parseDraft } from "../../../../lib/review-draft";
import { canonicalService } from "../../../../lib/services";
import { useEffect, useState } from "react";
import Header from "../../../../components/lv/Header";
import Footer from "../../../../components/lv/Footer";
import StarRating from "../../../../components/lv/StarRating";
import {
  isSupabaseConfigured,
  supabase,
} from "../../../../lib/supabase/client";

type ServiceOption = { id: string; name: string; slug: string };

export default function ReviewClient({
  councilId,
  serviceSlug = "",
}: {
  councilId: string;
  serviceSlug?: string;
}) {
  const [rating, setRating] = useState(0);
  const [serviceId, setServiceId] = useState("");
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [councilDbId, setCouncilDbId] = useState("");
  const [councilName, setCouncilName] = useState(councilId);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [restored, setRestored] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey(councilId));
      const draft = parseDraft(raw);
      if (raw && !draft) localStorage.removeItem(draftKey(councilId));
      if (draft) {
        setRating(draft.rating);
        setServiceId(draft.serviceId);
        setTitle(draft.title);
        setBody(draft.body);
      }
    } catch {
      /* Storage can be disabled; the form still works. */
    }
    setRestored(true);
  }, [councilId]);
  useEffect(() => {
    if (!restored || submitted) return;
    try {
      if (!rating && !title && !body) return;
      localStorage.setItem(
        draftKey(councilId),
        JSON.stringify({
          rating,
          serviceId,
          title,
          body,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        }),
      );
    } catch {
      /* Saving a draft is optional. */
    }
  }, [restored, submitted, councilId, rating, serviceId, title, body]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const load = async () => {
      const [
        { data: council, error: councilError },
        { data: serviceRows, error: serviceError },
      ] = await Promise.all([
        supabase
          .from("councils")
          .select("id,name")
          .eq("slug", councilId)
          .maybeSingle(),
        supabase.from("services").select("id,name,slug").order("name"),
      ]);

      if (councilError || serviceError)
        throw new Error("Council information unavailable");
      if (!council) {
        setError(
          "Council record could not be found. Please choose an authority from the directory.",
        );
        return;
      }
      if (council) {
        setCouncilDbId(council.id);
        setCouncilName(council.name);
      }
      if (serviceRows) {
        setServices(serviceRows as ServiceOption[]);
        if (serviceSlug)
          setServiceId(
            serviceRows.find((s) => s.slug === canonicalService(serviceSlug))
              ?.id || "",
          );
      }
    };

    load().catch(() =>
      setError("Council information could not be loaded. Please try again."),
    );
  }, [councilId, serviceSlug]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (saving) return;

    if (!isSupabaseConfigured) {
      setError(
        "Review submissions are temporarily unavailable. Please try again later.",
      );
      return;
    }

    if (!rating || title.trim().length < 5 || body.trim().length < 20) return;

    setSaving(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = `/login?next=${encodeURIComponent(reviewHref(councilId, serviceSlug))}`;
        return;
      }

      if (!session.user.email_confirmed_at) {
        setError("Please confirm your email before submitting a review.");
        return;
      }
      let resolvedCouncilId = councilDbId;
      if (!resolvedCouncilId) {
        const { data: council } = await supabase
          .from("councils")
          .select("id")
          .eq("slug", councilId)
          .maybeSingle();
        resolvedCouncilId = council?.id || "";
      }

      if (!resolvedCouncilId) {
        setSaving(false);
        setError("Council record could not be found.");
        return;
      }

      const selectedService = services.find((s) => s.id === serviceId);

      const { error: insertError } = await supabase.from("reviews").insert({
        council_id: resolvedCouncilId,
        user_id: session.user.id,
        display_name: session.user.user_metadata?.display_name || "Anonymous",
        rating,
        title: title.trim(),
        body: body.trim(),
        service_id: selectedService?.id || null,
        service_name: selectedService?.name || null,
        is_resident: false,
        verification_status: "unverified",
        moderation_status: "pending",
        status: "live",
      });

      setSaving(false);

      if (insertError) {
        setError(insertError.message);
        return;
      }

      setSubmitted(true);
      try {
        localStorage.removeItem(draftKey(councilId));
      } catch {}
    } catch {
      setError(
        "Your review could not be submitted. Your draft is still available; please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="px-4 lg:px-8 py-8 max-w-2xl mx-auto">
        <nav className="text-sm text-slate-500 mb-6 flex gap-2">
          <Link href="/councils" className="hover:text-blue-700">
            Councils
          </Link>
          <span>/</span>
          <Link href={councilHref(councilId)} className="hover:text-blue-700">
            {councilName}
          </Link>
          <span>/</span>
          <span className="text-slate-800">Write a review</span>
        </nav>
        <h1 className="text-3xl font-bold text-slate-900">
          Share your council experience
        </h1>
        <p className="text-slate-500 mt-2">
          Sign in with a confirmed email to submit. Drafts can be restored on
          this device for 24 hours after your last change when browser storage
          is available. Avoid including private information.
        </p>
        <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          <b>Before you submit:</b> your review will not appear publicly until
          it passes the moderation workflow. A resident badge cannot be
          self-assigned.
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {submitted ? (
          <section className="mt-6 bg-white border border-emerald-200 rounded-2xl p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
              <Icon className="ri-check-line text-2xl" />
            </div>
            <h2 className="text-xl font-bold mt-4">Review submitted</h2>
            <p className="text-sm text-slate-500 mt-2">
              Your review is in the moderation queue. It will appear publicly
              only after approval.
            </p>
            <Link
              href={councilHref(councilId)}
              className="inline-flex mt-5 text-sm font-semibold text-blue-700"
            >
              Back to council →
            </Link>
          </section>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-5">
            <section className="bg-white border border-slate-200 rounded-2xl p-6">
              <label className="text-sm font-semibold text-slate-800">
                Overall rating
              </label>
              <div className="mt-3">
                <StarRating
                  rating={rating}
                  size="lg"
                  interactive
                  onChange={setRating}
                />
              </div>
            </section>
            <section className="bg-white border border-slate-200 rounded-2xl p-6">
              <label
                htmlFor="review-service"
                className="text-sm font-semibold text-slate-800"
              >
                Service used
              </label>
              <select
                id="review-service"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full mt-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
              >
                <option value="">Choose a service (optional)</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </section>
            <section className="bg-white border border-slate-200 rounded-2xl p-6">
              <label
                htmlFor="review-title"
                className="text-sm font-semibold text-slate-800"
              >
                Review title
              </label>
              <input
                id="review-title"
                required
                minLength={5}
                maxLength={120}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-2 px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
                placeholder="Summarise your experience"
              />
              <div className="text-xs text-slate-400 mt-1 text-right">
                {title.length}/120
              </div>
            </section>
            <section className="bg-white border border-slate-200 rounded-2xl p-6">
              <label
                htmlFor="review-body"
                className="text-sm font-semibold text-slate-800"
              >
                Your experience
              </label>
              <textarea
                id="review-body"
                required
                minLength={20}
                maxLength={2000}
                rows={7}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full mt-2 px-3 py-2.5 rounded-xl border border-slate-200 text-sm resize-none"
                placeholder="What happened, what worked, and what could improve?"
              />
              <div className="text-xs text-slate-400 mt-1 text-right">
                {body.length}/2000
              </div>
            </section>
            <p className="text-sm text-slate-600">
              By submitting, you agree to the{" "}
              <Link href="/legal/terms" className="text-blue-700 underline">
                terms
              </Link>{" "}
              and{" "}
              <Link
                href="/legal/community-guidelines"
                className="text-blue-700 underline"
              >
                community guidelines
              </Link>
              . Read our{" "}
              <Link href="/legal/privacy" className="text-blue-700 underline">
                privacy policy
              </Link>
              .
            </p>
            <button
              disabled={
                saving ||
                !rating ||
                title.trim().length < 5 ||
                body.trim().length < 20
              }
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold disabled:opacity-40"
            >
              {saving ? "Submitting…" : "Submit review"}
            </button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}
