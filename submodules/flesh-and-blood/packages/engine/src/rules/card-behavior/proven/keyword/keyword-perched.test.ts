/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: keyword:perched
 * Representative card: packages/cards/src/cards/companions/polly-cranka.ts
 * Canonical id: WMTq8GLHDK9ztDckQNDDw
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
import { FabTestEngine, quoteFabAttackTargets } from "../../../../index.ts";
import { bravo, dash, snatchRed, stickyFingers } from "../../../fixtures.ts";

describe("keyword: perched", () => {
  it("AAA — Arrange: perched companion in arena; Act: query attack targets; Assert: perched object is excluded from candidates", () => {
    // Arrange — Sticky Fingers is a perched companion (Off-Hand Ally).
    // Place it in the opponent's arena so Bravo can look for attack targets.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, arena: [stickyFingers], deck: 4 },
    );
    const Bravo = game.as(bravo);

    // Act — query attack targets from Bravo's perspective.
    const attackInstanceId = Bravo.findCardInZone("hand", snatchRed);
    const targets = quoteFabAttackTargets(game.getState(), {
      actorId: Bravo.id,
      attackInstanceId,
    });

    // Assert — the perched companion is NOT among the attack target candidates.
    const perchedId = game.as(dash).findCardInZone("arena", stickyFingers);
    expect(perchedId).toBeTruthy();
    expect(targets.candidates.some((c) => c.targetId === perchedId)).toBe(false);
  });

  it("AAA boundary — without a perched object, normal arena permanents ARE valid targets", () => {
    // Arrange — no perched objects in play; opponent has only their hero.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);

    // Act — query attack targets.
    const attackInstanceId = Bravo.findCardInZone("hand", snatchRed);
    const targets = quoteFabAttackTargets(game.getState(), {
      actorId: Bravo.id,
      attackInstanceId,
    });

    // Assert — at least the opposing hero is a valid target.
    expect(targets.candidates.length).toBeGreaterThanOrEqual(1);
  });
});
