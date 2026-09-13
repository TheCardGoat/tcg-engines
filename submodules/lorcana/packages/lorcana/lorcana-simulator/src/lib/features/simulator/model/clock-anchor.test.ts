import { describe, expect, it } from "bun:test";
import { deriveClockView, type ClockSnapshot } from "@tcg/lorcana-engine";
import { anchorClockSnapshot } from "./clock-anchor.js";

const serverNow = 1_700_000_000_000;
const freshClock: ClockSnapshot = {
  reserveMsRemaining: 180_000,
  isRunning: true,
  startedAtMs: serverNow,
  timeoutCount: 0,
  isInNegativeTime: false,
};

describe("server clock anchoring", () => {
  it.each([500, serverNow - 3_600_000, serverNow + 3_600_000])(
    "keeps a fresh clock positive in local epoch %i",
    (receivedAtMs: number) => {
      const anchored = anchorClockSnapshot(freshClock, serverNow, receivedAtMs);
      expect(anchored).toBeDefined();
      if (!anchored) throw new Error("Expected clock");
      const view = deriveClockView(anchored, receivedAtMs);
      expect(view.formattedTime).toBe("3:00");
      expect(view.canDropOpponent).toBe(false);
      expect(view.canSkipOpponent).toBe(false);
      expect(deriveClockView(anchored, receivedAtMs + 1_000).formattedTime).toBe("2:59");
      expect(freshClock.startedAtMs).toBe(serverNow);
    },
  );

  it("includes time already elapsed on the server and preserves real timeouts", () => {
    const anchored = anchorClockSnapshot(
      { ...freshClock, activePlayerAccumulatedMs: 10_000, maxDecisionTimeMs: 30_000 },
      serverNow + 15_000,
      500,
    );
    if (!anchored) throw new Error("Expected clock");
    expect(deriveClockView(anchored, 500).formattedTime).toBe("2:45");
    expect(deriveClockView(anchored, 6_500).canSkipOpponent).toBe(true);
    expect(deriveClockView(anchored, 6_500).canDropOpponent).toBe(false);
    expect(deriveClockView(anchored, 166_500).canDropOpponent).toBe(true);
  });

  it("does not spend paused time or invent missing clocks", () => {
    const paused = { ...freshClock, isRunning: false };
    const anchored = anchorClockSnapshot(paused, serverNow, 500);
    if (!anchored) throw new Error("Expected clock");
    expect(deriveClockView(anchored, 999_999).formattedTime).toBe("3:00");
    expect(anchorClockSnapshot(undefined, serverNow, 500)).toBeUndefined();
    const notStarted = { ...paused, startedAtMs: undefined };
    expect(anchorClockSnapshot(notStarted, serverNow, 500)).toBe(notStarted);
  });
});
