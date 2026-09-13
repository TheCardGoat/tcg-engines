import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { fuelInjectorBlue } from "./fuel-injector.ts";

describe("Fuel Injector (EVO075) AAA", () => {
  it("happy: Instant bottoms this to gain 1 resource", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [fuelInjectorBlue],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(fuelInjectorBlue);
    game.untilIdle();
    Dash.activate(fuelInjectorBlue);
    game.untilIdle();

    expect(Dash.zone("deck")).toContain(fuelInjectorBlue.canonicalId);
    expectFabPlayer(Dash).toHaveResourceCount(1);
  });

  it("boundary: Bravo does not gain the resource", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [fuelInjectorBlue],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: bravo, hand: [], resourcePoints: 0, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(fuelInjectorBlue);
    game.untilIdle();
    Dash.activate(fuelInjectorBlue);
    game.untilIdle();

    expectFabPlayer(Dash).toHaveResourceCount(1);
    expectFabPlayer(game.as(bravo)).toHaveResourceCount(0);
  });
});
