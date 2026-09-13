import { describe, it } from "vitest";
import { expectFabPlayer, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { shootYourMouthOffRed } from "./shoot-your-mouth-off.ts";

describe("Shoot Your Mouth Off (SUP189) AAA", () => {
  it("happy: miss on chain close creates Confidence for the defending hero", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [shootYourMouthOffRed], resourcePoints: 3, deck: 6 },
      {
        hero: dash,
        hand: [brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue],
        life: 20,
        deck: 6,
      },
    );

    game.as(bravo).playAttack(shootYourMouthOffRed);
    game.as(dash).defendWith([brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue]);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(20).toHaveTokenCount("confidence", 1);
    expectFabPlayer(game.as(bravo)).toHaveTokenCount("confidence", 0);
  });

  it("boundary: a hit does not create Confidence", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [shootYourMouthOffRed], resourcePoints: 3, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );

    game.as(bravo).playAttack(shootYourMouthOffRed);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(12).toHaveTokenCount("confidence", 0);
  });

  it("timing: Confidence is created when the combat chain closes, not while it is open", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [shootYourMouthOffRed], resourcePoints: 3, deck: 6 },
      {
        hero: dash,
        hand: [brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue],
        life: 20,
        deck: 6,
      },
    );

    game.as(bravo).playAttack(shootYourMouthOffRed);
    game.as(dash).defendWith([brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue]);

    expectFabPlayer(game.as(dash)).toHaveTokenCount("confidence", 0);
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveTokenCount("confidence", 1);
  });
});
