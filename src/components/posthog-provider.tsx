"use client";

import { Suspense, useEffect, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

/**
 * Initializes PostHog product analytics on the client. If no key is configured
 * the provider is a no-op pass-through, so the app runs fine without PostHog.
 */
export function PostHogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (!POSTHOG_KEY || typeof window === "undefined") return;
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      capture_pageview: false, // captured manually for App Router navigations
      capture_pageleave: true,
      person_profiles: "identified_only",
    });
  }, []);

  if (!POSTHOG_KEY) return <>{children}</>;

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  );
}

/** Tracks SPA route changes as PostHog pageviews. */
function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ph = usePostHog();

  useEffect(() => {
    if (!pathname || !ph) return;
    let url = window.origin + pathname;
    const qs = searchParams?.toString();
    if (qs) url += `?${qs}`;
    ph.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams, ph]);

  return null;
}
