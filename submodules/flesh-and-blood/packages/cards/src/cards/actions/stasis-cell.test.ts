import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { robeOfRapture } from "../equipment/robe-of-rapture.ts";
import { stasisCellBlue } from "./stasis-cell.ts";

describe("Stasis Cell (EVO073) AAA", () => {
  it("happy: Action bottoms this and restricts the chosen equipment from defending", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [stasisCellBlue],
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, chest: [robeOfRapture], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.play(stasisCellBlue);
    game.untilIdle({ entityTargets: "minimum" });
    Dash.activate(stasisCellBlue);
    game.untilIdle({ entityTargets: "minimum" });
    expect(Dash.zone("deck")).toContain(stasisCellBlue.canonicalId);
  });

  it("boundary: with 0 action points after play the Action is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [stasisCellBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.play(stasisCellBlue);
    game.untilIdle({ entityTargets: "minimum" });
    Dash.expectActivationRejected(stasisCellBlue);
    expectFabCard(Dash, stasisCellBlue).toBeIn("arena");
  });
});
