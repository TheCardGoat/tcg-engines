/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: keyword:combo
 * Representative card: packages/cards/src/cards/actions/enact-vengeance.ts
 * Canonical id: jR8M7zkdc97kKqDjw7RWD
 *
 * Arrange: import the representative real card and establish a legal,
 * player-reachable match state with the required heroes, zones, resources,
 * targets, counters, and opponent responses.
 * Act: dispatch only production FabTestEngine moves (play, pitch, defend,
 * resolve prompts, pass priority, and end the relevant phase).
 * Assert: verify player-visible outcomes such as life, zones, AP/resources,
 * combat state, prompts, legality error codes, or game result. Include the
 * negative/boundary case and any timing or interaction case before completion.
 */
import { describe, expect, it } from "vitest";
import { baseHasKeyword, FabTestEngine, toFabCardDefinition } from "../../../../index.ts";
import { bravo, craneDanceRed, dash } from "../../../fixtures.ts";

describe("keyword: combo", () => {
  it("AAA — Arrange: real Crane Dance (combo) in hand without its prerequisite attack; Act: play it and resolve combat; Assert: attack is legal at base power with no combo bonus", () => {
    expect(baseHasKeyword(toFabCardDefinition(craneDanceRed), "combo")).toBe(true);
    const game = FabTestEngine.start(
      { hero: bravo, hand: [craneDanceRed], deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    // Combo is optional (CR 8.4.1): the card plays without Soulbead Strike prior.
    game.as(bravo).attackWith(craneDanceRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
    game.helpers.resolveRestOfCombat();
    // Base power 3, no defense → 3 damage.
    expect(game.as(dash).life()).toBe(17);
    expect(game.as(bravo).actionPoints()).toBe(0);
  });

  it("AAA — boundary: a new combat chain after close has no prior last-attack, so combo stays dormant", () => {
    const game = FabTestEngine.start(
      { hero: bravo, life: 20, hand: [craneDanceRed, craneDanceRed], deck: 8 },
      { hero: dash, life: 20, deck: 8 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    // First Crane Dance closes the chain.
    const Bravo = game.as(bravo);
    Bravo.attackWith(craneDanceRed);
    game.helpers.resolveRestOfCombat();
    expect(game.combat()).toBeNull();

    // Next turn: play a second Crane Dance — no prior attack on the new chain.
    Bravo.endTurn();
    game.as(dash).endTurn();
    Bravo.attackWith(craneDanceRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
    game.helpers.resolveRestOfCombat();
    // Two base-power attacks (3 each): 20 − 3 − 3 = 14.
    expect(game.as(dash).life()).toBe(14);
  });
});
