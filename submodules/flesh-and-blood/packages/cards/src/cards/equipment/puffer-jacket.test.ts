import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { hyperDriverBlue } from "../actions/hyper-driver.ts";
import { pufferJacket } from "./puffer-jacket.ts";

/**
 * Puffer Jacket (AMX004) — Mechanologist Chest d2, Temper.
 * Printed: "Non-token Hyper Drivers you control enter the arena with an
 * additional steam counter."
 */

describe("Puffer Jacket (AMX004) AAA", () => {
  it("happy: the Hyper Driver action enters with its base steam plus one more", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        chest: [pufferJacket],
        hand: [hyperDriverBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(hyperDriverBlue);
    // Two standard entry replacements (the driver's own + the jacket's) apply.
    game.untilIdle({ ordering: "listed" });
    expectFabCard(Dash, hyperDriverBlue).toBeIn("arena");
    expectFabCard(Dash, hyperDriverBlue).toHaveCounters(2, "steam");
    expectFabCard(Dash, pufferJacket).toBeIn("chest");
  });

  it("boundary: without the jacket the same driver enters with only its base steam", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [hyperDriverBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(hyperDriverBlue);
    game.untilIdle();

    expectFabCard(Dash, hyperDriverBlue).toBeIn("arena");
    expectFabCard(Dash, hyperDriverBlue).toHaveCounters(1, "steam");
  });
});
