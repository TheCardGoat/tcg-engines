import { describe, expect, it } from "vitest";

import { createOpeningFixtureState } from "./fixtures";
import { reduceFabPresentationState } from "./state";

describe("reduceFabPresentationState", () => {
  it("draws from deck into hand", () => {
    const state = createOpeningFixtureState();
    const next = reduceFabPresentationState(state, {
      type: "draw",
      ownerId: "player-1",
      count: 1,
    });
    const hand = Object.values(next.cards).filter(
      (c) => c.ownerId === "player-1" && c.zone === "hand",
    );
    const deck = Object.values(next.cards).filter(
      (c) => c.ownerId === "player-1" && c.zone === "deck",
    );
    expect(hand.length).toBe(
      Object.values(state.cards).filter((c) => c.ownerId === "player-1" && c.zone === "hand")
        .length + 1,
    );
    expect(deck.length).toBe(
      Object.values(state.cards).filter((c) => c.ownerId === "player-1" && c.zone === "deck")
        .length - 1,
    );
  });

  it("pitches active player hand card", () => {
    const state = createOpeningFixtureState();
    const card = Object.values(state.cards).find(
      (c) => c.ownerId === "player-1" && c.zone === "hand",
    )!;
    const next = reduceFabPresentationState(state, { type: "pitch_card", cardId: card.id });
    expect(next.cards[card.id]?.zone).toBe("pitch");
  });

  it("ends turn and clears combat", () => {
    const state = createOpeningFixtureState();
    const next = reduceFabPresentationState(state, { type: "end_turn" });
    expect(next.activePlayerId).toBe("player-2");
    expect(next.turnNumber).toBe(state.turnNumber + 1);
    expect(next.combat).toBeNull();
  });
});
