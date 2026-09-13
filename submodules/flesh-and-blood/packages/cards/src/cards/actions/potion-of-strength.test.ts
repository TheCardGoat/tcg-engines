import { describe, expect, it } from "vitest";
import {
  FabTestEngine,
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { potionOfStrengthBlue } from "./potion-of-strength.ts";

describe("Potion of Strength Blue (BVO028) AAA", () => {
  it("happy: activate destroys the potion; next attack gains +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [potionOfStrengthBlue, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(potionOfStrengthBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Azalea, potionOfStrengthBlue).toBeIn("arena");

    Azalea.activate(potionOfStrengthBlue);
    game.passBoth();
    expectFabCard(Azalea, potionOfStrengthBlue).toBeIn("graveyard");

    Azalea.attackWith(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: without potion activation, attack has base power", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [potionOfStrengthBlue, brutalAssaultBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.attackWith(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: go again refunds the action point spent to activate", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [potionOfStrengthBlue],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(potionOfStrengthBlue);
    game.helpers.resolveUntilIdle();
    Azalea.activate(potionOfStrengthBlue);
    game.passBoth();

    expect(Azalea.actionPoints()).toBe(1);
  });
});
