import type { FlowDefinition } from "../flow";
import type { GameDefinition, GameMoveDefinitions } from "../game-definition";
import type { CardId, PlayerId, ZoneId } from "../types";
import type { CardZoneConfig } from "../zones";

// Mock Grand Archive game state
type TestGameState = {
  phase:
    | "setup"
    | "wakeUp"
    | "materialize"
    | "recollection"
    | "draw"
    | "main"
    | "end"
    | "gameOver";
  turn: number;
  currentPlayer: string;
  opportunityPlayer: string | null; // Who has Opportunity to act
  champions: Record<
    string,
    {
      id: string;
      level: number;
      damage: number;
    }
  >;
  hasDrawnThisTurn: Record<string, boolean>;
  hasMaterializedThisTurn: Record<string, boolean>;
};

type TestMoves = {
  // Setup moves
  initializeGame: { playerId: string };
  chooseFirstPlayer: { playerId: string };
  shuffleDecks: { playerId: string };
  drawStartingHand: { playerId: string; count: number };
  // Gameplay moves
  materializeCard: { cardId: string };
  playCard: { cardId: string; targets?: string[] };
  declareAttack: { attackerId: string; targetId: string };
  declareRetaliation: { defenderId: string };
  activateAbility: { cardId: string; abilityIndex?: number };
  passOpportunity: Record<string, never>;
  endPhase: Record<string, never>;
  concede: Record<string, never>;
};

// Grand Archive move definitions
const grandArchiveMoves: GameMoveDefinitions<TestGameState, TestMoves> = {
  // Setup moves with basic implementations
  initializeGame: {
    reducer: (_draft, context) => {
      const { zones } = context;
      if (!zones) {
        throw new Error("Zone operations not available");
      }

      const playerId = context.params.playerId as PlayerId;

      // Create main deck cards (40 cards standard)
      for (let i = 0; i < 40; i++) {
        const cardId = `${playerId}-main-${i}` as CardId;
        zones.moveCard({
          cardId,
          targetZoneId: "mainDeck" as ZoneId,
          position: "bottom",
        });
      }

      // Create material deck cards (15 cards standard)
      for (let i = 0; i < 15; i++) {
        const cardId = `${playerId}-material-${i}` as CardId;
        zones.moveCard({
          cardId,
          targetZoneId: "materialDeck" as ZoneId,
          position: "bottom",
        });
      }
    },
  },

  chooseFirstPlayer: {
    reducer: (draft, context) => {
      const playerId = context.params.playerId;
      draft.currentPlayer = playerId;
      draft.phase = "wakeUp";
      draft.turn = 1;
    },
  },

  shuffleDecks: {
    reducer: (_draft, context) => {
      const { zones } = context;
      if (!zones) {
        throw new Error("Zone operations not available");
      }

      const playerId = context.params.playerId as PlayerId;

      // Shuffle both main and material decks
      zones.shuffleZone("mainDeck" as ZoneId, playerId);
      zones.shuffleZone("materialDeck" as ZoneId, playerId);
    },
  },

  drawStartingHand: {
    reducer: (_draft, context) => {
      const { zones } = context;
      if (!zones) {
        throw new Error("Zone operations not available");
      }

      const playerId = context.params.playerId as PlayerId;
      const count = context.params.count;
      const mainDeckCards = zones.getCardsInZone(
        "mainDeck" as ZoneId,
        playerId,
      );

      // Draw cards from main deck to hand
      for (let i = 0; i < count && i < mainDeckCards.length; i++) {
        const cardId = mainDeckCards[i];
        if (cardId) {
          zones.moveCard({
            cardId,
            targetZoneId: "hand" as ZoneId,
            position: "bottom",
          });
        }
      }
    },
  },

  // Gameplay moves with stub implementations
  materializeCard: {
    reducer: (_draft, _context) => {},
  },
  playCard: {
    reducer: (_draft, _context) => {},
  },
  declareAttack: {
    reducer: (_draft, _context) => {},
  },
  declareRetaliation: {
    reducer: (_draft, _context) => {},
  },
  activateAbility: {
    reducer: (_draft, _context) => {},
  },
  passOpportunity: {
    reducer: (_draft, _context) => {},
  },
  endPhase: {
    reducer: (_draft, _context) => {},
  },
  concede: {
    reducer: (_draft, _context) => {},
  },
};

