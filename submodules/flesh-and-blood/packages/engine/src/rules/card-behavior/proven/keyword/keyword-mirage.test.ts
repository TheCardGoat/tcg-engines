/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: keyword:mirage
 * Representative card: packages/cards/src/cards/defense-reactions/flicker-trick.ts
 * Canonical id: kCKqHQb8W96FJTWqnNhCj
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
import { bravo, dash, nimblismBlue, regurgitatingSlogRed, snatchRed } from "../../../fixtures.ts";
import { equipmentTrainer } from "../../../test-trainers.ts";

describe("keyword: mirage", () => {
  it("AAA — Arrange: mirage equipment in legs zone and a 6+ power attack incoming; Act: defend with mirage equipment; Assert: mirage equipment is destroyed after defending against 6+ power", () => {
    const mirageEq = equipmentTrainer({
      slug: "mirage-legs",
      keywords: [{ name: "mirage" }],
      defense: 2,
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [regurgitatingSlogRed, nimblismBlue], deck: 6 },
      { hero: dash, life: 20, legs: [mirageEq], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    const eqId = Dash.findCardInZone("legs", mirageEq);
    game.as(bravo).play(regurgitatingSlogRed, {
      target: Dash.id,
      pitch: [nimblismBlue],
    });
    game.passBoth();
    game.passBoth();
    Dash.exec({ move: "defend", payload: { instanceIds: [eqId] } });
    game.helpers.resolveRestOfCombat();
    expect(Dash.zone("legs")).not.toContain(mirageEq.canonicalId);
    expect(Dash.zone("graveyard")).toContain(mirageEq.canonicalId);
  });

  it("AAA — boundary: a low-power attack (power 4) does not destroy mirage defender", () => {
    const mirageEq = equipmentTrainer({
      slug: "mirage-safe",
      keywords: [{ name: "mirage" }],
      defense: 2,
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, life: 20, legs: [mirageEq], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    game.as(bravo).attackWith(snatchRed);
    Dash.blockWith(mirageEq);
    game.helpers.resolveRestOfCombat();
    expect(Dash.zone("legs")).toContain(mirageEq.canonicalId);
  });
});
