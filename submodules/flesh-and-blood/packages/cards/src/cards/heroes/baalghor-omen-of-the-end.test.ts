import { describe, expect, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { baalghorOmenOfTheEnd } from "./baalghor-omen-of-the-end.ts";
import { boundingDemigonRed } from "../actions/bounding-demigon.ts";
import { wallopRed } from "../actions/wallop.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";

/**
 * Hero behavior acceptance test — Baalghor, Omen of the End (IAR159).
 *
 * Implements the per-hero AAA requirements:
 * - Core mechanic: pitched cards are banished instead
 * - Core mechanic: attack actions played from banished zone get +3{p}
 * - Boundaries: 33hp health
 *
 * No signature weapon (IAR set).
 *
 * FLUENT API ONLY — no .exec(), listLegalCommands, or answerPaymentDecision.
 */

const opponentHero = dash;

// ---------------------------------------------------------------------------
// baalghor-omen-of-the-end (IAR159) — Shadow/Hero/Young/Demon — 33hp
// Printed:
//   "Whenever you pitch a card, banish it."
//   "Attack action cards played from your banished zone get +3{p}."
// ---------------------------------------------------------------------------

describe("baalghor-omen-of-the-end (IAR159)", () => {
  it("boundaries: hero defaults to 33 life (Young health boundary)", () => {
    const game = FabTestEngine.start(
      { hero: baalghorOmenOfTheEnd, deck: 6 },
      { hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(baalghorOmenOfTheEnd)).toHaveLife(33);
  });

  it("core mechanic: pitched cards go to banished zone instead of pitch zone", () => {
    // IAR159-a1: whenever you pitch a card, banish it.
    // Play wallop-red (cost 4) with 3 RP + 1 pitch from snatch-red.
    // Auto-pitch selects snatch-red; the pitch→banish trigger fires.
    const game = FabTestEngine.start(
      {
        hero: baalghorOmenOfTheEnd,
        hand: [wallopRed, snatchRed],
        deck: 6,
        resourcePoints: 3,
        actionPoints: 1,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Baalghor = game.as(baalghorOmenOfTheEnd);

    // wallop-red costs 4; 3 RP + 1 pitch from snatch-red = 4.
    // The pitched snatch-red is banished instead of going to pitch zone.
    Baalghor.play(wallopRed);
    game.passBoth();

    // The pitched card should be in the banished zone, not pitch zone.
    expect(Baalghor.zone("banished")).toContain(snatchRed.canonicalId);
  });

  it("gives +3 power to an attack legally played from banished", () => {
    // Bounding Demigon supplies its own conditional banished-zone permission;
    // Baalghor modifies the legal play but does not create that permission.
    const game = FabTestEngine.start(
      {
        hero: baalghorOmenOfTheEnd,
        hand: [nimblismBlue],
        banished: [boundingDemigonRed],
        deck: 6,
        resourcePoints: 0,
        actionPoints: 1,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false },
    );
    const Baalghor = game.as(baalghorOmenOfTheEnd);

    Baalghor.play(nimblismBlue);
    game.passBoth();

    Baalghor.play(boundingDemigonRed, { from: "banished" });
    game.passBoth();

    // Base 3 + Bounding Demigon permission rider 1 + Baalghor 3.
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundaries: a card played from hand does NOT get the +3 banished bonus", () => {
    // wallop-red played directly from hand (with resources) should have base power.
    const game = FabTestEngine.start(
      {
        hero: baalghorOmenOfTheEnd,
        hand: [wallopRed],
        deck: 6,
        resourcePoints: 4,
        actionPoints: 1,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false },
    );
    const Baalghor = game.as(baalghorOmenOfTheEnd);

    Baalghor.attackWith(wallopRed);
    game.passBoth();

    expectCombat(game).toBeAtStep("reaction");
    // Base power 7, no +3 because played from hand, not banished.
    expectCombat(game).toHaveAttackPower(7);
  });

  it("core mechanic: pitched non-attack cards also go to banished", () => {
    // Any card pitched (not just attacks) goes to banished.
    // Pitch snatch-red (a non-Baalghor card) while paying for wallop-red.
    // 3 RP + snatch-red pitch 1 = 4 covers wallop-red cost 4.
    const game = FabTestEngine.start(
      {
        hero: baalghorOmenOfTheEnd,
        hand: [snatchRed, wallopRed],
        deck: 6,
        resourcePoints: 3,
        actionPoints: 1,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Baalghor = game.as(baalghorOmenOfTheEnd);

    // Play wallop-red (cost 4) with 3 RP → must pitch snatch-red for the remaining 1.
    // Pitched cards are banished, not sent to pitch zone.
    Baalghor.play(wallopRed);
    game.passBoth();

    // The pitched card is banished, not in pitch zone.
    expect(Baalghor.zone("banished")).toContain(snatchRed.canonicalId);
    // Pitch zone should be empty (card went to banished instead).
    expect(Baalghor.zone("pitch").length).toBe(0);
  });
});
