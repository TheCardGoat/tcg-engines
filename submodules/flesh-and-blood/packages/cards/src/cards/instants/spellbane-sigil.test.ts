import { describe, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { auroraShootingStar } from "../heroes/aurora-shooting-star.ts";
import { spellbaneSigilBlue } from "./spellbane-sigil.ts";

/**
 * Spellbane Sigil (OMN201) — Lightning Instant Aura, Arcane Barrier X.
 *
 * Printed: At the beginning of your action phase, destroy this.
 */

describe("Spellbane Sigil (OMN201) AAA", () => {
  it("happy: destroyed at the beginning of your next action phase", () => {
    const game = FabTestEngine.start(
      { hero: auroraShootingStar, hand: [spellbaneSigilBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Aurora = game.as(auroraShootingStar);

    Aurora.play(spellbaneSigilBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Aurora, spellbaneSigilBlue).toBeIn("arena");

    Aurora.endTurn();
    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Aurora, spellbaneSigilBlue).toBeIn("graveyard");
  });

  it("boundary: it stays in the arena through the opponent's turn", () => {
    const game = FabTestEngine.start(
      { hero: auroraShootingStar, hand: [spellbaneSigilBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Aurora = game.as(auroraShootingStar);

    Aurora.play(spellbaneSigilBlue);
    game.helpers.resolveUntilIdle();
    Aurora.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Aurora, spellbaneSigilBlue).toBeIn("arena");
  });

  it("timing: playing it does not consume an action point (Instant)", () => {
    const game = FabTestEngine.start(
      { hero: auroraShootingStar, hand: [spellbaneSigilBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Aurora = game.as(auroraShootingStar);

    Aurora.play(spellbaneSigilBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Aurora, spellbaneSigilBlue).toBeIn("arena");
  });
});
