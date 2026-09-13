import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { poundTownRed } from "./pound-town.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { energeticImpactBlue } from "./energetic-impact.ts";

describe("Energetic Impact (SUP131) AAA", () => {
  it("happy: defending together with a 6+{p} card creates Vigor", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      {
        hero: rhinar,
        hand: [energeticImpactBlue, poundTownRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    game.as(dash).playAttack(snatchRed);
    Rhinar.defendWith(energeticImpactBlue, poundTownRed);
    game.passBoth();

    expectFabPlayer(Rhinar).toHaveTokenCount("vigor", 1);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("vigor", 0);
  });

  it("boundary: defending alone or with a sub-6{p} card creates no Vigor", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      {
        hero: rhinar,
        hand: [energeticImpactBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    game.as(dash).playAttack(snatchRed);
    Rhinar.defendWith(energeticImpactBlue, nimblismBlue);
    game.passBoth();

    expectFabPlayer(Rhinar).toHaveTokenCount("vigor", 0);
  });
});
