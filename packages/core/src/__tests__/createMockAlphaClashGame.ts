import type { FlowDefinition } from "../flow";
import type { GameDefinition, GameMoveDefinitions } from "../game-definition";
import { standardMoves } from "../moves/standard-moves";
import type { CardId, PlayerId, ZoneId } from "../types";
import type { CardZoneConfig } from "../zones";

// Mock Alpha Clash game state - MASSIVELY SIMPLIFIED!
// The engine now handles: phase, turn, currentPlayer, setupStep, mulliganOffered
type TestGameState = {
  contenderHealth: Record<string, number>;
  resourcesAvailable: Record<string, number>;
  clashInProgress: boolean;
};

type TestMoves = {
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
};

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
            targetZoneId: "contender" as ZoneId,
            position: "bottom",
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
      const keepHand = context.params.keepHand;

      if (!keepHand) {
        // BEFORE: Manual loop to return cards, shuffle, redraw (25 lines)
        // AFTER: Use engine's mulligan utility (1 line!)
        zones.mulligan({
          hand: "hand" as ZoneId,
          deck: "deck" as ZoneId,
          drawCount: 8,
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
        from: "deck" as ZoneId,
        to: "hand" as ZoneId,
        count: 1,
        playerId,
      });
    },
  },

  playResource: {
    condition: (state, context) => {
      const playerId = context.params.playerId;

      // BEFORE: state.hasPlayedResourceThisTurn[playerId]
      // AFTER: Use engine's tracker system!
      return !context.trackers?.check(
        "hasPlayedResource",
        playerId as PlayerId,
      );
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
      draft.resourcesAvailable[playerId] =
        (draft.resourcesAvailable[playerId] || 0) + 1;

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
  deck: {
    id: "deck" as ZoneId,
    name: "zones.deck",
    visibility: "private",
    ordered: true,
    owner: undefined,
    faceDown: true,
    maxSize: 50,
  },
  hand: {
    id: "hand" as ZoneId,
    name: "zones.hand",
    visibility: "private",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: undefined,
  },
  contender: {
    id: "contender" as ZoneId,
    name: "zones.contender",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: 1,
  },
  clash: {
    id: "clash" as ZoneId,
    name: "zones.clash",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: undefined,
  },
  clashground: {
    id: "clashground" as ZoneId,
    name: "zones.clashground",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: 1,
  },
  accessory: {
    id: "accessory" as ZoneId,
    name: "zones.accessory",
    visibility: "secret",
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
    ordered: true,
    owner: undefined,
    faceDown: false,
    maxSize: undefined,
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
      startOfTurn: {
        order: 0,
        next: "expansion",
        onBegin: (_context) => {
          // Trigger start of turn effects
        },
        endIf: () => true,
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
            endIf: () => true,
          },
          drawStep: {
            order: 2,
            next: "resourceStep",
            onBegin: (_context) => {
              // Draw a card (handled by drawCard move)
            },
            endIf: () => true,
          },
          resourceStep: {
            order: 3,
            onBegin: (_context) => {
              // Player may play one resource
            },
          },
        },
      },
      primary: {
        order: 2,
        next: "endOfTurn",
        onBegin: (_context) => {
          // Primary phase - player can play cards, initiate clashes
        },
      },
      endOfTurn: {
        order: 3,
        next: "startOfTurn",
        onBegin: (_context) => {
          // End of turn effects
        },
        endIf: (_context) => {
          return true;
        },
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
export function createMockAlphaClashGame(): GameDefinition<
  TestGameState,
  TestMoves
> {
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
        contenderHealth,
        resourcesAvailable,
        clashInProgress: false,
      };
    },
  };
}
