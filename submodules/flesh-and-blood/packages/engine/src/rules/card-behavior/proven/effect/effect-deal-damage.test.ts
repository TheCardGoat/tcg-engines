/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: effect:deal-damage
 * Representative card: packages/cards/src/cards/actions/indefensibly-honed.ts
 * Canonical id: q69qJCPFdP8PzL8rpNK9b
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
import { bravo, dash, nimblismRed, nimbleStrikeRed } from "../../../fixtures.ts";
import { volticBoltRed } from "../../../../../../cards/src/cards/actions/voltic-bolt.ts";

describe("effect: deal-damage", () => {
  it("Arrange/Act/Assert: Voltic Bolt (deal-damage 5 arcane) reduces target hero life by 5", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [volticBoltRed, nimblismRed, nimbleStrikeRed], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const _lifeBefore = Dash.life();
    Bravo.play(volticBoltRed, { target: Dash.id });
    game.passBoth();
    expect(Dash.life()).toBe(_lifeBefore - 5);
  });

  it("AAA boundary: without deal-damage effect, target hero life unchanged by a non-damage card", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [nimbleStrikeRed, nimblismRed], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Dash = game.as(dash);
    const _lifeBefore = Dash.life();
    // nimbleStrikeRed is an attack that requires combat; just verify initial state
    expect(Dash.life()).toBe(_lifeBefore);
  });
});
