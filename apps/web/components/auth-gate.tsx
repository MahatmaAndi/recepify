'use client';

import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { Loader2, LogOut } from "lucide-react";
import { getSupabaseBrowserClient } from "@recepify/shared/lib/supabase-client";
import { SignInPanel } from "@/components/sign-in-panel";

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    let isMounted = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!isMounted) return;
        setSession(data.session ?? null);
        setIsLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [supabase]);

  if (!supabase) {
    return <MissingConfigMessage />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-white">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p className="text-sm text-white/70">Preparing your kitchen…</p>
      </div>
    );
  }

  if (!session) {
    return <SignInPanel supabase={supabase} />;
  }

  const userName =
    session.user.user_metadata?.full_name ??
    session.user.user_metadata?.name ??
    session.user.email ??
    "Cook";

  const handleSignOut = async () => {
    if (!supabase) return;
    setIsSigningOut(true);
    await supabase.auth.signOut();
    setIsSigningOut(false);
  };

  return (
    <div className="relative">
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-full border border-gray-200 bg-white/95 px-4 py-2 shadow-xl">
        <div className="text-xs text-gray-600">
          Signed in as <span className="font-semibold text-gray-900">{userName}</span>
        </div>
        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-60"
        >
          {isSigningOut ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Signing out…
            </>
          ) : (
            <>
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </>
          )}
        </button>
      </div>
      {children}
    </div>
  );
}

function MissingConfigMessage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-6">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-semibold">Connect Supabase Auth</h1>
        <p className="text-sm text-white/70">
          Set the <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> environment variables to
          enable Google, Apple, or email sign-in.
        </p>
        <p className="text-sm text-white/70">
          Once configured, restart the dev server and this screen will be replaced with the normal
          app experience.
        </p>
      </div>
    </div>
  );
}
