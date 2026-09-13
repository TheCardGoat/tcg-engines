/**
 * DYN115 Spider's Bite — Assassin Dagger 1H — power 1, piercing 1.
 *
 * Printed:
 *   a1: Once per Turn Action - {r}{r}: Attack. Go again
 *   a2: When this hits a hero, the next time they defend with 1 or more
 *       attack action cards this turn, those cards have -1{d} while defending.
 *
 * Reasoning (hand-authored):
 * 1. a1 (2{r} go-again piercing dagger) proven @ weapon-dtd-dyn; this file
 *    proves the a2 defense-debuff clause.
 * 2. a2 shape: hit (target hero) → delayed-trigger on defend (opponent,
 *    filter types Action + subtypes Attack, comparison gte 1, per turn) →
 *    at-resolution combat-chain modify-numeric defense -1 (star, defending)
 *    for this chain link. This is the pilot for the OUT005/007/009 family
 *    (same delayed-trigger-defend debuff, different card filters).
 * 3. Happy: Spider's Bite hits → opponent later defends with an attack
 *    action card (Snatch d2) → debuffed to d1 → the 4{p} follow-up deals
 *    4-1 = 3. Boundary: defending with a non-attack action (Rattle Bones
 *    d3) gets NO debuff → 4-3 = 1.
 *
 * Status: ✅ a2 debuff proven on attack-action defenders; non-attack defenders
 * unaffected (a1 @ weapon-dtd-dyn).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, rattleBonesRed } from "../../../fixtures.ts";

import { spiderSBite } from "../../../../../../cards/src/cards/weapons/spider-s-bite.ts";

const LIFE = 40;

/** Walk priorities/decisions to combat close, answering every decision kind. */
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
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("spider-s-bite (DYN115)", () => {
  it("a2: hit → next defend with an attack action card has -1{d} (d2 → d1)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [spiderSBite],
        hand: [snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [snatchRed], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    // Attack 1: Spider's Bite (1{p}) hits undefended → 1 damage, a2 armed.
    Bravo.activate(spiderSBite);
    game.helpers.resolveRestOfCombat();
    expect(Opp.life()).toBe(lifeBefore - 1);

    // Attack 2: Snatch (4{p}). Dash defends with Snatch — an attack ACTION
    // card (d2) → a2 debuffs it to d1 → 4 - 1 = 3 damage.
    Bravo.attackWith(snatchRed);
    Opp.defendWith(snatchRed);
    drain(game);

    expect(Opp.life()).toBe(lifeBefore - 4); // 1 + 3
  });

  it("a2 boundary: defending with a non-attack action card is NOT debuffed", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [spiderSBite],
        hand: [snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [rattleBonesRed], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    Bravo.activate(spiderSBite);
    game.helpers.resolveRestOfCombat();

    // Rattle Bones is a non-attack Action (d3) — outside the a2 filter.
    Bravo.attackWith(snatchRed);
    Opp.defendWith(rattleBonesRed);
    drain(game);

    expect(Opp.life()).toBe(lifeBefore - 2); // 1 + (4 - 3)
  });
});
