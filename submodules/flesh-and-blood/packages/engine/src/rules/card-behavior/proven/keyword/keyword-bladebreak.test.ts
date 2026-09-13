/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: keyword:bladeBreak
 * Representative card: packages/cards/src/cards/equipment/rage-baiters.ts
 * Canonical id: z6fz9gMGF7DDJWfj7D6Wp
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
import { bravo, dash, ironrotHelm, snatchRed } from "../../../fixtures.ts";

describe("keyword: bladeBreak", () => {
  it("AAA — Arrange: real Ironrot Helm in the head zone; Act: defend with it; Assert: blade break moves it to the graveyard", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, life: 20, head: [ironrotHelm], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const id = game.as(dash).findCardInZone("head", ironrotHelm);
    game.as(bravo).attackWith(snatchRed);
    game.as(dash).exec({ move: "defend", payload: { instanceIds: [id] } });
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).zone("head")).not.toContain(ironrotHelm.canonicalId);
    expect(game.as(dash).zone("graveyard")).toContain(ironrotHelm.canonicalId);
  });

  it("AAA — boundary: equipment that does not defend is not destroyed", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, life: 20, head: [ironrotHelm], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).zone("head")).toContain(ironrotHelm.canonicalId);
  });
});
