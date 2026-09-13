import type { FabMatchState } from "../../state.ts";
import { activeFabCardResolutionStep, type FabRulesStackLayer } from "../../rules/layers.ts";
import type {
  FabDecisionAnswer,
  FabDecisionContinuation,
  FabRulesProcess,
} from "../../rules/process.ts";
import { executeFabEventJournalTransaction } from "../../kernel/transaction/index.ts";
import { type FabEventTransactionOptions } from "../../kernel/process-runner/index.ts";
import type { FabUnansweredLayerDecision } from "../../rules/decision-dispatch/decision-types.ts";
import type { FabLayerResolutionResult } from "../../rules/decision-dispatch/result.ts";
import { startFabRulesProcess } from "../../kernel/process-state.ts";
import { layerWithEventBindings } from "../../rules/proposals/shared.ts";
import { reanchorFabBindingsThroughCommittedMoves } from "../../rules/binding-reanchor.ts";
import { proposeEffectDispatch } from "../../rules/proposals/dispatch.ts";
import { failure, resolutionProcess, type AdvanceLayerResolution } from "./process.ts";
import { transitionFabRulesProcessStage } from "../../kernel/process-state.ts";

export function resumeFabResolutionEffectPayment(
  state: FabMatchState,
  continuation: Extract<FabDecisionContinuation, { readonly kind: "payment" }>,
  answer: Extract<FabDecisionAnswer, { readonly kind: "payment" }>,
  options: FabEventTransactionOptions,
  advance: AdvanceLayerResolution,
): FabMatchState {
  const process = state.rulesProcess;
  if (
    !process ||
    process.processId !== continuation.processId ||
    continuation.procedure !== "effect" ||
    process.resolvingLayerId !== continuation.layerId ||
    !continuation.effectPath ||
    answer.instanceIds.length !== 1
  )
    throw new Error("The persisted FAB resolution-effect payment no longer exists.");
  const instanceId = answer.instanceIds[0]!;
  const key = continuation.effectPath.join(".");
  const selected = process.effectPaymentPitches?.[key] ?? [];
  if (selected.some((ref) => ref.instanceId === instanceId))
    throw new Error("That payment card was already selected.");
  const record = state.objects[instanceId];
  if (!record) throw new Error("That payment card no longer exists.");
  process.effectPaymentPitches = {
    ...process.effectPaymentPitches,
    [key]: [...selected, { instanceId, incarnation: record.incarnation }],
  };
  const layer = state.rulesStack.find((candidate) => candidate.layerId === continuation.layerId);
  if (!layer) throw new Error("The resolving FAB layer no longer exists.");
  const result = advance(state, layer, options);
  if (!result.accepted) throw new Error(result.error);
  return result.state;
}

export function cancelFabResolutionEffectPayment(
  state: FabMatchState,
  continuation: Extract<FabDecisionContinuation, { readonly kind: "payment" }>,
  options: FabEventTransactionOptions,
  advance: AdvanceLayerResolution,
): FabMatchState {
  const process = state.rulesProcess;
  if (
    !process ||
    process.processId !== continuation.processId ||
    continuation.procedure !== "effect" ||
    process.resolvingLayerId !== continuation.layerId ||
    !continuation.effectPath
  )
    throw new Error("The persisted FAB resolution-effect payment no longer exists.");
  const paymentKey = continuation.effectPath.join(".");
  const optionalKey = continuation.effectPath.slice(0, -1).join(".");
  if (process.effectChoices[optionalKey] !== true)
    throw new Error("A mandatory resolution-effect payment cannot be cancelled.");
  process.effectPaymentPitches = { ...process.effectPaymentPitches, [paymentKey]: [] };
  process.effectChoices[optionalKey] = false;
  const layer = state.rulesStack.find((candidate) => candidate.layerId === continuation.layerId);
  if (!layer) throw new Error("The resolving FAB layer no longer exists.");
  const result = advance(state, layer, options);
  if (!result.accepted) throw new Error(result.error);
  return result.state;
}

