/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: keyword:temper
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
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { equipmentTrainer } from "../../../test-trainers.ts";

describe("keyword: temper", () => {
  it("AAA — Arrange: temper equipment (defense 1) in head zone; Act: defend with it; Assert: −1 counter reduces defense to 0 and equipment is destroyed", () => {
    const eq = equipmentTrainer({
      slug: "temper-helm",
      keywords: [{ name: "temper" }],
      defense: 1,
      zoneSubtype: "Head",
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, life: 20, head: [eq], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    game.as(bravo).attackWith(snatchRed);
    Dash.blockWith(eq);
    game.helpers.resolveRestOfCombat();
    // Def 1 then temper −1 → defense 0 → destroy.
    expect(Dash.zone("head")).not.toContain(eq.canonicalId);
    expect(Dash.zone("graveyard")).toContain(eq.canonicalId);
  });

  it("AAA — boundary: equipment that does not defend is not destroyed and has no counter", () => {
    const eq = equipmentTrainer({
      slug: "temper-safe",
      keywords: [{ name: "temper" }],
      defense: 1,
      zoneSubtype: "Head",
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, life: 20, head: [eq], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const eqId = game.as(dash).findCardInZone("head", eq);
    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).zone("head")).toContain(eq.canonicalId);
    expect(game.objectState(eqId)?.defenseCounterTotal ?? 0).toBe(0);
  });
});
