import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kassaiOfTheGoldenSand } from "../heroes/kassai-of-the-golden-sand.ts";
import { ironrotPlate } from "../equipment/ironrot-plate.ts";
import { snatchRed } from "../actions/snatch.ts";
import { decimatorGreatAxe } from "./decimator-great-axe.ts";

describe("Decimator Great Axe (DTD205) AAA", () => {
  it("happy: first non-equipment defend halves that card's base {d} (d2 → 1)", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [decimatorGreatAxe],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(kassaiOfTheGoldenSand).activate(decimatorGreatAxe);
    game.advanceCombatTo("defend");
    Dash.defendWith(snatchRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum", optionalBoolean: false });

    expectFabCard(Dash, snatchRed).toHaveDefense(1);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(17);
  });

  it("happy: pay 3 resources to attack for 4", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [decimatorGreatAxe],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.activate(decimatorGreatAxe);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("boundary: defending with equipment keeps printed d1", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [decimatorGreatAxe],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, chest: [ironrotPlate], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(kassaiOfTheGoldenSand).activate(decimatorGreatAxe);
    game.advanceCombatTo("defend");
    Dash.defendWith(ironrotPlate);
    game.passBoth();

    expectFabCard(Dash, ironrotPlate).toHaveDefense(1);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(17);
  });

  it("timing: once per turn — a second activation is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [decimatorGreatAxe],
        resourcePoints: 6,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.activate(decimatorGreatAxe);
    game.helpers.resolveRestOfCombat();
    Kassai.expectActivationRejected(decimatorGreatAxe);
  });
});
