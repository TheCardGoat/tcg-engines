import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { cognitionNodesBlue } from "./cognition-nodes.ts";

describe("Cognition Nodes (ARC018) AAA", () => {
  it("happy: first Action puts a steam counter", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [cognitionNodesBlue, nimblismBlue],
        actionPoints: 2,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(cognitionNodesBlue);
    game.untilIdle();
    Dash.activate(cognitionNodesBlue);
    game.untilIdle();
    expectFabCard(Dash, cognitionNodesBlue).toBeIn("arena");
    expectFabCard(Dash, cognitionNodesBlue).toHaveCounters(1, "steam");
  });

  it("boundary: a second steam Action does not add another counter", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [cognitionNodesBlue, nimblismBlue, nimblismBlue],
        actionPoints: 3,
        resourcePoints: 3,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(cognitionNodesBlue);
    game.untilIdle();
    Dash.activate(cognitionNodesBlue);
    game.untilIdle();
    Dash.activate(cognitionNodesBlue);
    game.untilIdle();
    expectFabCard(Dash, cognitionNodesBlue).toHaveCounters(1, "steam");
  });
});
