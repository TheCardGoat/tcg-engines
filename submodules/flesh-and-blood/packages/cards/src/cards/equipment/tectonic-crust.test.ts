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
import { tectonicCrust } from "./tectonic-crust.ts";

/**
 * Tectonic Crust (AJV005) — Earth Guardian Equipment - Chest. (Temper)
 * Printed: "When this defends together with an Earth card, create a
 * Seismic Surge token."
 */

describe("Tectonic Crust (AJV005) AAA", () => {
  it("happy: defending together with an Earth card creates a Seismic Surge", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [harvestSeasonRed], chest: [tectonicCrust], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([tectonicCrust, harvestSeasonRed]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveTokenCount("seismic-surge", 1);
    expectFabPlayer(Bravo).toHaveTokenCount("seismic-surge", 0);
  });

  it("boundary: defending together with a non-Earth card creates nothing", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [nimblismBlue], chest: [tectonicCrust], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith([tectonicCrust, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveTokenCount("seismic-surge", 0);
  });

  it("timing: the Surge is created even when the pair fully blocks the attack", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        hand: [harvestSeasonRed, nimblismBlue],
        chest: [tectonicCrust],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([tectonicCrust, harvestSeasonRed, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveTokenCount("seismic-surge", 1);
    expectFabPlayer(Dash).toHaveLife(20);
  });
});
