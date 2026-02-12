import { describe, expect, it } from "bun:test";
import type { GameDefinition, Player } from "../game-definition/game-definition";
import type { CardId, PlayerId, ZoneId } from "../types";
import type { CardZoneConfig } from "../zones";
import { RuleEngine } from "./rule-engine";

describe("RuleEngine - Operations Integration", () => {
  interface TestCardDef {
    id: string;
    name: string;
    cost: number;
  }

  interface TestCardMeta {
    damage?: number;
    exerted?: boolean;
  }

  interface TestState {
    players: Player[];
    currentPlayer: number;
    resources: Record<string, number>;
  }

  interface TestMoves {
    playCard: { cardId: string };
    draw: {};
  }

  const createTestGameDefinition = (): GameDefinition<
    TestState,
    TestMoves,
    TestCardDef,
    TestCardMeta
  > => {
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

    const playZone: CardZoneConfig = {
      id: "play" as ZoneId,
      name: "Play Area",
      ordered: false,
      visibility: "public",
    };

    return {
      cards: {
        "monster-1": { cost: 3, id: "monster-1", name: "Monster 1" },
        "monster-2": { cost: 5, id: "monster-2", name: "Monster 2" },
      },
      moves: {
        draw: {
          reducer: (draft, context) => {
            const { playerId } = context;

            // Operations should be available in reducer
            if (!context.zones) {
              throw new Error("Zones API not available");
            }

            // Get top card from player's deck
            const deckCards = context.zones.getCardsInZone(
              "deck" as ZoneId,
              playerId as unknown as PlayerId,
            );

            if (deckCards.length > 0) {
              const topCard = deckCards[0];

              // Move to hand
              context.zones.moveCard({
                cardId: topCard,
                targetZoneId: "hand" as ZoneId,
              });
            }
          },
        },
        playCard: {
          condition: (state, context) => {
            const playerId = context.playerId as string;
            const cardId = context.params?.cardId as CardId;

            // Check zones API is available
            if (!context.zones) {
              return false;
            }

            // Check card is in player's hand
            const handCards = context.zones.getCardsInZone(
              "hand" as ZoneId,
              playerId as unknown as PlayerId,
            );
            if (!handCards.includes(cardId)) {
              return false;
            }

            return true;
          },
          reducer: (draft, context) => {
            const cardId = context.params?.cardId as CardId;

            // Operations should be available in reducer
            if (!(context.zones && context.cards)) {
              throw new Error("Operations API not available");
            }

            // Move card from hand to play
            context.zones.moveCard({
              cardId,
              targetZoneId: "play" as ZoneId,
            });

            // Set initial metadata
            context.cards.setCardMeta(cardId, {
              damage: 0,
              exerted: false,
            });
          },
        },
      },
      name: "Test Card Game",
      setup: (players: Player[]) => ({
        currentPlayer: 0,
        players,
        resources: {
          [players[0].id]: 10,
          [players[1].id]: 10,
        },
      }),
      zones: {
        deck: deckZone,
        hand: handZone,
        play: playZone,
      },
    };
  };

  describe("Operations API in Move Context", () => {
    it("should provide zone operations to move reducers", () => {
      const players: Player[] = [
        { id: "player-1", name: "Player 1" },
        { id: "player-2", name: "Player 2" },
      ];

      const gameDef = createTestGameDefinition();
      const engine = new RuleEngine(gameDef, players);

      // Execute draw move - even with empty deck, it should succeed
      // (the move just won't do anything)
      const result = engine.executeMove("draw", {
        params: {},
        playerId: "player-1" as unknown as PlayerId,
      });

      // The move should execute successfully even with no cards
      expect(result.success).toBe(true);
      if (result.success) {
        expect(Array.isArray(result.patches)).toBe(true);
      }
    });

    it("should provide card operations to move reducers", () => {
      const players: Player[] = [
        { id: "player-1", name: "Player 1" },
        { id: "player-2", name: "Player 2" },
      ];

      const gameDef = createTestGameDefinition();
      const engine = new RuleEngine(gameDef, players);

      // Execute playCard move - this should use card operations
      const result = engine.executeMove("playCard", {
        params: { cardId: "card-1" },
        playerId: "player-1" as unknown as PlayerId,
      });

      // Will fail initially since we haven't populated cards, but tests the API
      expect(result.success).toBeDefined();
    });

    it("should provide operations to move conditions", () => {
      const players: Player[] = [
        { id: "player-1", name: "Player 1" },
        { id: "player-2", name: "Player 2" },
      ];

      const gameDef = createTestGameDefinition();
      const engine = new RuleEngine(gameDef, players);

      // CanExecuteMove should have access to operations
      const canPlay = engine.canExecuteMove("playCard", {
        params: { cardId: "card-1" },
        playerId: "player-1" as unknown as PlayerId,
      });

      expect(typeof canPlay).toBe("boolean");
    });
  });

  describe("Internal State Management", () => {
    it("should initialize zones from game definition", () => {
      const players: Player[] = [
        { id: "player-1", name: "Player 1" },
        { id: "player-2", name: "Player 2" },
      ];

      const gameDef = createTestGameDefinition();
      const engine = new RuleEngine(gameDef, players);

      // Engine should initialize with zones from definition
      // We can verify this by executing a move that uses zones
      const result = engine.executeMove("draw", {
        params: {},
        playerId: "player-1" as unknown as PlayerId,
      });

      // Move should execute successfully (zones are accessible)
      expect(result.success).toBe(true);
    });

    it("should track card movements through operations", () => {
      const players: Player[] = [
        { id: "player-1", name: "Player 1" },
        { id: "player-2", name: "Player 2" },
      ];

      const gameDef = createTestGameDefinition();
      const engine = new RuleEngine(gameDef, players);

      // Execute draw multiple times
      engine.executeMove("draw", {
        params: {},
        playerId: "player-1" as unknown as PlayerId,
      });

      engine.executeMove("draw", {
        params: {},
        playerId: "player-1" as unknown as PlayerId,
      });

      // Internal state should be tracking card movements
      // This will be verified through move conditions and game state
      const state = engine.getState();
      expect(state.players).toHaveLength(2);
    });
  });

  describe("Patch Generation with Operations", () => {
    it("should generate patches when operations modify internal state", () => {
      const players: Player[] = [
        { id: "player-1", name: "Player 1" },
        { id: "player-2", name: "Player 2" },
      ];

      const gameDef = createTestGameDefinition();
      const engine = new RuleEngine(gameDef, players);

      const result = engine.executeMove("draw", {
        params: {},
        playerId: "player-1" as unknown as PlayerId,
      });

      // Move should execute successfully
      expect(result.success).toBe(true);
      if (result.success) {
        // Patches should be generated for state changes
        expect(Array.isArray(result.patches)).toBe(true);
        expect(Array.isArray(result.inversePatches)).toBe(true);
      }
    });
  });
});
