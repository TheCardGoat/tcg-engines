import type { CardModel, EffectModel } from "@lorcanito/lorcana-engine";
import {
  type BagContext,
  type StateMachineBagEffect as BagMachineEffectType,
  bagMachine,
} from "@lorcanito/lorcana-engine/state-machines/bagMachine";
import {
  type ActorRefFrom,
  assign,
  createActor,
  type DoneActorEvent,
  fromPromise,
  sendParent,
  setup,
  stop,
  waitFor,
} from "xstate";

// 4.3.6. Challenge
// 4.3.6.1.  Sending a character into a challenge is a turn action. Only characters can challenge.
// 4.3.6.2.  A character sent into a challenge is known as a challenging character, and the opposing character or location is being challenged. Both are considered to be in the challenge. Characters can challenge locations. For the differences in that process, see 4.3.6.18.
// 4.3.6.3.  Only the challenging character and the character being challenged are in the challenge. If an ability or effect refers to a character "in a challenge," it's referring to one of the two characters in the current challenge.
// 4.3.6.4.  To challenge, the active player follows the steps listed here, in order.
// 4.3.6.5.  First, the player declares one of their characters is challenging a character. The declared character must have been in play since the beginning of the turn (that is, they must be dry), ready, and otherwise able to challenge.
// 4.3.6.6.  Second, the player chooses an exerted opposing character to be challenged.
// 4.3.6.7.  Third, the players check for challenging restrictions. If any effect prevents the challenge, the challenge is illegal.
// 4.3.6.8.  Fourth, the challenging player exerts the challenging character.
// 4.3.6.9.  Fifth, the challenge occurs.
// 4.3.6.10. Sixth, "while challenging" effects apply.
// 4.3.6.11. Seventh, effects that would trigger are added to the bag.
// 4.3.6.12. Eighth, once all effects in the bag have resolved, each character deals damage equal to their Strength {S} to the other character. This is known as the "Challenge Damage step." This isn't an ability or effect and isn't added to the bag.
// 4.3.6.13. To determine the damage each character in the challenge deals, first calculate the total Strength {S} of each, taking into account any current modifier effects. If a character's {S} is negative, it counts as 0 {S} for the purpose of determining damage.
// 4.3.6.14. Apply effects that adjust the amount of damage dealt (e.g., Resist).
// 4.3.6.15. The resulting number is the final amount of damage that character deals. When damage is dealt to a character, place a number of damage counters equal to that damage on that character. (See 9.1, "Representation of Damage.")
// 4.3.6.16. Any effects that would trigger as a result of a character being banished in or during a challenge that apply trigger and resolve.
// 4.3.6.17. Once all effects have been resolved and there are no more waiting to be added, effects that apply "while challenging" or "while being challenged" end, and the challenge is over.
// 4.3.6.18. Players can choose to have a character challenge a location. This follows all of the normal rules and steps of challenging with the following exceptions.
// 4.3.6.19. When a challenger is declared, the player chooses an opposing location to challenge instead of a character.
// 4.3.6.20. Locations are never ready or exerted. They can be challenged at any time in the Main Phase.
// 4.3.6.21. Locations don't have a Strength {S} characteristic and don't deal damage to the challenging character.
// 4.3.6.22. If a character in a challenge is removed from the challenge for any reason, that challenge ends. First, resolve any remaining triggered abilities in the bag. Then, all "while challenging" effects end and the game proceeds to the Main Phase (see 4.3).

// Interfaces for interacting with game state (replace with actual implementations)
interface GameStateReader {
  getCard: (id: string) => CardModel | undefined;
  isDry: (id: string) => boolean;
  isReady: (id: string) => boolean;
  isCharacter: (id: string) => boolean;
  isLocation: (id: string) => boolean;
  canChallenge: (
    challengerId: string,
    challengedId: string,
  ) => { canChallenge: boolean; restrictions: string[] };
  getActiveEffects: (
    entityId: string,
    phase:
      | "whileChallenging"
      | "whileBeingChallenged"
      | "onChallenge"
      | "onBanish"
      | "onRemoval",
  ) => EffectModel[];
  getStrength: (id: string) => number;
  getWillpower: (id: string) => number;
  getDamage: (id: string) => number;
  // Add other necessary read methods (e.g., getResist)
}

