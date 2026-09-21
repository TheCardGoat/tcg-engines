import type { FabMatchState } from "../../state.ts";
import type { FabCommittedEventBatch, FabProcessId, ProposedEvent } from "../../rules/events.ts";
import type { FabEventTransactionOptions } from "../process-runner/types.ts";
import {
  collectApplicableReplacementCandidates,
  collectPotentialReplacementCandidates,
  expiredReplacementEffectIds,
  kernelReplacementFor,
} from "../replacements/index.ts";
import type { FabTriggerSource } from "../../rules/trigger-matcher.ts";
import {
  snapshotEventSubjectTriggerSources,
  snapshotFunctionalTriggerSources,
} from "../../rules/snapshots.ts";
import { commitFabKernelBatch, commitFabKernelBatchDraft } from "../commit.ts";
import { currentFabState, prepareFabStateWithResult } from "../../copy-on-write.ts";
import type {
  FabPendingTrigger,
  FabReplacementCandidate,
  FabReplacementConsumption,
} from "../../rules/process.ts";
import { appendFabFutureSubjectEvents } from "../../rules/process.ts";
import {
  suspendForOptionalReplacements,
  suspendForReplacementConsequenceTarget,
  suspendForReplacementFirstPlayer,
  suspendForReplacementOrdering,
} from "./replacement-prompts.ts";
import { commitAdministrativeEvent } from "./administrative.ts";
import { collectAndPersistEventTriggers, uniqueTriggerSources } from "./trigger-persistence.ts";
import { transitionFabRulesProcessStage } from "../process-state.ts";

import { selectReplacementConsumptionCandidates } from "./replacement-consumption.ts";

const REPLACEMENT_KINDS: readonly FabReplacementCandidate["replacementKind"][] = [
  "self-or-identity",
  "standard",
  "prevention",
  "outcome",
];

function clockwisePlayersFrom(
  state: Readonly<FabMatchState>,
  firstPlayerId: string,
): readonly string[] {
  const firstIndex = state.playerIds.findIndex((playerId) => playerId === firstPlayerId);
  if (firstIndex < 0) throw new Error(`Unknown FAB replacement starting player ${firstPlayerId}.`);
  return [...state.playerIds.slice(firstIndex), ...state.playerIds.slice(0, firstIndex)];
}

function persistedControllerStageOrder(
  candidates: readonly FabReplacementCandidate[],
  persistedOrder: readonly string[],
  controllerId: string,
  replacementKind: FabReplacementCandidate["replacementKind"],
): readonly FabReplacementCandidate[] | null {
  const group = candidates.filter(
    (candidate) =>
      candidate.controllerId === controllerId && candidate.replacementKind === replacementKind,
  );
  if (group.length <= 1) return group;
  const groupIds = group.map((candidate) => candidate.replacementId);
  const orderedIds = persistedOrder.filter((id) => groupIds.includes(id));
  if (orderedIds.length !== group.length) return null;
  return orderedIds.map((id) => group.find((candidate) => candidate.replacementId === id)!);
}

