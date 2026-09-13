import type { FabMatchState } from "../../state.ts";
import type {
  FabDecisionAnswer,
  FabDecisionContinuation,
  FabRulesProcessStage,
} from "../../rules/process.ts";
import type { FabEventJournalTransactionResult, FabEventTransactionOptions } from "./types.ts";
import {
  commitInitializedFabEventTransaction,
  commitPersistedReplacementCost,
  commitPersistedReclashMove,
  executeFabEventJournalTransaction,
  suspendForReplacementConsequenceTarget,
} from "../transaction/index.ts";
import {
  persistedReplacementCostTargetIds,
  persistedReplacementConsequenceTargetIds,
  replacementRequiresCommittedCostReceipt,
} from "../replacements/index.ts";
import { reconcileContinuousEffectsToQuiescence } from "../continuous-reconcile.ts";
import { advanceFabRulesProcessToBoundary } from "./boundary.ts";
import { advanceTriggerDeclarations } from "../trigger-declaration.ts";
import { resumeSequencePrefixAfterJournal } from "../../procedures/layer-resolution/index.ts";
import { transitionFabRulesProcessStage } from "../process-state.ts";

function resumeAbilityStepIfCommitted(
  result: FabEventJournalTransactionResult,
  continuation:
    | NonNullable<NonNullable<FabMatchState["rulesProcess"]>["abilityStepContinuation"]>
    | undefined,
  options: FabEventTransactionOptions,
  paymentContinuation?: NonNullable<
    NonNullable<FabMatchState["rulesProcess"]>["effectPaymentContinuation"]
  >,
): FabMatchState {
  if (!result.committed) return result.state;
  if (paymentContinuation) {
    if (!options.resumeEffectPayment)
      throw new Error("The resolution-effect payment has no runtime resumer.");
    return options.resumeEffectPayment(
      result.state,
      paymentContinuation,
      result.batches.flatMap((batch) => batch.events),
    );
  }
  if (!continuation) return result.state;
  if (!options.resumeAbilityStep)
    throw new Error("The ordered FAB ability continuation has no runtime resumer.");
  return options.resumeAbilityStep(
    result.state,
    continuation,
    result.batches.flatMap((batch) => batch.events),
  );
}

export function resumeFabReplacementFirstPlayer(
  state: FabMatchState,
  continuation: Extract<FabDecisionContinuation, { readonly kind: "replacement-first-player" }>,
  answer: Extract<FabDecisionAnswer, { readonly kind: "option" }>,
  options: FabEventTransactionOptions,
): FabMatchState {
  const process = state.rulesProcess;
  const controllerIds = [
    ...new Set(process?.replacementCandidates.map((candidate) => candidate.controllerId) ?? []),
  ];
  if (
    !process ||
    process.processId !== continuation.processId ||
    process.stage !== "replacement-ordering" ||
    answer.optionIds.length !== 1 ||
    !controllerIds.includes(answer.optionIds[0]!)
  ) {
    throw new Error("The persisted FAB replacement starting-player choice is invalid.");
  }
  const firstPlayerId = answer.optionIds[0]!;
  if (continuation.eventGroupId) {
    (process.journalReplacementFirstPlayerIds ??= {})[continuation.eventGroupId] = firstPlayerId;
    transitionFabRulesProcessStage(process, "procedure");
    const groups =
      process.resolutionEventGroups.length > 0
        ? process.resolutionEventGroups
        : process.procedure?.eventGroups;
    if (!groups?.some((group) => group.eventGroupId === continuation.eventGroupId)) {
      throw new Error(
        `The persisted FAB journal group ${continuation.eventGroupId} no longer exists.`,
      );
    }
    const abilityContinuation = process.abilityStepContinuation;
    const paymentContinuation = process.effectPaymentContinuation;
    const result = executeFabEventJournalTransaction(
      state,
      groups,
      abilityContinuation ? { ...options, deferTriggerDeclaration: true } : options,
    );
    if (continuation.sequencePrefix) {
      if (!result.committed) return result.state;
      return resumeSequencePrefixAfterJournal(
        result.state,
        continuation.sequencePrefix,
        options,
        result.batches.flatMap((batch) => batch.events),
      );
    }
    return resumeAbilityStepIfCommitted(result, abilityContinuation, options, paymentContinuation);
  }
  process.replacementFirstPlayerId = firstPlayerId;
  transitionFabRulesProcessStage(process, "event-commit");
  return commitInitializedFabEventTransaction(state, options, false).state;
}

