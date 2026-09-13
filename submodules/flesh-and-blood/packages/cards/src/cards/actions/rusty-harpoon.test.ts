import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { deathDealer } from "../weapons/death-dealer.ts";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultRed } from "./brutal-assault.ts";
import { winterSGraspRed } from "./winter-s-grasp.ts";
import { rustyHarpoonBlue } from "./rusty-harpoon.ts";

/**
 * Rusty Harpoon (SEA092) — Pirate Ranger Action - Arrow Attack.
 *
 * Printed: (vanilla — no abilities)
 *   Pitch 3, cost 0, power 1, defense 3.
 *
 * AAA trio:
 * - Happy: fired from arsenal with a bow for 1 damage unblocked, lands in
 *   the graveyard.
 * - Boundary: an arrow cannot be attacked from hand (arrows play only
 *   from arsenal, CR 8.2.6a), but still defends for its printed 3.
 * - Timing: pitch funds exactly 3 resources (1 left after a cost-2
 *   attack), then the card cycles to the bottom of the deck at end of
 *   turn (CR 4.4.3c).
 */

describe("Rusty Harpoon (SEA092) AAA", () => {
  // ── Happy path ────────────────────────────────────────────────────────────

  it("happy: fires from arsenal with a bow for 1 damage unblocked", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [rustyHarpoonBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.attackWith(rustyHarpoonBlue, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(1);
    expect(game.combat()?.activeLink?.keywords).toEqual([]);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(19); // 20 - 1
    expectFabCard(Azalea, rustyHarpoonBlue).toBeIn("graveyard");
  });

  // ── Boundary ───────────────────────────────────────────────────────────────

  it("boundary: cannot be attacked from hand, but defends for its printed 3", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultRed], resourcePoints: 2, deck: 6 },
      { hero: azalea, hand: [rustyHarpoonBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Azalea = game.as(azalea);

    // Arrows play only from arsenal (CR 8.2.6a) — even with a bow equipped.
    expect(() => Azalea.attackWith(rustyHarpoonBlue)).toThrow();

    Dash.playAttack(brutalAssaultRed);
    Azalea.defendWith(rustyHarpoonBlue);
    game.closeCombat();

    expectFabPlayer(Azalea).toHaveLife(17); // 20 - (6 - 3)
    expectFabCard(Azalea, rustyHarpoonBlue).toBeIn("graveyard");
  });

  // ── Timing / zone movement ─────────────────────────────────────────────────

  it("timing: pitch funds exactly 3 resources, then cycles to deck bottom at end of turn", () => {
    const game = FabTestEngine.start(
      { hero: azalea, hand: [rustyHarpoonBlue, winterSGraspRed], resourcePoints: 0, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.must.pitch(rustyHarpoonBlue).playAttack(winterSGraspRed);
    expectFabCard(Azalea, rustyHarpoonBlue).toBeIn("pitch");
    expectFabPlayer(Azalea).toHaveResourceCount(1); // 3 pitched - 2 cost
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();
    Azalea.endTurn();

    // CR 4.4.3c — pitched cards go to the bottom of the deck, not the graveyard.
    expect(Azalea.zone("deck")).toContain(rustyHarpoonBlue.canonicalId);
  });
});
