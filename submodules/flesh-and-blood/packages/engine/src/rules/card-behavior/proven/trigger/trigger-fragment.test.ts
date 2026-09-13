/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: trigger:fragment
 * Representative card: packages/cards/src/cards/actions/blink-of-an-eye.ts
 * Canonical id: Cmf8GkhNpRqdpkwLg9RnK
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
import { FabTestEngine, expectFabPlayer } from "../../../../index.ts";
import { bravo, dash, frayingLifeforceRed, nimblismBlue } from "../../../fixtures.ts";

describe("trigger: fragment", () => {
  it("Arrange/Act/Assert: a 2-defense block fragments Fraying Lifeforce", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [frayingLifeforceRed, nimblismBlue], life: 20, deck: 6 },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );

    game.as(bravo).play(frayingLifeforceRed, {
      target: game.as(dash).id,
      pitch: [nimblismBlue],
    });
    game.passBoth();
    game.passBoth();
    game.as(dash).blockWith(nimblismBlue);

    expect(game.combat()?.activeLink?.attackPower).toBe(5);
    game.passBoth(); // resolve fragment triggered layer (gain 1 life).
    expectFabPlayer(game.as(bravo)).toHaveLife(21);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(17);
  });

  it("Arrange/Act/Assert: without a qualifying block, fragment does not fire", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [frayingLifeforceRed, nimblismBlue], life: 20, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).play(frayingLifeforceRed, {
      target: game.as(dash).id,
      pitch: [nimblismBlue],
    });
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(bravo)).toHaveLife(20);
    expectFabPlayer(game.as(dash)).toHaveLife(13);
  });
});
