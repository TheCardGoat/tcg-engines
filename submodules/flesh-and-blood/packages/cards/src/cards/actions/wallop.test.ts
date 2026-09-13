import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { alphaRampageRed } from "./alpha-rampage.ts";
import { snatchRed } from "./snatch.ts";
import { testOfMightRed } from "../blocks/test-of-might.ts";
import { wallopRed } from "./wallop.ts";

/**
 * Wallop Red (HVY080) — Guardian Attack Action.
 *
 * Printed: When you win a clash revealing this, create a Vigor token.
 */

describe("Wallop (HVY080) AAA", () => {
  it("happy: winning a clash revealing this creates Vigor", () => {
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
        deck: [wallopRed],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed);
    Bravo.defendWith(testOfMightRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Bravo).toHaveTokenCount("vigor", 1);
    expectFabPlayer(Bravo).toHaveTokenCount("might", 1);
  });

  it("boundary: losing a clash revealing this does not create Vigor", () => {
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
        deck: [wallopRed],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    Bravo.defendWith(testOfMightRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Bravo).toHaveTokenCount("vigor", 0);
    expectFabPlayer(Dash).toHaveTokenCount("might", 1);
  });

  it("timing: winning a clash revealing a different card does not create Vigor", () => {
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

    expectFabPlayer(Bravo).toHaveTokenCount("vigor", 0);
    expectFabPlayer(Bravo).toHaveTokenCount("might", 1);
  });
});
