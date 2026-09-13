import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabToken } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { tuffnut } from "./tuffnut.ts";
import { alphaRampageRed } from "../actions/alpha-rampage.ts";
import { snatchRed } from "../actions/snatch.ts";

/**
 * Hero behavior acceptance test — Tuffnut (SUP002).
 *
 * Implements the per-hero AAA requirements:
 * - Core mechanic: Instant tap → pitch deck-top; if 6+ power → crowd cheers
 * - Core mechanic: crowd cheers → Toughness token
 * - Boundaries: 20hp health, no-cheer → no Toughness
 *
 * No signature weapon.
 *
 * FLUENT API ONLY — no .exec(), listLegalCommands, or answerPaymentDecision.
 */

const opponentHero = dash;

// ---------------------------------------------------------------------------
// tuffnut (SUP002) — Revered/Brute/Young — 20hp
// Printed:
//   "Instant - {t}: Pitch the top card of your deck. If it has 6 or more {p},
//    the crowd cheers you."
//   "Whenever the crowd cheers you, create a Toughness token."
// ---------------------------------------------------------------------------

describe("tuffnut (SUP002)", () => {
  it("core mechanic: activating the Instant pitches deck-top and creates Toughness on 6+ cheer", () => {
    // SUP002-a1: tap → pitch top. If 6+ power → crowd cheers.
    // SUP002-a2: crowd cheers → Toughness token.
    // alpha-rampage-red (9{p}) on deck top → cheer → Toughness.
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, alphaRampageRed],
      },
      { hero: opponentHero, deck: 6 },
    );
    const Tuffnut = game.as(tuffnut);

    // Activate hero Instant — taps self, pitches deck top (alphaRampageRed, 9{p}).
    Tuffnut.activate(tuffnut);

    // 9{p} ≥ 6 → crowd cheers → Toughness token created.
    expectFabToken(game, "toughness").toHaveCount(1).toBeIn("arena");
  });

  it("boundaries: pitch of a sub-6 power card does NOT cheer → no Toughness", () => {
    // snatch-red (4{p}) on deck top → pitch → no cheer → no Toughness.
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        deck: [
          alphaRampageRed,
          alphaRampageRed,
          alphaRampageRed,
          alphaRampageRed,
          alphaRampageRed,
          snatchRed,
        ],
      },
      { hero: opponentHero, deck: 6 },
    );
    const Tuffnut = game.as(tuffnut);

    // Activate hero Instant — pitches deck top (snatchRed, 4{p} < 6).
    Tuffnut.activate(tuffnut);

    // No cheer → no Toughness token.
    expectFabToken(game, "toughness").toHaveCount(0);
  });

  it("core mechanic: pitched card lands in pitch zone", () => {
    // Verify the pitched card moves from deck top to pitch zone.
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, alphaRampageRed],
      },
      { hero: opponentHero, deck: 6 },
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.activate(tuffnut);

    // alphaRampageRed was on deck top; it should now be in pitch zone.
    expect(Tuffnut.zone("pitch")).toContain(alphaRampageRed.canonicalId);
  });

  it("boundaries: deck shrinks after pitching the top card", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, alphaRampageRed],
      },
      { hero: opponentHero, deck: 6 },
    );
    const Tuffnut = game.as(tuffnut);

    const deckSizeBefore = Tuffnut.zone("deck").length;
    Tuffnut.activate(tuffnut);
    const deckSizeAfter = Tuffnut.zone("deck").length;

    // One card pitched from top → deck shrinks by 1.
    expect(deckSizeAfter).toBe(deckSizeBefore - 1);
  });
});
