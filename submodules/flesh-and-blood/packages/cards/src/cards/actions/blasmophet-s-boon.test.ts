import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { levia } from "../heroes/levia.ts";
import { dash } from "../heroes/dash.ts";
import { blasmophetLeviaConsumed } from "../demi-heroes/blasmophet-levia-consumed.ts";
import { blasmophetTheInsatiableHunger } from "../tokens/blasmophet-the-insatiable-hunger.ts";
import { blasmophetSBoonBlue } from "./blasmophet-s-boon.ts";

/**
 * Blasmophet's Boon, Blue — Shadow Brute Action - Attack, cost 1, 3{d}.
 *
 * Printed: "If you control a Blasmophet, this card's {p} is 6. Otherwise, it's
 * 0. Blood Debt"
 */

describe("Blasmophet's Boon AAA", () => {
  it("happy: controlling a Blasmophet makes this a 6{p} attack", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        arena: [blasmophetTheInsatiableHunger],
        hand: [blasmophetSBoonBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.playAttack(blasmophetSBoonBlue);
    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(6);
    Dash.defendWith();
    game.closeCombat();
    expectFabPlayer(Dash).toHaveLife(14);
  });

  it("happy: controlling Blasmophet, Levia Consumed makes this a 6{p} attack", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        arena: [blasmophetLeviaConsumed],
        hand: [blasmophetSBoonBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.playAttack(blasmophetSBoonBlue);
    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(6);
    Dash.defendWith();
    game.closeCombat();
    expectFabPlayer(Dash).toHaveLife(14);
  });

  it("boundary: without a Blasmophet this attacks for 0{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [blasmophetSBoonBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.playAttack(blasmophetSBoonBlue);
    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(0);
    Dash.defendWith();
    game.closeCombat();
    expectFabPlayer(Dash).toHaveLife(20);
  });
});
