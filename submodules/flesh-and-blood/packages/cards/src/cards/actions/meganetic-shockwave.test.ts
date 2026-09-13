import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { zeroToSixtyRed } from "./zero-to-sixty.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { evoCircuitBreakerRed } from "../instants/evo-circuit-breaker.ts";
import { meganeticShockwaveBlue } from "./meganetic-shockwave.ts";

/**
 * Meganetic Shockwave (CRU103) — Mechanologist Action - Attack.
 * Printed: "The defending hero must defend Meganetic Shockwave with X equipment
 * they control, where X is the number of times you have boosted this combat
 * chain."
 *
 * Enforcement (§5 row CRU103, resolved): the defend-window requirement now
 * materializes during the defend step (CR 7.3.1) — after one boost on the
 * chain, X = 1 and a hand-only declaration is denied unless one matching
 * equipment defender is included (the requirement is vacuous when no
 * equipment is available, "if able" — CR 1.12.2a X=0 vs. unable).
 */

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Meganetic Shockwave (CRU103) AAA", () => {
  it("happy: with no boosts on the chain the requirement is vacuous and a hand block defends", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [meganeticShockwaveBlue], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [snatchRed], life: 20, deck: 6 },
      manual,
    );
    game.as(dash).attackWith(meganeticShockwaveBlue);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);

    game.as(bravo).defendWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(bravo)).toHaveLife(18);
  });

  it("boundary: after one boost, a hand-only defense is denied while equipment is available", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [zeroToSixtyRed, meganeticShockwaveBlue],
        resourcePoints: 6,
        actionPoints: 3,
        deck: 6,
      },
      {
        hero: bravo,
        head: [evoCircuitBreakerRed],
        hand: [snatchRed],
        life: 20,
        deck: 6,
      },
      manual,
    );
    // Boost Zero to Sixty, let its link resolve unblocked, then play
    // Meganetic Shockwave on the same chain: X = 1 boost this combat chain.
    game.as(dash).attackWith(zeroToSixtyRed, { boost: true });
    game.advanceCombatTo("resolution");
    game.as(dash).attackWith(meganeticShockwaveBlue);
    game.advanceCombatTo("defend");

    // Printed "must defend ... with X equipment" with equipment available —
    // the hand-only declaration is denied during the defend step.
    expect(() => game.as(bravo).defendWith(snatchRed)).toThrow(
      /must defend with a matching card they control if able/,
    );
  });

  it("grant: defending with the equipment satisfies the requirement", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [zeroToSixtyRed, meganeticShockwaveBlue],
        resourcePoints: 6,
        actionPoints: 3,
        deck: 6,
      },
      {
        hero: bravo,
        head: [evoCircuitBreakerRed],
        hand: [snatchRed],
        life: 20,
        deck: 6,
      },
      manual,
    );
    game.as(dash).attackWith(zeroToSixtyRed, { boost: true });
    game.advanceCombatTo("resolution");
    game.as(dash).attackWith(meganeticShockwaveBlue);
    game.advanceCombatTo("defend");

    // X = 1: including the head equipment as a defender satisfies the printed
    // requirement. Evo Circuit Breaker contributes 0{d}, so the math is
    // unchanged: link 1 (Zero to Sixty 4{p}) for 4; link 2 (Shockwave 4{p} −
    // Snatch 2{d}) for 2. 20 − 4 − 2 = 14.
    game.as(bravo).defendWith(snatchRed, evoCircuitBreakerRed);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(bravo)).toHaveLife(14);
  });
});
