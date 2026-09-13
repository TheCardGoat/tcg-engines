import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { bolfarBearHands } from "./bolfar-bear-hands.ts";

import { dawnblade } from "../weapons/dawnblade.ts";

/**
 * Hero behavior acceptance test — Bolfar, Bear Hands (SMP001).
 *
 * Implements the per-hero AAA requirements:
 * - Core mechanic: can't equip weapons (continuous restriction)
 * - Core mechanic: Action — {r}{r}{r}, {t}: next crush attack may target
 *   an additional hero. Go again.
 * - Boundaries: weapon equip rejection, only crush attacks benefit
 *
 * Guardian/Pit-Fighter — 20hp
 */

const hero = bolfarBearHands;
const opponentHero = dash;

// ---------------------------------------------------------------------------
// bolfar-bear-hands (SMP001) — Guardian/Pit-Fighter — 20hp
// Printed: "You can't equip weapons."
// "Action - {r}{r}{r}, {t}: The next attack action card with crush you
// play this turn may attack an additional hero. Go again"
// ---------------------------------------------------------------------------

describe("bolfar-bear-hands (SMP001)", () => {
  it("boundaries: hero defaults to 20 life", () => {
    const game = FabTestEngine.start({ hero, deck: 6 }, { hero: opponentHero, deck: 6 });
    expectFabPlayer(game.as(hero)).toHaveLife(20);
  });

  it("core mechanic: weapon equip is rejected (can't equip weapons)", () => {
    const game = FabTestEngine.start(
      {
        hero,
        hand: [dawnblade],
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bolfar = game.as(hero);

    // Attempting to equip a weapon should fail.
    Bolfar.expectActivationRejected(dawnblade);
  });

  it("boundaries: the ability's go again refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero,
        resourcePoints: 3,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bolfar = game.as(hero);

    // Activate Bolfar's ability.
    Bolfar.activate(hero);
    game.passBoth();

    // Go again should refund the action point.
    expect(Bolfar.actionPoints()).toBe(1);
  });
});
