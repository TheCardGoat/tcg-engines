import { describe, expect, it } from "vite-plus/test";

import { gundamMoves } from "../gundam/moves/index.ts";
import { GUNDAM_MOVE_NAMES } from "../gundam/moves/move-name.ts";

import type { GundamBotCandidateFamily } from "./candidate-types.ts";
import { MOVE_BINDINGS } from "./move-binding.ts";
import { DEFAULT_POLICIES, DEFAULT_FAMILY_PRIORITY } from "./shared-policies.ts";

/**
 * Registry parity guards — the four "exhaustive boundary" tables in
 * `automation/` must agree on the set of registered moves. TypeScript
 * already enforces this at compile time via the `Record<GundamMoveName,
 * ...>` shapes; these runtime assertions document the contract and
 * surface a friendlier failure if a future refactor weakens the typing
 * (e.g. by widening one record back to `Record<string, ...>`).
 *
 * If a new move is added to `gundamMoves` without:
 *   - adding a `GundamBotCandidate` family for it,
 *   - extending `commandToCandidate`'s switch, or
 *   - adding a `MOVE_BINDINGS` / `DEFAULT_POLICIES` /
 *     `DEFAULT_FAMILY_PRIORITY` entry,
 * one of these tests will fail with the missing key.
 */
describe("registry parity: gundamMoves vs automation tables", () => {
  it("GUNDAM_MOVE_NAMES enumerates every key in gundamMoves", () => {
    expect([...GUNDAM_MOVE_NAMES].sort()).toEqual(Object.keys(gundamMoves).sort());
  });

  it("MOVE_BINDINGS covers every registered move", () => {
    expect(Object.keys(MOVE_BINDINGS).sort()).toEqual(Object.keys(gundamMoves).sort());
  });

  it("DEFAULT_POLICIES covers every candidate family", () => {
    // Every candidate family must have a default policy. The list of
    // families is the discriminator of GundamBotCandidate; we mirror it
    // here as a literal so this test fails closed if either side drifts.
    const allFamilies: GundamBotCandidateFamily[] = [
      "deployUnit",
      "deployBase",
      "playCommand",
      "assignPilot",
      "playCommandAsPilot",
      "enterBattle",
      "declareBlock",
      "activateAbility",
      "passBlock",
      "passBattleAction",
      "passActionStep",
      "passTurn",
      "concede",
      "skipOpponentTurn",
      "dropOpponent",
      "resolveEffect",
      "chooseFirstPlayer",
      "alterHand",
      "discardToHandLimit",
    ];
    expect(Object.keys(DEFAULT_POLICIES).sort()).toEqual([...allFamilies].sort());
  });

  it("DEFAULT_FAMILY_PRIORITY mirrors DEFAULT_POLICIES keys", () => {
    expect(Object.keys(DEFAULT_FAMILY_PRIORITY).sort()).toEqual(
      Object.keys(DEFAULT_POLICIES).sort(),
    );
  });

  it("every candidate family is also a registered move name", () => {
    // The candidate union's discriminator and the move registry's keys
    // are required to agree (the AI can only submit moves the engine
    // knows about, and every registered move should have a candidate
    // shape). Compile-time witness lives in candidate-types.ts; this
    // runtime check pins the exact set.
    expect(Object.keys(DEFAULT_POLICIES).sort()).toEqual(Object.keys(gundamMoves).sort());
  });
});
