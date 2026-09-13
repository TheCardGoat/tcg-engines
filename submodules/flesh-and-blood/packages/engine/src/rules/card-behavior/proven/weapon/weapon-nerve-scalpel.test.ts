/**
 * OUT005 Nerve Scalpel — Assassin Dagger 1H — power 1, piercing 1.
 *
 * Printed:
 *   a1: Once per Turn Action - {r}{r}: Attack. Go again
 *   a2: When this hits a hero, the next time they defend with 1 or more
 *       reaction cards this turn, those cards have -1{d} while defending.
 *
 * Reasoning (hand-authored):
 * 1. a1 proven @ weapon-hvy-out; this file proves the a2 debuff clause.
 * 2. CARD MODEL FIX: the defend filter used subtypes:["Reaction"] — Reaction
 *    is not a vocabulary subtype, so the trigger never matched. Remodeled to
 *    or:[types:["Attack Reaction"] | types:["Defense Reaction"]].
 * 3. Timing: DR cards cannot be DECLARED as defenders (CR 7.3.2a) — they
 *    defend by being PLAYED in the Reaction Step (CR 7.3 example: a played
 *    defense reaction is added as a defending card). The happy path walks the
 *    proven 07-combat reaction-step flow: pass defend → pass to reaction →
 *    defender plays Unmovable (d7 DR, cost 3) → it becomes a defender →
 *    debuffed to d6 → Swing Big (8{p}) deals 8-6 = 2.
 * 4. Boundary: declaring a non-reaction action (Rattle Bones d3) gets NO
 *    debuff → 8-3 = 5.
 *
 * Status: ✅ a2 debuff on reaction-step DR defenders proven; non-reaction
 * defenders unaffected (a1 @ weapon-hvy-out).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, unmovableRed, rattleBonesRed } from "../../../fixtures.ts";

import { nerveScalpel } from "../../../../../../cards/src/cards/weapons/nerve-scalpel.ts";
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
    if (game.declareNoDefenseIfPending()) continue;
    const prio = game.getPriorityPlayerId();
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("nerve-scalpel (OUT005)", () => {
  it("a2: hit → reaction-step DR defender gets -1{d} (d7 → d6)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [nerveScalpel],
        hand: [swingBigRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [unmovableRed], resourcePoints: 3, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    // Attack 1: Nerve Scalpel (1{p}) hits undefended → 1 damage, a2 armed.
    Bravo.activate(nerveScalpel);
    game.helpers.resolveRestOfCombat();
    expect(Opp.life()).toBe(lifeBefore - 1);

    // Attack 2: Swing Big (8{p}). Dash cannot DECLARE the DR (CR 7.3.2a) —
    // walk to the Reaction Step and PLAY it (07-combat proven flow).
    Bravo.attackWith(swingBigRed);
    Opp.defendWith([]);
    Bravo.pass();
    Opp.pass();
    Bravo.pass(); // reaction priority starts with the turn player (CR 7.4.2)
    Opp.play(unmovableRed); // d7 DR becomes a defending card, debuffed to d6
    drain(game);

    // 8 - 6 = 2 damage on top of the first hit's 1.
    expect(Opp.life()).toBe(lifeBefore - 3);
  });

  it("a2 boundary: a declared non-reaction defender gets NO debuff", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [nerveScalpel],
        hand: [swingBigRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [rattleBonesRed], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    Bravo.activate(nerveScalpel);
    game.helpers.resolveRestOfCombat();

    // Rattle Bones (non-reaction action, d3) is declared normally — outside
    // the reaction filter → full 8 - 3 = 5.
    Bravo.attackWith(swingBigRed);
    Opp.defendWith(rattleBonesRed);
    drain(game);

    expect(Opp.life()).toBe(lifeBefore - 6); // 1 + 5
  });
});
