import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { cogwerxTinkerRings } from "./cogwerx-tinker-rings.ts";

/**
 * Cogwerx Tinker Rings (SEA008) — Mechanologist Equipment - Arms.
 * (Blade Break)
 * Printed: "When this defends, create a Golden Cog token."
 */

describe("Cogwerx Tinker Rings (SEA008) AAA", () => {
  it("happy: defending with this creates a Golden Cog token", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], arms: [cogwerxTinkerRings], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(cogwerxTinkerRings);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveTokenCount("golden-cog", 1);
  });

  it("boundary: a hand-card-only defense creates nothing", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [nimblismBlue], arms: [cogwerxTinkerRings], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith([nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveTokenCount("golden-cog", 0);
  });

  it("timing: the Golden Cog is created even when the hit is fully blocked", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [nimblismBlue], arms: [cogwerxTinkerRings], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([cogwerxTinkerRings, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveTokenCount("golden-cog", 1);
    expectFabPlayer(Dash).toHaveLife(20);
  });
});
