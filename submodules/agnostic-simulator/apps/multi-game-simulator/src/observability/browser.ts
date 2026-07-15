import { SpanStatusCode } from "@opentelemetry/api";
import { logs, SeverityNumber, type AnyValueMap } from "@opentelemetry/api-logs";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { DocumentLoadInstrumentation } from "@opentelemetry/instrumentation-document-load";
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch";
import { UserInteractionInstrumentation } from "@opentelemetry/instrumentation-user-interaction";
import { XMLHttpRequestInstrumentation } from "@opentelemetry/instrumentation-xml-http-request";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs";
import { BatchSpanProcessor, TraceIdRatioBasedSampler } from "@opentelemetry/sdk-trace-base";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from "web-vitals";

import {
  buildOtlpIgnoreUrls,
  buildPropagationTargets,
  buildResourceAttributes,
  normalizeRoute,
  parseTraceSampleRatio,
  sanitizeTelemetryValue,
  stringifyTelemetryValue,
  TelemetryEventGate,
} from "./browser-core";

const DEFAULT_SERVICE_NAME = "tcg-multi-game-simulator";
const errorGate = new TelemetryEventGate(10, 60_000, 60_000);
const warningGate = new TelemetryEventGate(10, 60_000, 60_000);
const KNOWN_GAMES = new Set(["cyberpunk", "gundam", "one-piece"]);

let initialized = false;
let flushing = false;
let loggerProvider: LoggerProvider | undefined;
let tracerProvider: WebTracerProvider | undefined;

function readEnv(name: string): string {
  const value = (import.meta.env as Record<string, string | undefined>)[name];
  return typeof value === "string" ? value.trim() : "";
}

function normalizeEndpoint(endpoint: string): string {
  return endpoint.replace(/\/+$/, "");
}

function currentGame(): string {
  const segment = window.location.pathname.split("/").filter(Boolean)[0];
  return segment && KNOWN_GAMES.has(segment) ? segment : "unknown";
}

function sanitizeAttributes(attributes: AnyValueMap): AnyValueMap {
  return sanitizeTelemetryValue(attributes) as AnyValueMap;
}

function baseAttributes(extra: AnyValueMap = {}): AnyValueMap {
  return {
    "app.route": normalizeRoute(window.location.pathname),
    "simulator.game": currentGame(),
    ...sanitizeAttributes(extra),
  };
}

function eventFingerprint(body: string, attributes: AnyValueMap): string {
  return [
    attributes["exception.message"] ?? attributes["log.message"] ?? body,
    attributes["exception.type"] ?? "",
  ]
    .map(stringifyTelemetryValue)
    .join("|");
}

export function logBrowserWarn(body: string, attributes: AnyValueMap = {}): void {
  if (!warningGate.accept(eventFingerprint(body, attributes))) return;
  logs.getLogger("browser").emit({
    body,
    severityNumber: SeverityNumber.WARN,
    severityText: "WARN",
    attributes: baseAttributes(attributes),
  });
}

export function logBrowserError(body: string, attributes: AnyValueMap = {}): void {
  if (!errorGate.accept(eventFingerprint(body, attributes))) return;
  logs.getLogger("browser").emit({
    body,
    severityNumber: SeverityNumber.ERROR,
    severityText: "ERROR",
    attributes: baseAttributes(attributes),
  });
}

function configuredPropagationTargets(): RegExp[] {
  const explicit = readEnv("VITE_OTEL_PROPAGATE_TRACE_URLS")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return buildPropagationTargets(explicit, window.location.origin);
}

