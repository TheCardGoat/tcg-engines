import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { genisWotchuneed } from "./genis-wotchuneed.ts";
import { snatchRed } from "../actions/snatch.ts";

/**
 * Hero behavior acceptance test — Genis Wotchuneed (EVR085).
 *
 * Implements the per-hero AAA requirements:
 * - Core mechanic: each other hero may cycle → Silver for Genis
 * - Core mechanic: if no Silver created, Genis draws a card
 * - Boundaries: 20hp health, once per turn
 *
 * FLUENT API ONLY — no .exec(), listLegalCommands, or answerPaymentDecision.
 */

const opponentHero = dash;

// ---------------------------------------------------------------------------
// genis-wotchuneed (EVR085) — Merchant/Young — 20hp
// Printed: "Once per Turn Action - {r}{r}: Each other hero may put a card from
// their hand on the bottom of their deck. If they do, they draw a card and you
// create a Silver token. If you gain no Silver this way, draw a card. Go again"
// ---------------------------------------------------------------------------

describe("genis-wotchuneed (EVR085)", () => {
  it("boundaries: hero defaults to 20 life (Young health boundary)", () => {
    const game = FabTestEngine.start(
      { hero: genisWotchuneed, deck: 6 },
      { hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(genisWotchuneed)).toHaveLife(20);
  });

  it("core mechanic: opponent may cycle a card → Genis creates Silver token", () => {
    // EVR085-a1: opponent optionally cycles → Silver for Genis + opponent draws.
    // Give opponent a card in hand so they can cycle.
    const game = FabTestEngine.start(
      {
        hero: genisWotchuneed,
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: opponentHero,
        hand: [snatchRed],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Genis = game.as(genisWotchuneed);

    Genis.activate(genisWotchuneed);

    // The opponent gets an optional decision to cycle. Resolve with
    // optionalBoolean: true (opponent accepts → cycle → Silver created).
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    // Genis should have a Silver token.
    expect(Genis.zone("arena")).toContain("token:silver");
  });

  it("core mechanic: if opponent declines, Genis draws a card", () => {
    // When opponent declines, no Silver → Genis draws.
    const game = FabTestEngine.start(
      {
        hero: genisWotchuneed,
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: opponentHero,
        hand: [snatchRed],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Genis = game.as(genisWotchuneed);
    const handBefore = Genis.handCount();

    Genis.activate(genisWotchuneed);

    // Resolve with optionalBoolean: false (opponent declines).
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    // Genis should have drawn a card (hand count +1).
    expect(Genis.handCount()).toBe(handBefore + 1);
    // No Silver token since opponent declined.
    expect(Genis.zone("arena")).not.toContain("token:silver");
  });

  it("core mechanic: go again refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: genisWotchuneed,
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: opponentHero,
        hand: [snatchRed],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Genis = game.as(genisWotchuneed);

    expect(Genis.actionPoints()).toBe(1);
    Genis.activate(genisWotchuneed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    // −1 AP + go again = 1 AP.
    expect(Genis.actionPoints()).toBe(1);
  });

  it("boundaries: once per turn", () => {
    const game = FabTestEngine.start(
      {
        hero: genisWotchuneed,
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: opponentHero,
        hand: [snatchRed],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Genis = game.as(genisWotchuneed);

    Genis.activate(genisWotchuneed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    Genis.expectActivationRejected(genisWotchuneed);
  });

  it("boundaries: requires 2 resources to activate", () => {
    const game = FabTestEngine.start(
      {
        hero: genisWotchuneed,
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, hand: [snatchRed], deck: 6 },
    );
    const Genis = game.as(genisWotchuneed);

    Genis.expectActivationRejected(genisWotchuneed);
  });
});