export function commitResolutionEffectPayment(
  state: FabMatchState,
  layer: FabRulesStackLayer,
  process: FabRulesProcess,
  options: FabEventTransactionOptions,
  decision: Extract<FabUnansweredLayerDecision, { readonly kind: "payment-commit" }>,
  advance: AdvanceLayerResolution,
): FabLayerResolutionResult {
  const cost = decision.effect.cost;
  if (cost.class !== "asset" || (cost.type !== "resources" && cost.type !== "life")) {
    return failure(state, "Payment commit has a non-asset cost.", "unsupported_rules_effect");
  }
  const paymentKey = decision.path.join(".");
  const pitches = process.effectPaymentPitches?.[paymentKey] ?? [];
  if (decision.amount === 0 && pitches.length > 0) {
    return failure(
      state,
      "Cards cannot be pitched when no resource payment is pending.",
      "invalid_effect_payment",
    );
  }
  const paymentEffect: typeof decision.effect = {
    ...decision.effect,
    cost: { ...cost, amount: decision.amount },
  };
  const proposal = proposeEffectDispatch(
    {
      state,
      layer,
      processId: process.processId,
      effectPath: decision.path,
      targetPath: `payment-${decision.path.join(".")}`,
      effectChoices: process.effectChoices,
      effectPartitions: process.effectPartitions,
      effectOptions: process.effectOptions,
      effectTargets: process.effectTargets,
      effectPaymentPitches: process.effectPaymentPitches ?? {},
    },
    paymentEffect,
  );
  if (!proposal.supported) {
    return resumeFailedEffectPayment(
      state,
      layer,
      process,
      options,
      decision.optionalPath,
      advance,
    );
  }
  if (proposal.outcome !== "proposed" || proposal.events.length === 0) {
    return resumeFailedEffectPayment(
      state,
      layer,
      process,
      options,
      decision.optionalPath,
      advance,
    );
  }
  const eventGroupId = `${process.processId}:effect-payment-${decision.path.join("-")}`;
  const amount = decision.amount;
  process.resolutionEventGroups = [{ eventGroupId, required: true, events: proposal.events }];
  process.effectPaymentContinuation = {
    eventGroupId,
    layerId: layer.layerId,
    effectPath: decision.path,
    optionalPath: decision.optionalPath,
    playerId: decision.actorId,
    costType: cost.type,
    amount,
    pitches,
    events: proposal.events,
    effectChoices: { ...process.effectChoices },
    effectPartitions: { ...process.effectPartitions },
    effectOptions: { ...process.effectOptions },
    effectTargets: { ...process.effectTargets },
    effectPaymentAmounts: { ...process.effectPaymentAmounts },
  };
  const continuation = process.effectPaymentContinuation!;
  const result = executeFabEventJournalTransaction(state, process.resolutionEventGroups, {
    ...options,
    deferTriggerDeclaration: true,
  });
  if (!result.committed) {
    if ("suspendedForReplacementOrder" in result || "suspendedForContinuousOrder" in result) {
      return { accepted: true, state: result.state };
    }
    return {
      accepted: true,
      state: resumeEffectPaymentAfterJournal(result.state, continuation, options, [], advance),
    };
  }
  return {
    accepted: true,
    state: resumeEffectPaymentAfterJournal(
      result.state,
      continuation,
      options,
      result.batches.flatMap((batch) => batch.events),
      advance,
    ),
  };
}

function resumeFailedEffectPayment(
  state: FabMatchState,
  layer: FabRulesStackLayer,
  process: FabRulesProcess,
  options: FabEventTransactionOptions,
  optionalPath: readonly number[] | null,
  advance: AdvanceLayerResolution,
): FabLayerResolutionResult {
  if (optionalPath) process.effectChoices[optionalPath.join(".")] = false;
  return advance(state, layer, options);
}

