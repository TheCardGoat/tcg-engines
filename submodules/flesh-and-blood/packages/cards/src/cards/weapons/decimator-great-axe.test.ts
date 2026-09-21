import { nimblismBlue } from "../actions/nimblism.ts";
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
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        life: 20,
        hand: [snatchRed],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(kassaiOfTheGoldenSand).activateAttack(decimatorGreatAxe);
    game.advanceUntil({ stopAt: "defend", optionals: "throw" });
    Dash.defendWith(snatchRed);
    game.advanceUntil({ stopAt: "reaction", optionals: "throw" });

    expectFabCard(Dash, snatchRed).toHaveDefense(1);
    game.closeCombat({ optionals: "throw" });
    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Dash, snatchRed).toBeIn("graveyard").toHaveDefense(2);
    expectCombat(game).toBeClosed();
  });

  it("happy: pay 3 resources to attack for 4", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [decimatorGreatAxe],
        resourcePoints: 3,
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      { hero: dash, life: 20, deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue] },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.activateAttack(decimatorGreatAxe);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ optionals: "throw" });
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("boundary: defending with equipment keeps printed d1", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [decimatorGreatAxe],
        resourcePoints: 3,
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        life: 20,
        chest: [ironrotPlate],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(kassaiOfTheGoldenSand).activateAttack(decimatorGreatAxe);
    game.advanceUntil({ stopAt: "defend", optionals: "throw" });
    Dash.defendWith(ironrotPlate);
    game.passBoth();

    expectFabCard(Dash, ironrotPlate).toHaveDefense(1);
    game.closeCombat({ optionals: "throw" });
    expectFabPlayer(Dash).toHaveLife(17);
  });

  it("timing: once per turn — a second activation is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [decimatorGreatAxe],
        resourcePoints: 6,
        actionPoints: 2,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      { hero: dash, life: 20, deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue] },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.activateAttack(decimatorGreatAxe);
    game.closeCombat({ optionals: "throw" });
    Kassai.expectActivationRejected(decimatorGreatAxe);
  });
});
