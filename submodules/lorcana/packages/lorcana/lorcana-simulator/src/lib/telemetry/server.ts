import { env } from "$env/dynamic/private";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import {
  ATTR_DEPLOYMENT_ENVIRONMENT_NAME,
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_NAMESPACE,
} from "@opentelemetry/semantic-conventions";

const DEFAULT_SERVICE_NAME = "lorcana-simulator-ssr";
const SERVICE_NAMESPACE = "tcg";
const SHUTDOWN_TIMEOUT_MS = 5_000;

let sdk: NodeSDK | undefined;
let started = false;

function configuredValue(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function resolveTracesEndpoint(): string | undefined {
  return (
    configuredValue(env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT) ??
    configuredValue(env.OTEL_EXPORTER_OTLP_ENDPOINT)?.replace(/\/?$/, "/v1/traces")
  );
}

function configuredHeaders(): Record<string, string> {
  const signozKey =
    configuredValue(env.SIGNOZ_INGESTION_KEY) ?? configuredValue(env.OTEL_SIGNOZ_INGESTION_KEY);
  if (signozKey) return { "signoz-ingestion-key": signozKey };

  const rawHeaders = configuredValue(env.OTEL_EXPORTER_OTLP_HEADERS);
  if (!rawHeaders) return {};

  return Object.fromEntries(
    rawHeaders.split(",").flatMap((entry) => {
      const separatorIndex = entry.indexOf("=");
      if (separatorIndex <= 0) return [];
      const key = decodeHeaderComponent(entry.slice(0, separatorIndex).trim());
      const value = decodeHeaderComponent(entry.slice(separatorIndex + 1).trim());
      return key && value ? [[key, value]] : [];
    }),
  );
}

function decodeHeaderComponent(value: string): string | undefined {
  try {
    return decodeURIComponent(value);
  } catch {
    return undefined;
  }
}

export function isServerTelemetryEnabled(): boolean {
  return Boolean(resolveTracesEndpoint());
}

export function startServerTelemetry(): void {
  if (started) return;

  const tracesEndpoint = resolveTracesEndpoint();
  if (!tracesEndpoint) return;

  started = true;

  const serviceName = configuredValue(env.OTEL_SERVICE_NAME) ?? DEFAULT_SERVICE_NAME;
  const deploymentEnvironment =
    configuredValue(env.OTEL_DEPLOYMENT_ENVIRONMENT) ??
    configuredValue(env.RAILWAY_ENVIRONMENT_NAME) ??
    configuredValue(env.NODE_ENV);
  const resourceAttributes: Record<string, string> = {
    [ATTR_SERVICE_NAME]: serviceName,
    [ATTR_SERVICE_NAMESPACE]: SERVICE_NAMESPACE,
  };

  if (deploymentEnvironment) {
    resourceAttributes[ATTR_DEPLOYMENT_ENVIRONMENT_NAME] = deploymentEnvironment;
  }

  sdk = new NodeSDK({
    resource: resourceFromAttributes(resourceAttributes),
    spanProcessors: [
      new BatchSpanProcessor(
        new OTLPTraceExporter({
          url: tracesEndpoint,
          headers: configuredHeaders(),
        }),
      ),
    ],
    instrumentations: [
      getNodeAutoInstrumentations({
        "@opentelemetry/instrumentation-fs": { enabled: false },
        "@opentelemetry/instrumentation-dns": { enabled: false },
      }),
    ],
  });
  sdk.start();

  for (const signal of ["SIGTERM", "SIGINT"] as const) {
    process.once(signal, () => {
      const shutdown = sdk?.shutdown() ?? Promise.resolve();
      const timeout = new Promise<void>((resolve) => {
        setTimeout(resolve, SHUTDOWN_TIMEOUT_MS);
      });
      void Promise.race([shutdown, timeout]).finally(() => process.kill(process.pid, signal));
    });
  }
}
