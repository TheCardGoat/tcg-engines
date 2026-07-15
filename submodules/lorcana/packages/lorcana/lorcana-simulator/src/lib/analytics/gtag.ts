/**
 * Low-level Google Analytics 4 (gtag.js) wrapper.
 *
 * Handles script injection, consent mode, and raw gtag calls.
 * All functions are SSR-safe and become no-ops when the measurement ID is unset.
 */

import { env } from "$env/dynamic/public";

type ConsentArg = "granted" | "denied";

let loaded = false;

function getMeasurementId(): string | undefined {
  const id = env.PUBLIC_GA4_MEASUREMENT_ID || undefined;
  if (import.meta.env.DEV) {
    console.log("[gtag] getMeasurementId →", id ?? "(unset)");
  }
  return id;
}

/** True when a GA4 measurement ID is configured for this build. */
export function isAnalyticsConfigured(): boolean {
  return Boolean(getMeasurementId());
}

// biome-ignore lint/style/noArguments: GA4 requires the native Arguments object in dataLayer — plain arrays break consent mode and event dispatch
function gtag(..._args: unknown[]): void {
  if (typeof window === "undefined") return;
  // biome-ignore lint/suspicious/noExplicitAny: required by gtag protocol
  (window as any).dataLayer = (window as any).dataLayer || [];
  // biome-ignore lint/style/noArguments: must push Arguments, not a spread array
  // biome-ignore lint/suspicious/noExplicitAny: required by gtag protocol
  (window as any).dataLayer.push(arguments);
}

/**
 * Inject the gtag.js script and initialize with default consent denied.
 * Safe to call multiple times — only loads once.
 */
export function loadGtag(): void {
  if (typeof window === "undefined") {
    console.log("[gtag] loadGtag skipped: SSR");
    return;
  }
  const measurementId = getMeasurementId();
  if (!measurementId) {
    if (import.meta.env.DEV) {
      console.log("[gtag] loadGtag skipped: no measurement ID configured");
    }
    return;
  }
  if (loaded) {
    console.log("[gtag] loadGtag skipped: already loaded");
    return;
  }
  loaded = true;
  console.log("[gtag] loadGtag: injecting script for", measurementId);

  // Set default consent before loading the script
  gtag("consent", "default", {
    analytics_storage: "denied" as ConsentArg,
    ad_storage: "denied" as ConsentArg,
    ad_user_data: "denied" as ConsentArg,
    ad_personalization: "denied" as ConsentArg,
  });

  // Inject script tag
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.onload = () => console.log("[gtag] script loaded successfully");
  script.onerror = (e) => {
    console.error("[gtag] script failed to load", e);
    // Best-effort: dataLayer may exist even if the script never loads — push a
    // diagnostic event so a downstream tag manager / debug harness can see it.
    gtag("event", "app_exception", {
      source: "gtag_script",
      code: "script_load_failed",
      fatal: "false",
    });
  };
  document.head.appendChild(script);

  // Initialize gtag
  gtag("js", new Date());
  // Privacy: anonymize IP, disable Google Signals & ad personalization for EU/GDPR.
  gtag("config", measurementId, {
    send_page_view: false,
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  console.log("[gtag] loadGtag: initialization complete");
}

/** Update consent state. */
export function gtagConsent(analyticsGranted: boolean): void {
  if (typeof window === "undefined") return;
  if (!getMeasurementId()) return;

  if (import.meta.env.DEV) {
    console.log("[gtag] consent update →", analyticsGranted ? "granted" : "denied");
  }
  gtag("consent", "update", {
    analytics_storage: (analyticsGranted ? "granted" : "denied") as ConsentArg,
  });
}

/** Send a custom event. */
export function gtagEvent(eventName: string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  if (!getMeasurementId()) return;

  if (import.meta.env.DEV) {
    console.log("[gtag] event →", eventName, params);
  }
  gtag("event", eventName, params);
}

/** Set user properties. */
export function gtagSet(properties: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  if (!getMeasurementId()) return;

  gtag("set", "user_properties", properties);
}
