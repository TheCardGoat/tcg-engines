import { describe, expect, test } from "vite-plus/test";
import { resolveStealGigsMove } from "../../src/moves/resolve-steal-gigs.ts";
import type { MatchState, ChooseGigsToStealPendingChoice } from "../../src/types/match-state.ts";
import { createPlayerId, type CardInstanceId, type GigDieId } from "../../src/types/branded.ts";

function stubState(opts: {
  chooserId: string;
  count: number;
  eligibleDieIds: string[];
  attackInProgress?: boolean;
}): MatchState {
  const choice: ChooseGigsToStealPendingChoice = {
    type: "chooseGigsToSteal",
    chooserId: createPlayerId(opts.chooserId),
    effectId: "atk",
    payload: {
      count: opts.count,
      attackerId: "atk" as CardInstanceId,
      rivalId: createPlayerId("p2"),
      eligibleDieIds: opts.eligibleDieIds.map((id) => id as GigDieId),
    },
  };
  return {
    G: {
      gigDice: {},
      turnMetadata: { pendingChoice: choice },
      attackState: opts.attackInProgress
        ? { attackerId: "atk", rivalId: "p2", kind: "direct", step: "resolve" }
        : null,
    },
    ctx: { stateID: 0 },
  } as unknown as MatchState;
}

describe("resolveStealGigsMove.validate", () => {
  test("rejects when not the chooser", () => {
    const state = stubState({
      chooserId: "p1",
      count: 2,
      eligibleDieIds: ["a", "b", "c"],
      attackInProgress: true,
    });
    const result = resolveStealGigsMove.validate!({
      state,
      playerId: createPlayerId("p2"),
      input: { args: { dieIds: ["a", "b"] } },
    });
    expect(result).toMatchObject({ valid: false, errorCode: "NOT_YOUR_CHOICE" });
  });

  test("rejects duplicate die ids", () => {
    const state = stubState({
      chooserId: "p1",
      count: 2,
      eligibleDieIds: ["a", "b", "c"],
      attackInProgress: true,
    });
    const result = resolveStealGigsMove.validate!({
      state,
      playerId: createPlayerId("p1"),
      input: { args: { dieIds: ["a", "a"] } },
    });
    expect(result).toMatchObject({ valid: false, errorCode: "DUPLICATE_DIE_IDS" });
  });

  test("rejects wrong count", () => {
    const state = stubState({
      chooserId: "p1",
      count: 2,
      eligibleDieIds: ["a", "b", "c"],
      attackInProgress: true,
    });
    const result = resolveStealGigsMove.validate!({
      state,
      playerId: createPlayerId("p1"),
      input: { args: { dieIds: ["a"] } },
    });
    expect(result).toMatchObject({ valid: false, errorCode: "INVALID_AMOUNT" });
  });

  test("rejects ineligible die", () => {
    const state = stubState({
      chooserId: "p1",
      count: 2,
      eligibleDieIds: ["a", "b", "c"],
      attackInProgress: true,
    });
    const result = resolveStealGigsMove.validate!({
      state,
      playerId: createPlayerId("p1"),
      input: { args: { dieIds: ["a", "z"] } },
    });
    expect(result).toMatchObject({ valid: false, errorCode: "INVALID_DIE" });
  });

  test("rejects when no attack is in progress", () => {
    const state = stubState({
      chooserId: "p1",
      count: 1,
      eligibleDieIds: ["a"],
      attackInProgress: false,
    });
    const result = resolveStealGigsMove.validate!({
      state,
      playerId: createPlayerId("p1"),
      input: { args: { dieIds: ["a"] } },
    });
    expect(result).toMatchObject({ valid: false, errorCode: "NO_ATTACK" });
  });

  test("accepts a valid pick", () => {
    const state = stubState({
      chooserId: "p1",
      count: 2,
      eligibleDieIds: ["a", "b", "c"],
      attackInProgress: true,
    });
    const result = resolveStealGigsMove.validate!({
      state,
      playerId: createPlayerId("p1"),
      input: { args: { dieIds: ["a", "b"] } },
    });
    expect(result).toEqual({ valid: true });
  });
});
