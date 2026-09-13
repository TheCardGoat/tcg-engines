import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { risingKneeThrustRed } from "./rising-knee-thrust.ts";
import { blackoutKickRed } from "./blackout-kick.ts";

/**
 * Blackout Kick (KSU009) — Ninja Action - Attack, cost 1, 4{p}, 3{d}.
 *
 * Printed: "Combo - If Rising Knee Thrust was the last attack this combat
 * chain, Blackout Kick gains +3{p}."
 *
 * Combo links stay on an OPEN chain: playAttack → advanceCombatTo("resolution")
 * → next playAttack.
 */

describe("Blackout Kick (KSU009) AAA", () => {
  it("happy: after Rising Knee Thrust on the same chain this gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [risingKneeThrustRed, blackoutKickRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.must.playAttack(risingKneeThrustRed);
    game.advanceCombatTo("resolution");
    Bravo.must.playAttack(blackoutKickRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: as the first link it stays printed 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [blackoutKickRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(blackoutKickRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: a closed Rising Knee Thrust chain does not arm combo on a fresh chain", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [risingKneeThrustRed, blackoutKickRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(risingKneeThrustRed);
    game.helpers.resolveRestOfCombat();
    Bravo.attackWith(blackoutKickRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4);
  });

  it("boundary: Snatch as the last attack does not grant +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, blackoutKickRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.must.playAttack(snatchRed);
    game.advanceCombatTo("resolution");
    Bravo.must.playAttack(blackoutKickRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4);
  });
});
