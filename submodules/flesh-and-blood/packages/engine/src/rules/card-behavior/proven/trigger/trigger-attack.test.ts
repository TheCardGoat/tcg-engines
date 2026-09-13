/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: trigger:attack
 * Representative card: packages/cards/src/cards/actions/creep.ts
 * Canonical id: 77dWGRQb88WqJDbh6dtcd
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
import { bravo, dash, heartOfFyendal, nimblismBlue, packHuntYellow } from "../../../fixtures.ts";

describe("trigger: attack", () => {
  it("AAA: Pack Hunt intimidates the opponent on attack, banishing a random hand card (CR 8.3.30)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [packHuntYellow, nimblismBlue], deck: 6 },
      { hero: dash, hand: [nimblismBlue, heartOfFyendal], deck: 6 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(packHuntYellow, { target: Dash.id, pitch: [nimblismBlue] });
    // The default harness resolves the response-free play and intimidate trigger.

    // Intimidate banishes a random card from Dash's hand face-down.
    expectFabPlayer(Dash).toHaveHandCount(1);
    expect(Dash.zone("banished")).toHaveLength(1);
    expect(game.getState().players[Dash.id]!.intimidatedInstanceIds).toHaveLength(1);
  });

  it("Arrange/Act/Assert: an empty hand does not prevent attack resolution", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [packHuntYellow, nimblismBlue], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );

    game.as(bravo).play(packHuntYellow, { target: game.as(dash).id, pitch: [nimblismBlue] });
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    expect(game.as(dash).zone("banished")).toHaveLength(0);
    expectFabPlayer(game.as(dash)).toHaveLife(15);
  });
});