export function resumeEffectPaymentAfterJournal(
  state: FabMatchState,
  continuation: NonNullable<FabRulesProcess["effectPaymentContinuation"]>,
  options: FabEventTransactionOptions,
  committedEvents: readonly import("../../rules/events.ts").CommittedEvent[],
  advance: AdvanceLayerResolution,
): FabMatchState {
  const index = state.rulesStack.findIndex(
    (candidate) => candidate.layerId === continuation.layerId,
  );
  const layer = state.rulesStack[index];
  if (index < 0 || !layer) throw new Error("The payment layer disappeared before its receipt.");
  const paid = committedEvents.some((event) =>
    continuation.costType === "resources"
      ? event.name === "pay-resources" &&
        event.data.playerId === continuation.playerId &&
        event.data.amount === continuation.amount
      : event.name === "lose-life" &&
        event.data.playerId === continuation.playerId &&
        event.data.amount === continuation.amount,
  );
  const pitched = continuation.pitches.every((ref) =>
    committedEvents.some(
      (event) =>
        event.name === "pitch" &&
        event.data.object.ref.instanceId === ref.instanceId &&
        event.data.object.ref.incarnation === ref.incarnation,
    ),
  );
  const status = paid && pitched ? "committed" : "failed";
  state.rulesStack[index] = {
    ...layer,
    bindings:
      status === "committed" && continuation.costType === "resources"
        ? { ...layer.bindings, "resources-paid-this-way": continuation.amount }
        : layer.bindings,
    effectPaymentReceipts: {
      ...layer.effectPaymentReceipts,
      [continuation.effectPath.join(".")]: {
        status,
        playerId: continuation.playerId,
        costType: continuation.costType,
        amount: continuation.amount,
        pitches: continuation.pitches,
        eventIds: committedEvents.map((event) => event.eventId),
      },
    },
  };
  if (!state.rulesProcess) {
    startFabRulesProcess(
      state,
      resolutionProcess(
        continuation.events[0]?.processId ?? `process-${state.counters.process}`,
        continuation.layerId,
        null,
      ),
    );
  }
  const nextProcess = state.rulesProcess!;
  transitionFabRulesProcessStage(nextProcess, "layer-resolution");
  nextProcess.resolvingLayerId = continuation.layerId;
  nextProcess.effectChoices = { ...continuation.effectChoices };
  nextProcess.effectPartitions = { ...continuation.effectPartitions };
  nextProcess.effectOptions = { ...continuation.effectOptions };
  nextProcess.effectTargets = { ...continuation.effectTargets };
  nextProcess.effectPaymentAmounts = { ...continuation.effectPaymentAmounts };
  nextProcess.effectPaymentPitches = {};
  nextProcess.effectPaymentContinuation = undefined;
  nextProcess.resolutionEventGroups = [];
  if (status === "failed" && continuation.optionalPath) {
    nextProcess.effectChoices[continuation.optionalPath.join(".")] = false;
  }
  const resumedLayer = state.rulesStack[index]!;
  const resumed = advance(state, resumedLayer, options);
  if (!resumed.accepted) throw new Error(resumed.error);
  return resumed.state;
}

export function resumeAbilityStepAfterJournal(
  state: FabMatchState,
  continuation: NonNullable<FabRulesProcess["abilityStepContinuation"]>,
  options: FabEventTransactionOptions,
  committedEvents: readonly import("../../rules/events.ts").CommittedEvent[],
  advance: AdvanceLayerResolution,
): FabMatchState {
  const index = state.rulesStack.findIndex(
    (candidate) => candidate.layerId === continuation.layerId,
  );
  const layer = state.rulesStack[index];
  if (
    index < 0 ||
    !layer ||
    layer.kind !== "card" ||
    layer.resolutionPlan.cursor !== continuation.fromCursor ||
    activeFabCardResolutionStep(layer).faceId !== continuation.faceId
  ) {
    throw new Error("The ordered FAB ability continuation is stale.");
  }
  const nextStep = layer.resolutionPlan.steps[continuation.fromCursor + 1];
  if (!nextStep || nextStep.faceId !== continuation.faceId) {
    throw new Error("The ordered FAB ability continuation crossed a face boundary.");
  }
  // CR 1.7.6 / ordered same-face resolutions: later abilities see parameters
  // produced by earlier ones on this card (discarded-this-way / outputBinding).
  const proposedBound = layerWithEventBindings(layer, continuation.events);
  const boundLayer = {
    ...proposedBound,
    bindings: reanchorFabBindingsThroughCommittedMoves(
      state,
      proposedBound.bindings,
      committedEvents,
    ),
    resolutionPlan: { ...layer.resolutionPlan, cursor: continuation.fromCursor + 1 },
  };
  state.rulesStack[index] = boundLayer;
  const nextProcess = state.rulesProcess;
  if (!nextProcess) throw new Error("The ordered FAB ability continuation lost its rules process.");
  // A same-face ability can pause for a replacement or payment decision
  // before its journal reaches trigger collection. The authoritative layer
  // identity/cursor checks above still reject stale continuations; the stage
  // merely needs to resume layer resolution from either legal boundary.
  transitionFabRulesProcessStage(nextProcess, "layer-resolution");
  nextProcess.resolvingLayerId = continuation.layerId;
  nextProcess.effectChoices = {};
  nextProcess.effectPartitions = {};
  nextProcess.effectOptions = {};
  nextProcess.effectTargets = {};
  nextProcess.effectPaymentAmounts = {};
  nextProcess.effectPaymentPitches = {};
  nextProcess.resolutionEventGroups = [];
  nextProcess.abilityStepContinuation = undefined;
  const nextLayer = state.rulesStack.find(
    (candidate) => candidate.layerId === continuation.layerId,
  );
  if (!nextLayer) throw new Error("The resolving FAB layer no longer exists.");
  const resumed = advance(state, nextLayer, options);
  if (!resumed.accepted) throw new Error(resumed.error);
  return resumed.state;
}
