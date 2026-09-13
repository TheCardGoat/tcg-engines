import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { goldenGrail } from "../weapons/golden-grail.ts";
import { headJabRed } from "./head-jab.ts";
import { nimblismBlue } from "./nimblism.ts";
import { gutshotRed } from "./gutshot.ts";

/**
 * Gutshot, Red (MPW109) — Warrior Action, cost 1, go again, Wager.
 *
 * Printed: "Your next sword attack this turn gets +3{p} and "When this
 * attacks, wager with the defending hero. The winner creates a Blade Dance
 * token."\nGo again"
 */

describe("Gutshot (MPW109) AAA", () => {
  it("happy: the sword attack gets +3 and the hitting attacker wins the Blade Dance", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [goldenGrail],
        hand: [gutshotRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(gutshotRed);
    game.helpers.resolveUntilIdle();
    Bravo.activateAttack(goldenGrail);
    expectCombat(game).toHaveAttackPower(7); // 3 base + 3 from Gutshot + 1 after wagering
    Dash.defendWith();
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(13);
    expectFabPlayer(Bravo).toHaveTokenCount("blade-dance", 1);
    expectFabPlayer(Dash).toHaveTokenCount("blade-dance", 0);
  });

  it("boundary: a non-sword attack gets neither the +3 nor the wager", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [goldenGrail],
        hand: [gutshotRed, headJabRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(gutshotRed);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(headJabRed);

    expectCombat(game).toHaveAttackPower(3);
    Dash.defendWith();
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabPlayer(Bravo).toHaveTokenCount("blade-dance", 0);
  });

  it("timing: a missed sword attack hands the Blade Dance to the defender", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [goldenGrail],
        hand: [gutshotRed],
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

    Bravo.play(gutshotRed);
    game.helpers.resolveUntilIdle();
    Bravo.activateAttack(goldenGrail);
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20).toHaveTokenCount("blade-dance", 1);
    expectFabPlayer(Bravo).toHaveTokenCount("blade-dance", 0);
  });
});
