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
import { wreckerRompRed } from "./wrecker-romp.ts";
import { nimblismBlue } from "./nimblism.ts";
import { feastingShadowbeastRed } from "./feasting-shadowbeast.ts";

/**
 * Feasting Shadowbeast, Red — Shadow Brute Action - Attack, cost 2, 6{p}, 3{d}.
 *
 * Printed: "When this attacks, banish the top card of your deck. If you've
 * banished a card with 6 or more {p} this turn, this gets +2{p}. Blood Debt"
 */

describe("Feasting Shadowbeast AAA", () => {
  it("happy: after banishing a 6{p} card this turn the attack is 8{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        head: [ebonFold],
        hand: [skullCrackRed, feastingShadowbeastRed],
        resourcePoints: 3,
        actionPoints: 1,
        deckTop: [nimblismBlue],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.activate(ebonFold);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: skullCrackRed.canonicalId });
    expectFabCard(Levia, skullCrackRed).toBeBanished();

    Levia.playAttack(feastingShadowbeastRed);
    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(8);
    expectFabCard(Levia, nimblismBlue).toBeBanished();
    game.closeCombat();
    expectFabPlayer(Dash).toHaveLife(12);
  });

  it("happy: the on-attack banish of a 6+{p} card itself grants +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [feastingShadowbeastRed],
        resourcePoints: 2,
        actionPoints: 1,
        deckTop: [wreckerRompRed],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.playAttack(feastingShadowbeastRed);
    expectFabCard(Levia, wreckerRompRed).toBeBanished();
    // Continuous while-condition: the on-attack banish of 8{p} Wrecker Romp
    // should satisfy "banished a card with 6 or more {p} this turn" before
    // damage. If this stays at 6, attack power was locked at declaration
    // (CR timing) and the prior-banish case above is the printed this-turn
    // clause.
    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(8);
    game.closeCombat();
    expectFabPlayer(Dash).toHaveLife(12);
  });

  it("boundary: with no 6+{p} banish this turn the attack stays at its printed 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [feastingShadowbeastRed],
        resourcePoints: 2,
        actionPoints: 1,
        deckTop: [nimblismBlue],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.playAttack(feastingShadowbeastRed);
    expectFabCard(Levia, nimblismBlue).toBeBanished();
    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(6);
    game.closeCombat();
    expectFabPlayer(Dash).toHaveLife(14);
  });
});
