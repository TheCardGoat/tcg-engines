import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { levia } from "../heroes/levia.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { bloodHarvest } from "./blood-harvest.ts";

describe("Blood Harvest (IAR005) AAA", () => {
  it("happy: Instant banish from hand gains 3 resources", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [bloodHarvest],
        actionPoints: 0,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.activate(bloodHarvest);
    game.untilIdle({ entityTargets: "minimum" });

    expectFabCard(Levia, bloodHarvest).toBeBanished();
    expectFabPlayer(Levia).toHaveResourceCount(3);
  });

  it("boundary: a leftover hand card is not banished", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [bloodHarvest, nimblismBlue],
        actionPoints: 0,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.activate(bloodHarvest);
    game.untilIdle({ entityTargets: "minimum" });

    expectFabCard(Levia, bloodHarvest).toBeBanished();
    expectFabCard(Levia, nimblismBlue).toBeIn("hand");
    expectFabPlayer(Levia).toHaveResourceCount(3);
  });
});
