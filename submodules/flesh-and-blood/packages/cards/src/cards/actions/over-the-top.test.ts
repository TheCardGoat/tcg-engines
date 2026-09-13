import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { betsy } from "../heroes/betsy.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { theSuspenseIsKillingMeBlue } from "../instants/the-suspense-is-killing-me.ts";
import { overTheTopRed } from "./over-the-top.ts";

/**
 * Over the Top, Red (BET010) — conditional overpower (W2-FIX2 removed the
 * unprinted module `overpower` keyword; CRU151-class fix).
 *
 * Printed: "If this has {p} greater than its base, it gets overpower." —
 * in this engine overpower = the defender may not use more than one action
 * card against the attack. Proven in both directions: with a pre-declared
 * +1{p} aura buff ({p} 7 > base 6) the two-action-card block is rejected
 * "overpower", and at base power two action-card defenders stay legal.
 * A reaction-step +{p} boost lands too late (defend precedes reaction), so
 * the buff vehicle must be in the arena before the attack is declared.
 */

describe("Over the Top family AAA", () => {
  it("playline: {p} 7 greater than base 6 — two action-card defenders rejected (overpower)", () => {
    const game = FabTestEngine.start(
      {
        hero: betsy,
        hand: [theSuspenseIsKillingMeBlue, overTheTopRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue, snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Betsy = game.as(betsy);
    const Dash = game.as(dash);

    // The Suspense Is Killing Me (continuous, while in arena) makes the
    // first attack this turn 7{p} — greater than Over the Top's base 6{p}.
    Betsy.play(theSuspenseIsKillingMeBlue);
    game.helpers.resolveUntilIdle();

    Betsy.attackWith(overTheTopRed);
    game.advanceCombatTo("defend");
    expect(game.combat()?.activeLink?.attackPower).toBe(7);

    // Printed conditional met: the defender may use at most one action card.
    const rejected = Dash.expectBlockRejected([nimblismBlue, snatchRed]);
    expect(rejected.errorCode).toBe("overpower");

    Dash.defendWith([nimblismBlue]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(15); // 7{p} - 2{d}
  });

  it("boundary: at base 6{p} two action-card defenders are legal (no overpower)", () => {
    const game = FabTestEngine.start(
      {
        hero: betsy,
        hand: [overTheTopRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue, snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Betsy = game.as(betsy);
    const Dash = game.as(dash);

    Betsy.attackWith(overTheTopRed);
    game.advanceCombatTo("defend");
    expect(game.combat()?.activeLink?.attackPower).toBe(6);

    // Printed text requires {p} greater than base for overpower: at base
    // power the defender may defend with two action cards.
    Dash.defendWith([nimblismBlue, snatchRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(18); // 6{p} - (2{d} + 2{d})
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: betsy,
        hand: [overTheTopRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Betsy = game.as(betsy);
    const Dash = game.as(dash);

    // Dash's turn: 4{p} Snatch into a 3{d} block leaves 1 damage.
    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Betsy.defendWith([overTheTopRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Betsy).toHaveLife(19);
    expect(Betsy.zone("graveyard")).toContain(overTheTopRed.canonicalId);
  });
});
