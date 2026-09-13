import type { FabMatchState } from "../state.ts";
import type { FabProcessId, FabCommittedEventBatch, ProposedEvent } from "../rules/events.ts";
import type { FabRulesProcess } from "../rules/process.ts";
import {
  continuousApplicationFingerprintKey,
  proposeContinuousReconciliationEvents,
} from "../rules/continuous/reconciler.ts";
import { FabRulesOrderingRequiredError } from "../rules/rules-evaluator.ts";
import { continuousSubjectKey } from "../rules/continuous/subject-key.ts";
import type { FabTriggerSource } from "../rules/trigger-matcher.ts";
import {
  affectedPlayerForReplacement,
  collectApplicableReplacementCandidates,
  kernelReplacementFor,
} from "./replacements/index.ts";
import {
  snapshotEventSubjectTriggerSources,
  snapshotFunctionalTriggerSources,
  snapshotObject,
} from "../rules/snapshots.ts";
import { commitFabKernelBatch } from "./commit.ts";
import { isFabStateDraft, prepareFabStateWithResult } from "../copy-on-write.ts";
import type { FabEventTransactionOptions } from "./process-runner/types.ts";
import { fabTriggerEventPatterns } from "../rules/trigger-patterns.ts";
import {
  commitAdministrativeEvent,
  collectAndPersistEventTriggers,
  uniqueTriggerSources,
} from "./transaction/index.ts";
import { transitionFabRulesProcessStage } from "./process-state.ts";

export interface FabReconciliationBatch {
  readonly batch: FabCommittedEventBatch;
  readonly triggerSources: readonly FabTriggerSource[];
}

export function reconcileContinuousEffectsToQuiescence(
  state: FabMatchState,
  processId: FabProcessId,
  options: FabEventTransactionOptions,
  allowOrderingDecision = true,
  journalCursor: number | null = null,
): { readonly batches: readonly FabReconciliationBatch[]; readonly suspended: boolean } {
  const batches: FabReconciliationBatch[] = [];
  for (let iteration = 0; iteration < 1_000; iteration += 1) {
    let proposals: readonly ProposedEvent[];
    try {
      proposals = proposeContinuousReconciliationEvents(state, processId);
    } catch (error) {
      if (!(error instanceof FabRulesOrderingRequiredError) || !allowOrderingDecision) throw error;
      suspendForContinuousOrdering(state, processId, error, journalCursor);
      return { batches, suspended: true };
    }
    if (proposals.length === 0) return { batches, suspended: false };
    const triggerSources = uniqueTriggerSources([
      ...snapshotFunctionalTriggerSources(state),
      ...snapshotEventSubjectTriggerSources(state, proposals),
      ...(options.additionalTriggerSources ?? []),
    ]);
    const replacements = collectApplicableReplacementCandidates(state, proposals);
    const process = state.rulesProcess;
    if (!process || process.processId !== processId) {
      throw new Error(`FAB continuous reconciliation lost process ${processId}.`);
    }
    if (replacements.length > 1 && process.orderedReplacementIds.length === 0) {
      if (!allowOrderingDecision) {
        throw new Error("FAB preview cannot suspend for continuous replacement ordering.");
      }
      suspendForContinuousReplacementOrdering(
        state,
        processId,
        replacements,
        proposals[0]!,
        journalCursor,
      );
      return { batches, suspended: true };
    }
    const orderedReplacements =
      process.orderedReplacementIds.length > 0
        ? process.orderedReplacementIds.map((replacementId) => {
            const candidate = replacements.find((item) => item.replacementId === replacementId);
            if (!candidate) {
              throw new Error(`Missing persisted FAB continuous replacement ${replacementId}.`);
            }
            return candidate;
          })
        : replacements;
    const committed = commitFabKernelBatch(state, proposals, {
      ...options,
      replacements: (() => {
        const destinationAllocator = { nextOffset: 0 };
        return orderedReplacements.map((candidate) =>
          kernelReplacementFor(candidate, destinationAllocator),
        );
      })(),
    });
    recordCancelledContinuousApplications(process, committed.cancelledEvents);
    process.replacementCandidates = [];
    process.orderedReplacementIds = [];
    const consumedReplacementIds = [
      ...new Set([
        ...(committed.batch?.events.flatMap((event) => event.replacementIds) ?? []),
        ...committed.cancelledEvents.flatMap((event) => event.replacementIds),
      ]),
    ];
    if (!committed.batch) {
      if (committed.cancelledEvents.length === 0) {
        throw new Error("FAB continuous reconciliation proposed only no-op events.");
      }
      if (consumedReplacementIds.length > 0) {
        commitAdministrativeEvent(
          state,
          {
            name: "consume-replacement-effects",
            processId,
            cause: { kind: "rule", rule: "continuous replacement consumed", controllerId: null },
            controllerId: null,
            source: null,
            affected: [],
            bindings: {},
            data: {
              consumptions: replacements.flatMap((replacement) =>
                consumedReplacementIds.includes(replacement.replacementId) &&
                replacement.consumptionPolicy.kind === "on-application"
                  ? [
                      {
                        replacementId: replacement.replacementId,
                        controllerId: replacement.controllerId,
                        origin: replacement.origin,
                        reason: "application" as const,
                      },
                    ]
                  : [],
              ),
            },
          },
          options,
        );
      }
      continue;
    }
    Object.assign(state, committed.state);
    state.rulesProcess = process;
    // The reconciliation events themselves retain the source snapshot from
    // their generation boundary. Only an explicit post-reconciliation
    // observation (Become below) recollects the newly functional sources.
    // Rebuilding the entire rules view here would also bypass an unresolved
    // continuous-ordering boundary unrelated to this batch.
    collectAndPersistEventTriggers(state, committed.batch, triggerSources, options);
    observeGrantedTriggersInSameWindow(state, committed.batch, options);
    for (const applied of committed.batch.events) {
      if (applied.name !== "continuous-effect-applied") continue;
      const instance = state.continuousEffectInstances.find(
        (candidate) =>
          candidate.effectId === applied.data.application.effectId && candidate.observeAsBecome,
      );
      const subject = applied.data.application.subject;
      if (!instance || subject.kind !== "object") continue;
      const heroId = state.containers.zonesByPlayerId[instance.controllerId]?.heroZone[0];
      if (!heroId || heroId !== subject.ref.instanceId) continue;
      const hero = snapshotObject(state, heroId, instance.controllerId, "heroZone");
      const observation = commitAdministrativeEvent(
        state,
        {
          name: "become",
          processId,
          cause: { kind: "event", eventId: applied.eventId, controllerId: instance.controllerId },
          controllerId: instance.controllerId,
          source: hero,
          affected: [hero],
          bindings: { became: hero },
          data: { playerId: instance.controllerId, object: hero, previous: instance.source },
        },
        options,
      );
      if (observation) {
        collectAndPersistEventTriggers(
          state,
          observation,
          snapshotFunctionalTriggerSources(state),
          options,
        );
      }
    }
    if (consumedReplacementIds.length > 0) {
      commitAdministrativeEvent(
        state,
        {
          name: "consume-replacement-effects",
          processId,
          cause: { kind: "rule", rule: "continuous replacement consumed", controllerId: null },
          controllerId: null,
          source: null,
          affected: [],
          bindings: {},
          data: {
            consumptions: replacements.flatMap((replacement) =>
              consumedReplacementIds.includes(replacement.replacementId) &&
              replacement.consumptionPolicy.kind === "on-application"
                ? [
                    {
                      replacementId: replacement.replacementId,
                      controllerId: replacement.controllerId,
                      origin: replacement.origin,
                      reason: "application" as const,
                    },
                  ]
                : [],
            ),
          },
        },
        options,
      );
    }
    batches.push({ batch: committed.batch, triggerSources });
  }
  throw new Error("FAB continuous reconciliation iteration limit exceeded (1000).");
}