export function resumeFabReplacementPlayerChoice(
  state: FabMatchState,
  continuation: Extract<FabDecisionContinuation, { readonly kind: "replacement-player" }>,
  answer: Extract<FabDecisionAnswer, { readonly kind: "option" }>,
  options: FabEventTransactionOptions,
): FabMatchState {
  const process = state.rulesProcess;
  if (
    !process ||
    process.processId !== continuation.processId ||
    process.stage !== "replacement-ordering"
  ) {
    throw new Error("The persisted FAB optional replacement process no longer exists.");
  }
  const optionalIds = process.replacementCandidates
    .filter((candidate) => candidate.optional && candidate.controllerId === continuation.playerId)
    .map((candidate) => candidate.replacementId);
  if (
    new Set(answer.optionIds).size !== answer.optionIds.length ||
    !answer.optionIds.every((id) => optionalIds.includes(id))
  ) {
    throw new Error("The FAB optional replacement selection contains an inapplicable candidate.");
  }
  if (continuation.eventGroupId) {
    process.journalReplacementChoices[continuation.eventGroupId] = [
      ...(process.journalReplacementChoices[continuation.eventGroupId] ?? []),
      ...answer.optionIds,
    ];
    process.journalReplacementChoicePlayerIds[continuation.eventGroupId] = [
      ...(process.journalReplacementChoicePlayerIds[continuation.eventGroupId] ?? []),
      continuation.playerId,
    ];
    const declined = optionalIds.filter((id) => !answer.optionIds.includes(id));
    (process.journalDeclinedReplacementChoices ??= {})[continuation.eventGroupId] = [
      ...(process.journalDeclinedReplacementChoices[continuation.eventGroupId] ?? []),
      ...declined,
    ];
  } else {
    process.selectedOptionalReplacementIds.push(...answer.optionIds);
    process.replacementChoicePlayerIds.push(continuation.playerId);
    (process.declinedOptionalReplacementIds ??= []).push(
      ...optionalIds.filter((id) => !answer.optionIds.includes(id)),
    );
  }
  const selected = process.replacementCandidates.filter((candidate) =>
    answer.optionIds.includes(candidate.replacementId),
  );
  const needingTarget = selected.find(
    (candidate) =>
      candidate.persistedApplicationPolicy?.kind === "may-apply" &&
      candidate.persistedApplicationPolicy.cost !== undefined &&
      candidate.persistedApplicationPolicy.cost?.kind !== "banish-source",
  );
  if (needingTarget) return suspendReplacementCostTarget(state, continuation, needingTarget);
  transitionFabRulesProcessStage(process, continuation.eventGroupId ? "procedure" : "event-commit");
  if (!continuation.eventGroupId)
    return commitInitializedFabEventTransaction(state, options, false).state;
  const groups =
    process.resolutionEventGroups.length > 0
      ? process.resolutionEventGroups
      : process.procedure?.eventGroups;
  if (!groups?.some((group) => group.eventGroupId === continuation.eventGroupId)) {
    throw new Error(
      `The persisted FAB journal group ${continuation.eventGroupId} no longer exists.`,
    );
  }
  const abilityContinuation = process.abilityStepContinuation;
  const paymentContinuation = process.effectPaymentContinuation;
  const result = executeFabEventJournalTransaction(
    state,
    groups,
    abilityContinuation ? { ...options, deferTriggerDeclaration: true } : options,
  );
  if (continuation.sequencePrefix) {
    if (!result.committed) return result.state;
    return resumeSequencePrefixAfterJournal(
      result.state,
      continuation.sequencePrefix,
      options,
      result.batches.flatMap((batch) => batch.events),
    );
  }
  if (
    result.committed ||
    "suspendedForReplacementOrder" in result ||
    "suspendedForContinuousOrder" in result
  ) {
    return resumeAbilityStepIfCommitted(result, abilityContinuation, options, paymentContinuation);
  }
  throw new Error(`The FAB procedure journal failed at ${result.failedEventGroupId}.`);
}

