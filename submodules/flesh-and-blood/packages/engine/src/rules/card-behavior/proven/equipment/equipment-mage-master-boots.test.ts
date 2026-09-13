import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, snatchRed } from "../../../fixtures.ts";
import { mageMasterBoots } from "../../../../../../cards/src/cards/equipment/mage-master-boots.ts";

describe("mage-master-boots (ARC154)", () => {
  it("AAA: Action {r}+destroy grants the next non-attack Action go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [mageMasterBoots],
        hand: [nimblismBlue],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(mageMasterBoots);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expect(Bravo.zone("graveyard")).toContain(mageMasterBoots.canonicalId);
    expect(Bravo.actionPoints()).toBe(1);
    Bravo.play(nimblismBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expect(Bravo.zone("graveyard")).toContain(nimblismBlue.canonicalId);
    expect(Bravo.zone("hand")).not.toContain(nimblismBlue.canonicalId);
    expect(Bravo.actionPoints()).toBe(1);
  });

  it("boundary: the permission does not allow an attack action", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [mageMasterBoots],
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 4,
      },
      { hero: dash, hand: [], deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(mageMasterBoots);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    Bravo.play(snatchRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expect(Bravo.zone("graveyard")).toContain(snatchRed.canonicalId);
    expect(Bravo.actionPoints()).toBe(0);
  });

  it("boundary: zero resources cannot activate the Action", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [mageMasterBoots],
        hand: [],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 4,
      },
      { hero: dash, hand: [], deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    expect(() => Bravo.activate(mageMasterBoots)).toThrow();
    expect(Bravo.zone("legs")).toContain(mageMasterBoots.canonicalId);
  });
});
