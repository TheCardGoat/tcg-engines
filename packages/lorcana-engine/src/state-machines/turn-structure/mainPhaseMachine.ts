import { assign, setup } from "xstate";

export interface MainPhaseContext {
  inkwellCardUsed: boolean;
  actionsTaken: number;
}

type MainPhaseEvent = { type: "PUT_CARD_IN_INKWELL" } | { type: "END_TURN" };

export const mainPhaseMachine = setup({
  types: {
    context: {} as MainPhaseContext,
    events: {} as MainPhaseEvent,
  },
  guards: {
    canPutCardInInkwell: ({ context }) => !context.inkwellCardUsed,
  },
  actions: {
    putCardInInkwell: assign({
      inkwellCardUsed: true,
    }),
    incrementActionsTaken: assign({
      actionsTaken: ({ context }) => context.actionsTaken + 1,
    }),
  },
}).createMachine({
  id: "mainPhase",
  initial: "active",
  context: {
    inkwellCardUsed: false,
    actionsTaken: 0,
  },
  states: {
    active: {
      on: {
        PUT_CARD_IN_INKWELL: {
          actions: ["putCardInInkwell", "incrementActionsTaken"],
          guard: "canPutCardInInkwell",
        },
        END_TURN: "complete",
      },
    },
    complete: { type: "final" },
  },
});

// 4.3. Main Phase
// 4.3.1. Turn actions are the actions that the game allows a player to take during their turn. No effect or other card is needed in order to take these turn actions.

// 4.3.2. The active player may take turn actions in any order during the Main Phase of their turn. Unless otherwise noted, they may take each action any number of times, provided they have the necessary resources to pay any associated costs and complete the turn actions.
// 4.3.3. Put a card into the inkwell. This turn action is limited to once per turn.
// 4.3.3.1. The player declares they're putting a card into their inkwell, then chooses and reveals a card from their hand with the inkwell symbol. All players verify that the inkwell symbol is present.
// 4.3.3.2. The player places the revealed card in their inkwell facedown and ready.
// 4.3.3.3. Effects that would occur as a result of a card being put into the inkwell are added to the bag (see 8.7, "Bag").
