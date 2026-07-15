import type { FlowDefinition } from "../flow";
import type { GameDefinition, GameMoveDefinitions } from "../game-definition";
import { standardMoves } from "../moves/standard-moves";
import type { CardId, PlayerId, ZoneId } from "../types";
import type { CardZoneConfig } from "../zones";

// Mock Lorcana game state - SIMPLIFIED!
interface TestGameState {
  effects: unknown[];
  bag: unknown[];
  loreScores: Record<string, number>;
}

interface AlternativeCost {
  type: "shift" | "sing" | "sing-together";
  targetInstanceId: CardId[];
}

interface TestMoves {
  // Setup moves
  chooseWhoGoesFirstMove: { playerId: PlayerId };
  alterHand: { playerId: PlayerId; cards: CardId[] };
  drawCards: { playerId: PlayerId; count: number };
  // Game moves
  putACardIntoTheInkwell: { cardId: CardId };
  playCard: { cardId: CardId; alternativeCost?: AlternativeCost };
  quest: { cardId: CardId };
  challenge: { attackerId: CardId; defenderId: CardId };
  sing: { singerId: CardId; songId: CardId };
  singTogether: { singersIds: CardId[]; songId: CardId };
  moveCharacterToLocation: { characterId: CardId; locationId: CardId };
  activateAbility: {
    cardId: CardId;
    opts?: {
      abilityIndex?: number;
      abilityText?: string;
      alternativeCost?: AlternativeCost;
    };
  };
  resolveBag: { bagId: string; params: unknown };
  resolveEffect: { effectId: string; params: unknown };
  manualExert: { cardId: CardId };
  // Standard moves
  passTurn: { playerId: PlayerId };
  concede: { playerId: PlayerId };
}

// Lorcana move definitions
const lorcanaMoves: GameMoveDefinitions<TestGameState, TestMoves> = {
  // Setup moves using engine features
  chooseWhoGoesFirstMove: {
    reducer: (_draft, _context) => {
      // NO MORE: draft.activePlayerId, draft.firstPlayerDetermined, draft.gamePhase, draft.turnNumber
      // Engine handles this!
    },
  },

  alterHand: {
    reducer: (_draft, context) => {
      const { zones } = context;
      const { playerId } = context.params;

      // BEFORE: Manual array manipulation (11 lines)
      // AFTER: Use mulligan utility!
      zones.mulligan({
        deck: "deck" as ZoneId,
        drawCount: 7,
        hand: "hand" as ZoneId,
        playerId,
      });
    },
  },

  drawCards: {
    reducer: (_draft, context) => {
      const { zones } = context;
      const { playerId } = context.params;
      const { count } = context.params;

      // Use engine's drawCards utility
      zones.drawCards({
        count,
        from: "deck" as ZoneId,
        playerId,
        to: "hand" as ZoneId,
      });
    },
  },

  putACardIntoTheInkwell: {
    condition: (state, context) => {
      const { playerId } = context;
      // Use tracker system!
      return !context.trackers?.check("hasInked", playerId);
    },
    reducer: (_draft, context) => {
      const { cardId } = context.params;
      const { playerId } = context;

      // Move card to inkwell
      context.zones.moveCard({
        cardId,
        targetZoneId: "inkwell" as ZoneId,
      });

      // Mark as inked
      context.trackers?.mark("hasInked", playerId);
    },
  },

  playCard: {
    reducer: (_draft, context) => {
      const { cardId } = context.params;

      // Play card to play area
      context.zones.moveCard({
        cardId,
        targetZoneId: "play" as ZoneId,
      });
    },
  },

  quest: {
    condition: (state, context) => {
      const { cardId } = context.params;
      // Card hasn't quested this turn
      return !context.trackers?.check(`quested:${cardId}`, context.playerId);
    },
    reducer: (draft, context) => {
      const { cardId } = context.params;
      const { playerId } = context;

      // Increment lore (simplified - assume 1 lore per quest)
      draft.loreScores[playerId] = (draft.loreScores[playerId] || 0) + 1;

      // Mark as quested
      context.trackers?.mark(`quested:${cardId}`, playerId);
    },
  },

  challenge: {
    reducer: (_draft, _context) => {
      // Challenge logic
    },
  },

  sing: {
    reducer: (_draft, context) => {
      const { singerId } = context.params;
      const { songId } = context.params;

      // Exert singer, play song
      context.zones.moveCard({
        cardId: songId,
        targetZoneId: "play" as ZoneId,
      });
    },
  },

  singTogether: {
    reducer: (_draft, context) => {
      const { songId } = context.params;

      // Play song via sing together
      context.zones.moveCard({
        cardId: songId,
        targetZoneId: "play" as ZoneId,
      });
    },
  },

  moveCharacterToLocation: {
    reducer: (_draft, _context) => {
      // Move character logic
    },
  },

  activateAbility: {
    reducer: (_draft, _context) => {
      // Ability activation logic
    },
  },

  resolveBag: {
    reducer: (draft, context) => {
      const { bagId } = context.params;
      // Remove bag after resolution
      draft.bag = draft.bag.filter((b: any) => b.id !== bagId);
    },
  },

  resolveEffect: {
    reducer: (draft, context) => {
      const { effectId } = context.params;
      // Remove effect after resolution
      draft.effects = draft.effects.filter((e: any) => e.id !== effectId);
    },
  },

  manualExert: {
    reducer: (_draft, _context) => {
      // Exert card logic
    },
  },

  // Standard moves from engine
  passTurn: standardMoves<TestGameState>({
    include: ["pass"],
  }).pass!,

  concede: standardMoves<TestGameState>({
    include: ["concede"],
  }).concede!,
};

