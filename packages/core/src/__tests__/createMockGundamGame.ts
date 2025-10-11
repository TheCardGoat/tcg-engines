import type { FlowDefinition } from "../flow";
import type { GameDefinition, GameMoveDefinitions } from "../game-definition";
import type { CardId, PlayerId, ZoneId } from "../types";
import type { CardZoneConfig } from "../zones";

// Mock Gundam game state
type TestGameState = {
  phase: "setup" | "start" | "draw" | "resource" | "main" | "end" | "gameOver";
  setupStep?:
    | "initializing"
    | "shields"
    | "tokens"
    | "draw"
    | "mulligan"
    | "complete";
  turn: number;
  currentPlayer: string;
  activeResources: Record<string, number>;
  attackedThisTurn: string[];
  hasPlayedResourceThisTurn: Record<string, boolean>;
  mulliganOffered: Record<string, boolean>;
};

type TestMoves = {
  // Setup moves
  initializeDecks: { playerId: string };
  placeShields: { playerId: string };
  createTokens: { playerId: string; playerIndex?: number };
  drawInitialHand: { playerId: string };
  decideMulligan: { playerId: string; redraw: boolean };
  transitionToPlay: Record<string, never>;
  // Regular game moves
  draw: { playerId: string; count: number };
  deployUnit: { playerId: string; cardId: string; position?: number };
  deployBase: { playerId: string; cardId: string };
  playResource: { playerId: string; cardId: string };
  attack: { playerId: string; attackerId: string; targetId?: string };
  pass: { playerId: string };
  concede: { playerId: string };
};

// Gundam move definitions
const gundamMoves: GameMoveDefinitions<TestGameState, TestMoves> = {
  // Setup moves
  initializeDecks: {
    reducer: (draft, context) => {
      const { zones } = context;
      if (!zones) {
        throw new Error("Zone operations not available");
      }

      const playerId = context.params.playerId as PlayerId;

      // Create 50 main deck cards
      for (let i = 0; i < 50; i++) {
        const cardId = `${playerId}-deck-${i}` as CardId;
        zones.moveCard({
          cardId,
          targetZoneId: "deck" as ZoneId,
          position: "bottom",
        });
      }

      // Create 10 resource deck cards
      for (let i = 0; i < 10; i++) {
        const cardId = `${playerId}-resource-${i}` as CardId;
        zones.moveCard({
          cardId,
          targetZoneId: "resourceDeck" as ZoneId,
          position: "bottom",
        });
      }

      // Shuffle both decks
      zones.shuffleZone("deck" as ZoneId, playerId);
      zones.shuffleZone("resourceDeck" as ZoneId, playerId);

      draft.setupStep = "shields";
    },
  },

  placeShields: {
    reducer: (draft, context) => {
      const { zones } = context;
      if (!zones) {
        throw new Error("Zone operations not available");
      }

      const playerId = context.params.playerId as PlayerId;
      const deckCards = zones.getCardsInZone("deck" as ZoneId, playerId);

      // Move 6 cards from top of deck to shield section
      for (let i = 0; i < 6; i++) {
        const cardId = deckCards[i];
        if (cardId) {
          zones.moveCard({
            cardId,
            targetZoneId: "shieldSection" as ZoneId,
            position: "bottom",
          });
        }
      }

      draft.setupStep = "tokens";
    },
  },

  createTokens: {
    reducer: (draft, context) => {
      const { zones } = context;
      if (!zones) {
        throw new Error("Zone operations not available");
      }

      const playerId = context.params.playerId as PlayerId;
      const playerIndex = context.params.playerIndex;

      // Create EX Base token for this player
      const baseTokenId = `${playerId}-token-ex-base` as CardId;
      zones.moveCard({
        cardId: baseTokenId,
        targetZoneId: "baseSection" as ZoneId,
        position: "bottom",
      });

      // Create EX Resource token only for Player 2 (second player)
      // According to Gundam rules, the second player gets an EX Resource token
      // to balance the first-player advantage
      const isSecondPlayer = playerIndex === 1;
      if (isSecondPlayer) {
        const resourceTokenId = `${playerId}-token-ex-resource` as CardId;
        zones.moveCard({
          cardId: resourceTokenId,
          targetZoneId: "resourceArea" as ZoneId,
          position: "bottom",
        });
      }

      draft.setupStep = "draw";
    },
  },

  drawInitialHand: {
    reducer: (draft, context) => {
      const { zones } = context;
      if (!zones) {
        throw new Error("Zone operations not available");
      }

      const playerId = context.params.playerId as PlayerId;
      const deckCards = zones.getCardsInZone("deck" as ZoneId, playerId);

      // Draw 5 cards from deck to hand
      for (let i = 0; i < 5; i++) {
        const cardId = deckCards[i];
        if (cardId) {
          zones.moveCard({
            cardId,
            targetZoneId: "hand" as ZoneId,
            position: "bottom",
          });
        }
      }

      draft.setupStep = "mulligan";
      draft.mulliganOffered[playerId] = true;
    },
  },

  decideMulligan: {
    reducer: (draft, context) => {
      const { zones } = context;
      if (!zones) {
        throw new Error("Zone operations not available");
      }

      const playerId = context.params.playerId as PlayerId;
      const redraw = context.params.redraw;

      if (redraw) {
        // Get all cards in hand
        const handCards = zones.getCardsInZone("hand" as ZoneId, playerId);

        // Move all hand cards back to deck
        for (const cardId of handCards) {
          zones.moveCard({
            cardId,
            targetZoneId: "deck" as ZoneId,
            position: "bottom",
          });
        }

        // Shuffle deck
        zones.shuffleZone("deck" as ZoneId, playerId);

        // Draw 5 new cards
        const deckCards = zones.getCardsInZone("deck" as ZoneId, playerId);
        for (let i = 0; i < 5; i++) {
          const cardId = deckCards[i];
          if (cardId) {
            zones.moveCard({
              cardId,
              targetZoneId: "hand" as ZoneId,
              position: "bottom",
            });
          }
        }
      }

      // Mark mulligan as complete for this player
      draft.mulliganOffered[playerId] = false;
    },
  },

  transitionToPlay: {
    reducer: (draft) => {
      draft.setupStep = "complete";
      draft.phase = "start";
    },
  },

  // Regular game moves
  draw: {
    reducer: () => {},
  },
  deployUnit: {
    reducer: () => {},
  },
  deployBase: {
    reducer: () => {},
  },
  playResource: {
    reducer: () => {},
  },
  attack: {
    reducer: () => {},
  },
  pass: {
    reducer: () => {},
  },
  concede: {
    reducer: () => {},
  },
};

