import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { deathDealer } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { rustyHarpoonBlue } from "./rusty-harpoon.ts";
import { callInTheBigGunsRed } from "./call-in-the-big-guns.ts";

/**
 * Call in the Big Guns (SEA120) — Ranger Action.
 *
 * Printed:
 *   Your next arrow attack this turn gets +3{p}.
 *   You may put an arrow from your hand face-up into your arsenal.
 *   Go again
 */

describe("Call in the Big Guns (SEA120) AAA", () => {
  it("happy: loads a hand arrow face-up into arsenal and that arrow gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [callInTheBigGunsRed, rustyHarpoonBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(callInTheBigGunsRed);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: rustyHarpoonBlue.canonicalId,
    });

    expectFabCard(Azalea, rustyHarpoonBlue).toBeIn("arsenal");
    expectFabCard(Azalea, rustyHarpoonBlue).toBeFaceUp();
    expectFabPlayer(Azalea).toHaveAP(1);

    Azalea.attackWith(rustyHarpoonBlue, { from: "arsenal" });
    // Rusty Harpoon base 1 + 3 = 4.
    expectCombat(game).toHaveAttackPower(4);
  });

  it("boundary: a non-arrow attack does not get +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [callInTheBigGunsRed, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(callInTheBigGunsRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Azalea.attackWith(snatchRed);

    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: declining the optional leaves the arrow in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [callInTheBigGunsRed, rustyHarpoonBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(callInTheBigGunsRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Azalea, rustyHarpoonBlue).toBeIn("hand");
    expect(Azalea.zone("arsenal")).toHaveLength(0);
    expectFabPlayer(Azalea).toHaveAP(1);
  });
});
