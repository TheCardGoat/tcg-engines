import { describe, it } from "vitest";
import {
  expectFabPlayer,
  expectFabToken,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { headJabBlue } from "../actions/head-jab.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { prism } from "../heroes/prism.ts";

describe("Spectral Shield (MON104) AAA", () => {
  it("happy: Ward 1 prevents 1 of Snatch and destroys the created token", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        soul: [nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.activate(prism);
    game.passBoth();
    expectFabToken(game, "spectral-shield").toHaveCount(1);

    Prism.endTurn();
    Dash.attackWith(snatchRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Prism).toHaveLife(17);
    expectFabToken(game, "spectral-shield").toHaveCount(0);
  });

  it("boundary: without a Spectral Shield Snatch deals its full 4{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: prism, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    game.as(dash).attackWith(snatchRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Prism).toHaveLife(16);
    expectFabToken(game, "spectral-shield").toHaveCount(0);
  });

  it("timing: Ward 1 fully prevents a 1{p} attack and destroys the token", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        soul: [nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [headJabBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.activate(prism);
    game.passBoth();
    expectFabToken(game, "spectral-shield").toHaveCount(1);

    Prism.endTurn();
    Dash.attackWith(headJabBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Prism).toHaveLife(20);
    expectFabToken(game, "spectral-shield").toHaveCount(0);
  });
});
