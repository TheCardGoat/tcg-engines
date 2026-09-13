import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabToken } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { viserai } from "./viserai.ts";
import { nebulaBlade } from "../weapons/nebula-blade.ts";
import { oathOfTheArknightYellow } from "../actions/oath-of-the-arknight.ts";
import { readTheRunesYellow } from "../actions/read-the-runes.ts";
import { tomeOfFyendalYellow } from "../actions/tome-of-fyendal.ts";

/**
 * Hero behavior acceptance test — Viserai (ARC076).
 *
 * Implements the per-hero AAA requirements from HEROES.md:
 * - Core mechanic: Runechant after playing a Runeblade card following
 *   a non-attack action this turn
 * - Core interaction: Nebula Blade gets +3{p} after non-attack, hit
 *   creates Runechant
 * - Boundaries: no prior non-attack → card's own Runechant only,
 *   weapon attack does not fire hero trigger
 *
 * Signature weapon: Nebula Blade (ARC077)
 */

const opponentHero = dash;

// ---------------------------------------------------------------------------
// viserai (ARC076) — Runeblade/Young — 20hp
// Printed: "Whenever you play a Runeblade card, if you have played another
// 'non-attack' action card this turn, create a Runechant token."
// ---------------------------------------------------------------------------

describe("viserai (ARC076)", () => {
  it("core mechanic: playing a Runeblade card after a prior non-attack action creates a Runechant token", () => {
    // Arrange — Viserai with a non-attack action and a Runeblade card in hand.
    // Tome of Fyendal (Generic Action, cost 1) is played first to satisfy the
    // "another non-attack action" condition. Oath of the Arknight (Runeblade
    // Action, cost 2) triggers Viserai's triggered static ability.
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [tomeOfFyendalYellow, oathOfTheArknightYellow],
        deck: 6,
        resourcePoints: 5,
        actionPoints: 2,
      },
      { hero: opponentHero, deck: 6 },
    );
    const Viserai = game.as(viserai);

    // Act — play Tome of Fyendal first (sets played-non-attack-action status).
    Viserai.must.play(tomeOfFyendalYellow);

    // Then play Oath of the Arknight (Runeblade card) → triggers Viserai.
    Viserai.must.play(oathOfTheArknightYellow);

    // Assert — Oath's own Runechant plus the hero trigger: 2 total.
    expectFabToken(game, "runechant").toHaveCount(2).toBeIn("arena");
  });

  it("boundaries: no hero-triggered Runechant when no prior non-attack action was played", () => {
    // Oath of the Arknight still creates its own Runechant (ARC092-a2) → exactly 1.
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [oathOfTheArknightYellow],
        deck: 6,
        resourcePoints: 3,
        actionPoints: 2,
      },
      { hero: opponentHero, deck: 6 },
    );
    const Viserai = game.as(viserai);

    Viserai.must.play(oathOfTheArknightYellow);

    expectFabToken(game, "runechant").toHaveCount(1);
  });

  it("core interaction: Read the Runes creates 2 Runechants plus hero trigger = 3 total after non-attack first", () => {
    // Tome (non-attack) → Read the Runes (Runeblade) = card creates 2 + hero
    // triggered static creates 1 more = 3 Runechants total.
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [tomeOfFyendalYellow, readTheRunesYellow],
        deck: 6,
        resourcePoints: 3,
        actionPoints: 2,
      },
      { hero: opponentHero, deck: 6 },
    );
    const Viserai = game.as(viserai);

    Viserai.must.play(tomeOfFyendalYellow);
    Viserai.must.play(readTheRunesYellow);

    expectFabToken(game, "runechant").toHaveCount(3);
  });

  it("signature weapon: Nebula Blade gets +3{p} after playing a non-attack action", () => {
    // Nebula Blade a3: if you've played a non-attack action this turn, +3{p}.
    const game = FabTestEngine.start(
      {
        hero: viserai,
        weapon1: [nebulaBlade],
        hand: [tomeOfFyendalYellow],
        resourcePoints: 4, // 1 for Tome + 2 for Nebula attack
        actionPoints: 2,
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false },
    );
    const Viserai = game.as(viserai);

    // Play non-attack first to enable the +3{p} condition.
    Viserai.must.play(tomeOfFyendalYellow);
    game.passBoth();

    // Activate Nebula Blade attack.
    const lifeBefore = game.as(opponentHero).life();
    Viserai.activate(nebulaBlade);
    game.helpers.resolveRestOfCombat();

    // Assert — base power 1 + 3 from a3 = 4.
    expect(game.as(opponentHero).life()).toBe(lifeBefore - 4);
  });

  it("signature weapon: Nebula Blade hit creates a Runechant token", () => {
    // Nebula Blade a2: triggered on hit → create Runechant.
    const game = FabTestEngine.start(
      {
        hero: viserai,
        weapon1: [nebulaBlade],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
    );
    const Viserai = game.as(viserai);

    Viserai.activate(nebulaBlade);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabToken(game, "runechant").toHaveCount(1);
  });
});
