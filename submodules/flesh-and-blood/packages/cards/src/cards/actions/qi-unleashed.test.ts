import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { crouchingTiger } from "./crouching-tiger.ts";
import { qiUnleashedRed } from "./qi-unleashed.ts";

/**
 * Qi Unleashed (DYN059) — Ninja Action - Attack, cost 2, 3{p}, 3{d}.
 *
 * Printed: "Combo - If Crouching Tiger was the last attack this combat chain,
 * this gets +4{p}."
 *
 * Combo links stay on an OPEN chain: playAttack → advanceCombatTo("resolution")
 * → next playAttack (CIN013 / CRU057).
 */

describe("Qi Unleashed (DYN059) AAA", () => {
  it("happy: after Crouching Tiger on the same chain this gets +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [crouchingTiger, qiUnleashedRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.must.playAttack(crouchingTiger);
    game.advanceCombatTo("resolution");
    Bravo.must.playAttack(qiUnleashedRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: as the first link it stays printed 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [qiUnleashedRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(qiUnleashedRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(3);
  });

  it("timing: a closed Crouching Tiger chain does not arm combo on a fresh chain", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [crouchingTiger, qiUnleashedRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(crouchingTiger);
    game.helpers.resolveRestOfCombat();
    Bravo.attackWith(qiUnleashedRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(3);
  });

  it("boundary: Snatch as the last attack does not grant +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, qiUnleashedRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.must.playAttack(snatchRed);
    game.advanceCombatTo("resolution");
    Bravo.must.playAttack(qiUnleashedRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(3);
  });
});
