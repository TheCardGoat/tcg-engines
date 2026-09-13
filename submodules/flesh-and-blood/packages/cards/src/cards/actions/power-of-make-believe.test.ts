import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { commandAndConquerRed } from "./command-and-conquer.ts";
import { snatchRed } from "./snatch.ts";
import { powerOfMakeBelieveRed } from "./power-of-make-believe.ts";

/**
 * Power of Make Believe (PEN130) — "+1{p} for each card with 6 or more {p}
 * defending it." Printed 7{p}.
 */

describe("Power of Make Believe (PEN130) AAA", () => {
  it("happy: a 6{p} defender raises this from 7 to 8{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [powerOfMakeBelieveRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [commandAndConquerRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(prism).playAttack(powerOfMakeBelieveRed);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith(commandAndConquerRed);
    expectCombat(game).toHaveAttackPower(8);
  });

  it("boundary: a 4{p} defender does not raise this", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [powerOfMakeBelieveRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(prism).playAttack(powerOfMakeBelieveRed);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith(snatchRed);
    expectCombat(game).toHaveAttackPower(7);
  });

  it("timing: with no defenders this stays printed 7{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [powerOfMakeBelieveRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(prism).playAttack(powerOfMakeBelieveRed);
    expectCombat(game).toHaveAttackPower(7);
  });
});
