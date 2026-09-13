import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { legTapRed } from "./leg-tap.ts";
import { risingKneeThrustRed } from "./rising-knee-thrust.ts";

/**
 * Rising Knee Thrust (KSU014) — Ninja Action - Attack, cost 0, 3{p}, 3{d}.
 *
 * Printed: "Combo - If Leg Tap was the last attack this combat chain, Rising
 * Knee Thrust gains +2{p} and go again."
 *
 * CRU151-class pin: unprinted `keywords: [goAgain, combo]` refunds AP even
 * without the Leg Tap combo.
 */

describe("Rising Knee Thrust (KSU014) AAA", () => {
  it("happy: after Leg Tap on the same chain this gets +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [legTapRed, risingKneeThrustRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.must.playAttack(legTapRed);
    game.advanceCombatTo("resolution");
    Bravo.must.playAttack(risingKneeThrustRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(5);
  });

  it("boundary: as the first link it stays printed 3{p} without go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [risingKneeThrustRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    expectFabPlayer(Bravo).toHaveAP(1);
    Bravo.attackWith(risingKneeThrustRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat();
    expectFabPlayer(Bravo).toHaveAP(0);
  });

  it("boundary: Snatch as the last attack does not grant +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, risingKneeThrustRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.must.playAttack(snatchRed);
    game.advanceCombatTo("resolution");
    Bravo.must.playAttack(risingKneeThrustRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(3);
  });
});
