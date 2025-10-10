import type { FlowDefinition } from "../flow";
import type { GameDefinition, GameMoveDefinitions } from "../game-definition";
import type { ZoneId } from "../types";
import type { CardZoneConfig } from "../zones";

// This is just a mock definition, so it's OK to be unknown
type TestGameState = {
  effects: unknown[];
  bag: unknown[];
};

type AlternativeCost = {
  type: "shift" | "sing" | "sing-together";
  targetInstanceId: string[]; // For shift, the character to shift onto
};
type TestMoves = {
  passTurn: void;
  concede: void;
  chooseWhoGoesFirstMove: { playerId: string };
  alterHand: { playerId: string; cards: string[] };
  putACardIntoTheInkwell: { cardId: string };
  playCard: {
    cardId: string;
    alternativeCost?: AlternativeCost;
  };
  quest: { cardId: string };
  challenge: { attackerId: string; defenderId: string };
  sing: { singerId: string; songId: string };
  singTogether: { singersIds: string[]; songId: string };
  moveCharacterToLocation: { characterId: string; locationId: string };
  activateAbility: {
    cardId: string;
    opts?: {
      abilityIndex?: number; // If the card has multiple activated abilities, the index of the one to use (0-based)
      abilityText?: string;
      alternativeCost?: AlternativeCost;
    };
  };
  resolveBag: { bagId: string; params: unknown };
  resolveEffect: { effectId: string; params: unknown };
  manualExert: { cardId: string };
};

// This is a mock move set, only to validate if typescripts works properly for Lorcana game
const lorcanaMoves: GameMoveDefinitions<TestGameState, TestMoves> = {
  passTurn: {
    reducer: () => {},
  },
  concede: {
    reducer: () => {},
  },
  chooseWhoGoesFirstMove: {
    reducer: () => {},
  },
  alterHand: {
    reducer: () => {},
  },
  putACardIntoTheInkwell: {
    reducer: () => {},
  },
  playCard: {
    reducer: () => {},
  },
  quest: {
    reducer: () => {},
  },
  challenge: {
    reducer: () => {},
  },
  sing: {
    reducer: () => {},
  },
  singTogether: {
    reducer: () => {},
  },
  moveCharacterToLocation: {
    reducer: () => {},
  },
  activateAbility: {
    reducer: () => {},
  },
  resolveBag: {
    reducer: () => {},
  },
  resolveEffect: {
    reducer: () => {},
  },
  manualExert: {
    reducer: () => {},
  },
};

const handId: ZoneId = "hand" as ZoneId;
const deckId: ZoneId = "deck" as ZoneId;
const playId: ZoneId = "play" as ZoneId;
const inkwellId: ZoneId = "inkwell" as ZoneId;
const discardId: ZoneId = "discard" as ZoneId;

// This is a mock, just to test typescript
const lorcanaZones: Record<string, CardZoneConfig> = {
  hand: {
    id: handId,
    name: "zones.hand",
    visibility: "private",
    ordered: false,
    owner: undefined, // each player should have their own
    faceDown: false,
    maxSize: undefined,
  },
  deck: {
    id: deckId,
    name: "zones.deck",
    visibility: "secret",
    ordered: true,
    owner: undefined,
    faceDown: true,
    maxSize: undefined,
  },
  play: {
    id: playId,
    name: "zones.play",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: undefined,
  },
  inkwell: {
    id: inkwellId,
    name: "zones.inkwell",
    visibility: "secret",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: undefined,
  },
  discard: {
    id: discardId,
    name: "zones.discard",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: undefined,
  },
};

// This is a mock, just to test typescript
const lorcanaFlow: FlowDefinition<TestGameState> = {
  turn: {
    initialPhase: "beginningPhase",
    onBegin: (context) => {
      // Turn begins - typically handled by ready step
    },
    onEnd: (context) => {
      // Turn cleanup
    },
    phases: {
      beginningPhase: {
        order: 1,
        next: "mainPhase",
        segments: {
          readyStep: {
            order: 1,
            next: "setStep",
            onBegin: (context) => {
              // Ready all cards for current player
            },
            endIf: () => true, // Auto-advance
          },
          setStep: {
            order: 2,
            next: "drawStep",
            onBegin: (context) => {
              // Clear drying state, gain lore from locations
            },
            endIf: () => true, // Auto-advance
          },
          drawStep: {
            order: 3,
            onBegin: (context) => {
              // Draw a card (except first turn)
            },
            endIf: () => true, // Auto-advance, ends phase
          },
        },
      },
      mainPhase: {
        order: 2,
        next: "endOfTurnPhase",
        segments: {
          idle: {
            order: 1,
            // Main phase continues until player passes turn
            // No auto-end condition
          },
        },
      },
      endOfTurnPhase: {
        order: 3,
        next: "beginningPhase",
        onBegin: (context) => {
          // Trigger end-of-turn effects
        },
        endIf: (context) => {
          // End when bag is empty
          return context.state.bag.length === 0;
        },
      },
    },
  },
};

export function createMockLorcanaGame(): GameDefinition<
  TestGameState,
  TestMoves
> {
  return {
    name: "Test Lorcana Game",
    zones: lorcanaZones,
    flow: lorcanaFlow,
    moves: lorcanaMoves,
    setup: () => ({
      effects: [],
      bag: [],
    }),
  };
}
