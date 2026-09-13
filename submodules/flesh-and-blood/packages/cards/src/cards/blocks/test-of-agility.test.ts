import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { testOfAgilityRed } from "./test-of-agility.ts";

/**
 * Test of Agility (HVY162) — Brute/Warrior Block, 4{d}.
 * Printed: When this defends, clash with the attacking hero. The winner
 * creates an Agility token.
 */

describe("Test of Agility (HVY162) AAA", () => {
  it("happy: defending, clash winner creates Agility", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: [nimblismBlue],
      },
      {
        hero: rhinar,
        hand: [testOfAgilityRed],
        deck: [snatchRed],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Rhinar = game.as(rhinar);

    game.as(dash).playAttack(snatchRed);
    Rhinar.defendWith(testOfAgilityRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectCombat(game).toHaveClashWinner(Rhinar);
    expectFabPlayer(Rhinar).toHaveTokenCount("agility", 1);
  });

  it("boundary: clash loser does not create Agility", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: [snatchRed],
      },
      {
        hero: rhinar,
        hand: [testOfAgilityRed],
        deck: [nimblismBlue],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    Rhinar.defendWith(testOfAgilityRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectCombat(game).toHaveClashWinner(Dash);
    expectFabPlayer(Rhinar).toHaveTokenCount("agility", 0);
    expectFabPlayer(Dash).toHaveTokenCount("agility", 1);
  });
});
