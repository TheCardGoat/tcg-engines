import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { crouchingTiger } from "../actions/crouching-tiger.ts";
import { spectralShield } from "../tokens/spectral-shield.ts";
import { tigerStripeShuko } from "./tiger-stripe-shuko.ts";

describe("Tiger Stripe Shuko (UPR158) AAA", () => {
  it("happy: the second 2-or-less base {p} attack this turn gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [tigerStripeShuko],
        hand: [crouchingTiger, crouchingTiger],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    Bravo.playAttack(crouchingTiger);
    expectCombat(game).toHaveAttackPower(1);
    game.closeCombat();
    Bravo.playAttack(crouchingTiger);
    expectCombat(game).toHaveAttackPower(1);
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(18);
  });

  it("boundary: the first 2-or-less attack this turn stays printed", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [tigerStripeShuko],
        hand: [crouchingTiger],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(bravo).playAttack(crouchingTiger);
    expectCombat(game).toHaveAttackPower(1);
  });

  it("timing: the second attack's damage can't be prevented", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [tigerStripeShuko],
        hand: [crouchingTiger, crouchingTiger],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arena: [spectralShield], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    Bravo.playAttack(crouchingTiger);
    game.closeCombat({ optionals: "decline" });
    Bravo.playAttack(crouchingTiger);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(game.as(dash)).toHaveLife(19);
  });
});
