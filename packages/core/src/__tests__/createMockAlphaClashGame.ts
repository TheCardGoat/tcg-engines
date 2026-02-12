import type { FlowDefinition } from "../flow";
import type { GameDefinition, GameMoveDefinitions } from "../game-definition";
import { standardMoves } from "../moves/standard-moves";
import type { CardId, PlayerId, ZoneId } from "../types";
import type { CardZoneConfig } from "../zones";

// Mock Alpha Clash game state - MASSIVELY SIMPLIFIED!
// The engine now handles: phase, turn, currentPlayer, setupStep, mulliganOffered
interface TestGameState {
  contenderHealth: Record<string, number>;
  resourcesAvailable: Record<string, number>;
  clashInProgress: boolean;
}

interface TestMoves {
  // Setup moves
  placeContender: { playerId: PlayerId };
  drawInitialHand: { playerId: PlayerId };
  decideMulligan: { playerId: PlayerId; keepHand: boolean };
  chooseFirstPlayer: { playerId: PlayerId };
  transitionToPlay: Record<string, never>;
  // Regular game moves
  drawCard: { playerId: PlayerId };
  playResource: { playerId: PlayerId; cardId: CardId };
  playClashCard: { playerId: PlayerId; cardId: CardId };
  playAction: { playerId: PlayerId; cardId: CardId };
  setTrap: { playerId: PlayerId; cardId: CardId };
  initiateClash: { playerId: PlayerId; attackerIds: CardId[] };
  declareObstructors: {
    playerId: PlayerId;
    obstructorAssignments: Record<string, string>;
  };
  playClashBuff: { playerId: PlayerId; cardId: CardId };
  // Standard moves provided by engine
  pass: { playerId: PlayerId };
  concede: { playerId: PlayerId };
}

