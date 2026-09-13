/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: keyword:unlimited
 * Representative card: packages/cards/src/cards/actions/copper-cog.ts
 * Canonical id: kzBc7Bmrk7TfHNwhQK6Lj
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
import { FabTestEngine, baseHasKeyword } from "../../../../index.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { hitTrainer } from "../../../test-trainers.ts";

describe("keyword: unlimited", () => {
  it("AAA — Arrange: trainer card with unlimited keyword; Act: inspect keyword registration; Assert: unlimited meta-keyword registers and card can be played in the engine", () => {
    const card = hitTrainer({
      slug: "unlimited-test",
      keywords: [{ name: "unlimited" as const }],
      power: 4,
    });
    expect(baseHasKeyword(card, "unlimited")).toBe(true);
    // Verify the card is playable in the engine (unlimited is a deckbuilding keyword, not a runtime mechanic).
    const game = FabTestEngine.start(
      { hero: bravo, hand: [card], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
    );
    game.as(bravo).play(card, { target: game.as(dash).id });
    // Card left the hand — play succeeded.
    expect(game.as(bravo).zone("hand")).not.toContain(card.canonicalId);
  });
});
