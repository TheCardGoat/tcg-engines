import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { katsu } from "../heroes/katsu.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { gustwaveOfTheSecondWindRed } from "./gustwave-of-the-second-wind.ts";

/**
 * Gustwave of the Second Wind (ROS245) — go again if Surging Strike was the last attack.
 */

describe("Gustwave of the Second Wind (ROS245) AAA", () => {
  it("happy: printed 4{p} hits", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [gustwaveOfTheSecondWindRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.attackWith(gustwaveOfTheSecondWindRed);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("boundary: as the first link there is no go again", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [gustwaveOfTheSecondWindRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.attackWith(gustwaveOfTheSecondWindRed);
    expectCombat(game).notToHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Katsu).toHaveAP(0);
  });

  it("timing: a Generic last attack is not Surging Strike", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [snatchRed, gustwaveOfTheSecondWindRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.must.playAttack(snatchRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    Katsu.attackWith(gustwaveOfTheSecondWindRed);
    expectCombat(game).notToHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Katsu).toHaveAP(0);
  });
});
