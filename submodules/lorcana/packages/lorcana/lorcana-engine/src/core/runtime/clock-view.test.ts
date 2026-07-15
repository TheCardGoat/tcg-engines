/**
 * Clock View Tests
 *
 * Covers:
 *   - formatClockTime edge cases (zero, minute boundary, negative)
 *   - deriveClockView interpolation (running, paused, startedAtMs missing)
 *   - urgency thresholds (30s warning, 10s danger, negative critical)
 *   - shouldPlayLowTimeTick gating (own clock, running, 0 < displayMs < 10s)
 *   - decisionCapExceeded (per-decision cap logic)
 *   - Skip/drop affordances (ported from the retired OpponentTimeoutTracker)
 */

import { describe, it, expect } from "bun:test";
import { deriveClockView, formatClockTime, type ClockSnapshot } from "./clock-view";

const NOW = 1_700_000_000_000;

function baseSnapshot(overrides: Partial<ClockSnapshot> = {}): ClockSnapshot {
  return {
    reserveMsRemaining: 60_000,
    isRunning: false,
    startedAtMs: undefined,
    timeoutCount: 0,
    isInNegativeTime: false,
    ...overrides,
  };
}

describe("formatClockTime", () => {
  it("formats zero as '0:00'", () => {
    expect(formatClockTime(0)).toBe("0:00");
  });

  it("formats sub-minute values with a leading zero minute", () => {
    expect(formatClockTime(59_999)).toBe("0:59");
    expect(formatClockTime(1_000)).toBe("0:01");
  });

  it("formats the minute boundary correctly", () => {
    expect(formatClockTime(60_000)).toBe("1:00");
  });

  it("formats multi-minute values", () => {
    expect(formatClockTime(150_000)).toBe("2:30");
  });

  it("formats negative values with a leading minus", () => {
    expect(formatClockTime(-15_000)).toBe("-0:15");
    expect(formatClockTime(-65_000)).toBe("-1:05");
  });
});

describe("deriveClockView — interpolation", () => {
  it("returns reserve as-is when the clock is not running", () => {
    const snapshot = baseSnapshot({
      reserveMsRemaining: 45_000,
      isRunning: false,
      startedAtMs: NOW - 5_000, // should be ignored
    });

    const view = deriveClockView(snapshot, NOW);

    expect(view.displayMs).toBe(45_000);
    expect(view.isRunning).toBe(false);
    expect(view.formattedTime).toBe("0:45");
  });

  it("returns reserve as-is when startedAtMs is missing, even if isRunning is true", () => {
    const snapshot = baseSnapshot({
      reserveMsRemaining: 45_000,
      isRunning: true,
      startedAtMs: undefined,
    });

    const view = deriveClockView(snapshot, NOW);
    expect(view.displayMs).toBe(45_000);
  });

  it("subtracts elapsed ms when running", () => {
    const snapshot = baseSnapshot({
      reserveMsRemaining: 60_000,
      isRunning: true,
      startedAtMs: NOW - 5_000,
    });

    const view = deriveClockView(snapshot, NOW);
    expect(view.displayMs).toBe(55_000);
    expect(view.formattedTime).toBe("0:55");
  });

  it("goes negative when elapsed exceeds reserve", () => {
    const snapshot = baseSnapshot({
      reserveMsRemaining: 5_000,
      isRunning: true,
      startedAtMs: NOW - 8_000,
    });

    const view = deriveClockView(snapshot, NOW);
    expect(view.displayMs).toBe(-3_000);
    expect(view.isNegative).toBe(true);
    expect(view.formattedTime).toBe("-0:03");
    expect(view.urgencyClass).toBe("timer--critical");
  });
});

describe("deriveClockView — urgency thresholds", () => {
  function viewForDisplayMs(displayMs: number) {
    // Use a non-running snapshot so displayMs is exactly the reserve.
    return deriveClockView(baseSnapshot({ reserveMsRemaining: displayMs }), NOW);
  }

  it("shows no urgency class at or above 30 seconds", () => {
    expect(viewForDisplayMs(30_000).urgencyClass).toBe("");
    expect(viewForDisplayMs(30_001).urgencyClass).toBe("");
    expect(viewForDisplayMs(60_000).urgencyClass).toBe("");
  });

  it("applies the warning class just below 30 seconds", () => {
    expect(viewForDisplayMs(29_999).urgencyClass).toBe("timer--warning");
  });

  it("applies the danger class just below 10 seconds", () => {
    expect(viewForDisplayMs(9_999).urgencyClass).toBe("timer--danger");
  });

  it("applies the critical class at or below zero", () => {
    expect(viewForDisplayMs(-1).urgencyClass).toBe("timer--critical");
  });

  it("honors isInNegativeTime even when displayMs is still positive", () => {
    const view = deriveClockView(
      baseSnapshot({ reserveMsRemaining: 5_000, isInNegativeTime: true }),
      NOW,
    );
    expect(view.isNegative).toBe(true);
    expect(view.urgencyClass).toBe("timer--critical");
  });
});

