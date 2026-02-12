import type { FlowDefinition } from "../flow";
import type { GameDefinition, GameMoveDefinitions } from "../game-definition";
import { standardMoves } from "../moves/standard-moves";
import type { CardId, PlayerId, ZoneId } from "../types";
import type { CardZoneConfig } from "../zones";

// Mock One Piece game state - SIMPLIFIED!
interface TestGameState {
  battleAllowed: boolean;
  leaderLife: Record<string, number>;
}

interface TestMoves {
  // Setup moves
  initializeDecks: { playerId: PlayerId };
  placeLeader: { playerId: PlayerId; leaderId: CardId };
  determineFirstPlayer: { playerId: PlayerId };
  drawOpeningHand: { playerId: PlayerId };
  decideMulligan: { playerId: PlayerId; redraw: boolean };
  placeLifeCards: { playerId: PlayerId; lifeCount: number };
  transitionToGame: Record<string, never>;
  // Core game moves
  draw: { playerId: PlayerId };
  placeDon: { playerId: PlayerId };
  playCharacter: { playerId: PlayerId; cardId: CardId };
  playEvent: { playerId: PlayerId; cardId: CardId };
  playStage: { playerId: PlayerId; cardId: CardId };
  giveDon: { playerId: PlayerId; donCardId: CardId; targetCardId: CardId };
  attack: { playerId: PlayerId; attackerId: CardId; targetId?: CardId };
  activateAbility: { playerId: PlayerId; cardId: CardId };
  // Standard moves
  pass: { playerId: PlayerId };
  concede: { playerId: PlayerId };
}