// Lorcana zones (simplified)
const lorcanaZones: Record<string, CardZoneConfig> = {
  deck: {
    faceDown: true,
    id: "deck" as ZoneId,
    maxSize: 60,
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
  hand: {
    faceDown: false,
    id: "hand" as ZoneId,
    maxSize: undefined,
    name: "zones.hand",
    ordered: false,
    owner: undefined,
    visibility: "private",
  },
  inkwell: {
    faceDown: true,
    id: "inkwell" as ZoneId,
    maxSize: undefined,
    name: "zones.inkwell",
    ordered: false,
    owner: undefined,
    visibility: "public",
  },
  play: {
    faceDown: false,
    id: "play" as ZoneId,
    maxSize: undefined,
    name: "zones.play",
    ordered: false,
    owner: undefined,
    visibility: "public",
  },
};

// Lorcana flow (simplified)
const lorcanaFlow: FlowDefinition<TestGameState> = {
  turn: {
    initialPhase: "beginning",
    phases: {
      beginning: {
        endIf: () => true,
        next: "main",
        onBegin: (_context) => {},
        order: 1,
      },
      end: {
        endIf: () => true,
        next: "beginning",
        onBegin: (_context) => {},
        order: 3,
      },
      main: {
        next: "end",
        onBegin: (_context) => {},
        order: 2,
      },
    },
  },
};

export function createMockLorcanaGame(): GameDefinition<TestGameState, TestMoves> {
  return {
    name: "Test Lorcana Game",
    zones: lorcanaZones,
    flow: lorcanaFlow,
    moves: lorcanaMoves,

    // Configure engine's tracker system
    trackers: {
      perPlayer: true,
      perTurn: ["hasInked"],
    },

    /**
     * Setup function - MASSIVELY SIMPLIFIED!
     *
     * BEFORE: 70+ lines tracking activePlayerId, turnNumber, gamePhase, firstPlayerDetermined, player zones
     * AFTER: 15 lines - just initialize game-specific data!
     */
    setup: (players) => {
      const playerIds = players.map((p) => p.id);
      const loreScores: Record<string, number> = {};

      for (const playerId of playerIds) {
        loreScores[playerId] = 0;
      }

      return {
        bag: [],
        effects: [],
        loreScores,
      };
    },
  };
}
