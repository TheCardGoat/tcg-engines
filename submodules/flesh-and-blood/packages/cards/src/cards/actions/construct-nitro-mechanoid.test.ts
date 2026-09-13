import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { constructNitroMechanoidYellow } from "./construct-nitro-mechanoid.ts";

describe("Construct Nitro Mechanoid (DYN092) AAA", () => {
  it("boundary: without the transform pieces the Action still plays", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [constructNitroMechanoidYellow],
        actionPoints: 1,
        resourcePoints: 4,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    expect(() => Dash.play(constructNitroMechanoidYellow)).toThrow(/had no legal target/);
    expectFabCard(Dash, constructNitroMechanoidYellow).toBeIn("hand");
  });

  it("happy: seating keeps the Construct in hand before play", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [constructNitroMechanoidYellow], deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    expectFabCard(game.as(dash), constructNitroMechanoidYellow).toBeIn("hand");
  });
});
