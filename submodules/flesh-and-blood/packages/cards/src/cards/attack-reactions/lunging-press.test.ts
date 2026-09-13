import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { anothos } from "../weapons/anothos.ts";
import { snatchRed } from "../actions/snatch.ts";
import { lungingPressBlue } from "./lunging-press.ts";

describe("Lunging Press (IRA011) AAA", () => {
  it("happy: target attack action card gains +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, lungingPressBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Bravo.must.playReaction(lungingPressBlue);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(5);
  });

  it("boundary: a weapon attack is not an attack action card", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [anothos],
        hand: [lungingPressBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.must.activate(anothos);
    game.advanceCombatTo("reaction");
    expect(() => Bravo.must.playReaction(lungingPressBlue)).toThrow();
    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Bravo, lungingPressBlue).toBeIn("hand");
  });

  it("timing: cannot play Lunging Press outside the reaction step", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, lungingPressBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(bravo).play(lungingPressBlue)).toThrow();
    expectFabCard(game.as(bravo), lungingPressBlue).toBeIn("hand");
  });
});
