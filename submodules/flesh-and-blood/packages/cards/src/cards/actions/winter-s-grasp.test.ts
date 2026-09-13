import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultRed } from "./brutal-assault.ts";
import { oldhimGrandfatherOfEternity } from "../heroes/oldhim-grandfather-of-eternity.ts";
import { heavenSClawsYellow } from "./heaven-s-claws.ts";
import { winterSGraspRed } from "./winter-s-grasp.ts";

/**
 * Winter's Grasp Red (ELE160) — Ice Action - Attack.
 *
 * Printed: (vanilla — no abilities)
 *   Pitch 1, cost 2, power 6, defense 3.
 *
 * AAA trio:
 * - Happy: attacks for 6 unblocked, no keywords, lands in the graveyard.
 * - Boundary: defends for its printed 3 from hand (6 - 3 = 3 damage).
 * - Timing: pitch funds exactly 1 resource, then the card cycles to the
 *   bottom of the deck at end of turn (CR 4.4.3c).
 */

describe("Winter's Grasp (ELE160) AAA", () => {
  // ── Happy path ────────────────────────────────────────────────────────────

  it("happy: vanilla attack deals 6 damage unblocked", () => {
    const game = FabTestEngine.start(
      { hero: oldhimGrandfatherOfEternity, hand: [winterSGraspRed], resourcePoints: 2, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhimGrandfatherOfEternity);
    const Dash = game.as(dash);

    Oldhim.playAttack(winterSGraspRed);
    expectCombat(game).toHaveAttackPower(6);
    expect(game.combat()?.activeLink?.keywords).toEqual([]);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(14); // 20 - 6
    expectFabCard(Oldhim, winterSGraspRed).toBeIn("graveyard");
  });

  // ── Boundary ───────────────────────────────────────────────────────────────

  it("boundary: blocks for its printed 3 defense from hand", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultRed], resourcePoints: 2, deck: 6 },
      { hero: oldhimGrandfatherOfEternity, hand: [winterSGraspRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Oldhim = game.as(oldhimGrandfatherOfEternity);

    Dash.playAttack(brutalAssaultRed);
    Oldhim.defendWith(winterSGraspRed);
    game.closeCombat();

    expectFabPlayer(Oldhim).toHaveLife(17); // 20 - (6 - 3)
    expectFabCard(Oldhim, winterSGraspRed).toBeIn("graveyard");
  });

  // ── Timing / zone movement ─────────────────────────────────────────────────

  it("timing: pitch funds exactly 1 resource, then cycles to deck bottom at end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhimGrandfatherOfEternity,
        hand: [winterSGraspRed, heavenSClawsYellow],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhimGrandfatherOfEternity);
    const Dash = game.as(dash);

    Oldhim.must.pitch(winterSGraspRed).playAttack(heavenSClawsYellow);
    expectFabCard(Oldhim, winterSGraspRed).toBeIn("pitch");
    expectFabPlayer(Oldhim).toHaveResourceCount(0); // 1 pitched - 1 cost
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();
    Oldhim.endTurn();

    // CR 4.4.3c — pitched cards go to the bottom of the deck, not the graveyard.
    expect(Oldhim.zone("deck")).toContain(winterSGraspRed.canonicalId);
  });
});
