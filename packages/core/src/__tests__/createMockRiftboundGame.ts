import type { FlowDefinition } from "../flow";
import type { GameDefinition, GameMoveDefinitions } from "../game-definition";
import { standardMoves } from "../moves/standard-moves";
import type { CardId, PlayerId, ZoneId } from "../types";
import type { CardZoneConfig } from "../zones";

// Mock Riftbound game state - SIMPLIFIED!
type TestGameState = {
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
};

type TestMoves = {
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
};

// Riftbound move definitions
const riftboundMoves: GameMoveDefinitions<TestGameState, TestMoves> = {
  // Setup moves using engine utilities
  initializeDecks: {
    reducer: (_draft, context) => {
      const { zones } = context;
      const playerId = context.params.playerId;

      // Use engine's createDeck utility!
      zones.createDeck({
        zoneId: "mainDeck" as ZoneId,
        playerId,
        cardCount: 40,
        shuffle: false,
      });

      zones.createDeck({
        zoneId: "runeDeck" as ZoneId,
        playerId,
        cardCount: 12,
        shuffle: false,
      });

      // NO MORE: draft.setupStep
    },
  },

  placeLegend: {
    reducer: (_draft, context) => {
      const { zones } = context;
      const legendId = context.params.legendId;

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
      const championId = context.params.championId;

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
      const battlefieldIds = context.params.battlefieldIds;

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
      const playerId = context.params.playerId;

      zones.shuffleZone("mainDeck" as ZoneId, playerId);
      zones.shuffleZone("runeDeck" as ZoneId, playerId);

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
        from: "mainDeck" as ZoneId,
        to: "hand" as ZoneId,
        count: 6,
        playerId,
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
      const count = context.params.count;

      // BEFORE: Manual loop + drawing
      // AFTER: Use bulkMove utility!
      context.zones.bulkMove({
        from: "runeDeck" as ZoneId,
        to: "runePool" as ZoneId,
        count,
        playerId: playerId as PlayerId,
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
      const playerId = context.playerId;
      // Use tracker system!
      return !context.trackers?.check("hasDrawn", playerId);
    },
    reducer: (_draft, context) => {
      const { zones } = context;
      const playerId = context.params.playerId;

      zones.drawCards({
        from: "mainDeck" as ZoneId,
        to: "hand" as ZoneId,
        count: 1,
        playerId,
      });

      // Mark as drawn
      context.trackers?.mark("hasDrawn", playerId);
    },
  },

  playUnit: {
    reducer: (_draft, context) => {
      const cardId = context.params.cardId;

      context.zones.moveCard({
        cardId,
        targetZoneId: "battlefield" as ZoneId,
      });
    },
  },

  playGear: {
    reducer: (_draft, context) => {
      const cardId = context.params.cardId;

      context.zones.moveCard({
        cardId,
        targetZoneId: "gearArea" as ZoneId,
      });
    },
  },

  playSpell: {
    reducer: (_draft, context) => {
      const cardId = context.params.cardId;

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
  mainDeck: {
    id: "mainDeck" as ZoneId,
    name: "zones.mainDeck",
    visibility: "secret",
    ordered: true,
    owner: undefined,
    faceDown: true,
    maxSize: 40,
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
  runeDeck: {
    id: "runeDeck" as ZoneId,
    name: "zones.runeDeck",
    visibility: "secret",
    ordered: true,
    owner: undefined,
    faceDown: true,
    maxSize: 12,
  },
  runePool: {
    id: "runePool" as ZoneId,
    name: "zones.runePool",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: undefined,
  },
  legendZone: {
    id: "legendZone" as ZoneId,
    name: "zones.legendZone",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: 1,
  },
  championZone: {
    id: "championZone" as ZoneId,
    name: "zones.championZone",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: 1,
  },
  battlefield: {
    id: "battlefield" as ZoneId,
    name: "zones.battlefield",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: undefined,
  },
  battlefieldRow: {
    id: "battlefieldRow" as ZoneId,
    name: "zones.battlefieldRow",
    visibility: "public",
    ordered: true,
    owner: undefined,
    faceDown: false,
    maxSize: 3,
  },
  gearArea: {
    id: "gearArea" as ZoneId,
    name: "zones.gearArea",
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
};

// Riftbound flow (simplified)
const riftboundFlow: FlowDefinition<TestGameState> = {
  turn: {
    initialPhase: "awaken",
    phases: {
      awaken: {
        order: 1,
        next: "beginning",
        onBegin: (_context) => {},
        endIf: () => true,
      },
      beginning: {
        order: 2,
        next: "channel",
        onBegin: (_context) => {},
        endIf: () => true,
      },
      channel: {
        order: 3,
        next: "draw",
        onBegin: (_context) => {},
        endIf: () => true,
      },
      draw: {
        order: 4,
        next: "action",
        onBegin: (_context) => {},
        endIf: () => true,
      },
      action: {
        order: 5,
        next: "ending",
        onBegin: (_context) => {},
      },
      ending: {
        order: 6,
        next: "awaken",
        onBegin: (context) => {
          // Clear conquered battlefields at turn end
          const playerId = context.getCurrentPlayer();
          context.state.conqueredThisTurn[playerId] = [];
        },
        endIf: () => true,
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
export function createMockRiftboundGame(): GameDefinition<
  TestGameState,
  TestMoves
> {
  return {
    name: "Test Riftbound Game",
    zones: riftboundZones,
    flow: riftboundFlow,
    moves: riftboundMoves,

    // Configure engine's tracker system
    trackers: {
      perTurn: ["hasDrawn"],
      perPlayer: true,
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
      const runePools: Record<
        string,
        { energy: number; power: Record<string, number> }
      > = {};
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
        victoryPoints,
        battlefieldControl: {},
        runePools,
        conqueredThisTurn,
      };
    },
  };
}
