import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { secondTenetOfChiMoonBlue } from "./second-tenet-of-chi-moon.ts";

describe("Second Tenet of Chi Moon (MST081) AAA", () => {
  it("boundary: without transcend this turn, a hit deals printed 5{p} and does not draw", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [secondTenetOfChiMoonBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const before = Bravo.zone("hand").length;
    Bravo.playAttack(secondTenetOfChiMoonBlue);
    expectCombat(game).toHaveAttackPower(5);
    game.helpers.resolveRestOfCombat();
    expect(Bravo.zone("hand").length).toBe(before - 1);
    expectFabPlayer(game.as(dash)).toHaveLife(15);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [secondTenetOfChiMoonBlue], life: 20, deck: 6 },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith([secondTenetOfChiMoonBlue]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(19);
  });
});
