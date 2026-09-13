import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { shuckBlue } from "../../../../../../cards/src/cards/actions/shuck.ts";
import { quartermasterSBoots } from "../../../../../../cards/src/cards/equipment/quartermaster-s-boots.ts";

describe("quartermaster's-boots (SEA185)", () => {
  it("AAA: pays two and destroys itself, then the next non-attack action keeps go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [quartermasterSBoots],
        hand: [shuckBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    Bravo.activate(quartermasterSBoots);
    game.passBoth();

    expect(Bravo.zone("graveyard")).toContain(quartermasterSBoots.canonicalId);
    expect(Bravo.resourcePoints()).toBe(0);
    expect(Bravo.actionPoints()).toBe(1);

    Bravo.play(shuckBlue);
    game.passBoth();
    game.passBoth();
    expect(Bravo.zone("arena").some((id) => /flurry/i.test(String(id)))).toBe(true);
    expect(Bravo.actionPoints()).toBe(1);
  });

  it("boundary: one resource cannot activate the two-resource ability", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [],
        legs: [quartermasterSBoots],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => game.as(bravo).activate(quartermasterSBoots)).toThrow();
    expect(game.as(bravo).zone("legs")).toContain(quartermasterSBoots.canonicalId);
  });
});
