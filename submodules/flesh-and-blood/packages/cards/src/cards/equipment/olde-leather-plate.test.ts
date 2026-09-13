import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed, snatchYellow } from "../actions/snatch.ts";
import { oldeLeatherPlate } from "./olde-leather-plate.ts";

/**
 * Olde Leather Plate (MPW141) — Generic Chest d0, Blade Break.
 * Printed: "If you've been attacked 2 or more times this turn, this gets +2{d}."
 */

describe("Olde Leather Plate (MPW141) AAA", () => {
  it("happy: after a first attack was declared, the plate defends the second for 2", () => {
    const game = FabTestEngine.start(
      { hero: fai, hand: [snatchRed, snatchYellow], actionPoints: 2, deck: 6 },
      {
        hero: dash,
        life: 20,
        chest: [oldeLeatherPlate],
        hand: [nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    Fai.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith(nimblismBlue);
    game.helpers.resolveRestOfCombat();

    Fai.playAttack(snatchYellow);
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith(oldeLeatherPlate);
    expectFabCard(Dash, oldeLeatherPlate).toHaveDefense(2);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17); // 20 - (4-2) - (3-2)
  });

  it("boundary: with only one attack declared this turn the plate stays 0{d}", () => {
    const game = FabTestEngine.start(
      { hero: fai, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, chest: [oldeLeatherPlate], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    Fai.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith(oldeLeatherPlate);
    expectFabCard(Dash, oldeLeatherPlate).toHaveDefense(0);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(16); // 20 - 4
  });
});
