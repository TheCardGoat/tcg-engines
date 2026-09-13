import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { vynnset } from "../heroes/vynnset.ts";
import { loomingDoomBlue } from "./looming-doom.ts";

/**
 * Looming Doom Blue (DYN175) — Runeblade Action Aura.
 *
 * Printed: When Looming Doom enters the arena, destroy all Runechants you
 * control and put that many doom counters on Looming Doom.
 */

describe("Looming Doom (DYN175) AAA", () => {
  it("happy: entering consumes 3 seated Runechants into 3 doom counters", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [loomingDoomBlue],
        arena: [fabToken("runechant"), fabToken("runechant"), fabToken("runechant")],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.play(loomingDoomBlue);
    game.helpers.resolveUntilIdle();

    expectFabCard(Vynnset, loomingDoomBlue).toBeIn("arena");
    expectFabPlayer(Vynnset).toHaveTokenCount("runechant", 0);
    expectFabCard(Vynnset, loomingDoomBlue).toHaveCounters(3, "doom");
  });

  it("boundary: with no Runechants it enters with 0 counters", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [loomingDoomBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.play(loomingDoomBlue);
    game.helpers.resolveUntilIdle();

    expectFabCard(Vynnset, loomingDoomBlue).toBeIn("arena");
    expectFabCard(Vynnset, loomingDoomBlue).toHaveCounters(0, "doom");
  });
});
