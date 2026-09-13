/**
 * SEA097 Glidewell Fins — Ranger Arms d1.
 *
 * Printed a1: "Action - {r}, destroy this: Put an arrow from your hand
 * face-up into your arsenal. It gets +1{p} this turn. Go again."
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, deathDealer, endlessArrowRed, snatchRed } from "../../../fixtures.ts";
import { glidewellFins } from "../../../../../../cards/src/cards/equipment/glidewell-fins.ts";

describe("SEA097 Glidewell Fins", () => {
  it("puts a real Arrow face-up into arsenal, buffs that Arrow, destroys itself, and goes again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [glidewellFins],
        weapon1: [deathDealer],
        hand: [endlessArrowRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(glidewellFins);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expect(Bravo.zone("arms")).not.toContain(glidewellFins.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(glidewellFins.canonicalId);
    expect(Bravo.zone("arsenal")).toContain(endlessArrowRed.canonicalId);
    expect(game.objectState(Bravo.findCardInZone("arsenal", endlessArrowRed))?.faceDown).toBe(
      false,
    );
    expect(Bravo.resourcePoints()).toBe(0);
    expect(Bravo.actionPoints()).toBe(1);

    Bravo.playFromArsenal(endlessArrowRed, { target: game.as(dash).id });
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(5);
  });

  it("rejects activation without an Arrow in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [glidewellFins],
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );

    expect(() => game.as(bravo).activate(glidewellFins)).toThrow();
    expect(game.as(bravo).zone("arms")).toContain(glidewellFins.canonicalId);
    expect(game.as(bravo).resourcePoints()).toBe(1);
  });

  it("rejects activation when the arsenal is already occupied", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [glidewellFins],
        arsenal: [snatchRed],
        hand: [endlessArrowRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );

    expect(() => game.as(bravo).activate(glidewellFins)).toThrow();
    expect(game.as(bravo).zone("arms")).toContain(glidewellFins.canonicalId);
    expect(game.as(bravo).zone("arsenal")).toEqual([snatchRed.canonicalId]);
  });
});
