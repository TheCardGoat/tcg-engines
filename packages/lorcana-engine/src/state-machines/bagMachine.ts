import type {
  CardModel,
  EffectModel,
  Match,
  ResolvingParam,
} from "@lorcanito/lorcana-engine";
import { assign, setup } from "xstate";

// 1.7. The Bag
// 1.7.1. The bag is the zone where triggered abilities wait to resolve. It’s not a physical zone but a way to picture the process of resolving triggered abilities. Think of each triggered ability as a marble and the bag as a place to put them until they’re resolved. Every marble is separate from every other marble, and a player can look through the bag of marbles to select the one they wish to resolve next.
// 1.7.2. It’s possible for both the active player and their opponent(s) to add triggered abilities to the bag at the same time. Resolving these abilities follows the rules in section 8.7, Bag.

// 7.4. Triggered Abilities
// 7.4.1. Triggered abilities occur when their trigger condition is met. They trigger only once per trigger condition that is met.
// 7.4.2. Triggered abilities start with "When," "Whenever," "At the start of," or "At the end of" and describe the game state that causes the abilities to trigger and the effects of the abilities.
// 7.4.3. When an ability triggers, its effect is placed into the bag to be resolved in order as described in section 8.7, "Bag."
// 7.4.4. Some triggered abilities are written as "[Trigger Condition], if [Secondary Condition], [Effect]. These abilities check whether the secondary condition is true both when the effect would be added to the bag and again when the effect resolves.
// 7.4.4.1. If the secondary condition is false when the effect would be added to the bag, the effect is never added to the bag.
// 7.4.4.2. If the secondary condition is false when the effect would resolve, the triggered ability resolves with no effect.
// 7.4.5. Some triggered abilities are written as, "[Trigger Condition], [Effect]. [Effect]." Both effects are linked to the trigger condition but are independent of each other.
// 7.4.6. Some triggered abilities are written as, "[Trigger Condition] and [Trigger Condition], [Effect]." These abilities function as having two triggered abilities that are independent of each other but both resolve for the same effect.
// 7.4.7. Some abilities and effects create a trigger condition that lasts a duration of time where they exist and can occur. These are usually created as the result of a resolving action. They are functional only for the stated duration. Once that duration has passed, the trigger condition ceases to exist. These are known as floating triggered abilities.

// 8.7. Bag
// 8.7.1. Unlike other zones, the bag isn't a physical space but is only where triggered abilities created by the game wait to resolve.
// 8.7.2. Only triggered abilities can be added to the bag. Activated abilities, resolving actions, and playing characters, locations, or items aren't added to the bag.
// 8.7.3. Whenever a triggered ability's condition is met, the ability is added to the bag by the player who played the card with the triggered ability. If multiple triggered abilities happen at the same time, they're added to the bag simultaneously by the respective players.
// 8.7.4. Then the active player chooses and resolves any one of their triggered abilities and fully resolves it. If the resolution of an ability causes another ability to trigger, the new triggered ability is added to the bag once the current ability is finished resolving.
// 8.7.5. If there are abilities from multiple players in the bag, the active player resolves all of their abilities first, one at a time, including any that were added as a result of resolving abilities.
// 8.7.6. The next player resolves all of their abilities following the guidelines in 8.7.5. If this causes new triggers, regardless of whose abilities triggered, the current resolving player keeps resolving their triggers.
// 8.7.7. Continue around the table in turn order as described in 8.7.5–8.7.6 until there are no more triggers to resolve.
// 8.7.8. Once the bag is empty and all players have no more abilities to resolve or turn actions to take, the players proceed to the next step or phase of the game.
// 8.7.9. If a player leaves the game while abilities are still waiting in the bag to resolve, those abilities cease to exist.

interface TriggerCondition {
  type: "WHEN" | "WHENEVER" | "AT_START_OF" | "AT_END_OF";
  event: string;
}

export interface StateMachineBagEffect {
  id: string;
  sourceCard: CardModel;
  ownerId: string; // Added to track which player's effect it is
  primaryCondition: TriggerCondition;
  secondaryCondition?: (gameState: Match) => boolean;
  effects: Array<EffectModel>;
  isLinkedEffect: boolean;
  duration?: number; // For floating triggered abilities
}

type BagEvents =
  | { type: "ADD_EFFECT"; effect: StateMachineBagEffect }
  | { type: "RESOLVE_EFFECT"; params: ResolvingParam }
  | { type: "EFFECT_RESOLVED" }
  | { type: "NEW_TRIGGER_ADDED" }
  | { type: "PROCEED_TO_NEXT_PLAYER" };

export interface BagContext {
  effects: StateMachineBagEffect[];
  currentEffect?: StateMachineBagEffect;
  gameState: Match;
  activePlayerId: string;
  currentResolvingPlayerId?: string;
  playerOrder: string[];
}