// Gundam zone IDs
// Gundam zones configuration
const gundamZones: Record<string, CardZoneConfig> = {
  deck: {
    id: "deck" as ZoneId,
    name: "zones.deck",
    visibility: "private",
    ordered: true,
    owner: undefined,
    faceDown: true,
    maxSize: 50,
  },
  resourceDeck: {
    id: "resourceDeck" as ZoneId,
    name: "zones.resourceDeck",
    visibility: "private",
    ordered: true,
    owner: undefined,
    faceDown: true,
    maxSize: 10,
  },
  hand: {
    id: "hand" as ZoneId,
    name: "zones.hand",
    visibility: "private",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: 10, // Hand limit enforced in end phase
  },
  battleArea: {
    id: "battleArea" as ZoneId,
    name: "zones.battleArea",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: 6, // Max 6 units
  },
  shieldSection: {
    id: "shieldSection" as ZoneId,
    name: "zones.shieldSection",
    visibility: "secret",
    ordered: false,
    owner: undefined,
    faceDown: true,
    maxSize: 6, // Start with 6 shields
  },
  baseSection: {
    id: "baseSection" as ZoneId,
    name: "zones.baseSection",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: 1, // Only 1 base at a time
  },
  resourceArea: {
    id: "resourceArea" as ZoneId,
    name: "zones.resourceArea",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: 15, // Max 15 resources
  },
  trash: {
    id: "trash" as ZoneId,
    name: "zones.trash",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: undefined,
  },
  removal: {
    id: "removal" as ZoneId,
    name: "zones.removal",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: undefined,
  },
};

// Gundam flow definition
const gundamFlow: FlowDefinition<TestGameState> = {
  turn: {
    initialPhase: "start",
    onBegin: (_context) => {
      // Turn begins - untap all units in start phase
    },
    onEnd: (_context) => {
      // Turn cleanup
    },
    phases: {
      start: {
        order: 0,
        next: "draw",
        onBegin: (_context) => {
          // Untap all cards, reset abilities
        },
        endIf: () => true, // Auto-advance
      },
      draw: {
        order: 1,
        next: "resource",
        onBegin: (_context) => {
          // Draw 1 card from deck
        },
        endIf: () => true, // Auto-advance after draw
      },
      resource: {
        order: 2,
        next: "main",
        // Player can optionally play 1 resource
        // No auto-end - player must pass
      },
      main: {
        order: 3,
        next: "end",
        // Main phase - deploy units, attack, activate abilities
        // No auto-end - player must pass
      },
      end: {
        order: 4,
        next: "start", // Loop back to start for next turn
        onBegin: (_context) => {
          // End of turn effects, hand limit check
        },
        endIf: (_context) => {
          // Auto-advance after end phase processing
          return true;
        },
      },
    },
  },
};

/**
 * Create minimal Gundam game definition for testing
 *
 * This demonstrates how the core engine handles Gundam's unique game start:
 * - Dual deck system (main deck + resource deck)
 * - Shield placement (6 face-down cards)
 * - Token creation (EX Base, EX Resource for P2)
 * - Initial hand draw (5 cards with mulligan option)
 */
export function createMockGundamGame(): GameDefinition<
  TestGameState,
  TestMoves
> {
  return {
    name: "Test Gundam Game",
    zones: gundamZones,
    flow: gundamFlow,
    moves: gundamMoves,
    /**
     * Setup function - called once at game initialization
     *
     * In a full implementation, this would:
     * 1. Create and shuffle both decks (50 main cards, 10 resource cards)
     * 2. Place 6 shields from deck to shieldSection (face-down)
     * 3. Create EX Base token in baseSection
     * 4. If Player 2, create EX Resource token in resourceArea
     * 5. Draw 5 cards to each player's hand
     * 6. Offer mulligan (shuffle hand back, draw 5 new cards)
     * 7. Transition to "start" phase for first turn
     *
     * For this minimal test, we just set the initial game state.
     */
    setup: (players) => {
      // Initialize player-specific data
      const playerIds = players.map((p) => p.id);
      const activeResources: Record<string, number> = {};
      const hasPlayedResourceThisTurn: Record<string, boolean> = {};
      const mulliganOffered: Record<string, boolean> = {};

      for (const playerId of playerIds) {
        activeResources[playerId] = 0;
        hasPlayedResourceThisTurn[playerId] = false;
        mulliganOffered[playerId] = false;
      }

      return {
        phase: "setup",
        setupStep: "initializing",
        turn: 1,
        currentPlayer: playerIds[0] || "p1",
        activeResources,
        attackedThisTurn: [],
        hasPlayedResourceThisTurn,
        mulliganOffered,
      };
    },
  };
}
