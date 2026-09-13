import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { halaBladesaintOfTheVow } from "../heroes/hala-bladesaint-of-the-vow.ts";
import { belowTheBeltRed } from "./below-the-belt.ts";
import { goldenGrail } from "../weapons/golden-grail.ts";
import { headJabRed } from "./head-jab.ts";
import { nimblismBlue } from "./nimblism.ts";

/**
 * Below the Belt (MPW059) — Warrior Action, cost 1, go again.
 *
 * Printed: "Your next sword attack this turn gets +4{p} and "When this hits a
 * Warrior hero, destroy a card in their arsenal."\nGo again"
 */

describe("Below the Belt (MPW059) AAA", () => {
  it("happy: a sword hit on a Warrior hero destroys a card in their arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [goldenGrail],
        hand: [belowTheBeltRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: halaBladesaintOfTheVow,
        hand: [],
        arsenal: [nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Hala = game.as(halaBladesaintOfTheVow);

    Bravo.play(belowTheBeltRed);
    game.helpers.resolveUntilIdle();
    Bravo.activateAttack(goldenGrail);

    expectCombat(game).toHaveAttackPower(7);
    Hala.defendWith();
    game.closeCombat({ entityTargets: "maximum" });

    expectFabPlayer(Hala).toHaveLife(13);
    expect(Hala.zone("arsenal")).toEqual([]);
    expectFabCard(Hala, nimblismBlue).toBeIn("graveyard");
  });

  it("boundary: a hit on a non-Warrior hero spares their arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [goldenGrail],
        hand: [belowTheBeltRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        arsenal: [nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(belowTheBeltRed);
    game.helpers.resolveUntilIdle();
    Bravo.activateAttack(goldenGrail);

    expectCombat(game).toHaveAttackPower(7);
    Dash.defendWith();
    game.closeCombat({ entityTargets: "maximum" });

    expectFabPlayer(Dash).toHaveLife(13);
    expect(Dash.zone("arsenal")).toContain(nimblismBlue.canonicalId);
  });

  it("timing: a blocked sword attack never reaches the arsenal destroy", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [goldenGrail],
        hand: [belowTheBeltRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: halaBladesaintOfTheVow,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [headJabRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Hala = game.as(halaBladesaintOfTheVow);

    Bravo.play(belowTheBeltRed);
    game.helpers.resolveUntilIdle();
    Bravo.activateAttack(goldenGrail);
    Hala.defendWith(nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat({ entityTargets: "maximum" });

    expectFabPlayer(Hala).toHaveLife(20);
    expect(Hala.zone("arsenal")).toContain(headJabRed.canonicalId);
    expectFabPlayer(Hala).toHaveHandCount(0);
  });
});
