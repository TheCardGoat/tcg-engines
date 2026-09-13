import { describe, it } from "vitest";
import { expectFabPlayer, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { giveEmAPieceOfYourMindRed } from "./give-em-a-piece-of-your-mind.ts";

describe("Give 'Em a Piece of Your Mind (SUP152) AAA", () => {
  it("happy: miss on chain close creates Vigor for the defending hero", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [giveEmAPieceOfYourMindRed], resourcePoints: 2, deck: 6 },
      {
        hero: dash,
        hand: [brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue],
        life: 20,
        deck: 6,
      },
    );

    game.as(bravo).playAttack(giveEmAPieceOfYourMindRed);
    game.as(dash).defendWith([brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue]);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(20).toHaveTokenCount("vigor", 1);
    expectFabPlayer(game.as(bravo)).toHaveTokenCount("vigor", 0);
  });

  it("boundary: a hit does not create Vigor", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [giveEmAPieceOfYourMindRed], resourcePoints: 2, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );

    game.as(bravo).playAttack(giveEmAPieceOfYourMindRed);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(13).toHaveTokenCount("vigor", 0);
  });

  it("timing: Vigor is created when the combat chain closes, not while it is open", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [giveEmAPieceOfYourMindRed], resourcePoints: 2, deck: 6 },
      {
        hero: dash,
        hand: [brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue],
        life: 20,
        deck: 6,
      },
    );

    game.as(bravo).playAttack(giveEmAPieceOfYourMindRed);
    game.as(dash).defendWith([brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue]);

    expectFabPlayer(game.as(dash)).toHaveTokenCount("vigor", 0);
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveTokenCount("vigor", 1);
  });
});
