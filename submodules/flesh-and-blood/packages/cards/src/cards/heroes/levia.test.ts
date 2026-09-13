import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { levia } from "./levia.ts";
import { ravenousMeataxe } from "../weapons/ravenous-meataxe.ts";
import { ebonFold } from "../equipment/ebon-fold.ts";
import { skullCrackRed } from "../actions/skull-crack.ts";
import { shadowOfUrsurBlue } from "../actions/shadow-of-ursur.ts";

/**
 * Hero behavior acceptance test — Levia (LEV001).
 *
 * Implements the per-hero AAA requirements:
 * - Core mechanic: blood debt life-loss suppression when 6+ power card
 *   banished this turn
 * - Boundaries: 20hp health
 *
 * Signature weapon: Ravenous Meataxe (LEV003)
 *
 * FLUENT API ONLY — no .exec(), listLegalCommands, or answerPaymentDecision.
 */

const opponentHero = dash;

// ---------------------------------------------------------------------------
// levia (LEV001) — Shadow/Brute/Young — 20hp
// Printed: "If a card with 6 or more {p} has been put into your banished zone
// this turn, you don't lose {h} from blood debt during the end phase."
// ---------------------------------------------------------------------------

describe("levia (LEV001)", () => {
  it("boundaries: hero defaults to 20 life (Young health boundary)", () => {
    const game = FabTestEngine.start({ hero: levia, deck: 6 }, { hero: opponentHero, deck: 6 });
    expectFabPlayer(game.as(levia)).toHaveLife(20);
  });

  it("signature weapon: Ravenous Meataxe (LEV003) activates and opens combat at 3 power", () => {
    // Ravenous Meataxe — Brute Weapon Axe 2H, 3{p}.
    // Once per Turn Action - {r}{r}: Attack.
    // When attacking: draw a card then discard a random card. If 6+ power
    // discarded, +2{p} until EOT.
    const game = FabTestEngine.start(
      {
        hero: levia,
        weapon1: [ravenousMeataxe],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Levia = game.as(levia);

    Levia.activate(ravenousMeataxe);
    game.passBoth();

    // Base power is 3. The draw+discard trigger fires on attack,
    // but the conditional +2 only applies if a 6+ is discarded.
    expectCombat(game).toBeOpen().toHaveAttackPower(3);
  });

  it("boundaries: Ravenous Meataxe is once per turn — second activation throws", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        weapon1: [ravenousMeataxe],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Levia = game.as(levia);

    Levia.activate(ravenousMeataxe);
    game.passBoth();
    expectCombat(game).toBeOpen();

    Levia.expectActivationRejected(ravenousMeataxe);
  });

  it("core mechanic: banishing a 6{p} card this turn skips blood-debt life loss", () => {
    // Ebon Fold banishes the 6{p} skull-crack; the banished shadow-of-ursur
    // would otherwise drain 1{h} as blood debt during the end phase.
    const game = FabTestEngine.start(
      {
        hero: levia,
        head: [ebonFold],
        hand: [skullCrackRed],
        banished: [shadowOfUrsurBlue],
        resourcePoints: 1,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: opponentHero, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.activate(ebonFold);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: skullCrackRed.canonicalId });
    expectFabCard(Levia, skullCrackRed).toBeBanished();

    Levia.endTurn();
    game.helpers.untilIdle();
    expectFabPlayer(Levia).toHaveLife(20);
  });

  it("boundary: blood debt still drains 1{h} when no 6{p} card was banished this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [],
        banished: [shadowOfUrsurBlue],
        life: 20,
        deck: 6,
      },
      { hero: opponentHero, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.endTurn();
    game.helpers.untilIdle();
    expectFabPlayer(Levia).toHaveLife(19);
  });

  it("timing: a prior turn's 6{p} banish does not skip the next end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        head: [ebonFold],
        hand: [skullCrackRed],
        banished: [shadowOfUrsurBlue],
        resourcePoints: 1,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: opponentHero, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Opponent = game.as(opponentHero);

    Levia.activate(ebonFold);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: skullCrackRed.canonicalId });
    Levia.endTurn();
    game.helpers.untilIdle();
    expectFabPlayer(Levia).toHaveLife(20);

    Opponent.endTurn();
    game.helpers.untilIdle();
    Levia.endTurn();
    game.helpers.untilIdle();
    expectFabPlayer(Levia).toHaveLife(19);
  });
});
