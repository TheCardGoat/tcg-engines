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
import { wreckerRompRed } from "./wrecker-romp.ts";
import { testOfMightRed } from "../blocks/test-of-might.ts";
import { theGoldenSonYellow } from "./the-golden-son.ts";

/**
 * The Golden Son Yellow (HVY059) — Victor Guardian AAC, 7{p}.
 *
 * Printed: When you win a clash revealing this, create a Gold token.
 */

describe("The Golden Son (HVY059) AAA", () => {
  it("happy: winning a clash revealing this creates Gold", () => {
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
        deck: [theGoldenSonYellow],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed);
    Bravo.defendWith(testOfMightRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Bravo).toHaveTokenCount("gold", 1);
    expectFabPlayer(Bravo).toHaveTokenCount("might", 1);
  });

  it("boundary: losing a clash revealing this does not create Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: [wreckerRompRed],
      },
      {
        hero: bravo,
        hand: [testOfMightRed],
        deck: [theGoldenSonYellow],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    Bravo.defendWith(testOfMightRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Bravo).toHaveTokenCount("gold", 0);
    expectFabPlayer(Dash).toHaveTokenCount("might", 1);
  });

  it("timing: winning a clash revealing a different card does not create Gold", () => {
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

    expectFabPlayer(Bravo).toHaveTokenCount("gold", 0);
    expectFabPlayer(Bravo).toHaveTokenCount("might", 1);
  });
});
