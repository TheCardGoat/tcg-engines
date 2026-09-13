/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: keyword:overpower
 * Representative card: packages/cards/src/cards/actions/over-the-top.ts
 * Canonical id: BRQTgW6LNkTcB7MQFWTNL
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

describe("keyword: overpower", () => {
  it("AAA — Arrange: production combat with an overpower attack and two hand defenders; Act: attempt the illegal block; Assert: the engine rejects a second hand action card", () => {
    const attack = hitTrainer({
      slug: "keyword-overpower",
      keywords: [{ name: "overpower" }],
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
    expect(rejection.errorCode).toBe("overpower");
  });

  it("AAA — boundary: one action-card defender remains legal", () => {
    const attack = hitTrainer({
      slug: "keyword-overpower-single",
      keywords: [{ name: "overpower" }],
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
