/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: keyword:guardwell
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
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { equipmentTrainer } from "../../../test-trainers.ts";

describe("keyword: guardwell", () => {
  it("AAA — Arrange: guardwell equipment (defense 2) in the legs zone; Act: defend with it; Assert: −1 defense counters equal to printed defense (2)", () => {
    const eq = equipmentTrainer({
      slug: "guardwell-legs",
      keywords: [{ name: "guardwell" }],
      defense: 2,
      zoneSubtype: "Legs",
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, life: 20, legs: [eq], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const eqId = Dash.card(eq);
    Bravo.attackWith(snatchRed);
    Dash.defendWith(eq);
    game.helpers.resolveRestOfCombat();
    expect(Dash.zone("legs")).toContain(eq.canonicalId);
    expect(game.objectState(eqId)?.defenseCounterTotal).toBe(-2);
  });

  it("AAA — boundary: equipment that does not defend receives no guardwell counters", () => {
    const eq = equipmentTrainer({
      slug: "guardwell-edge",
      keywords: [{ name: "guardwell" }],
      defense: 2,
      zoneSubtype: "Legs",
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, life: 20, legs: [eq], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const eqId = game.as(dash).card(eq);
    Bravo.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(game.objectState(eqId)?.defenseCounterTotal ?? 0).toBe(0);
  });
});
