import type { HandleClientError } from "@sveltejs/kit";
import { normalizePathForAnalytics, trackException } from "$lib/analytics/analytics.js";
import { startBrowserTelemetry } from "$lib/telemetry/browser.js";
import { installGlobalBrowserLogHandlers, logError } from "$lib/telemetry/logs.js";

startBrowserTelemetry();
installGlobalBrowserLogHandlers();

/**
 * Global SvelteKit client-side error hook. Reports uncaught render and
 * navigation errors to GA4 as `app_exception` with fatal=true.
 *
 * SvelteKit invokes this for errors thrown in load functions, components, and
 * unhandled promises during navigation. We send a route-prefixed error message
 * to analytics, derived from `error.message` when available or `String(error)`
 * otherwise (no stack traces or extra metadata are forwarded), and return
 * SvelteKit's sanitized `message` to the UI so internal/backend error text is
 * never rendered to the end user.
 */
export const handleError: HandleClientError = ({ error, event, status, message }) => {
  const analyticsMessage =
    error instanceof Error ? error.message : String(error ?? message ?? "unknown error");
  // Prefer `route.id` (parameterized like `/match/[gameId]`); fall back to the
  // pathname only when route resolution failed, and normalize UUIDs so we don't
  // reintroduce the high-cardinality identifiers `trackPageView` strips.
  const routeLabel = event.route.id ?? normalizePathForAnalytics(event.url.pathname);
  trackException({
    source: "sveltekit_client",
    code: status ? `http_${status}` : "uncaught",
    message: `${routeLabel}: ${analyticsMessage}`,
    fatal: true,
  });
  logError(
    "sveltekit_client_error",
    {
      source: "sveltekit_client",
      route: routeLabel,
      code: status ? `http_${status}` : "uncaught",
      fatal: true,
    },
    error instanceof Error ? error : undefined,
  );
  return { message };
};
