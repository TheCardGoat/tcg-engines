import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { snatchRed } from "./snatch.ts";
import { wreckerRompBlue } from "./wrecker-romp.ts";
import { recklessStampedeRed } from "./reckless-stampede.ts";

describe("Reckless Stampede (SUP127) AAA", () => {
  it("happy: a defending card clashes and the winner deals 1 damage", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [recklessStampedeRed],
        // Last element is deck-top: power 6 beats the defender's 0-power reveal.
        deck: [snatchRed, wreckerRompBlue],
        resourcePoints: 2,
        actionPoints: 1,
      },
      {
        hero: dash,
        hand: [brutalAssaultBlue],
        life: 20,
        deck: [brutalAssaultBlue, snatchRed],
      },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.attackWith(recklessStampedeRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(brutalAssaultBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    // 7 attack − 3 defense = 4 combat, plus 1 clash damage.
    expectFabPlayer(Dash).toHaveLife(15);
  });

  it("boundary: with no defending card there is no clash damage", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [recklessStampedeRed],
        deck: [wreckerRompBlue],
        resourcePoints: 2,
        actionPoints: 1,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(rhinar).attackWith(recklessStampedeRed);
    game.helpers.resolveRestOfCombat();
    // Undefended 7 damage, no extra clash damage.
    expectFabPlayer(game.as(dash)).toHaveLife(13);
  });
});
