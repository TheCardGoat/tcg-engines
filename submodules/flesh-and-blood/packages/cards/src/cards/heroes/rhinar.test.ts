import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { rhinar } from "./rhinar.ts";
import { rompingClub } from "../weapons/romping-club.ts";
import { bloodrushBellowYellow } from "../actions/bloodrush-bellow.ts";
import { alphaRampageRed } from "../actions/alpha-rampage.ts";

/**
 * Hero behavior acceptance test — Rhinar (RNR002).
 *
 * Implements the per-hero AAA requirements:
 * - Core mechanic: discard 6+ power card during action phase → intimidate
 * - Boundaries: 20hp health
 *
 * Signature weapon: Romping Club (RNR003)
 *
 * FLUENT API ONLY — no .exec(), listLegalCommands, or answerPaymentDecision.
 */

const opponentHero = dash;

// ---------------------------------------------------------------------------
// rhinar (RNR002) — Brute/Young — 20hp
// Printed: "Whenever you discard a card with 6 or more {p} during your action
// phase, intimidate."
// ---------------------------------------------------------------------------

describe("rhinar (RNR002)", () => {
  it("signature weapon: Romping Club (RNR003) activates and opens combat at 4 power", () => {
    // Romping Club — Brute Weapon Club 2H, 4{p}.
    // Once per Turn Action - {r}{r}: Attack
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [rompingClub],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Rhinar = game.as(rhinar);
    const opponentPlayer = game.as(opponentHero);

    Rhinar.activate(rompingClub);
    game.passBoth();

    expectFabPlayer(Rhinar).toHaveResourceCount(0);
    expectCombat(game).toBeOpen().toHaveAttackPower(4);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(opponentPlayer).toHaveLife(16);
  });

  it("boundaries: Romping Club is once per turn — second activation throws", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [rompingClub],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Rhinar = game.as(rhinar);
    const _opponentPlayer = game.as(opponentHero);

    Rhinar.activate(rompingClub);
    game.helpers.resolveRestOfCombat();

    Rhinar.expectActivationRejected(rompingClub);
  });

  it("core mechanic: discarding a 6+ power card during action phase triggers intimidate", () => {
    // RNR002-a1: whenever 6+ discard → intimidate.
    // Bloodrush Bellow discards a random card as cost; alphaRampageRed (9{p})
    // is the only other card in hand, guaranteeing a 6+ discard.
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [bloodrushBellowYellow, alphaRampageRed],
        deck: 6,
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Rhinar = game.as(rhinar);
    const opponentPlayer = game.as(opponentHero);

    // Before discard, opponent has full hand (not intimidated).
    const handBefore = opponentPlayer.handCount();

    // Play Bloodrush Bellow → discards alphaRampageRed (9{p} ≥ 6).
    Rhinar.play(bloodrushBellowYellow);
    game.helpers.resolveUntilIdle();

    // Intimidate banished one card from the opponent's full starting hand.
    expect(opponentPlayer.handCount()).toBe(handBefore - 1);
  });

  it("boundaries: Romping Club gains +1 power when a 6+ power card is discarded", () => {
    // RNR003-a2: once per turn, 6+ discard → Romping Club +1{p} until EOT.
    // Test that after the 6+ discard, the weapon power increases.
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [rompingClub],
        hand: [bloodrushBellowYellow, alphaRampageRed],
        deck: 6,
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Rhinar = game.as(rhinar);

    // Discard 6+ to trigger RNR003-a2 (+1 power to Romping Club).
    Rhinar.play(bloodrushBellowYellow);
    game.helpers.resolveUntilIdle();

    // Romping Club should now have 5 power (base 4 + 1 from trigger).
    expectFabCard(Rhinar, rompingClub).toHavePower(5);
  });
});
