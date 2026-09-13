/**
 * HVY096 Parry Blade — Warrior Equipment Sword 1H — power 2, defense 0.
 *
 * Printed:
 *   a1: Once per Turn Action - {r}: Attack
 *   a2: This gets +2{d} while defending a weapon attack.
 *
 * Status: 🟡→✅ — a1 OPT attack + bladeBreak lifecycle proven @
 * weapon-gated-tap-attack; a2 proven here: Parry Blade (d0) defending a real
 * weapon attack gets d0+2 = d2 effective (3-power Dawnblade − 2 = 1 damage);
 * boundary: defending a NON-weapon attack action stays d0 (full damage).
 * Rides the proven `defending-a-weapon-attack` status (Blade Beckoner family,
 * evaluateHasStatus line 27) + blade-beckoner defend flow (CR 1.9.3 defend
 * step; weapon attack = attack object IS a Weapon).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, dawnblade, snatchRed } from "../../../fixtures.ts";

import { parryBlade } from "../../../../../../cards/src/cards/equipment/parry-blade.ts";

const LIFE = 40;
const DAWN = 3;

/** Advance from weapon activate / attack play to the defend step. */
function advanceToDefend(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 24; safety += 1) {
    if (game.combat()?.step === "defend") break;
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
    const prio = game.getState().priority?.holderPlayerId;
    if (!prio) break;
    game.exec({ move: "pass", actorId: prio, payload: {} });
  }
}

describe("parry-blade (HVY096)", () => {
  it("a2: defending a weapon attack → d0+2 = d2 effective (Dawnblade 3 − 2 = 1)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [dawnblade],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        weapon1: [parryBlade],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.activate(dawnblade);
    advanceToDefend(game);
    expect(game.combat()?.step).toBe("defend");
    Defender.defendWith(parryBlade);
    game.helpers.resolveRestOfCombat();

    // Dawnblade (3) − effective d2 = 1 damage; bladeBreak destroys Parry Blade.
    expect(Defender.life()).toBe(LIFE - (DAWN - 2));
    expect(Defender.zone("weapon1")).not.toContain(parryBlade.canonicalId);
  });

  it("a2 boundary: defending a NON-weapon attack stays d0 (full damage)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        weapon1: [parryBlade],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.attackWith(snatchRed); // attack ACTION, not a weapon attack
    advanceToDefend(game);
    expect(game.combat()?.step).toBe("defend");
    Defender.defendWith(parryBlade);
    game.helpers.resolveRestOfCombat();

    // Snatch (4) vs d0 → full 4 damage (no +2{d} for non-weapon attack).
    expect(Defender.life()).toBe(LIFE - 4);
    expect(Defender.zone("weapon1")).not.toContain(parryBlade.canonicalId);
  });
});
