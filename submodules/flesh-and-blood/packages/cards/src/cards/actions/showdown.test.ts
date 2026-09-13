import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { anothos } from "../weapons/anothos.ts";
import { durendal } from "../weapons/durendal.ts";
import { nimblismBlue } from "./nimblism.ts";
import { showdownRed } from "./showdown.ts";

/**
 * Showdown, Red (MPW126) — Warrior Action, cost 1, go again.
 *
 * Printed: "Your next sword attack this turn gets +3{p} and "When this attacks,
 * wager with the defending hero. The winner creates a Flurry token."\nGo again"
 */

describe("Showdown (MPW126) AAA", () => {
  it("happy: a hitting sword attack wins the wager and creates the Flurry", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [durendal],
        hand: [showdownRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(showdownRed);
    game.helpers.resolveUntilIdle();
    Bravo.activateAttack(durendal);

    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(6);
    Dash.defendWith();
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(14).toHaveTokenCount("flurry", 0);
    expectFabPlayer(Bravo).toHaveTokenCount("flurry", 1);
  });

  it("timing: a blocked sword attack hands the Flurry to the defender", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [durendal],
        hand: [showdownRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(showdownRed);
    game.helpers.resolveUntilIdle();
    Bravo.activateAttack(durendal);

    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(6);
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Dash).toHaveLife(20).toHaveTokenCount("flurry", 1);
    expectFabPlayer(Bravo).toHaveTokenCount("flurry", 0);
  });

  it("boundary: a non-sword weapon attack gets neither the +3{p} nor the wager", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [anothos],
        hand: [showdownRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(showdownRed);
    game.helpers.resolveUntilIdle();
    Bravo.activateAttack(anothos);

    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(4);
    Dash.defendWith();
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(16).toHaveTokenCount("flurry", 0);
    expectFabPlayer(Bravo).toHaveTokenCount("flurry", 0);
  });
});
