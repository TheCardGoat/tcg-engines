import { env } from "$env/dynamic/public";
import type { Span } from "@opentelemetry/api";
import { metrics } from "@opentelemetry/api";
import { logs } from "@opentelemetry/api-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { DocumentLoadInstrumentation } from "@opentelemetry/instrumentation-document-load";
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch";
import { UserInteractionInstrumentation } from "@opentelemetry/instrumentation-user-interaction";
import { XMLHttpRequestInstrumentation } from "@opentelemetry/instrumentation-xml-http-request";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { LoggerProvider, BatchLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { MeterProvider, PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import {
  normalizePathForTelemetry,
  resolveBrowserTelemetryConfig,
  type BrowserTelemetryEnv,
} from "./config.js";

let started = false;
let initializationStarted = false;

function sanitizedUrlForSpan(rawUrl: string): string | undefined {
  try {
    const url = new URL(rawUrl, window.location.origin);
    return `${url.origin}${normalizePathForTelemetry(url.pathname)}`;
  } catch {
    return undefined;
  }
}

function fetchResultUrl(
  result: Response | { status?: number; message: string },
): string | undefined {
  return result instanceof Response ? result.url : undefined;
}

function fetchRequestUrl(request: Request | RequestInit): string | undefined {
  return request instanceof Request ? request.url : undefined;
}

function redactHttpSpanUrl(span: Span, rawUrl: string | undefined): void {
  if (!rawUrl) return;
  const safeUrl = sanitizedUrlForSpan(rawUrl);
  if (!safeUrl) return;
  const safePath = normalizePathForTelemetry(safeUrl);
  span.setAttribute("url.full", safeUrl);
  span.setAttribute("http.url", safeUrl);
  span.setAttribute("url.path", safePath);
  span.updateName(`HTTP ${safePath}`);
}

export function startBrowserTelemetry(): void {
  if (started || initializationStarted || typeof window === "undefined") return;
  initializationStarted = true;

  const telemetryEnv: BrowserTelemetryEnv = {
    PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT: env.PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT,
    PUBLIC_OTEL_EXPORTER_OTLP_TRACES_ENDPOINT: env.PUBLIC_OTEL_EXPORTER_OTLP_TRACES_ENDPOINT,
    PUBLIC_OTEL_EXPORTER_OTLP_LOGS_ENDPOINT: env.PUBLIC_OTEL_EXPORTER_OTLP_LOGS_ENDPOINT,
    PUBLIC_OTEL_EXPORTER_OTLP_METRICS_ENDPOINT: env.PUBLIC_OTEL_EXPORTER_OTLP_METRICS_ENDPOINT,
    PUBLIC_OTEL_SERVICE_NAME: env.PUBLIC_OTEL_SERVICE_NAME,
    PUBLIC_OTEL_DEPLOYMENT_ENVIRONMENT: env.PUBLIC_OTEL_DEPLOYMENT_ENVIRONMENT,
    PUBLIC_SIGNOZ_INGESTION_KEY: env.PUBLIC_SIGNOZ_INGESTION_KEY,
    PUBLIC_OTEL_PROPAGATE_TRACE_URLS: env.PUBLIC_OTEL_PROPAGATE_TRACE_URLS,
    PUBLIC_OTEL_IGNORE_URLS: env.PUBLIC_OTEL_IGNORE_URLS,
  };
  const config = resolveBrowserTelemetryConfig(telemetryEnv);
  if (!config.enabled) {
    started = true;
    return;
  }

  started = true;

  const resource = resourceFromAttributes(config.resourceAttributes);

  if (config.endpoints.traces) {
    const exporter = new OTLPTraceExporter({
      url: config.endpoints.traces,
      headers: config.headers,
    });

    const provider = new WebTracerProvider({
      resource,
      spanProcessors: [new BatchSpanProcessor(exporter)],
    });

    provider.register({
      contextManager: new ZoneContextManager(),
    });

    registerInstrumentations({
      instrumentations: [
        new DocumentLoadInstrumentation(),
        new FetchInstrumentation({
          clearTimingResources: true,
          ignoreUrls: config.ignoreUrls,
          propagateTraceHeaderCorsUrls: config.propagateTraceHeaderCorsUrls,
          applyCustomAttributesOnSpan: (span, request, result) => {
            redactHttpSpanUrl(span, fetchResultUrl(result) ?? fetchRequestUrl(request));
          },
        }),
        new XMLHttpRequestInstrumentation({
          ignoreUrls: config.ignoreUrls,
          propagateTraceHeaderCorsUrls: config.propagateTraceHeaderCorsUrls,
          applyCustomAttributesOnSpan: (span, xhr) => {
            redactHttpSpanUrl(span, xhr.responseURL);
          },
        }),
        new UserInteractionInstrumentation({
          eventNames: ["click", "input", "submit"],
        }),
      ],
    });
  }

  if (config.endpoints.logs) {
    const exporter = new OTLPLogExporter({
      url: config.endpoints.logs,
      headers: config.headers,
    });
    const loggerProvider = new LoggerProvider({
      resource,
      processors: [new BatchLogRecordProcessor(exporter)],
    });
    logs.setGlobalLoggerProvider(loggerProvider);
  }

  if (config.endpoints.metrics) {
    const exporter = new OTLPMetricExporter({
      url: config.endpoints.metrics,
      headers: config.headers,
    });
    const meterProvider = new MeterProvider({
      resource,
      readers: [
        new PeriodicExportingMetricReader({
          exporter,
          exportIntervalMillis: 30_000,
        }),
      ],
    });
    metrics.setGlobalMeterProvider(meterProvider);
  }
}
