import { describe, it } from "vitest";
import { FabTestEngine, expectFabPlayer, expectFabCard } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { cutDownToSizeRed } from "./cut-down-to-size.ts";

describe("Cut Down to Size family AAA", () => {
  it("happy: a hit makes a hero with four cards discard one", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [cutDownToSizeRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
    );
    game.as(dash).playAttack(cutDownToSizeRed);
    game.closeCombat({ entityTargets: "minimum" });
    expectFabPlayer(game.as(bravo)).toHaveHandCount(3);
  });
  it("boundary: three cards do not satisfy the threshold", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [cutDownToSizeRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [nimblismBlue, nimblismBlue, nimblismBlue], life: 20, deck: 6 },
    );
    game.as(dash).playAttack(cutDownToSizeRed);
    game.closeCombat();
    expectFabPlayer(game.as(bravo)).toHaveHandCount(3);
  });
  it("timing: a fully blocked attack does not discard", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [cutDownToSizeRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
    );
    const Dash = game.as(dash);
    Dash.playAttack(cutDownToSizeRed);
    game.as(bravo).defendWith(nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat();
    expectFabPlayer(game.as(bravo)).toHaveHandCount(2);
    expectFabCard(Dash, cutDownToSizeRed).toBeIn("graveyard");
  });
});
