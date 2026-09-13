import { describe, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabCard } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { gravelingGrowlRed } from "./graveling-growl.ts";
import { nimblismBlue } from "./nimblism.ts";
import { crashDownTheGatesRed } from "./crash-down-the-gates.ts";

describe("Crash Down the Gates family AAA", () => {
  it("happy: lower-power deck top grants +2 and hit destroys it", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [crashDownTheGatesRed], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: azalea, deckTop: [nimblismBlue] },
    );
    const Dash = game.as(dash);
    const Azalea = game.as(azalea);
    Dash.playAttack(crashDownTheGatesRed);
    expectCombat(game).toHaveAttackPower(8);
    game.closeCombat();
    expectFabCard(Azalea, nimblismBlue).toBeIn("graveyard");
  });
  it("boundary: a higher-power revealed card prevents the buff", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [crashDownTheGatesRed],
        resourcePoints: 3,
        actionPoints: 1,
      },
      { hero: azalea, deck: 6, deckTop: [gravelingGrowlRed] },
    );
    game.as(dash).playAttack(crashDownTheGatesRed);
    expectCombat(game).toHaveAttackPower(6);
  });
  it("timing: a hit destroys deck top even without the power buff", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [crashDownTheGatesRed],
        resourcePoints: 3,
        actionPoints: 1,
      },
      { hero: azalea, deck: 6, deckTop: [gravelingGrowlRed] },
    );
    const Dash = game.as(dash);
    const Azalea = game.as(azalea);
    Dash.playAttack(crashDownTheGatesRed);
    game.closeCombat();
    expectFabCard(Azalea, gravelingGrowlRed).toBeIn("graveyard");
  });
});
