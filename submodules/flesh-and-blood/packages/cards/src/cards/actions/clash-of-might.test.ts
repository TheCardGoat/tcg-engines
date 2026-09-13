import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { clashOfMightRed } from "./clash-of-might.ts";

/**
 * Clash of Might (HVY137) — Brute/Guardian Attack, 6{p}/3{d}.
 * Printed: When this defends, clash with the attacking hero. The winner
 * creates a Might token.
 */

describe("Clash of Might family AAA", () => {
  it("happy: defending, clash winner creates Might", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: [nimblismBlue],
      },
      {
        hero: bravo,
        hand: [clashOfMightRed],
        deck: [snatchRed],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed);
    Bravo.defendWith(clashOfMightRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectCombat(game).toHaveClashWinner(Bravo);
    expectFabPlayer(Bravo).toHaveTokenCount("might", 1);
  });

  it("boundary: clash loser does not create Might", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: [snatchRed],
      },
      {
        hero: bravo,
        hand: [clashOfMightRed],
        deck: [nimblismBlue],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    Bravo.defendWith(clashOfMightRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectCombat(game).toHaveClashWinner(Dash);
    expectFabPlayer(Bravo).toHaveTokenCount("might", 0);
    expectFabPlayer(Dash).toHaveTokenCount("might", 1);
  });

  it("timing: playing this as an attack does not clash", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [clashOfMightRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [snatchRed],
      },
      { hero: dash, hand: [], deck: [nimblismBlue] },
      { ...FAB_MANUAL_HARNESS, firstPlayer: bravo },
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(clashOfMightRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Bravo).toHaveTokenCount("might", 0);
  });
});
