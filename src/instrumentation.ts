import type { Instrumentation } from "next";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Ship server-side logs to PostHog (node-only; not edge-safe).
    const { loggerProvider } = await import("./lib/otel-logger");
    if (loggerProvider) {
      const { logs } = await import("@opentelemetry/api-logs");
      logs.setGlobalLoggerProvider(loggerProvider);
    }
  }
}

// Capture server-side request errors in PostHog.
export const onRequestError: Instrumentation.onRequestError = async (
  err,
  request,
) => {
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
