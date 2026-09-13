import { describe, it } from "vitest";
import {
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { enigma } from "./enigma.ts";
import { cosmoScrollOfAncestralTapestry } from "../weapons/cosmo-scroll-of-ancestral-tapestry.ts";

/**
 * Hero behavior acceptance test — Enigma (ENG001).
 *
 * Implements the per-hero AAA requirements:
 * - Core mechanic: first Spectral Shield attack each turn costs {r} less
 * - Core mechanic: Once per Turn Instant — {c}{c}{c}: create Spectral Shield
 *   with a +1{p} counter
 * - Boundaries: first-attack-only cost reduction, once per turn
 *
 * Signature weapon: Cosmo Scroll of Ancestral Tapestry (ENG002)
 * Mystic/Illusionist/Young — 20hp
 */

const hero = enigma;
const opponentHero = dash;

// ---------------------------------------------------------------------------
// enigma (ENG001) — Mystic Illusionist/Young — 20hp
// Printed: "Your first Spectral Shield attack each turn costs {r} less to
// activate."
// "Once per Turn Instant - {c}{c}{c}: Create a Spectral Shield token with
// a +1{p} counter."
// Signature weapon: Cosmo Scroll (ENG002) — 2H Illusionist Scroll
// ---------------------------------------------------------------------------

describe("enigma (ENG001)", () => {
  it("core mechanic: Instant — pay {c}{c}{c} → create Spectral Shield with +1{p} counter", () => {
    const game = FabTestEngine.start(
      {
        hero,
        chiPoints: 3,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Enigma = game.as(hero);

    // Activate Enigma's chi ability to create a Spectral Shield with +1{p}.
    Enigma.activate(hero);
    game.passBoth();

    expectFabPlayer(Enigma).toHaveTokenCount("spectral-shield", 1);
    expectFabPlayer(Enigma).toHaveAP(1); // instant doesn't consume AP
  });

  it("boundaries: the chi ability respects the once-per-turn limit", () => {
    const game = FabTestEngine.start(
      {
        hero,
        chiPoints: 6,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Enigma = game.as(hero);

    // First activation.
    Enigma.activate(hero);
    game.passBoth();

    // Second activation should be rejected.
    Enigma.expectActivationRejected(hero);
  });

  it("core mechanic: first Spectral Shield attack each turn costs {r} less", () => {
    // Cosmo Scroll grants the ward Spectral Shield token a {r} attack; the
    // hero's continuous discounts that first attack to 0 — payable at 0 RP.
    const game = FabTestEngine.start(
      {
        hero,
        weapon1: [cosmoScrollOfAncestralTapestry],
        chiPoints: 3,
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Enigma = game.as(hero);

    Enigma.activate(hero);
    game.passBoth();
    expectFabPlayer(Enigma).toHaveTokenCount("spectral-shield", 1);

    Enigma.activate(fabToken("spectral-shield"));
    game.passBoth();

    expectCombat(game).toBeOpen();
    expectCombat(game).toHaveAttackPower(2);
    expectFabPlayer(Enigma).toHaveResourceCount(0);
  });
});