// Grand Archive zones configuration
const grandArchiveZones: Record<string, CardZoneConfig> = {
  hand: {
    id: "hand" as ZoneId,
    name: "zones.hand",
    visibility: "private",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: undefined,
  },
  mainDeck: {
    id: "mainDeck" as ZoneId,
    name: "zones.mainDeck",
    visibility: "secret",
    ordered: true,
    owner: undefined,
    faceDown: true,
    maxSize: 40,
  },
  materialDeck: {
    id: "materialDeck" as ZoneId,
    name: "zones.materialDeck",
    visibility: "secret",
    ordered: true,
    owner: undefined,
    faceDown: true,
    maxSize: 15,
  },
  memory: {
    id: "memory" as ZoneId,
    name: "zones.memory",
    visibility: "private",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: undefined,
  },
  field: {
    id: "field" as ZoneId,
    name: "zones.field",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: undefined,
  },
  graveyard: {
    id: "graveyard" as ZoneId,
    name: "zones.graveyard",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: undefined,
  },
  banishment: {
    id: "banishment" as ZoneId,
    name: "zones.banishment",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: undefined,
  },
  effectsStack: {
    id: "effectsStack" as ZoneId,
    name: "zones.effectsStack",
    visibility: "public",
    ordered: true,
    owner: undefined,
    faceDown: false,
    maxSize: undefined,
  },
  intent: {
    id: "intent" as ZoneId,
    name: "zones.intent",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: undefined,
  },
};

// Grand Archive flow definition
const grandArchiveFlow: FlowDefinition<TestGameState> = {
  turn: {
    initialPhase: "wakeUp",
    onBegin: (_context) => {
      // Turn begins
    },
    onEnd: (_context) => {
      // Turn cleanup
    },
    phases: {
      wakeUp: {
        order: 1,
        next: "materialize",
        onBegin: (context) => {
          // Awaken all rested objects
          context.state.opportunityPlayer = null; // No Opportunity in Wake Up
        },
        endIf: () => true, // Auto-advance
      },
      materialize: {
        order: 2,
        next: "recollection",
        onBegin: (context) => {
          // Materialize one card from Material Deck
          context.state.opportunityPlayer = null; // No Opportunity here
        },
        endIf: () => true, // Auto-advance after materialization
      },
      recollection: {
        order: 3,
        next: "draw",
        onBegin: (context) => {
          // Grant Opportunity - turn player can act
          context.state.opportunityPlayer = context.state.currentPlayer;
        },
        // Player must pass Opportunity to advance
      },
      draw: {
        order: 4,
        next: "main",
        onBegin: (context) => {
          // Draw one card
          context.state.opportunityPlayer = null; // No Opportunity during draw
        },
        endIf: () => true, // Auto-advance
      },
      main: {
        order: 5,
        next: "end",
        onBegin: (context) => {
          // Grant Opportunity - turn player can act
          context.state.opportunityPlayer = context.state.currentPlayer;
        },
        // Player must explicitly end phase or pass
      },
      end: {
        order: 6,
        next: "wakeUp",
        onBegin: (context) => {
          // Grant Opportunity for end-of-turn effects
          context.state.opportunityPlayer = context.state.currentPlayer;
        },
        endIf: (_context) => {
          // Auto-advance after effects stack is empty
          return true;
        },
      },
    },
  },
};

/**
 * Create minimal Grand Archive game definition for testing
 *
 * This demonstrates how the core engine handles Grand Archive's unique mechanics:
 * - Dual deck system (main deck 40 cards + material deck 15 cards)
 * - Champion starting at level 0
 * - Turn structure with 6 phases (Wake Up, Materialize, Recollection, Draw, Main, End)
 * - Opportunity system (players get priority windows in specific phases)
 * - Multiple public/private zones (Hand, Memory, Field, Graveyard, Banishment, etc.)
 */
export function createMockGrandArchiveGame(): GameDefinition<
  TestGameState,
  TestMoves
> {
  return {
    name: "Test Grand Archive Game",
    zones: grandArchiveZones,
    flow: grandArchiveFlow,
    moves: grandArchiveMoves,
    /**
     * Setup function - called once at game initialization
     *
     * In a full implementation, this would:
     * 1. Create and shuffle main deck (40 cards) and material deck (15 cards)
     * 2. Place champion card at level 0
     * 3. Determine first player randomly
     * 4. Draw starting hand (typically 5 cards)
     * 5. Transition to "wakeUp" phase for first turn
     *
     * For this minimal test, we just set the initial game state.
     */
    setup: (players) => {
      // Initialize player-specific data
      const playerIds = players.map((p) => p.id);
      const champions: Record<
        string,
        { id: string; level: number; damage: number }
      > = {};
      const hasDrawnThisTurn: Record<string, boolean> = {};
      const hasMaterializedThisTurn: Record<string, boolean> = {};

      for (const playerId of playerIds) {
        champions[playerId] = {
          id: `${playerId}-champion`,
          level: 0, // Start at level 0
          damage: 0,
        };
        hasDrawnThisTurn[playerId] = false;
        hasMaterializedThisTurn[playerId] = false;
      }

      return {
        phase: "setup",
        turn: 0,
        currentPlayer: playerIds[0] || "p1",
        opportunityPlayer: null,
        champions,
        hasDrawnThisTurn,
        hasMaterializedThisTurn,
      };
    },
  };
}
