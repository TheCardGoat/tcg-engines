/**
 * BET003 Bloodied Oval — Generic Off-Hand.
 *
 * Printed a1: "Bloodied Oval's {d} is equal to the number of opposing heroes
 * with greater {h} than you."
 *
 * In the 1v1 product, the continuous property static therefore produces d1
 * only while the sole opponent has more life; otherwise it produces d0.
 * CR 5.4.1–5.4.2: a functional static ability generates its continuous effect
 * without resolving a layer.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { bloodiedOval } from "../../../../../../cards/src/cards/equipment/bloodied-oval.ts";

const SNATCH = 4;

describe("bloodied-oval (BET003)", () => {
  it("a1: the sole opposing hero having greater life sets defense to 1", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      {
        hero: dash,
        weapon2: [bloodiedOval],
        life: 15,
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Defender.defendWith(bloodiedOval);
    game.helpers.resolveRestOfCombat();

    // Bravo (20) is the one opposing hero with greater life, so d1 blocks 1.
    expect(Defender.life()).toBe(15 - (SNATCH - 1));
  });

  it("boundary: equal or lower opposing life leaves the property-static defense at 0", () => {
    const equal = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      {
        hero: dash,
        weapon2: [bloodiedOval],
        life: 20,
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const EqualDefender = equal.as(dash);
    equal.as(bravo).attackWith(snatchRed);
    EqualDefender.defendWith(bloodiedOval);
    equal.helpers.resolveRestOfCombat();
    expect(EqualDefender.life()).toBe(20 - SNATCH);

    const lower = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        life: 10,
        deck: 6,
      },
      {
        hero: dash,
        weapon2: [bloodiedOval],
        life: 20,
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const LowerDefender = lower.as(dash);
    lower.as(bravo).attackWith(snatchRed);
    LowerDefender.defendWith(bloodiedOval);
    lower.helpers.resolveRestOfCombat();
    expect(LowerDefender.life()).toBe(20 - SNATCH);
  });
});
