import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, sigilOfSolaceRed } from "../../../fixtures.ts";
import { blitzKicks } from "../../../../../../cards/src/cards/equipment/blitz-kicks.ts";

describe("blitz-kicks (AZS006)", () => {
  it("AAA: after playing a real Instant, pays {r} and creates Embodiment of Lightning", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [blitzKicks],
        hand: [sigilOfSolaceRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    Bravo.play(sigilOfSolaceRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });
    Bravo.activate(blitzKicks);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expect(Bravo.zone("graveyard")).toContain(blitzKicks.canonicalId);
    expect(Bravo.resourcePoints()).toBe(0);
    expect(Bravo.zone("arena")).toContain("token:embodiment-of-lightning");
  });

  it("boundary: without an Instant played this turn, activation is illegal", () => {
    const game = FabTestEngine.start(
      { hero: bravo, legs: [blitzKicks], resourcePoints: 1, deck: 4 },
      { hero: dash, deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    expect(() => Bravo.activate(blitzKicks)).toThrow();
    expect(Bravo.zone("legs")).toContain(blitzKicks.canonicalId);
    expect(Bravo.zone("arena")).not.toContain("token:embodiment-of-lightning");
  });

  it("boundary: zero resources cannot activate after the Instant gate is met", () => {
    const game = FabTestEngine.start(
      { hero: bravo, legs: [blitzKicks], hand: [sigilOfSolaceRed], deck: 4 },
      { hero: dash, deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    Bravo.play(sigilOfSolaceRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expect(() => Bravo.activate(blitzKicks)).toThrow();
    expect(Bravo.zone("legs")).toContain(blitzKicks.canonicalId);
  });
});
