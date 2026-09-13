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
import { halaBladesaintOfTheVow } from "../heroes/hala-bladesaint-of-the-vow.ts";
import { goldenGrail } from "../weapons/golden-grail.ts";
import { nimblismBlue } from "./nimblism.ts";
import { steelToTheDomeRed } from "./steel-to-the-dome.ts";

/**
 * Steel to the Dome, Red (MPW070) — Warrior Action, cost 1, go again.
 *
 * Printed: "Your next sword attack this turn gets +4{p} and "When this hits a
 * Warrior hero, they discard a card."\nGo again"
 */

describe("Steel to the Dome (MPW070) AAA", () => {
  it("happy: a sword hit on a Warrior hero forces the discard", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [goldenGrail],
        hand: [steelToTheDomeRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: halaBladesaintOfTheVow,
        hand: [nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Hala = game.as(halaBladesaintOfTheVow);

    Bravo.play(steelToTheDomeRed);
    game.helpers.resolveUntilIdle();
    Bravo.activateAttack(goldenGrail);

    expectCombat(game).toHaveAttackPower(7);
    Hala.defendWith();
    game.closeCombat({ entityTargets: "minimum" });

    expectFabPlayer(Hala).toHaveLife(13).toHaveHandCount(0);
    expectFabCard(Hala, nimblismBlue).toBeIn("graveyard");
  });

  it("boundary: a hit on a non-Warrior hero spares their hand", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [goldenGrail],
        hand: [steelToTheDomeRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(steelToTheDomeRed);
    game.helpers.resolveUntilIdle();
    Bravo.activateAttack(goldenGrail);

    expectCombat(game).toHaveAttackPower(7);
    Dash.defendWith();
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(13).toHaveHandCount(1);
    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
  });

  it("timing: a fully blocked sword attack never reaches the discard", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [goldenGrail],
        hand: [steelToTheDomeRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: halaBladesaintOfTheVow,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Hala = game.as(halaBladesaintOfTheVow);

    Bravo.play(steelToTheDomeRed);
    game.helpers.resolveUntilIdle();
    Bravo.activateAttack(goldenGrail);
    Hala.defendWith(nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Hala).toHaveLife(20).toHaveHandCount(0);
    expectFabPlayer(Bravo).toHaveResourceCount(0);
  });
});
