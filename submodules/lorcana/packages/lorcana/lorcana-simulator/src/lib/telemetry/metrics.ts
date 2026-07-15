import { metrics, type Attributes, type Histogram } from "@opentelemetry/api";
import { normalizePathForTelemetry } from "./config.js";
import type { WebVitalParams } from "$lib/analytics/types.js";

type WebVitalName = WebVitalParams["name"];

let durationHistogram: Histogram | null = null;
let clsHistogram: Histogram | null = null;

export function resetWebVitalMetricHistogramsForTest(): void {
  durationHistogram = null;
  clsHistogram = null;
}

function routeAttribute(): string {
  if (typeof window === "undefined") return "server";
  return normalizePathForTelemetry(window.location.pathname);
}

function webVitalAttributes(name: WebVitalName, rating: WebVitalParams["rating"]): Attributes {
  return {
    "web_vital.name": name,
    "web_vital.rating": rating,
    route: routeAttribute(),
  };
}

export function recordWebVitalMetric(
  name: WebVitalName,
  value: number,
  rating: WebVitalParams["rating"],
): void {
  const meter = metrics.getMeter("lorcana-simulator-browser");
  const attributes = webVitalAttributes(name, rating);

  if (name === "CLS") {
    clsHistogram ??= meter.createHistogram("browser.web_vital.cls", {
      description: "Cumulative Layout Shift",
      unit: "1",
    });
    clsHistogram.record(value, attributes);
    return;
  }

  durationHistogram ??= meter.createHistogram("browser.web_vital.duration", {
    description: "Core Web Vital duration",
    unit: "ms",
  });
  durationHistogram.record(value, attributes);
}
