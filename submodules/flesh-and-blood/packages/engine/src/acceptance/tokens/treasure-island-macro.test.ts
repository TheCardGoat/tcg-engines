/**
 * SEA247 Treasure Island — first-attack-per-turn gold counter trigger.
 * CR 1.5.1–1.5.3.
 */
import { describe, expect, it } from "vitest";

import { treasureIsland } from "../../../../cards/src/cards/macros/treasure-island.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../rules/fixtures.ts";

describe("Treasure Island macro (SEA247)", () => {
  it("a1 AAA: first attack each turn puts a gold counter on Treasure Island", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        macros: [treasureIsland],
        hand: [snatchRed],
        deck: 4,
        actionPoints: 1,
      },
      { hero: dash, hand: [nimblismBlue], deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // Verify SEA247 is in Bravo's arena
    expect(Bravo.zone("arena")).toContain(treasureIsland.canonicalId);
    const islandId = Bravo.findCardInZone("arena", treasureIsland);

    // Before attack: no gold counters
    expect(game.objectState(islandId).goldCounters ?? 0).toBe(0);

    // First attack — triggers a1
    Bravo.attackWith(snatchRed);
    Dash.defendWith(nimblismBlue);
    game.helpers.resolveRestOfCombat();

    // After first attack: 1 gold counter
    expect(game.objectState(islandId).goldCounters).toBe(1);

    // Verify the counter is a named "gold" counter on the object
    expect(game.objectState(islandId).goldCounters).toBe(1);
  });
});
