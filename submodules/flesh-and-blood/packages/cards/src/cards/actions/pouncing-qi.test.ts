import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { crouchingTiger } from "./crouching-tiger.ts";
import { pouncingQiRed } from "./pouncing-qi.ts";

describe("Pouncing Qi (DYN056) AAA", () => {
  it("happy: after Crouching Tiger this is 4{p} and refunds AP", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [crouchingTiger, pouncingQiRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(crouchingTiger);
    game.advanceCombatTo("resolution");
    Bravo.playAttack(pouncingQiRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4).toHaveKeyword("go-again");
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabPlayer(Bravo).toHaveAP(1);
  });

  it("boundary: without Crouching Tiger this stays 3{p}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [pouncingQiRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(pouncingQiRed);
    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(17);
  });

  it("timing: a non-Tiger last attack does not grant the combo +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [pouncingQiRed, pouncingQiRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(pouncingQiRed);
    game.advanceCombatTo("resolution");
    Bravo.playAttack(pouncingQiRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(3);
  });
});
