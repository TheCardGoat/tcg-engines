/**
 * DYN088 Hanabi Blaster — Mechanologist Gun 2H — power 5, OVERPOWER.
 *
 * Printed:
 *   a1: Once per Turn Action - Remove 2 steam counters from Hanabi Blaster:
 *       Attack
 *   a2: The third time you play a card with boost each turn, put a steam
 *       counter on Hanabi Blaster.
 *
 * Reasoning (hand-authored):
 * 1. a1 (remove 2 steam → 5-power attack + OPT second-illegal) proven @
 *    weapon-final-pending; this file proves the a2 steam-gain clause.
 * 2. a2 is an ordinal-[3] trigger on play events whose card carries the
 *    boost keyword. The trigger counts the play event's card keyword — the
 *    boost declaration IS NOT needed for the trigger to advance; playing a
 *    boost-keyword card with `boost: false` still matches.
 *    Vehicles: Fast and Furious (AIO009, 0{r}, boost keyword) ×2 without
 *    boost declaration + Throttle (ARC023, 2{r}) with actual boost on the
 *    third play.  (A second real-boost play crashes the journal transaction
 *    — a latent issue documented in a §7 OPEN row.)
 * 3. Happy: two keyword plays (no-boost) + 3rd with boost → 1 steam counter
 *    asserted via game.objectState. Boundary: two keyword plays → no counter.
 *
 * Status: ✅ a2 3rd-boost steam counter proven; 2-play boundary (a1 @
 * weapon-final-pending).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, throttleRed } from "../../../fixtures.ts";

import { hanabiBlaster } from "../../../../../../cards/src/cards/weapons/hanabi-blaster.ts";
import { fastAndFuriousRed } from "../../../../../../cards/src/cards/actions/fast-and-furious.ts";

const LIFE = 40;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 64; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "ordering") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "ordering", orderedIds: decision.entries.map((entry) => entry.id) },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      const pick = decision.candidates[0];
      if (!pick && (decision.min ?? 1) > 0) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: pick ? [pick.instanceId] : [] },
        },
      });
      continue;
    }
    if (decision && game.answerForcedDecision()) continue;
    if (decision) break;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    if (game.declareNoDefenseIfPending()) continue;
    const prio = game.getPriorityPlayerId();
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

function hanabiId(game: ReturnType<typeof FabTestEngine.start>): string {
  const state = game.getState();
  return Object.values(state.objects).find((o) => o.canonicalId === hanabiBlaster.canonicalId)!
    .instanceId;
}

describe("hanabi-blaster (DYN088)", () => {
  it("a2: third boost play this turn → 1 steam counter", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [hanabiBlaster],
        hand: [fastAndFuriousRed, fastAndFuriousRed, throttleRed],
        resourcePoints: 4,
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const id = hanabiId(game);

    // Play 1 + 2: boost-keyword cards played WITHOUT actual boost
    // (the keyword on the card still advances the ordinal counter).
    Bravo.play(fastAndFuriousRed, { boost: false });
    drain(game);
    Bravo.play(fastAndFuriousRed, { boost: false });
    drain(game);
    expect(game.objectState(id).steamCounters ?? 0).toBe(0);

    // Play 3 WITH actual boost — the ordinal-[3] trigger fires → +1 steam.
    Bravo.play(throttleRed, { boost: true });
    drain(game);
    expect(game.objectState(id).steamCounters ?? 0).toBe(1);
  });

  it("a2 boundary: two boost plays → no counter", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [hanabiBlaster],
        hand: [fastAndFuriousRed, fastAndFuriousRed],
        resourcePoints: 0,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const id = hanabiId(game);

    Bravo.play(fastAndFuriousRed, { boost: false });
    drain(game);
    Bravo.play(fastAndFuriousRed, { boost: false });
    drain(game);

    expect(game.objectState(id).steamCounters ?? 0).toBe(0);
  });
});
