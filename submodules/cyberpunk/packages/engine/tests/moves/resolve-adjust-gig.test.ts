import { describe, expect, test } from "vite-plus/test";
import { resolveAdjustGigMove } from "../../src/moves/resolve-adjust-gig.ts";
import type { MatchState, ChooseTargetPendingChoice } from "../../src/types/match-state.ts";
import type { GigDie } from "../../src/types/gig-die.ts";
import { createPlayerId, type GigDieId } from "../../src/types/branded.ts";

function stubState(opts: {
  chooserId: string;
  dieId: string;
  faceValue: number;
  direction?: "increase" | "decrease" | "either";
  maxAmount: number;
}): MatchState {
  const die: GigDie = {
    id: opts.dieId as GigDieId,
    dieType: "d6",
    faceValue: opts.faceValue,
    location: "gigArea",
    ownerId: createPlayerId(opts.chooserId),
  };
  const choice: ChooseTargetPendingChoice = {
    type: "chooseTarget",
    chooserId: createPlayerId(opts.chooserId),
    effectId: opts.dieId,
    payload: {
      type: "adjustGig",
      dieId: opts.dieId as GigDieId,
      direction: opts.direction ?? "increase",
      maxAmount: opts.maxAmount,
    },
  };
  return {
    G: {
      gigDice: { [opts.dieId]: die },
      turnMetadata: { pendingChoice: choice },
    },
    ctx: { stateID: 0 },
  } as unknown as MatchState;
}

describe("resolveAdjustGigMove.validate", () => {
  test("rejects when no pending choice", () => {
    const state = {
      G: { gigDice: {}, turnMetadata: {} },
      ctx: { stateID: 0 },
    } as unknown as MatchState;
    const result = resolveAdjustGigMove.validate!({
      state,
      playerId: createPlayerId("p1"),
      input: { args: { value: 3 } },
    });
    expect(result).toMatchObject({ valid: false, errorCode: "NO_PENDING_CHOICE" });
  });

  test("rejects when not the chooser", () => {
    const state = stubState({ chooserId: "p1", dieId: "d-1", faceValue: 3, maxAmount: 2 });
    const result = resolveAdjustGigMove.validate!({
      state,
      playerId: createPlayerId("p2"),
      input: { args: { value: 5 } },
    });
    expect(result).toMatchObject({ valid: false, errorCode: "NOT_YOUR_CHOICE" });
  });

  test("rejects value out of die face range", () => {
    const state = stubState({ chooserId: "p1", dieId: "d-1", faceValue: 3, maxAmount: 5 });
    const result = resolveAdjustGigMove.validate!({
      state,
      playerId: createPlayerId("p1"),
      input: { args: { value: 7 } },
    });
    expect(result).toMatchObject({ valid: false, errorCode: "VALUE_OUT_OF_RANGE" });
  });

  test("rejects wrong direction", () => {
    const state = stubState({
      chooserId: "p1",
      dieId: "d-1",
      faceValue: 3,
      direction: "increase",
      maxAmount: 2,
    });
    const result = resolveAdjustGigMove.validate!({
      state,
      playerId: createPlayerId("p1"),
      input: { args: { value: 2 } },
    });
    expect(result).toMatchObject({ valid: false, errorCode: "WRONG_DIRECTION" });
  });

  test("rejects when delta exceeds maxAmount", () => {
    const state = stubState({
      chooserId: "p1",
      dieId: "d-1",
      faceValue: 2,
      direction: "either",
      maxAmount: 1,
    });
    const result = resolveAdjustGigMove.validate!({
      state,
      playerId: createPlayerId("p1"),
      input: { args: { value: 5 } },
    });
    expect(result).toMatchObject({ valid: false, errorCode: "EXCEEDS_MAX_AMOUNT" });
  });

  test("accepts a valid increase within bounds", () => {
    const state = stubState({
      chooserId: "p1",
      dieId: "d-1",
      faceValue: 2,
      direction: "increase",
      maxAmount: 3,
    });
    const result = resolveAdjustGigMove.validate!({
      state,
      playerId: createPlayerId("p1"),
      input: { args: { value: 5 } },
    });
    expect(result).toEqual({ valid: true });
  });
});
