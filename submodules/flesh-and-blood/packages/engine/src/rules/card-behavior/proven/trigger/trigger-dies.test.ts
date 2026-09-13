/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: trigger:dies
 * Representative card: packages/cards/src/cards/actions/oysten-heart-of-gold.ts
 * Canonical id: fDMt9jWjpCQKJPQbfcpWg
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
import { oystenHeartOfGoldYellow } from "../../../../../../cards/src/cards/actions/oysten-heart-of-gold.ts";
import { FabTestEngine, expectFabCard } from "../../../../index.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";

describe("trigger: dies", () => {
  it("AAA: Oysten creates a Gold token when it dies from combat damage (AGB017)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, arena: [oystenHeartOfGoldYellow], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );

    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const allyId = Dash.findCardInZone("arena", oystenHeartOfGoldYellow);

    // Act — Bravo attacks the Oysten ally (health 1) with snatch (power 4).
    // Dash does not defend, so the attack hits and Oysten dies.
    Bravo.attackWith(snatchRed, { target: allyId });
    game.helpers.resolveRestOfCombat();

    // Assert — Oysten is in the graveyard and a Gold token was created.
    expectFabCard(Dash, oystenHeartOfGoldYellow).toBeIn("graveyard");
    expect(Dash.zone("arena").some((id) => /token:gold/i.test(id))).toBe(true);
  });
});
