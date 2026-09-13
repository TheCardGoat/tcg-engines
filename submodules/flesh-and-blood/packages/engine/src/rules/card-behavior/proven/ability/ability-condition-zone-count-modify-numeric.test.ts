/**
 * AAA test for condition:zone-count → modify-numeric.
 * Representative card: Fault Line Red (MPG032) — Guardian Attack Action.
 * Cost 3, pitch 1, power 7, defense 3.
 * a1: "If you have a card in your arsenal, this gets +1{p}."
 *   → condition: zone-count arsenal >= 1 → modify-numeric power +1 this-turn.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, faultLineRed, nimblismBlue } from "../../../fixtures.ts";

describe("condition: zone-count → modify-numeric (Fault Line Red)", () => {
  it("AAA: with a card in arsenal, Fault Line gets +1 power (7 → 8)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [faultLineRed],
        arsenal: [nimblismBlue],
        resourcePoints: 3,
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(faultLineRed);

    // Base power 7 + zone-count bonus 1 = 8.
    expect(game.combat()?.activeLink?.attackPower).toBe(8);
  });

  it("AAA boundary: without a card in arsenal, Fault Line stays at base power 7", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [faultLineRed],
        resourcePoints: 3,
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(faultLineRed);

    // Base power 7, no bonus.
    expect(game.combat()?.activeLink?.attackPower).toBe(7);
  });
});
