/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: keyword:ambush
 * Representative card: packages/cards/src/cards/actions/stadium-security.ts
 * Canonical id: zdgHmFzPbHbrhRwfCqF8H
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
import { bravo, dash, nimblismBlue, snatchRed } from "../../../fixtures.ts";
import { hitTrainer } from "../../../test-trainers.ts";

describe("keyword: ambush", () => {
  it("AAA — Arrange: ambush card in arsenal; Act: attack and defend from arsenal; Assert: ambush card defends and reduces damage", () => {
    const ambushCard = {
      ...hitTrainer({
        slug: "ambush-def",
        keywords: [{ name: "ambush" }],
        power: 2,
      }),
      defense: 3,
    };
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, life: 20, arsenal: [ambushCard], deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    const ambushId = Dash.findCardInZone("arsenal", ambushCard);
    game.as(bravo).attackWith(snatchRed);
    Dash.exec({ move: "defend", payload: { instanceIds: [ambushId] } });
    game.helpers.resolveRestOfCombat();
    // Snatch power 4 − ambush defense 3 = 1 damage.
    expect(Dash.life()).toBe(19);
    expect(Dash.zone("arsenal")).toHaveLength(0);
  });

  it("AAA — boundary: arsenal card without ambush cannot defend (engine rejects with card_not_in_hand)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, life: 20, arsenal: [nimblismBlue], deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    const id = Dash.findCardInZone("arsenal", nimblismBlue);
    game.as(bravo).attackWith(snatchRed);
    const rejection = Dash.expectFailure({
      move: "defend",
      payload: { instanceIds: [id] },
    });
    expect(rejection.errorCode).toBe("card_not_in_hand");
  });
});