function registerGlobalErrorHandlers(): void {
  window.addEventListener("error", (event) => {
    logBrowserError("window.error", {
      "exception.type": event.error?.name ?? "Error",
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason = sanitizeTelemetryValue(event.reason) as { name?: string } | string;
    logBrowserError("unhandledrejection", {
      "exception.type":
        typeof reason === "string" ? "UnhandledRejection" : (reason.name ?? "UnhandledRejection"),
    });
  });
}

function registerWebVitals(): void {
  if (readEnv("VITE_OTEL_WEB_VITALS_ENABLED") === "false") return;

  const emitMetric = (metric: Metric) => {
    if (
      metric.rating === "good" &&
      Math.random() >= parseTraceSampleRatio(readEnv("VITE_OTEL_WEB_VITALS_SAMPLE_RATIO"), 0.05)
    ) {
      return;
    }

    logs.getLogger("browser.web-vitals").emit({
      body: `web_vital.${metric.name}`,
      severityNumber: SeverityNumber.INFO,
      severityText: "INFO",
      attributes: baseAttributes({
        "web_vital.name": metric.name,
        "web_vital.value": metric.value,
        "web_vital.rating": metric.rating,
        "web_vital.navigation_type": metric.navigationType,
      }),
    });
  };

  onCLS(emitMetric);
  onFCP(emitMetric);
  onINP(emitMetric);
  onLCP(emitMetric);
  onTTFB(emitMetric);
}

function flushTelemetry(): void {
  if (flushing) return;
  flushing = true;
  void Promise.allSettled([
    loggerProvider?.forceFlush() ?? Promise.resolve(),
    tracerProvider?.forceFlush() ?? Promise.resolve(),
  ]).finally(() => {
    flushing = false;
  });
}

function registerFlushHandlers(): void {
  window.addEventListener("pagehide", flushTelemetry);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushTelemetry();
  });
}

export function initBrowserObservability(): void {
  if (initialized || typeof window === "undefined") return;

  const endpoint = readEnv("VITE_OTEL_EXPORTER_OTLP_ENDPOINT");
  if (!endpoint) return;

  initialized = true;
  const otlpEndpoint = normalizeEndpoint(endpoint);
  const resource = resourceFromAttributes(
    buildResourceAttributes({
      serviceName: readEnv("VITE_OTEL_SERVICE_NAME") || DEFAULT_SERVICE_NAME,
      serviceVersion: readEnv("VITE_OTEL_SERVICE_VERSION"),
      deploymentEnvironment: readEnv("VITE_OTEL_DEPLOYMENT_ENVIRONMENT") || import.meta.env.MODE,
    }),
  );

  const logExporter = new OTLPLogExporter({ url: `${otlpEndpoint}/v1/logs` });
  loggerProvider = new LoggerProvider({
    resource,
    processors: [new BatchLogRecordProcessor({ exporter: logExporter })],
  });
  logs.setGlobalLoggerProvider(loggerProvider);

  tracerProvider = new WebTracerProvider({
    resource,
    sampler: new TraceIdRatioBasedSampler(
      parseTraceSampleRatio(readEnv("VITE_OTEL_TRACE_SAMPLE_RATIO")),
    ),
    spanProcessors: [
      new BatchSpanProcessor(
        new OTLPTraceExporter({
          url: `${otlpEndpoint}/v1/traces`,
        }),
      ),
    ],
  });
  tracerProvider.register({ contextManager: new ZoneContextManager() });

  const propagateTraceHeaderCorsUrls = configuredPropagationTargets();
  const ignoreUrls = buildOtlpIgnoreUrls(otlpEndpoint);
  registerInstrumentations({
    instrumentations: [
      new DocumentLoadInstrumentation(),
      new FetchInstrumentation({
        propagateTraceHeaderCorsUrls,
        ignoreUrls,
        applyCustomAttributesOnSpan(span, _request, result) {
          if (result.status !== undefined && result.status >= 400) {
            span.setStatus({ code: SpanStatusCode.ERROR, message: `HTTP ${result.status}` });
          }
        },
      }),
      new XMLHttpRequestInstrumentation({
        propagateTraceHeaderCorsUrls,
        ignoreUrls,
        applyCustomAttributesOnSpan(span, xhr) {
          if (xhr.status >= 400) {
            span.setStatus({ code: SpanStatusCode.ERROR, message: `HTTP ${xhr.status}` });
          }
        },
      }),
      new UserInteractionInstrumentation({ eventNames: ["click", "submit"] }),
    ],
  });

  registerGlobalErrorHandlers();
  registerWebVitals();
  registerFlushHandlers();
}
