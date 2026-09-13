import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { frailSwinglineBlue } from "./frail-swingline.ts";

describe("Frail Swingline (PEN087) AAA", () => {
  it("happy: playing this creates a Frailty token under the targeted hero", () => {
    const game = FabTestEngine.start(
      { hero: azalea, hand: [frailSwinglineBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.play(frailSwinglineBlue, { target: Dash.id });
    game.untilIdle();

    expectFabPlayer(Dash).toHaveTokenCount("frailty", 1);
    expectFabPlayer(Azalea).toHaveTokenCount("frailty", 0);
  });

  it("boundary: defending an attack at its printed base {p} does not discard", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      {
        hero: azalea,
        hand: [frailSwinglineBlue, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    game.as(dash).playAttack(snatchRed);
    Azalea.defendWith(frailSwinglineBlue);
    game.passBoth();

    expectFabPlayer(Azalea).toHaveHandCount(1);
    expectFabPlayer(Azalea).toHaveTokenCount("frailty", 0);
  });
});