export function resumeFabReplacementCostTarget(
  state: FabMatchState,
  continuation: Extract<FabDecisionContinuation, { readonly kind: "replacement-cost-target" }>,
  answer: Extract<FabDecisionAnswer, { readonly kind: "entity-target" }>,
  options: FabEventTransactionOptions,
): FabMatchState {
  const committedCost = commitFabReplacementCostTarget(state, continuation, answer, options);
  if (committedCost.deferred) return committedCost.state;
  return resumeFabReplacementCostConsequence(committedCost.state, continuation, options);
}

/** Persist the exact cost result, but deliberately stop before "if you do". */
export function commitFabReplacementCostTarget(
  state: FabMatchState,
  continuation: Extract<FabDecisionContinuation, { readonly kind: "replacement-cost-target" }>,
  answer: Extract<FabDecisionAnswer, { readonly kind: "entity-target" }>,
  options: FabEventTransactionOptions,
): { readonly state: FabMatchState; readonly deferred: boolean } {
  const process = state.rulesProcess;
  const candidate = process?.replacementCandidates.find(
    (item) => item.replacementId === continuation.replacementId,
  );
  if (
    !process ||
    !candidate ||
    process.processId !== continuation.processId ||
    answer.instanceIds.length !== 1 ||
    !persistedReplacementCostTargetIds(state, candidate).includes(answer.instanceIds[0]!)
  )
    throw new Error("The persisted replacement cost target is no longer legal.");
  const instanceId = answer.instanceIds[0]!;
  const object = state.objects[instanceId];
  if (!object) throw new Error("The persisted replacement cost target no longer exists.");
  const scope = continuation.eventGroupId ? `journal:${continuation.eventGroupId}` : "direct";
  (process.replacementCostTargetBindings ??= {})[`${scope}:${candidate.replacementId}`] = {
    instanceId,
    incarnation: object.incarnation,
  };
  process.replacementCostBindingScope = scope;
  const selectedIds = continuation.eventGroupId
    ? (process.journalReplacementChoices[continuation.eventGroupId] ?? [])
    : process.selectedOptionalReplacementIds;
  const next = process.replacementCandidates.find(
    (item) =>
      selectedIds.includes(item.replacementId) &&
      item.persistedApplicationPolicy?.kind === "may-apply" &&
      item.persistedApplicationPolicy.cost !== undefined &&
      item.persistedApplicationPolicy.cost?.kind !== "banish-source" &&
      !process.replacementCostTargetBindings?.[`${scope}:${item.replacementId}`],
  );
  if (next)
    return { state: suspendReplacementCostTarget(state, continuation, next), deferred: true };
  const boundCandidate = {
    ...candidate,
    persistedCostTarget: { instanceId, incarnation: object.incarnation },
  };
  if (
    boundCandidate.persistedApplicationPolicy?.kind === "may-apply" &&
    boundCandidate.persistedApplicationPolicy.consequence?.kind === "reclash-original-reveal"
  ) {
    return {
      state: (() => {
        suspendForReplacementConsequenceTarget(
          state,
          process.replacementCandidates,
          boundCandidate,
          {
            kind: "replacement-consequence-target",
            processId: continuation.processId,
            playerId: continuation.playerId,
            replacementId: boundCandidate.replacementId,
            ...(continuation.eventGroupId ? { eventGroupId: continuation.eventGroupId } : {}),
            ...(continuation.sequencePrefix ? { sequencePrefix: continuation.sequencePrefix } : {}),
          },
        );
        return state;
      })(),
      deferred: true,
    };
  }
  if (replacementRequiresCommittedCostReceipt(boundCandidate)) {
    return {
      state: commitPersistedReplacementCost(state, boundCandidate, options),
      deferred: false,
    };
  }
  transitionFabRulesProcessStage(process, continuation.eventGroupId ? "procedure" : "event-commit");
  return { state, deferred: false };
}

