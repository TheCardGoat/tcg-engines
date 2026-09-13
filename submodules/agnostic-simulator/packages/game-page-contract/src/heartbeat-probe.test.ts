import { describe, expect, it, vi } from "vitest";
import {
  createHeartbeatProbeId,
  createHeartbeatProbeTracker,
  MAX_HEARTBEAT_ROUND_TRIP_MS,
  MAX_QUEUED_HEARTBEAT_PROBES,
} from "./heartbeat-probe.js";

describe("createHeartbeatProbeTracker", () => {
  it("creates a schema-valid v4 UUID when randomUUID is unavailable", () => {
    const cryptoApi = {
      getRandomValues(bytes: Uint8Array): Uint8Array {
        bytes.forEach((_, index) => {
          bytes[index] = index;
        });
        return bytes;
      },
    } as Pick<Crypto, "getRandomValues">;

    expect(createHeartbeatProbeId(cryptoApi)).toBe("00010203-0405-4607-8809-0a0b0c0d0e0f");
  });

  it("reports completed samples once in FIFO order", () => {
    let id = 0;
    const tracker = createHeartbeatProbeTracker(() => `probe-${++id}`);
    const first = tracker.nextHeartbeatFields(100);
    const second = tracker.nextHeartbeatFields(200);

    tracker.acknowledge(first, 500);
    tracker.acknowledge(second, 550);

    expect(tracker.nextHeartbeatFields(600)).toMatchObject({
      correlationId: "probe-3",
      previousCorrelationId: "probe-1",
      previousRoundTripMs: 400,
    });
    expect(tracker.nextHeartbeatFields(700)).toMatchObject({
      correlationId: "probe-4",
      previousCorrelationId: "probe-2",
      previousRoundTripMs: 350,
    });
    expect(tracker.nextHeartbeatFields(800)).not.toHaveProperty("previousRoundTripMs");
  });

  it("discards invalid, unknown, duplicate, and oversized acknowledgements", () => {
    const tracker = createHeartbeatProbeTracker(() => crypto.randomUUID());
    const probe = tracker.nextHeartbeatFields(100);

    expect(tracker.acknowledge({ ...probe, correlationId: crypto.randomUUID() }, 200)).toBeNull();
    expect(tracker.acknowledge(probe, 99)).toBeNull();
    expect(tracker.acknowledge(probe, 200)).toBeNull();

    const oversized = tracker.nextHeartbeatFields(1_000);
    expect(tracker.acknowledge(oversized, 1_000 + MAX_HEARTBEAT_ROUND_TRIP_MS + 1)).toBeNull();
    expect(tracker.nextHeartbeatFields(2_000)).not.toHaveProperty("previousRoundTripMs");
  });

  it("bounds the completed-sample backlog", () => {
    let id = 0;
    const tracker = createHeartbeatProbeTracker(() => `probe-${++id}`);
    const probes = Array.from({ length: MAX_QUEUED_HEARTBEAT_PROBES + 2 }, (_, index) =>
      tracker.nextHeartbeatFields(index),
    );
    for (const [index, probe] of probes.entries()) tracker.acknowledge(probe, index + 10);

    const reported = Array.from({ length: MAX_QUEUED_HEARTBEAT_PROBES + 2 }, (_, index) =>
      tracker.nextHeartbeatFields(100 + index),
    ).filter((fields) => fields.previousCorrelationId !== undefined);

    expect(reported).toHaveLength(MAX_QUEUED_HEARTBEAT_PROBES);
    expect(reported[0]?.previousCorrelationId).toBe("probe-1");
    expect(reported.at(-1)?.previousCorrelationId).toBe(`probe-${MAX_QUEUED_HEARTBEAT_PROBES}`);
  });

  it("clears pending and completed probes", () => {
    const tracker = createHeartbeatProbeTracker(vi.fn(() => crypto.randomUUID()));
    const probe = tracker.nextHeartbeatFields(100);
    tracker.acknowledge(probe, 125);
    tracker.clear();

    expect(tracker.nextHeartbeatFields(200)).not.toHaveProperty("previousRoundTripMs");
  });
});
