/**
 * DVR002 Dawnblade, Resplendent — Warrior Sword 2H — power 2.
 *
 * Printed:
 *   a1: Once per Turn Action - {r}: Attack
 *   a2: The second time you attack with this each turn, it gets +1{p} until
 *       end of turn.
 *
 * Reasoning (hand-authored):
 * 1. a1 (1{r} 2{p} OPT attack) proven @ weapon-pending-mid; this file proves
 *    the a2 second-attack buff.
 * 2. CARD FIX (this cycle): the a2 trigger's filter was {name:"This"} —
 *    parser garbage that never matched (the trigger could never fire).
 *    Remodeled to `subject: "self"` (the attack object IS the weapon for
 *    weapon attacks) + the existing ordinal limit [2] ("second time").
 * 3. The OPT a1 normally blocks a second activation — the printed second
 *    attack is reachable via an additional-attack grant: Dusk Path
 *    Pilgrimage (BOL029) gives the next weapon attack +3{p} AND "When this
 *    hits, you may attack an additional time with this weapon this turn".
 *    Accepting the optional re-opens the weapon (ready + AP grant path).
 * 4. Happy: Pilgrimage → Dawnblade attack 1 (2+3 = 5) hits → accept the
 *    attack-again grant → Dawnblade attack 2 (the a2's "second time" →
 *    2+1 = 3) hits. Total 8. Boundary: single attack → 2, no a2.
 *
 * Status: ✅ a2 second-attack +1{p} proven via the additional-attack grant;
 * single-attack boundary (a1 @ weapon-pending-mid).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";

import { dawnbladeResplendent } from "../../../../../../cards/src/cards/weapons/dawnblade-resplendent.ts";
import { duskPathPilgrimageRed } from "../../../../../../cards/src/cards/actions/dusk-path-pilgrimage.ts";

const LIFE = 40;

/** Walk to quiescence; booleans answer true (accept the attack-again grant). */
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

describe("dawnblade-resplendent (DVR002)", () => {
  it("a2: second attack with this each turn → +1{p} (2+3 then 2+1)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [dawnbladeResplendent],
        hand: [duskPathPilgrimageRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    // Dusk Path Pilgrimage (1{r}): next weapon attack +3{p} + the on-hit
    // attack-an-additional-time grant.
    Bravo.play(duskPathPilgrimageRed);
    drain(game);

    // Attack 1: Dawnblade 2+3 = 5. The granted on-hit ability fires; the
    // drain accepts the optional attack-again → the exact weapon attack
    // activation limit increases. AP remains independently accounted.
    Bravo.activate(dawnbladeResplendent);
    drain(game);
    expect(Opp.life()).toBe(lifeBefore - 5);

    // Attack 2: the granted additional attack is a second ACTIVATION (the
    // persisted limit permits it) — the a2 "second time" fires → 2+1 = 3 on
    // top of the +3 that LEAKED from the pilgrimage aura (the modify lands
    // on the weapon object and persists until EOT — documented engine quirk,
    // §7 OPEN row "next-attack weapon power buff persists"). The a2's own
    // +1 is the delta: without it attack 2 would deal 5, with it 6.
    // The granted on-hit attack-again ability lingers on the weapon until
    // end of turn — decline its optional (the times:1 grant was consumed).
    Bravo.activate(dawnbladeResplendent);
    for (let safety = 0; safety < 32; safety += 1) {
      const decision = game.getState().decision;
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
      if (!game.combat() && game.getState().rulesStack.length === 0) break;
      if (game.declareNoDefenseIfPending()) continue;
      const prio = game.getPriorityPlayerId();
      if (prio) {
        game.exec({ move: "pass", actorId: prio, payload: {} });
        continue;
      }
      break;
    }
    expect(Opp.life()).toBe(lifeBefore - 8); // 5 + (2+1 a2); pilgrimage +3 stays on attack 1 = 6
  });

  it("a2 boundary: a single attack gets no +1", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [dawnbladeResplendent],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    Bravo.activate(dawnbladeResplendent);
    game.helpers.resolveRestOfCombat();

    expect(Opp.life()).toBe(lifeBefore - 2);
  });
});
