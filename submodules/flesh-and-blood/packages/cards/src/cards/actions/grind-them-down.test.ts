import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { grindThemDownRed } from "./grind-them-down.ts";

/**
 * Grind Them Down Red (MPG079) — Guardian Attack Action.
 *
 * Printed: Crush - When this deals 4 or more damage to a hero, destroy the
 * top card of their deck.
 */

describe("Grind Them Down family AAA", () => {
  it("happy: a 6-damage hit mills the defender deck top", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [grindThemDownRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [snatchRed],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed],
        life: 20,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(grindThemDownRed);
    Dash.defendWith();
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: snatchRed.canonicalId });

    expectFabPlayer(Dash).toHaveLife(13); // 20 - 7
    // The Crush rider mills exactly the deck top (4 -> 3, card in GY).
    expect(Dash.zone("deck")).toHaveLength(3);
    expect(Dash.zone("graveyard")).toContain(snatchRed.canonicalId);
  });
});
