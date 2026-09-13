import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { katsu } from "../heroes/katsu.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { windSlicerBlue } from "./wind-slicer.ts";

/**
 * Wind Slicer — Ninja Instant - Shuriken Item, 1{p}/2{d}.
 *
 * Printed: Legendary. Action - {r}, {t}, destroy this when the combat chain
 * closes: Attack. Go again. When this hits a hero, they lose all hero card
 * abilities during their next action phase.
 */

describe("Wind Slicer AAA", () => {
  it("happy: the Shuriken attacks, refunds AP, and is destroyed when the chain closes", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [windSlicerBlue],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);
    const Bravo = game.as(bravo);

    Katsu.play(windSlicerBlue);
    game.untilIdle({ ordering: "listed" });
    expectFabCard(Katsu, windSlicerBlue).toBeIn("arena");
    Katsu.activateAttack(windSlicerBlue);

    expectCombat(game).toHaveAttackPower(1);
    expectFabCard(Katsu, windSlicerBlue).toBeIn("arena");
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Bravo).toHaveLife(19);
    expectFabPlayer(Katsu).toHaveAP(2);
    expectFabCard(Katsu, windSlicerBlue).toBeIn("graveyard");
  });

  it("boundary: closing an unrelated chain without activating leaves the Shuriken alone", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [windSlicerBlue, snatchRed],
        resourcePoints: 4,
        actionPoints: 3,
        deck: 6,
      },
      { hero: bravo, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.play(windSlicerBlue);
    game.untilIdle({ ordering: "listed" });
    Katsu.playAttack(snatchRed);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(game.as(bravo)).toHaveLife(16);
    expectFabCard(Katsu, windSlicerBlue).toBeIn("arena");
  });

  it("happy: a hit strips the defending hero's abilities during their next action phase", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [windSlicerBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, life: 20, resourcePoints: 2, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);
    const Bravo = game.as(bravo);

    Katsu.play(windSlicerBlue);
    game.untilIdle({ ordering: "listed" });
    Katsu.activateAttack(windSlicerBlue);
    Bravo.defendWith();
    game.closeCombat({ ordering: "listed" });
    Katsu.endTurn();
    game.untilIdle();

    Bravo.expectActivationRejected(bravo);
  });

  it("boundary: a miss leaves the defending hero at printed life", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [windSlicerBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, life: 20, hand: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);
    const Bravo = game.as(bravo);

    Katsu.play(windSlicerBlue);
    game.untilIdle({ ordering: "listed" });
    Katsu.activateAttack(windSlicerBlue);
    Bravo.defendWith(nimblismBlue);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Bravo).toHaveLife(20);
    expectFabCard(Katsu, windSlicerBlue).toBeIn("graveyard");
  });
});
