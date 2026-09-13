import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { heroicGritYellow } from "./heroic-grit.ts";

/**
 * Heroic Grit (SUP056) — next attack +1{p} per Toughness; create a Toughness.
 */

describe("Heroic Grit (SUP056) AAA", () => {
  it("happy: creates Toughness and the next attack gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [heroicGritYellow, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(heroicGritYellow);
    game.helpers.resolveUntilIdle();
    expect(Bravo.zone("arena")).toContain("token:toughness");
    Bravo.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(5);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(15);
  });

  it("boundary: without Heroic Grit, Snatch is printed 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("boundary: defends for its printed 2{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [heroicGritYellow],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith([heroicGritYellow]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(18);
  });
});
