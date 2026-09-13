import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { throttleRed } from "../actions/throttle.ts";
import { achillesAccelerator } from "./achilles-accelerator.ts";

describe("Achilles Accelerator (ARC005) AAA", () => {
  it("happy: after boosting this turn, destroy this to gain 1 action point", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        legs: [achillesAccelerator],
        hand: [throttleRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(throttleRed, { boost: true });
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });
    game.helpers.resolveRestOfCombat();

    Dash.activate(achillesAccelerator);
    game.untilIdle();

    expectFabCard(Dash, achillesAccelerator).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveAP(1);
  });

  it("boundary: without boosted-this-turn the Instant is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        legs: [achillesAccelerator],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.expectActivationRejected(achillesAccelerator);
    expectFabCard(Dash, achillesAccelerator).toBeIn("legs");
  });
});
