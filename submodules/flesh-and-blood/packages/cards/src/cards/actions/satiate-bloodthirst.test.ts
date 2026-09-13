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
import { satiateBloodthirstYellow } from "./satiate-bloodthirst.ts";

/**
 * Satiate Bloodthirst — Shadow Brute Action - Attack, cost 3.
 *
 * Printed: Instant - Banish this from your hand: Gain 1{h}. Blood Debt
 */

describe("Satiate Bloodthirst AAA", () => {
  it("happy: banishing this from hand gains 1 life", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [satiateBloodthirstYellow],
        life: 20,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.activate(satiateBloodthirstYellow);
    game.untilIdle();

    expectFabCard(Levia, satiateBloodthirstYellow).toBeBanished();
    expectFabPlayer(Levia).toHaveLife(21);
  });

  it("boundary: playing the attack does not gain life", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [satiateBloodthirstYellow],
        resourcePoints: 3,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.playAttack(satiateBloodthirstYellow);
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat();

    expectFabCard(Levia, satiateBloodthirstYellow).toBeIn("graveyard");
    expectFabPlayer(Levia).toHaveLife(20);
    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });
});
