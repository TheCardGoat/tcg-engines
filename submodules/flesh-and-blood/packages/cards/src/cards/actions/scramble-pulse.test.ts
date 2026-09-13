import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { ironrotGauntlet } from "../equipment/ironrot-gauntlet.ts";
import { ironrotPlate } from "../equipment/ironrot-plate.ts";
import { snatchRed } from "./snatch.ts";
import { scramblePulseRed } from "./scramble-pulse.ts";

/**
 * Scramble Pulse (DYN095) — Mechanologist Action - Attack, cost 2, 5{p}, 3{d},
 * Boost.
 *
 * Printed: "Equipment have -1{d} while defending this combat chain. Boost"
 *
 * Equipment have −1{d} while defending this combat chain (a this-chain
 * defend latch, not a Layer snapshot).
 */

describe("Scramble Pulse (DYN095) AAA", () => {
  it("happy: defending equipment has -1{d} this combat chain", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [scramblePulseRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, arms: [ironrotGauntlet], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(scramblePulseRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(ironrotGauntlet);

    expectCombat(game).toHaveAttackPower(5);
    expectFabCard(Bravo, ironrotGauntlet).toHaveDefense(0);
  });

  it("boundary: a non-equipment defender is not reduced", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [scramblePulseRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(scramblePulseRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(snatchRed);

    expectFabCard(Bravo, snatchRed).toHaveDefense(2);
  });

  it("timing: the next combat chain's defending equipment is not reduced", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [scramblePulseRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: bravo,
        arms: [ironrotGauntlet],
        chest: [ironrotPlate],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(scramblePulseRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(ironrotGauntlet);
    game.helpers.resolveRestOfCombat();

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(ironrotPlate);

    expectFabCard(Bravo, ironrotPlate).toHaveDefense(1);
    expectFabPlayer(Bravo).toHaveLife(15);
  });
});
