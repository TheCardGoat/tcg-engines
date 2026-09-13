/**
 * HNT009 Hunter's Klaive — Assassin Dagger 1H — power 1.
 *
 * Printed:
 *   a1: Once per Turn Action - {r}{r}: Attack
 *   a2: When this hits a hero, mark them.
 *
 * Status: 🟡→✅ — a1 proven @ weapon-opt-attack-wave2 (2 RP OPT attack);
 * this file proves a2: a real weapon hit marks the opposing hero via the
 * public mark path (CR 8.5.50 / 9.3). Boundary: a fully-blocked attack
 * (0 damage) does NOT mark.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { dash, rattleBonesRed } from "../../../fixtures.ts";

import { hunterSKlaive } from "../../../../../../cards/src/cards/weapons/hunter-s-klaive.ts";
import { uzuri } from "../../../../../../cards/src/cards/heroes/uzuri.ts";

const LIFE = 20;

describe("hunter-s-klaive (HNT009)", () => {
  it("a2: unblocked weapon hit marks the opposing hero (player.marked)", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        weapon1: [hunterSKlaive],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const U = game.as(uzuri);
    const Opp = game.as(dash);

    U.activate(hunterSKlaive);
    game.helpers.resolveRestOfCombat();

    // 1 power → 1 damage to the opponent.
    expect(Opp.life()).toBe(LIFE - 1);
    // The on-hit trigger fired and marked the defending hero (CR mark flag).
    expect(game.getState().players[Opp.id]?.marked).toBe(true);
  });

  it("a2 boundary: a fully-blocked attack (0 damage) does not mark", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        weapon1: [hunterSKlaive],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6, hand: [rattleBonesRed] },
    );
    const U = game.as(uzuri);
    const Opp = game.as(dash);

    U.activate(hunterSKlaive);
    expect(game.combat()?.step).toBe("defend");
    // Rattle Bones (d3) fully blocks the 1-power attack → 0 damage, no hit.
    Opp.defendWith(rattleBonesRed);
    game.helpers.resolveRestOfCombat();

    expect(Opp.life()).toBe(LIFE);
    expect(game.getState().players[Opp.id]?.marked).toBe(false);
  });
});
