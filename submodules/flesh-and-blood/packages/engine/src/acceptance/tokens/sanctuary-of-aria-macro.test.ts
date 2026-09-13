/**
 * Source packet — AUA029-a1 (Sanctuary of Aria):
 *
 * Printed promise: "Instant - {r}{r}: Prevent the next 1 damage that would be
 * dealt to you this turn by a source of your choice. Destroy this at the
 * beginning of the end phase."
 * CR: 1.5.1–1.5.3, 4.1.1, 4.1.8.
 * Release Notes — Rosetta + 1st Strike (Macro-specific Notes): each player
 * places Sanctuary in the arena before heroes in Rosetta limited; source choice
 * occurs on activated-layer resolution and the effect is repeatable with {r}{r}.
 * 1v1 decision: in_match_1v1; each player receives a separately controlled
 * ownerless Macro.
 */
import { describe, expect, it } from "vitest";

import { sanctuaryOfAria } from "../../../../cards/src/cards/macros/sanctuary-of-aria.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, snatchRed } from "../../rules/fixtures.ts";

const _LIFE = 40;

describe("Sanctuary of Aria macro (AUA029-a1)", () => {
  it("AAA: controller places and activates Sanctuary which is then destroyed at end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        macros: [sanctuaryOfAria],
        hand: [snatchRed],
        deck: 8,
        resourcePoints: 3,
      },
      { hero: dash, hand: [nimblismBlue], deck: 8 },
    );
    const Bravo = game.as(bravo);

    // Sanctuary is in Bravo's arena
    expect(Bravo.zone("arena")).toContain(sanctuaryOfAria.canonicalId);

    // Activate Sanctuary
    Bravo.activate(sanctuaryOfAria);
    // Resolve any pending decisions (source selection for prevention)
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    // End turn — the delayed destroy at beginning of end phase should fire.
    // Since Sanctuary is a Macro, it ceases to exist rather than going to graveyard.
    Bravo.endTurn();
    game.helpers.resolveUntilIdle();

    // Verify Sanctuary is removed from the game (ceases to exist)
    expect(Bravo.zone("arena")).not.toContain(sanctuaryOfAria.canonicalId);
  });

  it("boundary: activating Sanctuary with insufficient resources fails", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        macros: [sanctuaryOfAria],
        hand: [snatchRed],
        deck: 8,
        resourcePoints: 0,
      },
      { hero: dash, hand: [nimblismBlue], deck: 8 },
    );
    const Bravo = game.as(bravo);

    expect(Bravo.zone("arena")).toContain(sanctuaryOfAria.canonicalId);

    const rejected = Bravo.expectFailure({
      move: "activate",
      payload: {
        instanceId: Bravo.findCardInZone("arena", sanctuaryOfAria),
      },
    });
    expect(rejected.accepted).toBe(false);
  });
});
