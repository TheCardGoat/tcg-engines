import { describe, expect, it } from "vitest";
import {
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { blazeFiremind } from "./blaze-firemind.ts";
import { whisperOfTheOracleBlue } from "../actions/whisper-of-the-oracle.ts";
import { zapBlue } from "../actions/zap.ts";
import { snatchRed } from "../actions/snatch.ts";

/**
 * Hero behavior acceptance test — blaze-firemind (HER117).
 *
 * Implements the per-hero AAA requirements from HEROES.md:
 * - Core mechanic: opt → energy counters equal to cards looked at
 * - Core mechanic: remove X energy → banish Wizard non-attack with arcane==X
 *   → play as instant this turn
 * - Boundaries: no energy → illegal, wrong arcane → not legal target, 17hp Young health
 */

const opponentHero = dash;

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// blaze-firemind (HER117) — Wizard/Young — 17hp
// a1: Whenever you opt, put energy counters on Blaze equal to cards looked at.
// a2: Once per Turn Instant — Remove X energy counters from Blaze: Banish a
//     Wizard non-attack action card from hand with arcane damage effect equal
//     to X. You may play it this turn as though it were an instant.
// ---------------------------------------------------------------------------

describe("blaze-firemind (HER117)", () => {
  it("boundaries: hero defaults to 17 life (low-health boundary)", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, deck: 6 },
      { hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(blazeFiremind)).toHaveLife(17);
  });

  it("core mechanic: opt puts energy counters equal to cards looked at", () => {
    // Whisper of the Oracle (opt 2) → +2 energy on Blaze.
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [whisperOfTheOracleBlue],
        deck: 6,
        actionPoints: 1,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Blaze = game.as(blazeFiremind);

    // Act — fluent play Whisper of the Oracle (opt 2, default keep on top).
    Blaze.play(whisperOfTheOracleBlue);
    game.untilIdle({ ordering: "listed" });

    // Assert — 2 energy from opt 2.
    expectFabCard(Blaze, blazeFiremind).toHaveCounters(2, "energy");
  });

  it("core mechanic: remove X energy → banish Wizard non-attack with arcane == X → play as instant", () => {
    // Blaze with 1 energy and Zap Blue (arcane 1) in hand.
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        heroState: { energyCounters: 1 },
        hand: [zapBlue],
        deck: 6,
        actionPoints: 0,
        resourcePoints: 0,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Blaze = game.as(blazeFiremind);

    // Act — fluent activate a2 (once-per-turn instant): X = 1, banish Zap.
    Blaze.activate(blazeFiremind); // X is forced to the single energy counter
    Blaze.target(zapBlue);
    game.untilIdle({ ordering: "listed" });

    // Assert — energy spent; Zap banished; instant-play window granted.
    expectFabCard(Blaze, blazeFiremind).toHaveCounters(0, "energy");
    expectFabCard(Blaze, zapBlue).toBeIn("banished");
    expect(Blaze.zone("hand")).not.toContain(zapBlue.canonicalId);

    // Play from banished as instant (0 AP) and deal arcane.
    const lifeBefore = game.as(opponentHero).life();
    Blaze.play(zapBlue, { from: "banished", target: game.as(opponentHero).id });
    game.untilIdle({ ordering: "listed" });

    // Assert — opponent took arcane damage.
    expect(game.as(opponentHero).life()).toBeLessThan(lifeBefore);
  });

  it("boundaries: a2 is illegal without energy counters", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [zapBlue],
        deck: 6,
        actionPoints: 0,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Blaze = game.as(blazeFiremind);

    // No energy counters → activation is illegal.
    Blaze.expectActivationRejected(blazeFiremind);
  });

  it("boundaries: wrong arcane amount is not a legal banish target", () => {
    // Seed 2 energy; only a non-arcane Action in hand → can choose X but
    // no matching Wizard non-attack with arcane == X exists.
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        heroState: { energyCounters: 2 },
        hand: [snatchRed],
        deck: 6,
        actionPoints: 0,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.activate(blazeFiremind);

    // Answer X=1; no Wizard non-attack action with arcane 1 exists in hand.
    expectWait(game).toHaveDecision("numeric");
    Blaze.chooseNumeric(1);

    // Assert — snatchRed remains in hand (not banished).
    expect(Blaze.zone("hand")).toContain(snatchRed.canonicalId);
    expect(Blaze.zone("banished")).not.toContain(snatchRed.canonicalId);
  });
});
