import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { standingOvationBlue } from "./standing-ovation.ts";

describe("Standing Ovation (APS019) AAA", () => {
  it("boundary: without 3 suspense auras leaving arena, a hit deals printed 8{p} only", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [standingOvationBlue], resourcePoints: 6, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    Bravo.playAttack(standingOvationBlue);
    expectCombat(game).toHaveAttackPower(8);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(12);
  });

  it("happy: printed 8{p} attack resolves", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [standingOvationBlue], resourcePoints: 6, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(bravo).playAttack(standingOvationBlue);
    expectCombat(game).toHaveAttackPower(8);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [standingOvationBlue], life: 20, deck: 6 },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith([standingOvationBlue]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(19);
  });
});
