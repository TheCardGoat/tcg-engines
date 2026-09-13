import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { courageousCrossingBlue } from "./courageous-crossing.ts";

describe("Courageous Crossing (PEN086) AAA", () => {
  it("happy: playing this creates a Courage token under the targeted hero", () => {
    const game = FabTestEngine.start(
      { hero: azalea, hand: [courageousCrossingBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.play(courageousCrossingBlue, { target: Dash.id });
    game.untilIdle();

    expectFabPlayer(Dash).toHaveTokenCount("courage", 1);
    expectFabPlayer(Azalea).toHaveTokenCount("courage", 0);
  });

  it("boundary: defending an attack at its printed base {p} does not create extra Courage", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      { hero: azalea, hand: [courageousCrossingBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    game.as(dash).playAttack(snatchRed);
    Azalea.defendWith(courageousCrossingBlue);
    game.passBoth();

    expectFabPlayer(Azalea).toHaveTokenCount("courage", 0);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("courage", 0);
  });
});
