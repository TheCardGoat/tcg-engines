import { describe, expect, it } from "vitest";
import { expectFabToken, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { squizzyFloof } from "./squizzy-floof.ts";
import { snatchRed } from "../actions/snatch.ts";

/**
 * Hero behavior acceptance test — Squizzy Floof (HER100).
 *
 * Implements the per-hero AAA requirements:
 * - Core mechanic: at start of opposing hero's turn, they may create Cracked
 *   Bauble; if they do, Squizzy creates a Gold token
 * - Boundaries: 20hp health
 *
 * FLUENT API ONLY — no .exec(), listLegalCommands, or answerPaymentDecision.
 */

const opponentHero = dash;

// ---------------------------------------------------------------------------
// squizzy-floof (HER100) — Merchant/Young — 20hp
// Printed: "At the start of each opposing hero's turn, they may create a
// Cracked Bauble in their hand. If they do, you create a Gold token."
// ---------------------------------------------------------------------------

describe("squizzy-floof (HER100)", () => {
  it("core mechanic: opponent creates Cracked Bauble at turn start → Squizzy gets Gold", () => {
    // HER100-a1: triggered at start of opposing hero's turn.
    // Squizzy goes first, then ends turn → opponent's turn begins → trigger fires.
    const game = FabTestEngine.start(
      {
        hero: squizzyFloof,
        hand: [snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Squizzy = game.as(squizzyFloof);

    // Squizzy ends turn → opponent's turn begins → trigger fires.
    Squizzy.endTurn();

    // The opponent gets an optional decision: create Cracked Bauble?
    // Accept → Squizzy gets Gold.
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    // Squizzy should have a Gold token.
    expectFabToken(game, "gold").toHaveCount(1).toBeIn("arena");
  });

  it("core mechanic: opponent declines Bauble → no Gold for Squizzy", () => {
    const game = FabTestEngine.start(
      {
        hero: squizzyFloof,
        hand: [snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Squizzy = game.as(squizzyFloof);

    Squizzy.endTurn();

    // Opponent declines → no Gold.
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expect(Squizzy.zone("arena")).not.toContain("token:gold");
  });

  it("core mechanic: opponent accepts Bauble → opponent has Cracked Bauble in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: squizzyFloof,
        hand: [snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Squizzy = game.as(squizzyFloof);
    const Opponent = game.as(opponentHero);

    Squizzy.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    // Opponent should have a Cracked Bauble token in hand.
    expect(Opponent.zone("hand")).toContain("token:cracked-bauble");
    // Squizzy should have a Gold.
    expectFabToken(game, "gold").toHaveCount(1);
  });

  it("core mechanic: trigger fires each opposing turn", () => {
    // Multiple turn cycles: trigger fires at start of each opponent's turn.
    const game = FabTestEngine.start(
      {
        hero: squizzyFloof,
        hand: [snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Squizzy = game.as(squizzyFloof);
    const Opponent = game.as(opponentHero);

    // First cycle: Squizzy ends → opponent's turn → opponent accepts.
    Squizzy.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    // Gold count after first trigger.
    expectFabToken(game, "gold").toHaveCount(1);

    // Opponent ends turn → Squizzy's turn (no trigger for own turn).
    // Then Squizzy ends → opponent's turn again → trigger fires again.
    Opponent.endTurn();
    game.helpers.resolveUntilIdle();
    Squizzy.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    // The trigger fires again on the next opposing turn.
    expectFabToken(game, "gold").toHaveCount(2);
  });
});
