import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snapdragonScalers } from "../equipment/snapdragon-scalers.ts";
import { fabricOfScalesBlue } from "./fabric-of-scales.ts";

describe("Fabric of Scales (LSS017) AAA", () => {
  it("happy: equips Snapdragon Scalers from inventory and stays as a construct", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [fabricOfScalesBlue],
        inventory: [snapdragonScalers],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(fabricOfScalesBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabCard(Dash, snapdragonScalers).toBeIn("legs");
    expectFabCard(Dash, fabricOfScalesBlue).toBeIn("arena");
  });

  it("boundary: with no Snapdragon Scalers it is negated to the graveyard", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [fabricOfScalesBlue], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(fabricOfScalesBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Dash, fabricOfScalesBlue).toBeIn("graveyard");
  });

  it("timing: playing the construct spends the Action AP", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [fabricOfScalesBlue],
        inventory: [snapdragonScalers],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(fabricOfScalesBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });
    expectFabPlayer(Dash).toHaveAP(0);
  });
});
