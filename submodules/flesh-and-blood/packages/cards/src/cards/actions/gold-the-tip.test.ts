import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { deathDealer, headShotYellow, searingShotRed } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { marlynn } from "../heroes/marlynn.ts";
import { goldTheTipYellow } from "./gold-the-tip.ts";

/**
 * Gold the Tip (SEA088) — Pirate Ranger Action.
 *
 * Printed:
 *   Your next arrow attack this turn gets +3{p}.
 *   If there is a yellow arrow face-up in your arsenal, create a Gold token.
 *   Go again
 */

describe("Gold the Tip (SEA088) AAA", () => {
  it("happy: a face-up yellow arsenal arrow creates Gold and the next arrow gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: marlynn,
        weapon1: [deathDealer],
        hand: [goldTheTipYellow],
        arsenal: [{ card: headShotYellow, state: { faceUp: true } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Marlynn = game.as(marlynn);

    Marlynn.play(goldTheTipYellow);
    game.helpers.resolveUntilIdle();

    expect(Marlynn.zone("arena")).toContain("token:gold");
    expectFabPlayer(Marlynn).toHaveAP(1);

    Marlynn.attackWith(headShotYellow, { from: "arsenal" });
    // Head Shot base 3 + 3 = 6.
    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: a face-up non-yellow arrow does not create Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: marlynn,
        weapon1: [deathDealer],
        hand: [goldTheTipYellow],
        arsenal: [{ card: searingShotRed, state: { faceUp: true } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Marlynn = game.as(marlynn);

    Marlynn.play(goldTheTipYellow);
    game.helpers.resolveUntilIdle();

    expect(Marlynn.zone("arena")).not.toContain("token:gold");
  });

  it("timing: a non-arrow attack does not consume the +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: marlynn,
        weapon1: [deathDealer],
        hand: [goldTheTipYellow, snatchRed],
        arsenal: [{ card: headShotYellow, state: { faceUp: true } }],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Marlynn = game.as(marlynn);

    Marlynn.play(goldTheTipYellow);
    game.helpers.resolveUntilIdle();
    Marlynn.attackWith(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();

    Marlynn.attackWith(headShotYellow, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(6);
  });
});
