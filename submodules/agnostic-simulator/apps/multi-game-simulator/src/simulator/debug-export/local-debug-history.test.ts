import { describe, expect, it, vi } from "vitest";

import { LocalSimulatorDebugHistoryRecorder } from "./local-debug-history";

describe("LocalSimulatorDebugHistoryRecorder", () => {
  it("exports the original and range-start states with accepted transitions", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-31T12:00:00.000Z"));
    const recorder = new LocalSimulatorDebugHistoryRecorder(
      { slug: "one-piece", gameId: "local-1", matchId: "practice-1" },
      { count: 0 },
    );
    recorder.record({
      stateAfter: { count: 1 },
      stateVersion: 1,
      turnNumber: 1,
      actorId: "south",
      moveId: "draw",
      input: { type: "draw" },
      timestamp: 100,
      domainEvents: [{ type: "card-drawn" }],
    });
    recorder.record({
      stateAfter: { count: 2 },
      stateVersion: 2,
      turnNumber: 1,
      actorId: "north",
      moveId: "pass",
      timestamp: 200,
    });

    const value = await recorder.load({ startMove: 2, endMove: 2 });
    expect(value?.originalInitialState).toEqual({ count: 0 });
    expect(value?.stateBeforeRange).toEqual({ count: 1 });
    expect(value?.moves).toEqual([
      expect.objectContaining({ index: 2, moveId: "pass", stateVersion: 2 }),
    ]);
    expect(value?.domainEvents).toEqual([]);
    vi.useRealTimers();
  });

  it("normalizes optional undefined fields at the JSON recording boundary", async () => {
    const recorder = new LocalSimulatorDebugHistoryRecorder(
      { slug: "naruto", gameId: "local-2", matchId: "practice-2" },
      { turn: 0, optional: undefined },
    );
    recorder.record({
      stateAfter: { turn: 1, optional: undefined },
      turnNumber: 1,
      actorId: "p1",
      moveId: "MULLIGAN",
      input: { keep: true, optional: undefined },
      domainEvents: [{ key: "log.keep", values: undefined }],
    });

    const value = await recorder.load({});
    expect(value?.originalInitialState).toEqual({ turn: 0 });
    expect(value?.moves[0]?.input).toEqual({ keep: true });
    expect(value?.domainEvents[0]?.event).toEqual({ key: "log.keep" });
  });
});
