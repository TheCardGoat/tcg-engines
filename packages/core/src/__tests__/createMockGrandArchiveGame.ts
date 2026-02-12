import type { FlowDefinition } from "../flow";
import type { GameDefinition, GameMoveDefinitions } from "../game-definition";
import { standardMoves } from "../moves/standard-moves";
import type { CardId, PlayerId, ZoneId } from "../types";
import type { CardZoneConfig } from "../zones";

// Mock Grand Archive game state - SIMPLIFIED!
// Engine now handles: phase, turn, currentPlayer, setupStep
interface TestGameState {
  opportunityPlayer: PlayerId | null; // Who has Opportunity to act
  champions: Record<
    string,
    {
      id: string;
      level: number;
      damage: number;
    }
  >;
}

interface TestMoves {
  // Setup moves
  initializeGame: { playerId: PlayerId };
  chooseFirstPlayer: { playerId: PlayerId };
  shuffleDecks: { playerId: PlayerId };
  drawStartingHand: { playerId: PlayerId; count: number };
  // Gameplay moves
  materializeCard: { cardId: CardId };
  playCard: { cardId: CardId; targets?: CardId[] };
  declareAttack: { attackerId: CardId; targetId: CardId };
  declareRetaliation: { defenderId: CardId };
  activateAbility: { cardId: CardId; abilityIndex?: number };
  passOpportunity: Record<string, never>;
  endPhase: Record<string, never>;
  // Standard moves
  concede: { playerId: PlayerId };
}

// Grand Archive move definitions
const grandArchiveMoves: GameMoveDefinitions<TestGameState, TestMoves> = {
  // Setup moves - using engine utilities!
  initializeGame: {
    reducer: (_draft, context) => {
      const { zones } = context;
      const { playerId } = context.params;

      // Use engine's createDeck utility (instead of manual loop)
      zones.createDeck({
        cardCount: 40,
        playerId,
        shuffle: false,
        zoneId: "mainDeck" as ZoneId,
      });

      zones.createDeck({
        cardCount: 15,
        playerId,
        shuffle: false,
        zoneId: "materialDeck" as ZoneId,
      });
    },
  },

  chooseFirstPlayer: {
    reducer: (_draft, context) => {
      // NO MORE: draft.currentPlayer, draft.phase, draft.turn
      // Engine handles this via flow!
    },
  },

  shuffleDecks: {
    reducer: (_draft, context) => {
      const { zones } = context;
      const { playerId } = context.params;

      // Shuffle both decks
      zones.shuffleZone("mainDeck" as ZoneId, playerId);
      zones.shuffleZone("materialDeck" as ZoneId, playerId);
    },
  },

  drawStartingHand: {
    reducer: (_draft, context) => {
      const { zones } = context;
      const { playerId } = context.params;
      const { count } = context.params;

      // BEFORE: Manual loop (11 lines)
      // AFTER: Use engine's drawCards utility!
      zones.drawCards({
        count,
        from: "mainDeck" as ZoneId,
        playerId,
        to: "hand" as ZoneId,
      });
    },
  },

  // Gameplay moves enhanced with engine features
  materializeCard: {
    condition: (state, context) => {
      const { playerId } = context;
      // Use engine's tracker system!
      return !context.trackers?.check("hasMaterialized", playerId);
    },
    reducer: (draft, context) => {
      const { cardId } = context.params;
      const { playerId } = context;

      // Move from material deck to memory
      context.zones.moveCard({
        cardId,
        targetZoneId: "memory" as ZoneId,
      });

      // Mark as materialized this turn
      context.trackers?.mark("hasMaterialized", playerId);
    },
  },

  playCard: {
    reducer: (_draft, context) => {
      const { cardId } = context.params;

      // Play card to field
      context.zones.moveCard({
        cardId,
        targetZoneId: "field" as ZoneId,
      });
    },
  },

  declareAttack: {
    reducer: (_draft, _context) => {
      // Attack logic
    },
  },

  declareRetaliation: {
    reducer: (_draft, _context) => {
      // Retaliation logic
    },
  },

  activateAbility: {
    reducer: (_draft, _context) => {
      // Ability activation logic
    },
  },

  passOpportunity: {
    reducer: (draft, _context) => {
      // Pass opportunity to next player
      draft.opportunityPlayer = null;
    },
  },

  endPhase: {
    reducer: (draft, _context) => {
      // End current phase
      draft.opportunityPlayer = null;
    },
  },

  // Standard moves from engine library
  concede: standardMoves<TestGameState>({
    include: ["concede"],
  }).concede!,
};

