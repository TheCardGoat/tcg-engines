import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { clashOfBravadoYellow } from "./clash-of-bravado.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { ragingOnslaughtRed } from "./raging-onslaught.ts";
import { snatchRed } from "./snatch.ts";
import { overturnTheResultsBlue } from "./overturn-the-results.ts";

/**
 * Overturn the Results Blue (SUP093 / GEM094) — Reviled Attack Action, 5{p}.
 *
 * Printed: If you would fail to win a clash revealing this, instead you win
 * the clash and the crowd boos you.
 *
 * "Revealing this" is the clash deck-top reveal, not the attacking card.
 */

describe("Overturn the Results (SUP093) AAA", () => {
  it("happy: revealing this into a lost clash instead wins and the crowd boos you", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        // Bottom-first: last entry is the clash reveal. Overturn is 5{p}.
        deck: [nimblismBlue, overturnTheResultsBlue],
      },
      {
        hero: bravo,
        hand: [clashOfBravadoYellow],
        // Raging Onslaught red is 7{p} — Dash would fail to win 5 vs 7.
        deck: [ragingOnslaughtRed],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(snatchRed);
    Bravo.defendWith(clashOfBravadoYellow);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectCombat(game).toHaveClashWinner(Dash);
    expectFabPlayer(Dash).toHaveCrowdBooedThisTurn();
  });

  it("boundary: revealing this into a won clash does not boo you", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: [overturnTheResultsBlue],
      },
      {
        hero: bravo,
        hand: [clashOfBravadoYellow],
        deck: [nimblismBlue],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(snatchRed);
    Bravo.defendWith(clashOfBravadoYellow);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectCombat(game).toHaveClashWinner(Dash);
    expectFabPlayer(Dash).notToHaveCrowdBooedThisTurn();
  });

  it("timing: a clash that does not reveal this is not overturned", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [overturnTheResultsBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: [nimblismBlue],
      },
      {
        hero: bravo,
        hand: [clashOfBravadoYellow],
        deck: [snatchRed],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(overturnTheResultsBlue);
    Bravo.defendWith(clashOfBravadoYellow);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectCombat(game).toHaveClashWinner(Bravo);
    expectFabPlayer(Dash).notToHaveCrowdBooedThisTurn();
  });
});
