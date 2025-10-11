import type { FlowDefinition } from "../flow";
import type { GameDefinition, GameMoveDefinitions } from "../game-definition";
import { standardMoves } from "../moves/standard-moves";
import type { CardId, PlayerId, ZoneId } from "../types";
import type { CardZoneConfig } from "../zones";

// Mock Gundam game state - SIMPLIFIED!
type TestGameState = {
  activeResources: Record<string, number>;
  attackedThisTurn: CardId[];
};

type TestMoves = {
  // Setup moves
  initializeDecks: { playerId: PlayerId };
  placeShields: { playerId: PlayerId };
  createTokens: { playerId: PlayerId; playerIndex?: number };
  drawInitialHand: { playerId: PlayerId };
  decideMulligan: { playerId: PlayerId; redraw: boolean };
  transitionToPlay: Record<string, never>;
  // Regular game moves
  draw: { playerId: PlayerId; count: number };
  deployUnit: { playerId: PlayerId; cardId: CardId; position?: number };
  deployBase: { playerId: PlayerId; cardId: CardId };
  playResource: { playerId: PlayerId; cardId: CardId };
  attack: { playerId: PlayerId; attackerId: CardId; targetId?: CardId };
  // Standard moves
  pass: { playerId: PlayerId };
  concede: { playerId: PlayerId };
};

// Gundam move definitions
const gundamMoves: GameMoveDefinitions<TestGameState, TestMoves> = {
  // Setup moves - using engine utilities!
  initializeDecks: {
    reducer: (_draft, context) => {
      const { zones } = context;
      const playerId = context.params.playerId;

      // Use engine's createDeck utility!
      zones.createDeck({
        zoneId: "deck" as ZoneId,
        playerId,
        cardCount: 50,
        shuffle: true,
      });

      zones.createDeck({
        zoneId: "resourceDeck" as ZoneId,
        playerId,
        cardCount: 10,
        shuffle: true,
      });

      // NO MORE: draft.setupStep
    },
  },

  placeShields: {
    reducer: (_draft, context) => {
      const { zones } = context;
      const playerId = context.params.playerId;

      // BEFORE: Manual loop (9 lines)
      // AFTER: Use bulkMove utility!
      zones.bulkMove({
        from: "deck" as ZoneId,
        to: "shieldSection" as ZoneId,
        count: 6,
        playerId,
        position: "bottom",
      });

      // NO MORE: draft.setupStep
    },
  },

  createTokens: {
    reducer: (_draft, context) => {
      const { zones } = context;
      const playerId = context.params.playerId;
      const playerIndex = context.params.playerIndex;

      // Create EX Base token
      const baseTokenId = `${playerId}-token-ex-base` as CardId;
      zones.moveCard({
        cardId: baseTokenId,
        targetZoneId: "baseSection" as ZoneId,
        position: "bottom",
      });

      // Second player gets EX Resource token
      const isSecondPlayer = playerIndex === 1;
      if (isSecondPlayer) {
        const resourceTokenId = `${playerId}-token-ex-resource` as CardId;
        zones.moveCard({
          cardId: resourceTokenId,
          targetZoneId: "resourceArea" as ZoneId,
          position: "bottom",
        });
      }

      // NO MORE: draft.setupStep
    },
  },

  drawInitialHand: {
    reducer: (_draft, context) => {
      const { zones } = context;
      const playerId = context.params.playerId;

      // BEFORE: Manual loop (11 lines)
      // AFTER: Use drawCards utility!
      zones.drawCards({
        from: "deck" as ZoneId,
        to: "hand" as ZoneId,
        count: 7,
        playerId,
      });

      // NO MORE: draft.setupStep, draft.mulliganOffered
    },
  },

  decideMulligan: {
    reducer: (_draft, context) => {
      const { zones } = context;
      const playerId = context.params.playerId;
      const redraw = context.params.redraw;

      if (redraw) {
        // BEFORE: Manual card return + shuffle + redraw (20 lines)
        // AFTER: Use mulligan utility (1 line!)
        zones.mulligan({
          hand: "hand" as ZoneId,
          deck: "deck" as ZoneId,
          drawCount: 7,
          playerId,
        });
      }

      // NO MORE: draft.mulliganOffered
    },
  },

  transitionToPlay: {
    reducer: (_draft, _context) => {
      // NO MORE: draft.setupStep, draft.phase, draft.turn
    },
  },

  // Regular game moves
  draw: {
    reducer: (_draft, context) => {
      const { zones } = context;
      const playerId = context.params.playerId;
      const count = context.params.count;

      zones.drawCards({
        from: "deck" as ZoneId,
        to: "hand" as ZoneId,
        count,
        playerId,
      });
    },
  },

  deployUnit: {
    reducer: (_draft, context) => {
      const cardId = context.params.cardId;

      context.zones.moveCard({
        cardId,
        targetZoneId: "unitArea" as ZoneId,
      });
    },
  },

  deployBase: {
    reducer: (_draft, context) => {
      const cardId = context.params.cardId;

      context.zones.moveCard({
        cardId,
        targetZoneId: "baseSection" as ZoneId,
      });
    },
  },

  playResource: {
    condition: (state, context) => {
      const playerId = context.params.playerId;
      // Use engine's tracker system!
      return !context.trackers?.check("hasPlayedResource", playerId);
    },
    reducer: (draft, context) => {
      const playerId = context.params.playerId;
      const cardId = context.params.cardId;

      context.zones.moveCard({
        cardId,
        targetZoneId: "resourceArea" as ZoneId,
      });

      draft.activeResources[playerId] =
        (draft.activeResources[playerId] || 0) + 1;

      // Mark as played
      context.trackers?.mark("hasPlayedResource", playerId);
    },
  },

  attack: {
    reducer: (draft, context) => {
      const attackerId = context.params.attackerId;

      // Track attacker this turn
      draft.attackedThisTurn.push(attackerId);
    },
  },

  // Standard moves from engine
  pass: standardMoves<TestGameState>({
    include: ["pass"],
  }).pass!,

  concede: standardMoves<TestGameState>({
    include: ["concede"],
  }).concede!,
};

