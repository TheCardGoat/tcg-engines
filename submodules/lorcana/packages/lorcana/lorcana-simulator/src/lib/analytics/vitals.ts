import { onCLS, onFCP, onINP, onLCP, onTTFB, type MetricType } from "web-vitals";
import { recordWebVitalMetric } from "$lib/telemetry/metrics.js";
import { trackEvent } from "./analytics.js";
import type { WebVitalParams } from "./types.js";

type VitalName = WebVitalParams["name"];

function report(metric: MetricType): void {
  const name = metric.name as VitalName;
  // Keep CLS on its standard unitless scale (e.g. 0.12) so it stays comparable
  // to Core Web Vitals reports elsewhere. Other vitals are ms — round to int.
  const reportedValue =
    name === "CLS" ? Math.round(metric.value * 10000) / 10000 : Math.round(metric.value);
  try {
    recordWebVitalMetric(name, reportedValue, metric.rating);
  } catch {
    // Preserve GA4 reporting even if an OTLP meter/exporter misconfiguration throws.
  }
  trackEvent("web_vital", {
    name,
    value: reportedValue,
    rating: metric.rating,
  });
}

let started = false;

export function resetVitalsReportingForTest(): void {
  started = false;
}

/**
 * Start observing Web Vitals. Safe to call multiple times — idempotent.
 * Must be called from the browser only (no-op on SSR).
 */
export function startVitalsReporting(): void {
  if (started || typeof window === "undefined") return;
  started = true;

  onLCP(report);
  onINP(report);
  onCLS(report);
  onFCP(report);
  onTTFB(report);
}
