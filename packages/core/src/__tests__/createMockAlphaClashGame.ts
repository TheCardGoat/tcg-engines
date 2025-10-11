import type { FlowDefinition } from "../flow";
import type { GameDefinition, GameMoveDefinitions } from "../game-definition";
import type { CardId, PlayerId, ZoneId } from "../types";
import type { CardZoneConfig } from "../zones";

// Mock Alpha Clash game state
type TestGameState = {
  phase:
    | "setup"
    | "startOfTurn"
    | "expansion"
    | "primary"
    | "clash"
    | "endOfTurn"
    | "gameOver";
  setupStep?:
    | "initializing"
    | "placeContender"
    | "shuffleDeck"
    | "drawInitialHand"
    | "mulligan"
    | "complete";
  turn: number;
  currentPlayer: string;
  firstPlayerChosen: boolean;
  mulliganOffered: Record<string, boolean>;
  contenderHealth: Record<string, number>;
  resourcesAvailable: Record<string, number>;
  hasPlayedResourceThisTurn: Record<string, boolean>;
  clashInProgress: boolean;
};

type TestMoves = {
  // Setup moves
  placeContender: { playerId: string };
  drawInitialHand: { playerId: string };
  decideMulligan: { playerId: string; keepHand: boolean };
  chooseFirstPlayer: { playerId: string };
  transitionToPlay: Record<string, never>;
  // Regular game moves
  drawCard: { playerId: string };
  playResource: { playerId: string; cardId: string };
  playClashCard: { playerId: string; cardId: string };
  playAction: { playerId: string; cardId: string };
  setTrap: { playerId: string; cardId: string };
  initiateClash: { playerId: string; attackerIds: string[] };
  declareObstructors: { playerId: string; obstructorAssignments: Record<string, string> };
  playClashBuff: { playerId: string; cardId: string };
  pass: { playerId: string };
  concede: { playerId: string };
};

