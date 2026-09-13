import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { anothos } from "../weapons/anothos.ts";
import { disableRed } from "./disable.ts";
import { overbearRed } from "./overbear.ts";
import { nimblismBlue } from "./nimblism.ts";

/**
 * Overbear — Generic Action (red, cost 0).
 *
 * Printed: "Your next weapon attack this turn gets dominate.\nGo again"
 */

describe("Overbear (MPW151) AAA", () => {
  it("happy: the next weapon attack carries dominate and rejects a two-card defense", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [overbearRed],
        weapon1: [anothos],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [disableRed, nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(overbearRed);
    game.untilIdle();

    Bravo.activate(anothos);
    game.passBoth();
    game.advanceUntil({ stopAt: "defend" });

    expectCombat(game).toHaveKeyword("dominate");
    expect(Dash.expectBlockRejected([disableRed, nimblismBlue]).errorCode).toBe("dominate");
    Dash.defendWith(disableRed);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(19);
  });

  it("boundary: an attack action (not a weapon attack) does not get dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [overbearRed, disableRed],
        weapon1: [anothos],
        resourcePoints: 5,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(overbearRed);
    game.untilIdle();

    Bravo.playAttack(disableRed);
    expectCombat(game).notToHaveKeyword("dominate");
  });
});
