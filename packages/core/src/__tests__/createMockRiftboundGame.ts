import type { FlowDefinition } from "../flow";
import type { GameDefinition, GameMoveDefinitions } from "../game-definition";
import { standardMoves } from "../moves/standard-moves";
import type { CardId, PlayerId, ZoneId } from "../types";
import type { CardZoneConfig } from "../zones";

// Mock Riftbound game state - SIMPLIFIED!
interface TestGameState {
  victoryPoints: Record<string, number>;
  battlefieldControl: Record<string, PlayerId | null>;
  runePools: Record<
    string,
    {
      energy: number;
      power: Record<string, number>;
    }
  >;
  conqueredThisTurn: Record<string, CardId[]>;
}

interface TestMoves {
  // Setup moves
  initializeDecks: { playerId: PlayerId };
  placeLegend: { playerId: PlayerId; legendId: CardId };
  placeChampion: { playerId: PlayerId; championId: CardId };
  placeBattlefields: { battlefieldIds: CardId[] };
  shuffleDecks: { playerId: PlayerId };
  drawInitialHand: { playerId: PlayerId };
  transitionToPlay: Record<string, never>;
  // Regular game moves
  channelRunes: { playerId: PlayerId; count: number };
  drawCard: { playerId: PlayerId };
  playUnit: { playerId: PlayerId; cardId: CardId };
  playGear: { playerId: PlayerId; cardId: CardId };
  playSpell: { playerId: PlayerId; cardId: CardId; targets?: CardId[] };
  moveUnit: { playerId: PlayerId; unitId: CardId; targetLocation: string };
  initiateCombat: { playerId: PlayerId; battlefieldId: CardId };
  // Standard moves
  pass: { playerId: PlayerId };
  concede: { playerId: PlayerId };
}

