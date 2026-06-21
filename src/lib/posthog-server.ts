import { PostHog } from "posthog-node";

let instance: PostHog | null = null;

/**
 * Server-side PostHog client (singleton). Returns null when PostHog isn't
 * configured, so callers can no-op instead of crashing.
 */
export function getPostHogServer(): PostHog | null {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return null;

  if (!instance) {
    instance = new PostHog(key, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return instance;
}
