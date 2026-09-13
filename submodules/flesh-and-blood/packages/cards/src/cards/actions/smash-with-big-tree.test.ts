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
import { heavenSClawsYellow } from "./heaven-s-claws.ts";
import { levia } from "../heroes/levia.ts";
import { smashWithBigTreeRed } from "./smash-with-big-tree.ts";

/**
 * Smash with Big Tree (LEV026) — Brute Action - Attack.
 *
 * Printed: (vanilla — no abilities)
 *   Pitch 1, cost 2, power 7. No printed defense.
 *
 * AAA trio:
 * - Happy: attacks for 7 unblocked, no keywords, lands in the graveyard.
 * - Boundary: no printed defense — cannot be declared as a defender, so
 *   the full attack goes through.
 * - Timing: pitch funds exactly 1 resource, then the card cycles to the
 *   bottom of the deck at end of turn (CR 4.4.3c).
 */

describe("Smash with Big Tree (LEV026) AAA", () => {
  // ── Happy path ────────────────────────────────────────────────────────────

  it("happy: vanilla attack deals 7 damage unblocked", () => {
    const game = FabTestEngine.start(
      { hero: levia, hand: [smashWithBigTreeRed], resourcePoints: 2, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.playAttack(smashWithBigTreeRed);
    expectCombat(game).toHaveAttackPower(7);
    expect(game.combat()?.activeLink?.keywords).toEqual([]);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(13); // 20 - 7
    expectFabCard(Levia, smashWithBigTreeRed).toBeIn("graveyard");
  });

  // ── Boundary ───────────────────────────────────────────────────────────────

  it("boundary: no printed defense — cannot be declared as a defender, full damage goes through", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultRed], resourcePoints: 2, deck: 6 },
      { hero: levia, hand: [smashWithBigTreeRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Levia = game.as(levia);

    Dash.playAttack(brutalAssaultRed);
    expect(() => Levia.defendWith(smashWithBigTreeRed)).toThrow(/no defense/);
    expectFabCard(Levia, smashWithBigTreeRed).toBeIn("hand");
    Levia.defendWith(); // decline — the attack resolves unblocked
    game.closeCombat();

    expectFabPlayer(Levia).toHaveLife(14); // 20 - 6, nothing blocked
    expectFabCard(Levia, smashWithBigTreeRed).toBeIn("hand");
  });

  // ── Timing / zone movement ─────────────────────────────────────────────────

  it("timing: pitch funds exactly 1 resource, then cycles to deck bottom at end of turn", () => {
    const game = FabTestEngine.start(
      { hero: levia, hand: [smashWithBigTreeRed, heavenSClawsYellow], resourcePoints: 0, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.must.pitch(smashWithBigTreeRed).playAttack(heavenSClawsYellow);
    expectFabCard(Levia, smashWithBigTreeRed).toBeIn("pitch");
    expectFabPlayer(Levia).toHaveResourceCount(0); // 1 pitched - 1 cost
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();
    Levia.endTurn();

    // CR 4.4.3c — pitched cards go to the bottom of the deck, not the graveyard.
    expect(Levia.zone("deck")).toContain(smashWithBigTreeRed.canonicalId);
  });
});
