import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravoShowstopper } from "../heroes/bravo-showstopper.ts";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { ironrotPlate } from "../equipment/ironrot-plate.ts";
import { nimblismBlue } from "./nimblism.ts";
import { annexationOfTheForgeYellow } from "./annexation-of-the-forge.ts";

describe("Annexation of the Forge (MPG031) AAA", () => {
  it("happy: 8 unblocked crush vs a Guardian equips their Ironrot Plate to you", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [annexationOfTheForgeYellow], resourcePoints: 5, deck: 6 },
      { hero: bravoShowstopper, chest: [ironrotPlate], life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).attackWith(annexationOfTheForgeYellow);
    game.as(bravoShowstopper).defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(bravoShowstopper)).toHaveLife(12);
    expectFabCard(game.as(bravo), ironrotPlate).toBeIn("chest");
  });

  it("boundary: 8{d} of blocks leaves 0 damage and Tunic stays equipped", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [annexationOfTheForgeYellow], resourcePoints: 5, deck: 6 },
      {
        hero: dash,
        chest: [ironrotPlate],
        life: 20,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).attackWith(annexationOfTheForgeYellow);
    game.as(dash).defendWith(nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(20);
    expectFabCard(game.as(dash), ironrotPlate).toBeIn("chest");
  });

  it("timing: crush vs a non-Guardian with Ironrot Plate still deals 8 and does not steal", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [annexationOfTheForgeYellow], resourcePoints: 5, deck: 6 },
      { hero: dash, chest: [ironrotPlate], life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).attackWith(annexationOfTheForgeYellow);
    game.as(dash).defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(12);
    expectFabCard(game.as(dash), ironrotPlate).toBeIn("chest");
  });
});
