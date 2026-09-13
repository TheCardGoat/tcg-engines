import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { vigorousWindupRed } from "./vigorous-windup.ts";

/**
 * Vigorous Windup (HVY186) — Guardian/Warrior Attack Action, Red.
 *
 * Printed: Instant - Discard this: Create a Vigor token.
 */

describe("Vigorous Windup family AAA", () => {
  it("happy: Instant discard from hand creates a Vigor token", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [vigorousWindupRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(vigorousWindupRed);
    game.passBoth();

    expectFabCard(Bravo, vigorousWindupRed).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveTokenCount("vigor", 1).toHaveAP(1);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("vigor", 0);
  });

  it("boundary: cannot activate a second time after the card is discarded", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [vigorousWindupRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(vigorousWindupRed);
    game.passBoth();
    Bravo.expectActivationRejected(vigorousWindupRed);

    expectFabPlayer(Bravo).toHaveTokenCount("vigor", 1);
  });

  it("timing: Instant spends no AP; Vigor is destroyed at the start of your next turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [vigorousWindupRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(vigorousWindupRed);
    game.passBoth();
    expectFabPlayer(Bravo).toHaveAP(1).toHaveTokenCount("vigor", 1);

    Bravo.endTurn();
    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Bravo).toHaveTokenCount("vigor", 0);
  });
});