/** The single event-batch commit path used by both direct moves and journals. */
function commitTransactionWork(
  state: FabMatchState,
  events: readonly ProposedEvent[],
  replacements: ReturnType<typeof collectApplicableReplacementCandidates>,
  options: FabEventTransactionOptions,
  replacementDecisions?: Pick<
    import("../transaction-kernel.ts").FabCommitOptions,
    "selectReplacement" | "mayApplyReplacement" | "replacementPlayerOrder"
  >,
): {
  readonly state: FabMatchState;
  readonly batch: FabCommittedEventBatch | null;
  readonly cancelledEvents: readonly import("../transaction-kernel.ts").FabCancelledProposedEvent[];
  readonly triggerSources: readonly FabTriggerSource[];
} {
  const triggerSources = uniqueTriggerSources([
    ...snapshotFunctionalTriggerSources(state),
    ...snapshotEventSubjectTriggerSources(state, events),
    ...(options.additionalTriggerSources ?? []),
  ]);
  const committed = commitFabKernelBatch(state, events, {
    ...options,
    // Each replacement's sub-events now commit before the modified parent is
    // re-evaluated. Destination allocation therefore starts from the updated
    // state for each application instead of reserving offsets across a stale
    // pre-replacement snapshot.
    replacements: replacements.map((candidate) => kernelReplacementFor(candidate)),
    replacementPlayerOrder:
      replacementDecisions?.replacementPlayerOrder ??
      ((_event, controllerIds) => {
        const persistedControllerOrder = [
          ...new Set(replacements.map((candidate) => candidate.controllerId)),
        ];
        const order = persistedControllerOrder.filter((playerId) =>
          controllerIds.includes(playerId),
        );
        return [...order, ...controllerIds.filter((playerId) => !order.includes(playerId))];
      }),
    ...(replacementDecisions?.selectReplacement
      ? { selectReplacement: replacementDecisions.selectReplacement }
      : {}),
    ...(replacementDecisions?.mayApplyReplacement
      ? { mayApplyReplacement: replacementDecisions.mayApplyReplacement }
      : {}),
  });
  return {
    state: committed.state,
    batch: committed.batch,
    cancelledEvents: committed.cancelledEvents,
    triggerSources,
  };
}

function consumptionsForBoundary(
  candidates: readonly FabReplacementCandidate[],
  appliedReplacementIds: readonly string[],
  preventedByReplacementId: ReadonlyMap<string, number> = new Map(),
): FabReplacementConsumption[] {
  const applied = new Set(appliedReplacementIds);
  return candidates.flatMap((candidate) => {
    // CR 6.4.10a/6.4.10j: a shielding application consumes its remaining
    // prevention by exactly the damage it prevented (the final committed
    // prevent-event amount — post any later "prevents 1 less" rewrite). An
    // application that prevented nothing (CR 6.4.10h unpreventable damage)
    // does NOT consume the shield: no consumption is emitted and the effect
    // survives for a future event with its amount unreduced.
    if (
      candidate.consumptionPolicy.kind === "on-application" &&
      applied.has(candidate.replacementId) &&
      candidate.effect.type === "prevention" &&
      candidate.effect.preventionKind === "shielding"
    ) {
      const prevented =
        preventedByReplacementId.get(candidate.originReplacementId ?? candidate.replacementId) ?? 0;
      return prevented > 0
        ? [
            {
              replacementId: candidate.originReplacementId ?? candidate.replacementId,
              controllerId: candidate.controllerId,
              origin: candidate.origin,
              reason: "application",
              preventedAmount: prevented,
            } satisfies FabReplacementConsumption,
          ]
        : [];
    }
    const reason =
      candidate.consumptionPolicy.kind === "on-opportunity"
        ? "opportunity"
        : candidate.consumptionPolicy.kind === "on-application" &&
            applied.has(candidate.replacementId)
          ? "application"
          : null;
    return reason
      ? [
          {
            replacementId: candidate.originReplacementId ?? candidate.replacementId,
            controllerId: candidate.controllerId,
            origin: candidate.origin,
            reason,
          } satisfies FabReplacementConsumption,
        ]
      : [];
  });
}

/**
 * CR 6.4.10a: total damage each replacement actually prevented in a committed
 * batch, read from the FINAL prevent-event payloads (a later "prevents 1 less"
 * rewrite such as Vambrace of Determination revises `preventedAmount` before
 * commit, and it is that final value the shielding decrement must use).
 * Zero-prevention applications (CR 6.4.10h) contribute nothing.
 */
function preventedAmountsByReplacementId(batch: FabCommittedEventBatch): Map<string, number> {
  const sums = new Map<string, number>();
  for (const event of batch.events) {
    if (event.name !== "prevent") continue;
    const prevented = event.data.preventedAmount;
    if (!Number.isFinite(prevented) || prevented <= 0) continue;
    for (const replacementId of event.replacementIds) {
      sums.set(replacementId, (sums.get(replacementId) ?? 0) + prevented);
    }
  }
  return sums;
}

