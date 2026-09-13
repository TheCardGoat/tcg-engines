import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { kavdaenTraderOfSkins } from "./kavdaen-trader-of-skins.ts";

/**
 * Hero behavior acceptance test — Kavdaen, Trader of Skins (CRU118).
 *
 * Implements the per-hero AAA requirements:
 * - Core mechanic: highest life hero loses 1 life + creates Copper
 * - Core mechanic: lowest life hero gains 1 life
 * - Boundaries: 20hp health, once per turn
 *
 * FLUENT API ONLY — no .exec(), listLegalCommands, or answerPaymentDecision.
 */

const opponentHero = dash;

// ---------------------------------------------------------------------------
// kavdaen-trader-of-skins (CRU118) — Merchant/Young — 20hp
// Printed: "Once per Turn Action - {r}{r}{r}: If a hero has more {h} than all
// other heroes, they lose 1{h} and create a Copper token. Then if a hero has
// less {h} than all other heroes, they gain 1{h}. Go again"
// ---------------------------------------------------------------------------

describe("kavdaen-trader-of-skins (CRU118)", () => {
  it("boundaries: hero defaults to 20 life (Young health boundary)", () => {
    const game = FabTestEngine.start(
      { hero: kavdaenTraderOfSkins, deck: 6 },
      { hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(kavdaenTraderOfSkins)).toHaveLife(20);
  });

  it("core mechanic: when both heroes have equal life, no effect occurs (neither highest nor lowest unique)", () => {
    // Both at 20 → tie → highest-life-hero selector finds no unique highest,
    // lowest-life-hero selector finds no unique lowest → no-op.
    const game = FabTestEngine.start(
      {
        hero: kavdaenTraderOfSkins,
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Kavdaen = game.as(kavdaenTraderOfSkins);

    Kavdaen.activate(kavdaenTraderOfSkins);
    game.helpers.resolveUntilIdle();

    // Both heroes still at 20 (tie → no unique highest/lowest).
    expect(Kavdaen.life()).toBe(20);
    expect(game.as(opponentHero).life()).toBe(20);
  });

  it("core mechanic: highest life hero loses 1 and creates Copper; lowest gains 1", () => {
    // Kavdaen at 20, opponent at 18 → Kavdaen is highest, opponent is lowest.
    const game = FabTestEngine.start(
      {
        hero: kavdaenTraderOfSkins,
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, life: 18, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Kavdaen = game.as(kavdaenTraderOfSkins);
    const Opponent = game.as(opponentHero);

    Kavdaen.activate(kavdaenTraderOfSkins);
    game.helpers.resolveUntilIdle();

    // Kavdaen (highest) loses 1 → 19; opponent (lowest) gains 1 → 19.
    expect(Kavdaen.life()).toBe(19);
    expect(Opponent.life()).toBe(19);
    // Kavdaen created a Copper token.
    expect(Kavdaen.zone("arena")).toContain("token:copper");
  });

  it("core mechanic: go again refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: kavdaenTraderOfSkins,
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, life: 18, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Kavdaen = game.as(kavdaenTraderOfSkins);

    expect(Kavdaen.actionPoints()).toBe(1);
    Kavdaen.activate(kavdaenTraderOfSkins);
    game.helpers.resolveUntilIdle();

    // −1 AP + go again = 1 AP.
    expect(Kavdaen.actionPoints()).toBe(1);
  });

  it("boundaries: once per turn — second activation throws", () => {
    const game = FabTestEngine.start(
      {
        hero: kavdaenTraderOfSkins,
        resourcePoints: 6,
        actionPoints: 2,
        deck: 6,
      },
      { hero: opponentHero, life: 18, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Kavdaen = game.as(kavdaenTraderOfSkins);

    Kavdaen.activate(kavdaenTraderOfSkins);
    game.helpers.resolveUntilIdle();

    Kavdaen.expectActivationRejected(kavdaenTraderOfSkins);
  });

  it("boundaries: requires 3 resources to activate", () => {
    const game = FabTestEngine.start(
      {
        hero: kavdaenTraderOfSkins,
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, life: 18, deck: 6 },
      { autoPitch: false },
    );
    const Kavdaen = game.as(kavdaenTraderOfSkins);

    Kavdaen.expectActivationRejected(kavdaenTraderOfSkins);
  });
});
