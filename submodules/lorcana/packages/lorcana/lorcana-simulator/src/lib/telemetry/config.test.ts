import { describe, expect, it } from "bun:test";
import {
  deriveOtlpEndpoint,
  normalizePathForTelemetry,
  resolveBrowserTelemetryConfig,
  sanitizeTelemetryAttributes,
} from "./config.js";

describe("browser telemetry config", () => {
  it("derives signal endpoints from a base OTLP endpoint", () => {
    expect(deriveOtlpEndpoint("https://otel.example.com/", "traces")).toBe(
      "https://otel.example.com/v1/traces",
    );
    const config = resolveBrowserTelemetryConfig({
      PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT: "https://otel.example.com",
      PUBLIC_SIGNOZ_INGESTION_KEY: "abc123",
      PUBLIC_OTEL_SERVICE_NAME: "sim",
      PUBLIC_OTEL_DEPLOYMENT_ENVIRONMENT: "staging",
    });

    expect(config.enabled).toBe(true);
    expect(config.endpoints).toEqual({
      traces: "https://otel.example.com/v1/traces",
      logs: "https://otel.example.com/v1/logs",
      metrics: "https://otel.example.com/v1/metrics",
    });
    expect(config.headers).toEqual({ "signoz-ingestion-key": "abc123" });
    expect(config.resourceAttributes["service.name"]).toBe("sim");
    expect(config.resourceAttributes["deployment.environment.name"]).toBe("staging");
  });

  it("lets channel-specific endpoints override the base endpoint", () => {
    const config = resolveBrowserTelemetryConfig({
      PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT: "https://otel.example.com",
      PUBLIC_OTEL_EXPORTER_OTLP_LOGS_ENDPOINT: "https://logs.example.com/v1/logs",
    });

    expect(config.endpoints.logs).toBe("https://logs.example.com/v1/logs");
    expect(config.endpoints.traces).toBe("https://otel.example.com/v1/traces");
  });

  it("skips malformed regex URL patterns instead of throwing", () => {
    const config = resolveBrowserTelemetryConfig({
      PUBLIC_OTEL_EXPORTER_OTLP_TRACES_ENDPOINT: "https://otel.example.com/v1/traces",
      PUBLIC_OTEL_PROPAGATE_TRACE_URLS: "/(/,https://api.example.com",
    });

    expect(config.propagateTraceHeaderCorsUrls).toEqual(["https://api.example.com"]);
  });

  it("is disabled when no browser OTLP endpoint is configured", () => {
    const config = resolveBrowserTelemetryConfig({});

    expect(config.enabled).toBe(false);
    expect(config.endpoints).toEqual({});
    expect(config.headers).toEqual({});
  });

  it("normalizes URLs and path identifiers before adding telemetry attributes", () => {
    expect(
      normalizePathForTelemetry(
        "https://app.example.com/replay/018d0304-18ca-7ce3-b65d-bfe63adbc536?token=secret",
      ),
    ).toBe("/replay/:id");
    expect(normalizePathForTelemetry("/matches/match_abcdefghijklmnop123/games/42")).toBe(
      "/matches/:id/games/:id",
    );
  });

  it("drops PII and sensitive values from log attributes", () => {
    expect(
      sanitizeTelemetryAttributes({
        deckName: "My deck",
        email: "player@example.com",
        authorization: "Bearer secret",
        url: "https://app.example.com/match/123?cookie=secret",
        "error.message":
          "failed https://app.example.com/replay/018d0304-18ca-7ce3-b65d-bfe63adbc536?token=secret",
        callStackContext: "turn-resolution",
        stack_trace: "Error at /secret/path",
        format: "infinity",
        attempts: 2,
        fatal: true,
      }),
    ).toEqual({
      url: "/match/:id",
      "error.message": "failed /replay/:id",
      callStackContext: "turn-resolution",
      format: "infinity",
      attempts: 2,
      fatal: true,
    });
  });

  it("drops email-like values with short TLDs", () => {
    expect(
      sanitizeTelemetryAttributes({
        message: "player contact player@example.a",
        fallback: "player@example.io",
      }),
    ).toEqual({});
  });
});
