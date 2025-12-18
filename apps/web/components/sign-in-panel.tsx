'use client';

import { useMemo, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Loader2, Mail, ShieldCheck } from "lucide-react";
import { getSupabaseBrowserClient } from "@recepify/shared/lib/supabase-client";

interface SignInPanelProps {
  supabase?: SupabaseClient;
}

const oauthProviders = [
  {
    id: "google",
    label: "Continue with Google",
    className: "border border-gray-200 bg-white text-gray-900 hover:bg-gray-50",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
        <path
          d="M12.24 10.29v3.7h5.14c-.21 1.2-.92 2.21-1.96 2.88v2.39h3.17c1.85-1.71 2.91-4.23 2.91-7.22 0-.7-.07-1.38-.19-2.03h-9.07z"
          fill="#4285F4"
        />
        <path
          d="M12.24 18.86c-2.45 0-4.51-1.64-5.25-3.85H3.71v2.43c1.41 2.79 4.34 4.72 7.72 4.72 2.08 0 3.82-.69 5.09-1.87l-3.17-2.39c-.88.59-2 .96-3.11.96z"
          fill="#34A853"
        />
        <path
          d="M7 15.01a5.56 5.56 0 0 1 0-3.53V9.05H3.71a8.63 8.63 0 0 0-.93 3.98c0 1.41.33 2.75.93 3.97z"
          fill="#FBBC05"
        />
        <path
          d="M12.24 7.73c1.34 0 2.53.46 3.46 1.36l2.59-2.59C17.52 4.72 15.58 4 12.24 4 8.86 4 5.93 5.93 4.52 8.72l3.21 2.43c.75-2.21 2.8-3.42 4.51-3.42z"
          fill="#EA4335"
        />
      </svg>
    ),
  },
  {
    id: "apple",
    label: "Continue with Apple",
    className: "bg-black text-white hover:bg-black/90",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
        <path
          fill="currentColor"
          d="M16.365 1.43c0 1.14-.416 2.094-1.25 2.86-.833.76-1.843 1.148-3.03 1.148-.018-.09-.027-.212-.027-.37 0-1.09.417-2.027 1.25-2.8.848-.786 1.888-1.18 3.12-1.18-.02.12-.03.23-.03.34zm5.773 17.318c-.304.716-.664 1.37-1.08 1.96-.6.848-1.095 1.437-1.485 1.768-.59.544-1.223.82-1.898.82-.483 0-1.066-.138-1.75-.415-.686-.277-1.315-.415-1.89-.415-.6 0-1.25.138-1.95.415-.7.277-1.26.42-1.68.43-.64.028-1.286-.26-1.94-.867-.415-.36-.933-.983-1.557-1.867-.666-.953-1.214-2.058-1.646-3.315-.46-1.36-.69-2.68-.69-3.958 0-1.46.316-2.72.946-3.79.496-.85 1.158-1.52 1.987-2.01.83-.5 1.726-.76 2.69-.78.528 0 1.22.16 2.078.48.857.32 1.403.48 1.64.48.18 0 .794-.19 1.84-.57.987-.353 1.82-.5 2.5-.443 1.85.15 3.24.885 4.18 2.205-1.66 1.008-2.486 2.43-2.48 4.27.005 1.426.53 2.608 1.576 3.546.47.44.997.777 1.58 1.01-.126.365-.26.707-.402 1.026z"
        />
      </svg>
    ),
  },
];

export function SignInPanel({ supabase }: SignInPanelProps) {
  const client = useMemo(() => supabase ?? getSupabaseBrowserClient(), [supabase]);
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "pending" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  if (!client) {
    return <MissingClientMessage />;
  }

  const redirectTo =
    typeof window !== "undefined" ? `${window.location.origin}` : undefined;

  const handleOAuthSignIn = async (provider: "google" | "apple") => {
    setOauthLoading(provider);
    setError(null);
    const { error } = await client.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
      },
    });
    if (error) {
      setError(error.message);
      setOauthLoading(null);
    }
  };

  const handleEmailSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setEmailStatus("pending");
    setMessage(null);
    setError(null);

    const { error } = await client.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: redirectTo,
      },
    });
    if (error) {
      setEmailStatus("error");
      setError(error.message);
    } else {
      setEmailStatus("sent");
      setMessage("Check your inbox for the secure login link.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-orange-900 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white/95 p-8 shadow-2xl space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-gray-400">Recipefy</p>
          <h1 className="text-2xl font-semibold text-gray-900">Sign in to save your book</h1>
          <p className="text-sm text-gray-600">
            Use Google, Apple, or request a secure link via email.
          </p>
        </div>

        <div className="space-y-3">
          {oauthProviders.map((provider) => (
            <button
              key={provider.id}
              onClick={() => handleOAuthSignIn(provider.id as "google" | "apple")}
              disabled={oauthLoading !== null && oauthLoading !== provider.id}
              className={`flex w-full items-center justify-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${provider.className} disabled:opacity-60`}
            >
              {oauthLoading === provider.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                provider.icon
              )}
              {provider.label}
            </button>
          ))}
        </div>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-dashed border-gray-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs uppercase tracking-[0.3em] text-gray-400">
              OR EMAIL
            </span>
          </div>
        </div>

        <form onSubmit={handleEmailSignIn} className="space-y-3">
          <div className="space-y-1">
            <label htmlFor="email" className="text-xs font-medium text-gray-600">
              Email address
            </label>
            <div className="flex items-center gap-2 rounded-2xl border border-gray-200 px-3 py-2.5 focus-within:border-gray-900">
              <Mail className="h-4 w-4 text-gray-400" />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={emailStatus === "pending"}
            className="w-full rounded-2xl bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
          >
            {emailStatus === "pending" ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending magic link…
              </span>
            ) : (
              "Send me a login link"
            )}
          </button>
        </form>

        {message && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            {message}
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="flex items-center gap-2 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs text-gray-600">
          <ShieldCheck className="h-4 w-4 text-gray-400" />
          <span>
            We use Supabase Auth. Configure Google, Apple, and email providers in your Supabase
            project settings to enable these buttons.
          </span>
        </div>
      </div>
    </div>
  );
}

function MissingClientMessage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-6 text-center text-white">
      <p className="text-sm text-white/70">
        Supabase is not initialized. Double-check your environment variables and refresh.
      </p>
    </div>
  );
}
