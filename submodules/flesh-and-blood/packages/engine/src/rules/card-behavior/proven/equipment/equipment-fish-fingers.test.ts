import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { fishFingers } from "../../../../../../cards/src/cards/equipment/fish-fingers.ts";

describe("fish-fingers (SEA128)", () => {
  it("AAA: pays {r}, destroys itself, grants +1 to the next attack, and has go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [fishFingers],
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 40, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    Bravo.activate(fishFingers);
    game.passBoth();
    expect(Bravo.zone("graveyard")).toContain(fishFingers.canonicalId);
    expect(Bravo.actionPoints()).toBe(1);
    Bravo.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(Dash.life()).toBe(35);
  });

  it("boundary: it is illegal without the required resource", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arms: [fishFingers], hand: [], resourcePoints: 0, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    expect(() => Bravo.activate(fishFingers)).toThrow();
    expect(Bravo.zone("arms")).toContain(fishFingers.canonicalId);
  });
});
