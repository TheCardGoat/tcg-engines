import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { proclamationOfAbundance } from "../../../../../../cards/src/cards/equipment/proclamation-of-abundance.ts";

describe("proclamation-of-abundance (JDG009)", () => {
  it("AAA: pays three, destroys itself, and draws each hero up to intellect", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [],
        weapon2: [proclamationOfAbundance],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(proclamationOfAbundance);
    game.passBoth();

    expect(Bravo.zone("graveyard")).toContain(proclamationOfAbundance.canonicalId);
    expect(Bravo.handCount()).toBe(4);
    expect(Dash.handCount()).toBe(4);
    expect(Bravo.resourcePoints()).toBe(0);
    expect(Bravo.actionPoints()).toBe(0);
  });

  it("boundary: two resource points cannot pay the activation cost", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [],
        weapon2: [proclamationOfAbundance],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    expect(() => Bravo.activate(proclamationOfAbundance)).toThrow();
    expect(Bravo.zone("weapon2")).toContain(proclamationOfAbundance.canonicalId);
    expect(Bravo.handCount()).toBe(0);
    expect(game.as(dash).handCount()).toBe(0);
  });
});
