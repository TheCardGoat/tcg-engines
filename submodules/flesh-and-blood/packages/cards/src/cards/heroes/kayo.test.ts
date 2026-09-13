import { describe, expect, it } from "vitest";
import {
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { kayo } from "./kayo.ts";
import { ballBreaker } from "../weapons/ball-breaker.ts";
import { wallopRed } from "../actions/wallop.ts";
import { bloodrushBellowYellow } from "../actions/bloodrush-bellow.ts";
import { alphaRampageRed } from "../actions/alpha-rampage.ts";

/**
 * Hero behavior acceptance test — Kayo (HVY002).
 *
 * Implements the per-hero AAA requirements:
 * - Core mechanic: +1{p} to attack actions everywhere except combat chain
 * - Core mechanic: first 6+ power discard each action phase → Might token
 * - Boundaries: 20hp health, 1 weapon zone
 *
 * Signature weapon: Ball Breaker (HVY006)
 *
 * FLUENT API ONLY — no .exec(), listLegalCommands, or answerPaymentDecision.
 */

const opponentHero = dash;

// ---------------------------------------------------------------------------
// kayo (HVY002) — Brute/Young — 20hp
// Printed:
//   "You have 1 weapon zone."
//   "Attack action cards you own get +1{p} while they are in any zone other
//    than the combat chain."
//   "The first time you discard a card with 6 or more {p} during each of your
//    action phases, create a Might token."
// ---------------------------------------------------------------------------

describe("kayo (HVY002)", () => {
  it("boundaries: hero defaults to 20 life (Young health boundary)", () => {
    const game = FabTestEngine.start({ hero: kayo, deck: 6 }, { hero: opponentHero, deck: 6 });
    expectFabPlayer(game.as(kayo)).toHaveLife(20);
  });

  it("core mechanic: attack action cards in hand get +1 power from the continuous effect", () => {
    // HVY002-a2: +1{p} to attack actions in any zone except combat chain.
    // wallop-red (HVY080) has base 7{p}; in hand → 8{p}.
    const game = FabTestEngine.start(
      { hero: kayo, hand: [wallopRed], deck: 6 },
      { hero: opponentHero, deck: 6 },
    );
    const Kayo = game.as(kayo);

    expectFabCard(Kayo, wallopRed).toHavePower(8); // base 7 + 1
  });

  it("signature weapon: Ball Breaker (HVY006) activates and opens combat at 3 power", () => {
    // Ball Breaker — Brute Weapon Flail 1H, 3{p}.
    // Once per Turn Action - {r}{r}: Attack
    const game = FabTestEngine.start(
      {
        hero: kayo,
        weapon1: [ballBreaker],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Kayo = game.as(kayo);

    Kayo.activate(ballBreaker);
    game.passBoth();

    expectCombat(game).toBeOpen().toHaveAttackPower(3);
  });

  it("boundaries: Ball Breaker is once per turn — second activation throws", () => {
    const game = FabTestEngine.start(
      {
        hero: kayo,
        weapon1: [ballBreaker],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Kayo = game.as(kayo);

    Kayo.activate(ballBreaker);
    game.passBoth();
    expectCombat(game).toBeOpen();

    Kayo.expectActivationRejected(ballBreaker);
  });

  it("core mechanic: first 6+ power discard during the action phase creates a Might token", () => {
    // HVY002-a3: first 6+ discard per action phase → Might token.
    // bloodrush-bellow-yellow discards a random card as cost.
    // alpha-rampage-red has 9{p} ≥ 6 → triggers the Might creation.
    const game = FabTestEngine.start(
      {
        hero: kayo,
        hand: [bloodrushBellowYellow, alphaRampageRed],
        deck: 6,
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: opponentHero, deck: 6 },
    );
    const Kayo = game.as(kayo);

    // Play Bloodrush Bellow; its additional cost discards a random card.
    // With only alphaRampageRed (9{p}) as the other card, the discard
    // always hits the 6+ threshold and creates a Might token.
    Kayo.play(bloodrushBellowYellow);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expect(Kayo.zone("arena")).toContain("token:might");
  });

  it("core mechanic: +1 power is NOT applied on the combat chain", () => {
    // HVY002-a2 excludes combat chain zone. After attacking, the card on
    // the chain link should show base power (no +1).
    const game = FabTestEngine.start(
      {
        hero: kayo,
        hand: [wallopRed],
        deck: 6,
        resourcePoints: 4,
        actionPoints: 1,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Kayo = game.as(kayo);

    Kayo.attackWith(wallopRed);

    // On the combat chain, wallop-red shows its base power of 7 (not 8).
    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(7);
  });
});
