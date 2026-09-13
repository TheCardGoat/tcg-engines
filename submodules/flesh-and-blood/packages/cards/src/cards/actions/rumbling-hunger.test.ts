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
import { brutalAssaultBlue, brutalAssaultYellow } from "./brutal-assault.ts";
import { rumblingHungerRed } from "./rumbling-hunger.ts";

/**
 * Rumbling Hunger, Red — Shadow Brute Action - Attack, cost 2, 6{p}, 3{d}.
 *
 * Printed: "When this hits, if you've banished a card with 6 or more {p} this
 * turn, create a Blasmophet, the Insatiable Hunger token and this gets go
 * again. Blood Debt"
 */

describe("Rumbling Hunger AAA", () => {
  it("happy: a hit after a 6{p} banish creates Blasmophet and refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        head: [ebonFold],
        hand: [skullCrackRed, rumblingHungerRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.activate(ebonFold);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: skullCrackRed.canonicalId });
    expectFabCard(Levia, skullCrackRed).toBeBanished();

    Levia.playAttack(rumblingHungerRed);
    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(6);
    Dash.defendWith();
    game.closeCombat();

    expectFabPlayer(Levia).toHaveTokenCount("blasmophet-the-insatiable-hunger", 1).toHaveAP(1);
    expectFabPlayer(Dash).toHaveLife(14);
  });

  it("boundary: a hit with no 6+{p} banish this turn creates no token and no go again", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [rumblingHungerRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.playAttack(rumblingHungerRed);
    Dash.defendWith();
    game.closeCombat();

    expectFabPlayer(Levia).toHaveTokenCount("blasmophet-the-insatiable-hunger", 0).toHaveAP(0);
    expectFabPlayer(Dash).toHaveLife(14);
  });

  it("boundary: a miss after a 6{p} banish creates no token", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        head: [ebonFold],
        hand: [skullCrackRed, rumblingHungerRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [brutalAssaultBlue, brutalAssaultYellow],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.activate(ebonFold);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: skullCrackRed.canonicalId });

    Levia.playAttack(rumblingHungerRed);
    Dash.defendWith(brutalAssaultBlue, brutalAssaultYellow);
    game.closeCombat();

    expectFabPlayer(Levia).toHaveTokenCount("blasmophet-the-insatiable-hunger", 0);
    expectFabPlayer(Dash).toHaveLife(20);
  });
});