export function resumeFabReplacementConsequenceTarget(
  state: FabMatchState,
  continuation: Extract<
    FabDecisionContinuation,
    { readonly kind: "replacement-consequence-target" }
  >,
  answer: Extract<FabDecisionAnswer, { readonly kind: "entity-target" }>,
  options: FabEventTransactionOptions,
): FabMatchState {
  const committed = commitFabReplacementConsequenceTarget(state, continuation, answer, options);
  return resumeFabReplacementCostConsequence(
    committed,
    {
      kind: "replacement-cost-target",
      processId: continuation.processId,
      playerId: continuation.playerId,
      replacementId: continuation.replacementId,
      ...(continuation.eventGroupId ? { eventGroupId: continuation.eventGroupId } : {}),
      ...(continuation.sequencePrefix ? { sequencePrefix: continuation.sequencePrefix } : {}),
    },
    options,
  );
}

/** Persist the paid cost and selected reveal move; safe to snapshot before fresh re-clash. */
export function commitFabReplacementConsequenceTarget(
  state: FabMatchState,
  continuation: Extract<
    FabDecisionContinuation,
    { readonly kind: "replacement-consequence-target" }
  >,
  answer: Extract<FabDecisionAnswer, { readonly kind: "entity-target" }>,
  options: FabEventTransactionOptions,
): FabMatchState {
  const process = state.rulesProcess;
  const scope = continuation.eventGroupId ? `journal:${continuation.eventGroupId}` : "direct";
  const candidate = process?.replacementCandidates.find(
    (item) => item.replacementId === continuation.replacementId,
  );
  if (!process || !candidate || process.processId !== continuation.processId)
    throw new Error("The persisted replacement consequence no longer exists.");
  const costTarget =
    process.replacementCostTargetBindings?.[`${scope}:${continuation.replacementId}`];
  const choosesClashWinner =
    candidate.effect.type === "replacement" && candidate.effect.modification.type === "win-clash";
  if (!choosesClashWinner && !costTarget)
    throw new Error("The persisted re-clash consequence has no committed cost target.");
  const boundCandidate = costTarget ? { ...candidate, persistedCostTarget: costTarget } : candidate;
  if (
    answer.instanceIds.length !== 1 ||
    !persistedReplacementConsequenceTargetIds(state, boundCandidate).includes(
      answer.instanceIds[0]!,
    )
  )
    throw new Error("The persisted replacement consequence target is no longer legal.");
  const instanceId = answer.instanceIds[0]!;
  const object = state.objects[instanceId];
  if (!object) throw new Error("The persisted replacement consequence target no longer exists.");
  const revealedTarget = { instanceId, incarnation: object.incarnation };
  (process.replacementConsequenceTargetBindings ??= {})[`${scope}:${continuation.replacementId}`] =
    revealedTarget;
  process.replacementCostBindingScope = scope;
  if (choosesClashWinner) return state;
  const paid = commitPersistedReplacementCost(
    state,
    { ...boundCandidate, persistedConsequenceTarget: revealedTarget },
    options,
  );
  return commitPersistedReclashMove(
    paid,
    { ...boundCandidate, persistedConsequenceTarget: revealedTarget },
    options,
  );
}

