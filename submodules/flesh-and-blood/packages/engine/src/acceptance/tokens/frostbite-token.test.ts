/** ELE111 Frostbite — adds one cost and destroys itself when its controller plays a card. */
import { describe, expect, it } from "vitest";

import { frostbite } from "../../../../cards/src/cards/tokens/frostbite.ts";
import { copper } from "../../../../cards/src/cards/tokens/copper.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../rules/fixtures.ts";

describe("Frostbite token (ELE111)", () => {
  it("AAA: taxes the controller's next card by one resource then destroys itself", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], arena: [frostbite], deck: 8, resourcePoints: 1 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed);

    expect(Bravo.resourcePoints()).toBe(0);
    expect(Bravo.zone("arena")).not.toContain(frostbite.canonicalId);
  });

  it("boundary: the added cost prevents a zero-resource card play at zero resources", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], arena: [frostbite], deck: 8, resourcePoints: 0 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    expect(() => Bravo.attackWith(snatchRed)).toThrow(/cost|payment|resource/i);
    expect(Bravo.zone("arena")).toContain(frostbite.canonicalId);
  });

  it("also taxes ability activations by one resource (CR 8.6.10)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [frostbite, copper],
        hand: [],
        deck: 8,
        resourcePoints: 4,
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false },
    );
    const Bravo = game.as(bravo);

    // Copper costs 4 resources to activate; Frostbite's +1 activation tax makes it 5.
    // With no pitch available, 4 resources cannot meet the 5-cost activation.
    expect(() => Bravo.activate(copper)).toThrow();
    expect(Bravo.resourcePoints()).toBe(4);
    expect(Bravo.zone("arena")).toContain(copper.canonicalId);
  });

  it("destroys itself when its controller activates an ability (CR 8.6.10)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [frostbite, copper], deck: 8, resourcePoints: 5, actionPoints: 1 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(copper);
    game.passBoth();

    // "or activate an ability, destroy this" — Frostbite leaves the arena.
    expect(Bravo.zone("arena")).not.toContain(frostbite.canonicalId);
  });
});
