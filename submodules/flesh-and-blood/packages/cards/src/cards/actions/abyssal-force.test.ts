import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { chane } from "../heroes/chane.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed, snatchYellow } from "./snatch.ts";
import { unboundByShadowRed } from "./unbound-by-shadow.ts";
import { abyssalForceBlue } from "./abyssal-force.ts";

/**
 * Abyssal Force, Blue — Shadow Action, cost 1, go again, Blood Debt.
 *
 * Printed: "You may play this from your banished zone.\nYour next Shadow
 * attack this turn gets overpower.\nGo again\nBlood Debt"
 */

describe("Abyssal Force AAA", () => {
  it("happy: playing from banished overpowers the next Shadow attack", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [unboundByShadowRed],
        banished: [abyssalForceBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue, snatchYellow], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.play(abyssalForceBlue, { from: "banished" });
    game.untilIdle();
    expectFabPlayer(Chane).toHaveAP(1);

    Chane.playAttack(unboundByShadowRed);
    expectCombat(game).toBeAtStep("defend").toHaveKeyword("overpower");

    const rejection = Dash.expectFailure({
      move: "defend",
      payload: {
        instanceIds: Dash.findCardsInZone("hand", [nimblismBlue, snatchYellow]),
      },
    });
    expect(rejection.errorCode).toBe("overpower");
  });

  it("boundary: the next generic attack is not overpowered", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [snatchRed],
        banished: [abyssalForceBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue, snatchYellow], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.play(abyssalForceBlue, { from: "banished" });
    game.untilIdle();

    Chane.playAttack(snatchRed);
    expectCombat(game).toBeAtStep("defend").notToHaveKeyword("overpower");

    Dash.defendWith(nimblismBlue, snatchYellow);
  });
});