/** Resume the original event only after the persisted cost receipt exists. */
export function resumeFabReplacementCostConsequence(
  state: FabMatchState,
  continuation: Extract<FabDecisionContinuation, { readonly kind: "replacement-cost-target" }>,
  options: FabEventTransactionOptions,
): FabMatchState {
  const process = state.rulesProcess;
  if (!process || process.processId !== continuation.processId) {
    throw new Error("The persisted replacement cost consequence no longer exists.");
  }
  transitionFabRulesProcessStage(process, continuation.eventGroupId ? "procedure" : "event-commit");
  if (!continuation.eventGroupId) {
    return commitInitializedFabEventTransaction(state, options, false).state;
  }
  const groups =
    process.resolutionEventGroups.length > 0
      ? process.resolutionEventGroups
      : process.procedure?.eventGroups;
  if (!groups) throw new Error("The persisted replacement cost journal no longer exists.");
  const abilityContinuation = process.abilityStepContinuation;
  const paymentContinuation = process.effectPaymentContinuation;
  const result = executeFabEventJournalTransaction(
    state,
    groups,
    abilityContinuation ? { ...options, deferTriggerDeclaration: true } : options,
  );
  if (continuation.sequencePrefix && result.committed)
    return resumeSequencePrefixAfterJournal(
      result.state,
      continuation.sequencePrefix,
      options,
      result.batches.flatMap((batch) => batch.events),
    );
  return resumeAbilityStepIfCommitted(result, abilityContinuation, options, paymentContinuation);
}

function suspendReplacementCostTarget(
  state: FabMatchState,
  continuation: Extract<
    FabDecisionContinuation,
    { readonly kind: "replacement-player" | "replacement-cost-target" }
  >,
  candidate: NonNullable<FabMatchState["rulesProcess"]>["replacementCandidates"][number],
): FabMatchState {
  const targetIds = persistedReplacementCostTargetIds(state, candidate);
  if (targetIds.length === 0)
    throw new Error("The selected optional replacement cost has no legal target.");
  state.counters.decision += 1;
  state.decision = {
    decisionId: `decision-${state.counters.decision}`,
    stateVersion: state.stateID,
    actorId: continuation.playerId,
    kind: "entity-target",
    label: "Choose a card or permanent for the replacement prevention cost.",
    min: 1,
    max: 1,
    candidates: targetIds.map((instanceId) => ({
      instanceId,
      label: instanceId,
      target: {
        kind: "object" as const,
        ref: { instanceId, incarnation: state.objects[instanceId]!.incarnation },
      },
    })),
    continuation: {
      kind: "replacement-cost-target",
      processId: continuation.processId,
      playerId: continuation.playerId,
      replacementId: candidate.replacementId,
      ...(continuation.eventGroupId ? { eventGroupId: continuation.eventGroupId } : {}),
      ...(continuation.sequencePrefix ? { sequencePrefix: continuation.sequencePrefix } : {}),
    },
  };
  return state;
}

export function resumeFabReplacementOrdering(
  state: FabMatchState,
  continuation: Extract<FabDecisionContinuation, { readonly kind: "replacement-order" }>,
  answer: Extract<FabDecisionAnswer, { readonly kind: "ordering" }>,
  options: FabEventTransactionOptions,
): FabMatchState {
  const process = state.rulesProcess;
  if (
    !process ||
    process.processId !== continuation.processId ||
    process.stage !== "replacement-ordering"
  ) {
    throw new Error("The persisted FAB replacement-ordering process no longer exists.");
  }
  const expected = process.replacementCandidates
    .filter(
      (candidate) =>
        candidate.controllerId === continuation.controllerId &&
        candidate.replacementKind === continuation.replacementKind,
    )
    .map((candidate) => candidate.replacementId);
  if (
    answer.orderedIds.length !== expected.length ||
    new Set(answer.orderedIds).size !== answer.orderedIds.length ||
    !answer.orderedIds.every((id) => expected.includes(id))
  )
    throw new Error("The FAB replacement ordering does not contain every candidate exactly once.");
  process.orderedReplacementIds.push(...answer.orderedIds);
  transitionFabRulesProcessStage(process, "event-commit");
  return commitInitializedFabEventTransaction(state, options, false).state;
}

