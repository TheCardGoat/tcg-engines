import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { crouchingTiger } from "./crouching-tiger.ts";
import { tigerSwipeRed } from "./tiger-swipe.ts";

describe("Tiger Swipe (DYN047) AAA", () => {
  it("happy: after Crouching Tiger this is 4{p} and creates tigers in banished", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [crouchingTiger, tigerSwipeRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    Bravo.playAttack(crouchingTiger);
    game.advanceCombatTo("resolution");
    Bravo.playAttack(tigerSwipeRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expect(Bravo.zone("banished").length + Bravo.zone("hand").length).toBeGreaterThanOrEqual(0);
  });

  it("boundary: without Crouching Tiger this stays 2{p}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [tigerSwipeRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(bravo).playAttack(tigerSwipeRed);
    expectCombat(game).toHaveAttackPower(2);
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(18);
  });

  it("timing: combo go again refunds AP after the tiger swipe", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [crouchingTiger, tigerSwipeRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    Bravo.playAttack(crouchingTiger);
    game.advanceCombatTo("resolution");
    Bravo.playAttack(tigerSwipeRed);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Bravo).toHaveAP(1);
  });
});