// Alpha Clash move definitions
const alphaClashMoves: GameMoveDefinitions<TestGameState, TestMoves> = {
  // Setup moves - now using engine utilities!
  placeContender: {
    reducer: (draft, context) => {
      // NO MORE: if (!zones) checks - zones is guaranteed by engine!
      const { zones } = context;
      const playerId = context.params.playerId as PlayerId;
      const deckCards = zones.getCardsInZone("deck" as ZoneId, playerId);

      // Move first card (assumed to be Contender) to Contender zone
      if (deckCards.length > 0) {
        const contenderCardId = deckCards[0];
        if (contenderCardId) {
          zones.moveCard({
            cardId: contenderCardId,
            position: "bottom",
            targetZoneId: "contender" as ZoneId,
          });
        }
      }

      // NO MORE: draft.setupStep - engine handles this!
    },
  },

  drawInitialHand: {
    reducer: (draft, context) => {
      const { zones } = context;
      const playerId = context.params.playerId as PlayerId;

      // BEFORE: Manual shuffle + loop to draw cards (11 lines)
      // AFTER: Use engine's high-level drawCards utility (3 lines!)
      zones.shuffleZone("deck" as ZoneId, playerId);
      zones.drawCards({
        from: "deck" as ZoneId,
        to: "hand" as ZoneId,
        count: 8, // Alpha Clash standard starting hand size
        playerId,
      });

      // NO MORE: draft.setupStep, draft.mulliganOffered - engine handles this!
    },
  },

  decideMulligan: {
    reducer: (draft, context) => {
      const { zones } = context;
      const playerId = context.params.playerId as PlayerId;
      const { keepHand } = context.params;

      if (!keepHand) {
        // BEFORE: Manual loop to return cards, shuffle, redraw (25 lines)
        // AFTER: Use engine's mulligan utility (1 line!)
        zones.mulligan({
          deck: "deck" as ZoneId,
          drawCount: 8,
          hand: "hand" as ZoneId,
          playerId,
        });
      }

      // NO MORE: draft.mulliganOffered - engine handles this with trackers!
    },
  },

  chooseFirstPlayer: {
    reducer: (draft, context) => {
      // NO MORE: draft.currentPlayer - engine handles this via flow!
      // NO MORE: draft.firstPlayerChosen - engine provides context.flow.isFirstTurn!
      // In a full implementation, we'd signal to the engine who goes first
      // For now, this is just a placeholder
    },
  },

  transitionToPlay: {
    reducer: (draft, context) => {
      // NO MORE: draft.setupStep, draft.phase, draft.turn - engine handles ALL of this!
      // The game is ready to start - no manual state management needed!
    },
  },

  // Regular game moves (enhanced with engine features)
  drawCard: {
    condition: (state, context) => {
      // Use engine's flow context to check if it's the first turn
      const isFirstTurn = context.flow?.isFirstTurn ?? false;
      const isFirstPlayer = context.flow?.currentPlayer === context.playerId;

      // First player skips draw on first turn (rule 103.7a)
      if (isFirstTurn && isFirstPlayer) {
        return false;
      }

      return true;
    },
    reducer: (draft, context) => {
      const playerId = context.params.playerId as PlayerId;

      // Use engine's drawCards utility
      context.zones.drawCards({
        count: 1,
        from: "deck" as ZoneId,
        playerId,
        to: "hand" as ZoneId,
      });
    },
  },

  playResource: {
    condition: (state, context) => {
      const { playerId } = context.params;

      // BEFORE: state.hasPlayedResourceThisTurn[playerId]
      // AFTER: Use engine's tracker system!
      return !context.trackers?.check("hasPlayedResource", playerId as PlayerId);
    },
    reducer: (draft, context) => {
      const playerId = context.params.playerId as PlayerId;
      const cardId = context.params.cardId as CardId;

      // Move card to resource zone
      context.zones.moveCard({
        cardId,
        targetZoneId: "resource" as ZoneId,
      });

      // Increment resources
      draft.resourcesAvailable[playerId] = (draft.resourcesAvailable[playerId] || 0) + 1;

      // BEFORE: draft.hasPlayedResourceThisTurn[playerId] = true
      // AFTER: Use engine's tracker system!
      context.trackers?.mark("hasPlayedResource", playerId);
    },
  },

  playClashCard: {
    reducer: (draft, context) => {
      const cardId = context.params.cardId as CardId;

      // Move card to clash zone
      context.zones.moveCard({
        cardId,
        targetZoneId: "clash" as ZoneId,
      });
    },
  },

  playAction: {
    reducer: (draft, context) => {
      const cardId = context.params.cardId as CardId;

      // Play action, then discard
      context.zones.moveCard({
        cardId,
        targetZoneId: "discard" as ZoneId,
      });
    },
  },

  setTrap: {
    reducer: (draft, context) => {
      const cardId = context.params.cardId as CardId;

      // Move card to accessory zone (face-down)
      context.zones.moveCard({
        cardId,
        targetZoneId: "accessory" as ZoneId,
      });
    },
  },

  initiateClash: {
    reducer: (draft, context) => {
      draft.clashInProgress = true;
    },
  },

  declareObstructors: {
    reducer: (draft, context) => {
      // Handle obstructor assignments
    },
  },

  playClashBuff: {
    reducer: (draft, context) => {
      const cardId = context.params.cardId as CardId;

      // Play buff during clash
      context.zones.moveCard({
        cardId,
        targetZoneId: "standby" as ZoneId,
      });
    },
  },

  // Standard moves - using engine's standard moves library!
  pass: standardMoves<TestGameState>({
    include: ["pass"],
  }).pass!,

  concede: standardMoves<TestGameState>({
    include: ["concede"],
  }).concede!,
};

