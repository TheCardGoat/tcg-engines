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
import { nimblismBlue } from "./nimblism.ts";
import { feedingFrenzyRed } from "./feeding-frenzy.ts";

/**
 * Feeding Frenzy, Red — Shadow Brute Action - Attack, cost 2, 6{p}, 3{d}.
 *
 * Printed: "When this attacks, banish the top card of your deck. If you've
 * banished a card with 6 or more {p} this turn, this gets go again. Blood Debt"
 */

describe("Feeding Frenzy AAA", () => {
  it("happy: after banishing a 6{p} card this turn the attack has go again", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        head: [ebonFold],
        hand: [skullCrackRed, feedingFrenzyRed],
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

    Levia.playAttack(feedingFrenzyRed);
    expectCombat(game).toBeAtStep("defend").toHaveKeyword("go-again").toHaveAttackPower(6);
    expectFabCard(Levia, nimblismBlue).toBeBanished();
    game.closeCombat();
    expectFabPlayer(Levia).toHaveAP(1);
    expectFabPlayer(Dash).toHaveLife(14);
  });

  it("happy: this attack's own 6+{p} top-deck banish grants go again", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [feedingFrenzyRed],
        resourcePoints: 2,
        actionPoints: 1,
        deckTop: [skullCrackRed],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.playAttack(feedingFrenzyRed);
    expectFabCard(Levia, skullCrackRed).toBeBanished();
    expectCombat(game).toBeAtStep("defend").toHaveKeyword("go-again").toHaveAttackPower(6);
    game.closeCombat();
    expectFabPlayer(Levia).toHaveAP(1);
    expectFabPlayer(Dash).toHaveLife(14);
  });

  it("boundary: with no 6+{p} banish this turn the attack does not have go again", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [feedingFrenzyRed],
        resourcePoints: 2,
        actionPoints: 1,
        deckTop: [nimblismBlue],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.playAttack(feedingFrenzyRed);
    expectFabCard(Levia, nimblismBlue).toBeBanished();
    expectCombat(game).toBeAtStep("defend").notToHaveKeyword("go-again");
    game.closeCombat();
    expectFabPlayer(Levia).toHaveAP(0);
    expectFabPlayer(Dash).toHaveLife(14);
  });
});
