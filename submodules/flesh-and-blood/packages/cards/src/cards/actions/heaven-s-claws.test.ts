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
import { briar } from "../heroes/briar.ts";
import { heavenSClawsRed } from "./heaven-s-claws.ts";
import { heavenSClawsYellow } from "./heaven-s-claws.ts";

/**
 * Heaven's Claws Red (ELE192) — Lightning Action - Attack.
 *
 * Printed: (vanilla — no abilities)
 *   Pitch 1, cost 1, power 5, defense 3.
 *
 * AAA trio:
 * - Happy: attacks for 5 unblocked, no keywords, lands in the graveyard.
 * - Boundary: defends for its printed 3 from hand (6 - 3 = 3 damage).
 * - Timing: pitch funds exactly 1 resource, then the card cycles to the
 *   bottom of the deck at end of turn (CR 4.4.3c).
 */

describe("Heaven's Claws (ELE192) AAA", () => {
  // ── Happy path ────────────────────────────────────────────────────────────

  it("happy: vanilla attack deals 5 damage unblocked", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [heavenSClawsRed], resourcePoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.playAttack(heavenSClawsRed);
    expectCombat(game).toHaveAttackPower(5);
    expect(game.combat()?.activeLink?.keywords).toEqual([]);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(15); // 20 - 5
    expectFabCard(Briar, heavenSClawsRed).toBeIn("graveyard");
  });

  // ── Boundary ───────────────────────────────────────────────────────────────

  it("boundary: blocks for its printed 3 defense from hand", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultRed], resourcePoints: 2, deck: 6 },
      { hero: briar, hand: [heavenSClawsRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Briar = game.as(briar);

    Dash.playAttack(brutalAssaultRed);
    Briar.defendWith(heavenSClawsRed);
    game.closeCombat();

    expectFabPlayer(Briar).toHaveLife(17); // 20 - (6 - 3)
    expectFabCard(Briar, heavenSClawsRed).toBeIn("graveyard");
  });

  // ── Timing / zone movement ─────────────────────────────────────────────────

  it("timing: pitch funds exactly 1 resource, then cycles to deck bottom at end of turn", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [heavenSClawsRed, heavenSClawsYellow], resourcePoints: 0, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.must.pitch(heavenSClawsRed).playAttack(heavenSClawsYellow);
    expectFabCard(Briar, heavenSClawsRed).toBeIn("pitch");
    expectFabPlayer(Briar).toHaveResourceCount(0); // 1 pitched - 1 cost
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();
    Briar.endTurn();

    // CR 4.4.3c — pitched cards go to the bottom of the deck, not the graveyard.
    expect(Briar.zone("deck")).toContain(heavenSClawsRed.canonicalId);
  });
});
