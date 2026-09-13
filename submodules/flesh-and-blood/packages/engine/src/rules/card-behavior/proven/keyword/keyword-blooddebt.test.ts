/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: keyword:bloodDebt
 * Representative card: packages/cards/src/cards/actions/bounding-demigon.ts
 * Canonical id: 8G8jtfKGtQDzMtTd6gFL7
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
import { boundingDemigonRed, bravo, dash, snatchRed } from "../../../fixtures.ts";

describe("keyword: bloodDebt", () => {
  it("AAA — Arrange: real Bounding Demigon banished in the turn player's zone; Act: end the turn; Assert: owner loses 1 life at the beginning of the end phase", () => {
    const game = FabTestEngine.start(
      { hero: bravo, life: 20, hand: [snatchRed], banished: [boundingDemigonRed], deck: 6 },
      { hero: dash, life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);
    expect(Bravo.zone("banished")).toContain(boundingDemigonRed.canonicalId);
    expect(Bravo.life()).toBe(20);

    Bravo.endTurn();
    expect(Bravo.life()).toBe(19);
  });

  it("AAA — boundary: a blood-debt card in hand (not banished) does not deal damage at end phase", () => {
    const game = FabTestEngine.start(
      { hero: bravo, life: 20, hand: [boundingDemigonRed], deck: 6 },
      { hero: dash, life: 20, deck: 6 },
    );
    game.as(bravo).endTurn();
    expect(game.as(bravo).life()).toBe(20);
  });
});
