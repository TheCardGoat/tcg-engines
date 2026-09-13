import { describe, it } from "vitest";
import { FabTestEngine, expectFabToken } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { destructiveDeliberationRed } from "./destructive-deliberation.ts";

describe("Destructive Deliberation family AAA", () => {
  it("happy: a hit creates a Ponder token", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [destructiveDeliberationRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, life: 20, deck: 6 },
    );
    game.as(dash).playAttack(destructiveDeliberationRed);
    game.closeCombat();
    expectFabToken(game, "ponder").toHaveCount(1);
  });
  it("boundary: a full block creates no token", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [destructiveDeliberationRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [nimblismBlue, nimblismBlue, nimblismBlue], life: 20, deck: 6 },
    );
    game.as(dash).playAttack(destructiveDeliberationRed);
    game.as(bravo).defendWith(nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat();
    expectFabToken(game, "ponder").toHaveCount(0);
  });
  it("timing: sitting in hand does not create a token", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [destructiveDeliberationRed], actionPoints: 1, deck: 6 },
      { hero: bravo, deck: 6 },
    );
    expectFabToken(game, "ponder").toHaveCount(0);
  });
});
