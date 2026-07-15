import type { FlowDefinition } from "../flow";
import type { GameDefinition, GameMoveDefinitions } from "../game-definition";
import { standardMoves } from "../moves/standard-moves";
import type { CardId, PlayerId, ZoneId } from "../types";
import type { CardZoneConfig } from "../zones";

// Mock Gundam game state - SIMPLIFIED!
interface TestGameState {
  activeResources: Record<string, number>;
  attackedThisTurn: CardId[];
}

interface TestMoves {
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
}

// Gundam move definitions
const gundamMoves: GameMoveDefinitions<TestGameState, TestMoves> = {
  // Setup moves - using engine utilities!
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
        zoneId: "resourceDeck" as ZoneId,
      });

      // NO MORE: draft.setupStep
    },
  },

  placeShields: {
    reducer: (_draft, context) => {
      const { zones } = context;
      const { playerId } = context.params;

      // BEFORE: Manual loop (9 lines)
      // AFTER: Use bulkMove utility!
      zones.bulkMove({
        count: 6,
        from: "deck" as ZoneId,
        playerId,
        position: "bottom",
        to: "shieldSection" as ZoneId,
      });

      // NO MORE: draft.setupStep
    },
  },

  createTokens: {
    reducer: (_draft, context) => {
      const { zones } = context;
      const { playerId } = context.params;
      const { playerIndex } = context.params;

      // Create EX Base token
      const baseTokenId = `${playerId}-token-ex-base` as CardId;
      zones.moveCard({
        cardId: baseTokenId,
        position: "bottom",
        targetZoneId: "baseSection" as ZoneId,
      });

      // Second player gets EX Resource token
      const isSecondPlayer = playerIndex === 1;
      if (isSecondPlayer) {
        const resourceTokenId = `${playerId}-token-ex-resource` as CardId;
        zones.moveCard({
          cardId: resourceTokenId,
          position: "bottom",
          targetZoneId: "resourceArea" as ZoneId,
        });
      }

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
        count: 7,
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
        // BEFORE: Manual card return + shuffle + redraw (20 lines)
        // AFTER: Use mulligan utility (1 line!)
        zones.mulligan({
          deck: "deck" as ZoneId,
          drawCount: 7,
          hand: "hand" as ZoneId,
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
      const { playerId } = context.params;
      const { count } = context.params;

      zones.drawCards({
        count,
        from: "deck" as ZoneId,
        playerId,
        to: "hand" as ZoneId,
      });
    },
  },

  deployUnit: {
    reducer: (_draft, context) => {
      const { cardId } = context.params;

      context.zones.moveCard({
        cardId,
        targetZoneId: "unitArea" as ZoneId,
      });
    },
  },

  deployBase: {
    reducer: (_draft, context) => {
      const { cardId } = context.params;

      context.zones.moveCard({
        cardId,
        targetZoneId: "baseSection" as ZoneId,
      });
    },
  },

  playResource: {
    condition: (state, context) => {
      const { playerId } = context.params;
      // Use engine's tracker system!
      return !context.trackers?.check("hasPlayedResource", playerId);
    },
    reducer: (draft, context) => {
      const { playerId } = context.params;
      const { cardId } = context.params;

      context.zones.moveCard({
        cardId,
        targetZoneId: "resourceArea" as ZoneId,
      });

      draft.activeResources[playerId] = (draft.activeResources[playerId] || 0) + 1;

      // Mark as played
      context.trackers?.mark("hasPlayedResource", playerId);
    },
  },

  attack: {
    reducer: (draft, context) => {
      const { attackerId } = context.params;

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
  baseSection: {
    faceDown: false,
    id: "baseSection" as ZoneId,
    maxSize: 1,
    name: "zones.baseSection",
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
  hand: {
    faceDown: false,
    id: "hand" as ZoneId,
    maxSize: undefined,
    name: "zones.hand",
    ordered: false,
    owner: undefined,
    visibility: "private",
  },
  junkYard: {
    faceDown: false,
    id: "junkYard" as ZoneId,
    maxSize: undefined,
    name: "zones.junkYard",
    ordered: false,
    owner: undefined,
    visibility: "public",
  },
  resourceArea: {
    faceDown: false,
    id: "resourceArea" as ZoneId,
    maxSize: undefined,
    name: "zones.resourceArea",
    ordered: false,
    owner: undefined,
    visibility: "public",
  },
  resourceDeck: {
    faceDown: true,
    id: "resourceDeck" as ZoneId,
    maxSize: 10,
    name: "zones.resourceDeck",
    ordered: true,
    owner: undefined,
    visibility: "secret",
  },
  shieldSection: {
    faceDown: true,
    id: "shieldSection" as ZoneId,
    maxSize: 6,
    name: "zones.shieldSection",
    ordered: true,
    owner: undefined,
    visibility: "secret",
  },
  unitArea: {
    faceDown: false,
    id: "unitArea" as ZoneId,
    maxSize: undefined,
    name: "zones.unitArea",
    ordered: false,
    owner: undefined,
    visibility: "public",
  },
};

// Gundam flow definition (simplified)
const gundamFlow: FlowDefinition<TestGameState> = {
  turn: {
    initialPhase: "start",
    onBegin: (_context) => {},
    onEnd: (_context) => {},
    phases: {
      draw: {
        endIf: () => true,
        next: "resource",
        onBegin: (_context) => {},
        order: 2,
      },
      end: {
        endIf: () => true,
        next: "start",
        onBegin: (context) => {
          // Clear attacked units at end of turn
          context.state.attackedThisTurn = [];
        },
        order: 5,
      },
      main: {
        next: "end",
        onBegin: (_context) => {},
        order: 4,
      },
      resource: {
        next: "main",
        onBegin: (_context) => {},
        order: 3,
      },
      start: {
        endIf: () => true,
        next: "draw",
        onBegin: (_context) => {},
        order: 1,
      },
    },
  },
};

export function createMockGundamGame(): GameDefinition<TestGameState, TestMoves> {
  return {
    flow: gundamFlow,
    moves: gundamMoves,
    name: "Test Gundam Game",
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

    trackers: {
      perPlayer: true,
      perTurn: ["hasPlayedResource"],
    },

    zones: gundamZones,
  };
}
