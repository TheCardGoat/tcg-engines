import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { vestOfTheFirstFist } from "./vest-of-the-first-fist.ts";

describe("Vest of the First Fist (ARC152) AAA", () => {
  it("happy: AAC hit may destroy this to gain {r}{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        chest: [vestOfTheFirstFist],
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: bravo, life: 40, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.attackWith(snatchRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, ordering: "listed" });

    expectFabCard(Dash, vestOfTheFirstFist).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveResourceCount(2);
  });

  it("boundary: declining the optional keeps the vest and grants no {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        chest: [vestOfTheFirstFist],
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: bravo, life: 40, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.attackWith(snatchRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, ordering: "listed" });

    expectFabCard(Dash, vestOfTheFirstFist).toBeIn("chest");
    expectFabPlayer(Dash).toHaveResourceCount(0);
  });

  it("timing: a fully blocked AAC miss does not destroy the vest", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        chest: [vestOfTheFirstFist],
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: bravo, life: 40, hand: [nimblismBlue, nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.attackWith(snatchRed);
    game.as(bravo).defendWith(nimblismBlue, nimblismBlue);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, vestOfTheFirstFist).toBeIn("chest");
    expectFabPlayer(Dash).toHaveResourceCount(0);
  });
});
