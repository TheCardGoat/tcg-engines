import { describe, it } from "vitest";
import { expectFabPlayer, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { takeThatRed } from "./take-that.ts";

describe("Take That! family AAA", () => {
  it("happy: miss on chain close creates Might for the defending hero", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [takeThatRed], resourcePoints: 0, deck: 6 },
      { hero: dash, hand: [brutalAssaultBlue, brutalAssaultBlue], life: 20, deck: 6 },
    );

    game.as(bravo).playAttack(takeThatRed);
    game.as(dash).defendWith([brutalAssaultBlue, brutalAssaultBlue]);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(20).toHaveTokenCount("might", 1);
    expectFabPlayer(game.as(bravo)).toHaveTokenCount("might", 0);
  });

  it("boundary: a hit does not create Might", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [takeThatRed], resourcePoints: 0, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );

    game.as(bravo).playAttack(takeThatRed);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(15).toHaveTokenCount("might", 0);
  });

  it("timing: Might is created when the combat chain closes, not while it is open", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [takeThatRed], resourcePoints: 0, deck: 6 },
      { hero: dash, hand: [brutalAssaultBlue, brutalAssaultBlue], life: 20, deck: 6 },
    );

    game.as(bravo).playAttack(takeThatRed);
    game.as(dash).defendWith([brutalAssaultBlue, brutalAssaultBlue]);

    expectFabPlayer(game.as(dash)).toHaveTokenCount("might", 0);
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveTokenCount("might", 1);
  });
});
