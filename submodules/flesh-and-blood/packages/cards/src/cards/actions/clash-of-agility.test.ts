import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { clashOfAgilityRed } from "./clash-of-agility.ts";

/**
 * Clash of Agility (HVY157) — Brute/Warrior Attack, 6{p}/3{d}.
 * Printed: When this defends, clash with the attacking hero. The winner
 * creates an Agility token.
 */

describe("Clash of Agility family AAA", () => {
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
        hand: [clashOfAgilityRed],
        deck: [snatchRed],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Rhinar = game.as(rhinar);

    game.as(dash).playAttack(snatchRed);
    Rhinar.defendWith(clashOfAgilityRed);
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
        hand: [clashOfAgilityRed],
        deck: [nimblismBlue],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    Rhinar.defendWith(clashOfAgilityRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectCombat(game).toHaveClashWinner(Dash);
    expectFabPlayer(Rhinar).toHaveTokenCount("agility", 0);
    expectFabPlayer(Dash).toHaveTokenCount("agility", 1);
  });

  it("timing: playing this as an attack does not clash", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [clashOfAgilityRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [snatchRed],
      },
      { hero: dash, hand: [], deck: [nimblismBlue] },
      { ...FAB_MANUAL_HARNESS, firstPlayer: rhinar },
    );
    const Rhinar = game.as(rhinar);

    Rhinar.playAttack(clashOfAgilityRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Rhinar).toHaveTokenCount("agility", 0);
  });
});