describe("deriveClockView — shouldPlayLowTimeTick gate", () => {
  it("is false when isOwnClock is not set", () => {
    const view = deriveClockView(
      baseSnapshot({
        reserveMsRemaining: 5_000,
        isRunning: true,
        startedAtMs: NOW,
      }),
      NOW,
    );
    expect(view.shouldPlayLowTimeTick).toBe(false);
  });

  it("is true when own clock is running in the final 10s", () => {
    const view = deriveClockView(
      baseSnapshot({
        reserveMsRemaining: 5_000,
        isRunning: true,
        startedAtMs: NOW,
      }),
      NOW,
      { isOwnClock: true },
    );
    expect(view.shouldPlayLowTimeTick).toBe(true);
  });

  it("is false when own clock is paused", () => {
    const view = deriveClockView(
      baseSnapshot({ reserveMsRemaining: 5_000, isRunning: false }),
      NOW,
      { isOwnClock: true },
    );
    expect(view.shouldPlayLowTimeTick).toBe(false);
  });

  it("is false once displayMs is zero or negative", () => {
    const view = deriveClockView(
      baseSnapshot({
        reserveMsRemaining: 5_000,
        isRunning: true,
        startedAtMs: NOW - 5_000,
      }),
      NOW,
      { isOwnClock: true },
    );
    expect(view.displayMs).toBe(0);
    expect(view.shouldPlayLowTimeTick).toBe(false);
  });

  it("is false above 10 seconds", () => {
    const view = deriveClockView(
      baseSnapshot({
        reserveMsRemaining: 15_000,
        isRunning: true,
        startedAtMs: NOW,
      }),
      NOW,
      { isOwnClock: true },
    );
    expect(view.shouldPlayLowTimeTick).toBe(false);
  });
});

describe("deriveClockView — decisionCapExceeded", () => {
  it("is false when no cap is configured", () => {
    const view = deriveClockView(
      baseSnapshot({
        reserveMsRemaining: 60_000,
        isRunning: true,
        startedAtMs: NOW - 180_000,
      }),
      NOW,
    );
    expect(view.decisionCapExceeded).toBe(false);
  });

  it("is false when only the current segment would exceed the cap but clock is paused", () => {
    const view = deriveClockView(
      baseSnapshot({
        reserveMsRemaining: 60_000,
        isRunning: false,
        activePlayerAccumulatedMs: 0,
        maxDecisionTimeMs: 10_000,
      }),
      NOW,
    );
    expect(view.decisionCapExceeded).toBe(false);
  });

  it("is true when the current segment exceeds the cap with no prior accumulation", () => {
    const view = deriveClockView(
      baseSnapshot({
        reserveMsRemaining: 60_000,
        isRunning: true,
        startedAtMs: NOW - 15_000,
        activePlayerAccumulatedMs: 0,
        maxDecisionTimeMs: 10_000,
      }),
      NOW,
    );
    expect(view.decisionCapExceeded).toBe(true);
  });

  it("sums prior accumulation with the current segment", () => {
    const view = deriveClockView(
      baseSnapshot({
        reserveMsRemaining: 60_000,
        isRunning: true,
        startedAtMs: NOW - 3_000, // 3s this segment
        activePlayerAccumulatedMs: 8_000, // 8s prior
        maxDecisionTimeMs: 10_000, // 11s > 10s → true
      }),
      NOW,
    );
    expect(view.decisionCapExceeded).toBe(true);
  });

  it("is false exactly at the cap boundary", () => {
    const view = deriveClockView(
      baseSnapshot({
        reserveMsRemaining: 60_000,
        isRunning: true,
        startedAtMs: NOW - 10_000,
        activePlayerAccumulatedMs: 0,
        maxDecisionTimeMs: 10_000,
      }),
      NOW,
    );
    expect(view.decisionCapExceeded).toBe(false);
  });
});

