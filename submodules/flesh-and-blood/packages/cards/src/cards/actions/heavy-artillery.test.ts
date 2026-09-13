import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { evoCircuitBreakerRed } from "../instants/evo-circuit-breaker.ts";
import { heavyArtilleryRed } from "./heavy-artillery.ts";

/**
 * Heavy Artillery (EVO061) — Mechanologist Action - Attack.
 * Printed: "Evo Upgrade — The defending hero can't defend this with attack
 * action cards with cost less than X, where X is the number of Evos you have
 * equipped."
 *
 * Enforcement (§5 row EVO061, resolved): the defend-window restriction now
 * materializes during the defend step (CR 7.3.1) with the dynamic cost filter
 * resolved in the attacker's seat — X = the attacker's equipped evo count
 * (CR 8.4.11), so cost-0 attack actions cannot defend while Dash has evos.
 */

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Heavy Artillery family AAA", () => {
  it("happy: with no Evos equipped the restriction is vacuous and a cost-0 attack action defends", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [heavyArtilleryRed], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [snatchRed], life: 20, deck: 6 },
      manual,
    );
    game.as(dash).attackWith(heavyArtilleryRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(6);

    game.as(bravo).defendWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(bravo)).toHaveLife(16);
  });

  it("boundary: with one evo equipped, the cost-0 attack action is denied as a defender", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [evoCircuitBreakerRed],
        hand: [heavyArtilleryRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [snatchRed], life: 20, deck: 6 },
      manual,
    );
    game.as(dash).attackWith(heavyArtilleryRed);
    game.advanceCombatTo("defend");

    // Printed: X = 1 evo equipped, so Snatch (cost 0) "can't defend this" —
    // the declaration is denied during the defend step.
    expect(() => game.as(bravo).defendWith(snatchRed)).toThrow(
      /continuous effect prevents this card from defending/,
    );
  });

  it("grant: non-attack-action defenders are unaffected by the cost ban", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [evoCircuitBreakerRed],
        hand: [heavyArtilleryRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, head: [evoCircuitBreakerRed], life: 20, deck: 6 },
      manual,
    );
    game.as(dash).attackWith(heavyArtilleryRed);
    game.advanceCombatTo("defend");

    // The equipment is not an attack action card, so the restriction does not
    // apply: 6{p} − 0{d} deals 6.
    game.as(bravo).defendWith(evoCircuitBreakerRed);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(bravo)).toHaveLife(14);
  });
});
