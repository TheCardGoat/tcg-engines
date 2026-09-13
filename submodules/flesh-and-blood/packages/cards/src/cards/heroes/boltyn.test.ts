import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { boltOfCourageYellow } from "../actions/bolt-of-courage.ts";
import { boltyn } from "./boltyn.ts";

/**
 * Hero behavior acceptance test — Boltyn (BOL001).
 *
 * Implements the per-hero AAA requirements from HEROES.md:
 * - Core mechanic: charge this turn → attack +1{p} while defended by AAC
 * - Core interaction: AR banish soul → attack with power > base gains go again
 * - Boundaries: without charge no buff, AR no go-again when power at base
 */

const opponentHero = dash;

// ---------------------------------------------------------------------------
// boltyn (BOL001) — Light/Warrior/Young — 20hp
// Printed: (a) if charged this turn, attacks +1{p} while defended by AAC;
// (b) AR — banish soul: attack with p>base gains go again.
// ---------------------------------------------------------------------------

describe("boltyn (BOL001)", () => {
  it("core mechanic: charge this turn → attack gets +1{p} while defended by an attack action", () => {
    // Arrange — Bolt of Courage (cost 0 Light Warrior attack) with optional
    // charge. Charge nimblism into soul; opponent blocks with snatch (AAC).
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [boltOfCourageYellow, nimblismBlue],
        deck: 6,
      },
      { hero: opponentHero, hand: [snatchRed], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Boltyn = game.as(boltyn);
    const Opponent = game.as(opponentHero);

    // Act — charge + attack. attackWith advances through layer to Defend.
    Boltyn.attackWith(boltOfCourageYellow, {
      charge: true,
      chargeCard: nimblismBlue,
    });

    // Assert — charged status active, soul populated.
    expectFabPlayer(Boltyn).toHaveChargedThisTurn();
    expectFabCard(Boltyn, nimblismBlue).toBeIn("soul");

    // Block with an attack action card → triggers the +1 continuous.
    Opponent.blockWith(snatchRed);

    // Assert — charged continuous +1 while defended by AAC (base 2 → 3).
    expectFabCard(Boltyn, boltOfCourageYellow).toHavePower(3);
  });

  it("core interaction: AR banish soul → attack with power > base gains go again", () => {
    // Charged continuous supplies the p>base gate once the attack is blocked
    // by an AAC; soul holds the charged card for the AR cost.
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [boltOfCourageYellow, nimblismBlue],
        deck: 6,
      },
      { hero: opponentHero, hand: [snatchRed], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Boltyn = game.as(boltyn);
    const Opponent = game.as(opponentHero);

    // Play with charge → soul.
    Boltyn.attackWith(boltOfCourageYellow, {
      charge: true,
      chargeCard: nimblismBlue,
    });

    // Block with AAC → power becomes 3 (> base 2).
    Opponent.blockWith(snatchRed);
    expectFabCard(Boltyn, boltOfCourageYellow).toHavePower(3);

    // Advance to reaction step (defender passes, attacker passes).
    game.advanceCombatTo("reaction");

    // Act — activate Boltyn's AR ability (BOL001-a2): banish soul → go again.
    Boltyn.activate(boltyn, {
      abilityId:
        "Fmf8trg9w8B8BBbWrf8w9:attackReactionBanishBoltynsSoulTargetAttackPowerGreaterThanBasePowerGainsGoAgain",
    });
    game.helpers.resolveUntilIdle({
      entityTargets: "minimum",
      ordering: "listed",
      optionalBoolean: false,
    });

    // Assert — soul banished and go again restored the spent action point.
    expectFabCard(Boltyn, nimblismBlue).toBeBanished();
    expectFabPlayer(Boltyn).toHaveAP(1);
  });

  it("boundaries: without charge, defended attack does not get the +1 continuous", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [boltOfCourageYellow],
        deck: 6,
      },
      { hero: opponentHero, hand: [snatchRed], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Boltyn = game.as(boltyn);
    const Opponent = game.as(opponentHero);

    // Play WITHOUT charging — no charge flag set.
    Boltyn.attackWith(boltOfCourageYellow);
    expectFabPlayer(Boltyn).notToHaveChargedThisTurn();

    // Block with AAC — but continuous is gated on charged-this-turn.
    Opponent.blockWith(snatchRed);

    // Assert — base power 2 only.
    expectFabCard(Boltyn, boltOfCourageYellow).toHavePower(2);
  });

  it("boundaries: AR does not grant go again when power is not greater than base", () => {
    // Soul is seeded but the attack is unbuffed (no charge continuous, no AAC
    // defense) so power stays at base. Soul banish may still be payable, but
    // the grant target filter (power-greater-than-base) rejects — no go again.
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [boltOfCourageYellow],
        soul: [nimblismBlue],
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Boltyn = game.as(boltyn);

    // Play without charge → no buff.
    Boltyn.attackWith(boltOfCourageYellow);
    expectFabCard(Boltyn, boltOfCourageYellow).toHavePower(2);

    // Advance to reaction step.
    game.advanceCombatTo("reaction");

    // The target attack does not meet the printed power condition, so this
    // reaction is not legal to activate even though the soul cost is payable.
    Boltyn.expectActivationRejected(
      boltyn,
      "Fmf8trg9w8B8BBbWrf8w9:attackReactionBanishBoltynsSoulTargetAttackPowerGreaterThanBasePowerGainsGoAgain",
    );
  });
});
