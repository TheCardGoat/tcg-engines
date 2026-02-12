import { describe, expect, it } from "bun:test";
import { createCardId, createPlayerId, createZoneId } from "../types";
import { createZone } from "./zone-factory";
import { createPlayerZones, getCardZone, moveCardInState } from "./zone-state-helpers";

describe("Zone State Helpers", () => {
  describe("createPlayerZones", () => {
    it("should create zones for each player with factory", () => {
      const p1 = createPlayerId("p1");
      const p2 = createPlayerId("p2");
      const players = [p1, p2];

      const zones = createPlayerZones(players, () => [] as string[]);

      expect(zones[p1]).toBeDefined();
      expect(zones[p2]).toBeDefined();
      expect(Object.keys(zones)).toHaveLength(2);
    });

    it("should initialize with default values", () => {
      const p1 = createPlayerId("p1");
      const p2 = createPlayerId("p2");
      const players = [p1, p2];

      const zones = createPlayerZones(players, () => []);

      expect(zones[p1]).toEqual([]);
      expect(zones[p2]).toEqual([]);
    });

    it("should initialize with custom factory function", () => {
      const p1 = createPlayerId("p1");
      const p2 = createPlayerId("p2");
      const players = [p1, p2];

      const zones = createPlayerZones(players, () => ({ count: 0 }));

      expect(zones[p1]).toEqual({ count: 0 });
      expect(zones[p2]).toEqual({ count: 0 });
    });

    it("should call factory function for each player", () => {
      const players = [createPlayerId("p1"), createPlayerId("p2")];
      let callCount = 0;

      createPlayerZones(players, () => {
        callCount++;
        return [];
      });

      expect(callCount).toBe(2);
    });

    it("should handle single player", () => {
      const p1 = createPlayerId("p1");
      const players = [p1];

      const zones = createPlayerZones(players, () => [] as string[]);

      expect(Object.keys(zones)).toHaveLength(1);
      expect(zones[p1]).toBeDefined();
    });

    it("should handle empty players array", () => {
      const players: ReturnType<typeof createPlayerId>[] = [];

      const zones = createPlayerZones(players, () => [] as string[]);

      expect(Object.keys(zones)).toHaveLength(0);
    });
  });

  describe("moveCardInState", () => {
    it("should move card between zones in flat state", () => {
      const _playerId = createPlayerId("p1");
      const cardId = createCardId("card-1");

      const state = {
        deck: createZone({
          id: createZoneId("deck"),
          name: "Deck",
          ordered: true,
          visibility: "secret",
        }),
        hand: createZone(
          {
            id: createZoneId("hand"),
            name: "Hand",
            ordered: false,
            visibility: "private",
          },
          [cardId, createCardId("card-2")],
        ),
      };

      const newState = moveCardInState(state, "hand", "deck", cardId);

      expect(newState.hand.cards).not.toContain(cardId);
      expect(newState.hand.cards).toHaveLength(1);
      expect(newState.deck.cards).toContain(cardId);
      expect(newState.deck.cards).toHaveLength(1);
    });

    it("should preserve other zones in state", () => {
      const cardId = createCardId("card-1");

      const state = {
        deck: createZone({
          id: createZoneId("deck"),
          name: "Deck",
          ordered: true,
          visibility: "secret",
        }),
        graveyard: createZone(
          {
            id: createZoneId("graveyard"),
            name: "Graveyard",
            ordered: true,
            visibility: "public",
          },
          [createCardId("card-3")],
        ),
        hand: createZone(
          {
            id: createZoneId("hand"),
            name: "Hand",
            ordered: false,
            visibility: "private",
          },
          [cardId],
        ),
      };

      const newState = moveCardInState(state, "hand", "deck", cardId);

      expect(newState.graveyard).toBe(state.graveyard);
      expect(newState.graveyard.cards).toHaveLength(1);
    });

    it("should maintain immutability", () => {
      const cardId = createCardId("card-1");

      const state = {
        deck: createZone({
          id: createZoneId("deck"),
          name: "Deck",
          ordered: true,
          visibility: "secret",
        }),
        hand: createZone(
          {
            id: createZoneId("hand"),
            name: "Hand",
            ordered: false,
            visibility: "private",
          },
          [cardId],
        ),
      };

      const originalHandCards = state.hand.cards;
      const originalDeckCards = state.deck.cards;

      const newState = moveCardInState(state, "hand", "deck", cardId);

      expect(state.hand.cards).toBe(originalHandCards);
      expect(state.deck.cards).toBe(originalDeckCards);
      expect(newState.hand).not.toBe(state.hand);
      expect(newState.deck).not.toBe(state.deck);
    });

    it("should add card with optional position", () => {
      const cardId = createCardId("card-1");

      const state = {
        deck: createZone(
          {
            id: createZoneId("deck"),
            name: "Deck",
            ordered: true,
            visibility: "secret",
          },
          [createCardId("card-2")],
        ),
        hand: createZone(
          {
            id: createZoneId("hand"),
            name: "Hand",
            ordered: false,
            visibility: "private",
          },
          [cardId],
        ),
      };

      const newState = moveCardInState(state, "hand", "deck", cardId, 0);

      expect(newState.deck.cards[0]).toBe(cardId);
      expect(newState.deck.cards[1]).toBe(createCardId("card-2"));
    });
  });

  describe("getCardZone", () => {
    it("should find card in first zone", () => {
      const cardId = createCardId("card-1");

      const state = {
        deck: createZone({
          id: createZoneId("deck"),
          name: "Deck",
          ordered: true,
          visibility: "secret",
        }),
        hand: createZone(
          {
            id: createZoneId("hand"),
            name: "Hand",
            ordered: false,
            visibility: "private",
          },
          [cardId, createCardId("card-2")],
        ),
      };

      const zoneName = getCardZone(state, cardId);

      expect(zoneName).toBe("hand");
    });

    it("should find card in later zone", () => {
      const cardId = createCardId("card-3");

      const state = {
        deck: createZone(
          {
            id: createZoneId("deck"),
            name: "Deck",
            ordered: true,
            visibility: "secret",
          },
          [createCardId("card-2"), cardId],
        ),
        hand: createZone(
          {
            id: createZoneId("hand"),
            name: "Hand",
            ordered: false,
            visibility: "private",
          },
          [createCardId("card-1")],
        ),
      };

      const zoneName = getCardZone(state, cardId);

      expect(zoneName).toBe("deck");
    });

    it("should return undefined when card not found", () => {
      const state = {
        deck: createZone({
          id: createZoneId("deck"),
          name: "Deck",
          ordered: true,
          visibility: "secret",
        }),
        hand: createZone(
          {
            id: createZoneId("hand"),
            name: "Hand",
            ordered: false,
            visibility: "private",
          },
          [createCardId("card-1")],
        ),
      };

      const zoneName = getCardZone(state, createCardId("missing"));

      expect(zoneName).toBeUndefined();
    });

    it("should return first zone if card in multiple zones", () => {
      const cardId = createCardId("card-1");

      const state = {
        deck: createZone(
          {
            id: createZoneId("deck"),
            name: "Deck",
            ordered: true,
            visibility: "secret",
          },
          [cardId],
        ),
        hand: createZone(
          {
            id: createZoneId("hand"),
            name: "Hand",
            ordered: false,
            visibility: "private",
          },
          [cardId],
        ),
      };

      const zoneName = getCardZone(state, cardId);

      expect(zoneName).toBe("deck");
    });

    it("should handle empty zones", () => {
      const state = {
        deck: createZone({
          id: createZoneId("deck"),
          name: "Deck",
          ordered: true,
          visibility: "secret",
        }),
        hand: createZone({
          id: createZoneId("hand"),
          name: "Hand",
          ordered: false,
          visibility: "private",
        }),
      };

      const zoneName = getCardZone(state, createCardId("card-1"));

      expect(zoneName).toBeUndefined();
    });
  });
});
