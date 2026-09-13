/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: keyword:dominate
 * Representative card: packages/cards/src/cards/actions/stone-rain.ts
 * Canonical id: LknHqj6JMJ6CRNpDNBtHG
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

describe("keyword: dominate", () => {
  it("AAA — Arrange: dominate attack with a defender holding two hand cards; Act: attempt to defend with both; Assert: engine rejects the second hand card with dominate error", () => {
    const attack = hitTrainer({
      slug: "keyword-dominate",
      keywords: [{ name: "dominate" }],
      power: 6,
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [attack], deck: 6 },
      { hero: dash, life: 20, hand: [snatchRed, nimblismBlue], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(attack);

    const rejection = game.as(dash).expectBlockRejected([snatchRed, nimblismBlue]);
    expect(rejection.errorCode).toBe("dominate");
  });

  it("AAA — boundary: a single hand-card defender remains legal under dominate", () => {
    const attack = hitTrainer({
      slug: "keyword-dominate-single",
      keywords: [{ name: "dominate" }],
      power: 5,
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [attack], deck: 6 },
      { hero: dash, life: 20, hand: [nimblismBlue], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(attack);
    game.as(dash).defendWith(nimblismBlue);
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBe(17);
  });
});
