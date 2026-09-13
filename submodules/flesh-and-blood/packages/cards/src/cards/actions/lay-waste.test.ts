import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { zeroToSixtyRed } from "./zero-to-sixty.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { evoCircuitBreakerRed } from "../instants/evo-circuit-breaker.ts";
import { layWasteRed } from "./lay-waste.ts";

/**
 * Lay Waste (EVO207) — Mechanologist Action - Attack (boost).
 * Printed: "Boost / This can't be defended by equipment."
 *
 * Same restrict/defend Equipment window as Out Pace (EVO204). 5{p}.
 */

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Lay Waste (EVO207) AAA", () => {
  it("happy: equipment can't be declared as a defender during the Defend Step", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [layWasteRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: bravo, head: [evoCircuitBreakerRed], life: 20, deck: 6 },
      manual,
    );
    game.as(dash).attackWith(layWasteRed);
    game.advanceCombatTo("defend");

    expect(() => game.as(bravo).defendWith(evoCircuitBreakerRed)).toThrow(
      /continuous effect prevents this card from defending/,
    );

    game.as(bravo).defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(bravo)).toHaveLife(15);
  });

  it("boundary: a hand action card defends normally and reduces the damage", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [layWasteRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [snatchRed], life: 20, deck: 6 },
      manual,
    );
    game.as(dash).attackWith(layWasteRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(5);

    game.as(bravo).defendWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(bravo)).toHaveLife(17);
  });

  it("timing: the ban dies with the combat chain — equipment defends the next attack", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [layWasteRed, zeroToSixtyRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, head: [evoCircuitBreakerRed], life: 20, deck: 6 },
      manual,
    );

    game.as(dash).attackWith(layWasteRed);
    game.advanceCombatTo("defend");
    expect(() => game.as(bravo).defendWith(evoCircuitBreakerRed)).toThrow(
      /continuous effect prevents this card from defending/,
    );
    game.as(bravo).defendWith();
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(bravo)).toHaveLife(15);

    game.as(dash).attackWith(zeroToSixtyRed);
    game.as(bravo).defendWith(evoCircuitBreakerRed);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(bravo)).toHaveLife(11);
  });
});
