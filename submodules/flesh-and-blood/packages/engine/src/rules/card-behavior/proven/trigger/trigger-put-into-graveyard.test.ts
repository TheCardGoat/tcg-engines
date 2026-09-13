/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: trigger:put-into-graveyard
 * Representative card: packages/cards/src/cards/blocks/fiddler-s-green.ts
 * Canonical id: 6dNCtnqWjTwr88JCckKDG
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
import { describe, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabCard, expectFabPlayer } from "../../../../index.ts";
import { fiddlerSGreenRed } from "../../../../../../cards/src/cards/blocks/fiddler-s-green.ts";
import { blues, bravo, dash, nimblismBlue, snatchRed } from "../../../fixtures.ts";

describe("trigger: put-into-graveyard", () => {
  it("AAA: Fiddler's Green block reaches the graveyard at chain close and grants 3 life (CR 6.6.4, 7.7.3)", () => {
    // Arrange: defender holds the block; attacker swings a 4-power action.
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      { hero: bravo, life: 20, hand: [fiddlerSGreenRed, ...blues(2)], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const defender = game.as(bravo);

    // Act: defend with Fiddler's Green and let combat close.
    game.as(dash).attackWith(snatchRed);
    defender.defendWith(fiddlerSGreenRed);
    game.helpers.resolveRestOfCombat();

    // Assert: block went to the graveyard and its trigger restored the damage.
    expectFabCard(defender, fiddlerSGreenRed).toBeIn("graveyard");
    // 20 life - (4 power - 1 defense) + 3 trigger life = 20.
    expectFabPlayer(defender).toHaveLife(20);
    expectCombat(game).toBeClosed();
  });

  it("AAA boundary: a plain block without a graveyard trigger gains no life", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      { hero: bravo, life: 20, hand: [nimblismBlue], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const defender = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    defender.defendWith(nimblismBlue);
    game.helpers.resolveRestOfCombat();

    expectFabCard(defender, nimblismBlue).toBeIn("graveyard");
    // 20 life - (4 power - 2 defense) = 18; no trigger adds life back.
    expectFabPlayer(defender).toHaveLife(18);
  });
});
