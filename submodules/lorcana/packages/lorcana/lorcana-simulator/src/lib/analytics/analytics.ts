/**
 * Public analytics API for the Lorcana Simulator.
 *
 * Provides type-safe event tracking, page view tracking, and user property management.
 * All functions are SSR-safe and silently no-op when GA4 is not configured.
 */

import { loadGtag, gtagEvent, gtagSet, gtagConsent, isAnalyticsConfigured } from "./gtag.js";

export { isAnalyticsConfigured };
import { analyticsConsent } from "./analytics-consent.svelte.js";
import type { AnalyticsEventMap, AnalyticsEventName, AnalyticsUserProperties } from "./types.js";

const UUID_PATTERN = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
const EXCLUDED_PATH_PREFIXES = ["/tests/", "/health"];

/**
 * Replace UUID segments with `[id]` so analytics dimensions stay low-cardinality
 * and don't leak raw match/game/user identifiers. Use anywhere a route path
 * flows into a GA4 event payload.
 */
export function normalizePathForAnalytics(path: string): string {
  return path.replace(UUID_PATTERN, "[id]");
}

let scriptLoaded = false;
let consentExplicitlyConfigured = false;

/**
 * Ensure analytics is initialized when an event fires before the layout's
 * onMount has run (e.g. an early client error reaching hooks.client.ts).
 *
 * Fail-closed: if no caller has yet supplied an explicit `gdprStrict` from the
 * server, we initialize in strict mode so EU/unknown-jurisdiction visitors
 * never have events emitted before consent is established. The later explicit
 * `initAnalytics({ gdprStrict })` call from the layout will overwrite the
 * consent state with the real server-derived value.
 */
function ensureInitialized(): void {
  if (typeof window === "undefined") return;
  if (scriptLoaded) return;
  initAnalytics({ gdprStrict: true });
}

/**
 * Initialize GA4 analytics. Call once from root layout onMount with the
 * server-derived `gdprStrict` flag (from `cf-ipcountry`).
 *
 * Idempotent in two senses:
 *   1. The gtag script is loaded at most once (`loadGtag` guards itself).
 *   2. Consent is always (re)configured. This lets an explicit call upgrade
 *      a prior fail-closed auto-init: if an early error triggered ensureInitialized
 *      with strict mode, this call will switch a non-EU visitor back to the
 *      permissive default once the server data is available.
 *
 * `gdprStrict` defaults to `true` when omitted (fail-closed).
 */
export function initAnalytics(options: { gdprStrict?: boolean } = {}): void {
  const gdprStrict = options.gdprStrict ?? true;
  const isExplicit = options.gdprStrict !== undefined;
  if (import.meta.env.DEV) {
    console.log("[analytics] initAnalytics", { gdprStrict, isExplicit });
  }

  // Once an explicit (server-driven) call has configured consent, ignore
  // subsequent fail-closed auto-inits — they'd overwrite a real decision.
  if (consentExplicitlyConfigured && !isExplicit) {
    return;
  }

  analyticsConsent.initialize({ gdprStrict });
  if (isExplicit) {
    consentExplicitlyConfigured = true;
  }
  if (import.meta.env.DEV) {
    console.log("[analytics] consent state →", analyticsConsent.consentGranted);
  }

  // Only load the gtag script after explicit grant. Even with consent="denied"
  // set as a default, fetching googletagmanager.com/gtag/js boots the GA
  // runtime and can ping Google before the user has opted in — that defeats
  // the explicit opt-in posture for GDPR-strict visitors.
  maybeLoadGtag();
}

/** Load the gtag script if (and only if) consent is explicitly granted. */
function maybeLoadGtag(): void {
  if (scriptLoaded) {
    // Already loaded — just propagate the current consent state.
    if (analyticsConsent.consentGranted !== null) {
      gtagConsent(analyticsConsent.consentGranted);
    }
    return;
  }
  if (analyticsConsent.consentGranted !== true) return;
  scriptLoaded = true;
  loadGtag();
  gtagConsent(true);
}

/**
 * Track a page view with normalized path.
 * Strips locale prefixes and replaces UUIDs with [id].
 */
