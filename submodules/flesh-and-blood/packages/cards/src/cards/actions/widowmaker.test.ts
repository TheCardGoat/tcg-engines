import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { unmovableRed } from "../defense-reactions/unmovable.ts";
import { evoCircuitBreakerRed } from "../instants/evo-circuit-breaker.ts";
import { deathDealer } from "../shared/test-recipients.ts";
import { widowmakerRed } from "./widowmaker.ts";

/**
 * Widowmaker (AZL015) — Ranger Action - Attack (arrow).
 * Printed: "Defense reactions can't be played to Widowmaker's chain link.
 * If Widowmaker is defended by fewer than 2 cards, it has +3{p}."
 *
 * Enforcement (§5 row AZL015, resolved): the defend/reaction-window
 * rule-modification now materializes during the window (CR 7.3.1) — the
 * "Reaction" filter shorthand covers attack/defense reaction card types
 * (CR 1.3.2c), and the play path denies defense reactions to this chain
 * link (CR 7.4.2c). The +3{p} static rides the implemented
 * defended-by-fewer-than-2-cards status handler.
 */

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Widowmaker (AZL015) AAA", () => {
  it("grant: the attack declares cleanly and defended-by-fewer-than-2 grants +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [widowmakerRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [snatchRed], life: 20, deck: 6 },
      manual,
    );

    // The +3{p} clause no longer throws at declaration: the
    // defended-by-fewer-than-2-cards status handler is implemented.
    game.as(azalea).attackWith(widowmakerRed, { from: "arsenal" });

    // One defending card (Snatch, 2{d}) — fewer than 2, so 4{p} + 3{p} − 2{d}
    // deals 5.
    game.as(bravo).defendWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(bravo)).toHaveLife(15);
  });

  it("boundary: defended by 2 cards keeps the base 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [widowmakerRed],
        resourcePoints: 3,
        actionPoints: 1,
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
    game.as(azalea).attackWith(widowmakerRed, { from: "arsenal" });

    // Two defending cards (Snatch 2{d} + Evo Circuit Breaker 0{d}) — the +3{p}
    // clause is off, so 4{p} − 2{d} deals 2.
    game.as(bravo).defendWith(snatchRed, evoCircuitBreakerRed);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(bravo)).toHaveLife(18);
  });

  it("boundary: defense reactions can't be played to this chain link (CR 7.4.2c)", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [widowmakerRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [unmovableRed], life: 20, resourcePoints: 3, deck: 6 },
      manual,
    );
    const Azalea = game.as(azalea);
    const Bravo = game.as(bravo);

    Azalea.attackWith(widowmakerRed, { from: "arsenal" });
    Bravo.defendWith();
    Azalea.pass();

    // Printed "Defense reactions can't be played to Widowmaker's chain link" —
    // the window rule denies the defense-reaction play itself.
    expect(() => Bravo.play(unmovableRed)).toThrow(
      /Defense reaction cards cannot be played for this chain link/,
    );
  });
});
