import { describe, expect, it } from "vitest";
import { FAB_MANUAL_HARNESS, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { deathDealer, searingShotRed } from "../shared/test-recipients.ts";
import { increaseTheTensionRed } from "./increase-the-tension.ts";

/**
 * Increase the Tension (CRU135) — Ranger Action, cost 1, def 2, Go again.
 *
 * Printed text (i18n, source of truth):
 * 'Your next arrow attack this turn gains +3{p} and "Defense reactions
 * can't be played from hand this chain link."\nGo again'
 *
 * /fab-rules Mode B handoff:
 * - citations: 8.3 (Go again), 8.4 (no combo here), 7.4 (Reaction Step:
 *   defense reactions playable only by the defending hero), 1.0.2
 *   (restriction > allowance), 2.10/2.15 (Arrow is a SUBTYPE; "Defense
 *   Reaction" is a TYPE — CR 1.3.2c).
 * - constraints: the +3{p} and the DR-ban latch onto the NEXT Arrow attack
 *   this turn (non-arrow attacks gain nothing and don't consume it); the
 *   DR-ban binds plays FROM HAND on that chain link only; printed Go again
 *   refunds the action point unconditionally.
 *
 * PINNED MISBEHAVIOR (plan §5 row, updated 2026-08-19): the DR-ban now
 * carries the correct shape (`types: ["Defense Reaction"]` — the
 * `subtypes: ["Reaction", "Reaction"]` encoding was reshaped in the review
 * follow-up), but the granted CRU135-a1 resolution ability still
 * MATERIALIZES AT LAYER RESOLUTION — after this chain link's Reaction Step —
 * so the restrict rule is never active during its printed window and a
 * defense reaction is accepted from hand despite the printed ban. The
 * operative defect is LATE MATERIALIZATION, not the filter shape: flipping
 * this pin requires projecting the granted play-restriction at the carrier
 * attack's announcement (the resolution-window machinery currently carries
 * only defend/activate actions). The +3{p} latch, the Arrow-subtype gate,
 * and Go again are asserted normally.
 */

describe("Increase the Tension (CRU135) AAA", () => {
  it("happy: the next arrow attack this turn gains +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [increaseTheTensionRed],
        weapon1: [deathDealer],
        arsenal: [searingShotRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(increaseTheTensionRed);
    game.helpers.resolveUntilIdle();
    Azalea.attackWith(searingShotRed, { from: "arsenal" });
    // Searing Shot base 4 + 3 from Increase the Tension = 7.
    expect(game.combat()?.activeLink?.attackPower).toBe(7);
  });

  it("boundary: a non-arrow attack gains nothing and doesn't consume the latch; Go again refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [increaseTheTensionRed, snatchRed],
        weapon1: [deathDealer],
        arsenal: [searingShotRed],
        resourcePoints: 1,
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    // Printed Go again: play costs 1 AP, resolution refunds 1 AP.
    Azalea.play(increaseTheTensionRed);
    game.helpers.resolveUntilIdle();
    expect(Azalea.actionPoints()).toBe(3);

    // Snatch is a NON-arrow attack: printed 4{p}, latch untouched.
    Azalea.attackWith(snatchRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);

    // The latch survives the non-arrow and still arms the next arrow:
    // close this chain, then fire the arrow from arsenal.
    game.helpers.resolveRestOfCombat();
    Azalea.attackWith(searingShotRed, { from: "arsenal" });
    expect(game.combat()?.activeLink?.attackPower).toBe(7); // 4 + 3.
  });
});