function consumeReplacementsAtBoundary(
  state: FabMatchState,
  candidates: readonly FabReplacementCandidate[],
  appliedReplacementIds: readonly string[],
  options: FabEventTransactionOptions,
  preventedByReplacementId: ReadonlyMap<string, number> = new Map(),
): FabCommittedEventBatch | null {
  const process = state.rulesProcess;
  if (!process) throw new Error("FAB replacement consumption lost its rules process.");
  const consumptions = consumptionsForBoundary(
    candidates,
    appliedReplacementIds,
    preventedByReplacementId,
  );
  if (consumptions.length === 0) return null;
  return commitAdministrativeEvent(
    state,
    {
      name: "consume-replacement-effects",
      processId: process.processId,
      cause: { kind: "rule", rule: "bounded replacement consumed", controllerId: null },
      controllerId: null,
      source: null,
      affected: [],
      bindings: {},
      data: { consumptions },
    },
    options,
  );
}

/** Persist only the bounded in-flight facts needed after one committed work batch. */
function persistCommittedTransactionWork(
  state: FabMatchState,
  batch: FabCommittedEventBatch,
  candidates: readonly FabReplacementCandidate[],
  cancelledEvents: readonly import("../transaction-kernel.ts").FabCancelledProposedEvent[],
  triggerSources: readonly FabTriggerSource[],
  options: FabEventTransactionOptions,
): readonly FabCommittedEventBatch[] {
  const process = state.rulesProcess;
  if (!process) throw new Error("FAB committed work lost its rules process.");
  appendFabFutureSubjectEvents(process, batch.events);
  process.pendingEvents = [];
  process.appliedReplacementIds = [
    ...new Set([
      ...process.appliedReplacementIds,
      ...batch.events.flatMap((event) => event.replacementIds),
    ]),
  ];
  process.replacementCandidates = [];
  process.replacementChoiceResolved = false;
  process.replacementChoicePlayerIds = [];
  process.selectedOptionalReplacementIds = [];
  process.declinedOptionalReplacementIds = [];
  process.orderedReplacementIds = [];
  delete process.replacementFirstPlayerId;
  const replacementIds = [
    ...new Set([
      ...batch.events.flatMap((event) => event.replacementIds),
      ...cancelledEvents.flatMap((event) => event.replacementIds),
    ]),
  ];
  const consumeBatch = consumeReplacementsAtBoundary(
    state,
    candidates,
    replacementIds,
    options,
    preventedAmountsByReplacementId(batch),
  );
  collectAndPersistEventTriggers(state, batch, triggerSources, options);
  return consumeBatch ? [consumeBatch] : [];
}

type FabTransactionWorkGroupResult =
  | {
      readonly kind: "committed";
      readonly state: FabMatchState;
      readonly batch: FabCommittedEventBatch;
      readonly batches: readonly FabCommittedEventBatch[];
    }
  | { readonly kind: "no-commit"; readonly state: FabMatchState }
  | { readonly kind: "replacement-ordering"; readonly state: FabMatchState }
  | {
      readonly kind: "required-cancelled";
      readonly state: FabMatchState;
      readonly eventGroupId: string;
    };

class PendingOptionalReplacementDecision extends Error {
  readonly candidate: FabReplacementCandidate;

  constructor(candidate: FabReplacementCandidate) {
    super(`Optional replacement ${candidate.replacementId} became active.`);
    this.candidate = candidate;
  }
}

class PendingReplacementOrderDecision extends Error {
  readonly candidates: readonly FabReplacementCandidate[];

  constructor(candidates: readonly FabReplacementCandidate[]) {
    super("Multiple same-controller, same-stage replacement effects became active.");
    this.candidates = candidates;
  }
}

