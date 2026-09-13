import { describe, expect, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { tomeOfFyendalYellow } from "../actions/tome-of-fyendal.ts";
import { hotStreak } from "../weapons/hot-streak.ts";
import { kassaiOfTheGoldenSand } from "./kassai-of-the-golden-sand.ts";

describe("Kassai of the Golden Sand (HVY090) AAA", () => {
  it("happy: drawing a card this turn lets a sword activate for 0{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [hotStreak],
        hand: [tomeOfFyendalYellow],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.must.play(tomeOfFyendalYellow);
    game.passBoth();
    Kassai.activate(hotStreak);
    game.passBoth();

    expectCombat(game).toBeOpen().toHaveAttackPower(2);
    expect(Kassai.resourcePoints()).toBe(0);
  });

  it("happy: banishing 2 red and 2 yellow from graveyard creates Gold on the next weapon hit", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [hotStreak],
        graveyard: [snatchRed, snatchRed, tomeOfFyendalYellow, tomeOfFyendalYellow],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.activate(kassaiOfTheGoldenSand);
    game.passBoth();
    Kassai.activate(hotStreak);
    game.helpers.resolveRestOfCombat();

    expect(Kassai.zone("arena")).toContain("token:gold");
  });

  it("boundary: without drawing, the sword still costs {r}; the Gold ability is rejected without 2 red and 2 yellow", () => {
    const noDraw = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [hotStreak],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const NoDraw = noDraw.as(kassaiOfTheGoldenSand);
    NoDraw.activate(hotStreak);
    noDraw.passBoth();
    expect(NoDraw.resourcePoints()).toBe(0);

    const shortGy = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        graveyard: [snatchRed, tomeOfFyendalYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    shortGy.as(kassaiOfTheGoldenSand).expectActivationRejected(kassaiOfTheGoldenSand);
  });
});
