import type { Effect } from "@tcg/cyberpunk-types";
import type { MoveDefinition, MoveInput } from "../types/commands.ts";
import type { ChooseTargetPendingChoice } from "../types/match-state.ts";
import type { ResolutionContext } from "../effects/target-resolver.ts";
import { resolveEffect } from "../effects/handlers/index.ts";
import {
  abandonCurrentTrigger,
  enqueueEventTriggers,
  executeAbilityEffects,
  emitEffectNoActionLog,
  resumeCurrentTrigger,
} from "../ability-executor.ts";
import {
  buildEffectTargetActionLogDetails,
  buildTargetResolvedActionLog,
  classifyEffectTargets,
  targetResolvedMessageKey,
} from "../logging/effect-target.ts";
import { defOf } from "../state/lookups.ts";
import type { MatchState } from "../types/match-state.ts";
import type { CardInstanceId } from "../types/branded.ts";
import { resumeSuspendedEndTurn } from "./pass-phase.ts";
import { computeEffectiveCost } from "./compute-effective-cost.ts";
import { availableEddies } from "./eddie-resources.ts";
import { validateGigCopyPair } from "../effects/gig-copy-selection.ts";

export interface ResolveEffectTargetInput extends MoveInput {
  args: {
    targetIds?: string[];
    pass?: boolean;
  };
}

const SELECTED_TARGET_BINDING = "__selectedEffectTarget";

