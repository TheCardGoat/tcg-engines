/**
 * MON031 Raydn Duskbane — Light Warrior Sword 2H — power 0.
 *
 * Printed:
 *   a1: Once per Turn Action - 0: Attack
 *   a2: If you've charged this turn, Raydn gains +3{p}.
 *
 * Reasoning (hand-authored):
 * 1. a1 (free 0-power OPT attack) proven @ weapon-remaining-gates; this file
 *    proves the a2 charge buff.
 * 2. a2 rides the wired has-status `charged-this-turn` (history.turn.charged).
 *    The charge source in this test is Bolt of Courage (BOL011, cost 0 attack
 *    with optional additional-cost charge) — playing it charges the soul and
 *    stamps the turn fact; Raydn's continuous then applies +3{p}.
 * 3. Happy: charge via Bolt of Courage → Raydn attacks at 0+3 = 3.
 *    Boundary: no charge → Raydn attacks at 0.
 *
 * Status: ✅ a2 +3{p} after charging proven; no-charge boundary 0 (a1 @
 * weapon-remaining-gates).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, tomeOfFyendalYellow } from "../../../fixtures.ts";

import { raydnDuskbane } from "../../../../../../cards/src/cards/weapons/raydn-duskbane.ts";
import { boltOfCourageRed as boltOfCourage } from "../../../../../../cards/src/cards/actions/bolt-of-courage.ts";

const LIFE = 40;

/** Walk priorities/decisions to quiescence; boolean decisions answer true
 * (accept the optional charge), entity picks take the first candidate. */
function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 64; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: true },
        },
      });
      continue;
    }
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

describe("raydn-duskbane (MON031)", () => {
  it("a2: charge this turn (Bolt of Courage) → Raydn attacks at 0+3 = 3", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [raydnDuskbane],
        hand: [boltOfCourage, tomeOfFyendalYellow],
        resourcePoints: 0,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    // Play Bolt of Courage (cost 0, 3{p} attack) — declare the optional
    // charge additional cost with the tome (harness play option) →
    // history.turn.charged stamped; the bolt hits for 3.
    Bravo.attackWith(boltOfCourage, { charge: true, chargeCard: tomeOfFyendalYellow });
    drain(game);
    expect(Opp.life()).toBe(lifeBefore - 3);

    // Raydn's a2 now applies: 0 base + 3 = 3 damage.
    Bravo.activate(raydnDuskbane);
    game.helpers.resolveRestOfCombat();
    expect(Opp.life()).toBe(lifeBefore - 6);
  });

  it("a2 boundary: no charge this turn → Raydn attacks at 0", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [raydnDuskbane],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    Bravo.activate(raydnDuskbane);
    game.helpers.resolveRestOfCombat();

    expect(Opp.life()).toBe(lifeBefore);
  });
});
