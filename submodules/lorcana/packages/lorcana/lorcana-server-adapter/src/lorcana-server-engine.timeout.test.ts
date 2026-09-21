import { describe, expect, it } from "bun:test";
import type { LorcanaServer } from "@tcg/lorcana-engine";
import { LorcanaServerEngine } from "./lorcana-server-engine";

function timedState(activePlayerID = "p2", timeoutCount = 0) {
  const now = Date.now();
  return {
    ctx: {
      _stateID: 7,
      time: {
        mode: "chess",
        running: false,
        activePlayerID,
        players: {
          p1: {
            reserveMsRemaining: 60_000,
            totalConsumedMs: 0,
            movesMade: 0,
            lastUpdatedAtMs: now,
            timeoutCount: 0,
            isInNegativeTime: false,
          },
          p2: {
            reserveMsRemaining: -1,
            totalConsumedMs: 60_001,
            movesMade: 0,
            lastUpdatedAtMs: now,
            timeoutCount,
            isInNegativeTime: true,
          },
        },
        config: {
          initialReserveMs: 60_000,
          incrementMs: 0,
          delayMs: 0,
          graceMs: 0,
          resetTimeOnSkipMs: 45_000,
          lossPolicy: "lose-on-time",
        },
      },
    },
  };
}

describe("LorcanaServerEngine timeout recovery", () => {
  it("owns timeout evaluation instead of leaking Lorcana state into platform", () => {
    const state = timedState();
    const engine = new LorcanaServerEngine({
      getState: () => state,
    } as unknown as LorcanaServer);

    expect(
      engine.evaluateOpponentTimeout({
        requesterPlayerId: "p1",
        opponentPlayerId: "p2",
        nowMs: Date.now(),
      }),
    ).toMatchObject({
      skip: {
        allowed: true,
        timeout: "first",
        stallerPlayerId: "p2",
        timeoutCount: 0,
        forceDrop: false,
        resetTimeOnSkipMs: 45_000,
      },
      drop: { allowed: true, reason: "timeout_allowed" },
    });
  });

  it("resets the clock and increments timeout count only when the engine has not", () => {
    const state = timedState("p1");
    let loaded: ReturnType<typeof timedState> | undefined;
    const engine = new LorcanaServerEngine({
      getState: () => state,
      loadState: (next: ReturnType<typeof timedState>) => {
        loaded = next;
      },
    } as unknown as LorcanaServer);

    engine.resetPlayerTimeAfterSkip("p2", {
      resetMs: 30_000,
      previousTimeoutCount: 0,
    });

    expect(loaded?.ctx.time.players.p2).toMatchObject({
      reserveMsRemaining: 30_000,
      timeoutCount: 1,
      isInNegativeTime: false,
    });
  });

  it("waits for negative-time grace before a reserve drop", () => {
    const now = 1_700_000_000_000;
    const state = {
      ctx: {
        _stateID: 7,
        time: {
          mode: "dynamic",
          running: true,
          activePlayerID: "p2",
          startedAtMs: now,
          players: {
            p2: {
              reserveMsRemaining: 0,
              timeoutCount: 0,
              isInNegativeTime: true,
            },
          },
          config: { graceMs: 15_000, resetTimeOnSkipMs: 45_000, maxDecisionTimeMs: 180_000 },
        },
      },
    };
    const engine = new LorcanaServerEngine({
      getState: () => state,
    } as unknown as LorcanaServer);

    expect(
      engine.evaluateOpponentTimeout({
        requesterPlayerId: "p1",
        opponentPlayerId: "p2",
        nowMs: now + 14_999,
      }).drop,
    ).toMatchObject({
      allowed: false,
      reason: "timeout_grace_pending",
      remainingMs: 1,
    });
    expect(
      engine.evaluateOpponentTimeout({
        requesterPlayerId: "p1",
        opponentPlayerId: "p2",
        nowMs: now + 15_000,
      }).drop.allowed,
    ).toBe(true);
  });

  it("keeps the second offense on the bot path while the opponent has priority", () => {
    const state = timedState("p2", 1);
    const engine = new LorcanaServerEngine({
      getState: () => state,
    } as unknown as LorcanaServer);

    expect(
      engine.evaluateOpponentTimeout({
        requesterPlayerId: "p1",
        opponentPlayerId: "p2",
        nowMs: Date.now(),
      }),
    ).toMatchObject({
      skip: {
        allowed: true,
        timeout: "second",
        stallerPlayerId: "p2",
        timeoutCount: 1,
        forceDrop: false,
        resetTimeOnSkipMs: 45_000,
      },
      drop: { allowed: true, reason: "timeout_allowed" },
    });
  });
});