/**
 * A granted triggered ability that becomes functional because this window's
 * attack/play latched it must still observe that same event (CR 1.8.10 /
 * "your next sword attack gets 'when this attacks'").
 */
function observeGrantedTriggersInSameWindow(
  state: FabMatchState,
  batch: FabCommittedEventBatch,
  options: FabEventTransactionOptions,
): void {
  const process = state.rulesProcess;
  if (!process) return;
  const windowEvents = process.futureSubjectEvents.map((entry) => entry.event);
  if (windowEvents.length === 0) return;

  for (const applied of batch.events) {
    if (applied.name !== "continuous-effect-applied") continue;
    const contribution = applied.data.application.contribution;
    if (contribution.kind !== "property" || contribution.operation !== "grant") continue;
    if (contribution.property.kind !== "ability" && contribution.property.kind !== "abilities") {
      continue;
    }
    const granted =
      contribution.property.kind === "ability" ? contribution.property.ability : undefined;
    const triggerNames =
      granted && "trigger" in granted && granted.trigger
        ? fabTriggerEventPatterns(granted.trigger).map((pattern) => pattern.name)
        : [];
    if (triggerNames.length === 0) continue;
    const subject = applied.data.application.subject;
    if (subject.kind !== "object") continue;
    // A granted trigger may observe this window only when this exact window
    // latched the grant's continuous effect. Matching the object and event
    // name alone would retroactively trigger an unrelated mid-window grant.
    const future = state.continuousEffectInstances.find(
      (instance) => instance.effectId === applied.data.application.effectId,
    )?.futureApplicability;
    if (
      !future?.latchedSubjects.some(
        (latched) =>
          latched.instanceId === subject.ref.instanceId &&
          latched.incarnation === subject.ref.incarnation,
      )
    ) {
      continue;
    }

    const matching = windowEvents.filter((event) => {
      const observedName = event.name === "announce-card" ? "play" : event.name;
      if (!triggerNames.some((name) => name === observedName || name === event.name)) return false;
      return event.data.object.instanceId === subject.ref.instanceId;
    });
    if (matching.length === 0) continue;

    const sources = uniqueTriggerSources([
      ...snapshotFunctionalTriggerSources(state),
      ...snapshotEventSubjectTriggerSources(state, matching),
    ]).filter(
      (source) =>
        source.source.instanceId === subject.ref.instanceId &&
        (granted === undefined || source.abilityId === granted.id),
    );
    if (sources.length === 0) continue;

    const observationBatch: FabCommittedEventBatch = {
      batchId: batch.batchId,
      processId: process.processId,
      events: matching,
    };
    collectAndPersistEventTriggers(state, observationBatch, sources, options);
  }
}

