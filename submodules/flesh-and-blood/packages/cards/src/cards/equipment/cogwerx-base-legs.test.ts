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
import { cogwerxBaseLegs } from "./cogwerx-base-legs.ts";

describe("Cogwerx Base Legs (EVO017) AAA", () => {
  it("happy: seating puts a steam counter; after boost, Instant nets +1 action point", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        legs: [cogwerxBaseLegs],
        hand: [throttleRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Dash, cogwerxBaseLegs).toBeIn("legs");
    expectFabCard(Dash, cogwerxBaseLegs).toHaveCounters(1, "steam");

    Dash.play(throttleRed, { boost: true });
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });
    game.helpers.resolveRestOfCombat();

    Dash.activate(cogwerxBaseLegs);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Dash, cogwerxBaseLegs).toHaveCounters(0, "steam");
    expectFabPlayer(Dash).toHaveAP(1);
  });

  it("boundary: Instant is illegal without boosted-this-turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        legs: [cogwerxBaseLegs],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Dash, cogwerxBaseLegs).toHaveCounters(1, "steam");
    Dash.expectActivationRejected(cogwerxBaseLegs);
  });
});