interface StateMutator {
  exert: (id: string) => void;
  applyDamage: (id: string, amount: number) => void;
  addEffectModifier: (id: string, effect: EffectModel) => void;
  removeEffectModifier: (id: string, effect: EffectModel) => void;
  // Add other mutation methods
}

// Define a custom type that matches what we need
interface StateMachineBagEffect {
  id: string;
  sourceCard: string; // Keep as string for our implementation
  ownerId: string;
  primaryCondition: string;
  payload: any;
  effectType: string;
  effects?: any[];
  isLinkedEffect?: boolean;
  model: EffectModel;
}

// --- Context ---
interface ChallengeContext {
  challengingCharacterId: string;
  challengedEntityId: string;
  gameStateReader: GameStateReader;
  stateMutator: StateMutator;

  // Internal state
  challengingCharacter?: CardModel;
  challengedEntity?: CardModel;
  isLocationChallenge: boolean;
  canChallengeResult: { canChallenge: boolean; restrictions: string[] };
  activeChallengeEffects: EffectModel[];
  damageToChallenger: number;
  damageToChallenged: number;
  effectsForBag: StateMachineBagEffect[];
  bagRef?: ActorRefFrom<typeof bagMachine>;
  error?: string;
}

// --- Events ---
type ChallengeEvents =
  | { type: "NEXT" }
  | { type: "ENTITY_REMOVED"; entityId: string }
  | { type: "xstate.actor.error"; actorId: string; error: unknown }
  | { type: "BAG_EMPTY" }
  | { type: "BAG_EFFECTS_RESOLVED" }
  | DoneActorEvent<void>
  | { type: "FAIL_CHALLENGE"; reason: string };

// --- Input ---
interface ChallengeInput {
  challengingCharacterId: string;
  challengedEntityId: string;
  gameStateReader: GameStateReader;
  stateMutator: StateMutator;
}

// Helper function to create bag effects
function createBagEffectFromModel(
  effectModel: EffectModel,
  phase: string,
  challengerId: string,
  challengedId: string,
): StateMachineBagEffect {
  return {
    id: `effect-${Date.now()}-${Math.random()}`,
    primaryCondition: phase,
    model: effectModel,
    effects: [],
    isLinkedEffect: false,
    sourceCard: "unknown",
    ownerId: "unknown",
    payload: {},
    effectType: "unknown",
  };
}

// Create machine setup with actions and guards
// @ts-ignore: Type arguments are complex in XState's typing system
const validateChallenger = assign({
  canChallengeResult: ({ context }) => {
    const { gameStateReader, challengingCharacterId } = context;
    if (!gameStateReader.isDry(challengingCharacterId)) {
      return { canChallenge: false, restrictions: ["Challenger not dry"] };
    }
    if (!gameStateReader.isReady(challengingCharacterId)) {
      return {
        canChallenge: false,
        restrictions: ["Challenger not ready"],
      };
    }
    return { canChallenge: true, restrictions: [] };
  },
});

// @ts-ignore: Type arguments are complex in XState's typing system
const validateTarget = assign({
  canChallengeResult: ({ context }) => {
    if (!context.canChallengeResult.canChallenge)
      return context.canChallengeResult;
    const { gameStateReader, challengedEntityId, isLocationChallenge } =
      context;
    if (!isLocationChallenge && gameStateReader.isReady(challengedEntityId)) {
      return {
        canChallenge: false,
        restrictions: ["Target character not exerted"],
      };
    }
    return context.canChallengeResult;
  },
});

// @ts-ignore: Type arguments are complex in XState's typing system
const checkRestrictions = assign({
  canChallengeResult: ({ context }) => {
    if (!context.canChallengeResult.canChallenge)
      return context.canChallengeResult;
    const { gameStateReader, challengingCharacterId, challengedEntityId } =
      context;
    const result = gameStateReader.canChallenge(
      challengingCharacterId,
      challengedEntityId,
    );
    if (!result.canChallenge) {
      return {
        canChallenge: false,
        restrictions: [
          ...context.canChallengeResult.restrictions,
          ...result.restrictions,
        ],
      };
    }
    return context.canChallengeResult;
  },
});

