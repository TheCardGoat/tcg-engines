import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kano } from "../heroes/kano.ts";
import { sigilOfForethoughtBlue } from "./sigil-of-forethought.ts";

/**
 * Sigil of Deadwood Blue (OSC025) — Runeblade Action Aura. Go again.
 *
 * Printed: At the beginning of your action phase, destroy this.
 * When this leaves the arena, create a Runechant token.
 */

describe("Sigil of Forethought (OSC025) AAA", () => {
  it("happy: destroyed at the next action-phase start, seating a Runechant", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [sigilOfForethoughtBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(kano);

    Vynnset.play(sigilOfForethoughtBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Vynnset, sigilOfForethoughtBlue).toBeIn("arena");

    // Full turn cycle: our end phase, dash's turn, then our action-phase
    // start destroys the sigil and its leaves-arena trigger fires.
    Vynnset.endTurn();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Vynnset, sigilOfForethoughtBlue).toBeIn("graveyard");
    expectFabPlayer(Vynnset).toHaveTokenCount("ponder", 1);
  });
});
