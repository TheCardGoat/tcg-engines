import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { oldhim } from "../heroes/oldhim.ts";
import { harvestSeasonRed } from "../actions/harvest-season.ts";
import { fertileGroundBlue, fertileGroundRed, fertileGroundYellow } from "./fertile-ground.ts";

const variants = [
  { label: "Fertile Ground Red (ROS067)", card: fertileGroundRed, thresholdGain: 5 },
  { label: "Fertile Ground Yellow (ROS068)", card: fertileGroundYellow, thresholdGain: 4 },
  { label: "Fertile Ground Blue (ROS069)", card: fertileGroundBlue, thresholdGain: 3 },
] as const;

describe.each(variants)("$label family behavior AAA", ({ card, thresholdGain }) => {
  it(`happy: four banished Earth cards increase life by ${thresholdGain}`, () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [card],
        banished: [harvestSeasonRed, harvestSeasonRed, harvestSeasonRed, harvestSeasonRed],
        life: 10,
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);

    Oldhim.play(card);
    game.untilIdle();

    expectFabPlayer(Oldhim).toHaveLife(10 + thresholdGain);
    expectFabCard(Oldhim, card).toBeIn("graveyard");
  });

  it("boundary: fewer than four banished Earth cards increase life by two", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [card],
        banished: [harvestSeasonRed, harvestSeasonRed, harvestSeasonRed],
        life: 10,
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);

    Oldhim.play(card);
    game.untilIdle();

    expectFabPlayer(Oldhim).toHaveLife(12);
  });
});
