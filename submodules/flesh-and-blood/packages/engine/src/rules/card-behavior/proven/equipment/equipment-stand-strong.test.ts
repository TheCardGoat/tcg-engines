import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { tensionInTheAirRed } from "../../../../../../cards/src/cards/instants/tension-in-the-air.ts";
import { standStrong } from "../../../../../../cards/src/cards/equipment/stand-strong.ts";

describe("stand-strong (SUP169)", () => {
  it("AAA: with an Aura of Suspense, pays three, creates Confidence, destroys self, and goes again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [standStrong],
        arena: [tensionInTheAirRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    Bravo.activate(standStrong);
    game.passBoth();
    game.passBoth();

    expect(Bravo.zone("graveyard")).toContain(standStrong.canonicalId);
    expect(Bravo.zone("arena").some((id) => /confidence/i.test(String(id)))).toBe(true);
    expect(Bravo.resourcePoints()).toBe(0);
    expect(Bravo.actionPoints()).toBe(1);
  });

  it("boundary: without an Aura of Suspense, activation is illegal", () => {
    const game = FabTestEngine.start(
      { hero: bravo, legs: [standStrong], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    expect(() => Bravo.activate(standStrong)).toThrow();
    expect(Bravo.zone("legs")).toContain(standStrong.canonicalId);
    expect(Bravo.zone("arena").some((id) => /confidence/i.test(String(id)))).toBe(false);
  });

  it("control boundary: an Aura of Suspense in hand does not unlock the action", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [standStrong],
        hand: [tensionInTheAirRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    expect(() => Bravo.activate(standStrong)).toThrow();
    expect(Bravo.zone("legs")).toContain(standStrong.canonicalId);
    expect(Bravo.zone("hand")).toContain(tensionInTheAirRed.canonicalId);
  });
});
