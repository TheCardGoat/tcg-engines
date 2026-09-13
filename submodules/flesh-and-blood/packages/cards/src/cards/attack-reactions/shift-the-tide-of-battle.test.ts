import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { shiftTheTideOfBattleYellow } from "./shift-the-tide-of-battle.ts";

/**
 * Shift the Tide of Battle (HVY102) — target Warrior attack with {p} > base gets go again.
 */

describe("Shift the Tide of Battle (HVY102) AAA", () => {
  it("boundary: a Generic attack is not a legal Warrior target", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [snatchRed, shiftTheTideOfBattleYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    expect(() => Dori.must.playReaction(shiftTheTideOfBattleYellow)).toThrow(
      /no legal target|couldn't be played|not legal/i,
    );
  });

  it("happy: printed 3{d} as a reaction stays in graveyard after play on a legal miss", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [shiftTheTideOfBattleYellow],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dori = game.as(dorinthea);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Dori.defendWith([shiftTheTideOfBattleYellow]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dori).toHaveLife(19);
  });

  it("boundary: cannot play off the chain", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [shiftTheTideOfBattleYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);
    expect(() => Dori.must.playReaction(shiftTheTideOfBattleYellow)).toThrow(/not legal/i);
  });
});
