import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { cogwerxWorkshopBlue } from "./cogwerx-workshop.ts";

/**
 * Cogwerx Workshop (SEA014) — Mechanologist Action, cost 1.
 * Printed: Create a Golden Cog token. Put a steam counter on up to 2 cogs
 * you control.
 */

describe("Cogwerx Workshop (SEA014) AAA", () => {
  it("happy: creates a Golden Cog and may put steam on it", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [cogwerxWorkshopBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: prism, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(cogwerxWorkshopBlue);
    game.untilIdle({ entityTargets: "maximum" });

    expectFabPlayer(Dash).toHaveTokenCount("golden-cog", 1);
    expectFabCard(Dash, cogwerxWorkshopBlue).toBeIn("graveyard");
  });

  it("boundary: with unpayable resources the play is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [cogwerxWorkshopBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: prism, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    expect(() => Dash.play(cogwerxWorkshopBlue)).toThrow();
    expectFabPlayer(Dash).toHaveTokenCount("golden-cog", 0);
  });

  it("boundary: declining steam still leaves the Golden Cog", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [cogwerxWorkshopBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: prism, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(cogwerxWorkshopBlue);
    game.untilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveTokenCount("golden-cog", 1);
  });
});