/** Reruns an untouched procedure journal after persisting one child group's replacement order. */
export function resumeFabJournalReplacementOrdering(
  state: FabMatchState,
  continuation: Extract<FabDecisionContinuation, { readonly kind: "journal-replacement-order" }>,
  answer: Extract<FabDecisionAnswer, { readonly kind: "ordering" }>,
  options: FabEventTransactionOptions,
): FabMatchState {
  const process = state.rulesProcess;
  if (
    !process ||
    process.processId !== continuation.processId ||
    process.stage !== "replacement-ordering"
  ) {
    throw new Error("The persisted FAB journal replacement-ordering process no longer exists.");
  }
  const expected = process.replacementCandidates
    .filter(
      (candidate) =>
        candidate.controllerId === continuation.controllerId &&
        candidate.replacementKind === continuation.replacementKind,
    )
    .map((candidate) => candidate.replacementId);
  if (
    answer.orderedIds.length !== expected.length ||
    new Set(answer.orderedIds).size !== answer.orderedIds.length ||
    !answer.orderedIds.every((id) => expected.includes(id))
  )
    throw new Error(
      "The FAB journal replacement ordering does not contain every candidate exactly once.",
    );
  const groups =
    process.resolutionEventGroups.length > 0
      ? process.resolutionEventGroups
      : process.procedure?.eventGroups;
  if (!groups?.some((group) => group.eventGroupId === continuation.eventGroupId)) {
    throw new Error(
      `The persisted FAB journal group ${continuation.eventGroupId} no longer exists.`,
    );
  }
  process.journalReplacementOrders[continuation.eventGroupId] = [
    ...(process.journalReplacementOrders[continuation.eventGroupId] ?? []),
    ...answer.orderedIds,
  ];
  process.replacementCandidates = [];
  transitionFabRulesProcessStage(process, "procedure");
  const abilityContinuation = process.abilityStepContinuation;
  const paymentContinuation = process.effectPaymentContinuation;
  const result = executeFabEventJournalTransaction(
    state,
    groups,
    abilityContinuation ? { ...options, deferTriggerDeclaration: true } : options,
  );
  if (continuation.sequencePrefix) {
    if (!result.committed) return result.state;
    return resumeSequencePrefixAfterJournal(
      result.state,
      continuation.sequencePrefix,
      options,
      result.batches.flatMap((batch) => batch.events),
    );
  }
  if (
    result.committed ||
    "suspendedForReplacementOrder" in result ||
    "suspendedForContinuousOrder" in result
  )
    return resumeAbilityStepIfCommitted(result, abilityContinuation, options, paymentContinuation);
  throw new Error(`The FAB procedure journal failed at ${result.failedEventGroupId}.`);
}

export function resumeFabContinuousReplacementOrdering(
  state: FabMatchState,
  continuation: Extract<FabDecisionContinuation, { readonly kind: "continuous-replacement-order" }>,
  answer: Extract<FabDecisionAnswer, { readonly kind: "ordering" }>,
  options: FabEventTransactionOptions,
): FabMatchState {
  const process = state.rulesProcess;
  if (
    !process ||
    process.processId !== continuation.processId ||
    process.stage !== "replacement-ordering"
  ) {
    throw new Error("The persisted FAB continuous replacement-ordering process no longer exists.");
  }
  const expected = process.replacementCandidates.map((candidate) => candidate.replacementId);
  if (
    answer.orderedIds.length !== expected.length ||
    new Set(answer.orderedIds).size !== answer.orderedIds.length ||
    !answer.orderedIds.every((id) => expected.includes(id))
  ) {
    throw new Error(
      "The FAB continuous replacement ordering does not contain every candidate exactly once.",
    );
  }
  process.orderedReplacementIds = [...answer.orderedIds];
  transitionFabRulesProcessStage(process, "trigger-collection");
  const reconciliation = reconcileContinuousEffectsToQuiescence(state, process.processId, options);
  if (reconciliation.suspended) return state;
  if (continuation.journalCursor !== null) {
    const groups =
      process.resolutionEventGroups.length > 0
        ? process.resolutionEventGroups
        : (process.procedure?.eventGroups ?? []);
    const abilityContinuation = process.abilityStepContinuation;
    const paymentContinuation = process.effectPaymentContinuation;
    const journal = executeFabEventJournalTransaction(
      state,
      groups.slice(continuation.journalCursor),
      abilityContinuation ? { ...options, deferTriggerDeclaration: true } : options,
    );
    if (
      journal.committed ||
      "suspendedForContinuousOrder" in journal ||
      "suspendedForReplacementOrder" in journal
    )
      return resumeAbilityStepIfCommitted(
        journal,
        abilityContinuation,
        options,
        paymentContinuation,
      );
    throw new Error(
      `The FAB journal failed after continuous replacement ordering at ${journal.failedEventGroupId}.`,
    );
  }
  const nextStage: FabRulesProcessStage =
    process.pendingTriggers.length > 0 ? "layer-declaration" : "state-trigger-scan";
  transitionFabRulesProcessStage(process, nextStage);
  if (nextStage === "layer-declaration") advanceTriggerDeclarations(state, options);
  advanceFabRulesProcessToBoundary(state, options);
  return state;
}

