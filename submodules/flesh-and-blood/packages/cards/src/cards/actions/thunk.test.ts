import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { alphaRampageRed } from "./alpha-rampage.ts";
import { testOfMightRed } from "../blocks/test-of-might.ts";
import { thunkRed } from "./thunk.ts";

/**
 * Thunk Red (HVY077) — Guardian AAC, 8{p}.
 *
 * Printed: When you win a clash revealing this, create a Might token.
 *
 * Clash reveals deck-tops (CR 8.5.45). Seat this on the defending hero's
 * deck and clash via Test of Might, same path as Rapturous Applause.
 */

describe("Thunk (HVY077) AAA", () => {
  it("happy: winning a clash revealing this creates Might", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: [nimblismBlue],
      },
      {
        hero: bravo,
        hand: [testOfMightRed],
        deck: [thunkRed],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed);
    Bravo.defendWith(testOfMightRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    // Test of Might prize + Thunk reveal-this.
    expectFabPlayer(Bravo).toHaveTokenCount("might", 2);
  });

  it("boundary: losing a clash revealing this does not create the extra Might", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: [alphaRampageRed],
      },
      {
        hero: bravo,
        hand: [testOfMightRed],
        deck: [thunkRed],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    Bravo.defendWith(testOfMightRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Bravo).toHaveTokenCount("might", 0);
    expectFabPlayer(Dash).toHaveTokenCount("might", 1);
  });

  it("timing: winning a clash revealing a different card does not mint Thunk's Might", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: [nimblismBlue],
      },
      {
        hero: bravo,
        hand: [testOfMightRed],
        deck: [snatchRed],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed);
    Bravo.defendWith(testOfMightRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Bravo).toHaveTokenCount("might", 1);
  });
});
