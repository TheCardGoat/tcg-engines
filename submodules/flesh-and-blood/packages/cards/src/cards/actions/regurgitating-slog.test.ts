import { describe, it } from "vitest";
import {
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { sloggismRed } from "./sloggism.ts";
import { snatchRed } from "./snatch.ts";
import { regurgitatingSlogRed } from "./regurgitating-slog.ts";

describe("Regurgitating Slog (WTR197) AAA", () => {
  it("happy: banishing a Sloggism from graveyard grants dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [regurgitatingSlogRed],
        graveyard: [sloggismRed],
        resourcePoints: 2,
        deck: 6,
      },
      { hero: bravo, hand: [snatchRed, nimblismBlue], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.play(regurgitatingSlogRed, { banishCostCard: sloggismRed });
    game.advanceUntil({ stopAt: "defend", optionals: "decline" });
    expectCombat(game).toHaveAttackPower(6);
    expectCombat(game).toHaveKeyword("dominate");
    Bravo.expectBlockRejected([snatchRed, nimblismBlue]);
    Bravo.defendWith(snatchRed);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Bravo).toHaveLife(16);
    expectFabCard(Dash, sloggismRed).toBeBanished();
  });

  it("boundary: without a Sloggism in graveyard it has no dominate", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [regurgitatingSlogRed], resourcePoints: 2, deck: 6 },
      { hero: bravo, hand: [snatchRed, nimblismBlue, nimblismBlue], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(regurgitatingSlogRed);
    expectCombat(game).toHaveAttackPower(6);
    expectCombat(game).notToHaveKeyword("dominate");
    Bravo.defendWith(snatchRed, nimblismBlue, nimblismBlue);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Bravo).toHaveLife(20);
  });

  it("timing: dominate expires when combat closes", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [regurgitatingSlogRed, snatchRed],
        graveyard: [sloggismRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.play(regurgitatingSlogRed, { banishCostCard: sloggismRed });
    game.advanceUntil({ stopAt: "defend", optionals: "decline" });
    expectCombat(game).toHaveKeyword("dominate");
    game.closeCombat({ optionals: "decline" });
    expectCombat(game).toBeClosed();
    Dash.playAttack(snatchRed);
    expectCombat(game).notToHaveKeyword("dominate");
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(game.as(bravo)).toHaveLife(10);
  });
});
