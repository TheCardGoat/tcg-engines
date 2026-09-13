import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { katsu } from "../heroes/katsu.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { poundingGaleRed } from "./pounding-gale.ts";

/**
 * Pounding Gale (WTR085) — doubles damage if Open the Center was the last attack.
 */

describe("Pounding Gale (WTR085) AAA", () => {
  it("happy: printed 5{p} hits without Open the Center", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [poundingGaleRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.attackWith(poundingGaleRed);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(15);
  });

  it("boundary: as the first link it deals printed 5", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [poundingGaleRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.attackWith(poundingGaleRed);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(15);
  });

  it("timing: a Generic last attack is not Open the Center", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [snatchRed, poundingGaleRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.must.playAttack(snatchRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    Katsu.attackWith(poundingGaleRed);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(11);
  });
});
