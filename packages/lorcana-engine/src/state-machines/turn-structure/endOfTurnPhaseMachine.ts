import { assign, setup } from "xstate";

export interface EndOfTurnPhaseContext {
  effects: string[];
  triggers: string[];
}

export type EndOfTurnPhaseEvent =
  | { type: "ADD_EFFECT"; effect: string }
  | { type: "RESOLVE_TRIGGER"; trigger: string }
  | { type: "END_EFFECT"; effect: string }
  | { type: "COMPLETE" };

export const endOfTurnPhaseMachine = setup({
  types: {
    context: {} as EndOfTurnPhaseContext,
    events: {} as EndOfTurnPhaseEvent,
  },
  actions: {
    addEffect: assign(({ context, event }) => {
      if (event.type !== "ADD_EFFECT") return {};
      return {
        effects: [...context.effects, event.effect],
      };
    }),
    resolveTrigger: assign(({ context, event }) => {
      if (event.type !== "RESOLVE_TRIGGER") return {};
      return {
        triggers: context.triggers.filter((t) => t !== event.trigger),
      };
    }),
    endEffect: assign(({ context, event }) => {
      if (event.type !== "END_EFFECT") return {};
      return {
        effects: context.effects.filter((e) => e !== event.effect),
      };
    }),
  },
}).createMachine({
  id: "endOfTurnPhase",
  initial: "resolving",
  context: {
    effects: [],
    triggers: [],
  },
  states: {
    resolving: {
      entry: ["addEffect", "resolveTrigger", "endEffect"],
      on: {
        COMPLETE: "complete",
      },
    },
    complete: { type: "final" },
  },
});

// 4.4. End of Turn Phase
// 4.4.1. To end a turn, there must be no abilities currently waiting to resolve. The active player declares the end of their turn. This creates the start of the End of Turn Phase (see 4.1.4).
// 4.4.1.1. Effects that would occur "At the end of the turn" and "At the end of your turn" and abilities are added to the bag. 4.4.1.2. Resolve all triggers in the bag.
// 4.4.1.3. Effects that would end at the end of your turn end. This includes effects with a stated duration of "this turn" (e.g., Support). If this causes any new triggers, return to step 4.4.1.2.
// 4.4.1.4. The turn ends for the active player, and the next player begins their turn.
