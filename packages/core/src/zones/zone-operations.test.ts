import { describe, expect, it } from "bun:test";
import { createCardId, createZoneId } from "../types";
import { createZone } from "./zone-factory";
import {
  addCard,
  addCardToBottom,
  addCardToTop,
  clearZone,
  draw,
  findCardInZones,
  getBottomCard,
  getCardsInZone,
  getTopCard,
  getZoneSize,
  isCardInZone,
  mill,
  moveCard,
  peek,
  removeCard,
  reveal,
  search,
  shuffle,
} from "./zone-operations";

describe("Zone Operations", () => {
  describe("addCard", () => {
    it("should add card to zone", () => {
      const zone = createZone({
        id: createZoneId("hand"),
        name: "Hand",
        ordered: false,
        visibility: "private",
      });

      const cardId = createCardId("card-1");
      const updated = addCard(zone, cardId);

      expect(updated.cards).toContain(cardId);
      expect(updated.cards).toHaveLength(1);
    });

    it("should throw error if zone is at maxSize", () => {
      const zone = createZone(
        {
          id: createZoneId("hand"),
          maxSize: 1,
          name: "Hand",
          ordered: false,
          visibility: "private",
        },
        [createCardId("card-1")],
      );

      expect(() => addCard(zone, createCardId("card-2"))).toThrow(
        "Cannot add card: zone is at maximum size (1)",
      );
    });

    it("should add card to end of ordered zone", () => {
      const zone = createZone(
        {
          id: createZoneId("deck"),
          name: "Deck",
          ordered: true,
          visibility: "secret",
        },
        [createCardId("card-1"), createCardId("card-2")],
      );

      const newCard = createCardId("card-3");
      const updated = addCard(zone, newCard);

      expect(updated.cards[2]).toBe(newCard);
    });

    it("should add card at specified position in ordered zone", () => {
      const zone = createZone(
        {
          id: createZoneId("deck"),
          name: "Deck",
          ordered: true,
          visibility: "secret",
        },
        [createCardId("card-1"), createCardId("card-3")],
      );

      const newCard = createCardId("card-2");
      const updated = addCard(zone, newCard, 1);

      expect(updated.cards[1]).toBe(newCard);
      expect(updated.cards).toHaveLength(3);
    });
  });

  describe("removeCard", () => {
    it("should remove card from zone", () => {
      const cardId = createCardId("card-1");
      const zone = createZone(
        {
          id: createZoneId("hand"),
          name: "Hand",
          ordered: false,
          visibility: "private",
        },
        [cardId, createCardId("card-2")],
      );

      const updated = removeCard(zone, cardId);

      expect(updated.cards).not.toContain(cardId);
      expect(updated.cards).toHaveLength(1);
    });

    it("should throw error if card not in zone", () => {
      const zone = createZone({
        id: createZoneId("hand"),
        name: "Hand",
        ordered: false,
        visibility: "private",
      });

      expect(() => removeCard(zone, createCardId("missing"))).toThrow(
        "Card missing not found in zone hand",
      );
    });
  });

  describe("moveCard", () => {
    it("should move card from one zone to another", () => {
      const cardId = createCardId("card-1");
      const from = createZone(
        {
          id: createZoneId("hand"),
          name: "Hand",
          ordered: false,
          visibility: "private",
        },
        [cardId],
      );
      const to = createZone({
        id: createZoneId("play"),
        name: "Play",
        ordered: false,
        visibility: "public",
      });

      const { fromZone, toZone } = moveCard(from, to, cardId);

      expect(fromZone.cards).not.toContain(cardId);
      expect(toZone.cards).toContain(cardId);
    });
  });

  describe("draw", () => {
    it("should draw cards from deck to hand", () => {
      const cards = [createCardId("card-1"), createCardId("card-2"), createCardId("card-3")];
      const deck = createZone(
        {
          id: createZoneId("deck"),
          name: "Deck",
          ordered: true,
          visibility: "secret",
        },
        cards,
      );
      const hand = createZone({
        id: createZoneId("hand"),
        name: "Hand",
        ordered: false,
        visibility: "private",
      });

      const result = draw(deck, hand, 2);

      expect(result.fromZone.cards).toHaveLength(1);
      expect(result.toZone.cards).toHaveLength(2);
      expect(result.drawnCards).toHaveLength(2);
    });

    it("should draw from top of deck", () => {
      const cards = [createCardId("card-1"), createCardId("card-2"), createCardId("card-3")];
      const deck = createZone(
        {
          id: createZoneId("deck"),
          name: "Deck",
          ordered: true,
          visibility: "secret",
        },
        cards,
      );
      const hand = createZone({
        id: createZoneId("hand"),
        name: "Hand",
        ordered: false,
        visibility: "private",
      });

      const result = draw(deck, hand, 1);

      expect(result.drawnCards[0]).toBe(cards[0]);
    });

    it("should throw error if not enough cards to draw", () => {
      const deck = createZone(
        {
          id: createZoneId("deck"),
          name: "Deck",
          ordered: true,
          visibility: "secret",
        },
        [createCardId("card-1")],
      );
      const hand = createZone({
        id: createZoneId("hand"),
        name: "Hand",
        ordered: false,
        visibility: "private",
      });

      expect(() => draw(deck, hand, 2)).toThrow("Cannot draw 2 cards: only 1 available in deck");
    });
  });

  describe("shuffle", () => {
    it("should shuffle zone with seeded RNG", () => {
      const cards = [
        createCardId("card-1"),
        createCardId("card-2"),
        createCardId("card-3"),
        createCardId("card-4"),
        createCardId("card-5"),
      ];
      const zone = createZone(
        {
          id: createZoneId("deck"),
          name: "Deck",
          ordered: true,
          visibility: "secret",
        },
        cards,
      );

      const shuffled = shuffle(zone, "test-seed");

      // Should have same cards
      expect(shuffled.cards).toHaveLength(cards.length);
      for (const card of cards) {
        expect(shuffled.cards).toContain(card);
      }

      // Order should be different (with high probability)
      const orderChanged = shuffled.cards.some((card, index) => card !== cards[index]);
      expect(orderChanged).toBe(true);
    });

    it("should produce same shuffle with same seed", () => {
      const cards = [createCardId("card-1"), createCardId("card-2"), createCardId("card-3")];
      const zone1 = createZone(
        {
          id: createZoneId("deck"),
          name: "Deck",
          ordered: true,
          visibility: "secret",
        },
        cards,
      );
      const zone2 = createZone(
        {
          id: createZoneId("deck"),
          name: "Deck",
          ordered: true,
          visibility: "secret",
        },
        cards,
      );

      const shuffled1 = shuffle(zone1, "same-seed");
      const shuffled2 = shuffle(zone2, "same-seed");

      expect(shuffled1.cards).toEqual(shuffled2.cards);
    });
  });

  describe("search", () => {
    it("should find cards matching filter", () => {
      const cards = [createCardId("card-1"), createCardId("card-2"), createCardId("card-3")];
      const zone = createZone(
        {
          id: createZoneId("deck"),
          name: "Deck",
          ordered: true,
          visibility: "secret",
        },
        cards,
      );

      const filter = (cardId: string) => cardId === "card-2";
      const found = search(zone, filter);

      expect(found).toHaveLength(1);
      expect(found[0]).toBe(cards[1]);
    });
  });

  describe("peek", () => {
    it("should return top N cards without removing them", () => {
      const cards = [createCardId("card-1"), createCardId("card-2"), createCardId("card-3")];
      const zone = createZone(
        {
          id: createZoneId("deck"),
          name: "Deck",
          ordered: true,
          visibility: "secret",
        },
        cards,
      );

      const peeked = peek(zone, 2);

      expect(peeked).toHaveLength(2);
      expect(peeked[0]).toBe(cards[0]);
      expect(peeked[1]).toBe(cards[1]);
      expect(zone.cards).toHaveLength(3); // Original unchanged
    });
  });

  describe("mill", () => {
    it("should move cards from deck to graveyard", () => {
      const cards = [createCardId("card-1"), createCardId("card-2"), createCardId("card-3")];
      const deck = createZone(
        {
          id: createZoneId("deck"),
          name: "Deck",
          ordered: true,
          visibility: "secret",
        },
        cards,
      );
      const graveyard = createZone({
        id: createZoneId("graveyard"),
        name: "Graveyard",
        ordered: true,
        visibility: "public",
      });

      const result = mill(deck, graveyard, 2);

      expect(result.fromZone.cards).toHaveLength(1);
      expect(result.toZone.cards).toHaveLength(2);
      expect(result.milledCards).toHaveLength(2);
    });
  });

  describe("reveal", () => {
    it("should mark cards as revealed", () => {
      const cards = [createCardId("card-1"), createCardId("card-2")];

      const revealed = reveal(cards);

      expect(revealed).toHaveLength(2);
      expect(revealed).toContain(cards[0]);
      expect(revealed).toContain(cards[1]);
    });
  });

  describe("Zone Queries", () => {
    describe("getZoneSize", () => {
      it("should return number of cards in zone", () => {
        const zone = createZone(
          {
            id: createZoneId("hand"),
            name: "Hand",
            ordered: false,
            visibility: "private",
          },
          [createCardId("card-1"), createCardId("card-2")],
        );

        expect(getZoneSize(zone)).toBe(2);
      });
    });

    describe("getCardsInZone", () => {
      it("should return all cards in zone", () => {
        const cards = [createCardId("card-1"), createCardId("card-2")];
        const zone = createZone(
          {
            id: createZoneId("hand"),
            name: "Hand",
            ordered: false,
            visibility: "private",
          },
          cards,
        );

        expect(getCardsInZone(zone)).toEqual(cards);
      });
    });

    describe("getTopCard", () => {
      it("should return first card in ordered zone", () => {
        const cards = [createCardId("card-1"), createCardId("card-2")];
        const zone = createZone(
          {
            id: createZoneId("deck"),
            name: "Deck",
            ordered: true,
            visibility: "secret",
          },
          cards,
        );

        expect(getTopCard(zone)).toBe(cards[0]);
      });

      it("should return undefined for empty zone", () => {
        const zone = createZone({
          id: createZoneId("deck"),
          name: "Deck",
          ordered: true,
          visibility: "secret",
        });

        expect(getTopCard(zone)).toBeUndefined();
      });
    });

    describe("getBottomCard", () => {
      it("should return last card in ordered zone", () => {
        const cards = [createCardId("card-1"), createCardId("card-2")];
        const zone = createZone(
          {
            id: createZoneId("deck"),
            name: "Deck",
            ordered: true,
            visibility: "secret",
          },
          cards,
        );

        expect(getBottomCard(zone)).toBe(cards[1]);
      });

      it("should return undefined for empty zone", () => {
        const zone = createZone({
          id: createZoneId("deck"),
          name: "Deck",
          ordered: true,
          visibility: "secret",
        });

        expect(getBottomCard(zone)).toBeUndefined();
      });
    });
  });

  describe("isCardInZone", () => {
    it("should return true when card is in zone", () => {
      const cardId = createCardId("card-1");
      const zone = createZone(
        {
          id: createZoneId("hand"),
          name: "Hand",
          ordered: false,
          visibility: "private",
        },
        [cardId, createCardId("card-2")],
      );

      expect(isCardInZone(zone, cardId)).toBe(true);
    });

    it("should return false when card is not in zone", () => {
      const zone = createZone(
        {
          id: createZoneId("hand"),
          name: "Hand",
          ordered: false,
          visibility: "private",
        },
        [createCardId("card-1"), createCardId("card-2")],
      );

      expect(isCardInZone(zone, createCardId("card-3"))).toBe(false);
    });

    it("should return false for empty zone", () => {
      const zone = createZone({
        id: createZoneId("hand"),
        name: "Hand",
        ordered: false,
        visibility: "private",
      });

      expect(isCardInZone(zone, createCardId("card-1"))).toBe(false);
    });
  });

  describe("addCardToTop", () => {
    it("should add card to top of ordered zone", () => {
      const zone = createZone(
        {
          id: createZoneId("deck"),
          name: "Deck",
          ordered: true,
          visibility: "secret",
        },
        [createCardId("card-2"), createCardId("card-3")],
      );

      const newCard = createCardId("card-1");
      const updated = addCardToTop(zone, newCard);

      expect(updated.cards[0]).toBe(newCard);
      expect(updated.cards).toHaveLength(3);
      expect(updated.cards[1]).toBe(createCardId("card-2"));
    });

    it("should add card to empty zone", () => {
      const zone = createZone({
        id: createZoneId("deck"),
        name: "Deck",
        ordered: true,
        visibility: "secret",
      });

      const newCard = createCardId("card-1");
      const updated = addCardToTop(zone, newCard);

      expect(updated.cards[0]).toBe(newCard);
      expect(updated.cards).toHaveLength(1);
    });

    it("should throw error if zone is at maxSize", () => {
      const zone = createZone(
        {
          id: createZoneId("hand"),
          maxSize: 1,
          name: "Hand",
          ordered: false,
          visibility: "private",
        },
        [createCardId("card-1")],
      );

      expect(() => addCardToTop(zone, createCardId("card-2"))).toThrow(
        "Cannot add card: zone is at maximum size (1)",
      );
    });
  });

  describe("addCardToBottom", () => {
    it("should add card to bottom of ordered zone", () => {
      const zone = createZone(
        {
          id: createZoneId("deck"),
          name: "Deck",
          ordered: true,
          visibility: "secret",
        },
        [createCardId("card-1"), createCardId("card-2")],
      );

      const newCard = createCardId("card-3");
      const updated = addCardToBottom(zone, newCard);

      expect(updated.cards[2]).toBe(newCard);
      expect(updated.cards).toHaveLength(3);
      expect(updated.cards[0]).toBe(createCardId("card-1"));
    });

    it("should add card to empty zone", () => {
      const zone = createZone({
        id: createZoneId("deck"),
        name: "Deck",
        ordered: true,
        visibility: "secret",
      });

      const newCard = createCardId("card-1");
      const updated = addCardToBottom(zone, newCard);

      expect(updated.cards[0]).toBe(newCard);
      expect(updated.cards).toHaveLength(1);
    });

    it("should throw error if zone is at maxSize", () => {
      const zone = createZone(
        {
          id: createZoneId("hand"),
          maxSize: 1,
          name: "Hand",
          ordered: false,
          visibility: "private",
        },
        [createCardId("card-1")],
      );

      expect(() => addCardToBottom(zone, createCardId("card-2"))).toThrow(
        "Cannot add card: zone is at maximum size (1)",
      );
    });
  });

  describe("clearZone", () => {
    it("should remove all cards from zone", () => {
      const zone = createZone(
        {
          id: createZoneId("hand"),
          name: "Hand",
          ordered: false,
          visibility: "private",
        },
        [createCardId("card-1"), createCardId("card-2"), createCardId("card-3")],
      );

      const updated = clearZone(zone);

      expect(updated.cards).toHaveLength(0);
      expect(updated.cards).toEqual([]);
    });

    it("should handle empty zone", () => {
      const zone = createZone({
        id: createZoneId("hand"),
        name: "Hand",
        ordered: false,
        visibility: "private",
      });

      const updated = clearZone(zone);

      expect(updated.cards).toHaveLength(0);
    });

    it("should preserve zone config", () => {
      const zone = createZone(
        {
          id: createZoneId("hand"),
          maxSize: 10,
          name: "Hand",
          ordered: false,
          visibility: "private",
        },
        [createCardId("card-1")],
      );

      const updated = clearZone(zone);

      expect(updated.config).toEqual(zone.config);
      expect(updated.config.maxSize).toBe(10);
    });
  });

  describe("findCardInZones", () => {
    it("should find card in first zone", () => {
      const cardId = createCardId("card-1");
      const zone1 = createZone(
        {
          id: createZoneId("hand"),
          name: "Hand",
          ordered: false,
          visibility: "private",
        },
        [cardId, createCardId("card-2")],
      );
      const zone2 = createZone(
        {
          id: createZoneId("deck"),
          name: "Deck",
          ordered: true,
          visibility: "secret",
        },
        [createCardId("card-3")],
      );

      const found = findCardInZones(cardId, [zone1, zone2]);

      expect(found).toBeDefined();
      expect(found?.config.id).toBe(createZoneId("hand"));
    });

    it("should find card in later zone", () => {
      const cardId = createCardId("card-3");
      const zone1 = createZone(
        {
          id: createZoneId("hand"),
          name: "Hand",
          ordered: false,
          visibility: "private",
        },
        [createCardId("card-1")],
      );
      const zone2 = createZone(
        {
          id: createZoneId("deck"),
          name: "Deck",
          ordered: true,
          visibility: "secret",
        },
        [createCardId("card-2"), cardId],
      );

      const found = findCardInZones(cardId, [zone1, zone2]);

      expect(found).toBeDefined();
      expect(found?.config.id).toBe(createZoneId("deck"));
    });

    it("should return undefined when card not in any zone", () => {
      const zone1 = createZone(
        {
          id: createZoneId("hand"),
          name: "Hand",
          ordered: false,
          visibility: "private",
        },
        [createCardId("card-1")],
      );
      const zone2 = createZone(
        {
          id: createZoneId("deck"),
          name: "Deck",
          ordered: true,
          visibility: "secret",
        },
        [createCardId("card-2")],
      );

      const found = findCardInZones(createCardId("card-3"), [zone1, zone2]);

      expect(found).toBeUndefined();
    });

    it("should return undefined for empty zones array", () => {
      const found = findCardInZones(createCardId("card-1"), []);

      expect(found).toBeUndefined();
    });

    it("should return first zone if card exists in multiple zones", () => {
      const cardId = createCardId("card-1");
      const zone1 = createZone(
        {
          id: createZoneId("hand"),
          name: "Hand",
          ordered: false,
          visibility: "private",
        },
        [cardId],
      );
      const zone2 = createZone(
        {
          id: createZoneId("deck"),
          name: "Deck",
          ordered: true,
          visibility: "secret",
        },
        [cardId],
      );

      const found = findCardInZones(cardId, [zone1, zone2]);

      expect(found).toBeDefined();
      expect(found?.config.id).toBe(createZoneId("hand"));
    });
  });
});
