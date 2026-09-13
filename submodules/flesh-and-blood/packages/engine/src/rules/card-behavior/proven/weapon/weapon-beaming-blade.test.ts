import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";

import { beamingBlade } from "../../../../../../cards/src/cards/weapons/beaming-blade.ts";

describe("Beaming Blade (DTD046)", () => {
  it("pays 2 resources for its once-per-turn 0-power sword attack", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [beamingBlade],
        hand: [],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(beamingBlade);
    game.helpers.resolveRestOfCombat();

    expect(Dash.life()).toBe(20);
    expect(Bravo.resourcePoints()).toBe(0);
    expect(() => Bravo.activate(beamingBlade)).toThrow();
  });

  it("rejects activation with fewer than 2 resources", () => {
    const game = FabTestEngine.start(
      { hero: bravo, weapon1: [beamingBlade], hand: [], resourcePoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );

    expect(() => game.as(bravo).activate(beamingBlade)).toThrow();
  });
});