function replacementDecisionCallbacks(
  candidates: readonly FabReplacementCandidate[],
  selectedOptionalIds: readonly string[],
  declinedOptionalIds: readonly string[],
  persistedOrder: readonly string[],
) {
  return {
    selectReplacement: (
      _event: ProposedEvent,
      active: readonly import("../transaction-kernel.ts").FabReplacementEffect[],
    ): string => {
      // Optionality is decided before ordering. An optional effect newly made
      // active by another replacement gets its own persisted decision, while
      // an already-declined effect is retired from this original event without
      // contaminating the controller's ordering prompt.
      const undecided = active.find(
        (effect) =>
          effect.optional &&
          !selectedOptionalIds.includes(effect.replacementId) &&
          !declinedOptionalIds.includes(effect.replacementId),
      );
      if (undecided) {
        const candidate = candidates.find((item) => item.replacementId === undecided.replacementId);
        if (!candidate)
          throw new Error(`Missing optional replacement candidate ${undecided.replacementId}.`);
        throw new PendingOptionalReplacementDecision(candidate);
      }
      const declined = active.find(
        (effect) => effect.optional && declinedOptionalIds.includes(effect.replacementId),
      );
      if (declined) return declined.replacementId;
      const first = active[0];
      if (!first) throw new Error("FAB replacement selection has no active candidates.");
      // The kernel has already sorted this stage by the persisted CR 6.5.2
      // player order. Only the first controller's simultaneous effects are a
      // choice for that controller; effects controlled by later players must
      // not be included in, or block, this decision.
      const controllerActive = active.filter(
        (candidate) => candidate.controllerId === first.controllerId,
      );
      if (controllerActive.length === 1) return first.replacementId;
      const activeIds = controllerActive.map((candidate) => candidate.replacementId);
      const ordered = persistedOrder.filter((id) => activeIds.includes(id));
      if (ordered.length === controllerActive.length) return ordered[0]!;
      throw new PendingReplacementOrderDecision(
        controllerActive.map((effect) => {
          const candidate = candidates.find((item) => item.replacementId === effect.replacementId);
          if (!candidate)
            throw new Error(`Missing active replacement candidate ${effect.replacementId}.`);
          return candidate;
        }),
      );
    },
    mayApplyReplacement: (
      _event: ProposedEvent,
      effect: import("../transaction-kernel.ts").FabReplacementEffect,
    ): boolean => {
      if (!effect.optional) return true;
      if (selectedOptionalIds.includes(effect.replacementId)) return true;
      if (declinedOptionalIds.includes(effect.replacementId)) return false;
      const candidate = candidates.find((item) => item.replacementId === effect.replacementId);
      if (!candidate)
        throw new Error(`Missing optional replacement candidate ${effect.replacementId}.`);
      throw new PendingOptionalReplacementDecision(candidate);
    },
  } as const;
}

function previewReplacementDecisions(
  state: FabMatchState,
  events: readonly ProposedEvent[],
  candidates: readonly FabReplacementCandidate[],
  selectedOptionalIds: readonly string[],
  declinedOptionalIds: readonly string[],
  persistedOrder: readonly string[],
  playerOrder: readonly string[],
  options: FabEventTransactionOptions,
): PendingOptionalReplacementDecision | PendingReplacementOrderDecision | null {
  // This is an unpublished copy-on-write rehearsal. Runtime receipts are an
  // external publication channel, so forwarding the callback would expose the
  // preview as a second committed event stream even though its state is
  // discarded.
  const {
    onCommittedEvents: _onCommittedEvents,
    onPlayerLogFacts: _onPlayerLogFacts,
    onCommittedReceipt: _onCommittedReceipt,
    ...previewOptions
  } = options;
  try {
    prepareFabStateWithResult(currentFabState(state), (draft) =>
      commitFabKernelBatchDraft(draft, events, {
        ...previewOptions,
        replacements: candidates.map((candidate) => kernelReplacementFor(candidate)),
        replacementPlayerOrder: () => playerOrder,
        ...replacementDecisionCallbacks(
          candidates,
          selectedOptionalIds,
          declinedOptionalIds,
          persistedOrder,
        ),
      }),
    );
    return null;
  } catch (error) {
    if (
      error instanceof PendingOptionalReplacementDecision ||
      error instanceof PendingReplacementOrderDecision
    ) {
      return error;
    }
    throw error;
  }
}

