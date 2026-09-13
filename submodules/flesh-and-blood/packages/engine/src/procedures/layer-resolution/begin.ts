import type { FabMatchState } from "../../state.ts";
import type {
  FabDecisionAnswer,
  FabDecisionContinuation,
  FabRulesProcess,
} from "../../rules/process.ts";
import type { FabEventTransactionOptions } from "../../kernel/process-runner/index.ts";
import type { FabLayerResolutionResult } from "../../rules/decision-dispatch/result.ts";
import { chooseOptionBindingKey } from "../../rules/proposals/effects/choose-option.ts";
import { chooseNumberBindingKey } from "../../rules/proposals/effects/choose-number.ts";
import { advanceFabLayerResolution } from "./advance.ts";
import { firstUnansweredDecision } from "./find-decision.ts";
import { failure, startLayerResolutionProcess } from "./process.ts";
import {
  cancelFabResolutionEffectPayment as cancelResolutionPaymentWithAdvance,
  resumeAbilityStepAfterJournal as resumeAbilityStepWithAdvance,
  resumeEffectPaymentAfterJournal as resumeEffectPaymentWithAdvance,
  resumeFabResolutionEffectPayment as resumeResolutionPaymentWithAdvance,
} from "./journal.ts";
import { resumeSequencePrefixAfterJournal as resumeSequencePrefixWithAdvance } from "./sequence.ts";
import { withFabLayerBinding, withFabLayerTarget } from "../../rules/layers.ts";
import type { FabTargetRef } from "../../rules/targets.ts";

/** Begins or continues a persisted layer resolution until an event commit or decision. */
export function beginFabLayerResolution(
  current: FabMatchState,
  layerId: string,
  options: FabEventTransactionOptions,
): FabLayerResolutionResult {
  if (!current.rulesStack.some((candidate) => candidate.layerId === layerId)) {
    return failure(current, "The FAB rules layer no longer exists.", "stale_rules_layer");
  }
  const state = startLayerResolutionProcess(current, layerId);
  const layer = state.rulesStack.find((candidate) => candidate.layerId === layerId)!;
  return advanceFabLayerResolution(state, layer, options);
}

export function resumeFabOptionalEffect(
  state: FabMatchState,
  continuation: Extract<FabDecisionContinuation, { readonly kind: "optional-effect" }>,
  answer: Extract<FabDecisionAnswer, { readonly kind: "boolean" }>,
  options: FabEventTransactionOptions,
): FabMatchState {
  const process = state.rulesProcess;
  if (!process || process.processId !== continuation.processId || !process.resolvingLayerId) {
    throw new Error("The persisted FAB layer resolution no longer exists.");
  }
  process.effectChoices[continuation.effectPath.join(".")] = answer.value;
  const layer = state.rulesStack.find(
    (candidate) => candidate.layerId === process.resolvingLayerId,
  );
  if (!layer) throw new Error("The resolving FAB layer no longer exists.");
  const result = advanceFabLayerResolution(state, layer, options);
  if (!result.accepted) throw new Error(result.error);
  return result.state;
}

export function resumeFabResolutionEffectPaymentAmount(
  state: FabMatchState,
  continuation: Extract<FabDecisionContinuation, { readonly kind: "effect-payment-amount" }>,
  answer: Extract<FabDecisionAnswer, { readonly kind: "numeric" }>,
  options: FabEventTransactionOptions,
): FabMatchState {
  const process = state.rulesProcess;
  if (
    !process ||
    process.processId !== continuation.processId ||
    process.resolvingLayerId !== continuation.layerId
  ) {
    throw new Error("The persisted FAB resolution-effect payment declaration no longer exists.");
  }
  process.effectPaymentAmounts = {
    ...process.effectPaymentAmounts,
    [continuation.effectPath.join(".")]: answer.value,
  };
  const layer = state.rulesStack.find((candidate) => candidate.layerId === continuation.layerId);
  if (!layer) throw new Error("The resolving FAB layer no longer exists.");
  const result = advanceFabLayerResolution(state, layer, options);
  if (!result.accepted) throw new Error(result.error);
  return result.state;
}

