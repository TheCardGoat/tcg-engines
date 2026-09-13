import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { oldhim } from "../heroes/oldhim.ts";
import { blizzardBlue } from "../instants/blizzard.ts";
import { emergingAvalancheRed } from "./emerging-avalanche.ts";

/**
 * Emerging Avalanche (ELE025) — Elemental Guardian Action Aura, cost 2.
 * Printed: Ice Fusion. Go again. When this enters the arena, if it was fused,
 * create a Frostbite token under target hero control. At the beginning of your
 * action phase, destroy this then the next attack action card you play this
 * turn gains +3{p}.
 */

describe("Emerging Avalanche family AAA", () => {
  it("happy: fused enter-arena creates a Frostbite under the targeted hero", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [emergingAvalancheRed, blizzardBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);
    const Dash = game.as(dash);

    Oldhim.play(emergingAvalancheRed, { fuse: true, fuseCards: [blizzardBlue] });
    game.untilIdle({ entityTargets: "pause" });
    Oldhim.target(Dash);
    game.untilIdle();

    expectFabCard(Oldhim, emergingAvalancheRed).toBeIn("arena");
    expectFabPlayer(Dash).toHaveTokenCount("frostbite", 1);
    expectFabPlayer(Oldhim).toHaveTokenCount("frostbite", 0);
  });

  it("boundary: without fusion, no Frostbite is created", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [emergingAvalancheRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);

    Oldhim.play(emergingAvalancheRed);
    game.helpers.resolveUntilIdle();

    expectFabCard(Oldhim, emergingAvalancheRed).toBeIn("arena");
    expectFabPlayer(Oldhim).toHaveTokenCount("frostbite", 0);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("frostbite", 0);
  });

  it("timing: at the beginning of your next action phase this is destroyed", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [emergingAvalancheRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);

    Oldhim.play(emergingAvalancheRed);
    game.helpers.resolveUntilIdle();
    expectFabCard(Oldhim, emergingAvalancheRed).toBeIn("arena");

    Oldhim.endTurn();
    game.helpers.resolveUntilIdle();
    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Oldhim, emergingAvalancheRed).toBeIn("graveyard");
  });
});
