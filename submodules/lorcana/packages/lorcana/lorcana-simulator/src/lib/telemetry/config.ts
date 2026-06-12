import {
  ATTR_DEPLOYMENT_ENVIRONMENT_NAME,
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_NAMESPACE,
} from "@opentelemetry/semantic-conventions";

const DEFAULT_SERVICE_NAME = "lorcana-simulator-web";
const SERVICE_NAMESPACE = "tcg";
const UUID_RE = /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/gi;
const LONG_ID_SEGMENT_RE = /^[a-zA-Z0-9_-]{16,}$/;
const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{1,}/i;
const REDACTED = "[redacted]";
const TEXT_LIMIT = 180;

export type TelemetrySignal = "traces" | "logs" | "metrics";
export type TelemetryAttributeValue = string | number | boolean;
export type TelemetryAttributes = Record<string, TelemetryAttributeValue>;

export interface BrowserTelemetryEnv {
  PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT?: string;
  PUBLIC_OTEL_EXPORTER_OTLP_TRACES_ENDPOINT?: string;
  PUBLIC_OTEL_EXPORTER_OTLP_LOGS_ENDPOINT?: string;
  PUBLIC_OTEL_EXPORTER_OTLP_METRICS_ENDPOINT?: string;
  PUBLIC_OTEL_SERVICE_NAME?: string;
  PUBLIC_OTEL_DEPLOYMENT_ENVIRONMENT?: string;
  PUBLIC_SIGNOZ_INGESTION_KEY?: string;
  PUBLIC_OTEL_PROPAGATE_TRACE_URLS?: string;
  PUBLIC_OTEL_IGNORE_URLS?: string;
}

export interface BrowserTelemetryConfig {
  enabled: boolean;
  endpoints: Partial<Record<TelemetrySignal, string>>;
  headers: Record<string, string>;
  serviceName: string;
  deploymentEnvironment?: string;
  propagateTraceHeaderCorsUrls: Array<string | RegExp>;
  ignoreUrls: Array<string | RegExp>;
  resourceAttributes: Record<string, string>;
}