// Alpha Clash move definitions
const alphaClashMoves: GameMoveDefinitions<TestGameState, TestMoves> = {
  // Setup moves
  placeContender: {
    reducer: (draft, context) => {
      const { zones } = context;
      if (!zones) {
        throw new Error("Zone operations not available");
      }

      const playerId = context.params.playerId as PlayerId;
      const deckCards = zones.getCardsInZone("deck" as ZoneId, playerId);

      // Move first card (assumed to be Contender) to Contender zone
      if (deckCards.length > 0) {
        const contenderCardId = deckCards[0];
        if (contenderCardId) {
          zones.moveCard({
            cardId: contenderCardId,
            targetZoneId: "contender" as ZoneId,
            position: "bottom",
          });
        }
      }

      draft.setupStep = "shuffleDeck";
    },
  },

  drawInitialHand: {
    reducer: (draft, context) => {
      const { zones } = context;
      if (!zones) {
        throw new Error("Zone operations not available");
      }

      const playerId = context.params.playerId as PlayerId;

      // Shuffle deck first
      zones.shuffleZone("deck" as ZoneId, playerId);

      const deckCards = zones.getCardsInZone("deck" as ZoneId, playerId);

      // Draw 8 cards (Alpha Clash standard starting hand size from rule 103.5)
      for (let i = 0; i < 8; i++) {
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
      const keepHand = context.params.keepHand;

      if (!keepHand) {
        // Get all cards in hand
        const handCards = zones.getCardsInZone("hand" as ZoneId, playerId);

        // Move hand cards back to deck
        for (const cardId of handCards) {
          zones.moveCard({
            cardId,
            targetZoneId: "deck" as ZoneId,
            position: "bottom",
          });
        }

        // Shuffle deck
        zones.shuffleZone("deck" as ZoneId, playerId);

        // Draw same number of cards back
        const deckCards = zones.getCardsInZone("deck" as ZoneId, playerId);
        const drawCount = handCards.length;
        for (let i = 0; i < drawCount; i++) {
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

  chooseFirstPlayer: {
    reducer: (draft, context) => {
      const playerId = context.params.playerId;
      draft.currentPlayer = playerId;
      draft.firstPlayerChosen = true;
    },
  },

  transitionToPlay: {
    reducer: (draft) => {
      draft.setupStep = "complete";
      draft.phase = "startOfTurn";
      draft.turn = 1;
    },
  },

  // Regular game moves (stubs for testing)
  drawCard: {
    reducer: () => {},
  },
  playResource: {
    reducer: () => {},
  },
  playClashCard: {
    reducer: () => {},
  },
  playAction: {
    reducer: () => {},
  },
  setTrap: {
    reducer: () => {},
  },
  initiateClash: {
    reducer: () => {},
  },
  declareObstructors: {
    reducer: () => {},
  },
  playClashBuff: {
    reducer: () => {},
  },
  pass: {
    reducer: () => {},
  },
  concede: {
    reducer: () => {},
  },
};

// Alpha Clash zones configuration
const alphaClashZones: Record<string, CardZoneConfig> = {
  deck: {
    id: "deck" as ZoneId,
    name: "zones.deck",
    visibility: "private",
    ordered: true,
    owner: undefined,
    faceDown: true,
    maxSize: 50, // 50-card deck per rule 100.2
  },
  hand: {
    id: "hand" as ZoneId,
    name: "zones.hand",
    visibility: "private",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: undefined, // No hand size limit during game
  },
  contender: {
    id: "contender" as ZoneId,
    name: "zones.contender",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: 1, // Exactly one Contender per player
  },
  clash: {
    id: "clash" as ZoneId,
    name: "zones.clash",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: undefined, // No explicit limit on Clash cards in play
  },
  clashground: {
    id: "clashground" as ZoneId,
    name: "zones.clashground",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: 1, // Only one Clashground in play at any time per rule 302.2
  },
  accessory: {
    id: "accessory" as ZoneId,
    name: "zones.accessory",
    visibility: "secret", // Traps are set face-down per rule 304.1
    ordered: false,
    owner: undefined,
    faceDown: true,
    maxSize: undefined,
  },
  resource: {
    id: "resource" as ZoneId,
    name: "zones.resource",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: undefined,
  },
  discard: {
    id: "discard" as ZoneId,
    name: "zones.discard",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: undefined,
  },
  oblivion: {
    id: "oblivion" as ZoneId,
    name: "zones.oblivion",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: undefined,
  },
  standby: {
    id: "standby" as ZoneId,
    name: "zones.standby",
    visibility: "public",
    ordered: true, // Effects resolve in order
    owner: undefined,
    faceDown: false,
    maxSize: undefined,
  },
};

// Alpha Clash flow definition
const alphaClashFlow: FlowDefinition<TestGameState> = {
  turn: {
    initialPhase: "startOfTurn",
    onBegin: (_context) => {
      // Turn begins - handle start of turn effects
    },
    onEnd: (_context) => {
      // Turn cleanup
    },
    phases: {
      startOfTurn: {
        order: 0,
        next: "expansion",
        onBegin: (_context) => {
          // Trigger start of turn effects
        },
        endIf: () => true, // Auto-advance
      },
      expansion: {
        order: 1,
        next: "primary",
        segments: {
          readyStep: {
            order: 1,
            next: "drawStep",
            onBegin: (_context) => {
              // Ready all engaged cards
            },
            endIf: () => true, // Auto-advance
          },
          drawStep: {
            order: 2,
            next: "resourceStep",
            onBegin: (_context) => {
              // Draw a card (skip on first turn for first player per rule 103.7a)
            },
            endIf: () => true, // Auto-advance
          },
          resourceStep: {
            order: 3,
            onBegin: (_context) => {
              // Player may play one resource
            },
            // Player must pass to advance
          },
        },
      },
      primary: {
        order: 2,
        next: "endOfTurn",
        onBegin: (_context) => {
          // Primary phase - player can play cards, initiate clashes
        },
        // Player must pass to advance
      },
      endOfTurn: {
        order: 3,
        next: "startOfTurn", // Loop back to start for next turn
        onBegin: (_context) => {
          // End of turn effects
          // Remove "until end of turn" effects
          // Remove non-clash damage from Clash cards
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
 * Create minimal Alpha Clash game definition for testing
 *
 * This demonstrates how the core engine handles Alpha Clash's unique features:
 * - 50-card deck with exactly 1 Contender card
 * - Starting hand of 8 cards with one-time mulligan option
 * - Nine distinct zones including Contender, Clashground, Standby, and Oblivion
 * - Turn structure: Start of Turn → Expansion (Ready/Draw/Resource) → Primary → End of Turn
 * - First player skips Ready and Draw steps on their first turn
 * - Clash Phase with six distinct steps (Attack, Counter, Obstruct, Clash Buffs, Damage)
 */
export function createMockAlphaClashGame(): GameDefinition<
  TestGameState,
  TestMoves
> {
  return {
    name: "Test Alpha Clash Game",
    zones: alphaClashZones,
    flow: alphaClashFlow,
    moves: alphaClashMoves,
    /**
     * Setup function - called once at game initialization
     *
     * In a full implementation, this would:
     * 1. Each player places their Contender in the Contender Zone (face-up)
     * 2. Shuffle remaining decks (49 cards per player)
     * 3. Randomly determine first player
     * 4. Each player draws 8 cards (standard starting hand size per rule 103.5)
     * 5. Starting player declares mulligan first, then other players in turn order
     * 6. Players who mulligan shuffle any number of cards back and draw that many
     * 7. First player takes their turn, skipping Ready and Draw steps (rule 103.7a)
     *
     * For this minimal test, we set the initial game state.
     */
    setup: (players) => {
      // Initialize player-specific data
      const playerIds = players.map((p) => p.id);
      const contenderHealth: Record<string, number> = {};
      const resourcesAvailable: Record<string, number> = {};
      const hasPlayedResourceThisTurn: Record<string, boolean> = {};
      const mulliganOffered: Record<string, boolean> = {};

      for (const playerId of playerIds) {
        contenderHealth[playerId] = 20; // Default Contender starting health
        resourcesAvailable[playerId] = 0;
        hasPlayedResourceThisTurn[playerId] = false;
        mulliganOffered[playerId] = false;
      }

      return {
        phase: "setup",
        setupStep: "initializing",
        turn: 0,
        currentPlayer: playerIds[0] || "p1",
        firstPlayerChosen: false,
        mulliganOffered,
        contenderHealth,
        resourcesAvailable,
        hasPlayedResourceThisTurn,
        clashInProgress: false,
      };
    },
  };
}

