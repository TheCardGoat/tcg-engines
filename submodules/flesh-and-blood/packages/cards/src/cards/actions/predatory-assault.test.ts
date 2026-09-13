import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { rhinar } from "../heroes/rhinar.ts";
import { dash } from "../heroes/dash.ts";
import { bareDestructionRed } from "./bare-destruction.ts";
import { heraldOfTriumphRed } from "./herald-of-triumph.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { predatoryAssaultRed } from "./predatory-assault.ts";

/**
 * Predatory Assault, Red (CRU013) — module fixed (FIX-5, plan §5): the
 * unprinted `keywords: [dominate]` was removed, so dominate exists only via
 * the printed a1 conditional.
 *
 * Printed: "If you have discarded a card with 6 or more {p} this turn,
 * Predatory Assault gains dominate." — cost 2, 6{p}, defense 3.
 *
 * Both directions proven: WITH a 6+{p} discard this turn (beat chest on
 * Bare Destruction discarding Herald of Triumph, 7{p}) the assault carries
 * dominate and caps the defense at one card; with NO qualifying discard the
 * link carries no dominate and the two-card defense is legal (CR 7.5.1).
 */

describe("Predatory Assault (CRU013) AAA", () => {
  it("playline: after discarding a 7{p} card this turn, the assault carries dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [bareDestructionRed, heraldOfTriumphRed, predatoryAssaultRed],
        resourcePoints: 4,
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    // Beat chest on Bare Destruction, discarding Herald of Triumph (7{p}).
    const heraldId = Rhinar.findCardInZone("hand", heraldOfTriumphRed);
    Rhinar.play(bareDestructionRed, {
      beatChest: true,
      beatChestInstanceId: heraldId,
      target: Dash.id,
    });
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveLife(14); // Bare Destruction 6{p}

    Rhinar.playAttack(predatoryAssaultRed);
    // 6{p} printed + 2{p} from Bare Destruction's beaten-chest rider for
    // the next Brute attack action.
    expectCombat(game).toBeAtStep("defend").toHaveKeyword("dominate");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(6); // 14 − (6 + 2){p}
  });

  it("boundary: with no 6+{p} discard this turn, the link carries no dominate and the two-card defense is legal", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [predatoryAssaultRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    // No card has been discarded this turn: the printed a1 conditional does
    // not fire, so the link carries no dominate (CR 7.5.1) and the defending
    // hero may defend with more than one card from hand.
    Rhinar.playAttack(predatoryAssaultRed);
    expectCombat(game).toBeAtStep("defend").notToHaveKeyword("dominate");

    // The two-card defense (Snatch 2{d} + Nimblism 2{d}) is LEGAL: 6{p} − 4{d}
    // deals 2 damage.
    Dash.defendWith([snatchRed, nimblismBlue]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(18);
    expect(Rhinar.zone("graveyard")).toContain(predatoryAssaultRed.canonicalId);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [predatoryAssaultRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    // Dash's turn: 4{p} Snatch into a 3{d} block leaves 1 damage.
    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Rhinar.defendWith([predatoryAssaultRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Rhinar).toHaveLife(19);
    expect(Rhinar.zone("graveyard")).toContain(predatoryAssaultRed.canonicalId);
  });
});