export function configuredValue(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function deriveOtlpEndpoint(
  baseEndpoint: string | undefined,
  signal: TelemetrySignal,
): string | undefined {
  const base = configuredValue(baseEndpoint);
  if (!base) return undefined;
  return `${base.replace(/\/+$/, "")}/v1/${signal}`;
}

export function parseUrlPatterns(value: string | undefined): Array<string | RegExp> {
  const configured = configuredValue(value);
  if (!configured) return [];

  const patterns: Array<string | RegExp> = [];
  for (const entry of configured.split(",")) {
    const pattern = entry.trim();
    if (!pattern) continue;
    if (pattern.startsWith("/") && pattern.endsWith("/") && pattern.length > 2) {
      try {
        patterns.push(new RegExp(pattern.slice(1, -1)));
      } catch {
        continue;
      }
    } else {
      patterns.push(pattern);
    }
  }
  return patterns;
}

export function normalizePathForTelemetry(pathOrUrl: string): string {
  let pathname = pathOrUrl;
  try {
    pathname = new URL(pathOrUrl, "https://telemetry.local").pathname;
  } catch {
    pathname = pathOrUrl.split("?")[0]?.split("#")[0] ?? "/";
  }

  const normalized = pathname
    .replace(UUID_RE, ":id")
    .split("/")
    .map((segment) => {
      if (!segment) return segment;
      if (/^\d+$/.test(segment)) return ":id";
      if (LONG_ID_SEGMENT_RE.test(segment) && /\d/.test(segment)) return ":id";
      return segment;
    })
    .join("/");

  return normalized || "/";
}

function shouldDropAttribute(key: string, value: TelemetryAttributeValue): boolean {
  const lowerKey = key.toLowerCase();
  if (
    lowerKey.includes("cookie") ||
    lowerKey.includes("authorization") ||
    lowerKey.includes("auth_header") ||
    lowerKey.includes("token") ||
    lowerKey.includes("email") ||
    lowerKey.includes("username") ||
    lowerKey.includes("displayname") ||
    lowerKey.includes("display_name") ||
    lowerKey.includes("chat") ||
    lowerKey.includes("deck_name") ||
    lowerKey.includes("deckname") ||
    lowerKey === "stack" ||
    lowerKey === "error.stack" ||
    lowerKey.includes("stack_trace") ||
    lowerKey.includes("stacktrace")
  ) {
    return true;
  }

  if (typeof value === "string" && EMAIL_RE.test(value)) return true;
  return false;
}

function sanitizeStringValue(key: string, value: string): string {
  const lowerKey = key.toLowerCase();
  if (lowerKey.includes("url") || lowerKey.includes("filename")) {
    return normalizePathForTelemetry(value);
  }
  const withoutFullUrls = value.replace(/https?:\/\/\S+/g, (match) =>
    normalizePathForTelemetry(match),
  );
  return withoutFullUrls.length > TEXT_LIMIT
    ? `${withoutFullUrls.slice(0, TEXT_LIMIT)}...`
    : withoutFullUrls;
}

export function sanitizeTelemetryAttributes(
  attributes: TelemetryAttributes = {},
): TelemetryAttributes {
  const safe: TelemetryAttributes = {};

  for (const [key, value] of Object.entries(attributes)) {
    if (shouldDropAttribute(key, value)) continue;
    if (typeof value === "string") {
      const sanitized = sanitizeStringValue(key, value);
      safe[key] = sanitized || REDACTED;
    } else if (
      (typeof value === "number" && Number.isFinite(value)) ||
      typeof value === "boolean"
    ) {
      safe[key] = value;
    }
  }

  return safe;
}

export function resolveBrowserTelemetryConfig(env: BrowserTelemetryEnv): BrowserTelemetryConfig {
  const tracesEndpoint =
    configuredValue(env.PUBLIC_OTEL_EXPORTER_OTLP_TRACES_ENDPOINT) ??
    deriveOtlpEndpoint(env.PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT, "traces");
  const logsEndpoint =
    configuredValue(env.PUBLIC_OTEL_EXPORTER_OTLP_LOGS_ENDPOINT) ??
    deriveOtlpEndpoint(env.PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT, "logs");
  const metricsEndpoint =
    configuredValue(env.PUBLIC_OTEL_EXPORTER_OTLP_METRICS_ENDPOINT) ??
    deriveOtlpEndpoint(env.PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT, "metrics");
  const endpoints: Partial<Record<TelemetrySignal, string>> = {};
  if (tracesEndpoint) endpoints.traces = tracesEndpoint;
  if (logsEndpoint) endpoints.logs = logsEndpoint;
  if (metricsEndpoint) endpoints.metrics = metricsEndpoint;

  const serviceName = configuredValue(env.PUBLIC_OTEL_SERVICE_NAME) ?? DEFAULT_SERVICE_NAME;
  const deploymentEnvironment = configuredValue(env.PUBLIC_OTEL_DEPLOYMENT_ENVIRONMENT);
  const resourceAttributes: Record<string, string> = {
    [ATTR_SERVICE_NAME]: serviceName,
    [ATTR_SERVICE_NAMESPACE]: SERVICE_NAMESPACE,
  };
  if (deploymentEnvironment) {
    resourceAttributes[ATTR_DEPLOYMENT_ENVIRONMENT_NAME] = deploymentEnvironment;
  }

  const telemetryEndpoints = Object.values(endpoints);
  const ingestionKey = configuredValue(env.PUBLIC_SIGNOZ_INGESTION_KEY);

  return {
    enabled: telemetryEndpoints.length > 0,
    endpoints,
    headers: ingestionKey ? { "signoz-ingestion-key": ingestionKey } : {},
    serviceName,
    deploymentEnvironment,
    propagateTraceHeaderCorsUrls: parseUrlPatterns(env.PUBLIC_OTEL_PROPAGATE_TRACE_URLS),
    ignoreUrls: [...telemetryEndpoints, ...parseUrlPatterns(env.PUBLIC_OTEL_IGNORE_URLS)],
    resourceAttributes,
  };
}
