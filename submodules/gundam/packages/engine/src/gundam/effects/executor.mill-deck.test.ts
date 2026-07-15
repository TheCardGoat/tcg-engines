/**
 * `millDeck` EffectAction — "Place the top N cards of X's deck into X's trash."
 *
 * Covers owner resolution (`self` vs `opponent`) + the short-deck safety
 * behaviour (clamp to remaining deck size, never crash). Printed-card
 * anchor: Freeden (GD02-127) 【Destroyed】 mills 2 of your own deck.
 */

import { describe, it, expect } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import {
  createMockUnit,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
} from "../../index.ts";

function millEffect(count: number, owner: "self" | "opponent"): CardEffect {
  return {
    type: "activated",
    activation: { timing: ["activate:main"] },
    directives: [{ action: { action: "millDeck", count, owner } }],
    sourceText: `Place the top ${count} cards of ${owner} deck into trash.`,
  };
}

describe("executor — millDeck", () => {
  it("owner=self mills the source controller's deck into their trash", () => {
    const miller = createMockUnit({ effects: [millEffect(3, "self")] });
    const engine = GundamTestEngine.create({ play: [miller], deck: 10 }, { deck: 10 });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const millerId = p1.getCardsInZone("battleArea")[0]!;
    const p1DeckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });
    const p1TrashBefore = engine.getCardCount({ zone: "trash", playerId: PLAYER_ONE });
    const p2DeckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_TWO });

    expectSuccess(p1.activateAbility(millerId, 0));

    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(p1DeckBefore - 3);
    expect(engine.getCardCount({ zone: "trash", playerId: PLAYER_ONE })).toBe(p1TrashBefore + 3);
    // Opponent deck untouched.
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_TWO })).toBe(p2DeckBefore);
  });

  it("owner=opponent mills the opposing player's deck into their trash", () => {
    const miller = createMockUnit({ effects: [millEffect(2, "opponent")] });
    const engine = GundamTestEngine.create({ play: [miller], deck: 10 }, { deck: 10 });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const millerId = p1.getCardsInZone("battleArea")[0]!;
    const p1DeckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });
    const p2DeckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_TWO });
    const p2TrashBefore = engine.getCardCount({ zone: "trash", playerId: PLAYER_TWO });

    expectSuccess(p1.activateAbility(millerId, 0));

    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_TWO })).toBe(p2DeckBefore - 2);
    expect(engine.getCardCount({ zone: "trash", playerId: PLAYER_TWO })).toBe(p2TrashBefore + 2);
    // Source controller's own deck untouched.
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(p1DeckBefore);
  });

  it("mills a short deck and immediately awards the game to the opponent", () => {
    const miller = createMockUnit({ effects: [millEffect(5, "self")] });
    const engine = GundamTestEngine.create({ play: [miller], deck: 1 }, {});
    const p1 = engine.asPlayer(PLAYER_ONE);
    const millerId = p1.getCardsInZone("battleArea")[0]!;
    const p1TrashBefore = engine.getCardCount({ zone: "trash", playerId: PLAYER_ONE });

    expectSuccess(p1.activateAbility(millerId, 0));

    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(0);
    expect(engine.getCardCount({ zone: "trash", playerId: PLAYER_ONE })).toBe(p1TrashBefore + 1);
    expect(p1.getBoardView().winner).toBe(PLAYER_TWO);
  });
});
