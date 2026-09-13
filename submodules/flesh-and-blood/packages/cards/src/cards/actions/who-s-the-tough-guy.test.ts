import { describe, it } from "vitest";
import { expectFabPlayer, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { whoSTheToughGuyRed } from "./who-s-the-tough-guy.ts";

describe("Who's the Tough Guy? family AAA", () => {
  it("happy: miss on chain close creates Toughness for the defending hero", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [whoSTheToughGuyRed], resourcePoints: 2, deck: 6 },
      {
        hero: dash,
        hand: [brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue],
        life: 20,
        deck: 6,
      },
    );

    game.as(bravo).playAttack(whoSTheToughGuyRed);
    game.as(dash).defendWith([brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue]);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(20).toHaveTokenCount("toughness", 1);
    expectFabPlayer(game.as(bravo)).toHaveTokenCount("toughness", 0);
  });

  it("boundary: a hit does not create Toughness", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [whoSTheToughGuyRed], resourcePoints: 2, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );

    game.as(bravo).playAttack(whoSTheToughGuyRed);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(13).toHaveTokenCount("toughness", 0);
  });

  it("timing: Toughness is created when the combat chain closes, not while it is open", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [whoSTheToughGuyRed], resourcePoints: 2, deck: 6 },
      {
        hero: dash,
        hand: [brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue],
        life: 20,
        deck: 6,
      },
    );

    game.as(bravo).playAttack(whoSTheToughGuyRed);
    game.as(dash).defendWith([brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue]);

    expectFabPlayer(game.as(dash)).toHaveTokenCount("toughness", 0);
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveTokenCount("toughness", 1);
  });
});
