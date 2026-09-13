import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { tuffnut } from "../heroes/tuffnut.ts";
import { pleiadesSuperstar } from "../heroes/pleiades-superstar.ts";
import { superstarBlue } from "./superstar.ts";

/**
 * Superstar Blue (APS024) — Revered Guardian Instant Aura, suspense.
 *
 * Printed: When this enters or leaves the arena, the crowd cheers you.
 */

describe("Superstar (APS024) AAA", () => {
  it("happy: entering the arena cheers you (Pleiades mints Confidence)", () => {
    const game = FabTestEngine.start(
      {
        hero: pleiadesSuperstar,
        hand: [superstarBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Pleiades = game.as(pleiadesSuperstar);

    Pleiades.play(superstarBlue);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabCard(Pleiades, superstarBlue).toBeIn("arena");
    expectFabPlayer(Pleiades).toHaveTokenCount("confidence", 1);
  });

  it("boundary: without Superstar, playing nothing does not cheer", () => {
    const game = FabTestEngine.start(
      { hero: pleiadesSuperstar, actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    expectFabPlayer(game.as(pleiadesSuperstar)).toHaveTokenCount("confidence", 0);
  });

  it("timing: the crowd cheers you, not the opponent", () => {
    const game = FabTestEngine.start(
      {
        hero: pleiadesSuperstar,
        hand: [superstarBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: tuffnut, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Pleiades = game.as(pleiadesSuperstar);

    Pleiades.play(superstarBlue);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabPlayer(Pleiades).toHaveTokenCount("confidence", 1);
    expectFabPlayer(game.as(tuffnut)).toHaveTokenCount("toughness", 0);
  });
});