/**
 * Canonical replacement-to-commit checkpoint. A journal is merely ordered
 * work passed through this runner; its rollback snapshot changes suspension
 * and required-cancellation publication, never the rules execution path.
 */
export function executeTransactionWorkGroup(
  state: FabMatchState,
  work: {
    readonly events: readonly ProposedEvent[];
    /** A parent conditional replacement is not an effect on its own cost event. */
    readonly excludedReplacementIds?: readonly string[];
    readonly eventGroupId?: string;
    readonly required?: boolean;
    readonly rollbackState?: FabMatchState;
    readonly continuation: (
      processId: FabProcessId,
      controllerId: string,
      replacementKind: FabReplacementCandidate["replacementKind"],
    ) =>
      | {
          readonly kind: "replacement-order";
          readonly processId: FabProcessId;
          readonly controllerId: string;
          readonly replacementKind: FabReplacementCandidate["replacementKind"];
        }
      | {
          readonly kind: "journal-replacement-order";
          readonly processId: FabProcessId;
          readonly eventGroupId: string;
          readonly controllerId: string;
          readonly replacementKind: FabReplacementCandidate["replacementKind"];
        };
  },
  options: FabEventTransactionOptions,
): FabTransactionWorkGroupResult {
  const process = state.rulesProcess;
  if (!process) throw new Error("FAB transaction work has no persisted rules process.");
  transitionFabRulesProcessStage(process, "event-commit");
  const expired = commitAdministrativeEvent(
    state,
    {
      name: "expire-replacement-effects",
      processId: process.processId,
      cause: { kind: "rule", rule: "replacement duration expiry", controllerId: null },
      controllerId: null,
      source: null,
      affected: [],
      bindings: {},
      data: { replacementIds: expiredReplacementEffectIds(state) },
    },
    options,
  );
  const excludedReplacementIds = new Set(work.excludedReplacementIds ?? []);
  const candidateUniverse = collectPotentialReplacementCandidates(state, work.events).filter(
    (candidate) => !excludedReplacementIds.has(candidate.replacementId),
  );
  const candidates = collectApplicableReplacementCandidates(state, work.events).filter(
    (candidate) => !excludedReplacementIds.has(candidate.replacementId),
  );
  const controllerIds =
    work.events
      .flatMap((event) => {
        const eventCandidates = collectApplicableReplacementCandidates(state, [event]);
        return REPLACEMENT_KINDS.map((replacementKind) => [
          ...new Set(
            eventCandidates
              .filter((candidate) => candidate.replacementKind === replacementKind)
              .map((candidate) => candidate.controllerId),
          ),
        ]);
      })
      .find((controllers) => controllers.length > 1) ?? [];
  const persistedFirstPlayerId = work.eventGroupId
    ? process.journalReplacementFirstPlayerIds?.[work.eventGroupId]
    : process.replacementFirstPlayerId;
  if (controllerIds.length > 1 && !persistedFirstPlayerId) {
    const suspensionState = work.rollbackState ?? state;
    suspendForReplacementFirstPlayer(suspensionState, candidates, controllerIds, {
      kind: "replacement-first-player",
      processId: suspensionState.rulesProcess?.processId ?? process.processId,
      ...(work.eventGroupId ? { eventGroupId: work.eventGroupId } : {}),
      ...(work.eventGroupId &&
      process.sequencePrefixContinuation?.eventGroupId === work.eventGroupId
        ? { sequencePrefix: process.sequencePrefixContinuation }
        : {}),
    });
    return { kind: "replacement-ordering", state: suspensionState };
  }
  const firstPlayerId = persistedFirstPlayerId ?? controllerIds[0] ?? state.activePlayerId;
  const playerOrder = clockwisePlayersFrom(state, firstPlayerId);
  const optionalPlayerIds = playerOrder.filter((playerId) =>
    candidates.some((candidate) => candidate.optional && candidate.controllerId === playerId),
  );
  const choicePlayerIds = work.eventGroupId
    ? (process.journalReplacementChoicePlayerIds[work.eventGroupId] ?? [])
    : process.replacementChoicePlayerIds;
  const nextChoicePlayerId = optionalPlayerIds.find(
    (playerId) => !choicePlayerIds.includes(playerId),
  );
  if (nextChoicePlayerId) {
    if (!work.events[0]) throw new Error("FAB optional replacement has no proposed event.");
    const suspensionState = work.rollbackState ?? state;
    suspendForOptionalReplacements(suspensionState, candidates, nextChoicePlayerId, work.events, {
      kind: "replacement-player",
      processId: suspensionState.rulesProcess?.processId ?? process.processId,
      playerId: nextChoicePlayerId,
      ...(work.eventGroupId ? { eventGroupId: work.eventGroupId } : {}),
      ...(work.eventGroupId &&
      process.sequencePrefixContinuation?.eventGroupId === work.eventGroupId
        ? { sequencePrefix: process.sequencePrefixContinuation }
        : {}),
    });
    return { kind: "replacement-ordering", state: suspensionState };
  }
  if (optionalPlayerIds.length > 0) process.replacementChoiceResolved = !work.eventGroupId;
  const selectedOptionalIds = work.eventGroupId
    ? (process.journalReplacementChoices[work.eventGroupId] ?? [])
    : process.selectedOptionalReplacementIds;
  const declinedOptionalIds = work.eventGroupId
    ? (process.journalDeclinedReplacementChoices?.[work.eventGroupId] ?? [])
    : (process.declinedOptionalReplacementIds ?? []);
  const selectedCandidates = selectedOptionalIds
    ? candidates.filter(
        (candidate) => !candidate.optional || selectedOptionalIds.includes(candidate.replacementId),
      )
    : candidates;
  const consequenceCandidate = selectedCandidates.find(
    (candidate) =>
      candidate.effect.type === "replacement" &&
      candidate.effect.modification.type === "win-clash" &&
      candidate.persistedConsequenceTarget === undefined,
  );
  if (consequenceCandidate) {
    const suspensionState = work.rollbackState ?? state;
    suspendForReplacementConsequenceTarget(
      suspensionState,
      selectedCandidates,
      consequenceCandidate,
      {
        kind: "replacement-consequence-target",
        processId: suspensionState.rulesProcess?.processId ?? process.processId,
        playerId: consequenceCandidate.controllerId,
        replacementId: consequenceCandidate.replacementId,
        ...(work.eventGroupId ? { eventGroupId: work.eventGroupId } : {}),
        ...(work.eventGroupId &&
        process.sequencePrefixContinuation?.eventGroupId === work.eventGroupId
          ? { sequencePrefix: process.sequencePrefixContinuation }
          : {}),
      },
    );
    return { kind: "replacement-ordering", state: suspensionState };
  }
  const persistedOrder = work.eventGroupId
    ? (process.journalReplacementOrders[work.eventGroupId] ?? [])
    : process.orderedReplacementIds;
  const orderedCandidates: FabReplacementCandidate[] = [];
  for (const replacementKind of REPLACEMENT_KINDS) {
    for (const controllerId of playerOrder) {
      const group = persistedControllerStageOrder(
        selectedCandidates,
        persistedOrder,
        controllerId,
        replacementKind,
      );
      if (group === null) {
        const candidatesForPrompt = selectedCandidates.filter(
          (candidate) =>
            candidate.controllerId === controllerId &&
            candidate.replacementKind === replacementKind,
        );
        const suspensionState = work.rollbackState ?? state;
        suspendForReplacementOrdering(
          suspensionState,
          candidatesForPrompt,
          controllerId,
          replacementKind,
          work.continuation(
            suspensionState.rulesProcess?.processId ?? process.processId,
            controllerId,
            replacementKind,
          ),
        );
        return { kind: "replacement-ordering", state: suspensionState };
      }
      orderedCandidates.push(...group);
    }
  }
  const commitCandidates = [
    ...orderedCandidates,
    ...candidateUniverse.filter(
      (candidate) =>
        !orderedCandidates.some((ordered) => ordered.replacementId === candidate.replacementId),
    ),
  ];
  const consumptionCandidates = selectReplacementConsumptionCandidates(
    candidates,
    commitCandidates,
    selectedOptionalIds,
    declinedOptionalIds,
  );
  const replacementDecisions = replacementDecisionCallbacks(
    commitCandidates,
    selectedOptionalIds,
    declinedOptionalIds,
    persistedOrder,
  );
  const pendingDecision =
    commitCandidates.length === 0
      ? null
      : previewReplacementDecisions(
          state,
          work.events,
          commitCandidates,
          selectedOptionalIds,
          declinedOptionalIds,
          persistedOrder,
          playerOrder,
          options,
        );
  if (pendingDecision instanceof PendingOptionalReplacementDecision) {
    const suspensionState = work.rollbackState ?? state;
    suspendForOptionalReplacements(
      suspensionState,
      [pendingDecision.candidate],
      pendingDecision.candidate.controllerId,
      work.events,
      {
        kind: "replacement-player",
        processId: suspensionState.rulesProcess?.processId ?? process.processId,
        playerId: pendingDecision.candidate.controllerId,
        ...(work.eventGroupId ? { eventGroupId: work.eventGroupId } : {}),
        ...(work.eventGroupId &&
        process.sequencePrefixContinuation?.eventGroupId === work.eventGroupId
          ? { sequencePrefix: process.sequencePrefixContinuation }
          : {}),
      },
    );
    return { kind: "replacement-ordering", state: suspensionState };
  }
  if (pendingDecision instanceof PendingReplacementOrderDecision) {
    const [candidate] = pendingDecision.candidates;
    if (!candidate) throw new Error("FAB replacement ordering preflight has no candidates.");
    const suspensionState = work.rollbackState ?? state;
    suspendForReplacementOrdering(
      suspensionState,
      [...pendingDecision.candidates],
      candidate.controllerId,
      candidate.replacementKind,
      work.continuation(
        suspensionState.rulesProcess?.processId ?? process.processId,
        candidate.controllerId,
        candidate.replacementKind,
      ),
    );
    return { kind: "replacement-ordering", state: suspensionState };
  }
  const committed = commitTransactionWork(state, work.events, commitCandidates, options, {
    ...replacementDecisions,
    replacementPlayerOrder: () => playerOrder,
  });
  if (!committed.batch) {
    const cancelledReplacementIds = [
      ...new Set(committed.cancelledEvents.flatMap((event) => event.replacementIds)),
    ];
    consumeReplacementsAtBoundary(
      committed.state,
      consumptionCandidates,
      cancelledReplacementIds,
      options,
    );
    const noCommitProcess = committed.state.rulesProcess;
    if (noCommitProcess) {
      noCommitProcess.replacementCandidates = [];
      noCommitProcess.replacementChoiceResolved = false;
      noCommitProcess.replacementChoicePlayerIds = [];
      noCommitProcess.selectedOptionalReplacementIds = [];
      noCommitProcess.declinedOptionalReplacementIds = [];
      noCommitProcess.orderedReplacementIds = [];
      delete noCommitProcess.replacementFirstPlayerId;
    }
    if (work.required) {
      if (!work.eventGroupId)
        throw new Error("FAB required transaction work is missing a group id.");
      return {
        kind: "required-cancelled",
        state: work.rollbackState ?? state,
        eventGroupId: work.eventGroupId,
      };
    }
    return { kind: "no-commit", state: committed.state };
  }
  const batches = [
    ...(expired ? [expired] : []),
    committed.batch,
    ...persistCommittedTransactionWork(
      committed.state,
      committed.batch,
      consumptionCandidates,
      committed.cancelledEvents,
      committed.triggerSources,
      options,
    ),
  ];
  return { kind: "committed", state: committed.state, batch: committed.batch, batches };
}