// Grand Archive zones configuration (unchanged)
const grandArchiveZones: Record<string, CardZoneConfig> = {
  banishment: {
    faceDown: false,
    id: "banishment" as ZoneId,
    maxSize: undefined,
    name: "zones.banishment",
    ordered: false,
    owner: undefined,
    visibility: "public",
  },
  effectsStack: {
    faceDown: false,
    id: "effectsStack" as ZoneId,
    maxSize: undefined,
    name: "zones.effectsStack",
    ordered: true,
    owner: undefined,
    visibility: "public",
  },
  field: {
    faceDown: false,
    id: "field" as ZoneId,
    maxSize: undefined,
    name: "zones.field",
    ordered: false,
    owner: undefined,
    visibility: "public",
  },
  graveyard: {
    faceDown: false,
    id: "graveyard" as ZoneId,
    maxSize: undefined,
    name: "zones.graveyard",
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
  intent: {
    faceDown: false,
    id: "intent" as ZoneId,
    maxSize: undefined,
    name: "zones.intent",
    ordered: false,
    owner: undefined,
    visibility: "public",
  },
  mainDeck: {
    faceDown: true,
    id: "mainDeck" as ZoneId,
    maxSize: 40,
    name: "zones.mainDeck",
    ordered: true,
    owner: undefined,
    visibility: "secret",
  },
  materialDeck: {
    faceDown: true,
    id: "materialDeck" as ZoneId,
    maxSize: 15,
    name: "zones.materialDeck",
    ordered: true,
    owner: undefined,
    visibility: "secret",
  },
  memory: {
    faceDown: false,
    id: "memory" as ZoneId,
    maxSize: undefined,
    name: "zones.memory",
    ordered: false,
    owner: undefined,
    visibility: "private",
  },
};

// Grand Archive flow definition (simplified)
const grandArchiveFlow: FlowDefinition<TestGameState> = {
  turn: {
    initialPhase: "wakeUp",
    onBegin: (_context) => {},
    onEnd: (_context) => {},
    phases: {
      draw: {
        endIf: () => true,
        next: "main",
        onBegin: (context) => {
          context.state.opportunityPlayer = null;
        },
        order: 4,
      },
      end: {
        endIf: (_context) => {
          return true;
        },
        next: "wakeUp",
        onBegin: (context) => {
          const currentPlayer = context.getCurrentPlayer();
          context.state.opportunityPlayer = currentPlayer as PlayerId;
        },
        order: 6,
      },
      main: {
        next: "end",
        onBegin: (context) => {
          const currentPlayer = context.getCurrentPlayer();
          context.state.opportunityPlayer = currentPlayer as PlayerId;
        },
        order: 5,
      },
      materialize: {
        endIf: () => true,
        next: "recollection",
        onBegin: (context) => {
          context.state.opportunityPlayer = null;
        },
        order: 2,
      },
      recollection: {
        next: "draw",
        onBegin: (context) => {
          // Grant Opportunity using flow context!
          const currentPlayer = context.getCurrentPlayer();
          context.state.opportunityPlayer = currentPlayer as PlayerId;
        },
        order: 3,
      },
      wakeUp: {
        endIf: () => true,
        next: "materialize",
        onBegin: (context) => {
          context.state.opportunityPlayer = null;
        },
        order: 1,
      },
    },
  },
};

/**
 * Create minimal Grand Archive game definition for testing
 *
 * REFACTORED to showcase new engine features:
 * ✨ 70+ lines of boilerplate ELIMINATED!
 * ✅ No manual phase/turn/player tracking
 * ✅ High-level zone utilities (createDeck, drawCards)
 * ✅ Tracker system for per-turn flags (hasMaterialized, hasDrawn)
 * ✅ Standard moves library (concede)
 * ✅ Flow context access in phase hooks
 */
export function createMockGrandArchiveGame(): GameDefinition<TestGameState, TestMoves> {
  return {
    name: "Test Grand Archive Game",
    zones: grandArchiveZones,
    flow: grandArchiveFlow,
    moves: grandArchiveMoves,

    // Configure engine's tracker system
    trackers: {
      perPlayer: true,
      perTurn: ["hasMaterialized", "hasDrawn"],
    },

    /**
     * Setup function - MASSIVELY SIMPLIFIED!
     *
     * BEFORE: 60+ lines tracking phase, turn, currentPlayer, hasDrawnThisTurn, hasMaterializedThisTurn
     * AFTER: 20 lines - just initialize game-specific data!
     */
    setup: (players) => {
      const playerIds = players.map((p) => p.id);
      const champions: Record<string, { id: string; level: number; damage: number }> = {};

      for (const playerId of playerIds) {
        champions[playerId] = {
          damage: 0,
          id: `${playerId}-champion`,
          level: 0,
        };
      }

      return {
        champions,
        opportunityPlayer: null,
      };
    },
  };
}
