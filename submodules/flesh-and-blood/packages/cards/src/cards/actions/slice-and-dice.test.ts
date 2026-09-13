import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dash } from "../heroes/dash.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { sliceAndDiceRed } from "./slice-and-dice.ts";

describe("Slice and Dice (EVR057) AAA", () => {
  it("happy: the first sword attack this turn gains +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [sliceAndDiceRed],
        weapon1: [dawnblade],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.play(sliceAndDiceRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dori).toHaveAP(1);

    Dori.activate(dawnblade);
    game.passBoth();
    // Delayed "whenever you attack with a sword/dagger" sits on the stack
    // after the activation layer resolves — pass once more to apply +1{p}.
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("boundary: a non-sword, non-dagger attack is not buffed", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [sliceAndDiceRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.play(sliceAndDiceRed);
    game.helpers.resolveUntilIdle();
    Dori.attackWith(brutalAssaultBlue);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });
});
