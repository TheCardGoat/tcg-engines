import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { sigilOfEarthBlue } from "./sigil-of-earth.ts";

/**
 * Sigil of Deadwood Blue (ROS070) — Runeblade Action Aura. Go again.
 *
 * Printed: At the beginning of your action phase, destroy this.
 * When this leaves the arena, create a Runechant token.
 */

describe("Sigil of Earth (ROS070) AAA", () => {
  it("happy: destroyed at the next action-phase start, seating a Runechant", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [sigilOfEarthBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(briar);

    Vynnset.play(sigilOfEarthBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Vynnset, sigilOfEarthBlue).toBeIn("arena");

    // Full turn cycle: our end phase, dash's turn, then our action-phase
    // start destroys the sigil and its leaves-arena trigger fires.
    Vynnset.endTurn();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Vynnset, sigilOfEarthBlue).toBeIn("graveyard");
    expectFabPlayer(Vynnset).toHaveTokenCount("embodiment-of-earth", 1);
  });
});
