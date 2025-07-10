import { setup } from "xstate";

export interface BeginningPhaseContext {
  readyCards: boolean;
  duringTurnEffects: boolean;
  startOfTurnEffects: boolean;
  triggers: boolean;
}

export type BeginningPhaseEvent =
  | { type: "NEXT" }
  | { type: "READY_CARDS" }
  | { type: "APPLY_DURING_TURN_EFFECTS" }
  | { type: "END_START_OF_TURN_EFFECTS" }
  | { type: "TRIGGER_START_OF_TURN_EFFECTS" };

export const beginningPhaseMachine = setup({
  types: {
    context: {} as BeginningPhaseContext,
    events: {} as BeginningPhaseEvent,
  },
  actions: {
    readyCards: () => {},
    applyDuringTurnEffects: () => {},
    endStartOfTurnEffects: () => {},
    triggerStartOfTurnEffects: () => {},
    resetDryingCharacters: () => {},
    gainLoreFromLocations: () => {},
    resolveTriggers: () => {},
    drawCard: () => {},
  },
}).createMachine({
  id: "beginningPhase",
  initial: "ready",
  context: {
    readyCards: false,
    duringTurnEffects: false,
    startOfTurnEffects: false,
    triggers: false,
  },
  states: {
    ready: {
      entry: [
        "readyCards",
        "applyDuringTurnEffects",
        "endStartOfTurnEffects",
        "triggerStartOfTurnEffects",
      ],
      on: { NEXT: "set" },
    },
    set: {
      entry: [
        "resetDryingCharacters",
        "gainLoreFromLocations",
        "resolveTriggers",
      ],
      on: { NEXT: "draw" },
    },
    draw: {
      entry: "drawCard",
      on: { NEXT: "complete" },
    },
    complete: { type: "final" },
  },
});

// 4.2. Beginning Phase
// 4.2.1. Ready
// 4.2.1.1. The active player readies all their cards in play and in their inkwell.
// 4.2.1.2. Effects that apply "During your turn" start applying.
// 4.2.1.3. Effects that end "at the start of your turn" or "at the start of your next turn" end.
// 4.2.1.4. Effects that trigger "at the start of your turn" and "at the beginning of your turn" trigger but do not yet resolve (see 4.2.2.3).
// 4.2.2. Set
// 4.2.2.1. Characters that are in play are no longer "drying" and will be able to quest, challenge, or {E} to pay costs for activated abilities or song cards.
// 4.2.2.2. The active player gains lore from locations they have in play with a {L} characteristic. This isn't a triggered ability and doesn't use the bag.
// 4.2.2.3. Effects that would occur "At the start of your turn" or "At the beginning of your turn" and abilities that triggered during the Ready step are added to the bag. Then, all triggers are resolved.
// 4.2.3. Draw
// 4.2.3.1. Drawing is when a player takes the top card of their deck and puts that card into their hand. A player can draw only from their deck. Putting a card into a hand from any zone besides the deck isn't considered drawing.
// 4.2.3.2. First, the active player draws a card from their deck. If this turn is the first turn of the game, the active player skips this step.
// 4.2.3.3. Once all effects have been resolved and there are no more waiting to be added, the game moves into the Main Phase.
