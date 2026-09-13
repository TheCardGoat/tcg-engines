import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { quickClicks } from "./quick-clicks.ts";

describe("Quick Clicks (SEA186) AAA", () => {
  it("happy: after a Nimblism, destroy this so the next attack gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        legs: [quickClicks],
        hand: [nimblismBlue, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, life: 40, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(nimblismBlue);
    game.helpers.resolveUntilIdle();
    Dash.activate(quickClicks);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, quickClicks).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveAP(1);

    Dash.attackWith(snatchRed);
    expectCombat(game).toHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveAP(1);
  });

  it("boundary: cannot activate without playing a Nimblism this turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, legs: [quickClicks], hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.expectActivationRejected(quickClicks);
    expectFabCard(Dash, quickClicks).toBeIn("legs");
  });

  it("timing: without Quick Clicks, Snatch spends the Action point", () => {
    const game = FabTestEngine.start(
      { hero: dash, legs: [quickClicks], hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, life: 40, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveAP(0);
    expectFabCard(Dash, quickClicks).toBeIn("legs");
  });
});
