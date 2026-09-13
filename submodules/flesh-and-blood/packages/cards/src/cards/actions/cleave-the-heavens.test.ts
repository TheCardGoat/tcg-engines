import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { levia } from "../heroes/levia.ts";
import { dash } from "../heroes/dash.ts";
import { cleaveTheHeavensRed } from "./cleave-the-heavens.ts";

/**
 * Cleave the Heavens — Shadow Brute Action - Attack, cost 2.
 *
 * Printed: Instant - Banish this from your hand: Create a Gate to i'Arathael
 * token. Blood Debt
 */

describe("Cleave the Heavens AAA", () => {
  it("happy: banishing this from hand creates a Gate to i'Arathael", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [cleaveTheHeavensRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.activate(cleaveTheHeavensRed);
    game.untilIdle();

    expectFabCard(Levia, cleaveTheHeavensRed).toBeBanished();
    expectFabPlayer(Levia).toHaveTokenCount("gate-to-i-arathael", 1);
  });

  it("boundary: playing the attack does not create a Gate", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [cleaveTheHeavensRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.playAttack(cleaveTheHeavensRed);
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat();

    expectFabCard(Levia, cleaveTheHeavensRed).toBeIn("graveyard");
    expectFabPlayer(Levia).toHaveTokenCount("gate-to-i-arathael", 0);
    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });
});
