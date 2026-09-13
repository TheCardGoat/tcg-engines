/**
 * DTD205 Decimator Great Axe — Warrior Axe 2H — power 4.
 *
 * Printed:
 *   a1: Once per Turn Action - {r}{r}{r}: Attack
 *   a2: The first time this is defended by a non-equipment card each turn,
 *       halve the base {d} of target defending card, rounded up, until end
 *       of turn.
 *
 * Reasoning (hand-authored):
 * 1. a1 (3{r} 4-power OPT attack) rides the standard weapon-attack path;
 *    this file proves the a2 halve-defense clause.
 * 2. a2: triggered on defend event, ordinal [1], excludeTypes Equipment,
 *    modify-numeric defense divide 2 rounding up (fully supported by
 *    numeric atom evaluator + continuous compiler). Targets the defending
 *    object on the combat chain (selector object, filter defending:true).
 *    The defend-trigger scoping issue (§7 OPEN "attacked-side defend
 *    scoping") is masked in 1v1 because only the decimator's own attack is
 *    active; no subject:self needed for this test.
 * 3. Happy: decimator attacks (4{p}) → Dash defends snatch (d2, non-equip)
 *    → a2 ordinal [1] fires → d2 div 2 round up = 1 → 4-1 = 3 dmg.
 *    Boundary: no defend → 4 dmg, no a2.
 *
 * Status: ✅ a2 halve-defend proven; no-defend boundary (a1 @ weapon-hvy-out).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";

import { decimatorGreatAxe } from "../../../../../../cards/src/cards/weapons/decimator-great-axe.ts";

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
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("decimator-great-axe (DTD205)", () => {
  it("a2: defended by non-equipment → halve defense (d3→2, 4-2=2)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [decimatorGreatAxe],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [snatchRed], deck: 6 },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    Bravo.activate(decimatorGreatAxe);
    expect(game.combat()?.step).toBe("defend");

    // Snatch (d2, non-Equipment) — trigger ordinal [1] halves d to 1.
    Opp.defendWith(snatchRed);
    drain(game);

    expect(Opp.life()).toBe(lifeBefore - 3); // 4{p} − d1 = 3
  });

  it("a2 boundary: no defend → full damage, no halve", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [decimatorGreatAxe],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    Bravo.activate(decimatorGreatAxe);
    game.helpers.resolveRestOfCombat();

    expect(Opp.life()).toBe(lifeBefore - 4); // undefended 4-power attack
  });
});
