import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { oldhim } from "../heroes/oldhim.ts";
import { evergreenRed } from "./evergreen.ts";
import { strengthOfSequoiaRed } from "./strength-of-sequoia.ts";

/**
 * Strength of Sequoia (ELE028) — Elemental Guardian Action Aura, cost 2.
 * Printed: Earth Fusion. Go again. When this enters the arena, if it was fused,
 * create a Seismic Surge token. At the beginning of your action phase, destroy
 * this then the next attack action card you play this turn gains +3{p}.
 */

describe("Strength of Sequoia family AAA", () => {
  it("happy: fused enter-arena creates a Seismic Surge token", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [strengthOfSequoiaRed, evergreenRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);

    Oldhim.play(strengthOfSequoiaRed, { fuse: true, fuseCards: [evergreenRed] });
    game.helpers.resolveUntilIdle();

    expectFabCard(Oldhim, strengthOfSequoiaRed).toBeIn("arena");
    expectFabPlayer(Oldhim).toHaveTokenCount("seismic-surge", 1);
  });

  it("boundary: without fusion, no Seismic Surge is created", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [strengthOfSequoiaRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);

    Oldhim.play(strengthOfSequoiaRed);
    game.helpers.resolveUntilIdle();

    expectFabCard(Oldhim, strengthOfSequoiaRed).toBeIn("arena");
    expectFabPlayer(Oldhim).toHaveTokenCount("seismic-surge", 0);
  });

  it("timing: at the beginning of your next action phase this is destroyed", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [strengthOfSequoiaRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);

    Oldhim.play(strengthOfSequoiaRed);
    game.helpers.resolveUntilIdle();
    expectFabCard(Oldhim, strengthOfSequoiaRed).toBeIn("arena");

    Oldhim.endTurn();
    game.helpers.resolveUntilIdle();
    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Oldhim, strengthOfSequoiaRed).toBeIn("graveyard");
  });
});
