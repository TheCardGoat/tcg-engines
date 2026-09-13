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
import { oldLeatherAndVimRed } from "./old-leather-and-vim.ts";

/**
 * Old Leather and Vim (SUP008) — Revered Brute AAC 6{p}/3{d}.
 *
 * Printed: If you control a Toughness or Vigor token, this gets +1{p}.
 * When this hits a hero, create a Toughness and a Vigor token.
 */

describe("Old Leather and Vim (SUP008) AAA", () => {
  it("happy: a hit creates a Toughness and a Vigor token", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [oldLeatherAndVimRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.playAttack(oldLeatherAndVimRed);
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(14);
    expectFabPlayer(Rhinar).toHaveTokenCount("toughness", 1).toHaveTokenCount("vigor", 1);
  });

  it("boundary: a miss creates no Toughness or Vigor", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [oldLeatherAndVimRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue, nimblismBlue, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.playAttack(oldLeatherAndVimRed);
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Rhinar).toHaveTokenCount("toughness", 0);
    expectFabPlayer(Rhinar).toHaveTokenCount("vigor", 0);
  });

  it("timing: tokens are not created until the attack hits", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [oldLeatherAndVimRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.playAttack(oldLeatherAndVimRed);
    expectFabPlayer(Rhinar).toHaveTokenCount("toughness", 0).toHaveTokenCount("vigor", 0);
    game.closeCombat();
    expectFabPlayer(Rhinar).toHaveTokenCount("toughness", 1).toHaveTokenCount("vigor", 1);
  });
});
