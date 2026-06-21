import * as Sentry from "@sentry/nextjs";
import type { Instrumentation } from "next";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

// Capture server-side request errors in both Sentry and PostHog.
export const onRequestError: Instrumentation.onRequestError = async (
  err,
  request,
  context,
) => {
  Sentry.captureRequestError(err, request, context);

  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { getPostHogServer } = await import("./lib/posthog-server");
    const posthog = getPostHogServer();
    if (posthog) {
      let distinctId: string | undefined;
      const cookie = request.headers.cookie;
      if (cookie) {
        const cookieString = Array.isArray(cookie) ? cookie.join("; ") : cookie;
        const match = cookieString.match(/ph_phc_.*?_posthog=([^;]+)/);
        if (match?.[1]) {
          try {
            const data = JSON.parse(decodeURIComponent(match[1]));
            distinctId = data.distinct_id;
          } catch {
            // ignore malformed PostHog cookie
          }
        }
      }
      posthog.captureException(err, distinctId);
    }
  }
};
