import { describe, expect, it } from "bun:test";
import type { CardId, PlayerId, ZoneId } from "../types";
import type { InternalState } from "../types/state";
import type { CardZoneConfig } from "../zones";
import { createCardOperations, createZoneOperations } from "./operations-impl";

describe("Operations Implementation", () => {
  interface TestCardDef {
    id: string;
    name: string;
  }
  interface TestCardMeta {
    damage?: number;
    exerted?: boolean;
    counters?: number;
  }

  const createTestInternalState = (): InternalState<TestCardDef, TestCardMeta> => {
    const handZone: CardZoneConfig = {
      id: "hand" as ZoneId,
      name: "Hand",
      ordered: false,
      visibility: "private",
    };

    const deckZone: CardZoneConfig = {
      id: "deck" as ZoneId,
      name: "Deck",
      ordered: true,
      visibility: "secret",
    };

    return {
      cardMetas: {
        "card-1": { damage: 0, exerted: false },
        "card-2": { counters: 2, damage: 3, exerted: true },
      },
      cards: {
        "card-1": {
          controller: "player-1" as unknown as PlayerId,
          definitionId: "monster-1",
          owner: "player-1" as unknown as PlayerId,
          zone: "hand" as ZoneId,
        },
        "card-2": {
          controller: "player-1" as unknown as PlayerId,
          definitionId: "monster-2",
          owner: "player-1" as unknown as PlayerId,
          zone: "hand" as ZoneId,
        },
        "card-3": {
          controller: "player-1" as unknown as PlayerId,
          definitionId: "spell-1",
          owner: "player-1" as unknown as PlayerId,
          position: 0,
          zone: "deck" as ZoneId,
        },
        "card-4": {
          controller: "player-1" as unknown as PlayerId,
          definitionId: "spell-2",
          owner: "player-1" as unknown as PlayerId,
          position: 1,
          zone: "deck" as ZoneId,
        },
        "card-5": {
          controller: "player-1" as unknown as PlayerId,
          definitionId: "spell-3",
          owner: "player-1" as unknown as PlayerId,
          position: 2,
          zone: "deck" as ZoneId,
        },
      },
      zones: {
        deck: {
          config: deckZone,
          cardIds: ["card-3", "card-4", "card-5"] as unknown as CardId[],
        },
        hand: {
          config: handZone,
          cardIds: ["card-1", "card-2"] as unknown as CardId[],
        },
        play: {
          config: {
            id: "play" as ZoneId,
            name: "Play",
            visibility: "public",
            ordered: false,
          },
          cardIds: [],
        },
      },
    };
  };

  describe("ZoneOperations Implementation", () => {
    describe("moveCard", () => {
      it("should move card from hand to play", () => {
        const state = createTestInternalState();
        const ops = createZoneOperations(state);

        ops.moveCard({
          cardId: "card-1" as CardId,
          targetZoneId: "play" as ZoneId,
        });

        expect(state.zones.hand.cardIds).not.toContain("card-1");
        expect(state.zones.play.cardIds).toContain("card-1");
        expect(state.cards["card-1"].zone).toBe("play" as ZoneId);
      });

      it("should move card to top of deck", () => {
        const state = createTestInternalState();
        const ops = createZoneOperations(state);

        ops.moveCard({
          cardId: "card-1" as CardId,
          position: "top",
          targetZoneId: "deck" as ZoneId,
        });

        expect(state.zones.deck.cardIds[0]).toBe("card-1" as unknown as CardId);
        expect(state.cards["card-1"].position).toBe(0);
      });

      it("should move card to bottom of deck", () => {
        const state = createTestInternalState();
        const ops = createZoneOperations(state);

        ops.moveCard({
          cardId: "card-1" as CardId,
          position: "bottom",
          targetZoneId: "deck" as ZoneId,
        });

        const lastIndex = state.zones.deck.cardIds.length - 1;
        expect(state.zones.deck.cardIds[lastIndex]).toBe("card-1" as unknown as CardId);
      });

      it("should update positions in ordered zones", () => {
        const state = createTestInternalState();
        const ops = createZoneOperations(state);

        ops.moveCard({
          cardId: "card-1" as CardId,
          position: 1,
          targetZoneId: "deck" as ZoneId,
        });

        expect(state.cards["card-1"].position).toBe(1);
        expect(state.cards["card-4"].position).toBe(2); // Shifted down
      });
    });

    describe("getCardsInZone", () => {
      it("should return all cards in a zone", () => {
        const state = createTestInternalState();
        const ops = createZoneOperations(state);

        const handCards = ops.getCardsInZone("hand" as ZoneId);

        expect(handCards).toHaveLength(2);
        expect(handCards).toContain("card-1");
        expect(handCards).toContain("card-2");
      });

      it("should return empty array for empty zone", () => {
        const state = createTestInternalState();
        const ops = createZoneOperations(state);

        const playCards = ops.getCardsInZone("play" as ZoneId);

        expect(playCards).toHaveLength(0);
      });

      it("should filter by owner", () => {
        const state = createTestInternalState();
        // Add card for different player
        state.zones.hand.cardIds.push("card-6" as CardId);
        state.cards["card-6"] = {
          controller: "player-2" as unknown as PlayerId,
          definitionId: "monster-3",
          owner: "player-2" as unknown as PlayerId,
          zone: "hand" as ZoneId,
        };

        const ops = createZoneOperations(state);

        const player1Cards = ops.getCardsInZone(
          "hand" as ZoneId,
          "player-1" as unknown as PlayerId,
        );

        expect(player1Cards).toHaveLength(2);
        expect(player1Cards).not.toContain("card-6");
      });
    });

    describe("shuffleZone", () => {
      it("should shuffle cards in a zone", () => {
        const state = createTestInternalState();
        const ops = createZoneOperations(state);

        const beforeShuffle = [...state.zones.deck.cardIds];
        ops.shuffleZone("deck" as ZoneId);
        const afterShuffle = state.zones.deck.cardIds;

        // Should have same cards
        expect(afterShuffle).toHaveLength(beforeShuffle.length);
        for (const card of beforeShuffle) {
          expect(afterShuffle).toContain(card);
        }

        // Should update positions
        for (let i = 0; i < afterShuffle.length; i++) {
          const cardId = afterShuffle[i] as string;
          expect(state.cards[cardId].position).toBe(i);
        }
      });
    });

    describe("getCardZone", () => {
      it("should return zone containing a card", () => {
        const state = createTestInternalState();
        const ops = createZoneOperations(state);

        const zone = ops.getCardZone("card-3" as CardId);

        expect(zone).toBe("deck" as ZoneId);
      });

      it("should return undefined for nonexistent card", () => {
        const state = createTestInternalState();
        const ops = createZoneOperations(state);

        const zone = ops.getCardZone("nonexistent" as CardId);

        expect(zone).toBeUndefined();
      });
    });
  });

  describe("CardOperations Implementation", () => {
    describe("getCardMeta", () => {
      it("should return card metadata", () => {
        const state = createTestInternalState();
        const ops = createCardOperations(state);

        const meta = ops.getCardMeta("card-2" as CardId);

        expect(meta.damage).toBe(3);
        expect(meta.exerted).toBe(true);
        expect(meta.counters).toBe(2);
      });

      it("should return empty object for card without metadata", () => {
        const state = createTestInternalState();
        const ops = createCardOperations(state);

        const meta = ops.getCardMeta("card-3" as CardId);

        expect(meta).toEqual({});
      });
    });

    describe("updateCardMeta", () => {
      it("should merge metadata", () => {
        const state = createTestInternalState();
        const ops = createCardOperations(state);

        ops.updateCardMeta("card-1" as CardId, { damage: 5 });

        expect(state.cardMetas["card-1"].damage).toBe(5);
        expect(state.cardMetas["card-1"].exerted).toBe(false); // Preserved
      });

      it("should create metadata for new card", () => {
        const state = createTestInternalState();
        const ops = createCardOperations(state);

        ops.updateCardMeta("card-3" as CardId, { damage: 2 });

        expect(state.cardMetas["card-3"].damage).toBe(2);
      });
    });

    describe("setCardMeta", () => {
      it("should replace metadata completely", () => {
        const state = createTestInternalState();
        const ops = createCardOperations(state);

        ops.setCardMeta("card-2" as CardId, { damage: 10 });

        expect(state.cardMetas["card-2"].damage).toBe(10);
        expect(state.cardMetas["card-2"].exerted).toBeUndefined();
        expect(state.cardMetas["card-2"].counters).toBeUndefined();
      });
    });

    describe("getCardOwner", () => {
      it("should return card owner", () => {
        const state = createTestInternalState();
        const ops = createCardOperations(state);

        const owner = ops.getCardOwner("card-1" as CardId);

        expect(owner).toBe("player-1" as unknown as PlayerId);
      });

      it("should return undefined for nonexistent card", () => {
        const state = createTestInternalState();
        const ops = createCardOperations(state);

        const owner = ops.getCardOwner("nonexistent" as CardId);

        expect(owner).toBeUndefined();
      });
    });

    describe("queryCards", () => {
      it("should find cards by predicate", () => {
        const state = createTestInternalState();
        const ops = createCardOperations(state);

        const exerted = ops.queryCards((cardId, meta) => meta.exerted === true);

        expect(exerted).toHaveLength(1);
        expect(exerted).toContain("card-2");
      });

      it("should support complex predicates", () => {
        const state = createTestInternalState();
        const ops = createCardOperations(state);

        const results = ops.queryCards(
          (cardId, meta) => (meta.damage ?? 0) > 0 && (meta.counters ?? 0) >= 2,
        );

        expect(results).toHaveLength(1);
        expect(results).toContain("card-2");
      });

      it("should return empty array when no matches", () => {
        const state = createTestInternalState();
        const ops = createCardOperations(state);

        const results = ops.queryCards((cardId, meta) => meta.counters === 999);

        expect(results).toHaveLength(0);
      });
    });
  });
});
