import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { levia } from "../heroes/levia.ts";
import { dash } from "../heroes/dash.ts";
import { consumingLashYellow } from "./consuming-lash.ts";
import { headJabRed } from "./head-jab.ts";
import { blasmophetTheInsatiableHunger } from "../tokens/blasmophet-the-insatiable-hunger.ts";

/**
 * Consuming Lash (IAR009) — Shadow Brute Action - Attack, cost 2, 6{p},
 * Blood Debt.
 *
 * Printed: "Play this only if you control a Blasmophet.\nInstant - {r}, banish
 * this from your hand: Your next attack this turn gets go again."
 */

describe("Consuming Lash (IAR009) AAA", () => {
  it("happy: controlling a Blasmophet ally lets you play the attack", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        arena: [blasmophetTheInsatiableHunger],
        hand: [consumingLashYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.playAttack(consumingLashYellow, { optionals: "decline" });
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabCard(Levia, consumingLashYellow).toBeIn("graveyard");
  });

  it("happy: paying {r} banishes it from hand and the next attack gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [consumingLashYellow, headJabRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(consumingLashYellow);
    game.untilIdle();
    expectFabCard(Bravo, consumingLashYellow).toBeBanished();

    Bravo.playAttack(headJabRed, { optionals: "decline" });

    expectCombat(game).toHaveAttackPower(3).toHaveKeyword("go-again");
    Dash.defendWith();
    game.closeCombat();

    expectFabPlayer(Bravo).toHaveAP(1);
    expectFabPlayer(Dash).toHaveLife(17);
  });

  it("boundary: without a Blasmophet the card cannot be played", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [consumingLashYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    expectFabUnplayable(
      () => Bravo.playAttack(consumingLashYellow),
      /rules effect restricts this object from being played/i,
    );
    expectFabCard(Bravo, consumingLashYellow).toBeIn("hand");
  });
});
