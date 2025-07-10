import { assign, sendTo, setup } from "xstate";
import { beginningPhaseMachine } from "./turn-structure/beginningPhaseMachine";
import { endOfTurnPhaseMachine } from "./turn-structure/endOfTurnPhaseMachine";
import { mainPhaseMachine } from "./turn-structure/mainPhaseMachine";

// Types
type PlayerId = string;
type CardInstanceId = string;

interface StoreInterface {
  shuffleDeck: (playerId: string) => unknown;
  startGame: (playerId: string) => unknown;
  drawInitialHands: () => unknown;
  alterHand: (cards: string[], player: PlayerId) => unknown;
}

interface GameContext {
  activePlayer: PlayerId;
  players: PlayerId[];
  turnCount: number;
  phase: string;
  inkwellCardUsed: boolean;
  store: StoreInterface;
}

export type GameEvent =
  | { type: "NEXT_PHASE" }
  | { type: "PUT_CARD_IN_INKWELL" }
  | { type: "END_TURN" }
  | { type: "COMPLETE" }
  | { type: "PHASE_COMPLETE"; order: PlayerId[] }
  | { type: "ALTER_HANDS"; playerId: PlayerId; cards: CardInstanceId[] };

// Child machine types
export type ChildMachineEvents =
  | { type: "NEXT" }
  | { type: "PUT_CARD_IN_INKWELL" }
  | { type: "END_TURN" }
  | { type: "COMPLETE" };

export const gameMachine = setup({
  types: {
    context: {} as GameContext,
    events: {} as GameEvent,
  },
  actors: {
    beginningPhaseActor: beginningPhaseMachine,
    mainPhaseActor: mainPhaseMachine,
    endOfTurnPhaseActor: endOfTurnPhaseMachine,
  },
  guards: {
    // ... existing guards ...
  },
  actions: {
    resetInkwellCardUsed: assign({
      inkwellCardUsed: false,
    }),
    incrementTurnCount: assign({
      turnCount: ({ context }) => context.turnCount + 1,
    }),
    setNextPlayer: assign(({ context }) => {
      if (context.players.length === 0) {
        throw new Error("No players in game");
      }
      const currentIndex = context.players.findIndex(
        (p: string) => p === context.activePlayer,
      );
      const nextIndex = (currentIndex + 1) % context.players.length;
      return {
        activePlayer: context.players[nextIndex],
      };
    }),
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
  },
}).createMachine({
  id: "game",
  initial: "beginningPhase",
  context: {
    activePlayer: "",
    players: [],
    turnCount: 0,
    phase: "",
    inkwellCardUsed: false,
    store: {
      shuffleDeck: () => {},
      startGame: () => {},
      drawInitialHands: () => {},
      alterHand: () => {},
    },
  },
  states: {
    beginningPhase: {
      invoke: {
        src: "beginningPhaseActor",
        onDone: {
          target: "mainPhase",
        },
      },
    },
    mainPhase: {
      invoke: {
        src: "mainPhaseActor",
        onDone: {
          target: "endOfTurnPhase",
        },
      },
      on: {
        PUT_CARD_IN_INKWELL: {
          actions: sendTo("mainPhaseActor", ({ event }) => event),
        },
      },
    },
    endOfTurnPhase: {
      invoke: {
        src: "endOfTurnPhaseActor",
        onDone: {
          target: "beginningPhase",
          actions: [
            "resetInkwellCardUsed",
            "incrementTurnCount",
            "setNextPlayer",
          ],
        },
      },
    },
  },
  on: {
    // ... existing events ...
  },
});
