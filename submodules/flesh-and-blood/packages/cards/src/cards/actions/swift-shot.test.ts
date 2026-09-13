import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { deathDealer } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { swiftShotRed } from "./swift-shot.ts";

/**
 * Swift Shot (SEA110) — Ranger Arrow Attack, 4{p}/3{d}.
 *
 * Printed: When this is put face-up into your arsenal, it gets go again this
 * turn.
 */

describe("Swift Shot (SEA110) AAA", () => {
  it("happy: putting this face-up into arsenal then attacking refunds AP", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: swiftShotRed, state: { faceDown: false } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    expectFabCard(Azalea, swiftShotRed).toBeIn("arsenal").toBeFaceUp();
    Azalea.playAttack(swiftShotRed, { from: "arsenal" });
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabPlayer(Azalea).toHaveAP(1);
  });

  it("boundary: a face-down arsenal load still attacks at printed 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [swiftShotRed, snatchRed, snatchRed, snatchRed, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.endTurnWithArsenal(swiftShotRed);
    game.helpers.resolveUntilIdle();
    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle();
    Azalea.playAttack(swiftShotRed, { from: "arsenal" });
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("timing: cannot play Swift Shot from hand", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [swiftShotRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(azalea).playAttack(swiftShotRed)).toThrow();
    expectFabCard(game.as(azalea), swiftShotRed).toBeIn("hand");
  });
});
