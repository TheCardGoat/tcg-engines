import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { oldhim } from "../heroes/oldhim.ts";
import { dash } from "../heroes/dash.ts";
import { harvestSeasonRed } from "./harvest-season.ts";
import { nimblismBlue } from "./nimblism.ts";
import { seedsOfStrengthRed } from "./seeds-of-strength.ts";

/**
 * Seeds of Strength, Red (PEN201) — Elemental Guardian Action, cost 2.
 * Printed: "Create 3 Might tokens. If an Earth card was pitched to play
 * this, instead create 4 Might tokens."
 */

describe("Seeds of Strength family AAA", () => {
  it("happy: pitching an Earth card creates 4 Might", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [seedsOfStrengthRed, harvestSeasonRed, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);

    Oldhim.play(seedsOfStrengthRed, { pitch: [harvestSeasonRed, nimblismBlue] });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Oldhim).toHaveTokenCount("might", 4);
  });

  it("boundary: pitching only Generic cards creates 3 Might", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [seedsOfStrengthRed, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);

    Oldhim.play(seedsOfStrengthRed, { pitch: [nimblismBlue] });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Oldhim).toHaveTokenCount("might", 3);
  });

  it("timing: paying with resource points and no pitch creates 3 Might", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [seedsOfStrengthRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);

    Oldhim.play(seedsOfStrengthRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Oldhim).toHaveTokenCount("might", 3);
  });
});
