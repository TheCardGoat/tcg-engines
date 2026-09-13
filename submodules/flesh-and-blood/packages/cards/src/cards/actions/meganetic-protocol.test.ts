import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { maskOfMomentum } from "../equipment/mask-of-momentum.ts";
import { evoCircuitBreakerRed } from "../instants/evo-circuit-breaker.ts";
import { meganeticProtocolBlue } from "./meganetic-protocol.ts";

/**
 * Meganetic Protocol (EVO059) — Mechanologist Action - Attack.
 * Printed: "Evo Upgrade — The defending hero must defend this with X equipment
 * they control with -1{d} counters if able, where X is the number of Evos you
 * have equipped."
 *
 * Enforcement (§5 row EVO059, resolved): the defend-window requirement now
 * materializes during the defend step (CR 7.3.1) with the dynamic X = the
 * attacker's equipped evo count (CR 8.4.11) — with one evo equipped and a
 * -1{d}-counter equipment available to the defender, a hand-only declaration
 * is denied until one matching equipment defender is included.
 */

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Meganetic Protocol (EVO059) AAA", () => {
  it("happy: with no Evos equipped the requirement is vacuous and a hand block defends", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [meganeticProtocolBlue], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [snatchRed], life: 20, deck: 6 },
      manual,
    );
    game.as(dash).attackWith(meganeticProtocolBlue);
    expect(game.combat()?.activeLink?.attackPower).toBe(5);

    game.as(bravo).defendWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(bravo)).toHaveLife(17);
  });

  it("boundary: with one evo and a -1{d}-counter equipment available, a hand-only defense is denied", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [evoCircuitBreakerRed],
        hand: [meganeticProtocolBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        // No evo on the defender seat: X must resolve in the ATTACKER's
        // seat (CR 8.4.11), so a defender-seat count regression fails these
        // tests (X would be 0, no forced equipment). A plain head item still
        // carries the -1{d} counter the printed condition keys on.
        head: [maskOfMomentum],
        hand: [snatchRed],
        life: 20,
        deck: 6,
      },
      manual,
    );
    game.as(dash).attackWith(meganeticProtocolBlue);
    game.advanceCombatTo("defend");

    // Give the defender's head a -1{d} counter so the printed "if able"
    // condition is satisfied: X = 1 (attacker's Evo) equipment with a -1{d}
    // counter must be declared as a defender.
    const headId = game.as(bravo).findCardInZone("head", maskOfMomentum);
    game.setCounters(headId, { defenseCounterTotal: -1 });

    // Printed "must defend this with X equipment ... if able" — the
    // hand-only declaration is denied during the defend step.
    expect(() => game.as(bravo).defendWith(snatchRed)).toThrow(
      /must defend with a matching card they control if able/,
    );
  });

  it("grant: defending with the counter equipment satisfies the requirement", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [evoCircuitBreakerRed],
        hand: [meganeticProtocolBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        // No evo on the defender seat: X must resolve in the ATTACKER's
        // seat (CR 8.4.11), so a defender-seat count regression fails these
        // tests (X would be 0, no forced equipment). A plain head item still
        // carries the -1{d} counter the printed condition keys on.
        head: [maskOfMomentum],
        hand: [snatchRed],
        life: 20,
        deck: 6,
      },
      manual,
    );
    game.as(dash).attackWith(meganeticProtocolBlue);
    game.advanceCombatTo("defend");

    const headId = game.as(bravo).findCardInZone("head", maskOfMomentum);
    game.setCounters(headId, { defenseCounterTotal: -1 });

    // X = 1: including the -1{d}-counter head satisfies the printed
    // requirement. Snatch 2{d} + mask 2{d} - 1 (counter) = 3 total defense,
    // so the 5{p} attack deals 2.
    game.as(bravo).defendWith(snatchRed, maskOfMomentum);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(bravo)).toHaveLife(18);
  });
});
