"use client";
import { useEffect, useState } from "react";
import Header from "../../components/lv/Header";
import Footer from "../../components/lv/Footer";
import { isSupabaseConfigured, supabase } from "../../lib/supabase/client";
export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recovery, setRecovery] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (data.session) setRecovery(true);
      })
      .catch(() => {});
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      if (!isSupabaseConfigured) throw new Error();
      const { error } = recovery
        ? await supabase.auth.updateUser({ password })
        : await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
          });
      if (error) throw error;
      setMessage(
        recovery
          ? "Password updated. You can return to your account."
          : "If an account exists for that address, you will receive a reset email. Open its link in this browser.",
      );
      setPassword("");
    } catch {
      setError(
        "The request could not be completed. Please try again or request a new link.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Header />
      <main className="max-w-md mx-auto p-4 py-10">
        <h1 className="text-2xl font-bold">Reset your password</h1>
        {message && (
          <p role="status" className="my-5">
            {message}
          </p>
        )}
        {error && (
          <p role="alert" className="my-5 text-red-700">
            {error}
          </p>
        )}
        <form onSubmit={submit} className="mt-6 space-y-4">
          {recovery ? (
            <label className="block">
              New password
              <input
                autoComplete="new-password"
                type="password"
                minLength={8}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full border rounded-xl p-3 mt-1"
              />
            </label>
          ) : (
            <label className="block">
              Email
              <input
                autoComplete="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full border rounded-xl p-3 mt-1"
              />
            </label>
          )}
          <button
            disabled={busy}
            className="bg-blue-600 text-white rounded-xl px-5 py-3 disabled:opacity-50"
          >
            {busy
              ? "Please wait…"
              : recovery
                ? "Save new password"
                : "Send reset email"}
          </button>
        </form>
        <a
          href="/account"
          className="inline-block text-blue-700 underline mt-5"
        >
          Your account
        </a>
      </main>
      <Footer />
    </>
  );
}
