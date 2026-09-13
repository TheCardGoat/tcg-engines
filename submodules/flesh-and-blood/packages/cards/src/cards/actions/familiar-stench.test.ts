import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { poundTownRed } from "./pound-town.ts";
import { nimblismBlue } from "./nimblism.ts";
import { familiarStenchRed } from "./familiar-stench.ts";

describe("Familiar Stench (SUP142) AAA", () => {
  it("happy: a Brute card defending this creates Vigor for the attacking hero", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [familiarStenchRed],
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [poundTownRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.playAttack(familiarStenchRed);
    game.as(dash).defendWith(poundTownRed);
    game.passBoth();

    expectFabPlayer(Rhinar).toHaveTokenCount("vigor", 1);
  });

  it("boundary: a non-Brute defender creates no Vigor", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [familiarStenchRed],
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.playAttack(familiarStenchRed);
    game.as(dash).defendWith(nimblismBlue);
    game.passBoth();

    expectFabPlayer(Rhinar).toHaveTokenCount("vigor", 0);
  });
});
