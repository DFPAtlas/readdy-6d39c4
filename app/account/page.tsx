"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import Header from "../../components/lv/Header";
import Footer from "../../components/lv/Footer";
import { supabase, isSupabaseConfigured } from "../../lib/supabase/client";
import { councilHref, validPostcode } from "../../lib/navigation";
type Review = {
  id: string;
  council_id: string;
  rating: number;
  title: string;
  body: string;
  moderation_status: string;
  status: string;
  created_at: string;
  councils: { slug: string; name: string } | null;
};
export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [displayName, setDisplayName] = useState("");
  const [postcode, setPostcode] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured)
        throw new Error(
          "Accounts are temporarily unavailable. Please try again later.",
        );
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.replace("/login?next=/account");
        return;
      }
      setUser(data.user);
      setDisplayName(data.user.user_metadata?.display_name || "");
      setPostcode(data.user.user_metadata?.postcode || "");
      const result = await supabase
        .from("reviews")
        .select(
          "id,council_id,rating,title,body,moderation_status,status,created_at,councils(slug,name)",
        )
        .eq("user_id", data.user.id)
        .order("created_at", { ascending: false });
      if (result.error)
        throw new Error(
          "Your review history could not be loaded. Please refresh to try again.",
        );
      setReviews((result.data || []) as unknown as Review[]);
    }
    load()
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [router]);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!validPostcode(postcode)) {
      setError("Enter a valid UK postcode.");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          display_name: displayName.trim(),
          postcode: postcode.trim().toUpperCase(),
        },
      });
      if (error) throw error;
      setMessage(
        "Profile saved. Changing your postcode does not verify residency.",
      );
    } catch {
      setError("Your profile could not be saved. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  async function removeReview(id: string) {
    if (!user || !window.confirm("Permanently delete this review?")) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const { data, error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id)
        .select("id");
      if (error || data?.length !== 1) throw new Error();
      setReviews((v) => v.filter((r) => r.id !== id));
      setMessage("Review deleted.");
    } catch {
      setError("The review could not be deleted. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  async function signOut() {
    setBusy(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setError("Could not sign out. Please try again.");
      setBusy(false);
    } else router.replace("/");
  }
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto p-4 lg:p-8 space-y-6">
        <h1 className="text-3xl font-bold">Your account</h1>
        {loading && <p role="status">Loading your account…</p>}
        {error && (
          <p role="alert" className="bg-red-50 text-red-800 p-4 rounded-xl">
            {error}
          </p>
        )}
        {message && (
          <p
            role="status"
            className="bg-green-50 text-green-800 p-4 rounded-xl"
          >
            {message}
          </p>
        )}
        {user && (
          <>
            <section className="bg-white border rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Profile</h2>
              <form onSubmit={save} className="space-y-4">
                <p className="text-sm">{user.email}</p>
                <label className="block">
                  Display name
                  <input
                    required
                    minLength={2}
                    maxLength={40}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="block border rounded-xl p-3 mt-1 w-full"
                  />
                </label>
                <label className="block">
                  Postcode
                  <input
                    required
                    maxLength={10}
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    className="block border rounded-xl p-3 mt-1 w-full"
                  />
                </label>
                <p className="text-sm text-slate-600">
                  Your full postcode is not shown on public reviews.
                </p>
                <button
                  disabled={busy}
                  className="bg-blue-600 text-white px-5 py-3 rounded-xl disabled:opacity-50"
                >
                  Save profile
                </button>
              </form>
            </section>
            <section className="bg-white border rounded-2xl p-6">
              <h2 className="text-xl font-bold">Your reviews</h2>
              <p className="text-sm text-slate-600 mt-2">
                Pending reviews are visible here before publication. To correct
                a review, delete it and submit a replacement for moderation.
              </p>
              {!loading && !error && !reviews.length && (
                <p className="mt-5">
                  You have no reviews yet.{" "}
                  <Link href="/councils" className="text-blue-700 underline">
                    Choose a council
                  </Link>
                  .
                </p>
              )}
              <div className="space-y-4 mt-5">
                {reviews.map((r) => (
                  <article key={r.id} className="border rounded-xl p-4">
                    <div className="flex justify-between gap-3">
                      <Link
                        href={councilHref(r.councils?.slug || "")}
                        className="text-blue-700 underline"
                      >
                        {r.councils?.name || "Council review"}
                      </Link>
                      <span className="text-sm">
                        {r.moderation_status === "live" && r.status === "live"
                          ? "Published"
                          : r.moderation_status === "pending"
                            ? "Awaiting moderation"
                            : "Not published"}
                      </span>
                    </div>
                    <h3 className="font-semibold mt-3">
                      {r.rating}/5 · {r.title}
                    </h3>
                    <p className="mt-2 whitespace-pre-wrap break-words">
                      {r.body}
                    </p>
                    <p className="text-xs text-slate-500 mt-3">
                      {new Date(r.created_at).toLocaleDateString("en-GB")}
                    </p>
                    <button
                      disabled={busy}
                      onClick={() => removeReview(r.id)}
                      className="text-red-700 underline mt-4 disabled:opacity-50"
                    >
                      Delete review
                    </button>
                  </article>
                ))}
              </div>
            </section>
            <section className="bg-white border rounded-2xl p-6">
              <h2 className="text-xl font-bold">Account and privacy</h2>
              <p className="text-sm text-slate-600 mt-3">
                To request account deletion or a copy of your data, contact
                support from the email registered to your account. This link
                opens your email app; your account remains active until the
                request has been processed.
              </p>
              <Link
                href="/contact"
                className="inline-block text-blue-700 underline mt-4"
              >
                Request account deletion or data access
              </Link>
              <button
                onClick={signOut}
                disabled={busy}
                className="block mt-5 border rounded-xl px-5 py-3 disabled:opacity-50"
              >
                Sign out
              </button>
            </section>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