export function resumeFabContinuousOrdering(
  state: FabMatchState,
  continuation: Extract<FabDecisionContinuation, { readonly kind: "continuous-order" }>,
  answer: Extract<FabDecisionAnswer, { readonly kind: "ordering" }>,
  options: FabEventTransactionOptions,
): FabMatchState {
  const process = state.rulesProcess;
  if (
    !process ||
    process.processId !== continuation.processId ||
    process.stage !== "continuous-ordering"
  ) {
    throw new Error("The persisted FAB continuous-ordering process no longer exists.");
  }
  if (
    answer.orderedIds.length !== continuation.atomIds.length ||
    new Set(answer.orderedIds).size !== answer.orderedIds.length ||
    !answer.orderedIds.every((id) => continuation.atomIds.includes(id))
  ) {
    throw new Error("The FAB continuous ordering does not contain every atom exactly once.");
  }
  state.continuousOrderingDecisions.push({
    orderingId: continuation.orderingId,
    timestamp: continuation.timestamp,
    subject: continuation.subject,
    stage: continuation.stage,
    substage: continuation.substage,
    orderedAtomIds: [...answer.orderedIds],
    decidedByPlayerId: continuation.playerId,
  });
  transitionFabRulesProcessStage(process, "trigger-collection");
  const reconciliation = reconcileContinuousEffectsToQuiescence(state, process.processId, options);
  if (reconciliation.suspended) return state;
  if (continuation.journalCursor !== null) {
    const groups =
      process.resolutionEventGroups.length > 0
        ? process.resolutionEventGroups
        : (process.procedure?.eventGroups ?? []);
    const abilityContinuation = process.abilityStepContinuation;
    const paymentContinuation = process.effectPaymentContinuation;
    const journal = executeFabEventJournalTransaction(
      state,
      groups.slice(continuation.journalCursor),
      abilityContinuation ? { ...options, deferTriggerDeclaration: true } : options,
    );
    if (
      journal.committed ||
      "suspendedForContinuousOrder" in journal ||
      "suspendedForReplacementOrder" in journal
    ) {
      return resumeAbilityStepIfCommitted(
        journal,
        abilityContinuation,
        options,
        paymentContinuation,
      );
    }
    throw new Error(
      `The FAB journal failed after continuous ordering at ${journal.failedEventGroupId}.`,
    );
  }
  const nextStage: FabRulesProcessStage =
    process.pendingTriggers.length > 0 ? "layer-declaration" : "state-trigger-scan";
  transitionFabRulesProcessStage(process, nextStage);
  if (nextStage === "layer-declaration") advanceTriggerDeclarations(state, options);
  advanceFabRulesProcessToBoundary(state, options);
  return state;
}
