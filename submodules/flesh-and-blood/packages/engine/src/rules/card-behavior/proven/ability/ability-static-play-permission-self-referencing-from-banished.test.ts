/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: static play-permission from banished zone.
 *
 * Two permission shapes are covered:
 *  - Self-referencing (DTD170 Chains of Mephetis): the card in banished
 *    hosts its own play-permission ability.
 *  - External-granter (TCC001 Professor Teklovossen): the hero in the arena
 *    grants play-permission to Evo cards in the controller's banished zone.
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
import { chainsOfMephetisBlue } from "../../../../../../cards/src/cards/actions/chains-of-mephetis.ts";
import { professorTeklovossen } from "../../../../../../cards/src/cards/heroes/professor-teklovossen.ts";

describe("static play permission: self-referencing from banished", () => {
  it("AAA — DTD170 Chains of Mephetis can be played from banished via self-referencing permission", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: 20,
        banished: [chainsOfMephetisBlue],
        hand: [],
        deck: 4,
        resourcePoints: 0,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    // The self-referencing static play-permission allows begin-play from banished.
    game.as(bravo).play(chainsOfMephetisBlue, { from: "banished" });
    game.passBoth();
    // DTD170 is an Action Aura — it enters the arena after resolution.
    expect(game.as(bravo).zone("arena")).toContain(chainsOfMephetisBlue.canonicalId);
    // Cost 0 — no resources spent.
    expect(game.as(bravo).resourcePoints()).toBe(0);
  });

  it("AAA — boundary: a card without play-permission in banished cannot be played from banished", () => {
    const game = FabTestEngine.start(
      { hero: bravo, life: 20, banished: [snatchRed], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const banId = game.as(bravo).findCardInZone("banished", snatchRed);
    const rej = game.as(bravo).expectFailure({
      move: "begin-play",
      payload: { instanceId: banId, from: "banished", target: game.as(dash).id },
    });
    expect(rej.errorCode).toBe("unsupported_play_permission");
  });
});

describe("static play permission: external-granter (TCC001)", () => {
  it("AAA — TCC001 Professor Teklovossen grants Evo play from banished", () => {
    const evoAction = {
      canonicalId: "trainer-evo-action",
      types: ["Mechanologist", "Action", "Evo"],
      cost: 0,
    };
    const game = FabTestEngine.start(
      {
        hero: professorTeklovossen,
        life: 20,
        banished: [evoAction],
        hand: [],
        deck: 4,
        resourcePoints: 0,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    // The hero's "You may play Evos from your banished zone" permission allows it.
    game.as(professorTeklovossen).play(evoAction, { from: "banished" });
    game.passBoth();
    // Non-attack Action resolves to the graveyard.
    expect(game.as(professorTeklovossen).zone("graveyard")).toContain(evoAction.canonicalId);
  });

  it("AAA — boundary: Evo card in banished cannot be played without TCC001 hero", () => {
    const evoAction = {
      canonicalId: "trainer-evo-action-no-perm",
      types: ["Mechanologist", "Action", "Evo"],
      cost: 0,
    };
    const game = FabTestEngine.start(
      { hero: bravo, life: 20, banished: [evoAction], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const banId = game.as(bravo).findCardInZone("banished", evoAction);
    const rej = game.as(bravo).expectFailure({
      move: "begin-play",
      payload: { instanceId: banId, from: "banished", target: game.as(dash).id },
    });
    expect(rej.errorCode).toBe("unsupported_play_permission");
  });
});