export function trackPageView(url: string, deLocalizeUrl?: (url: URL) => URL): void {
  if (import.meta.env.DEV) {
    console.log("[analytics] trackPageView →", url);
  }
  ensureInitialized();
  let path: string;

  if (deLocalizeUrl) {
    try {
      const fullUrl = new URL(url, "http://localhost");
      path = deLocalizeUrl(fullUrl).pathname;
    } catch {
      path = url;
    }
  } else {
    path = url;
  }

  // Replace UUID segments with [id] for cleaner GA4 grouping
  path = normalizePathForAnalytics(path);

  // Skip excluded routes
  if (EXCLUDED_PATH_PREFIXES.some((prefix) => path.startsWith(prefix))) {
    return;
  }

  gtagEvent("page_view", {
    page_path: path,
    page_location: typeof window !== "undefined" ? window.location.origin + path : undefined,
  });
}

/**
 * Track a typed custom event.
 */
export function trackEvent<K extends AnalyticsEventName>(
  name: K,
  ...args: Record<string, never> extends AnalyticsEventMap[K]
    ? [params?: AnalyticsEventMap[K]]
    : [params: AnalyticsEventMap[K]]
): void {
  if (import.meta.env.DEV) {
    console.log("[analytics] trackEvent →", name, args[0] ?? {});
  }
  ensureInitialized();
  const params = args[0] ?? {};
  gtagEvent(name, params as Record<string, unknown>);
}

/**
 * Set GA4 user properties.
 */
export function setUserProperties(props: Partial<AnalyticsUserProperties>): void {
  gtagSet(props);
}

/** Maximum allowed length for free-text fields in event params (GA4 hard limit is 100). */
export const ANALYTICS_TEXT_MAX_LENGTH = 100;

/**
 * Truncate a string to ANALYTICS_TEXT_MAX_LENGTH characters.
 * Use for any error_message-style param to prevent leaking long PII strings
 * (e.g., raw API responses, stack traces) into GA4.
 */
export function truncateForAnalytics(input: unknown): string | undefined {
  if (input == null) return undefined;
  const text = String(input);
  if (text.length === 0) return undefined;
  return text.length > ANALYTICS_TEXT_MAX_LENGTH ? text.slice(0, ANALYTICS_TEXT_MAX_LENGTH) : text;
}

/**
 * Extract `error_code` and `error_message` from an unknown error in the shape
 * GA4 event payloads expect. Truncates the message to ANALYTICS_TEXT_MAX_LENGTH
 * to keep the payload safe and bounded.
 *
 * Designed to be spread into a `trackEvent` params object:
 * ```ts
 * trackEvent("queue_join_error", { error: "api_error", ...analyticsErrorFields(err) });
 * ```
 */
export function analyticsErrorFields(error: unknown): {
  error_code?: string;
  error_message?: string;
} {
  const code = error instanceof Error ? error.name : undefined;
  const message = truncateForAnalytics(error instanceof Error ? error.message : error);
  return {
    ...(code ? { error_code: code } : {}),
    ...(message ? { error_message: message } : {}),
  };
}

/**
 * Track an exception. Thin wrapper over `trackEvent("app_exception", ...)`
 * that handles message truncation and code fallback.
 */
export function trackException(args: {
  source: string;
  code?: string;
  message?: unknown;
  fatal?: boolean;
}): void {
  const message = truncateForAnalytics(args.message);
  trackEvent("app_exception", {
    source: args.source,
    code: args.code ?? "unknown",
    ...(message ? { message } : {}),
    fatal: args.fatal ? "true" : "false",
  });
}

/**
 * Update analytics consent and notify gtag.
 *
 * If consent is being granted for the first time and the gtag script hasn't
 * been loaded yet (deferred because the visitor was in GDPR-strict mode and
 * had not yet opted in), load it now. Subsequent grant/deny toggles only
 * propagate the consent state — the script is only loaded once.
 */
export function updateConsent(granted: boolean): void {
  if (granted) {
    analyticsConsent.grant();
  } else {
    analyticsConsent.deny();
  }
  maybeLoadGtag();
  if (scriptLoaded) {
    gtagConsent(granted);
  }
}
