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
import { stadiumCenterpiece } from "./stadium-centerpiece.ts";

describe("Stadium Centerpiece (HVY203) AAA", () => {
  it("happy: opponent with greater {h} sets this to 1{d}; defend then Blade Break", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      { hero: bravo, life: 15, chest: [stadiumCenterpiece], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    expectFabCard(Bravo, stadiumCenterpiece).toHaveDefense(1);
    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(stadiumCenterpiece);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(12);
    expectFabCard(Bravo, stadiumCenterpiece).toBeIn("graveyard");
  });

  it("boundary: equal life sets this to 0{d}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, chest: [stadiumCenterpiece], life: 20, hand: [], deck: 6 },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expectFabCard(game.as(bravo), stadiumCenterpiece).toHaveDefense(0);
    expectFabCard(game.as(bravo), stadiumCenterpiece).toHaveKeyword("blade-break");
  });

  it("timing: Blade Break destroys this after it defends at 0{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      { hero: bravo, life: 20, chest: [stadiumCenterpiece], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(stadiumCenterpiece);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(16);
    expectFabCard(Bravo, stadiumCenterpiece).toBeIn("graveyard");
  });
});