// Riftbound move definitions
const riftboundMoves: GameMoveDefinitions<TestGameState, TestMoves> = {
  // Setup moves using engine utilities
  initializeDecks: {
    reducer: (_draft, context) => {
      const { zones } = context;
      const { playerId } = context.params;

      // Use engine's createDeck utility!
      zones.createDeck({
        cardCount: 40,
        playerId,
        shuffle: false,
        zoneId: "mainDeck" as ZoneId,
      });

      zones.createDeck({
        cardCount: 12,
        playerId,
        shuffle: false,
        zoneId: "runeDeck" as ZoneId,
      });

      // NO MORE: draft.setupStep
    },
  },

  placeLegend: {
    reducer: (_draft, context) => {
      const { zones } = context;
      const { legendId } = context.params;

      zones.moveCard({
        cardId: legendId,
        targetZoneId: "legendZone" as ZoneId,
      });

      // NO MORE: draft.setupStep
    },
  },

  placeChampion: {
    reducer: (_draft, context) => {
      const { zones } = context;
      const { championId } = context.params;

      zones.moveCard({
        cardId: championId,
        targetZoneId: "championZone" as ZoneId,
      });

      // NO MORE: draft.setupStep
    },
  },

  placeBattlefields: {
    reducer: (draft, context) => {
      const { zones } = context;
      const { battlefieldIds } = context.params;

      // Place each battlefield
      for (const battlefieldId of battlefieldIds) {
        zones.moveCard({
          cardId: battlefieldId as CardId,
          targetZoneId: "battlefieldRow" as ZoneId,
        });

        // Initialize control (null = unclaimed)
        draft.battlefieldControl[battlefieldId as string] = null;
      }

      // NO MORE: draft.setupStep
    },
  },

  shuffleDecks: {
    reducer: (_draft, context) => {
      const { zones } = context;
      const { playerId } = context.params;

      zones.shuffleZone("mainDeck" as ZoneId, playerId);
      zones.shuffleZone("runeDeck" as ZoneId, playerId);

      // NO MORE: draft.setupStep
    },
  },

  drawInitialHand: {
    reducer: (_draft, context) => {
      const { zones } = context;
      const { playerId } = context.params;

      // BEFORE: Manual loop (11 lines)
      // AFTER: Use drawCards utility!
      zones.drawCards({
        count: 6,
        from: "mainDeck" as ZoneId,
        playerId,
        to: "hand" as ZoneId,
      });

      // NO MORE: draft.setupStep
    },
  },

  transitionToPlay: {
    reducer: (_draft, _context) => {
      // NO MORE: draft.setupStep, draft.phase, draft.turn
    },
  },

  // Regular game moves
  channelRunes: {
    reducer: (draft, context) => {
      const playerId = context.params.playerId as string;
      const { count } = context.params;

      // BEFORE: Manual loop + drawing
      // AFTER: Use bulkMove utility!
      context.zones.bulkMove({
        count,
        from: "runeDeck" as ZoneId,
        playerId: playerId as PlayerId,
        to: "runePool" as ZoneId,
      });

      // Increment energy
      const pool = draft.runePools[playerId];
      if (pool) {
        pool.energy += count;
      }
    },
  },

  drawCard: {
    condition: (state, context) => {
      const { playerId } = context;
      // Use tracker system!
      return !context.trackers?.check("hasDrawn", playerId);
    },
    reducer: (_draft, context) => {
      const { zones } = context;
      const { playerId } = context.params;

      zones.drawCards({
        count: 1,
        from: "mainDeck" as ZoneId,
        playerId,
        to: "hand" as ZoneId,
      });

      // Mark as drawn
      context.trackers?.mark("hasDrawn", playerId);
    },
  },

  playUnit: {
    reducer: (_draft, context) => {
      const { cardId } = context.params;

      context.zones.moveCard({
        cardId,
        targetZoneId: "battlefield" as ZoneId,
      });
    },
  },

  playGear: {
    reducer: (_draft, context) => {
      const { cardId } = context.params;

      context.zones.moveCard({
        cardId,
        targetZoneId: "gearArea" as ZoneId,
      });
    },
  },

  playSpell: {
    reducer: (_draft, context) => {
      const { cardId } = context.params;

      // Spells go to discard after resolution
      context.zones.moveCard({
        cardId,
        targetZoneId: "discard" as ZoneId,
      });
    },
  },

  moveUnit: {
    reducer: (_draft, _context) => {
      // Unit movement logic
    },
  },

  initiateCombat: {
    reducer: (draft, context) => {
      const playerId = context.params.playerId as string;
      const battlefieldId = context.params.battlefieldId as string;

      // Track conquered battlefield
      if (!draft.conqueredThisTurn[playerId]) {
        draft.conqueredThisTurn[playerId] = [];
      }
      draft.conqueredThisTurn[playerId].push(battlefieldId as CardId);
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

// Riftbound zones (unchanged)
const riftboundZones: Record<string, CardZoneConfig> = {
  battlefield: {
    faceDown: false,
    id: "battlefield" as ZoneId,
    maxSize: undefined,
    name: "zones.battlefield",
    ordered: false,
    owner: undefined,
    visibility: "public",
  },
  battlefieldRow: {
    faceDown: false,
    id: "battlefieldRow" as ZoneId,
    maxSize: 3,
    name: "zones.battlefieldRow",
    ordered: true,
    owner: undefined,
    visibility: "public",
  },
  championZone: {
    faceDown: false,
    id: "championZone" as ZoneId,
    maxSize: 1,
    name: "zones.championZone",
    ordered: false,
    owner: undefined,
    visibility: "public",
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
  gearArea: {
    faceDown: false,
    id: "gearArea" as ZoneId,
    maxSize: undefined,
    name: "zones.gearArea",
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
  legendZone: {
    faceDown: false,
    id: "legendZone" as ZoneId,
    maxSize: 1,
    name: "zones.legendZone",
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
  runeDeck: {
    faceDown: true,
    id: "runeDeck" as ZoneId,
    maxSize: 12,
    name: "zones.runeDeck",
    ordered: true,
    owner: undefined,
    visibility: "secret",
  },
  runePool: {
    faceDown: false,
    id: "runePool" as ZoneId,
    maxSize: undefined,
    name: "zones.runePool",
    ordered: false,
    owner: undefined,
    visibility: "public",
  },
};

// Riftbound flow (simplified)
const riftboundFlow: FlowDefinition<TestGameState> = {
  turn: {
    initialPhase: "awaken",
    phases: {
      action: {
        next: "ending",
        onBegin: (_context) => {},
        order: 5,
      },
      awaken: {
        endIf: () => true,
        next: "beginning",
        onBegin: (_context) => {},
        order: 1,
      },
      beginning: {
        endIf: () => true,
        next: "channel",
        onBegin: (_context) => {},
        order: 2,
      },
      channel: {
        endIf: () => true,
        next: "draw",
        onBegin: (_context) => {},
        order: 3,
      },
      draw: {
        endIf: () => true,
        next: "action",
        onBegin: (_context) => {},
        order: 4,
      },
      ending: {
        endIf: () => true,
        next: "awaken",
        onBegin: (context) => {
          // Clear conquered battlefields at turn end
          const playerId = context.getCurrentPlayer();
          context.state.conqueredThisTurn[playerId] = [];
        },
        order: 6,
      },
    },
  },
};

/**
 * Create minimal Riftbound game definition for testing
 *
 * REFACTORED to showcase new engine features:
 * ✨ 130+ lines of boilerplate ELIMINATED!
 * ✅ No manual phase/turn/player tracking
 * ✅ High-level zone utilities (createDeck, drawCards, bulkMove)
 * ✅ Tracker system for per-turn flags (hasDrawn)
 * ✅ Standard moves library (pass, concede)
 */
export function createMockRiftboundGame(): GameDefinition<TestGameState, TestMoves> {
  return {
    name: "Test Riftbound Game",
    zones: riftboundZones,
    flow: riftboundFlow,
    moves: riftboundMoves,

    // Configure engine's tracker system
    trackers: {
      perPlayer: true,
      perTurn: ["hasDrawn"],
    },

    /**
     * Setup function - MASSIVELY SIMPLIFIED!
     *
     * BEFORE: 100+ lines tracking phase, setupStep, turn, activePlayer, hasDrawnThisTurn
     * AFTER: 20 lines - just initialize game-specific data!
     */
    setup: (players) => {
      const playerIds = players.map((p) => p.id);
      const victoryPoints: Record<string, number> = {};
      const runePools: Record<string, { energy: number; power: Record<string, number> }> = {};
      const conqueredThisTurn: Record<string, CardId[]> = {};

      for (const playerId of playerIds) {
        victoryPoints[playerId] = 0;
        runePools[playerId] = {
          energy: 0,
          power: {},
        };
        conqueredThisTurn[playerId] = [];
      }

      return {
        battlefieldControl: {},
        conqueredThisTurn,
        runePools,
        victoryPoints,
      };
    },
  };
}
