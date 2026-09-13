import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kassaiOfTheGoldenSand } from "../heroes/kassai-of-the-golden-sand.ts";
import { snatchRed } from "../actions/snatch.ts";
import { ironrotPlate } from "../equipment/ironrot-plate.ts";
import { cintariSaber } from "./cintari-saber.ts";

describe("Cintari Saber (CRU079) AAA", () => {
  it("happy: defended by an attack action, the saber gets +1{p} this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.activate(cintariSaber);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith(snatchRed);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(3);
    expectFabCard(Kassai, cintariSaber).toHavePower(3);
  });

  it("boundary: defending with equipment does not give +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, chest: [ironrotPlate], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(kassaiOfTheGoldenSand).activate(cintariSaber);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith(ironrotPlate);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(2);
  });

  it("timing: once per turn — a second activation is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.activate(cintariSaber);
    game.helpers.resolveRestOfCombat();

    Kassai.expectActivationRejected(cintariSaber);
    expect(game.combat()).toBeNull();
  });
});