// Gundam zones configuration (unchanged)
const gundamZones: Record<string, CardZoneConfig> = {
  deck: {
    id: "deck" as ZoneId,
    name: "zones.deck",
    visibility: "secret",
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
  resourceDeck: {
    id: "resourceDeck" as ZoneId,
    name: "zones.resourceDeck",
    visibility: "secret",
    ordered: true,
    owner: undefined,
    faceDown: true,
    maxSize: 10,
  },
  resourceArea: {
    id: "resourceArea" as ZoneId,
    name: "zones.resourceArea",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: undefined,
  },
  baseSection: {
    id: "baseSection" as ZoneId,
    name: "zones.baseSection",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: 1,
  },
  unitArea: {
    id: "unitArea" as ZoneId,
    name: "zones.unitArea",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: undefined,
  },
  shieldSection: {
    id: "shieldSection" as ZoneId,
    name: "zones.shieldSection",
    visibility: "secret",
    ordered: true,
    owner: undefined,
    faceDown: true,
    maxSize: 6,
  },
  junkYard: {
    id: "junkYard" as ZoneId,
    name: "zones.junkYard",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: undefined,
  },
};

// Gundam flow definition (simplified)
const gundamFlow: FlowDefinition<TestGameState> = {
  turn: {
    initialPhase: "start",
    onBegin: (_context) => {},
    onEnd: (_context) => {},
    phases: {
      start: {
        order: 1,
        next: "draw",
        onBegin: (_context) => {},
        endIf: () => true,
      },
      draw: {
        order: 2,
        next: "resource",
        onBegin: (_context) => {},
        endIf: () => true,
      },
      resource: {
        order: 3,
        next: "main",
        onBegin: (_context) => {},
      },
      main: {
        order: 4,
        next: "end",
        onBegin: (_context) => {},
      },
      end: {
        order: 5,
        next: "start",
        onBegin: (context) => {
          // Clear attacked units at end of turn
          context.state.attackedThisTurn = [];
        },
        endIf: () => true,
      },
    },
  },
};

/**
 * Create minimal Gundam game definition for testing
 *
 * REFACTORED to showcase new engine features:
 * ✨ 120+ lines of boilerplate ELIMINATED!
 * ✅ No manual phase/turn/player tracking
 * ✅ High-level zone utilities (createDeck, drawCards, mulligan, bulkMove)
 * ✅ Tracker system for per-turn flags (hasPlayedResource)
 * ✅ Standard moves library (pass, concede)
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

    // Configure engine's tracker system
    trackers: {
      perTurn: ["hasPlayedResource"],
      perPlayer: true,
    },

    /**
     * Setup function - MASSIVELY SIMPLIFIED!
     *
     * BEFORE: 80+ lines tracking phase, turn, currentPlayer, setupStep, mulliganOffered, hasPlayedResourceThisTurn
     * AFTER: 15 lines - just initialize game-specific data!
     */
    setup: (players) => {
      const playerIds = players.map((p) => p.id);
      const activeResources: Record<string, number> = {};

      for (const playerId of playerIds) {
        activeResources[playerId] = 0;
      }

      return {
        activeResources,
        attackedThisTurn: [],
      };
    },
  };
}