type BagState =
  | "empty"
  | "initializeResolution"
  | "checkingPlayerEffects"
  | "resolvingEffect"
  | "checkingMorePlayers"
  | "movingToNextPlayer"
  | "complete";

export function createBagMachine({
  initialContext,
  initialState,
}: {
  initialContext?: BagContext;
  initialState?: BagState;
} = {}) {
  const initial = initialState || "empty";
  const context: BagContext = initialContext || {
    effects: [],
    currentEffect: undefined,
    gameState: {} as Match,
    activePlayerId: "",
    currentResolvingPlayerId: undefined,
    playerOrder: [],
  };
  return setup({
    types: {
      context: {} as BagContext,
      events: {} as BagEvents,
    },
    actions: {
      addEffectToBag: assign({
        effects: ({ context, event }, params) => {
          if (event.type !== "ADD_EFFECT") {
            return context.effects;
          }

          // 7.4.4.1 Check secondary condition before adding
          if (
            event.effect.secondaryCondition &&
            !event.effect.secondaryCondition(context.gameState)
          ) {
            return context.effects;
          }

          // 8.7.3 Add the triggered ability to the bag
          return [...context.effects, event.effect];
        },
      }),

      resolveCurrentEffect: assign({
        currentEffect: ({ context, event }) => {
          // 8.7.4 Active player chooses one of their triggered abilities
          const playerEffects = context.effects.filter(
            (effect) => effect.ownerId === context.currentResolvingPlayerId,
          );
          return playerEffects[0];
        },
        effects: ({ context, event }) => {
          const effectToRemove = context.effects.findIndex(
            (effect) => effect.ownerId === context.currentResolvingPlayerId,
          );
          return context.effects.filter((_, index) => index !== effectToRemove);
        },
      }),

      moveToNextPlayer: assign({
        currentResolvingPlayerId: ({ context, event }) => {
          const currentIndex = context.playerOrder.indexOf(
            context.currentResolvingPlayerId || context.activePlayerId,
          );
          const nextIndex = (currentIndex + 1) % context.playerOrder.length;
          return context.playerOrder[nextIndex];
        },
      }),

      executeEffect: ({ context, event }) => {
        if (!context.currentEffect) return;

        // 7.4.4.2 Check secondary condition before resolving
        if (
          context.currentEffect.secondaryCondition &&
          !context.currentEffect.secondaryCondition(context.gameState)
        ) {
          return;
        }

        // Execute all linked effects if they exist
        // context.currentEffect.effects.forEach((effect) => effect());
      },
    },
    guards: {
      hasEffectsToResolve: () => true,
      hasMorePlayersWithEffects: () => true,
      isFloatingTriggerValid: () => true,
      // hasEffectsToResolve: ({ context }, params: unknown) => {
      //   // Check if current resolving player has any effects
      //   return context.effects.some(
      //     (effect) => effect.playerId === context.currentResolvingPlayerId,
      //   );
      // },
      // hasMorePlayersWithEffects: ({ context }, params: unknown) => {
      //   // Check if there are any effects left from other players
      //   return context.effects.length > 0;
      // },
      // isFloatingTriggerValid: ({ context }, { effect }) => {
      //   // 7.4.7 Check if floating trigger is still within its duration
      //   if (!effect.duration) return true;
      //   return effect.duration > 0;
      // },
    },
  }).createMachine({
    id: "bag",
    initial,
    context,
    states: {
      empty: {
        on: {
          ADD_EFFECT: {
            target: "pending",
            actions: "addEffectToBag",
          },
          RESOLVE_EFFECT: {
            target: "initializeResolution",
          },
        },
      },
      pending: {
        on: {
          ADD_EFFECT: {
            target: "pending",
            actions: "addEffectToBag",
          },
          RESOLVE_EFFECT: {
            target: "initializeResolution",
          },
        },
      },
      initializeResolution: {
        entry: assign({
          currentResolvingPlayerId: ({ context }) => context.activePlayerId,
        }),
        always: "checkingPlayerEffects",
      },
      checkingPlayerEffects: {
        always: [
          {
            target: "resolvingEffect",
            guard: "hasEffectsToResolve",
            actions: "resolveCurrentEffect",
          },
          {
            target: "checkingMorePlayers",
          },
        ],
      },
      resolvingEffect: {
        entry: "executeEffect",
        on: {
          EFFECT_RESOLVED: "checkingPlayerEffects",
          NEW_TRIGGER_ADDED: {
            target: "resolvingEffect",
            actions: "addEffectToBag",
          },
        },
      },
      checkingMorePlayers: {
        always: [
          {
            target: "movingToNextPlayer",
            guard: "hasMorePlayersWithEffects",
          },
          {
            target: "complete",
          },
        ],
      },
      movingToNextPlayer: {
        entry: "moveToNextPlayer",
        always: "checkingPlayerEffects",
      },
      complete: {
        type: "final",
      },
    },
  });
}

export const bagMachine = createBagMachine();
