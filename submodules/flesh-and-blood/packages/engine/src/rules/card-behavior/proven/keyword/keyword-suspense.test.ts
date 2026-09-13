/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: keyword:suspense
 * Representative card: packages/cards/src/cards/instants/act-of-glory.ts
 * Canonical id: gDzD7QkWQPMFTHNmGpHbJ
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
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, superstarBlue, cosmicFlareRed } from "../../../fixtures.ts";

describe("keyword: suspense", () => {
  it("AAA — Arrange: aura with suspense in hand; Act: play it; Assert: enters arena with 2 suspense counters", () => {
    // Arrange — Superstar Blue is an Instant Aura with the suspense keyword.
    // Cost 1, so provide 1 resource.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [superstarBlue], deck: 4, resourcePoints: 1 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);

    // Act — play the aura; the response-free stack resolves and it enters the arena.
    Bravo.play(superstarBlue);

    // Assert — aura is in the arena and has 2 suspense counters.
    expect(Bravo.zone("arena")).toContain(superstarBlue.canonicalId);
    const auraId = Bravo.findCardInZone("arena", superstarBlue);
    expect(auraId).toBeTruthy();
    expect(game.objectState(auraId)?.suspenseCounters).toBe(2);
  });

  it("AAA — CR 8.3.42: suspense counter removed at START of owner's turn, not end phase", () => {
    // Arrange — Superstar Blue is an Instant Aura with the suspense keyword.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [superstarBlue], deck: 4, resourcePoints: 1 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);

    // Act — play the aura; it enters the arena with 2 suspense counters.
    Bravo.play(superstarBlue);
    const auraId = Bravo.findCardInZone("arena", superstarBlue);
    expect(game.objectState(auraId)?.suspenseCounters).toBe(2);

    // End Bravo's turn. CR 8.3.42 removes the counter at the START of Bravo's
    // NEXT turn, NOT at Bravo's end phase — so both counters must persist
    // through the end phase.
    Bravo.endTurn();
    expect(game.objectState(auraId)?.suspenseCounters).toBe(2);

    // Dash passes through their turn back to Bravo.
    game.as(dash).endTurn();

    // Assert — now at the START of Bravo's next turn, exactly one counter is
    // removed, leaving 1 (the aura survives because it is not yet at zero).
    expect(game.objectState(auraId)?.suspenseCounters).toBe(1);
  });

  it("AAA boundary — a non-aura instant does not enter the arena or get suspense counters", () => {
    // Arrange — Cosmic Flare Red is a Lightning Instant (not an Aura, no suspense).
    const game = FabTestEngine.start(
      { hero: bravo, hand: [cosmicFlareRed], deck: 4, resourcePoints: 2 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);

    // Act — play the instant.
    Bravo.play(cosmicFlareRed);
    game.passBoth();

    // Assert — instant resolved and went to graveyard, not arena.
    expect(Bravo.zone("arena")).not.toContain(cosmicFlareRed.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(cosmicFlareRed.canonicalId);
  });
});