export function recordCancelledContinuousApplications(
  process: FabRulesProcess,
  cancelledEvents: readonly import("./transaction-kernel.ts").FabCancelledProposedEvent[],
): void {
  const keys = cancelledEvents.flatMap(({ event }) => {
    if (event.name !== "continuous-effect-applied" && event.name !== "continuous-effect-changed") {
      return [];
    }
    return [continuousApplicationFingerprintKey(event.data.application)];
  });
  process.cancelledContinuousApplicationKeys = [
    ...new Set([...process.cancelledContinuousApplicationKeys, ...keys]),
  ];
}

export function suspendForContinuousOrdering(
  state: FabMatchState,
  processId: FabProcessId,
  error: FabRulesOrderingRequiredError,
  journalCursor: number | null,
): void {
  const process = state.rulesProcess;
  if (!process || process.processId !== processId) {
    throw new Error(`FAB continuous ordering lost process ${processId}.`);
  }
  const requirement = error.requirement;
  const orderingId = [
    "continuous-order",
    processId,
    requirement.timestamp.sequence,
    requirement.stage,
    typeof requirement.substage === "number"
      ? requirement.substage
      : (requirement.substage ?? "none"),
    continuousSubjectKey(requirement.subject),
  ].join(":");
  const playerId = state.activePlayerId;
  state.counters.decision += 1;
  state.decision = {
    decisionId: `decision-${state.counters.decision}`,
    stateVersion: state.stateID,
    actorId: playerId,
    kind: "ordering",
    label: "Order the simultaneous continuous effects.",
    entries: requirement.atomIds.map((atomId) => ({ id: atomId, label: atomId })),
    continuation: {
      kind: "continuous-order",
      processId,
      orderingId,
      timestamp: requirement.timestamp,
      subject: requirement.subject,
      stage: requirement.stage,
      substage: requirement.substage,
      atomIds: requirement.atomIds,
      playerId,
      journalCursor,
    },
  };
  transitionFabRulesProcessStage(process, "continuous-ordering");
}

export function suspendForContinuousReplacementOrdering(
  state: FabMatchState,
  processId: FabProcessId,
  replacements: FabRulesProcess["replacementCandidates"],
  event: ProposedEvent,
  journalCursor: number | null,
): void {
  const process = state.rulesProcess;
  if (!process || process.processId !== processId) {
    throw new Error(`FAB continuous replacement ordering lost process ${processId}.`);
  }
  process.replacementCandidates = [...replacements];
  state.counters.decision += 1;
  state.decision = {
    decisionId: `decision-${state.counters.decision}`,
    stateVersion: state.stateID,
    actorId: affectedPlayerForReplacement(state, event),
    kind: "ordering",
    label: "Order the applicable continuous-effect replacements.",
    entries: replacements.map((candidate) => ({
      id: candidate.replacementId,
      label: `${candidate.source.current.names.join(" // ") || candidate.source.instanceId}: ${candidate.effect.type}`,
    })),
    continuation: {
      kind: "continuous-replacement-order",
      processId,
      journalCursor,
    },
  };
  transitionFabRulesProcessStage(process, "replacement-ordering");
}

/** Reconcile an isolated tentative journal state before legality/payment is finalized. */
export function reconcileFabContinuousEffectsForPreview(
  state: FabMatchState,
  processId: FabProcessId,
  options: FabEventTransactionOptions,
): FabMatchState {
  // Preview reconciliation is an unpublished rehearsal. Committed-event
  // callbacks are publication channels and must only observe the real journal.
  const {
    onCommittedEvents: _onCommittedEvents,
    onPlayerLogFacts: _onPlayerLogFacts,
    onCommittedReceipt: _onCommittedReceipt,
    ...previewOptions
  } = options;
  const reconcile = (candidate: FabMatchState) => {
    const result = reconcileContinuousEffectsToQuiescence(
      candidate,
      processId,
      previewOptions,
      false,
    );
    if (result.suspended) throw new Error("FAB preview cannot suspend for continuous ordering.");
  };
  if (isFabStateDraft(state)) {
    reconcile(state);
    return state;
  }
  return prepareFabStateWithResult(state, (draft) => {
    reconcile(draft);
    return true;
  }).state;
}
