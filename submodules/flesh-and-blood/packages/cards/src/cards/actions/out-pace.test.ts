import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { zeroToSixtyRed } from "./zero-to-sixty.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { evoCircuitBreakerRed } from "../instants/evo-circuit-breaker.ts";
import { outPaceRed } from "./out-pace.ts";

/**
 * Out Pace (EVO204) — Mechanologist Action - Attack (boost).
 * Printed: "Boost / This can't be defended by equipment."
 *
 * Enforcement (§5 row EVO204, resolved): the resolution-kind restrict/defend
 * rule now materializes during the Defend Step (CR 7.3.1) of this very attack —
 * equipment, normally declarable from public equipment permanents (CR 7.3.2a),
 * cannot be declared because the printed restriction makes the declaration
 * illegal (CR 7.3.2b C). "Can't be defended by equipment" is a restriction and
 * takes precedence (CR 1.0.2 — its own worked example). Hand cards defend
 * normally; the ban dies with the combat chain.
 */

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Out Pace (EVO204) AAA", () => {
  it("happy: equipment can't be declared as a defender during the Defend Step", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [outPaceRed], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: bravo, head: [evoCircuitBreakerRed], life: 20, deck: 6 },
      manual,
    );
    game.as(dash).attackWith(outPaceRed);
    game.advanceCombatTo("defend");

    // Printed "This can't be defended by equipment." — the Evo Circuit Breaker
    // declaration is denied inside the defend window (CR 7.3.1, 1.0.2).
    expect(() => game.as(bravo).defendWith(evoCircuitBreakerRed)).toThrow(
      /continuous effect prevents this card from defending/,
    );

    game.as(bravo).defendWith();
    game.helpers.resolveRestOfCombat();

    // Equipment was the only potential blocker, so the attack lands for 4.
    expectFabPlayer(game.as(bravo)).toHaveLife(16);
  });

  it("boundary: a hand action card defends normally and reduces the damage", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [outPaceRed], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [snatchRed], life: 20, deck: 6 },
      manual,
    );
    game.as(dash).attackWith(outPaceRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);

    // The restriction names equipment only — Snatch (2{d}) from hand is legal.
    game.as(bravo).defendWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(bravo)).toHaveLife(18);
  });

  it("timing: the ban dies with the combat chain — equipment defends the next attack", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [outPaceRed, zeroToSixtyRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, head: [evoCircuitBreakerRed], life: 20, deck: 6 },
      manual,
    );

    // Link 1: Out Pace — equipment denied, attack lands for 4.
    game.as(dash).attackWith(outPaceRed);
    game.advanceCombatTo("defend");
    expect(() => game.as(bravo).defendWith(evoCircuitBreakerRed)).toThrow(
      /continuous effect prevents this card from defending/,
    );
    game.as(bravo).defendWith();
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(bravo)).toHaveLife(16);

    // Link 2 (new combat chain): the restriction expired — the same equipment
    // may be declared again; Zero to Sixty (4{p}) − 0{d} deals 4.
    game.as(dash).attackWith(zeroToSixtyRed);
    game.as(bravo).defendWith(evoCircuitBreakerRed);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(bravo)).toHaveLife(12);
  });
});
