import { describe, expect, it } from "bun:test";
import { PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import {
  createRepeatedStateDeadlockTracker,
  resolveRepeatedStateDeadlockByConceding,
  resolveStrategyMatchEndReason,
} from "./deadlock.js";

describe("strategy deadlock detection", () => {
  it("stops a match when the same actor sees the same state three times", () => {
    const tracker = createRepeatedStateDeadlockTracker();

    expect(
      tracker.observe({
        actorId: PLAYER_ONE,
        stateFingerprint: "repeat-state",
      }).repeatedStateDeadlock,
    ).toBe(false);
    expect(
      tracker.observe({
        actorId: PLAYER_TWO,
        stateFingerprint: "different-state",
      }).repeatedStateDeadlock,
    ).toBe(false);

    tracker.observe({
      actorId: PLAYER_ONE,
      stateFingerprint: "repeat-state",
    });

    const repeatedState = tracker.observe({
      actorId: PLAYER_ONE,
      stateFingerprint: "repeat-state",
    });

    expect(repeatedState.repeatedStateDeadlock).toBe(true);
    expect(
      resolveStrategyMatchEndReason({
        actionCount: 4,
        pendingDeadlock: repeatedState.repeatedStateDeadlock,
        turnNumber: 2,
      }),
    ).toBe("repeated-state-deadlock");
  });

  it("concedes the stuck actor when repeated-state deadlock is detected", () => {
    const tracker = createRepeatedStateDeadlockTracker();

    tracker.observe({
      actorId: PLAYER_ONE,
      stateFingerprint: "repeat-state",
    });
    tracker.observe({
      actorId: PLAYER_ONE,
      stateFingerprint: "repeat-state",
    });
    const observation = tracker.observe({
      actorId: PLAYER_ONE,
      stateFingerprint: "repeat-state",
    });

    let concededActor: string | undefined;
    const resolution = resolveRepeatedStateDeadlockByConceding({
      actorId: PLAYER_ONE,
      concede(actorId) {
        concededActor = actorId;
        return {
          success: true,
        };
      },
      observation,
    });

    expect(resolution).toEqual({
      attempted: true,
      conceded: true,
    });
    expect(concededActor).toBe(PLAYER_ONE);
  });
});
