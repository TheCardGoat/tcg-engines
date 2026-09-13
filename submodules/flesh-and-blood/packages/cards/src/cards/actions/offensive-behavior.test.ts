import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { rhinar } from "../heroes/rhinar.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { offensiveBehaviorBlue } from "./offensive-behavior.ts";

/**
 * Offensive Behavior (SUP070) — Reviled Brute AAC 2{p}/3{d}.
 *
 * Printed: If you control a Might or Vigor token, this gets +1{p}.
 * When this hits a hero, create a Might and a Vigor token.
 */

describe("Offensive Behavior (SUP070) AAA", () => {
  it("happy: a hit creates a Might and a Vigor token", () => {
    const game = FabTestEngine.start(
      { hero: rhinar, hand: [offensiveBehaviorBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.playAttack(offensiveBehaviorBlue);
    expectCombat(game).toHaveAttackPower(2);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(18);
    expectFabPlayer(Rhinar).toHaveTokenCount("might", 1).toHaveTokenCount("vigor", 1);
  });

  it("boundary: a miss creates no Might or Vigor", () => {
    const game = FabTestEngine.start(
      { hero: rhinar, hand: [offensiveBehaviorBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.playAttack(offensiveBehaviorBlue);
    Dash.defendWith(nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Rhinar).toHaveTokenCount("might", 0);
    expectFabPlayer(Rhinar).toHaveTokenCount("vigor", 0);
  });

  it("timing: tokens are not created until the attack hits", () => {
    const game = FabTestEngine.start(
      { hero: rhinar, hand: [offensiveBehaviorBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.playAttack(offensiveBehaviorBlue);
    expectFabPlayer(Rhinar).toHaveTokenCount("might", 0).toHaveTokenCount("vigor", 0);
    game.closeCombat();
    expectFabPlayer(Rhinar).toHaveTokenCount("might", 1).toHaveTokenCount("vigor", 1);
  });
});
