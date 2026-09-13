/**
 * AAA test for condition:life-comparison → modify-numeric.
 * Representative card: Wounded Bull Blue (BVO026) — Generic Attack Action.
 * Cost 3, pitch 3, power 5, defense 2.
 * a1: "When you play this, if you have less {h} than an opposing hero,
 *      this gains +1{p}."
 *   → trigger: play → condition: life-comparison self < opponent → modify-numeric +1 power.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, woundedBullBlue } from "../../../fixtures.ts";

describe("condition: life-comparison → modify-numeric (Wounded Bull Blue)", () => {
  it("AAA: when attacker has less life, Wounded Bull gets +1 power (5 → 6)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: 10,
        hand: [woundedBullBlue],
        resourcePoints: 3,
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(woundedBullBlue);

    // Base power 5 + life-comparison bonus 1 = 6.
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
  });

  it("AAA boundary: when attacker has equal or more life, no bonus (stays 5)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: 20,
        hand: [woundedBullBlue],
        resourcePoints: 3,
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(woundedBullBlue);

    // Equal life → no bonus.
    expect(game.combat()?.activeLink?.attackPower).toBe(5);
  });
});
