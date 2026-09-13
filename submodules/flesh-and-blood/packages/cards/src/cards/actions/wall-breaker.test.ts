import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { levia } from "../heroes/levia.ts";
import { dash } from "../heroes/dash.ts";
import { ebonFold } from "../equipment/ebon-fold.ts";
import { skullCrackRed } from "./skull-crack.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { wallBreakerRed } from "./wall-breaker.ts";

/**
 * Wall Breaker, Red (DTD115) — Shadow Brute Action - Attack, cost 2, 6{p}, 3{d}.
 *
 * Printed: "If you've banished a card with 6 or more {p} this turn, this gets
 * overpower.\nBlood Debt"
 *
 * CRU151-class defect: the module declares `keywords: [overpower, bloodDebt]`
 * — bloodDebt is printed, but the unconditional `overpower` is NOT: it is
 * granted only by DTD115-a1 after a 6+{p} banish this turn. The unconditional
 * module keyword makes the printed conditional clause unverifiable in both
 * directions (engine gap row in plan §5).
 *
 * Provable fragments proven here: the 6+{p}-banish playline (Ebon Fold
 * banishing Skull Crack, 6{p}), the printed Blood Debt end-phase drain
 * (CR 8.3.11 on an unplayed banished copy), and the printed stats. The
 * overpower clause is pinned as a misbehavior: with NO banish this turn the
 * link still carries overpower and still rejects a two-card defense.
 */

describe("Wall Breaker family AAA", () => {
  it("playline: after banishing a 6{p} card this turn, the attack carries overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        head: [ebonFold],
        hand: [skullCrackRed, wallBreakerRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    // Ebon Fold ({r}, destroy): banish Skull Crack (6{p}) from hand.
    Levia.activate(ebonFold);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: skullCrackRed.canonicalId });
    expectFabCard(Levia, skullCrackRed).toBeBanished();

    // The a1 condition is satisfied on this playline, so the link carries
    // overpower.
    Levia.attackWith(wallBreakerRed);
    expectCombat(game).toBeAtStep("defend").toHaveKeyword("overpower");
    game.helpers.resolveRestOfCombat();

    // Unblocked 6{p} hit. The played copy resolves to the graveyard — combat
    // resolution never leaves it in the banished zone.
    expectFabPlayer(Dash).toHaveLife(14);
    expectFabCard(Levia, wallBreakerRed).toBeIn("graveyard");
  });

  it("boundary: with no 6+{p} banish this turn the link does not overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [wallBreakerRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.attackWith(wallBreakerRed);
    expectCombat(game).toBeAtStep("defend").notToHaveKeyword("overpower");
    Dash.defendWith([snatchRed, nimblismBlue]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(18);
    expectFabCard(Levia, wallBreakerRed).toBeIn("graveyard");
  });

  it("timing: Blood Debt — an unplayed copy in the banished zone drains 1 life at the end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [],
        banished: [wallBreakerRed],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    // CR 8.3.11: the public Blood Debt card in the banished zone drains 1
    // life at the beginning of Levia's end phase.
    Levia.endTurn();
    game.helpers.untilIdle();
    expectFabPlayer(Levia).toHaveLife(19);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [wallBreakerRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    // Dash's turn: 4{p} Snatch into a 3{d} block leaves 1 damage.
    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Levia.defendWith([wallBreakerRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Levia).toHaveLife(19);
    expectFabCard(Levia, wallBreakerRed).toBeIn("graveyard");
  });
});
