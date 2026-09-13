import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
  expectFabToken,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { moneyOrYourLifeRed } from "./money-or-your-life.ts";

describe("Money or Your Life (SEA203) AAA", () => {
  it("happy: hitting deals 6 then 2 more unless they give Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [moneyOrYourLifeRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(moneyOrYourLifeRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(game.as(dash)).toHaveLife(12);
  });

  it("boundary: missing deals no follow-up damage", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [moneyOrYourLifeRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue, nimblismBlue, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(moneyOrYourLifeRed);
    Dash.defendWith([nimblismBlue, nimblismBlue, nimblismBlue]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("timing: giving Gold prevents the 2 damage", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [moneyOrYourLifeRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arena: [fabToken("gold")], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).playAttack(moneyOrYourLifeRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });
    expectFabPlayer(game.as(dash)).toHaveLife(14);
    expectFabToken(game, "gold").toHaveCount(1);
  });
});
