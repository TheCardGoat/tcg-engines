import { describe, expect, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { lexiLivewire } from "./lexi-livewire.ts";
import { shiver } from "../weapons/shiver.ts";
import { electrifyRed as electrify } from "../actions/electrify.ts";
import { blizzardBlue } from "../instants/blizzard.ts";
import { snatchRed } from "../actions/snatch.ts";

/**
 * Hero behavior acceptance test — Lexi, Livewire (ELE031).
 *
 * Implements the per-hero AAA requirements:
 * - Core mechanic: turn face-down arsenal face-up; Lightning → next attack
 *   gains go again; Ice → create Frostbite token under opponent
 * - Core interaction: layerKeyword go-again refunds the action point
 * - Boundaries: once per turn, empty arsenal reject, 40hp adult hero
 * - Signature weapon: Shiver (ELE033)
 *
 * Pattern mirrors ELE032-lexi.test.ts (Young Lexi, 20hp) with adult stats.
 *
 * FLUENT API ONLY — no .exec(), listLegalCommands, or answerPaymentDecision.
 */

const opponentHero = dash;

// ---------------------------------------------------------------------------
// Lexi, Livewire (ELE031) — Elemental/Ranger — 40hp
// Ability: "Once per Turn Action - Turn a face down card in your arsenal
//   face up: If it's a Lightning card, your next attack this turn gains go
//   again. If it's an Ice card, create a Frostbite token under target hero's
//   control. Go again"
// ---------------------------------------------------------------------------

describe("lexi-livewire (ELE031) AAA", () => {
  it("boundaries: hero defaults to 40 life (adult hero health boundary)", () => {
    const game = FabTestEngine.start(
      { hero: lexiLivewire, deck: 6 },
      { hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(lexiLivewire)).toHaveLife(40);
  });

  it("core mechanic: flip face-down arsenal face-up and gain go again", () => {
    // Lexi's activated ability flips a face-down card face-up. The
    // layerKeywords include go-again, refunding the action point.
    const game = FabTestEngine.start(
      {
        hero: lexiLivewire,
        arsenal: [{ card: snatchRed, state: { faceDown: true } }],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
        hand: [],
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Lexi = game.as(lexiLivewire);

    expect(Lexi.actionPoints()).toBe(1);

    Lexi.activate(lexiLivewire);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    // Face-down card flipped face-up; go again refunds the AP.
    expect(Lexi.zone("arsenal")).toContain(snatchRed.canonicalId);
    expect(Lexi.actionPoints()).toBe(1); // −1 + go again = 1
  });

  it("core mechanic: flipping a Lightning card grants go again to next attack", () => {
    // electrify has types: ["Lightning", "Action"] — the engine normalizes
    // Lightning to a supertype match for Lexi's filter.
    const game = FabTestEngine.start(
      {
        hero: lexiLivewire,
        arsenal: [{ card: electrify, state: { faceDown: true } }],
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Lexi = game.as(lexiLivewire);

    Lexi.activate(lexiLivewire);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    // Attack with snatch — it should gain go again from Lexi's Lightning trigger.
    if (!Lexi.hasPriority()) {
      game.as(opponentHero).pass();
    }
    Lexi.attackWith(snatchRed);
    game.passBoth();

    // The chain link should show go-again from Lexi's granted property.
    expectCombat(game).toBeOpen().toHaveKeyword("go-again");
  });

  it("core mechanic: flipping an Ice card creates Frostbite under the opponent", () => {
    // blizzard-blue is a real Ice card — the printed Ice rider applies.
    const game = FabTestEngine.start(
      {
        hero: lexiLivewire,
        arsenal: [{ card: blizzardBlue, state: { faceDown: true } }],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
        hand: [],
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Lexi = game.as(lexiLivewire);
    const Opponent = game.as(opponentHero);

    Lexi.activate(lexiLivewire);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Opponent).toHaveTokenCount("frostbite", 1);
  });

  it("boundaries: once per turn — second activation is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: lexiLivewire,
        arsenal: [
          { card: electrify, state: { faceDown: true } },
          { card: blizzardBlue, state: { faceDown: true } },
        ],
        resourcePoints: 0,
        actionPoints: 2,
        deck: 6,
        hand: [],
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Lexi = game.as(lexiLivewire);

    Lexi.activate(lexiLivewire);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    Lexi.expectActivationRejected(lexiLivewire);
  });

  it("boundaries: no face-down arsenal → activation is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: lexiLivewire,
        arsenal: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
        hand: [],
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Lexi = game.as(lexiLivewire);

    Lexi.expectActivationRejected(lexiLivewire);
  });

  it("signature weapon: Shiver (ELE033) can be activated as an Instant for 1{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: lexiLivewire,
        weapon1: [shiver],
        resourcePoints: 1,
        actionPoints: 0,
        deck: 6,
        hand: [],
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Lexi = game.as(lexiLivewire);

    Lexi.activate(shiver);
    game.passBoth();

    // Shiver is an Instant — not an attack.
    expectCombat(game).toBeClosed();
  });
});
