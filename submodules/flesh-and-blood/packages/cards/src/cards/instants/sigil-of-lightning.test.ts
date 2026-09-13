import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { sigilOfLightningBlue } from "./sigil-of-lightning.ts";

/**
 * Sigil of Deadwood Blue (AUA026) — Runeblade Action Aura. Go again.
 *
 * Printed: At the beginning of your action phase, destroy this.
 * When this leaves the arena, create a Runechant token.
 */

describe("Sigil of Lightning (AUA026) AAA", () => {
  it("happy: destroyed at the next action-phase start, seating a Runechant", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [sigilOfLightningBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(briar);

    Vynnset.play(sigilOfLightningBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Vynnset, sigilOfLightningBlue).toBeIn("arena");

    // Full turn cycle: our end phase, dash's turn, then our action-phase
    // start destroys the sigil and its leaves-arena trigger fires.
    Vynnset.endTurn();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Vynnset, sigilOfLightningBlue).toBeIn("graveyard");
    expectFabPlayer(Vynnset).toHaveTokenCount("embodiment-of-lightning", 1);
  });
});
