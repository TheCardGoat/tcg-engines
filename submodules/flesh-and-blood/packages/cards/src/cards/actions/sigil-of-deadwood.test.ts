import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { vynnset } from "../heroes/vynnset.ts";
import { sigilOfDeadwoodBlue } from "./sigil-of-deadwood.ts";

/**
 * Sigil of Deadwood Blue (AUA025) — Runeblade Action Aura. Go again.
 *
 * Printed: At the beginning of your action phase, destroy this.
 * When this leaves the arena, create a Runechant token.
 */

describe("Sigil of Deadwood (AUA025) AAA", () => {
  it("happy: destroyed at the next action-phase start, seating a Runechant", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [sigilOfDeadwoodBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.play(sigilOfDeadwoodBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Vynnset, sigilOfDeadwoodBlue).toBeIn("arena");

    // Full turn cycle: our end phase, dash's turn, then our action-phase
    // start destroys the sigil and its leaves-arena trigger fires.
    Vynnset.endTurn();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Vynnset, sigilOfDeadwoodBlue).toBeIn("graveyard");
    expectFabPlayer(Vynnset).toHaveTokenCount("runechant", 2); // 1 leaves-arena + 1 from Vynnset own start-of-turn hero ability;
  });
});