describe("deriveClockView — canSkipOpponent / canDropOpponent (ported from OpponentTimeoutTracker)", () => {
  it("starts with no affordances available", () => {
    const view = deriveClockView(baseSnapshot(), NOW);
    expect(view.canSkipOpponent).toBe(false);
    expect(view.canDropOpponent).toBe(false);
    expect(view.timedOutWithPriority).toBe(false);
  });

  describe("per-decision cap exceeded while reserve is still positive", () => {
    it("enables canSkip only", () => {
      const view = deriveClockView(
        baseSnapshot({
          reserveMsRemaining: 30_000,
          isRunning: true,
          startedAtMs: NOW - 15_000,
          activePlayerAccumulatedMs: 0,
          maxDecisionTimeMs: 10_000,
        }),
        NOW,
      );
      expect(view.decisionCapExceeded).toBe(true);
      expect(view.isNegative).toBe(false);
      expect(view.canSkipOpponent).toBe(true);
      expect(view.canDropOpponent).toBe(false);
    });

    it("enables both canSkip and canDrop on second stall offense (timeoutCount=1) with positive reserve", () => {
      const view = deriveClockView(
        baseSnapshot({
          reserveMsRemaining: 30_000,
          isRunning: true,
          startedAtMs: NOW - 15_000,
          activePlayerAccumulatedMs: 0,
          maxDecisionTimeMs: 10_000,
          timeoutCount: 1,
        }),
        NOW,
      );
      expect(view.canSkipOpponent).toBe(true);
      expect(view.canDropOpponent).toBe(true);
    });
  });

  describe("reserve negative while holding priority", () => {
    it("enables canDrop immediately on first reserve exhaustion (no skip)", () => {
      const view = deriveClockView(
        baseSnapshot({
          reserveMsRemaining: -5_000,
          isRunning: true,
          startedAtMs: NOW,
          isInNegativeTime: true,
        }),
        NOW,
      );
      // Reserve is gone → drop immediately, skip is not shown.
      expect(view.canSkipOpponent).toBe(false);
      expect(view.canDropOpponent).toBe(true);
    });

    it("enables canDrop (only) when reserve is exhausted regardless of timeoutCount", () => {
      const view = deriveClockView(
        baseSnapshot({
          reserveMsRemaining: -5_000,
          isRunning: true,
          startedAtMs: NOW,
          isInNegativeTime: true,
          timeoutCount: 1,
        }),
        NOW,
      );
      expect(view.canSkipOpponent).toBe(false);
      expect(view.canDropOpponent).toBe(true);
    });

    it("enables canDrop when interpolation pushes displayMs negative (no prior warning needed)", () => {
      const view = deriveClockView(
        baseSnapshot({
          reserveMsRemaining: 1_000,
          isRunning: true,
          startedAtMs: NOW - 5_000,
          isInNegativeTime: true,
          timeoutCount: 1,
        }),
        NOW,
      );
      expect(view.isNegative).toBe(true);
      expect(view.canSkipOpponent).toBe(false);
      expect(view.canDropOpponent).toBe(true);
    });

    it("enables canDrop when interpolation pushes negative even without prior warning", () => {
      const view = deriveClockView(
        baseSnapshot({
          reserveMsRemaining: 1_000,
          isRunning: true,
          startedAtMs: NOW - 5_000,
          isInNegativeTime: false,
          timeoutCount: 0,
        }),
        NOW,
      );
      expect(view.isNegative).toBe(true);
      expect(view.canSkipOpponent).toBe(false);
      expect(view.canDropOpponent).toBe(true);
    });
  });

  describe("reserve exhausted off-priority", () => {
    it("keeps canDrop available once timeoutCount >= 1 even without isRunning", () => {
      const view = deriveClockView(
        baseSnapshot({
          reserveMsRemaining: -5_000,
          isRunning: false,
          isInNegativeTime: true,
          timeoutCount: 1,
        }),
        NOW,
      );
      expect(view.canSkipOpponent).toBe(false);
      expect(view.canDropOpponent).toBe(true);
    });

    it("enables canDrop when exhausted off-priority even without prior warning", () => {
      const view = deriveClockView(
        baseSnapshot({
          reserveMsRemaining: -5_000,
          isRunning: false,
          isInNegativeTime: true,
          timeoutCount: 0,
        }),
        NOW,
      );
      expect(view.canSkipOpponent).toBe(false);
      expect(view.canDropOpponent).toBe(true);
    });
  });

  describe("priority returns to us", () => {
    it("clears canSkip but preserves canDrop when droppable-by-exhaustion", () => {
      const view = deriveClockView(
        baseSnapshot({
          reserveMsRemaining: -5_000,
          isRunning: false,
          isInNegativeTime: true,
          timeoutCount: 1,
        }),
        NOW,
      );
      expect(view.canSkipOpponent).toBe(false);
      expect(view.canDropOpponent).toBe(true);
    });

    it("clears both when the opponent recovers time and priority moves", () => {
      const view = deriveClockView(
        baseSnapshot({
          reserveMsRemaining: 60_000,
          isRunning: false,
          isInNegativeTime: false,
          timeoutCount: 0,
        }),
        NOW,
      );
      expect(view.canSkipOpponent).toBe(false);
      expect(view.canDropOpponent).toBe(false);
    });
  });

  describe("timeoutCount passthrough", () => {
    it("surfaces the current timeoutCount so the UI can render strike state", () => {
      const view = deriveClockView(baseSnapshot({ timeoutCount: 2 }), NOW);
      expect(view.timeoutCount).toBe(2);
    });
  });
});
