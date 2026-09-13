/**
 * OUT009 Scale Peeler — Assassin Dagger 1H — power 1, piercing 1.
 *
 * Printed:
 *   a1: Once per Turn Action - {r}{r}: Attack. Go again
 *   a2: When this hits a hero, the next time they defend with 1 or more
 *       equipment this turn, those equipment have -1{d} while defending.
 *
 * Reasoning (hand-authored):
 * 1. a1 proven @ weapon-opt-attack-wave2; this file proves the a2 clause.
 * 2. CARD MODEL FIX: the defend filters used subtypes:["Equipment"] —
 *    Equipment is a type-line token (FAB_TYPES), so subtypes never matched
 *    (§7 wordFilter family). Remodeled to types:["Equipment"].
 * 3. Happy: an equipment defender (Ironrot Helm d1) is debuffed to d0 →
 *    Snatch (4{p}) deals full 4. Boundary: a hand-card defender (Nimblism
 *    d2, not equipment) is outside the filter → 4-2 = 2.
 *
 * Status: ✅ a2 debuff on equipment defenders proven; non-equipment defenders
 * unaffected (a1 @ weapon-opt-attack-wave2).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue, ironrotHelm } from "../../../fixtures.ts";

import { scalePeeler } from "../../../../../../cards/src/cards/weapons/scale-peeler.ts";

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

describe("scale-peeler (OUT009)", () => {
  it("a2: hit → equipment defender gets -1{d} (d1 → d0)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [scalePeeler],
        hand: [snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [ironrotHelm],
        hand: [],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    // Attack 1: Scale Peeler (1{p}) hits undefended → 1 damage, a2 armed.
    Bravo.activate(scalePeeler);
    game.helpers.resolveRestOfCombat();
    expect(Opp.life()).toBe(lifeBefore - 1);

    // Attack 2: Snatch (4{p}). Dash declares Ironrot Helm — equipment (d1)
    // → debuffed to d0 → full 4 damage.
    Bravo.attackWith(snatchRed);
    Opp.defendWith(ironrotHelm);
    drain(game);

    expect(Opp.life()).toBe(lifeBefore - 5); // 1 + 4
  });

  it("a2 boundary: a non-equipment hand defender is NOT debuffed", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [scalePeeler],
        hand: [snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [nimblismBlue], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    Bravo.activate(scalePeeler);
    game.helpers.resolveRestOfCombat();

    // Nimblism (action, d2) is not equipment — outside the a2 filter.
    Bravo.attackWith(snatchRed);
    Opp.defendWith(nimblismBlue);
    drain(game);

    expect(Opp.life()).toBe(lifeBefore - 3); // 1 + 2
  });
});
