/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: keyword:protect
 * Representative card: packages/cards/src/cards/blocks/chivalry.ts
 * Canonical id: WtQz7cpTHPLGqtFLFJwjj
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
import { bravo, cintariSellsword, dash, nimblismBlue, snatchRed } from "../../../fixtures.ts";
import { equipmentTrainer } from "../../../test-trainers.ts";

describe("keyword: protect", () => {
  it("AAA — Arrange: protect equipment and an ally in arena; Act: attack the ally and defend with protect equipment; Assert: protect equipment may defend an attacked ally", () => {
    const protectEq = equipmentTrainer({
      slug: "protect-legs",
      keywords: [{ name: "protect" }],
      defense: 2,
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      {
        hero: dash,
        life: 20,
        legs: [protectEq],
        arena: [cintariSellsword],
        deck: 4,
      },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    const allyId = Dash.findCardInZone("arena", cintariSellsword);
    const eqId = Dash.findCardInZone("legs", protectEq);

    // Target the ally (not the hero).
    game.as(bravo).play(snatchRed, { target: allyId });
    game.passBoth();
    game.passBoth();
    expect(game.combat()?.step).toBe("defend");

    // Protect exception: may declare protect equipment even though ally is attack-target.
    Dash.exec({ move: "defend", payload: { instanceIds: [eqId] } });
    game.helpers.resolveRestOfCombat();

    // Snatch power 4 − protect defense 2 = 2 damage to the ally (health 2) → destroyed.
    expect(Dash.zone("arena")).not.toContain(cintariSellsword.canonicalId);
  });

  it("AAA — boundary: without protect, a normal hand card cannot defend an attacked ally", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue],
        arena: [cintariSellsword],
        deck: 4,
      },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const allyId = game.as(dash).findCardInZone("arena", cintariSellsword);
    game.as(bravo).play(snatchRed, { target: allyId });
    game.passBoth();
    game.passBoth();

    const rejection = game.as(dash).expectFailure({
      move: "defend",
      payload: { instanceIds: [game.as(dash).findCardInZone("hand", nimblismBlue)] },
    });
    expect(rejection.errorCode).toBe("ally_target_no_defend");
  });
});
