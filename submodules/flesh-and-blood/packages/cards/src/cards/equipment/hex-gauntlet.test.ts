import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { rhinar } from "../heroes/rhinar.ts";
import { bravo } from "../heroes/bravo.ts";
import { gravelingGrowlBlue } from "../actions/graveling-growl.ts";
import { hexGauntlet } from "./hex-gauntlet.ts";

/**
 * Hex Gauntlet (IAR004) — Shadow Brute Arms, Blood Debt.
 *
 * Printed: "Instant - Banish this: Turn a card with blood debt in your
 * banished zone face-down. Blood Debt"
 */
describe("Hex Gauntlet (IAR004) AAA", () => {
  it("happy: banishing the gauntlet turns the banished blood-debt card face-down", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        life: 20,
        arms: [hexGauntlet],
        banished: [gravelingGrowlBlue],
        hand: [],
        deck: 6,
      },
      { hero: bravo, life: 40, hand: [], deck: 6 },
    );
    const Rhinar = game.as(rhinar);

    Rhinar.activate(hexGauntlet);
    game.untilIdle({ entityTargets: "minimum" });

    expectFabCard(Rhinar, gravelingGrowlBlue).toBeFaceDown();
    expectFabCard(Rhinar, gravelingGrowlBlue).toBeIn("banished");
    // Banish-self cost: the gauntlet itself now sits in the banished zone.
    expectFabCard(Rhinar, hexGauntlet).toBeIn("banished");
  });

  it("boundary: with no blood-debt card in the banished zone the Instant is illegal", () => {
    const game = FabTestEngine.start(
      { hero: rhinar, life: 20, arms: [hexGauntlet], hand: [], deck: 6 },
      { hero: bravo, life: 40, hand: [], deck: 6 },
    );
    const Rhinar = game.as(rhinar);

    Rhinar.expectActivationRejected(hexGauntlet);
    expectFabCard(Rhinar, hexGauntlet).toBeIn("arms");
  });

  it("timing: at the end phase only the face-up gauntlet ticks its blood debt", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        life: 20,
        arms: [hexGauntlet],
        banished: [gravelingGrowlBlue],
        hand: [],
        deck: 6,
      },
      { hero: bravo, life: 40, hand: [], deck: 6 },
    );
    const Rhinar = game.as(rhinar);

    Rhinar.activate(hexGauntlet);
    game.untilIdle({ entityTargets: "minimum" });
    Rhinar.endTurn();
    game.untilIdle();

    // The growl was turned face-down (silent); the face-up gauntlet debt ticks 1.
    expectFabPlayer(Rhinar).toHaveLife(19);
  });
});
