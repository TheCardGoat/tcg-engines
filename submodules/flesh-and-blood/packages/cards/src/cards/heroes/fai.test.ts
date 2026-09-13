import { describe, expect, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { fai } from "./fai.ts";
import { searingEmberblade } from "../weapons/searing-emberblade.ts";
import { phoenixFlameRed } from "../actions/phoenix-flame.ts";
import { snatchRed } from "../actions/snatch.ts";

/**
 * Hero behavior acceptance test — Fai (FAI001).
 *
 * Implements the per-hero AAA requirements:
 * - Core mechanic: start-game Phoenix Flame in graveyard
 * - Core mechanic: recover Phoenix Flame from graveyard to hand
 * - Boundaries: 20hp health, once per turn
 * - Signature weapon: Searing Emberblade (FAI002) — attack, go again with
 *   2+ Draconic chain links
 *
 * FLUENT API ONLY — no .exec(), listLegalCommands, or answerPaymentDecision.
 */

const opponentHero = dash;

// ---------------------------------------------------------------------------
// fai (FAI001) — Draconic/Ninja/Young — 20hp
// Printed: "You may start the game with a Phoenix Flame in your graveyard.
// Once per Turn Instant - {r}{r}{r}: Return a Phoenix Flame from your
// graveyard to your hand. Costs {r} less per Draconic chain link."
// ---------------------------------------------------------------------------

describe("fai (FAI001)", () => {
  it("boundaries: hero defaults to 20 life (Young health boundary)", () => {
    const game = FabTestEngine.start({ hero: fai, deck: 6 }, { hero: opponentHero, deck: 6 });
    expectFabPlayer(game.as(fai)).toHaveLife(20);
  });

  it("core mechanic: start-game Phoenix Flame is placed in graveyard", () => {
    // FAI001-a1: start-game — optional put Phoenix Flame in graveyard.
    // Use startGame to select Phoenix Flame for CR 4.1.5b seating.
    const game = FabTestEngine.start(
      {
        hero: fai,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, phoenixFlameRed],
        startGame: [phoenixFlameRed],
      },
      { hero: opponentHero, deck: 6 },
    );
    const Fai = game.as(fai);

    // After game start, Phoenix Flame should be in the graveyard.
    expect(Fai.zone("graveyard")).toContain(phoenixFlameRed.canonicalId);
  });

  it("core mechanic: recover Phoenix Flame from graveyard to hand", () => {
    // FAI001-a2: Once per Turn Instant - {r}{r}{r}: Return Phoenix Flame from
    // graveyard to hand. Costs {r} less per Draconic chain link.
    // Start with Phoenix Flame already in graveyard via startGame seating.
    const game = FabTestEngine.start(
      {
        hero: fai,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, phoenixFlameRed],
        startGame: [phoenixFlameRed],
        resourcePoints: 3,
        actionPoints: 0,
      },
      { hero: opponentHero, deck: 6 },
    );
    const Fai = game.as(fai);

    // Phoenix Flame should be in graveyard from start-game.
    expect(Fai.zone("graveyard")).toContain(phoenixFlameRed.canonicalId);

    // Activate recovery ability.
    Fai.activate(fai);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    // Phoenix Flame should now be in hand, not graveyard.
    expect(Fai.zone("hand")).toContain(phoenixFlameRed.canonicalId);
    expect(Fai.zone("graveyard")).not.toContain(phoenixFlameRed.canonicalId);
  });

  it("signature weapon: Searing Emberblade (FAI002) attacks at 3 power", () => {
    // FAI002-a1: Once per Turn Action - {r}{r}: Attack.
    const game = FabTestEngine.start(
      {
        hero: fai,
        weapon1: [searingEmberblade],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Fai = game.as(fai);

    Fai.activate(searingEmberblade);
    game.passBoth();

    expectCombat(game).toBeOpen().toHaveAttackPower(3);
  });

  it("signature weapon: Searing Emberblade is once per turn — engine gap: combat priority/decision resolution incomplete", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        weapon1: [searingEmberblade],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Fai = game.as(fai);

    Fai.activate(searingEmberblade);
    game.passBoth();

    Fai.expectActivationRejected(searingEmberblade);
  });

  it("core mechanic: recovery cost reduces only for Draconic chain links", () => {
    // A Phoenix Flame attack makes one Draconic chain link, reducing the
    // printed {r}{r}{r} activation cost to {r}{r}.
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [phoenixFlameRed],
        graveyard: [phoenixFlameRed],
        deck: 6,
        resourcePoints: 2,
        actionPoints: 1,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Fai = game.as(fai);

    Fai.attackWith(phoenixFlameRed);
    game.advanceCombatTo("resolution");
    Fai.activate(fai);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expect(Fai.resourcePoints()).toBe(0);
    expect(Fai.zone("hand")).toContain(phoenixFlameRed.canonicalId);

    // A non-Draconic link must not receive that discount.
    const nonDraconic = FabTestEngine.start(
      {
        hero: fai,
        hand: [snatchRed],
        graveyard: [phoenixFlameRed],
        deck: 6,
        resourcePoints: 2,
        actionPoints: 1,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const FaiWithoutDraconicLink = nonDraconic.as(fai);
    FaiWithoutDraconicLink.attackWith(snatchRed);
    nonDraconic.advanceCombatTo("resolution");

    expect(() => FaiWithoutDraconicLink.activate(fai)).toThrow();
  });
});
