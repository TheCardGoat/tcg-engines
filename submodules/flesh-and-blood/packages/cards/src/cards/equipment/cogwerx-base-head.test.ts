import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { throttleRed } from "../actions/throttle.ts";
import { cogwerxBaseHead } from "./cogwerx-base-head.ts";

describe("Cogwerx Base Head (EVO014) AAA", () => {
  it("happy: seating puts a steam counter; after boost, Instant shuffles a Mechanologist attack from banished", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [cogwerxBaseHead],
        hand: [throttleRed],
        banished: [throttleRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Dash, cogwerxBaseHead).toBeIn("head");
    expectFabCard(Dash, cogwerxBaseHead).toHaveCounters(1, "steam");

    Dash.play(throttleRed, { boost: true });
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });
    game.helpers.resolveRestOfCombat();

    Dash.activate(cogwerxBaseHead);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Dash, cogwerxBaseHead).toHaveCounters(0, "steam");
    expect(
      Dash.zone("banished").filter((id) => id.includes("throttle")).length,
    ).toBeLessThanOrEqual(1);
  });

  it("boundary: Instant is illegal without boosted-this-turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [cogwerxBaseHead],
        banished: [throttleRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Dash, cogwerxBaseHead).toHaveCounters(1, "steam");
    Dash.expectActivationRejected(cogwerxBaseHead);
  });
});