export function resumeFabEffectResolution(
  state: FabMatchState,
  continuation: Extract<FabDecisionContinuation, { readonly kind: "effect-resolution" }>,
  answer: FabDecisionAnswer | readonly FabTargetRef[],
  options: FabEventTransactionOptions,
): FabMatchState {
  const process = state.rulesProcess;
  if (
    !process ||
    process.processId !== continuation.processId ||
    process.resolvingLayerId !== continuation.layerId
  )
    throw new Error("The persisted FAB effect-resolution decision no longer exists.");
  let layer = state.rulesStack.find((candidate) => candidate.layerId === continuation.layerId);
  if (!layer) throw new Error("The resolving FAB layer no longer exists.");
  if (!("kind" in answer)) {
    const pending = firstUnansweredDecision(
      state,
      layer,
      process.effectChoices,
      process.effectPartitions,
      process.effectOptions,
      process.effectTargets,
    );
    if (
      pending?.decision.kind === "target" &&
      pending.decision.target.selector === "any-hero" &&
      pending.decision.playerTargetPath
    ) {
      const playerTargetKey = pending.decision.playerTargetBinding
        ? `${pending.decision.playerTargetPath}:player@${pending.decision.playerTargetBinding}`
        : `${pending.decision.playerTargetPath}:player`;
      layer = withFabLayerTarget(layer, playerTargetKey, answer);
      if (pending.decision.playerTargetBinding) {
        const chosenTarget = answer[0];
        if (!chosenTarget || chosenTarget.kind !== "player")
          throw new Error("The declared FAB hero target did not contain a player id.");
        layer = withFabLayerBinding(
          layer,
          pending.decision.playerTargetBinding,
          chosenTarget.playerId,
        );
      }
      const updatedLayer = layer;
      state.rulesStack = state.rulesStack.map((candidate) =>
        candidate.layerId === updatedLayer.layerId ? updatedLayer : candidate,
      );
    } else {
      process.effectTargets[continuation.effectPath.join(".")] = answer;
    }
  } else if (answer.kind === "partition") {
    process.effectPartitions[continuation.effectPath.join(".")] = answer.groups;
  } else if (answer.kind === "group-choice") {
    process.effectPartitions[continuation.effectPath.join(".")] = {
      selected: answer.selectedIds,
      remainder: answer.orderedRemainderIds,
    };
  } else if (answer.kind === "option") {
    process.effectPartitions[continuation.effectPath.join(".")] = {
      selected: answer.optionIds,
    };
  } else if (answer.kind === "effect-resolution") {
    const pending = firstUnansweredDecision(
      state,
      layer,
      process.effectChoices,
      process.effectPartitions,
      process.effectOptions,
      process.effectTargets,
    );
    const key =
      pending?.decision.kind === "choose-option"
        ? chooseOptionBindingKey(continuation.effectPath, pending.decision.actorId)
        : pending?.decision.kind === "choose-number"
          ? chooseNumberBindingKey(continuation.effectPath, pending.decision.actorId)
          : continuation.effectPath.join(".");
    let resolvedOption = answer.optionId;
    if (pending?.decision.kind === "name-card") {
      const selected = pending.decision.options.find((option) => option.id === answer.optionId);
      if (!selected) {
        throw new Error("The selected FAB card-name identity is no longer legal.");
      }
      resolvedOption = selected.name;
    }
    process.effectOptions[key] = resolvedOption;
  } else {
    throw new Error("The FAB effect-resolution answer has the wrong shape.");
  }
  const result = advanceFabLayerResolution(state, layer, options);
  if (!result.accepted) throw new Error(result.error);
  return result.state;
}

export function resumeFabResolutionEffectPayment(
  state: FabMatchState,
  continuation: Extract<FabDecisionContinuation, { readonly kind: "payment" }>,
  answer: Extract<FabDecisionAnswer, { readonly kind: "payment" }>,
  options: FabEventTransactionOptions,
): FabMatchState {
  return resumeResolutionPaymentWithAdvance(
    state,
    continuation,
    answer,
    options,
    advanceFabLayerResolution,
  );
}

export function cancelFabResolutionEffectPayment(
  state: FabMatchState,
  continuation: Extract<FabDecisionContinuation, { readonly kind: "payment" }>,
  options: FabEventTransactionOptions,
): FabMatchState {
  return cancelResolutionPaymentWithAdvance(
    state,
    continuation,
    options,
    advanceFabLayerResolution,
  );
}

export function resumeEffectPaymentAfterJournal(
  state: FabMatchState,
  continuation: NonNullable<FabRulesProcess["effectPaymentContinuation"]>,
  options: FabEventTransactionOptions,
  committedEvents: readonly import("../../rules/events.ts").CommittedEvent[],
): FabMatchState {
  return resumeEffectPaymentWithAdvance(
    state,
    continuation,
    options,
    committedEvents,
    advanceFabLayerResolution,
  );
}

export function resumeAbilityStepAfterJournal(
  state: FabMatchState,
  continuation: NonNullable<FabRulesProcess["abilityStepContinuation"]>,
  options: FabEventTransactionOptions,
  committedEvents: readonly import("../../rules/events.ts").CommittedEvent[] = [],
): FabMatchState {
  return resumeAbilityStepWithAdvance(
    state,
    continuation,
    options,
    committedEvents,
    advanceFabLayerResolution,
  );
}

export function resumeSequencePrefixAfterJournal(
  nextState: FabMatchState,
  continuation: NonNullable<FabRulesProcess["sequencePrefixContinuation"]>,
  options: FabEventTransactionOptions,
  committedPrefixEvents: readonly import("../../rules/events.ts").CommittedEvent[],
): FabMatchState {
  return resumeSequencePrefixWithAdvance(
    nextState,
    continuation,
    options,
    committedPrefixEvents,
    advanceFabLayerResolution,
  );
}
