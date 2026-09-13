/**
 * HVY006 Ball Breaker — Brute Flail 1H — power 3.
 *
 * Printed:
 *   a1: Once per Turn Action - {r}{r}: Attack
 *   a2: If you've discarded a card with 6 or more {p} this turn, this gets
 *       +1{p}.
 *
 * Reasoning (hand-authored):
 * 1. a1 (2{r} 3-power OPT attack) proven @ weapon-hvy-out; this file proves
 *    the a2 continuous +1-power gate.
 * 2. a2: continuous static gated on existing has-status
 *    `discarded-a-card-with-6-or-more-p-this-turn` which maps to the
 *    `playerDiscardedPower6` fact (already wired in has-status.ts). The
 *    fact is stamped by Brute discards of 6+ power cards. The continuous
 *    condition is evaluated via resolveSubjects → evaluateCondition
 *    (atom.condition path, cycle-10 quicksilver discovery).
 * 3. Vehicle: Primeval Bellow's random-discard cost with Writhing Beast
 *    Hulk (6+ power) in hand → stamps discardedPower6 → a2 +1.
 *    Bellow also grants next Brute attack +5{p}, so ball-breaker
 *    deals 3 + 5 + 1 = 9. Boundary: baseline 3 without discard/fact.
 *    The a2's +1 is the delta above Bellow's +5 (9 vs 8).
 *
 * Status: ✅ a2 discarded-6+ → +1-power proven (a1 @ weapon-hvy-out).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { dash, snatchRed, writhingBeastHulkRed } from "../../../fixtures.ts";

import { ballBreaker } from "../../../../../../cards/src/cards/weapons/ball-breaker.ts";
import { rhinar } from "../../../../../../cards/src/cards/heroes/rhinar.ts";
import { primevalBellowRed } from "../../../../../../cards/src/cards/actions/primeval-bellow.ts";

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
          answer: { kind: "ordering", orderedIds: decision.entries.map((e) => e.id) },
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
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: false },
        },
      });
      continue;
    }
    if (decision && game.answerForcedDecision()) continue;
    if (decision) break;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("ball-breaker (HVY006)", () => {
  it("a2: discarded 6+ power → +1{p} (3+1=4)", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [ballBreaker],
        // Primeval Bellow's random-discard cost: Writhing Beast Hulk (6{p})
        // is discarded → stamps discardedPower6 fact.
        hand: [primevalBellowRed, writhingBeastHulkRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [snatchRed], deck: 6 },
      { autoPassPriority: false },
    );
    const Rhinar = game.as(rhinar);
    const Opp = game.as(dash);

    // Step 1: Play Primeval Bellow → random-discard stamps discardedPower6
    Rhinar.play(primevalBellowRed);
    drain(game);
    expect(game.getState().players[Rhinar.id]!.history.turn.discardedPower6).toBe(true);

    // Step 2: Activate Ball Breaker → a2 continuous gate (+1) + Bellow buff
    // (+5) = 3+5+1 = 9.  The a2's +1 is the delta above Bellow's +5.
    const lifeBefore = Opp.life();
    Rhinar.activate(ballBreaker);
    game.helpers.resolveRestOfCombat();

    expect(Opp.life()).toBe(lifeBefore - 9); // 3 + 5 + 1 = 9
  });

  it("a2 boundary: no 6+ discard → base power only (3)", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [ballBreaker],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Rhinar = game.as(rhinar);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    Rhinar.activate(ballBreaker);
    game.helpers.resolveRestOfCombat();

    expect(Opp.life()).toBe(lifeBefore - 3); // base 3, no buff
  });
});