const challengeMachineSetup = setup({
  types: {
    context: {} as ChallengeContext,
    events: {} as ChallengeEvents,
    input: {} as ChallengeInput,
  },
  actors: {
    bagMachine,
    waitForBag: fromPromise<void, { bagRef: ActorRefFrom<typeof bagMachine> }>(
      async ({ input: { bagRef } }) => {
        await waitFor(
          bagRef,
          (state) => state.status === "done" || state.matches("empty"),
        );
      },
    ),
  },
});

// @ts-ignore: BagContext import issue from bagMachine module
export const challengeMachine = challengeMachineSetup.createMachine({
  id: "challenge",
  initial: "initializing",
  context: ({ input }: { input: ChallengeInput }): ChallengeContext => ({
    challengingCharacterId: input.challengingCharacterId,
    challengedEntityId: input.challengedEntityId,
    gameStateReader: input.gameStateReader,
    stateMutator: input.stateMutator,
    challengingCharacter: input.gameStateReader.getCard(
      input.challengingCharacterId,
    ),
    challengedEntity: input.gameStateReader.getCard(input.challengedEntityId),
    isLocationChallenge: input.gameStateReader.isLocation(
      input.challengedEntityId,
    ),
    canChallengeResult: { canChallenge: false, restrictions: [] },
    activeChallengeEffects: [],
    damageToChallenger: 0,
    damageToChallenged: 0,
    effectsForBag: [],
    bagRef: undefined,
    error: undefined,
  }),
  on: {
    ENTITY_REMOVED: ".handlingRemoval",
    "xstate.actor.error": {
      target: ".failed",
      actions: assign({
        // @ts-ignore: TypeScript can't narrow event type properly here
        error: (_, event) => {
          // @ts-ignore: Adding direct ignore for property access
          return `Actor '${event.actorId}' failed: ${String(event.error)}`;
        },
      }),
    },
    FAIL_CHALLENGE: {
      target: ".failed",
      actions: assign({
        // @ts-ignore: TypeScript can't narrow event type properly here
        error: (_, event) => {
          // @ts-ignore: Adding direct ignore for property access
          return event.reason || "Unknown failure reason";
        },
      }),
    },
  },
  states: {
    initializing: {
      always: { target: "validating" },
    },
    validating: {
      // @ts-ignore: Complex type compatibility issues with action functions
      entry: [validateChallenger, validateTarget, checkRestrictions],
      always: [
        {
          target: "failed",
          guard: ({ context }) => !context.canChallengeResult.canChallenge,
          actions: assign({
            error: ({ context }) =>
              context.canChallengeResult.restrictions.join(", "),
          }),
        },
        { target: "preparingChallenge" },
      ],
    },
    preparingChallenge: {
      entry: assign({
        bagRef: ({}) => {
          const actor = createActor(bagMachine, { id: "bagMachine" });
          actor.start();
          return actor;
        },
      }),
      always: { target: "exertingChallenger" },
    },
    exertingChallenger: {
      entry: ({ context }) => {
        context.stateMutator.exert(context.challengingCharacterId);
      },
      always: { target: "applyingChallengeEffects" },
    },
    applyingChallengeEffects: {
      entry: assign({
        activeChallengeEffects: ({ context }) => {
          const {
            gameStateReader,
            stateMutator,
            challengingCharacterId,
            challengedEntityId,
          } = context;
          const effects: EffectModel[] = [];
          const challengerEffects = gameStateReader.getActiveEffects(
            challengingCharacterId,
            "whileChallenging",
          );
          const challengedEffects = gameStateReader.getActiveEffects(
            challengedEntityId,
            "whileBeingChallenged",
          );
          challengerEffects.forEach((eff: EffectModel) => {
            stateMutator.addEffectModifier(challengingCharacterId, eff);
            effects.push(eff);
          });
          challengedEffects.forEach((eff: EffectModel) => {
            stateMutator.addEffectModifier(challengedEntityId, eff);
            effects.push(eff);
          });
          return effects;
        },
      }),
      always: { target: "collectingChallengeEffects" },
    },
    collectingChallengeEffects: {
      entry: [
        // Collect effects
        assign({
          effectsForBag: ({ context }) => {
            const {
              gameStateReader,
              challengingCharacterId,
              challengedEntityId,
            } = context;
            const challengerTriggers = gameStateReader.getActiveEffects(
              challengingCharacterId,
              "onChallenge",
            );
            const challengedTriggers = gameStateReader.getActiveEffects(
              challengedEntityId,
              "onChallenge",
            );
            return [...challengerTriggers, ...challengedTriggers].map((model) =>
              createBagEffectFromModel(
                model,
                "challenge",
                challengingCharacterId,
                challengedEntityId,
              ),
            );
          },
        }),
        // Send effects to bag
        ({ context }) => {
          if (!context.bagRef) return;
          context.effectsForBag.forEach((effect) => {
            if (context.bagRef) {
              context.bagRef.send({
                type: "ADD_EFFECT",
                effect: effect as any,
              });
            }
          });
        },
        // Clear collected effects
        assign({
          effectsForBag: [],
        }),
      ],
      always: { target: "resolvingEffects" },
    },
    resolvingEffects: {
      invoke: {
        id: "bagResolver",
        src: "waitForBag",
        input: ({ context }) => ({ bagRef: context.bagRef! }),
        onDone: { target: "calculatingDamage" },
        onError: {
          target: "failed",
          actions: assign({ error: "Error resolving effects in bag" }),
        },
      },
    },
    calculatingDamage: {
      entry: assign({
        damageToChallenged: ({ context }) => {
          const baseStrength = context.gameStateReader.getStrength(
            context.challengingCharacterId,
          );
          return Math.max(0, baseStrength);
        },
        damageToChallenger: ({ context }) => {
          if (context.isLocationChallenge) return 0;
          const baseStrength = context.gameStateReader.getStrength(
            context.challengedEntityId,
          );
          return Math.max(0, baseStrength);
        },
      }),
      always: [
        {
          target: "checkingBanishment",
          guard: ({ context }) => context.isLocationChallenge,
        },
        { target: "applyingDamage" },
      ],
    },
    applyingDamage: {
      entry: ({ context }) => {
        context.stateMutator.applyDamage(
          context.challengedEntityId,
          context.damageToChallenged,
        );
        if (!context.isLocationChallenge) {
          context.stateMutator.applyDamage(
            context.challengingCharacterId,
            context.damageToChallenger,
          );
        }
      },
      always: { target: "checkingBanishment" },
    },
    checkingBanishment: {
      always: [
        {
          target: "collectingBanishmentEffects",
          guard: ({ context }) => {
            const {
              gameStateReader,
              challengingCharacterId,
              challengedEntityId,
              isLocationChallenge,
            } = context;
            const challengerWillpower = gameStateReader.getWillpower(
              challengingCharacterId,
            );
            const challengerDamage = gameStateReader.getDamage(
              challengingCharacterId,
            );
            if (challengerDamage >= challengerWillpower) return true;
            if (isLocationChallenge) {
              const challengedWillpower =
                gameStateReader.getWillpower(challengedEntityId);
              const challengedDamage =
                gameStateReader.getDamage(challengedEntityId);
              if (challengedDamage >= challengedWillpower) return true;
            } else {
              const challengedWillpower =
                gameStateReader.getWillpower(challengedEntityId);
              const challengedDamage =
                gameStateReader.getDamage(challengedEntityId);
              if (challengedDamage >= challengedWillpower) return true;
            }
            return false;
          },
        },
        { target: "cleaningUp" },
      ],
    },
    collectingBanishmentEffects: {
      entry: [
        // Collect banishment effects
        assign({
          effectsForBag: ({ context }) => {
            const {
              gameStateReader,
              challengingCharacterId,
              challengedEntityId,
            } = context;
            const challengerTriggers = gameStateReader.getActiveEffects(
              challengingCharacterId,
              "onBanish",
            );
            const challengedTriggers = gameStateReader.getActiveEffects(
              challengedEntityId,
              "onBanish",
            );
            return [...challengerTriggers, ...challengedTriggers].map((model) =>
              createBagEffectFromModel(
                model,
                "banish",
                challengingCharacterId,
                challengedEntityId,
              ),
            );
          },
        }),
        // Send effects to bag
        ({ context }) => {
          if (!context.bagRef) return;
          context.effectsForBag.forEach((effect) => {
            if (context.bagRef) {
              context.bagRef.send({
                type: "ADD_EFFECT",
                effect: effect as any,
              });
            }
          });
        },
        // Clear collected effects
        assign({
          effectsForBag: [],
        }),
      ],
      always: [
        {
          target: "resolvingEffects",
          guard: ({ context }) => context.effectsForBag.length > 0,
        },
        { target: "cleaningUp" },
      ],
    },
    cleaningUp: {
      entry: [
        // Cleanup challenge effects
        ({ context }) => {
          const {
            stateMutator,
            activeChallengeEffects,
            challengingCharacterId,
          } = context;
          activeChallengeEffects.forEach((eff: EffectModel) => {
            const targetId = challengingCharacterId;
            stateMutator.removeEffectModifier(targetId, eff);
          });
        },
        // Clear active challenge effects
        assign({
          activeChallengeEffects: [],
        }),
        // Stop bag machine
        stop("bagMachine"),
      ],
      always: { target: "done" },
    },
    handlingRemoval: {
      entry: [
        // Cleanup challenge effects
        ({ context }) => {
          const {
            stateMutator,
            activeChallengeEffects,
            challengingCharacterId,
          } = context;
          activeChallengeEffects.forEach((eff: EffectModel) => {
            const targetId = challengingCharacterId;
            stateMutator.removeEffectModifier(targetId, eff);
          });
        },
        // Clear active challenge effects
        assign({
          activeChallengeEffects: [],
        }),
      ],
      always: { target: "collectingRemovalEffects" },
    },
    collectingRemovalEffects: {
      entry: [
        // Collect removal effects
        assign({
          effectsForBag: ({ context }) => {
            const {
              gameStateReader,
              challengingCharacterId,
              challengedEntityId,
            } = context;
            const challengerTriggers = gameStateReader.getActiveEffects(
              challengingCharacterId,
              "onRemoval",
            );
            const challengedTriggers = gameStateReader.getActiveEffects(
              challengedEntityId,
              "onRemoval",
            );
            return [...challengerTriggers, ...challengedTriggers].map((model) =>
              createBagEffectFromModel(
                model,
                "removal",
                challengingCharacterId,
                challengedEntityId,
              ),
            );
          },
        }),
        // Send effects to bag
        ({ context }) => {
          if (!context.bagRef) return;
          context.effectsForBag.forEach((effect) => {
            if (context.bagRef) {
              context.bagRef.send({
                type: "ADD_EFFECT",
                effect: effect as any,
              });
            }
          });
        },
        // Clear collected effects
        assign({
          effectsForBag: [],
        }),
      ],
      always: [
        {
          target: "resolvingRemovalEffects",
          guard: ({ context }) => context.effectsForBag.length > 0,
        },
        {
          target: "failed",
          actions: assign({
            error: "Challenge ended due to entity removal (no effects)",
          }),
        },
      ],
    },
    resolvingRemovalEffects: {
      invoke: {
        id: "bagRemovalResolver",
        src: "waitForBag",
        input: ({ context }) => ({ bagRef: context.bagRef! }),
        onDone: {
          target: "failed",
          actions: assign({
            error: "Challenge ended due to entity removal",
          }),
        },
        onError: {
          target: "failed",
          actions: assign({ error: "Error resolving removal effects in bag" }),
        },
      },
    },
    done: {
      type: "final",
      entry: sendParent({ type: "CHALLENGE_COMPLETE" }),
    },
    failed: {
      type: "final",
      entry: [
        // Cleanup challenge effects
        ({ context }) => {
          const {
            stateMutator,
            activeChallengeEffects,
            challengingCharacterId,
          } = context;
          activeChallengeEffects.forEach((eff: EffectModel) => {
            const targetId = challengingCharacterId;
            stateMutator.removeEffectModifier(targetId, eff);
          });
        },
        // Clear active challenge effects
        assign({
          activeChallengeEffects: [],
        }),
        // Stop bag machine
        stop("bagMachine"),
        // Send challenge failed
        sendParent(({ context }) => ({
          type: "CHALLENGE_FAILED",
          reason: context.error || "Unknown reason",
        })),
      ],
    },
  },
});
