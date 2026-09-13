/**
 * ELE236 Runaways — Generic Legs d0.
 * Printed: Instant - Destroy Runaways: Prevent the next 1 damage that would be
 * dealt to your hero this turn. Activate only if your hero has been dealt
 * damage this turn.
 * Mirrors proven ROS212 hood-of-second-thoughts (same gate + prevention).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { runaways } from "../../../../../../cards/src/cards/equipment/runaways.ts";

const SNATCH = 4;
const LIFE = 20;

describe("runaways (ELE236)", () => {
  it("core: after been-dealt-damage, Instant destroy → prevent 1 on next damage", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed, snatchRed], actionPoints: 2, deck: 6 },
      { hero: dash, life: LIFE, legs: [runaways], deck: 6 },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    // First attack: unblocked — establishes been-dealt-damage-this-turn.
    Attacker.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    // Drain remaining triggers so beenDealtDamage is stamped.
    for (let s = 0; s < 16; s += 1) {
      const d = game.getState().decision;
      if (d && game.answerForcedDecision()) continue;
      if (d) break;
      if (game.getState().rulesStack.length > 0) {
        game.passBoth();
        continue;
      }
      break;
    }
    expect(Defender.life()).toBe(LIFE - SNATCH);

    // Second attack: defender has priority at defend step.
    Attacker.attackWith(snatchRed);
    Defender.defendWith([]);
    Attacker.pass();
    Defender.activate(runaways);
    game.helpers.resolveRestOfCombat();

    // Snatch 4 − prevent 1 = 3 damage on the second hit.
    expect(Defender.life()).toBe(LIFE - SNATCH - (SNATCH - 1));
    // Legs destroyed.
    expect(Defender.zone("legs")).not.toContain(runaways.canonicalId);
  });

  it("boundary: no damage this turn → activate illegal", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: LIFE, legs: [runaways], deck: 6 },
      { autoPassPriority: false },
    );
    // No damage dealt yet → activate should fail.
    expect(() => game.as(dash).activate(runaways)).toThrow();
    expect(game.as(dash).zone("legs")).toContain(runaways.canonicalId);
  });
});
