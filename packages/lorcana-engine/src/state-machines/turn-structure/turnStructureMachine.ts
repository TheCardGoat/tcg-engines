import { beginningPhaseMachine } from "@lorcanito/lorcana-engine/state-machines/turn-structure/beginningPhaseMachine";
import { endOfTurnPhaseMachine } from "@lorcanito/lorcana-engine/state-machines/turn-structure/endOfTurnPhaseMachine";
import { mainPhaseMachine } from "@lorcanito/lorcana-engine/state-machines/turn-structure/mainPhaseMachine";
import { assign, setup } from "xstate";

type PlayerId = string;
type CardInstanceId = string;

interface StoreInterface {
  shuffleDeck: (playerId: string) => unknown;
  startGame: (playerId: string) => unknown;
  drawInitialHands: () => unknown;
  alterHand: (cards: string[], player: PlayerId) => unknown;
}

export type TurnContext = {};

type TurnEvent =
  | { type: "PHASE_COMPLETE"; order: PlayerId[] }
  | { type: "ALTER_HANDS"; playerId: PlayerId; cards: CardInstanceId[] };

// Actions (these would be implemented elsewhere)
const actions = {
  readyCards: () => {},
  applyDuringTurnEffects: () => {},
  endStartOfTurnEffects: () => {},
  triggerStartOfTurnEffects: () => {},
  resetDryingCharacters: () => {},
  gainLoreFromLocations: () => {},
  resolveTriggers: () => {},
  drawCard: () => {},
  putCardInInkwell: assign({
    inkwellCardUsed: true,
  }),
  addEndOfTurnEffects: () => {},
  endEndOfTurnEffects: () => {},
};

export const turnStructureMachine = setup({
  types: {
    context: {} as TurnContext,
    events: {} as TurnEvent,
  },
  actions: {
    initialize: () => {},
  },
  guards: {
    allPlayersDecided: ({ context }) => true,
  },
  actors: {
    beginningPhaseActor: beginningPhaseMachine,
    mainPhaseActor: mainPhaseMachine,
    endOfTurnPhaseActor: endOfTurnPhaseMachine,
  },
}).createMachine({
  id: "turnStructure",
  initial: "beginningPhase",
  context: {},
  states: {
    beginningPhase: {
      on: {
        PHASE_COMPLETE: "mainPhase",
      },
    },
    mainPhase: {
      on: {
        PHASE_COMPLETE: "endOfTurnPhase",
      },
    },
    endOfTurnPhase: {
      on: {
        PHASE_COMPLETE: "turnComplete",
      },
    },
    turnComplete: {
      type: "final",
    },
  },
});

// 4. TURN STRUCTURE
// 4.1. Phases
// 4.1.1. A turn has three phases, which occur in this order: Beginning Phase, Main Phase, and End of Turn Phase.
// 4.1.2. The Beginning Phase is where a player resets their cards as appropriate for their new turn. This is where all effects that end at the start of the player’s turn end and where effects that occur or begin at the start of their turn happen. The Beginning Phase has three steps: Ready, Set, and Draw. (See 4.2, Beginning Phase.)
// 4.1.3. The Main Phase is where a player can act on their turn, choosing to perform any of the Main Phase turn actions. (See 4.3, Main Phase.)
// 4.1.4. The End of Turn Phase is where all effects that end at the current turn end. If effects would be added to the bag as a result of effects ending, those effects are resolved and the game proceeds to the next player’s Beginning Phase. (See 4.4, End of Turn Phase.)
