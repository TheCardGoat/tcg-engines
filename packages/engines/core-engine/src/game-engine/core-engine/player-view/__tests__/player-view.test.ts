import { describe, expect, it } from "bun:test";
import type { CardInstance } from "../../card-instance/card-instance-types";
import {
  createCardId,
  createPlayerId,
  createZoneId,
} from "../../types/branded-types";
import {
  applyZoneVisibility,
  createPlayerView,
  filterDeck,
  filterFaceDownCards,
  filterOpponentHand,
  type GameStateWithPlayers,
  type PlayerViewConfig,
} from "../player-view";

describe("Player View Filtering", () => {
  const player1 = createPlayerId("player-1");
  const player2 = createPlayerId("player-2");

  const handZone = createZoneId("hand");
  const deckZone = createZoneId("deck");
  const playZone = createZoneId("play");
  const discardZone = createZoneId("discard");

  describe("Default Player View", () => {
    it("should return full state when no filtering is applied", () => {
      const state = {
        turn: 1,
        phase: "main",
        cards: [
          {
            id: createCardId("card-1"),
            definitionId: "forest",
            owner: player1,
            controller: player1,
            zone: playZone,
            tapped: false,
            flipped: true,
            revealed: false,
            phased: false,
          },
        ],
      };

      const view = createPlayerView(state, player1);

      expect(view).toEqual(state);
    });
  });

  describe("filterOpponentHand", () => {
    it("should hide opponent hand card details", () => {
      const cards: CardInstance[] = [
        {
          id: createCardId("card-1"),
          definitionId: "forest",
          owner: player1,
          controller: player1,
          zone: handZone,
          tapped: false,
          flipped: true,
          revealed: false,
          phased: false,
        },
        {
          id: createCardId("card-2"),
          definitionId: "mountain",
          owner: player2,
          controller: player2,
          zone: handZone,
          tapped: false,
          flipped: true,
          revealed: false,
          phased: false,
        },
      ];

      const filtered = filterOpponentHand(cards, player1);

      // Player 1's hand should be visible
      expect(filtered[0].definitionId).toBe("forest");

      // Player 2's hand should be hidden
      expect(filtered[1].definitionId).toBe("__hidden__");
      expect(filtered[1].id).toBe(cards[1].id); // ID preserved
      expect(filtered[1].zone).toBe(handZone); // Zone preserved
    });

    it("should reveal opponent hand cards marked as revealed", () => {
      const cards: CardInstance[] = [
        {
          id: createCardId("card-1"),
          definitionId: "forest",
          owner: player2,
          controller: player2,
          zone: handZone,
          tapped: false,
          flipped: true,
          revealed: true, // This card is revealed
          phased: false,
        },
      ];

      const filtered = filterOpponentHand(cards, player1);

      expect(filtered[0].definitionId).toBe("forest");
      expect(filtered[0].revealed).toBe(true);
    });

    it("should not filter cards outside hand zone", () => {
      const cards: CardInstance[] = [
        {
          id: createCardId("card-1"),
          definitionId: "forest",
          owner: player2,
          controller: player2,
          zone: playZone,
          tapped: false,
          flipped: true,
          revealed: false,
          phased: false,
        },
      ];

      const filtered = filterOpponentHand(cards, player1);

      expect(filtered[0].definitionId).toBe("forest");
    });
  });

  describe("filterDeck", () => {
    it("should hide all deck card details for all players", () => {
      const cards: CardInstance[] = [
        {
          id: createCardId("card-1"),
          definitionId: "forest",
          owner: player1,
          controller: player1,
          zone: deckZone,
          position: 0,
          tapped: false,
          flipped: true,
          revealed: false,
          phased: false,
        },
        {
          id: createCardId("card-2"),
          definitionId: "mountain",
          owner: player2,
          controller: player2,
          zone: deckZone,
          position: 0,
          tapped: false,
          flipped: true,
          revealed: false,
          phased: false,
        },
      ];

      const filtered = filterDeck(cards);

      // Both decks should be hidden
      expect(filtered[0].definitionId).toBe("__hidden__");
      expect(filtered[1].definitionId).toBe("__hidden__");

      // IDs and zones should be preserved
      expect(filtered[0].id).toBe(cards[0].id);
      expect(filtered[0].zone).toBe(deckZone);
      expect(filtered[1].id).toBe(cards[1].id);
      expect(filtered[1].zone).toBe(deckZone);
    });

    it("should reveal deck cards marked as revealed", () => {
      const cards: CardInstance[] = [
        {
          id: createCardId("card-1"),
          definitionId: "forest",
          owner: player1,
          controller: player1,
          zone: deckZone,
          position: 0,
          tapped: false,
          flipped: true,
          revealed: true, // Revealed deck card (e.g., scry, tutor effect)
          phased: false,
        },
      ];

      const filtered = filterDeck(cards);

      expect(filtered[0].definitionId).toBe("forest");
      expect(filtered[0].revealed).toBe(true);
    });

    it("should not filter cards outside deck zone", () => {
      const cards: CardInstance[] = [
        {
          id: createCardId("card-1"),
          definitionId: "forest",
          owner: player1,
          controller: player1,
          zone: playZone,
          tapped: false,
          flipped: true,
          revealed: false,
          phased: false,
        },
      ];

      const filtered = filterDeck(cards);

      expect(filtered[0].definitionId).toBe("forest");
    });
  });

  describe("filterFaceDownCards", () => {
    it("should hide face-down cards (flipped: false)", () => {
      const cards: CardInstance[] = [
        {
          id: createCardId("card-1"),
          definitionId: "forest",
          owner: player1,
          controller: player1,
          zone: playZone,
          tapped: false,
          flipped: false, // Face-down
          revealed: false,
          phased: false,
        },
      ];

      const filtered = filterFaceDownCards(cards);

      expect(filtered[0].definitionId).toBe("__hidden__");
      expect(filtered[0].flipped).toBe(false);
      expect(filtered[0].id).toBe(cards[0].id);
    });

    it("should not filter face-up cards (flipped: true)", () => {
      const cards: CardInstance[] = [
        {
          id: createCardId("card-1"),
          definitionId: "forest",
          owner: player1,
          controller: player1,
          zone: playZone,
          tapped: false,
          flipped: true, // Face-up
          revealed: false,
          phased: false,
        },
      ];

      const filtered = filterFaceDownCards(cards);

      expect(filtered[0].definitionId).toBe("forest");
    });

    it("should reveal face-down cards marked as revealed", () => {
      const cards: CardInstance[] = [
        {
          id: createCardId("card-1"),
          definitionId: "forest",
          owner: player1,
          controller: player1,
          zone: playZone,
          tapped: false,
          flipped: false, // Face-down
          revealed: true, // But revealed to all
          phased: false,
        },
      ];

      const filtered = filterFaceDownCards(cards);

      expect(filtered[0].definitionId).toBe("forest");
    });
  });

  describe("applyZoneVisibility", () => {
    it("should apply zone visibility rules based on configuration", () => {
      const cards: CardInstance[] = [
        {
          id: createCardId("card-1"),
          definitionId: "forest",
          owner: player1,
          controller: player1,
          zone: handZone,
          tapped: false,
          flipped: true,
          revealed: false,
          phased: false,
        },
        {
          id: createCardId("card-2"),
          definitionId: "mountain",
          owner: player2,
          controller: player2,
          zone: handZone,
          tapped: false,
          flipped: true,
          revealed: false,
          phased: false,
        },
      ];

      const config: PlayerViewConfig = {
        zoneVisibility: {
          hand: "private", // Only owner can see
          deck: "secret", // No one can see
          play: "public", // Everyone can see
          discard: "public",
        },
      };

      const filtered = applyZoneVisibility(cards, player1, config);

      // Player 1 can see their own hand
      expect(filtered[0].definitionId).toBe("forest");

      // Player 1 cannot see player 2's hand
      expect(filtered[1].definitionId).toBe("__hidden__");
    });

    it("should handle public zones", () => {
      const cards: CardInstance[] = [
        {
          id: createCardId("card-1"),
          definitionId: "forest",
          owner: player2,
          controller: player2,
          zone: playZone,
          tapped: false,
          flipped: true,
          revealed: false,
          phased: false,
        },
      ];

      const config: PlayerViewConfig = {
        zoneVisibility: {
          play: "public",
        },
      };

      const filtered = applyZoneVisibility(cards, player1, config);

      expect(filtered[0].definitionId).toBe("forest");
    });

    it("should handle secret zones (no one can see)", () => {
      const cards: CardInstance[] = [
        {
          id: createCardId("card-1"),
          definitionId: "forest",
          owner: player1,
          controller: player1,
          zone: deckZone,
          tapped: false,
          flipped: true,
          revealed: false,
          phased: false,
        },
      ];

      const config: PlayerViewConfig = {
        zoneVisibility: {
          deck: "secret",
        },
      };

      const filtered = applyZoneVisibility(cards, player1, config);

      // Even the owner cannot see secret zones
      expect(filtered[0].definitionId).toBe("__hidden__");
    });

    it("should respect revealed flag regardless of zone visibility", () => {
      const cards: CardInstance[] = [
        {
          id: createCardId("card-1"),
          definitionId: "forest",
          owner: player1,
          controller: player1,
          zone: deckZone,
          tapped: false,
          flipped: true,
          revealed: true, // Revealed overrides zone visibility
          phased: false,
        },
      ];

      const config: PlayerViewConfig = {
        zoneVisibility: {
          deck: "secret",
        },
      };

      const filtered = applyZoneVisibility(cards, player1, config);

      expect(filtered[0].definitionId).toBe("forest");
    });
  });

  describe("Deterministic Player Views", () => {
    it("should produce the same view for the same state and player", () => {
      const state: GameStateWithPlayers = {
        turn: 1,
        phase: "main",
        cards: [
          {
            id: createCardId("card-1"),
            definitionId: "forest",
            owner: player1,
            controller: player1,
            zone: handZone,
            tapped: false,
            flipped: true,
            revealed: false,
            phased: false,
          },
          {
            id: createCardId("card-2"),
            definitionId: "mountain",
            owner: player2,
            controller: player2,
            zone: handZone,
            tapped: false,
            flipped: true,
            revealed: false,
            phased: false,
          },
        ],
      };

      const config: PlayerViewConfig = {
        zoneVisibility: {
          hand: "private",
          deck: "secret",
          play: "public",
        },
      };

      const view1 = createPlayerView(state, player1, config);
      const view2 = createPlayerView(state, player1, config);

      expect(view1).toEqual(view2);
    });

    it("should produce different views for different players", () => {
      const state: GameStateWithPlayers = {
        turn: 1,
        phase: "main",
        cards: [
          {
            id: createCardId("card-1"),
            definitionId: "forest",
            owner: player1,
            controller: player1,
            zone: handZone,
            tapped: false,
            flipped: true,
            revealed: false,
            phased: false,
          },
          {
            id: createCardId("card-2"),
            definitionId: "mountain",
            owner: player2,
            controller: player2,
            zone: handZone,
            tapped: false,
            flipped: true,
            revealed: false,
            phased: false,
          },
        ],
      };

      const config: PlayerViewConfig = {
        zoneVisibility: {
          hand: "private",
        },
      };

      const view1 = createPlayerView(state, player1, config);
      const view2 = createPlayerView(state, player2, config);

      // Player 1 can see their own hand
      expect(view1.cards[0].definitionId).toBe("forest");
      expect(view1.cards[1].definitionId).toBe("__hidden__");

      // Player 2 can see their own hand
      expect(view2.cards[0].definitionId).toBe("__hidden__");
      expect(view2.cards[1].definitionId).toBe("mountain");
    });
  });

  describe("Complete Player View Integration", () => {
    it("should apply all filtering rules together", () => {
      const state: GameStateWithPlayers = {
        turn: 1,
        phase: "main",
        cards: [
          // Player 1's hand (should be visible to player 1)
          {
            id: createCardId("card-1"),
            definitionId: "forest",
            owner: player1,
            controller: player1,
            zone: handZone,
            tapped: false,
            flipped: true,
            revealed: false,
            phased: false,
          },
          // Player 2's hand (should be hidden from player 1)
          {
            id: createCardId("card-2"),
            definitionId: "mountain",
            owner: player2,
            controller: player2,
            zone: handZone,
            tapped: false,
            flipped: true,
            revealed: false,
            phased: false,
          },
          // Player 1's deck (should be hidden)
          {
            id: createCardId("card-3"),
            definitionId: "plains",
            owner: player1,
            controller: player1,
            zone: deckZone,
            position: 0,
            tapped: false,
            flipped: true,
            revealed: false,
            phased: false,
          },
          // Public play zone (should be visible)
          {
            id: createCardId("card-4"),
            definitionId: "island",
            owner: player2,
            controller: player2,
            zone: playZone,
            tapped: false,
            flipped: true,
            revealed: false,
            phased: false,
          },
          // Face-down card (should be hidden)
          {
            id: createCardId("card-5"),
            definitionId: "swamp",
            owner: player1,
            controller: player1,
            zone: playZone,
            tapped: false,
            flipped: false,
            revealed: false,
            phased: false,
          },
        ],
      };

      const config: PlayerViewConfig = {
        zoneVisibility: {
          hand: "private",
          deck: "secret",
          play: "public",
        },
      };

      const view = createPlayerView(state, player1, config);

      // Player 1's hand: visible
      expect(view.cards[0].definitionId).toBe("forest");

      // Player 2's hand: hidden
      expect(view.cards[1].definitionId).toBe("__hidden__");

      // Player 1's deck: hidden
      expect(view.cards[2].definitionId).toBe("__hidden__");

      // Public play zone: visible
      expect(view.cards[3].definitionId).toBe("island");

      // Face-down card: hidden
      expect(view.cards[4].definitionId).toBe("__hidden__");
    });
  });
});
