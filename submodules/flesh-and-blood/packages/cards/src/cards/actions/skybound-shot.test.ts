import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { deathDealer } from "../shared/test-recipients.ts";
import { skyboundShotRed } from "./skybound-shot.ts";

/**
 * Skybound Shot (AZL013) — "If Skybound Shot has an aim counter, it has
 * +1{p}."
 *
 * Mode B (fab-rules): the continuous static (condition has-counter aim +
 * modify-numeric power) is evaluated on the active attack from the arsenal;
 * both condition directions are proven plus the resolution flow.
 */

describe("Skybound Shot (AZL013) AAA", () => {
  it("happy: an aim counter on the arsenal arrow raises power from 5 to 6", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: skyboundShotRed, state: { aimCounters: 1 } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(azalea).attackWith(skyboundShotRed, { from: "arsenal" });

    expectCombat(game).toHaveAttackPower(6); // printed 5 + aimed 1
  });

  it("boundary: without an aim counter the arrow stays at printed power 5", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [skyboundShotRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(azalea).attackWith(skyboundShotRed, { from: "arsenal" });

    expectCombat(game).toHaveAttackPower(5); // condition false: no +1{p}
  });

  it("timing: the aimed arrow's +1{p} flows into combat damage on resolution", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: skyboundShotRed, state: { aimCounters: 1 } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(azalea).attackWith(skyboundShotRed, { from: "arsenal" });
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(14); // 20 - (5 + 1 aimed)
  });
});
