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
import { apexBusterYellow } from "./apex-buster.ts";
import { consumingStrengthYellow } from "./consuming-strength.ts";
import { blasmophetTheInsatiableHunger } from "../tokens/blasmophet-the-insatiable-hunger.ts";

/**
 * Consuming Strength (IAR010) — Shadow Brute Action - Attack, cost 2, 6{p},
 * Blood Debt.
 *
 * Printed: "Play this only if you control a Blasmophet.\nInstant - {r}, banish
 * this from your hand: Your next attack this turn gets +2{p}."
 */

describe("Consuming Strength (IAR010) AAA", () => {
  it("happy: controlling a Blasmophet ally lets you play the attack", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        arena: [blasmophetTheInsatiableHunger],
        hand: [consumingStrengthYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.playAttack(consumingStrengthYellow, { optionals: "decline" });
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabCard(Levia, consumingStrengthYellow).toBeIn("graveyard");
  });

  it("happy: paying {r} banishes it from hand and the next attack gets +2", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [consumingStrengthYellow, apexBusterYellow],
        resourcePoints: 5,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(consumingStrengthYellow);
    game.untilIdle();
    expectFabCard(Bravo, consumingStrengthYellow).toBeBanished();

    Bravo.playAttack(apexBusterYellow, { optionals: "decline" });

    expectCombat(game).toHaveAttackPower(8);
    Dash.defendWith();
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(12);
  });

  it("boundary: without a Blasmophet the card cannot be played", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [consumingStrengthYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    expectFabUnplayable(
      () => Bravo.playAttack(consumingStrengthYellow),
      /rules effect restricts this object from being played/i,
    );
    expectFabCard(Bravo, consumingStrengthYellow).toBeIn("hand");
  });
});
