import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { headJabRed } from "./head-jab.ts";
import { openTheCenterRed } from "./open-the-center.ts";

/**
 * Open the Center (KSU013) — Ninja Action - Attack, cost 2, 5{p}, 3{d}.
 *
 * Printed: "Combo - If Head Jab was the last attack this combat chain, Open
 * the Center gains +1{p}, go again, and dominate."
 *
 * CRU151-class pin: the module lists unprinted `keywords: [goAgain, dominate,
 * combo]`, so go again and dominate apply even without the Head Jab combo.
 */

describe("Open the Center (KSU013) AAA", () => {
  it("happy: after Head Jab on the same chain this is 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [headJabRed, openTheCenterRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.must.playAttack(headJabRed);
    game.advanceCombatTo("resolution");
    Bravo.must.playAttack(openTheCenterRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(6);
    expectCombat(game).toHaveKeyword("dominate");
  });

  it("boundary: as the first link it stays 5{p} without dominate or go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [openTheCenterRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed, nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(openTheCenterRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(5);
    expectCombat(game).notToHaveKeyword("dominate");
    expectCombat(game).notToHaveKeyword("go-again");

    Dash.defendWith();
    game.closeCombat();
    expectFabPlayer(Bravo).toHaveAP(0);
  });

  it("boundary: Snatch as the last attack does not grant +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, openTheCenterRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.must.playAttack(snatchRed);
    game.advanceCombatTo("resolution");
    Bravo.must.playAttack(openTheCenterRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(5);
  });
});
