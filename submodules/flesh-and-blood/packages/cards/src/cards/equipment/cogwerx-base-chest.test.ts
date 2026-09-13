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
import { cogwerxBaseChest } from "./cogwerx-base-chest.ts";

describe("Cogwerx Base Chest (EVO015) AAA", () => {
  it("happy: seating puts a steam counter; after boost, Instant nets +1{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        chest: [cogwerxBaseChest],
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

    expectFabCard(Dash, cogwerxBaseChest).toBeIn("chest");
    expectFabCard(Dash, cogwerxBaseChest).toHaveCounters(1, "steam");

    Dash.play(throttleRed, { boost: true });
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });
    game.helpers.resolveRestOfCombat();

    Dash.activate(cogwerxBaseChest);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Dash, cogwerxBaseChest).toHaveCounters(0, "steam");
    expectFabPlayer(Dash).toHaveResourceCount(2);
  });

  it("boundary: Instant is illegal without boosted-this-turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        chest: [cogwerxBaseChest],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Dash, cogwerxBaseChest).toHaveCounters(1, "steam");
    Dash.expectActivationRejected(cogwerxBaseChest);
  });
});
