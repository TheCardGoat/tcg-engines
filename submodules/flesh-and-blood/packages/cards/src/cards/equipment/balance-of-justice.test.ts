import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { tomeOfFyendalYellow } from "../actions/tome-of-fyendal.ts";
import { balanceOfJustice } from "./balance-of-justice.ts";

/**
 * Balance of Justice (HVY195) — Generic Head guardwell.
 *
 * Printed:
 *   Instant - Destroy this: Draw a card. Activate this only if an opponent
 *   has drawn 2 or more cards this turn.
 */

describe("Balance of Justice (HVY195) AAA", () => {
  it("happy: after the opponent draws 2 this turn, destroy this to draw", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [tomeOfFyendalYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 8,
      },
      { hero: bravo, head: [balanceOfJustice], hand: [], deck: 8 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.play(tomeOfFyendalYellow);
    game.helpers.resolveUntilIdle();
    Dash.pass();
    Bravo.activate(balanceOfJustice);
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, balanceOfJustice).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveHandCount(1);
  });

  it("boundary: cannot activate if the opponent has not drawn 2 this turn", () => {
    const game = FabTestEngine.start(
      { hero: bravo, head: [balanceOfJustice], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );

    game.as(bravo).expectActivationRejected(balanceOfJustice);
    expectFabCard(game.as(bravo), balanceOfJustice).toBeIn("head");
  });

  it("timing: opponent draws from last turn do not unlock this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [tomeOfFyendalYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 8,
      },
      { hero: bravo, head: [balanceOfJustice], hand: [], deck: 8 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.play(tomeOfFyendalYellow);
    game.helpers.resolveUntilIdle();
    Dash.endTurn();

    Bravo.expectActivationRejected(balanceOfJustice);
    expectFabCard(Bravo, balanceOfJustice).toBeIn("head");
  });
});
