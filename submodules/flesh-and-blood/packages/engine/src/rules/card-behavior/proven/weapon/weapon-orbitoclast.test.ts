/**
 * OUT007 Orbitoclast — Assassin Dagger 1H — power 1, piercing 1.
 *
 * Printed:
 *   a1: Once per Turn Action - {r}{r}: Attack. Go again
 *   a2: When this hits a hero, the next time they defend with 1 or more
 *       non-attack action cards this turn, those cards have -1{d} while
 *       defending.
 *
 * Reasoning (hand-authored):
 * 1. a1 proven @ weapon-opt-attack-wave2; this file proves the a2 clause.
 * 2. CARD MODEL FIX: the defend filters used subtypes:["'non-attack'"] —
 *    parser garbage that never matches. Remodeled to subtypes:["Non-attack"],
 *    the canonical pseudo-subtype (matches-filter: must NOT carry "Attack").
 * 3. Happy: a non-attack Action defender (Rattle Bones d3) is debuffed to d2
 *    → Snatch (4{p}) deals 4-2 = 2. Boundary: an attack ACTION card defender
 *    (Swing Big d3) is outside the non-attack filter → full 4-3 = 1.
 *
 * Status: ✅ a2 debuff on non-attack-action defenders proven; attack-card
 * defenders unaffected (a1 @ weapon-opt-attack-wave2).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, rattleBonesRed } from "../../../fixtures.ts";

import { orbitoclast } from "../../../../../../cards/src/cards/weapons/orbitoclast.ts";
import { swingBigRed } from "../../../../../../cards/src/cards/actions/swing-big.ts";

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

describe("orbitoclast (OUT007)", () => {
  it("a2: hit → non-attack Action defender gets -1{d} (d3 → d2)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [orbitoclast],
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

    // Attack 1: Orbitoclast (1{p}) hits undefended → 1 damage, a2 armed.
    Bravo.activate(orbitoclast);
    game.helpers.resolveRestOfCombat();
    expect(Opp.life()).toBe(lifeBefore - 1);

    // Attack 2: Snatch (4{p}). Rattle Bones is a non-attack Action (d3) →
    // debuffed to d2 → 4 - 2 = 2.
    Bravo.attackWith(snatchRed);
    Opp.defendWith(rattleBonesRed);
    drain(game);

    expect(Opp.life()).toBe(lifeBefore - 3); // 1 + 2
  });

  it("a2 boundary: an attack ACTION card defender is NOT debuffed", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [orbitoclast],
        hand: [snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [swingBigRed], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    Bravo.activate(orbitoclast);
    game.helpers.resolveRestOfCombat();

    // Swing Big is an attack ACTION card (d3) — carries "Attack", so the
    // Non-attack filter excludes it → full 4 - 3 = 1.
    Bravo.attackWith(snatchRed);
    Opp.defendWith(swingBigRed);
    drain(game);

    expect(Opp.life()).toBe(lifeBefore - 2); // 1 + 1
  });
});
