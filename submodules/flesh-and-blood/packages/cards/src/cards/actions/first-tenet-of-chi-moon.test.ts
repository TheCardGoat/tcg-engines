import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { zen } from "../heroes/zen.ts";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { snatchRed } from "./snatch.ts";
import { ragingOnslaughtRed } from "./raging-onslaught.ts";
import { firstTenetOfChiMoonBlue } from "./first-tenet-of-chi-moon.ts";

/**
 * First Tenet of Chi: Moon (ENG018) — next blue attack draws a card when it attacks.
 */

describe("First Tenet of Chi: Moon (ENG018) AAA", () => {
  it("happy: the next blue attack draws a card", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [firstTenetOfChiMoonBlue, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.play(firstTenetOfChiMoonBlue);
    game.helpers.resolveUntilIdle();
    Zen.playAttack(brutalAssaultBlue);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Zen).toHaveHandCount(1);
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("boundary: a Red attack without printed draw does not draw", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [firstTenetOfChiMoonBlue, ragingOnslaughtRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.play(firstTenetOfChiMoonBlue);
    game.helpers.resolveUntilIdle();
    Zen.playAttack(ragingOnslaughtRed);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Zen).toHaveHandCount(0);
  });

  it("boundary: a Red Snatch draws only from its printed hit, not from the blue-attack latch", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [firstTenetOfChiMoonBlue, snatchRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.play(firstTenetOfChiMoonBlue);
    game.helpers.resolveUntilIdle();
    Zen.playAttack(snatchRed);
    game.helpers.resolveRestOfCombat();
    // Snatch's printed hit draws 1. A wrongly latched Tenet would draw a second card.
    expectFabPlayer(Zen).toHaveHandCount(1);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [firstTenetOfChiMoonBlue],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Zen = game.as(zen);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Zen.defendWith([firstTenetOfChiMoonBlue]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Zen).toHaveLife(19);
  });
});
