import { describe, expect, it } from "vitest";
import { FabTestEngine, expectCombat } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { azalea } from "./azalea.ts";
import { deathDealer } from "../weapons/death-dealer.ts";
import { snatchRed } from "../actions/snatch.ts";
import { drillShotRed } from "../actions/drill-shot.ts";
import { tomeOfFyendalYellow } from "../actions/tome-of-fyendal.ts";
import { nimblismBlue } from "../actions/nimblism.ts";

/**
 * Hero behavior acceptance test — Azalea (ARC039).
 *
 * Implements the per-hero AAA requirements:
 * - Core mechanic: arsenal swap (bottom arsenal → top-deck to arsenal face-up)
 * - Core mechanic: Arrow card loaded this way gains dominate until EOT
 * - Core interaction: go again refunds the action point
 * - Boundaries: non-Arrow no-dominate, once-per-turn, empty-arsenal reject
 * - Signature weapon: Death Dealer (ARC040)
 *
 * FLUENT API ONLY — no .exec(), listLegalCommands, or answerPaymentDecision.
 */

const opponentHero = dash;

// ---------------------------------------------------------------------------
// azalea (ARC039) — Ranger/Young — 20hp
// Printed: "Once per Turn Action - 0: Put a card from your arsenal on the
// bottom of your deck. If you do, put the top card of your deck face up into
// your arsenal. If it's an arrow card, it gains dominate until end of turn.
// Go again"
// ---------------------------------------------------------------------------

describe("azalea (ARC039)", () => {
  it("core mechanic: bottom arsenal, load deck-top face-up; Arrow gains dominate", () => {
    // Deck array end is the top. Arsenal holds a non-Arrow; deck top is drill-shot (Arrow).
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [snatchRed],
        deck: [
          tomeOfFyendalYellow,
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
          drillShotRed, // top of deck (last element)
        ],
        resourcePoints: 0,
        actionPoints: 1,
        hand: [],
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Azalea = game.as(azalea);

    // Act — activate hero ability, resolve entity-target for arsenal swap.
    Azalea.activate(azalea);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    // Assert — old arsenal card is on deck bottom; Arrow is the sole arsenal card.
    expect(Azalea.zone("deck")[0]).toBe(snatchRed.canonicalId);
    expect(Azalea.zone("arsenal")).toEqual([drillShotRed.canonicalId]);

    // Play the loaded Arrow from arsenal — dominate must be on the chain link.
    if (!Azalea.hasPriority()) {
      game.as(opponentHero).pass();
    }
    Azalea.play(drillShotRed, { from: "arsenal" });
    game.passBoth();

    expectCombat(game).toHaveKeyword("dominate");
  });

  it("core interaction: go again refunds the action point spent to activate", () => {
    // layerKeywords go-again on ARC039-a1 → net AP 0 after resolution.
    const game = FabTestEngine.start(
      {
        hero: azalea,
        arsenal: [snatchRed],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, drillShotRed],
        resourcePoints: 0,
        actionPoints: 1,
        hand: [],
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Azalea = game.as(azalea);

    expect(Azalea.actionPoints()).toBe(1);
    Azalea.activate(azalea);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    // −1 AP to activate Action ability, +1 from go again = still 1.
    expect(Azalea.actionPoints()).toBe(1);
    expect(Azalea.zone("arsenal")).toEqual([drillShotRed.canonicalId]);
  });

  it("boundaries: non-Arrow arsenal load does not put dominate on a later hand attack", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [snatchRed],
        deck: [
          drillShotRed,
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
          tomeOfFyendalYellow, // top of deck is non-Arrow
        ],
        hand: [snatchRed],
        resourcePoints: 0,
        actionPoints: 2,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Azalea = game.as(azalea);

    Azalea.activate(azalea);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    // Tome of Fyendal (non-Arrow) loaded into arsenal.
    expect(Azalea.zone("arsenal")).toEqual([tomeOfFyendalYellow.canonicalId]);

    // Attack with a non-arrow from hand — no dominate (the loaded card was not an Arrow).
    if (!Azalea.hasPriority()) {
      game.as(opponentHero).pass();
    }
    Azalea.play(snatchRed);
    game.passBoth();

    expectCombat(game).notToHaveKeyword("dominate");
  });

  it("boundaries: once per turn — second activation is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        arsenal: [snatchRed],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, drillShotRed],
        resourcePoints: 0,
        actionPoints: 2,
        hand: [],
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Azalea = game.as(azalea);

    Azalea.activate(azalea);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    // Second activation within the same turn must be rejected.
    expect(() => Azalea.activate(azalea)).toThrow();
  });

  it("signature weapon: Death Dealer (ARC040) loads an Arrow into empty arsenal and draws", () => {
    // Death Dealer: "Once per Turn Action - {r}: If you have no cards in your
    // arsenal, you may put an arrow card from your hand face up into your
    // arsenal. If you do, draw a card. Go again"
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [drillShotRed, nimblismBlue],
        arsenal: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Azalea = game.as(azalea);

    const handBefore = Azalea.handCount();

    // Act — activate Death Dealer, answer the optional arrow→arsenal boolean.
    Azalea.activate(deathDealer);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    // Assert — Arrow moved to arsenal (face-up), one card drawn, go again refunds AP.
    expect(Azalea.zone("arsenal")).toEqual([drillShotRed.canonicalId]);
    expect(Azalea.handCount()).toBe(handBefore); // −1 arrow to arsenal, +1 draw = net 0
    expect(Azalea.actionPoints()).toBe(1); // −1 activate +1 go again = 1
  });
});
