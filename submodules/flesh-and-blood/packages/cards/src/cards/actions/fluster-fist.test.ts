import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { openTheCenterRed } from "./open-the-center.ts";
import { flusterFistRed } from "./fluster-fist.ts";

/**
 * Fluster Fist (KSU010) — Combo: if Open the Center was the last attack,
 * +1{p} for each attack that has hit this combat chain. Printed 4{p}.
 * Seat Bravo (KSU016).
 */

describe("Fluster Fist (KSU010) AAA", () => {
  it("happy: after Open the Center hits, this is 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [openTheCenterRed, flusterFistRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(openTheCenterRed);
    game.advanceCombatTo("resolution");
    Bravo.playAttack(flusterFistRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(5); // 4 + 1 hit
  });

  it("boundary: as the first link this stays printed 4{p}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [flusterFistRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).playAttack(flusterFistRed);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: Open the Center that did not hit grants combo with +0{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [openTheCenterRed, flusterFistRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed, snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(openTheCenterRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(snatchRed, snatchRed); // 4+4 vs 5
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Bravo.playAttack(flusterFistRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
  });
});
