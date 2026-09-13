import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { dash, nimblismBlue, snatchRed } from "../../../fixtures.ts";

import { ornateTessen } from "../../../../../../cards/src/cards/equipment/ornate-tessen.ts";
import { bravo } from "../../../../../../cards/src/cards/heroes/bravo.ts";

describe("ornate-tessen (DYN235)", () => {
  it("destroys itself, bottoms a hand card, then draws a replacement", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon2: [ornateTessen],
        hand: [nimblismBlue],
        deck: [snatchRed],
        resourcePoints: 1,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(ornateTessen);
    game.passBoth();
    // Singleton hand card is determined (CR 1.8.6c).
    game.helpers.resolveUntilIdle();

    expect(Bravo.resourcePoints()).toBe(0);
    expect(Bravo.zone("weapon2")).not.toContain(ornateTessen.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(ornateTessen.canonicalId);
    expect(Bravo.zone("hand")).toContain(snatchRed.canonicalId);
    expect(Bravo.zone("deck")).toContain(nimblismBlue.canonicalId);
  });

  it("is illegal without 1 resource", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon2: [ornateTessen],
        hand: [],
        deck: [],
        resourcePoints: 0,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );

    expect(() => {
      game.as(bravo).activate(ornateTessen);
      game.passBoth();
    }).toThrow();
  });
});
