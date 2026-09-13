/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: keyword:battleworn
 * Representative card: packages/cards/src/cards/equipment/prey-spotters.ts
 * Canonical id: 9Rc87J7TGt8DWffqnKjCf
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
import { bravo, dash, scabskinLeathers, snatchRed } from "../../../fixtures.ts";

describe("keyword: battleworn", () => {
  it("AAA — Arrange: real Scabskin Leathers in the legs zone; Act: defend with it; Assert: one −1 defense counter after combat closes", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, life: 20, legs: [scabskinLeathers], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    const id = Dash.findCardInZone("legs", scabskinLeathers);
    game.as(bravo).attackWith(snatchRed);
    Dash.blockWith(scabskinLeathers);
    game.helpers.resolveRestOfCombat();
    expect(game.objectState(id)?.defenseCounterTotal).toBe(-1);
    expect(Dash.zone("legs")).toContain(scabskinLeathers.canonicalId);
  });

  it("AAA — boundary: equipment that does not defend receives no battleworn counter", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, life: 20, legs: [scabskinLeathers], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const id = game.as(dash).findCardInZone("legs", scabskinLeathers);
    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(game.objectState(id)?.defenseCounterTotal ?? 0).toBe(0);
  });
});
