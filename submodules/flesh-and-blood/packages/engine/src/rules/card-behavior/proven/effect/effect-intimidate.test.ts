/**
 * AAA test for effect: intimidate.
 * Representative card: Bad Breath Red (PEN306) — Reviled Action, cost 0.
 * Resolution effect: "Intimidate target hero." → { type: "intimidate", target: "any" }.
 * In a 2-player game, "any" resolves to the single opponent.
 */
import { describe, expect, it } from "vitest";
import {
  createFabMatchContext,
  FabTestEngine,
  expectFabPlayer,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
} from "../../../../index.ts";
import { badBreathRed, bravo, dash, nimblismBlue } from "../../../fixtures.ts";

describe("effect: intimidate", () => {
  it("Arrange/Act/Assert: Bad Breath intimidates target hero, banishing a random hand card face-down", () => {
    // Arrange — Dash has 2 cards in hand to intimidate from.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [badBreathRed], deck: 4 },
      { hero: dash, hand: [nimblismBlue, nimblismBlue], deck: 4 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // Act — Play Bad Breath (cost 0). Intimidate fires as the response-free
    // stack resolves under the default harness policy.
    Bravo.play(badBreathRed);

    // Assert — One random card banished face-down; hand reduced by 1.
    expectFabPlayer(Dash).toHaveHandCount(1);
    expect(Dash.zone("banished")).toHaveLength(1);
    expect(game.getState().players[Dash.id]!.intimidatedInstanceIds).toHaveLength(1);
    expect(game.getState().players[Bravo.id]!.history.turn.intimidatesThisTurn).toBe(1);
    expect(game.committedEvents().filter((event) => event.name === "intimidate")).toHaveLength(1);
  });

  it("AAA boundary: without intimidate effect, target hero's hand unchanged", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [nimblismBlue], deck: 4 },
      { hero: dash, hand: [nimblismBlue], deck: 4 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const handBefore = Dash.handCount();
    Bravo.play(nimblismBlue);
    expect(Dash.handCount()).toBe(handBefore);
  });

  it("AAA boundary: intimidate against an empty hand banishes nothing", () => {
    // Arrange — Dash has an empty hand.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [badBreathRed], deck: 4, intellect: 0 },
      { hero: dash, hand: [], deck: 4, intellect: 0 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // Act — Play Bad Breath; the response-free stack resolves (intimidate fires).
    Bravo.play(badBreathRed);

    // Assert — No card banished, no intimidated instance IDs.
    expect(Dash.zone("banished")).toHaveLength(0);
    expect(game.getState().players[Dash.id]!.intimidatedInstanceIds).toHaveLength(0);
    expect(game.getState().players[Bravo.id]!.history.turn.intimidatesThisTurn).toBe(1);
    expect(game.committedEvents().filter((event) => event.name === "intimidate")).toHaveLength(1);
  });

  it("counts multiple intimidates, survives a snapshot round-trip, and resets next turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [badBreathRed, badBreathRed],
        deck: 4,
        actionPoints: 2,
        intellect: 0,
      },
      { hero: dash, hand: [nimblismBlue, nimblismBlue], deck: 4, intellect: 0 },
    );
    const Bravo = game.as(bravo);

    Bravo.play(badBreathRed);
    Bravo.play(badBreathRed);

    const state = game.getState();
    expect(state.players[Bravo.id]!.history.turn.intimidatesThisTurn).toBe(2);
    const snapshot = serializeFabMatchSnapshot(state);
    const restored = restoreFabMatchSnapshot(
      snapshot,
      createFabMatchContext(state.cardDefinitions, state.publicCardIdentities),
    );
    expect(restored.players[Bravo.id]!.history.turn.intimidatesThisTurn).toBe(2);

    Bravo.endTurn();
    expect(game.getState().players[Bravo.id]!.history.turn.intimidatesThisTurn).toBe(0);
  });
});
