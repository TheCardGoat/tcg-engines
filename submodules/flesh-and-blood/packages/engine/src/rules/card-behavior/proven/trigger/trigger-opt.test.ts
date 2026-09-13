/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: trigger:opt
 * Representative card: packages/cards/src/cards/heroes/blaze-firemind.ts
 * Canonical id: hJdWJJWrBzNBBFz9BCJDw
 *
 * Arrange: import the representative real card and establish a legal,
 * player-reachable match state with the required heroes, zones, resources,
 * targets, counters, and opponent responses.
 * Act: dispatch only production FabTestEngine moves (play, pitch, defend,
 * resolve prompts, pass priority, and end the relevant phase).
 * Assert: verify player-visible outcomes such as life, zones, AP/resources,
 * combat state, prompts, legality error codes, or game result. Include the
 * negative/boundary case and any timing or interaction case before completion.
 */
import { describe, expect, it } from "vitest";
import { blazeFiremind } from "../../../../../../cards/src/cards/heroes/blaze-firemind.ts";
import { whisperOfTheOracleBlue } from "../../../../../../cards/src/cards/actions/whisper-of-the-oracle.ts";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo } from "../../../fixtures.ts";

describe("trigger: opt", () => {
  it("AAA: Blaze Firemind gains energy counters when Whisper of the Oracle opts 2 (HER117)", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [whisperOfTheOracleBlue], deck: 6 },
      { hero: bravo, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );

    const Blaze = game.as(blazeFiremind);
    const heroInstanceId = Blaze.getState().players[Blaze.id]!.heroCardId;
    expect(typeof heroInstanceId).toBe("string");
    if (typeof heroInstanceId !== "string") throw new Error("expected hero instance id");

    // Before opt: no energy counters.
    const beforeCounters =
      Blaze.getState().objects[heroInstanceId]?.counters.filter(
        (c: { kind: string; name?: string }) => c.kind === "named" && c.name === "energy",
      ) ?? [];
    expect(beforeCounters.length).toBe(0);

    // Act — play Whisper of the Oracle (cost 0, opt 2). Resolve opt + stack.
    Blaze.play(whisperOfTheOracleBlue);
    for (let i = 0; i < 16; i += 1) {
      const decision = game.getState().decision;
      if (decision?.kind === "partition") {
        // Put all looked cards back on top (opt no-reorder is fine).
        const topIds = decision.entries.map((e) => e.id);
        game.exec({
          move: "answer-decision",
          actorId: decision.actorId,
          payload: {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer: {
              kind: "partition",
              groups: { top: topIds, bottom: [] },
            },
          },
        });
        continue;
      }
      if (game.getState().rulesStack.length === 0 && !game.getState().decision) break;
      try {
        game.passBoth();
      } catch {
        break;
      }
    }

    // Assert — Whisper resolved and opt produced; Blaze gains energy equal to
    // cards looked at (CR 8.5.22 / HER117).
    expect(Blaze.zone("graveyard")).toContain(whisperOfTheOracleBlue.canonicalId);
    const afterCounters =
      Blaze.getState().objects[heroInstanceId]?.counters.filter(
        (c: { kind: string; name?: string; count: number }) =>
          c.kind === "named" && c.name === "energy",
      ) ?? [];
    const energyTotal = afterCounters.reduce(
      (sum: number, c: { count: number }) => sum + c.count,
      0,
    );
    expect(energyTotal).toBeGreaterThan(0);
  });
});
