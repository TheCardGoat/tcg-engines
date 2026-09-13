import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { bigSlickRed } from "./big-slick.ts";
import { goldenGrail } from "../weapons/golden-grail.ts";
import { headJabRed } from "./head-jab.ts";
import { nimblismBlue } from "./nimblism.ts";

/**
 * Big Slick (AOL011) — Warrior Action, cost 3, go again.
 *
 * Printed: "Your next sword attack this turn gets +5{p} and "When this
 * attacks, wager with the defending hero. The winner draws a card."\nGo again"
 */

describe("Big Slick (AOL011) AAA", () => {
  it("happy: the next sword attack gets +5 and the wager winner draws", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [goldenGrail],
        hand: [bigSlickRed],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(bigSlickRed);
    game.helpers.resolveUntilIdle();
    Bravo.activateAttack(goldenGrail);

    expectCombat(game).toHaveAttackPower(9); // Golden Grail gets +1 after wagering
    Dash.defendWith();
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(11);
    expectFabPlayer(Bravo).toHaveHandCount(1);
  });

  it("boundary: a non-sword attack gets neither the +5 nor the wager", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [goldenGrail],
        hand: [bigSlickRed, headJabRed],
        resourcePoints: 5,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(bigSlickRed);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(headJabRed, { optionals: "decline" });

    expectCombat(game).toHaveAttackPower(3);
    Dash.defendWith();
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabPlayer(Bravo).toHaveHandCount(0);
  });

  it("timing: a missed sword attack gives the drawn card to the defender", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [goldenGrail],
        hand: [bigSlickRed],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(bigSlickRed);
    game.helpers.resolveUntilIdle();
    Bravo.activateAttack(goldenGrail);
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20).toHaveHandCount(1);
    expectFabPlayer(Bravo).toHaveHandCount(0);
    expectFabCard(Bravo, bigSlickRed).toBeIn("graveyard");
  });
});
