import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { snatchRed } from "../actions/snatch.ts";
import { snapdragonScalers } from "./snapdragon-scalers.ts";

describe("Snapdragon Scalers (RNR007) AAA", () => {
  it("happy: destroy this so a cost-0 attack action gains go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        legs: [snapdragonScalers],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Dash.activate(snapdragonScalers);
    game.passBoth();

    expectCombat(game).toHaveKeyword("go-again");
    expectFabCard(Dash, snapdragonScalers).toBeIn("graveyard");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveAP(1);
  });

  it("boundary: a cost-2 attack action cannot be the target", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        legs: [snapdragonScalers],
        hand: [brutalAssaultBlue],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.attackWith(brutalAssaultBlue);
    game.advanceCombatTo("reaction");

    Dash.expectActivationRejected(snapdragonScalers);
    expectCombat(game).notToHaveKeyword("go-again");
    expectFabCard(Dash, snapdragonScalers).toBeIn("legs");
  });
});
