import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";

type MetricName = "CLS" | "FCP" | "INP" | "LCP" | "TTFB";
type Rating = "good" | "needs-improvement" | "poor";
type Metric = { name: MetricName; value: number; rating: Rating };
type Reporter = (metric: Metric) => void;

const reporters = new Map<MetricName, Reporter>();
const trackEvent = mock(() => {});
const recordWebVitalMetric = mock((_name: MetricName, _value: number, _rating: Rating) => {});

function registerReporter(name: MetricName, reporter: Reporter): void {
  reporters.set(name, reporter);
}

mock.module("web-vitals", () => ({
  onCLS: (reporter: Reporter) => registerReporter("CLS", reporter),
  onFCP: (reporter: Reporter) => registerReporter("FCP", reporter),
  onINP: (reporter: Reporter) => registerReporter("INP", reporter),
  onLCP: (reporter: Reporter) => registerReporter("LCP", reporter),
  onTTFB: (reporter: Reporter) => registerReporter("TTFB", reporter),
}));

mock.module("./analytics.js", () => ({
  ANALYTICS_TEXT_MAX_LENGTH: 100,
  analyticsErrorFields: (error: unknown) => {
    const code = error instanceof Error ? error.name : undefined;
    const rawMessage =
      error instanceof Error ? error.message : typeof error === "string" ? error : undefined;
    const message =
      typeof rawMessage === "string" && rawMessage.length > 0
        ? rawMessage.slice(0, 100)
        : undefined;
    return {
      ...(code ? { error_code: code } : {}),
      ...(message ? { error_message: message } : {}),
    };
  },
  initAnalytics: () => {},
  isAnalyticsConfigured: () => false,
  normalizePathForAnalytics: (path: string) => path,
  setUserProperties: () => {},
  trackEvent,
  trackException: () => {},
  trackPageView: () => {},
  truncateForAnalytics: (input: unknown) => {
    if (input == null) return undefined;
    const text = String(input);
    return text.length === 0 ? undefined : text.slice(0, 100);
  },
  updateConsent: () => {},
}));

mock.module("$lib/telemetry/metrics.js", () => ({
  recordWebVitalMetric,
}));

const originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");

function installTestWindow(): void {
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {},
  });
}

function restoreWindow(): void {
  if (originalWindowDescriptor) {
    Object.defineProperty(globalThis, "window", originalWindowDescriptor);
    return;
  }
  Reflect.deleteProperty(globalThis, "window");
}

const { resetVitalsReportingForTest, startVitalsReporting } = await import("./vitals.js");

describe("startVitalsReporting", () => {
  beforeEach(() => {
    installTestWindow();
    reporters.clear();
    trackEvent.mockClear();
    recordWebVitalMetric.mockClear();
    resetVitalsReportingForTest();
  });

  afterEach(() => {
    restoreWindow();
  });

  it("registers web-vitals reporters and preserves GA4 emission", () => {
    startVitalsReporting();

    expect([...reporters.keys()].sort()).toEqual(["CLS", "FCP", "INP", "LCP", "TTFB"]);
    reporters.get("LCP")?.({ name: "LCP", value: 2500.4, rating: "good" });
    reporters.get("CLS")?.({ name: "CLS", value: 0.12345, rating: "needs-improvement" });

    expect(trackEvent).toHaveBeenCalledWith("web_vital", {
      name: "LCP",
      value: 2500,
      rating: "good",
    });
    expect(trackEvent).toHaveBeenCalledWith("web_vital", {
      name: "CLS",
      value: 0.1235,
      rating: "needs-improvement",
    });
    expect(recordWebVitalMetric).toHaveBeenCalledWith("LCP", 2500, "good");
    expect(recordWebVitalMetric).toHaveBeenCalledWith("CLS", 0.1235, "needs-improvement");
  });

  it("keeps GA4 reporting when OTLP metric recording throws", () => {
    startVitalsReporting();
    recordWebVitalMetric.mockImplementationOnce(() => {
      throw new Error("meter failed");
    });

    reporters.get("FCP")?.({ name: "FCP", value: 1200.2, rating: "good" });

    expect(trackEvent).toHaveBeenCalledWith("web_vital", {
      name: "FCP",
      value: 1200,
      rating: "good",
    });
  });
});
