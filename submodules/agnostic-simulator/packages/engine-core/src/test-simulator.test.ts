import { describe, expect, it } from "vite-plus/test";

import {
  decodeTestSimulatorEnvelope,
  openTestSimulatorSnapshot,
  createTestSimulatorEnvelope,
  encodeTestSimulatorEnvelope,
} from "./test-simulator.ts";

describe("test simulator snapshots", () => {
  it("round-trips compressed snapshot envelopes", () => {
    const envelope = createTestSimulatorEnvelope({
      gameSlug: "cyberpunk",
      viewer: "p1",
      payload: { state: { ctx: { stateID: 7 }, G: { phase: "main" } } },
    });

    expect(decodeTestSimulatorEnvelope(encodeTestSimulatorEnvelope(envelope))).toEqual(envelope);
  });

  it("builds inline query URLs for small payloads", () => {
    const result = openTestSimulatorSnapshot(
      {
        gameSlug: "one-piece",
        payload: { state: { status: "active" } },
      },
      { open: false, baseUrl: "http://localhost:5193/" },
    );

    expect(result.transport).toBe("query");
    expect(result.url).toMatch(
      /^http:\/\/localhost:5193\/one-piece\/simulator\/tests\/test-engine-state\?state=/u,
    );
  });

  it("does not require open: false when running in CI", () => {
    const previousCi = process.env.CI;
    process.env.CI = "true";
    try {
      const result = openTestSimulatorSnapshot(
        {
          gameSlug: "cyberpunk",
          payload: { state: { status: "active" } },
        },
        { baseUrl: "http://localhost:5193/" },
      );

      expect(result.transport).toBe("query");
      expect(result.url).toContain("/cyberpunk/simulator/tests/test-engine-state?state=");
    } finally {
      if (previousCi === undefined) {
        delete process.env.CI;
      } else {
        process.env.CI = previousCi;
      }
    }
  });

  it("uses localhost handoff URLs for large payloads", async () => {
    const result = openTestSimulatorSnapshot(
      {
        gameSlug: "gundam",
        payload: { state: "x".repeat(1000) },
      },
      { open: false, baseUrl: "http://localhost:5193", maxUrlStateLength: 1 },
    );

    try {
      expect(result.transport).toBe("handoff");
      expect(result.url).toContain("/gundam/simulator/tests/test-engine-state?handoff=");
      expect(result.url).toContain("from=http");
      await expect(result.ready).resolves.toBeUndefined();
    } finally {
      result.dispose?.();
    }
  });

  it("rejects malformed envelopes with valid compression", () => {
    const encoded = encodeTestSimulatorEnvelope({
      version: 1,
      gameSlug: "cyberpunk",
    } as never);

    expect(() => decodeTestSimulatorEnvelope(encoded)).toThrow("Malformed test simulator snapshot");
  });

  it("rejects malformed base64url input", () => {
    expect(() => decodeTestSimulatorEnvelope("not valid")).toThrow(
      "Invalid base64url test simulator snapshot",
    );
  });
});
