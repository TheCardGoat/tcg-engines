import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { disableRed } from "./disable.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { clashOfMountainsRed } from "./clash-of-mountains.ts";

/**
 * Clash of Mountains (MPG061) — Guardian Attack, 8{p}/3{d}.
 * Printed: When this defends a Guardian attack, clash with the attacking
 * hero. The winner creates a Seismic Surge token.
 */

describe("Clash of Mountains family AAA", () => {
  it("happy: defending a Guardian attack, clash winner creates Seismic Surge", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [disableRed],
        resourcePoints: 5,
        actionPoints: 1,
        deck: [nimblismBlue],
      },
      {
        hero: dash,
        hand: [clashOfMountainsRed],
        deck: [snatchRed],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: bravo },
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(disableRed);
    Dash.defendWith(clashOfMountainsRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectCombat(game).toHaveClashWinner(Dash);
    expectFabPlayer(Dash).toHaveTokenCount("seismic-surge", 1);
  });

  it("boundary: defending a non-Guardian attack does not clash", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: [nimblismBlue],
      },
      {
        hero: bravo,
        hand: [clashOfMountainsRed],
        deck: [snatchRed],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed);
    Bravo.defendWith(clashOfMountainsRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Bravo).toHaveTokenCount("seismic-surge", 0);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("seismic-surge", 0);
  });

  it("timing: playing this as an attack does not clash", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [clashOfMountainsRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: [snatchRed],
      },
      { hero: dash, hand: [], deck: [nimblismBlue] },
      { ...FAB_MANUAL_HARNESS, firstPlayer: bravo },
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(clashOfMountainsRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Bravo).toHaveTokenCount("seismic-surge", 0);
  });
});
