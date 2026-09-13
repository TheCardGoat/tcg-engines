import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { commandAndConquerRed } from "../actions/command-and-conquer.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { testOfIronGripRed } from "./test-of-iron-grip.ts";

/**
 * Test of Iron Grip (MPG025) — Guardian Block.
 * Printed: When this defends, clash with the attacking hero. If there is a
 * winner, the other hero discards a card.
 */

describe("Test of Iron Grip (MPG025) AAA", () => {
  it("happy: a clash winner makes the other hero discard", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed, nimblismBlue, brutalAssaultBlue],
        actionPoints: 1,
        deck: [nimblismBlue],
      },
      {
        hero: bravo,
        hand: [testOfIronGripRed],
        deck: [commandAndConquerRed],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed);
    Bravo.defendWith(testOfIronGripRed);
    // Different deck tops guarantee Bravo wins. Dash, the loser, owns the
    // multi-card discard choice rather than the clash source's controller.
    const Dash = game.as(dash);
    game.advanceToDecision(Dash, "entity-target");
    Dash.target(nimblismBlue);
    game.untilIdle({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Dash).toHaveHandCount(1);
  });

  it("boundary: a clash with no winner does not discard", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed, nimblismBlue],
        actionPoints: 1,
        deck: [nimblismBlue],
      },
      {
        hero: bravo,
        hand: [testOfIronGripRed],
        deck: [nimblismBlue],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    game.as(dash).playAttack(snatchRed);
    Bravo.defendWith(testOfIronGripRed);
    // Identical tops: no winner, so neither hero discards.
    game.untilIdle({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Dash).toHaveHandCount(1);
  });
});