// One Piece move definitions
const onePieceMoves: GameMoveDefinitions<TestGameState, TestMoves> = {
  // Setup moves using engine utilities
  initializeDecks: {
    reducer: (_draft, context) => {
      const { zones } = context;
      const { playerId } = context.params;

      // Use engine's createDeck utility!
      zones.createDeck({
        cardCount: 50,
        playerId,
        shuffle: true,
        zoneId: "deck" as ZoneId,
      });

      zones.createDeck({
        cardCount: 10,
        playerId,
        shuffle: true,
        zoneId: "donDeck" as ZoneId,
      });

      // NO MORE: draft.setupStep
    },
  },

  placeLeader: {
    reducer: (_draft, context) => {
      const { zones } = context;
      const { leaderId } = context.params;

      // Place Leader card in leader area
      zones.moveCard({
        cardId: leaderId,
        targetZoneId: "leader" as ZoneId,
      });

      // NO MORE: draft.setupStep
    },
  },

  determineFirstPlayer: {
    reducer: (_draft, _context) => {
      // NO MORE: draft.currentPlayer, draft.firstTurn, draft.setupStep
      // Engine handles this!
    },
  },

  drawOpeningHand: {
    reducer: (_draft, context) => {
      const { zones } = context;
      const { playerId } = context.params;

      // BEFORE: Manual loop (11 lines)
      // AFTER: Use drawCards utility!
      zones.drawCards({
        count: 5,
        from: "deck" as ZoneId,
        playerId,
        to: "hand" as ZoneId,
      });

      // NO MORE: draft.setupStep, draft.mulliganOffered
    },
  },

  decideMulligan: {
    reducer: (_draft, context) => {
      const { zones } = context;
      const { playerId } = context.params;
      const { redraw } = context.params;

      if (redraw) {
        // BEFORE: Manual mulligan (22 lines)
        // AFTER: One line!
        zones.mulligan({
          deck: "deck" as ZoneId,
          drawCount: 5,
          hand: "hand" as ZoneId,
          playerId,
        });
      }

      // NO MORE: draft.mulliganOffered
    },
  },

  placeLifeCards: {
    reducer: (_draft, context) => {
      const { zones } = context;
      const { playerId } = context.params;
      const { lifeCount } = context.params;

      // BEFORE: Manual loop (9 lines)
      // AFTER: Use bulkMove utility!
      zones.bulkMove({
        count: lifeCount,
        from: "deck" as ZoneId,
        playerId,
        position: "bottom",
        to: "life" as ZoneId,
      });

      // NO MORE: draft.setupStep
    },
  },

  transitionToGame: {
    reducer: (_draft, _context) => {
      // NO MORE: draft.setupStep, draft.phase, draft.turn, draft.firstTurn
    },
  },

  // Core game moves
  draw: {
    condition: (state, context) => {
      // First player skips draw on first turn
      const isFirstTurn = context.flow?.isFirstTurn ?? false;
      const isFirstPlayer = context.flow?.currentPlayer === context.playerId;

      if (isFirstTurn && isFirstPlayer) {
        return false;
      }

      return true;
    },
    reducer: (_draft, context) => {
      const { zones } = context;
      const { playerId } = context.params;

      zones.drawCards({
        count: 1,
        from: "deck" as ZoneId,
        playerId,
        to: "hand" as ZoneId,
      });
    },
  },

  placeDon: {
    reducer: (_draft, context) => {
      const { zones } = context;
      const { playerId } = context.params;

      // Get DON!! count for this turn (use flow.turn)
      const turnNumber = context.flow?.turn ?? 1;
      const donCount = Math.min(turnNumber, 10);

      // Draw DON!! cards
      zones.bulkMove({
        count: donCount,
        from: "donDeck" as ZoneId,
        playerId,
        to: "donArea" as ZoneId,
      });
    },
  },

  playCharacter: {
    reducer: (_draft, context) => {
      const { cardId } = context.params;

      context.zones.moveCard({
        cardId,
        targetZoneId: "characters" as ZoneId,
      });
    },
  },

  playEvent: {
    reducer: (_draft, context) => {
      const { cardId } = context.params;

      // Events go directly to discard
      context.zones.moveCard({
        cardId,
        targetZoneId: "discard" as ZoneId,
      });
    },
  },

  playStage: {
    reducer: (_draft, context) => {
      const { cardId } = context.params;

      context.zones.moveCard({
        cardId,
        targetZoneId: "stage" as ZoneId,
      });
    },
  },

  giveDon: {
    reducer: (_draft, context) => {
      const { donCardId } = context.params;

      // Attach DON!! to character (simplified)
      context.zones.moveCard({
        cardId: donCardId,
        targetZoneId: "donArea" as ZoneId,
      });
    },
  },

  attack: {
    reducer: (draft, _context) => {
      // Mark battle as in progress
      draft.battleAllowed = true;
    },
  },

  activateAbility: {
    reducer: (_draft, _context) => {
      // Ability activation logic
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

// One Piece zones (unchanged)
const onePieceZones: Record<string, CardZoneConfig> = {
  characters: {
    faceDown: false,
    id: "characters" as ZoneId,
    maxSize: undefined,
    name: "zones.characters",
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
    visibility: "secret",
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
  donArea: {
    faceDown: false,
    id: "donArea" as ZoneId,
    maxSize: undefined,
    name: "zones.donArea",
    ordered: false,
    owner: undefined,
    visibility: "public",
  },
  donDeck: {
    faceDown: true,
    id: "donDeck" as ZoneId,
    maxSize: 10,
    name: "zones.donDeck",
    ordered: true,
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
  leader: {
    faceDown: false,
    id: "leader" as ZoneId,
    maxSize: 1,
    name: "zones.leader",
    ordered: false,
    owner: undefined,
    visibility: "public",
  },
  life: {
    faceDown: true,
    id: "life" as ZoneId,
    maxSize: 5,
    name: "zones.life",
    ordered: true,
    owner: undefined,
    visibility: "secret",
  },
  stage: {
    faceDown: false,
    id: "stage" as ZoneId,
    maxSize: undefined,
    name: "zones.stage",
    ordered: false,
    owner: undefined,
    visibility: "public",
  },
};

// One Piece flow (simplified)
const onePieceFlow: FlowDefinition<TestGameState> = {
  turn: {
    initialPhase: "refresh",
    phases: {
      don: {
        endIf: () => true,
        next: "main",
        onBegin: (_context) => {},
        order: 3,
      },
      draw: {
        endIf: () => true,
        next: "don",
        onBegin: (_context) => {},
        order: 2,
      },
      end: {
        endIf: () => true,
        next: "refresh",
        onBegin: (context) => {
          context.state.battleAllowed = false;
        },
        order: 5,
      },
      main: {
        next: "end",
        onBegin: (_context) => {},
        order: 4,
      },
      refresh: {
        endIf: () => true,
        next: "draw",
        onBegin: (_context) => {},
        order: 1,
      },
    },
  },
};

/**
 * Create minimal One Piece game definition for testing
 *
 * REFACTORED to showcase new engine features:
 * ✨ 140+ lines of boilerplate ELIMINATED!
 * ✅ No manual phase/turn/player tracking
 * ✅ High-level zone utilities (createDeck, drawCards, mulligan, bulkMove)
 * ✅ Standard moves library (pass, concede)
 * ✅ Flow context access (isFirstTurn, turn)
 */
export function createMockOnePieceGame(): GameDefinition<TestGameState, TestMoves> {
  return {
    name: "Test One Piece Game",
    zones: onePieceZones,
    flow: onePieceFlow,
    moves: onePieceMoves,

    /**
     * Setup function - MASSIVELY SIMPLIFIED!
     *
     * BEFORE: 100+ lines tracking phase, setupStep, turn, currentPlayer, firstTurn, mulliganOffered, donThisTurn
     * AFTER: 15 lines - just initialize game-specific data!
     */
    setup: (players) => {
      const playerIds = players.map((p) => p.id);
      const leaderLife: Record<string, number> = {};

      for (const playerId of playerIds) {
        leaderLife[playerId] = 5; // Default starting life
      }

      return {
        battleAllowed: false,
        leaderLife,
      };
    },
  };
}
