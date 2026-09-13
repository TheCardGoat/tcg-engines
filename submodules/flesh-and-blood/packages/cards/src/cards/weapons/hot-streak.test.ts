import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kassaiOfTheGoldenSand } from "../heroes/kassai-of-the-golden-sand.ts";
import { snatchRed } from "../actions/snatch.ts";
import { ironrotPlate } from "../equipment/ironrot-plate.ts";
import { hotStreak } from "./hot-streak.ts";

describe("Hot Streak (HVY095) AAA", () => {
  it("happy: defended by an attack action, the attack gains go again", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [hotStreak],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(kassaiOfTheGoldenSand).activate(hotStreak);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith(snatchRed);
    game.passBoth();

    expectCombat(game).toHaveKeyword("go-again");
  });

  it("boundary: defending with equipment does not grant go again", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [hotStreak],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, chest: [ironrotPlate], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(kassaiOfTheGoldenSand).activate(hotStreak);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith(ironrotPlate);
    game.passBoth();

    expectCombat(game).notToHaveKeyword("go-again");
  });
});
