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

// This is a mock move set, demonstrating type safety for Lorcana game moves
const lorcanaMoves: GameMoveDefinitions<TestGameState, TestMoves> = {
  passTurn: {
    reducer: (draft, context) => {
      // ✅ context.params is {} (empty object for void moves)
      // No parameters to destructure
      console.log("Turn passed by player", context.playerId);
    },
  },
  concede: {
    reducer: (draft, context) => {
      // ✅ context.params is {} (empty object for void moves)
      console.log("Player conceded", context.playerId);
    },
  },
  chooseWhoGoesFirstMove: {
    reducer: (draft, context) => {
      // ✅ context.params is typed as { playerId: string }
      const { playerId } = context.params;
      console.log("Player chosen to go first:", playerId);
    },
  },
  alterHand: {
    reducer: (draft, context) => {
      // ✅ context.params is typed as { playerId: string; cards: string[] }
      const { playerId, cards } = context.params;
      console.log(`Altering hand for ${playerId} with cards:`, cards);
    },
  },
  putACardIntoTheInkwell: {
    reducer: (draft, context) => {
      // ✅ context.params is typed as { cardId: string }
      const { cardId } = context.params;
      console.log("Card added to inkwell:", cardId);
    },
  },
  playCard: {
    reducer: (draft, context) => {
      // ✅ context.params is typed as { cardId: string; alternativeCost?: AlternativeCost }
      const { cardId, alternativeCost } = context.params;

      if (alternativeCost) {
        // ✅ TypeScript knows alternativeCost has type, targetInstanceId
        console.log(
          `Playing card ${cardId} with alternative cost: ${alternativeCost.type}`,
        );

        if (alternativeCost.type === "shift") {
          console.log("Shift targets:", alternativeCost.targetInstanceId);
        }
      } else {
        console.log(`Playing card ${cardId} with normal cost`);
      }
    },
  },
  quest: {
    reducer: (draft, context) => {
      // ✅ context.params is typed as { cardId: string }
      const { cardId } = context.params;
      console.log("Card questing:", cardId);
    },
  },
  challenge: {
    reducer: (draft, context) => {
      // ✅ context.params is typed as { attackerId: string; defenderId: string }
      const { attackerId, defenderId } = context.params;
      console.log(`Challenge: ${attackerId} attacks ${defenderId}`);
    },
  },
  sing: {
    reducer: (draft, context) => {
      // ✅ context.params is typed as { singerId: string; songId: string }
      const { singerId, songId } = context.params;
      console.log(`${singerId} sings ${songId}`);
    },
  },
  singTogether: {
    reducer: (draft, context) => {
      // ✅ context.params is typed as { singersIds: string[]; songId: string }
      const { singersIds, songId } = context.params;
      console.log(`${singersIds.join(", ")} sing together: ${songId}`);
    },
  },
  moveCharacterToLocation: {
    reducer: (draft, context) => {
      // ✅ context.params is typed as { characterId: string; locationId: string }
      const { characterId, locationId } = context.params;
      console.log(`Moving ${characterId} to ${locationId}`);
    },
  },
  activateAbility: {
    reducer: (draft, context) => {
      // ✅ context.params is typed as { cardId: string; opts?: { abilityIndex?: number; abilityText?: string; alternativeCost?: AlternativeCost } }
      const { cardId, opts } = context.params;

      if (opts) {
        // ✅ TypeScript knows opts structure
        console.log(
          `Activating ability on ${cardId}, index: ${opts.abilityIndex}`,
        );

        if (opts.alternativeCost) {
          console.log("With alternative cost:", opts.alternativeCost.type);
        }
      } else {
        console.log(`Activating ability on ${cardId}`);
      }
    },
  },
  resolveBag: {
    reducer: (draft, context) => {
      // ✅ context.params is typed as { bagId: string; params: unknown }
      const { bagId, params } = context.params;
      console.log(`Resolving bag ${bagId} with params:`, params);
    },
  },
  resolveEffect: {
    reducer: (draft, context) => {
      // ✅ context.params is typed as { effectId: string; params: unknown }
      const { effectId, params } = context.params;
      console.log(`Resolving effect ${effectId} with params:`, params);
    },
  },
  manualExert: {
    reducer: (draft, context) => {
      // ✅ context.params is typed as { cardId: string }
      const { cardId } = context.params;
      console.log("Manually exerting card:", cardId);
    },
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