export const resolveEffectTargetMove: MoveDefinition<ResolveEffectTargetInput> = {
  handlesPendingChoice: true,

  available({ state, playerId }) {
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget" || choice.payload.type !== "effectTarget") {
      return false;
    }
    // A selectable Gig immediately consumed by adjustGig is one atomic
    // target/value decision. It is resolved only through resolveAdjustGig.
    if (choice.payload.adjustGig) return false;
    return (choice.chooserId as string) === (playerId as string);
  },

  validate({ state, playerId, input }) {
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget" || choice.payload.type !== "effectTarget") {
      return { valid: false, error: "No effect target pending", errorCode: "NO_PENDING_CHOICE" };
    }
    if (choice.payload.adjustGig) {
      return {
        valid: false,
        error: "Gig target and value must be resolved atomically",
        errorCode: "ATOMIC_ADJUST_GIG_REQUIRED",
      };
    }
    if ((choice.chooserId as string) !== (playerId as string)) {
      return { valid: false, error: "Not your choice to resolve", errorCode: "NOT_YOUR_CHOICE" };
    }
    if (input.args.pass) {
      return choice.payload.canDecline ||
        (choice.payload.min ?? 1) === 0 ||
        choice.payload.targetPurpose === "playCard"
        ? { valid: true }
        : { valid: false, error: "Cannot pass this target choice", errorCode: "CANNOT_PASS" };
    }
    const eligible = new Set(choice.payload.eligibleIds ?? []);
    const min = choice.payload.min ?? 1;
    const max = choice.payload.max ?? 1;
    const targetIds = input.args.targetIds ?? [];
    if (targetIds.length < min || targetIds.length > max) {
      return {
        valid: false,
        error: `Must select between ${min} and ${max} target(s)`,
        errorCode: "INVALID_AMOUNT",
      };
    }
    if (new Set(targetIds).size !== targetIds.length) {
      return {
        valid: false,
        error: "Duplicate targets are not allowed",
        errorCode: "DUPLICATE_TARGETS",
      };
    }
    for (const id of targetIds) {
      if (!eligible.has(id)) {
        return { valid: false, error: "Target is not a valid choice", errorCode: "INVALID_CHOICE" };
      }
    }
    if (choice.payload.pairConstraint !== undefined) {
      const pair = validateGigCopyPair(
        state as MatchState,
        targetIds,
        choice.payload.pairConstraint,
      );
      if (!pair.valid) {
        return {
          valid: false,
          error: gigCopyPairError(pair.reason),
          errorCode: "INVALID_CHOICE",
        };
      }
    }
    if (choice.payload.targetPurpose === "playCard") {
      const remaining =
        choice.payload.availableEddiesAfterCosts ?? availableEddies(state as MatchState, playerId);
      for (const id of targetIds) {
        const cost =
          choice.payload.effectiveCostsByCardId?.[id] ??
          computeEffectiveCost(state as MatchState, id as CardInstanceId, playerId);
        if (cost > remaining) {
          return {
            valid: false,
            error: "Not enough eddies",
            errorCode: "INSUFFICIENT_EDDIES",
          };
        }
      }
    }
    return { valid: true };
  },

  execute({ state, playerId, input, operations }) {
    const choice = state.G.turnMetadata.pendingChoice as ChooseTargetPendingChoice;
    const payload = choice.payload;
    const effect = payload.effect;
    if (!payload.sourceCardId || !payload.sourcePlayerId) return;

    operations.game.setPendingChoice(undefined);

    const targetIds = input.args.targetIds ?? [];
    if (
      input.args.pass ||
      ((payload.canDecline || (payload.min ?? 1) === 0) && targetIds.length === 0)
    ) {
      const currentTrigger = state.G.turnMetadata.currentTrigger;
      const provisionalRoll = currentTrigger?.event;
      const sourceCard = currentTrigger
        ? state.G.cardIndex[currentTrigger.sourceCardId as string]
        : undefined;
      const isRollReplacement =
        sourceCard && currentTrigger?.kind === "authored"
          ? defOf(sourceCard).abilities?.[currentTrigger.abilityIndex]?.timing ===
            "gigRollReplacement"
          : false;
      if (isRollReplacement && provisionalRoll?.type === "gigDieRolled") {
        enqueueEventTriggers(provisionalRoll, state, operations, true);
      }
      if (payload.selectedBindingId) {
        const current = state.G.turnMetadata.currentTrigger;
        if (current) {
          current.boundTargets = {
            ...current.boundTargets,
            [payload.selectedBindingId]: [],
          };
        }
      }
      if (payload.elseEffects?.length) {
        const ctx: ResolutionContext = {
          state,
          sourceCardId: payload.sourceCardId,
          sourcePlayerId: payload.sourcePlayerId,
          abilityIndex: payload.abilityIndex ?? 0,
          contextTargets: payload.contextTargets ?? {},
          boundTargets: payload.boundTargets ?? {},
        };
        const status = executeAbilityEffects(payload.elseEffects, ctx, operations, 0, {
          nested: true,
        });
        if (status === "suspended") return;
      } else if (payload.targetPurpose === "playCard") {
        abandonCurrentTrigger(state, operations);
        resumeSuspendedEndTurn(state, operations);
        return;
      }
      resumeCurrentTrigger(state, operations);
      resumeSuspendedEndTurn(state, operations);
      return;
    }

    const actionLog = buildEffectTargetActionLogDetails(
      state as MatchState,
      payload.sourceCardId,
      targetIds,
      playerId,
    );
    const skipGenericTargetLog = isOrderedGigCopyTargetChoice(
      state as MatchState,
      payload,
      targetIds,
    );

    // Emit the targeting beam regardless of which resolution path runs — the
    // selectedBindingId path returns early, and a missing effectTargeted there
    // would silently skip the animation for every Program/Gear that targets
    // via a bound ability.
    const effectTargets = classifyEffectTargets(state, targetIds);
    if (effectTargets.length > 0) {
      operations.event.emit({
        type: "effectTargeted",
        sourceCardId: payload.sourceCardId,
        targets: effectTargets,
        playerId,
      });
    }

    if (payload.selectedBindingId) {
      const current = state.G.turnMetadata.currentTrigger;
      if (current) {
        current.boundTargets = {
          ...current.boundTargets,
          [payload.selectedBindingId]: [...targetIds],
        };
      }
      if (!skipGenericTargetLog) {
        operations.event.emit({
          type: "actionLog",
          messageKey: targetResolvedMessageKey(effect),
          params: actionLog.params,
          playerId,
          category: "trigger",
          cardIds: actionLog.cardIds,
        });
      }
      resumeCurrentTrigger(state, operations);
      resumeSuspendedEndTurn(state, operations);
      return;
    }

    if (!effect) return;

    const ctx: ResolutionContext = {
      state,
      sourceCardId: payload.sourceCardId,
      sourcePlayerId: payload.sourcePlayerId,
      abilityIndex: payload.abilityIndex ?? 0,
      contextTargets: payload.contextTargets ?? {},
      boundTargets: {
        ...payload.boundTargets,
        [SELECTED_TARGET_BINDING]: [...targetIds],
      },
    };

    const selectedEffect =
      payload.targetPurpose === "attachHost" && "attachTo" in effect
        ? ({
            ...effect,
            attachTo: { selector: "bound", id: SELECTED_TARGET_BINDING },
          } as Effect)
        : ({
            ...effect,
            target: { selector: "bound", id: SELECTED_TARGET_BINDING },
            // The choose-target prompt already collected the optional "may"
            // decision via its canDecline. Rebinding a moveCard must not let
            // handleMoveCard's optional branch raise a second chooseCardToMove
            // prompt for the card the player just picked (e.g. Meredith Stout
            // trash recovery).
            ...(effect.effect === "moveCard" ? { optional: false } : {}),
          } as Effect);

    const eventsBefore = operations.event.getEmittedEvents().length;
    const result = resolveEffect(selectedEffect, ctx, operations);
    // If the resolved effect declares an outputBinding, publish the selected
    // target IDs into the trigger's persistent boundTargets so a later effect
    // in the same ability can reference them (e.g. "play the Gear you just
    // recovered from trash").
    if ("outputBinding" in effect && effect.outputBinding) {
      const current = state.G.turnMetadata.currentTrigger;
      if (current) {
        current.boundTargets = {
          ...current.boundTargets,
          [effect.outputBinding]: [...targetIds],
        };
      }
    }
    const eventsAfter = operations.event.getEmittedEvents();
    if (
      result.status === "noAction" &&
      effect.effect !== "defeat" &&
      !eventsAfter.slice(eventsBefore).some((event) => event.type === "actionLog")
    ) {
      emitEffectNoActionLog(effect, ctx, operations);
    }
    for (let i = eventsBefore; i < eventsAfter.length; i++) {
      const emitted = eventsAfter[i]!;
      if (
        emitted.type === "gigValueChanged" ||
        emitted.type === "gigsSwapped" ||
        emitted.type === "gigDieRolled" ||
        emitted.type === "legendFlipped" ||
        emitted.type === "legendCalled" ||
        emitted.type === "gigStolen" ||
        emitted.type === "cardPlayed" ||
        emitted.type === "cardSpent" ||
        // CR 11.19.2 — effect defeats must queue {Defeated} triggers like
        // combat defeats do (resolve-attack enqueues its own cardDefeated).
        emitted.type === "cardDefeated"
      ) {
        enqueueEventTriggers(emitted, state, operations);
      }
    }
    if (result.status === "resolved" && payload.ifEffects?.length) {
      const status = executeAbilityEffects(payload.ifEffects, ctx, operations, 0, { nested: true });
      if (status === "suspended") return;
    } else if (result.status === "noAction" && payload.elseEffects?.length) {
      const status = executeAbilityEffects(payload.elseEffects, ctx, operations, 0, {
        nested: true,
      });
      if (status === "suspended") return;
    }

    if (!skipGenericTargetLog) {
      const targetLog = buildTargetResolvedActionLog(
        effect,
        actionLog,
        eventsAfter.slice(eventsBefore),
        targetIds,
      );
      operations.event.emit({
        type: "actionLog",
        messageKey: targetLog.messageKey,
        params: targetLog.params,
        playerId,
        category: "trigger",
        cardIds: actionLog.cardIds,
      });
    }
    if (
      effect.effect === "defeat" &&
      eventsAfter
        .slice(eventsBefore)
        .some(
          (event) => event.type === "cardDefeated" && targetIds.includes(event.cardId as string),
        )
    ) {
      operations.event.emit({
        type: "actionLog",
        messageKey: "trigger.defeatedTarget",
        params: actionLog.params,
        playerId,
        category: "trigger",
        cardIds: actionLog.cardIds,
      });
    } else if (effect.effect === "defeat" && result.status !== "suspended") {
      operations.event.emit({
        type: "actionLog",
        messageKey: "trigger.defeatFailed",
        params: actionLog.params,
        playerId,
        category: "trigger",
        cardIds: actionLog.cardIds,
      });
    }

    resumeCurrentTrigger(state, operations);
    resumeSuspendedEndTurn(state, operations);
  },
};

function gigCopyPairError(
  reason: import("../effects/gig-copy-selection.ts").GigCopyPairInvalidReason,
) {
  switch (reason) {
    case "same-player":
      return "Choose one Gig from each player. The source and target cannot belong to the same player.";
    case "duplicate":
      return "Choose two different Gigs: first the source, then the target.";
    case "wrong-count":
      return "Choose exactly two Gigs: first the source, then the target.";
    case "missing-gig":
      return "One of the selected Gigs is no longer available. Choose the source and target again.";
  }
}

function isOrderedGigCopyTargetChoice(
  state: MatchState,
  payload: ChooseTargetPendingChoice["payload"],
  targetIds: ReadonlyArray<string>,
): boolean {
  if (payload.type !== "effectTarget" || payload.targetKind !== "gig" || targetIds.length !== 2) {
    return false;
  }
  const sourceCardId = payload.sourceCardId as string | undefined;
  const sourceCard = sourceCardId ? state.G.cardIndex[sourceCardId] : undefined;
  const rulesText = sourceCard ? (defOf(sourceCard).rulesText ?? "").toLowerCase() : "";
  return rulesText.includes("value of another gig");
}
