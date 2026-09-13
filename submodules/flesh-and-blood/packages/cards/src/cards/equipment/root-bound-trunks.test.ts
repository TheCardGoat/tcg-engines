import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { harvestSeasonRed } from "../actions/harvest-season.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { rootBoundTrunks } from "./root-bound-trunks.ts";

/**
 * Root-Bound Trunks (AJV007) — Earth Guardian Equipment - Legs. (Blade Break)
 * Printed: "When this defends together with an aura card, create an
 * Embodiment of Earth token."
 */

describe("Root-Bound Trunks (AJV007) AAA", () => {
  it("happy: defending together with an aura card creates an Embodiment of Earth", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [harvestSeasonRed], legs: [rootBoundTrunks], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([rootBoundTrunks, harvestSeasonRed]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveTokenCount("embodiment-of-earth", 1);
  });

  it("boundary: a non-aura co-defender creates nothing", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [nimblismBlue], legs: [rootBoundTrunks], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith([rootBoundTrunks, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveTokenCount("embodiment-of-earth", 0);
  });

  it("timing: the Embodiment is created even when the hit is fully blocked", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        hand: [harvestSeasonRed, nimblismBlue],
        legs: [rootBoundTrunks],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([rootBoundTrunks, harvestSeasonRed, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveTokenCount("embodiment-of-earth", 1);
    expectFabPlayer(Dash).toHaveLife(20);
  });
});
