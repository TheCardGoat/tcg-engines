import { describe, expect, it } from "vite-plus/test";
import { gzipSync, strToU8 } from "fflate";

import {
  decodeTestSimulatorEnvelope,
  loadTestSimulatorState,
  TEST_SIMULATOR_SNAPSHOT_VERSION,
  type TestSimulatorSnapshotEnvelope,
} from "./testSimulatorState.ts";

describe("test simulator state route codec", () => {
  it("decodes valid inline envelopes", () => {
    const envelope = testEnvelope({ state: { status: "active" } });

    expect(decodeTestSimulatorEnvelope(encode(envelope))).toEqual(envelope);
  });

  it("rejects unsupported versions", () => {
    const envelope = { ...testEnvelope({}), version: 999 };

    expect(() => decodeTestSimulatorEnvelope(encode(envelope))).toThrow(
      "Unsupported test simulator snapshot version",
    );
  });

  it("loads and validates a matching game slug", async () => {
    const envelope = testEnvelope({ state: { status: "active" } });
    const loaded = await loadTestSimulatorState(
      "cyberpunk",
      `?state=${encodeURIComponent(encode(envelope))}`,
    );

    expect(loaded).toEqual(envelope);
  });

  it("rejects a payload for a different game", async () => {
    const envelope = testEnvelope({ state: {} }, "one-piece");

    await expect(
      loadTestSimulatorState("cyberpunk", `?state=${encodeURIComponent(encode(envelope))}`),
    ).rejects.toThrow("Test simulator payload is for one-piece, not cyberpunk.");
  });
});

function testEnvelope(
  payload: unknown,
  gameSlug: TestSimulatorSnapshotEnvelope["gameSlug"] = "cyberpunk",
): TestSimulatorSnapshotEnvelope {
  return {
    version: TEST_SIMULATOR_SNAPSHOT_VERSION,
    gameSlug,
    createdAt: "2026-07-02T00:00:00.000Z",
    viewer: "p1",
    payload,
  };
}

function encode(value: unknown): string {
  const bytes = gzipSync(strToU8(JSON.stringify(value)));
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/gu, "-").replace(/\//gu, "_").replace(/=+$/u, "");
}
