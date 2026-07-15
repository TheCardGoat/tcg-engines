import { describe, expect, it } from "vitest";

import {
  buildOtlpIgnoreUrls,
  buildPropagationTargets,
  buildResourceAttributes,
  normalizeRoute,
  parseTraceSampleRatio,
  sanitizeTelemetryValue,
  TelemetryEventGate,
} from "./browser-core";

describe("browser observability core", () => {
  it("redacts credentials in object keys and strings", () => {
    expect(
      sanitizeTelemetryValue({
        authorization: "Bearer secret-token",
        url: "https://tcg.online/play?ticket=secret&mode=test",
        message: "Authorization: Bearer abc.def.ghi",
      }),
    ).toEqual({
      authorization: "[redacted]",
      url: "https://tcg.online/play?ticket=[redacted]&mode=test",
      message: "Authorization: Bearer [redacted]",
    });
  });

  it("normalizes high-cardinality route segments", () => {
    expect(normalizeRoute("/decks/12345/edit")).toBe("/decks/:id/edit");
    expect(normalizeRoute("/replays/018f47a2-51ad-7d8f-a754-2f41072f705d")).toBe("/replays/:id");
    expect(normalizeRoute("/cyberpunk/simulator/abcdefghijklmnop")).toBe(
      "/cyberpunk/simulator/:id",
    );
    expect(normalizeRoute("/")).toBe("/");
  });

  it("uses the configured trace sample ratio only when valid", () => {
    expect(parseTraceSampleRatio("")).toBe(0.02);
    expect(parseTraceSampleRatio("0.25")).toBe(0.25);
    expect(parseTraceSampleRatio("2")).toBe(0.02);
    expect(parseTraceSampleRatio("invalid")).toBe(0.02);
  });

  it("deduplicates and rate limits repeated events", () => {
    const gate = new TelemetryEventGate(2, 1_000, 100);
    expect(gate.accept("first", 10)).toBe(true);
    expect(gate.accept("first", 20)).toBe(false);
    expect(gate.accept("second", 30)).toBe(true);
    expect(gate.accept("third", 40)).toBe(false);
    expect(gate.accept("third", 1_100)).toBe(true);
  });

  it("builds release-aware resources without an empty version", () => {
    expect(
      buildResourceAttributes({
        serviceName: "tcg-multi-game-simulator",
        serviceVersion: "abc123",
        deploymentEnvironment: "production",
      }),
    ).toEqual({
      "service.name": "tcg-multi-game-simulator",
      "service.version": "abc123",
      "deployment.environment.name": "production",
    });
  });

  it("excludes OTLP exports and propagates only to configured origins", () => {
    const [ignore] = buildOtlpIgnoreUrls("https://tcg.online/otel/");
    expect(ignore?.test("https://tcg.online/otel/v1/logs")).toBe(true);
    expect(ignore?.test("https://tcg.online/otel/v1/traces?x=1")).toBe(true);
    expect(ignore?.test("https://tcg.online/api/v1/logs")).toBe(false);

    const [target] = buildPropagationTargets(["https://api.tcg.online"], "https://tcg.online");
    expect(target?.test("https://api.tcg.online/v1/decks")).toBe(true);
    expect(target?.test("https://attacker.example/v1/decks")).toBe(false);
  });
});
