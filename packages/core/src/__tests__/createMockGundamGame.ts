import type { FlowDefinition } from "../flow";
import type { GameDefinition, GameMoveDefinitions } from "../game-definition";
import type { ZoneId } from "../types";
import type { CardZoneConfig } from "../zones";

// Mock Gundam game state
type TestGameState = {
  phase: "setup" | "start" | "draw" | "resource" | "main" | "end" | "gameOver";
  turn: number;
  currentPlayer: string;
  activeResources: Record<string, number>;
  attackedThisTurn: string[];
  hasPlayedResourceThisTurn: Record<string, boolean>;
};

type TestMoves = {
  draw: { playerId: string; count: number };
  deployUnit: { playerId: string; cardId: string; position?: number };
  deployBase: { playerId: string; cardId: string };
  playResource: { playerId: string; cardId: string };
  attack: { playerId: string; attackerId: string; targetId?: string };
  pass: { playerId: string };
  concede: { playerId: string };
};

// Gundam move definitions
const gundamMoves: GameMoveDefinitions<TestGameState, TestMoves> = {
  draw: {
    reducer: () => {},
  },
  deployUnit: {
    reducer: () => {},
  },
  deployBase: {
    reducer: () => {},
  },
  playResource: {
    reducer: () => {},
  },
  attack: {
    reducer: () => {},
  },
  pass: {
    reducer: () => {},
  },
  concede: {
    reducer: () => {},
  },
};

// Gundam zone IDs
// Gundam zones configuration
const gundamZones: Record<string, CardZoneConfig> = {
  deck: {
    id: "deck" as ZoneId,
    name: "zones.deck",
    visibility: "private",
    ordered: true,
    owner: undefined,
    faceDown: true,
    maxSize: 50,
  },
  resourceDeck: {
    id: "resourceDeck" as ZoneId,
    name: "zones.resourceDeck",
    visibility: "private",
    ordered: true,
    owner: undefined,
    faceDown: true,
    maxSize: 10,
  },
  hand: {
    id: "hand" as ZoneId,
    name: "zones.hand",
    visibility: "private",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: 10, // Hand limit enforced in end phase
  },
  battleArea: {
    id: "battleArea" as ZoneId,
    name: "zones.battleArea",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: 6, // Max 6 units
  },
  shieldSection: {
    id: "shieldSection" as ZoneId,
    name: "zones.shieldSection",
    visibility: "secret",
    ordered: false,
    owner: undefined,
    faceDown: true,
    maxSize: 6, // Start with 6 shields
  },
  baseSection: {
    id: "baseSection" as ZoneId,
    name: "zones.baseSection",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: 1, // Only 1 base at a time
  },
  resourceArea: {
    id: "resourceArea" as ZoneId,
    name: "zones.resourceArea",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: 15, // Max 15 resources
  },
  trash: {
    id: "trash" as ZoneId,
    name: "zones.trash",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: undefined,
  },
  removal: {
    id: "removal" as ZoneId,
    name: "zones.removal",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: undefined,
  },
};

// Gundam flow definition
const gundamFlow: FlowDefinition<TestGameState> = {
  turn: {
    initialPhase: "start",
    onBegin: (_context) => {
      // Turn begins - untap all units in start phase
    },
    onEnd: (_context) => {
      // Turn cleanup
    },
    phases: {
      start: {
        order: 0,
        next: "draw",
        onBegin: (_context) => {
          // Untap all cards, reset abilities
        },
        endIf: () => true, // Auto-advance
      },
      draw: {
        order: 1,
        next: "resource",
        onBegin: (_context) => {
          // Draw 1 card from deck
        },
        endIf: () => true, // Auto-advance after draw
      },
      resource: {
        order: 2,
        next: "main",
        // Player can optionally play 1 resource
        // No auto-end - player must pass
      },
      main: {
        order: 3,
        next: "end",
        // Main phase - deploy units, attack, activate abilities
        // No auto-end - player must pass
      },
      end: {
        order: 4,
        next: "start", // Loop back to start for next turn
        onBegin: (_context) => {
          // End of turn effects, hand limit check
        },
        endIf: (_context) => {
          // Auto-advance after end phase processing
          return true;
        },
      },
    },
  },
};

export function createMockGundamGame(): GameDefinition<
  TestGameState,
  TestMoves
> {
  return {
    name: "Test Gundam Game",
    zones: gundamZones,
    flow: gundamFlow,
    moves: gundamMoves,
    setup: () => ({
      phase: "setup",
      turn: 1,
      currentPlayer: "p1",
      activeResources: { p1: 0, p2: 0 },
      attackedThisTurn: [],
      hasPlayedResourceThisTurn: { p1: false, p2: false },
    }),
  };
}
