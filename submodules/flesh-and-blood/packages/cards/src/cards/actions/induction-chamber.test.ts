import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { inductionChamberRed } from "./induction-chamber.ts";

describe("Induction Chamber (ARC010) AAA", () => {
  it("happy: first Action puts a steam counter", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [inductionChamberRed, nimblismBlue],
        actionPoints: 2,
        resourcePoints: 3,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(inductionChamberRed);
    game.untilIdle();
    Dash.activate(inductionChamberRed);
    game.untilIdle();
    expectFabCard(Dash, inductionChamberRed).toBeIn("arena");
    expectFabCard(Dash, inductionChamberRed).toHaveCounters(1, "steam");
  });

  it("boundary: a second steam Action does not add another counter", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [inductionChamberRed, nimblismBlue, nimblismBlue],
        actionPoints: 3,
        resourcePoints: 4,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(inductionChamberRed);
    game.untilIdle();
    Dash.activate(inductionChamberRed);
    game.untilIdle();
    Dash.activate(inductionChamberRed);
    game.untilIdle();
    expectFabCard(Dash, inductionChamberRed).toHaveCounters(1, "steam");
  });
});
