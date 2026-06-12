import { describe, expect, it } from "vite-plus/test";

import { deriveClockView, formatClockTime, type ClockSnapshot } from "./clock-view.ts";

function snapshot(overrides: Partial<ClockSnapshot> = {}): ClockSnapshot {
  return {
    reserveMsRemaining: 60_000,
    isRunning: false,
    timeoutCount: 0,
    isInNegativeTime: false,
    ...overrides,
  };
}

describe("clock-view", () => {
  it("formats positive and negative clock values", () => {
    expect(formatClockTime(0)).toBe("0:00");
    expect(formatClockTime(59_999)).toBe("0:59");
    expect(formatClockTime(60_000)).toBe("1:00");
    expect(formatClockTime(-65_000)).toBe("-1:05");
  });

  it("interpolates running reserve from the supplied timestamp", () => {
    const view = deriveClockView(
      snapshot({ reserveMsRemaining: 30_000, isRunning: true, startedAtMs: 1_000 }),
      6_000,
    );

    expect(view.displayMs).toBe(25_000);
    expect(view.formattedTime).toBe("0:25");
    expect(view.urgencyClass).toBe("timer--warning");
  });

  it("does not report running when a snapshot cannot be interpolated", () => {
    const view = deriveClockView(snapshot({ reserveMsRemaining: 30_000, isRunning: true }), 6_000, {
      isOwnClock: true,
    });

    expect(view.displayMs).toBe(30_000);
    expect(view.isRunning).toBe(false);
    expect(view.shouldPlayLowTimeTick).toBe(false);
  });

  it("derives skip/drop affordances from decision cap and timeout count", () => {
    const firstStall = deriveClockView(
      snapshot({
        isRunning: true,
        startedAtMs: 0,
        activePlayerAccumulatedMs: 5_000,
        maxDecisionTimeMs: 10_000,
      }),
      11_000,
    );
    expect(firstStall.canSkipOpponent).toBe(true);
    expect(firstStall.canDropOpponent).toBe(false);

    const secondStall = deriveClockView(
      snapshot({
        isRunning: true,
        startedAtMs: 0,
        activePlayerAccumulatedMs: 5_000,
        maxDecisionTimeMs: 10_000,
        timeoutCount: 1,
      }),
      11_000,
    );
    expect(secondStall.canSkipOpponent).toBe(true);
    expect(secondStall.canDropOpponent).toBe(true);
  });

  it("makes exhausted reserve droppable without skip", () => {
    const view = deriveClockView(
      snapshot({ reserveMsRemaining: 2_000, isRunning: true, startedAtMs: 0 }),
      3_000,
    );

    expect(view.isNegative).toBe(true);
    expect(view.canSkipOpponent).toBe(false);
    expect(view.canDropOpponent).toBe(true);
    expect(view.urgencyClass).toBe("timer--critical");
  });
});