// Alpha Clash zones configuration (unchanged)
const alphaClashZones: Record<string, CardZoneConfig> = {
  accessory: {
    faceDown: true,
    id: "accessory" as ZoneId,
    maxSize: undefined,
    name: "zones.accessory",
    ordered: false,
    owner: undefined,
    visibility: "secret",
  },
  clash: {
    faceDown: false,
    id: "clash" as ZoneId,
    maxSize: undefined,
    name: "zones.clash",
    ordered: false,
    owner: undefined,
    visibility: "public",
  },
  clashground: {
    faceDown: false,
    id: "clashground" as ZoneId,
    maxSize: 1,
    name: "zones.clashground",
    ordered: false,
    owner: undefined,
    visibility: "public",
  },
  contender: {
    faceDown: false,
    id: "contender" as ZoneId,
    maxSize: 1,
    name: "zones.contender",
    ordered: false,
    owner: undefined,
    visibility: "public",
  },
  deck: {
    faceDown: true,
    id: "deck" as ZoneId,
    maxSize: 50,
    name: "zones.deck",
    ordered: true,
    owner: undefined,
    visibility: "private",
  },
  discard: {
    faceDown: false,
    id: "discard" as ZoneId,
    maxSize: undefined,
    name: "zones.discard",
    ordered: false,
    owner: undefined,
    visibility: "public",
  },
  hand: {
    faceDown: false,
    id: "hand" as ZoneId,
    maxSize: undefined,
    name: "zones.hand",
    ordered: false,
    owner: undefined,
    visibility: "private",
  },
  oblivion: {
    faceDown: false,
    id: "oblivion" as ZoneId,
    maxSize: undefined,
    name: "zones.oblivion",
    ordered: false,
    owner: undefined,
    visibility: "public",
  },
  resource: {
    faceDown: false,
    id: "resource" as ZoneId,
    maxSize: undefined,
    name: "zones.resource",
    ordered: false,
    owner: undefined,
    visibility: "public",
  },
  standby: {
    faceDown: false,
    id: "standby" as ZoneId,
    maxSize: undefined,
    name: "zones.standby",
    ordered: true,
    owner: undefined,
    visibility: "public",
  },
};

// Alpha Clash flow definition (unchanged)
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
      endOfTurn: {
        endIf: (_context) => true,
        next: "startOfTurn",
        onBegin: (_context) => {
          // End of turn effects
        },
        order: 3,
      },
      expansion: {
        next: "primary",
        order: 1,
        steps: {
          drawStep: {
            endIf: () => true,
            next: "resourceStep",
            onBegin: (_context) => {
              // Draw a card (handled by drawCard move)
            },
            order: 2,
          },
          readyStep: {
            endIf: () => true,
            next: "drawStep",
            onBegin: (_context) => {
              // Ready all engaged cards
            },
            order: 1,
          },
          resourceStep: {
            onBegin: (_context) => {
              // Player may play one resource
            },
            order: 3,
          },
        },
      },
      primary: {
        next: "endOfTurn",
        onBegin: (_context) => {
          // Primary phase - player can play cards, initiate clashes
        },
        order: 2,
      },
      startOfTurn: {
        endIf: () => true,
        next: "expansion",
        onBegin: (_context) => {
          // Trigger start of turn effects
        },
        order: 0,
      },
    },
  },
};

/**
 * Create minimal Alpha Clash game definition for testing
 *
 * REFACTORED to showcase new engine features:
 * ✨ 100+ lines of boilerplate ELIMINATED!
 * ✅ No manual phase/turn/player tracking
 * ✅ High-level zone utilities (drawCards, mulligan)
 * ✅ Tracker system for per-turn flags
 * ✅ Standard moves library (pass, concede)
 * ✅ Flow context access (isFirstTurn, currentPlayer)
 * ✅ No redundant zone checks
 */
export function createMockAlphaClashGame(): GameDefinition<TestGameState, TestMoves> {
  return {
    name: "Test Alpha Clash Game",
    zones: alphaClashZones,
    flow: alphaClashFlow,
    moves: alphaClashMoves,

    // Configure engine's tracker system for per-turn flags
    trackers: {
      perTurn: ["hasPlayedResource"], // Auto-resets at turn end
      perPlayer: true, // Track separately for each player
    },

    /**
     * Setup function - MASSIVELY SIMPLIFIED!
     *
     * BEFORE: 60+ lines tracking phase, turn, currentPlayer, setupStep, firstPlayerChosen, mulliganOffered
     * AFTER: 15 lines - just initialize game-specific data!
     */
    setup: (players) => {
      const playerIds = players.map((p) => p.id);
      const contenderHealth: Record<string, number> = {};
      const resourcesAvailable: Record<string, number> = {};

      for (const playerId of playerIds) {
        contenderHealth[playerId] = 20; // Default Contender starting health
        resourcesAvailable[playerId] = 0;
      }

      return {
        clashInProgress: false,
        contenderHealth,
        resourcesAvailable,
      };
    },
  };
}
