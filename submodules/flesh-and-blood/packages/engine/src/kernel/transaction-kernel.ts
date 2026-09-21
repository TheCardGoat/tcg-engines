import type { FabLogEntry, FabMatchState } from "../state.ts";
import { createFabLoopGuard } from "@tcg/flesh-and-blood-types";
import {
  applyPreparedFabState,
  currentFabState,
  mutateInPlace,
  prepareFabStateWithResult,
  type FabStateDraft,
} from "../copy-on-write.ts";
import type {
  CommittedEvent,
  FabCommittedEventContext,
  FabCommittedEventBatch,
  FabEventBatchId,
  FabEventOccurrence,
  ProposedEvent,
} from "../rules/events.ts";
import { fabObjectInstanceId, fabPlayerId } from "../game/identity.ts";
import { fabCombatDamageForTarget } from "../game/combat.ts";
import { fabLogFactsForEvent } from "../command-logs.ts";
import {
  FAB_LOG_KEY_NARRATIVE_ROLES,
  renderFabLogTemplate,
  type FabLogContext,
  type FabLogFact,
  type FabLogKey,
} from "../log/index.ts";
import type { FabPlayerLogFact } from "../player-log.ts";
import {
  historyTokenKindFromCanonicalId,
  historyTokenKindFromIdentity,
  historyTokenKindOf,
} from "./history-facts.ts";

export type DeepReadonly<Value> = Value extends (...args: never[]) => unknown
  ? Value
  : Value extends string | number | boolean | bigint | symbol | null | undefined
    ? Value
    : Value extends readonly unknown[]
      ? { readonly [Key in keyof Value]: DeepReadonly<Value[Key]> }
      : Value extends object
        ? { readonly [Key in keyof Value]: DeepReadonly<Value[Key]> }
        : Value;

export type FabRulesSnapshot = DeepReadonly<FabMatchState>;

/** Mutable state exists only inside reducers and the transaction kernel. */
export type FabReducerDraft = FabMatchState;

export interface FabEventReduction {
  readonly state: FabReducerDraft;
  /** Nested events produced by the committed change, in deterministic order. */
  readonly followUpEvents?: readonly ProposedEvent[];
  /** Player-significant facts produced by this successful reduction. */
  readonly playerLogFacts?: readonly FabPlayerLogFact[];
}

export type FabEventReducer = (
  state: FabRulesSnapshot,
  event: ProposedEvent,
) => FabEventReduction | null;

export interface FabReplacementEffect {
  readonly replacementId: string;
  readonly controllerId: string;
  readonly optional: boolean;
  readonly replacementKind: "self-or-identity" | "standard" | "prevention" | "outcome";
  /**
   * CR 6.4.5 is scoped to one original event. CR 1.9.2b is the explicit
   * exception for an effect that replaces a multi-event as a whole.
   */
  readonly applicationScope:
    | { readonly kind: "original-event" }
    | { readonly kind: "multi-event"; readonly scopeId: string }
    | { readonly kind: "unlimited" };
  readonly applies: (state: FabRulesSnapshot, event: ProposedEvent) => boolean;
  readonly replace: (
    state: FabRulesSnapshot,
    event: ProposedEvent,
  ) => {
    readonly event: ProposedEvent | null;
    readonly subEvents?: readonly ProposedEvent[];
    /**
     * Engine decomposition of the same original event. Unlike CR sub-events,
     * these retain the original event's replacement-use lineage.
     */
    readonly continuationEvents?: readonly ProposedEvent[];
  };
}

/** Per-dispatch publication sink shared by every kernel port. Never retained in a snapshot. */
export interface FabKernelEventSink {
  /** Per-dispatch output sink. Never retained in a match snapshot. */
  readonly onCommittedEvents?: (events: readonly CommittedEvent[]) => void;
  /** Per-dispatch player-narrative sink. Never retained in a match snapshot. */
  readonly onPlayerLogFacts?: (facts: readonly FabPlayerLogFact[]) => void;
  /** Keeps events and their narrative facts paired across nested procedures. */
  readonly onCommittedReceipt?: (receipt: {
    readonly events: readonly CommittedEvent[];
    readonly playerLogFacts: readonly FabPlayerLogFact[];
  }) => void;
}

export function publishFabKernelReceipt(
  options: FabKernelEventSink,
  events: readonly CommittedEvent[],
  playerLogFacts: readonly FabPlayerLogFact[],
): void {
  options.onCommittedReceipt?.({ events, playerLogFacts });
  if (events.length > 0) options.onCommittedEvents?.(events);
  if (playerLogFacts.length > 0) options.onPlayerLogFacts?.(playerLogFacts);
}

export interface FabCommitOptions extends FabKernelEventSink {
  readonly replacements?: readonly FabReplacementEffect[];
  /**
   * CR 6.5.2 starting-player selection, fixed once for each original event.
   * The orchestration boundary persists this answer before entering the pure
   * commit kernel. A single-controller event needs no explicit order.
   */
  readonly replacementPlayerOrder?: (
    event: ProposedEvent,
    controllerIds: readonly string[],
  ) => readonly string[];
  /** Choose one currently active effect within an already fixed kind stage. */
  readonly selectReplacement?: (
    event: ProposedEvent,
    candidates: readonly FabReplacementEffect[],
  ) => string;
  /** Resolve a CR "may" application after the effect has actually become active. */
  readonly mayApplyReplacement?: (
    event: ProposedEvent,
    replacement: FabReplacementEffect,
  ) => boolean;
  readonly maxIterations?: number;
}

export interface FabCommitResult {
  readonly state: FabReducerDraft;
  readonly batch: FabCommittedEventBatch | null;
  readonly playerLogFacts: readonly FabPlayerLogFact[];
  /** Proposed events explicitly canceled by replacements. They never receive event ids. */
  readonly cancelledEvents: readonly FabCancelledProposedEvent[];
}

/**
 * Narrative curation for the legacy fact fallback: events whose reducers do
 * not emit `playerLogFacts` themselves fall back to log-key facts, and these
 * structural keys are deliberately excluded. This is load-bearing policy,
 * not migration debt — deleting the set floods player narratives with
 * zone-shuffle noise (the AAA narrative suites fail on exactly that). A
 * player said they played or pitched a card, not that the engine moved it
 * through three zones or recalculated low-level derived modifiers. A key
 * leaves this set only when its reducer starts emitting a deliberate
 * narrative fact.
 */
const FAB_PLAYER_LOG_MIGRATION_EXCLUDED_KEYS: ReadonlySet<FabLogKey> = new Set([
  "flesh-and-blood.put-into-graveyard",
  "flesh-and-blood.enter-arena",
  "flesh-and-blood.leave-arena",
  "flesh-and-blood.move-zone",
  "flesh-and-blood.move-zone.hidden",
  "flesh-and-blood.go-again",
  "flesh-and-blood.gain-keyword",
  "flesh-and-blood.modify-power",
  "flesh-and-blood.turn.started",
]);

function shouldMigrateLegacyPlayerLogFact(fact: FabLogFact): boolean {
  const role = FAB_LOG_KEY_NARRATIVE_ROLES[fact.key];
  return (
    role !== "diagnostic" &&
    role !== "transient" &&
    !FAB_PLAYER_LOG_MIGRATION_EXCLUDED_KEYS.has(fact.key)
  );
}

function playerLogFactsForReplacedEvent(
  event: ProposedEvent,
  subEvents: readonly ProposedEvent[],
): readonly FabPlayerLogFact[] {
  switch (event.name) {
    case "draw":
      return subEvents.some(
        (subEvent) => subEvent.name === "draw" && subEvent.data.playerId === event.data.playerId,
      )
        ? []
        : [{ kind: "draw-replaced", playerId: event.data.playerId }];
    default:
      return [];
  }
}

export interface FabCancelledProposedEvent {
  readonly event: ProposedEvent;
  readonly replacementIds: readonly string[];
}

/**
 * Applies replacements and reducers to an isolated snapshot, then publishes
 * all resulting changes together. A null reduction is a CR 1.9.1b no-op and
 * receives no event id. Replacement use is per original event (CR 6.4.5),
 * except for a replacement explicitly scoped to a multi-event (CR 1.9.2b).
 */
export function commitProposedEventBatch(
  state: FabRulesSnapshot,
  proposedEvents: readonly ProposedEvent[],
  reducer: FabEventReducer,
  options: FabCommitOptions = {},
): FabCommitResult {
  let result: ReturnType<typeof commitProposedEventBatchDraft> | undefined;
  const committedState = mutateInPlace(state as FabMatchState, (draft) => {
    result = commitProposedEventBatchDraft(
      draft as FabStateDraft,
      proposedEvents,
      reducer,
      options,
    );
  });
  if (result === undefined) {
    throw new Error("FAB event batch reduction did not produce a result.");
  }
  publishFabKernelReceipt(options, result.events, result.playerLogFacts);
  return {
    state: committedState,
    batch: result.batch,
    cancelledEvents: result.cancelledEvents,
    playerLogFacts: result.playerLogFacts,
  };
}

/**
 * Apply one atomic event group to an already-open Mutative draft.
 *
 * Command runners use this to avoid opening a nested draft for a batch after
 * they have already created the process/decision boundary. Receipts are
 * returned to the runner and must be published only after its outer draft
 * finalizes.
 */
export function commitProposedEventBatchDraft(
  draft: FabStateDraft,
  proposedEvents: readonly ProposedEvent[],
  reducer: FabEventReducer,
  options: Omit<
    FabCommitOptions,
    "onCommittedEvents" | "onPlayerLogFacts" | "onCommittedReceipt"
  > = {},
): {
  readonly batch: FabCommittedEventBatch | null;
  readonly cancelledEvents: readonly FabCancelledProposedEvent[];
  readonly events: readonly CommittedEvent[];
  readonly playerLogFacts: readonly FabPlayerLogFact[];
} {
  const maxIterations = options.maxIterations ?? 1_000;
  const queue = proposedEvents.map((event) => ({
    event,
    inheritedReplacementIds: [] as string[],
    appliedOriginalEventReplacementIds: [] as string[],
    nextReplacementStage: 0,
    replacementPlayerOrder: replacementPlayerOrderForEvent(event, options),
  }));
  const committedWithoutBatch: {
    readonly event: ProposedEvent;
    readonly eventId: CommittedEvent["eventId"];
    readonly replacementIds: readonly string[];
    readonly context: FabCommittedEventContext;
    /** Defined means the reducer owns narration for this event, even when empty. */
    readonly playerLogFacts: readonly FabPlayerLogFact[] | undefined;
  }[] = [];
  const appliedMultiEventReplacementKeys = new Set<string>();
  const cancelledEvents: FabCancelledProposedEvent[] = [];
  const playerLogTimeline: (
    | { readonly kind: "committed"; readonly committedIndex: number }
    | { readonly kind: "replaced"; readonly facts: readonly FabPlayerLogFact[] }
  )[] = [];
  let events: CommittedEvent[] = [];
  const eventQueueGuard = createFabLoopGuard({
    label: "transaction-kernel: event queue",
    limit: maxIterations,
  });
  while (queue.length > 0) {
    eventQueueGuard.tick();

    const queued = queue.shift()!;
    // A combat hit is derived from the finalized damage event, not the
    // pre-prevention attack-power calculation (CR 7.5.5b). Damage replacement
    // follow-ups have already updated the target-scoped combat outcome before
    // this queued hit reaches the transaction boundary. Finalize it before
    // replacement applicability is evaluated so reducers, replacements,
    // triggers, journals, and snapshots all observe one canonical value.
    let event: ProposedEvent | null = finalizeDerivedEvent(draft as FabReducerDraft, queued.event);
    const replacementIds: string[] = [...queued.inheritedReplacementIds];
    const appliedOriginalEventReplacementIds = new Set(queued.appliedOriginalEventReplacementIds);
    let suspendedForSubEvents = false;
    const orderedStages = orderedReplacementStages(
      options.replacements ?? [],
      queued.replacementPlayerOrder,
    );
    for (
      let stageIndex = queued.nextReplacementStage;
      stageIndex < orderedStages.length;
      stageIndex += 1
    ) {
      const stage = orderedStages[stageIndex]!;
      // CR 6.4.2a/6.4.4/6.4.6: after every replacement, start the current
      // kind stage again and determine applicability against the modified
      // event. A candidate that was inactive before the modification may now
      // become active; one made inactive is skipped.
      const replacementStageGuard = createFabLoopGuard({
        label: "transaction-kernel: replacement stage",
        limit: maxIterations,
      });
      while (event !== null) {
        replacementStageGuard.tick();
        const applicable = stage.filter(
          (candidate) =>
            !replacementAlreadyApplied(
              candidate,
              appliedOriginalEventReplacementIds,
              appliedMultiEventReplacementKeys,
            ) && candidate.applies(draft as FabReducerDraft, event!),
        );
        const replacement = selectActiveReplacement(event, applicable, options);
        if (!replacement) break;
        if (options.mayApplyReplacement && !options.mayApplyReplacement(event, replacement)) {
          markReplacementApplied(
            replacement,
            appliedOriginalEventReplacementIds,
            appliedMultiEventReplacementKeys,
          );
          continue;
        }
        const result = replacement.replace(draft as FabReducerDraft, event);
        markReplacementApplied(
          replacement,
          appliedOriginalEventReplacementIds,
          appliedMultiEventReplacementKeys,
        );
        replacementIds.push(replacement.replacementId);
        if (result.continuationEvents?.length) {
          queue.unshift(
            ...result.continuationEvents.map((continuationEvent) => ({
              event: continuationEvent,
              inheritedReplacementIds: [...replacementIds],
              appliedOriginalEventReplacementIds: [...new Set(replacementIds)],
              nextReplacementStage: stageIndex,
              replacementPlayerOrder: queued.replacementPlayerOrder,
            })),
          );
        }
        if (result.event === null) {
          cancelledEvents.push({ event: queued.event, replacementIds: [...replacementIds] });
          const replacementFacts = playerLogFactsForReplacedEvent(
            queued.event,
            result.subEvents ?? [],
          );
          if (replacementFacts.length > 0) {
            playerLogTimeline.push({ kind: "replaced", facts: replacementFacts });
          }
          if (result.subEvents?.length) {
            queue.unshift(
              ...result.subEvents.map((subEvent) => ({
                event: subEvent,
                inheritedReplacementIds: [...replacementIds],
                appliedOriginalEventReplacementIds: [] as string[],
                nextReplacementStage: 0,
                replacementPlayerOrder: replacementPlayerOrderForEvent(subEvent, options),
              })),
            );
            suspendedForSubEvents = true;
          }
          event = null;
          break;
        }
        event = result.event;
        if (result.subEvents?.length) {
          const replacementQueue = result.subEvents.map((subEvent) => ({
            event: subEvent,
            inheritedReplacementIds: [...replacementIds],
            appliedOriginalEventReplacementIds: [] as string[],
            nextReplacementStage: 0,
            replacementPlayerOrder: replacementPlayerOrderForEvent(subEvent, options),
          }));
          replacementQueue.push({
            event,
            inheritedReplacementIds: [...replacementIds],
            appliedOriginalEventReplacementIds: [...appliedOriginalEventReplacementIds],
            nextReplacementStage: stageIndex,
            replacementPlayerOrder: queued.replacementPlayerOrder,
          });
          queue.unshift(...replacementQueue);
          suspendedForSubEvents = true;
          break;
        }
      }
      if (event === null || suspendedForSubEvents) break;
    }
    if (suspendedForSubEvents) continue;
    if (!event) continue;

    const committedContext = committedEventContext(draft);
    const prepared = prepareFabStateWithResult(currentFabState(draft), (candidate) =>
      reducer(candidate, event),
    );
    if (prepared.result === null) continue;
    const reduction: FabEventReduction = {
      state: prepared.state,
      ...(prepared.result.followUpEvents ? { followUpEvents: prepared.result.followUpEvents } : {}),
      ...(prepared.result.playerLogFacts ? { playerLogFacts: prepared.result.playerLogFacts } : {}),
    };
    applyPreparedFabState(draft, prepared.patches);
    draft.counters.event += 1;
    const committedIndex = committedWithoutBatch.length;
    committedWithoutBatch.push({
      event,
      eventId: `event-${draft.counters.event}`,
      replacementIds,
      context: committedContext,
      playerLogFacts: reduction.playerLogFacts,
    });
    playerLogTimeline.push({ kind: "committed", committedIndex });
    if (reduction.followUpEvents?.length) {
      queue.unshift(
        ...reduction.followUpEvents.map((followUpEvent) => ({
          event: followUpEvent,
          inheritedReplacementIds: [],
          appliedOriginalEventReplacementIds: [] as string[],
          nextReplacementStage: 0,
          replacementPlayerOrder: replacementPlayerOrderForEvent(followUpEvent, options),
        })),
      );
    }
  }

  if (committedWithoutBatch.length === 0) {
    return {
      batch: null,
      cancelledEvents,
      events,
      playerLogFacts: playerLogTimeline.flatMap((item) =>
        item.kind === "replaced" ? item.facts : [],
      ),
    };
  }

  draft.counters.batch += 1;
  const batchId: FabEventBatchId = `batch-${draft.counters.batch}`;
  const batchSize = committedWithoutBatch.length;
  const multiOccurrences = new Map<string, typeof committedWithoutBatch>();
  for (const committed of committedWithoutBatch) {
    const occurrenceId = committed.event.multiEvent?.occurrenceId;
    if (!occurrenceId) continue;
    const members = multiOccurrences.get(occurrenceId) ?? [];
    members.push(committed);
    multiOccurrences.set(occurrenceId, members);
  }
  events = committedWithoutBatch.map((committed, batchIndex) =>
    createCommittedEvent(
      committed.event,
      committed.eventId,
      batchId,
      batchIndex,
      batchSize,
      committed.replacementIds,
      draft.turnNumber,
      committed.context,
      committed.event.multiEvent
        ? {
            occurrenceId: committed.event.multiEvent.occurrenceId,
            kind: "multi",
            index: multiOccurrences
              .get(committed.event.multiEvent.occurrenceId)!
              .indexOf(committed),
            size: multiOccurrences.get(committed.event.multiEvent.occurrenceId)!.length,
            namedEvent: committed.event.multiEvent.namedEvent,
          }
        : {
            occurrenceId: `occurrence-${committed.eventId}`,
            kind: "single",
            index: 0,
            size: 1,
            namedEvent: null,
          },
    ),
  );
  const fallbackContext: FabLogContext = {
    displayNameForInstanceId: (instanceId) => {
      const record = draft.objects[instanceId];
      if (!record) return null;
      return (
        draft.cardDefinitions[record.canonicalId]?.base.names.join(" // ") || record.canonicalId
      );
    },
    publicDisplayNameForInstanceId: (instanceId) => {
      const record = draft.objects[instanceId];
      if (
        !record ||
        record.visibility !== "public" ||
        record.markers.some((marker) => marker.kind === "face-down")
      )
        return null;
      return (
        draft.cardDefinitions[record.canonicalId]?.base.names.join(" // ") || record.canonicalId
      );
    },
    opponentIdForPlayerId: (playerId) =>
      draft.playerIds.find((candidate) => candidate !== playerId) ?? null,
  };
  const playerLogFacts = playerLogTimeline.flatMap((item) => {
    if (item.kind === "replaced") return item.facts;
    const committed = committedWithoutBatch[item.committedIndex]!;
    if (committed.playerLogFacts !== undefined) return committed.playerLogFacts;
    return fabLogFactsForEvent(events[item.committedIndex]!, fallbackContext)
      .filter(shouldMigrateLegacyPlayerLogFact)
      .map((message): FabPlayerLogFact => ({ kind: "localized-message", message }));
  });
  for (const event of events) recordBoundedRulesFacts(draft as FabReducerDraft, event);
  return {
    batch: { batchId: events[0]!.batchId, processId: events[0]!.processId, events },
    cancelledEvents,
    events,
    playerLogFacts,
  };
}

function selectActiveReplacement(
  event: ProposedEvent,
  candidates: readonly FabReplacementEffect[],
  options: Omit<FabCommitOptions, "onCommittedEvents" | "onPlayerLogFacts" | "onCommittedReceipt">,
): FabReplacementEffect | null {
  if (candidates.length === 0) return null;
  if (!options.selectReplacement) return candidates[0]!;
  const replacementId = options.selectReplacement(event, candidates);
  const selected = candidates.find((candidate) => candidate.replacementId === replacementId);
  if (!selected) {
    throw new Error(`FAB replacement selector chose inactive candidate ${replacementId}.`);
  }
  return selected;
}

function finalizeDerivedEvent(state: FabReducerDraft, event: ProposedEvent): ProposedEvent {
  if (event.name !== "hit") return event;
  const link = state.combat?.activeLink;
  if (!link || link.activeAttack.sourceObjectId !== event.data.object.instanceId) return event;
  const targetRef =
    "ref" in event.data.target
      ? {
          kind: "object" as const,
          ref: event.data.target.ref,
          controllerIdAtDeclaration: fabPlayerId(
            event.data.target.controllerId ?? event.data.target.ownerId,
          ),
        }
      : { kind: "hero" as const, playerId: fabPlayerId(event.data.target.playerId) };
  return {
    ...event,
    data: {
      ...event.data,
      damage: fabCombatDamageForTarget(link, targetRef),
    },
  };
}

const REPLACEMENT_STAGE: Readonly<Record<FabReplacementEffect["replacementKind"], number>> = {
  "self-or-identity": 2,
  standard: 3,
  prevention: 4,
  outcome: 6,
};

/**
 * CR 6.5.3-6.5.7 fixes kind stages. A player's ordering may only affect
 * candidates within a stage, so preserve that relative order while making a
 * cross-stage permutation impossible at the kernel boundary.
 */
function orderedReplacementStages(
  replacements: readonly FabReplacementEffect[],
  playerOrder: readonly string[],
): readonly (readonly FabReplacementEffect[])[] {
  const playerIndex = new Map(playerOrder.map((playerId, index) => [playerId, index]));
  return [2, 3, 4, 6].map((stage) =>
    replacements
      .map((replacement, index) => ({ replacement, index }))
      .filter(({ replacement }) => REPLACEMENT_STAGE[replacement.replacementKind] === stage)
      .sort(
        (left, right) =>
          (playerIndex.get(left.replacement.controllerId) ?? Number.MAX_SAFE_INTEGER) -
            (playerIndex.get(right.replacement.controllerId) ?? Number.MAX_SAFE_INTEGER) ||
          left.index - right.index,
      )
      .map(({ replacement }) => replacement),
  );
}

function replacementPlayerOrderForEvent(
  event: ProposedEvent,
  options: Omit<FabCommitOptions, "onCommittedEvents" | "onPlayerLogFacts" | "onCommittedReceipt">,
): readonly string[] {
  const controllerIds = [
    ...new Set((options.replacements ?? []).map((replacement) => replacement.controllerId)),
  ];
  if (controllerIds.length <= 1) return controllerIds;
  const order = options.replacementPlayerOrder?.(event, controllerIds);
  if (
    !order ||
    order.length !== controllerIds.length ||
    new Set(order).size !== order.length ||
    !order.every((playerId) => controllerIds.includes(playerId))
  ) {
    throw new Error(
      "FAB replacement commit requires one persisted CR 6.5.2 player order for each multi-controller original event.",
    );
  }
  return [...order];
}

function replacementAlreadyApplied(
  replacement: FabReplacementEffect,
  appliedOriginalEventReplacementIds: ReadonlySet<string>,
  appliedMultiEventReplacementKeys: ReadonlySet<string>,
): boolean {
  // CR 8.5.33b: unlimited scope (ignore) never marks as applied — it cancels
  // every matching sibling event, not just the first.
  if (replacement.applicationScope.kind === "unlimited") return false;
  return replacement.applicationScope.kind === "original-event"
    ? appliedOriginalEventReplacementIds.has(replacement.replacementId)
    : appliedMultiEventReplacementKeys.has(
        `${replacement.applicationScope.scopeId}:${replacement.replacementId}`,
      );
}

function markReplacementApplied(
  replacement: FabReplacementEffect,
  appliedOriginalEventReplacementIds: Set<string>,
  appliedMultiEventReplacementKeys: Set<string>,
): void {
  if (replacement.applicationScope.kind === "unlimited") return;
  if (replacement.applicationScope.kind === "original-event") {
    appliedOriginalEventReplacementIds.add(replacement.replacementId);
    return;
  }
  appliedMultiEventReplacementKeys.add(
    `${replacement.applicationScope.scopeId}:${replacement.replacementId}`,
  );
}

/** Fallback resolution for the kernel receipt path, which has no state access. */
const FAB_LOG_KERNEL_CONTEXT: FabLogContext = {
  displayNameForInstanceId: () => null,
};

/** Convert newly committed events into player-visible records for the caller's receipt. */
export function playerLogsForCommittedEvents(
  events: readonly CommittedEvent[],
  context: FabLogContext = FAB_LOG_KERNEL_CONTEXT,
): readonly FabLogEntry[] {
  // The receipt is a flat public journal: private appendices exist only on the
  // canonical move logs (semanticMoveLogs), never here.
  return events.flatMap((event) =>
    fabLogFactsForEvent(event, context)
      .filter((fact) => fact.visibleTo === undefined)
      .map((fact) => ({
        turnNumber: event.turnNumber,
        actorId: event.actorId ?? event.controllerId ?? "",
        move: event.name,
        message: renderFabLogTemplate(fact.key, fact.values),
        timestamp: numericEventId(event.eventId),
      })),
  );
}

/** Persist only finite, rule-observable facts from a committed event. */
function recordBoundedRulesFacts(state: FabReducerDraft, event: CommittedEvent): void {
  switch (event.name) {
    case "play": {
      const player = state.players[event.data.actorId];
      const link = state.combat?.activeLink;
      if (!player) return;
      const scrappedCard = event.bindings.scrappedCard;
      if (scrappedCard && typeof scrappedCard === "object" && "instanceId" in scrappedCard) {
        const played = state.objects[event.data.object.instanceId];
        if (played) {
          state.objects[event.data.object.instanceId] = {
            ...played,
            declarationFacts: [
              ...(played.declarationFacts ?? []).filter((fact) => fact.kind !== "scrap"),
              {
                kind: "scrap",
                scrappedCanonicalId: scrappedCard.canonicalId ?? null,
                scrappedNames: scrappedCard.current.names,
              },
            ],
          };
        }
      }
      if (event.data.object.base.color === "blue") player.history.turn.blueCardsPlayed += 1;
      if (event.data.object.base.color === "red") player.history.turn.redCardsPlayed += 1;
      if (historyTokenKindFromCanonicalId(event.data.object.canonicalId) === "seismic-surge")
        player.history.turn.controlledSeismicSurge = true;
      if (event.data.role === "action") player.history.turn.nonAttackActionsPlayed += 1;
      if (event.data.role === "attack") player.history.turn.attackActionsPlayed += 1;
      if (event.data.from === "banished") player.history.turn.playedFromBanished = true;
      if (event.data.object.current.typeBox.supertypes.includes("Draconic"))
        player.history.turn.playedDraconicCardThisTurn = true;
      if (
        event.data.object.current.typeBox.types.includes("Action") ||
        event.data.role === "action" ||
        event.data.role === "attack"
      ) {
        player.history.turn.lastActionCardPlayedSupertypes =
          event.data.object.current.typeBox.supertypes;
        player.history.turn.actionCardPlaysThisTurn = [
          ...player.history.turn.actionCardPlaysThisTurn,
          {
            instanceId: event.data.object.instanceId,
            supertypes: event.data.object.current.typeBox.supertypes,
            types: event.data.object.current.typeBox.types,
            subtypes: event.data.object.current.typeBox.subtypes,
          },
        ];
      }
      player.history.turn.playedCardNames.push(...event.data.object.current.names);
      player.history.turn.playedOrActivatedThisTurn = true;
      if (event.data.object.current.typeBox.subtypes.includes("Aura"))
        player.history.turn.playedOrCreatedAura = true;
      if (
        link &&
        event.data.actorId === link.attackingPlayerId &&
        event.data.role === "attack-reaction"
      )
        link.attackingPlayerPlayedOrActivatedInReaction = true;
      if (
        link &&
        (event.data.role === "attack-reaction" || event.data.role === "defense-reaction")
      ) {
        (link.reactionInstanceIds ??= []).push(fabObjectInstanceId(event.data.object.instanceId));
        if (event.data.role === "attack-reaction") {
          link.attackReactionPlayedOrActivated = true;
          link.attackReactionCount = (link.attackReactionCount ?? 0) + 1;
        }
      }
      return;
    }
    case "activate": {
      const link = state.combat?.activeLink;
      if (
        link &&
        event.data.actorId === link.attackingPlayerId &&
        event.data.ability?.abilityType === "attack-reaction"
      )
        link.attackingPlayerPlayedOrActivatedInReaction = true;
      if (link && event.data.ability?.abilityType === "attack-reaction") {
        link.attackReactionPlayedOrActivated = true;
        link.attackReactionCount = (link.attackReactionCount ?? 0) + 1;
      }
      const player = state.players[event.data.actorId];
      if (player) player.history.turn.playedOrActivatedThisTurn = true;
      if (player && historyTokenKindOf(event.source) === "gate-to-i-arathael") {
        player.history.turn.createdOrActivatedGateToIArathael = true;
      }
      const activatedBox = event.data.object.current.typeBox;
      if (player && activatedBox.subtypes.includes("Cannon")) {
        player.history.turn.activatedCannonThisTurn = true;
      }
      if (player && activatedBox.types.includes("Weapon")) {
        player.history.turn.activatedWeaponThisTurn = true;
      }
      if (player) {
        player.history.turn.actionActivationsThisTurn = [
          ...player.history.turn.actionActivationsThisTurn,
          {
            instanceId: event.data.object.instanceId,
            abilityType: event.data.ability.abilityType,
            supertypes: [...activatedBox.supertypes],
            types: [...activatedBox.types],
            subtypes: [...activatedBox.subtypes],
          },
        ];
      }
      return;
    }
    case "roll": {
      const player = state.players[event.data.playerId];
      if (player) {
        player.history.turn.highestDieRoll = Math.max(
          player.history.turn.highestDieRoll,
          event.data.result,
        );
      }
      return;
    }
    case "lose-life":
      state.players[event.data.playerId]!.history.turn.lostLife = true;
      return;
    case "deal-damage":
    case "dealt-damage": {
      if (event.data.amount <= 0) return;
      const target = event.data.target;
      // CR 8.2.8f: damage to an ally is not hero life loss. Only hero-seat
      // damage marks the seated player's lostLife history.
      if (!("kind" in target) || target.kind !== "hero") return;
      if (state.players[target.playerId])
        state.players[target.playerId]!.history.turn.lostLife = true;
      return;
    }
    case "create": {
      const player = state.players[event.data.object.ownerId];
      const controller = state.players[event.data.playerId];
      if (!player) return;
      player.history.turn.createdCardThisTurn = true;
      const kind = historyTokenKindOf(event.data.object);
      switch (kind) {
        case "toughness":
          if (controller) controller.history.turn.controlledToughnessThisTurn = true;
          return;
        case "vigor":
          if (controller) controller.history.turn.controlledVigorThisTurn = true;
          return;
        case "might":
          if (controller) controller.history.turn.controlledMightThisTurn = true;
          return;
        case "seismic-surge":
          player.history.turn.createdSeismicSurge = true;
          if (controller) controller.history.turn.controlledSeismicSurge = true;
          return;
        case "gold":
          player.history.turn.createdOrStolenGold = true;
          return;
        case "runechant":
          player.history.turn.runechantsCreated += 1;
          return;
        case "fealty":
          player.history.turn.createdFealtyTokenThisTurn = true;
          return;
        case "crouching-tiger":
          player.history.turn.createdCrouchingTigerThisTurn = true;
          return;
        case "gate-to-i-arathael":
          player.history.turn.createdOrActivatedGateToIArathael = true;
          return;
        case null:
          return;
        default: {
          const _exhaustive: never = kind;
          return _exhaustive;
        }
      }
    }
    case "destroy": {
      const object = event.data.object;
      const tokenControllerId = object.controllerId ?? object.ownerId;
      const tokenKind = historyTokenKindFromCanonicalId(object.canonicalId);
      if (tokenControllerId && state.players[tokenControllerId]) {
        if (tokenKind === "vigor")
          state.players[tokenControllerId]!.history.turn.controlledVigorThisTurn = true;
        if (tokenKind === "might")
          state.players[tokenControllerId]!.history.turn.controlledMightThisTurn = true;
      }
      const player = event.controllerId ? state.players[event.controllerId] : undefined;
      const canonicalId = object.canonicalId ?? "";
      const names =
        object.current.names.length > 0
          ? object.current.names
          : object.base.names.length > 0
            ? object.base.names
            : [canonicalId.replace(/^token:/, "")];
      if (player) {
        player.history.turn.semanticObservations.push({
          kind: "destroy",
          canonicalId: object.canonicalId ?? null,
          names,
          supertypes: object.current.typeBox.supertypes,
          sourceInstanceId: event.source?.instanceId ?? null,
        });
      }
      if (player && names.length > 0 && object.objectKind === "created-token") {
        for (const name of names) {
          const normalized = name.toLowerCase();
          if (!player.history.turn.destroyedTokenNames.includes(normalized))
            player.history.turn.destroyedTokenNames.push(normalized);
        }
      }
      const typeBox = object.current.typeBox ?? object.base.typeBox;
      const isAura = Boolean(
        typeBox &&
        ((typeBox.types as readonly string[]).includes("Aura") ||
          (typeBox.subtypes as readonly string[]).includes("Aura")),
      );
      const auraControllerId = object.controllerId ?? event.controllerId;
      if (isAura && auraControllerId && state.players[auraControllerId]) {
        state.players[auraControllerId]!.history.turn.destroyedAuraThisTurn = true;
      }
      const isItem = Boolean(
        typeBox &&
        ((typeBox.types as readonly string[]).includes("Item") ||
          (typeBox.subtypes as readonly string[]).includes("Item")),
      );
      const itemControllerId = object.controllerId ?? object.ownerId;
      if (isItem && itemControllerId && state.players[itemControllerId]) {
        state.players[itemControllerId]!.history.turn.destroyedItem = true;
      }
      const sourceKeywords = event.source?.current.keywords ?? [];
      const destroyedByPhantasm = sourceKeywords.some((keyword) => keyword.name === "phantasm");
      const destroyedBox = object.current.typeBox ?? object.base.typeBox;
      const isIllusionistAac = Boolean(
        destroyedBox &&
        (destroyedBox.types as readonly string[]).includes("Action") &&
        (destroyedBox.subtypes as readonly string[]).includes("Attack") &&
        ((destroyedBox.types as readonly string[]).includes("Illusionist") ||
          (destroyedBox.supertypes as readonly string[]).includes("Illusionist")),
      );
      const destroyedControllerId = object.controllerId ?? object.ownerId;
      if (
        destroyedByPhantasm &&
        isIllusionistAac &&
        destroyedControllerId &&
        state.players[destroyedControllerId]
      ) {
        state.players[
          destroyedControllerId
        ]!.history.turn.phantasmDestroyedIllusionistAttackActionThisTurn = true;
      }
      return;
    }
    case "banish": {
      const actor = event.controllerId ? state.players[event.controllerId] : undefined;
      const sourceId = event.source?.instanceId;
      const color = (
        event.data.object.current.color ??
        event.data.object.base.color ??
        ""
      ).toLowerCase();
      if (actor && sourceId && color) {
        const bag = {
          ...actor.history.turn.banishedColorsBySourceThisTurn,
        };
        bag[sourceId] = [...(bag[sourceId] ?? []), color];
        actor.history.turn.banishedColorsBySourceThisTurn = bag;
      }
      if (actor) {
        actor.history.turn.semanticObservations.push({
          kind: "banish",
          canonicalId: event.data.object.canonicalId ?? null,
          names: event.data.object.current.names,
          supertypes: event.data.object.current.typeBox.supertypes,
          sourceInstanceId: sourceId ?? null,
        });
      }
      return;
    }
    case "discard": {
      const discardedPlayer = state.players[event.data.playerId];
      if (isBlueCard(event.data.object) && discardedPlayer) {
        discardedPlayer.history.turn.bluePutIntoGraveyard = true;
      }
      const discardedPower =
        event.data.object.current.numeric?.power ?? event.data.object.base.numeric?.power;
      if (
        discardedPlayer &&
        typeof discardedPower === "number" &&
        discardedPower >= 6 &&
        event.cause.kind === "player-command"
      ) {
        discardedPlayer.history.turn.discardedPower6AsAdditionalCost = true;
      }
      return;
    }
    case "put-into-graveyard":
    case "dies":
    case "move-zone": {
      if (event.data.to === "graveyard" && isBlueCard(event.data.object)) {
        const ownerId =
          event.data.destinationPlayerId ??
          event.data.object.ownerId ??
          event.data.object.controllerId ??
          null;
        if (ownerId) {
          if (state.players[ownerId]?.history.turn) {
            state.players[ownerId]!.history.turn.bluePutIntoGraveyard = true;
          }
        }
      }
      if (
        event.name === "move-zone" &&
        event.data.destinationPlayerId &&
        historyTokenKindFromIdentity(event.data.object) === "gold"
      ) {
        if (state.players[event.data.destinationPlayerId]?.history.turn) {
          state.players[event.data.destinationPlayerId]!.history.turn.createdOrStolenGold = true;
        }
      }
      return;
    }
    case "equip": {
      if (historyTokenKindFromCanonicalId(event.data.object.canonicalId) === "seismic-surge") {
        if (state.players[event.data.playerId]?.history.turn) {
          state.players[event.data.playerId]!.history.turn.controlledSeismicSurge = true;
        }
      }
      return;
    }
    case "leave-arena": {
      const object = event.data.object;
      const player = state.players[object.controllerId ?? object.ownerId];
      if (!player) return;
      const leavingKind = historyTokenKindFromCanonicalId(object.canonicalId);
      if (leavingKind === "vigor") player.history.turn.controlledVigorThisTurn = true;
      if (leavingKind === "might") player.history.turn.controlledMightThisTurn = true;
      const typeBox = object.current.typeBox ?? object.base.typeBox;
      player.history.turn.leftArena.push({
        controllerId: player.playerId,
        names: object.current.names.length > 0 ? object.current.names : object.base.names,
        metatypes: [...typeBox.metatypes],
        types: [...typeBox.types],
      });
      return;
    }
    case "go-again":
    case "gain-keyword": {
      if (event.name === "gain-keyword" && event.data.keyword !== "go-again") return;
      const player = event.controllerId ? state.players[event.controllerId] : undefined;
      const subject = event.name === "gain-keyword" ? event.data.object : event.source;
      if (player && subject?.current.typeBox.types.includes("Weapon")) {
        const id = subject.instanceId;
        if (!player.history.turn.weaponInstancesGainedGoAgain.includes(id))
          player.history.turn.weaponInstancesGainedGoAgain.push(id);
      }
      return;
    }
    default:
      return;
  }
}

function isBlueCard(object: {
  readonly base: { readonly color?: string | null };
  readonly current: { readonly color?: string | null };
}): boolean {
  return (object.current.color ?? object.base.color)?.toLowerCase() === "blue";
}

function numericEventId(eventId: CommittedEvent["eventId"]): number {
  return Number(eventId.slice("event-".length));
}

interface FabCommittedEventMetadata {
  readonly eventId: CommittedEvent["eventId"];
  readonly batchId: FabEventBatchId;
  readonly batchIndex: number;
  readonly batchSize: number;
  readonly replacementIds: readonly string[];
  readonly turnNumber: number;
  readonly context: FabCommittedEventContext;
  readonly occurrence: FabEventOccurrence;
  readonly actorId: string | null;
}

function createCommittedEvent<Event extends ProposedEvent>(
  event: Event,
  eventId: CommittedEvent["eventId"],
  batchId: FabEventBatchId,
  batchIndex: number,
  batchSize: number,
  replacementIds: readonly string[],
  turnNumber: number,
  context: FabCommittedEventContext,
  occurrence: FabEventOccurrence,
): Event & FabCommittedEventMetadata {
  return {
    ...event,
    eventId,
    batchId,
    batchIndex,
    batchSize,
    replacementIds,
    turnNumber,
    context,
    occurrence,
    actorId: committedActorId(event),
  };
}

/**
 * Proposal-boundary normalization for the remaining event producers that
 * carry their actor in a typed payload. The committed event is always
 * explicit; the trigger matcher never guesses from causes or controllers.
 */
function committedActorId(event: ProposedEvent): string | null {
  // Creating an object is performed by its creator, even when another player
  // controls the originating effect. baseEvent carries that effect controller.
  if (event.name === "create") return event.data.object.ownerId;
  if (event.actorId !== undefined) return event.actorId;
  if (event.name === "reaction-step" || event.name === "combat-chain-close") return null;
  const data = event.data as { readonly actorId?: unknown; readonly playerId?: unknown };
  if (typeof data.actorId === "string") return data.actorId;
  if (typeof data.playerId === "string") return data.playerId;
  if (event.cause.kind === "player-command") return event.cause.actorId;
  return event.controllerId;
}

function committedEventContext(state: FabMatchState): FabCommittedEventContext {
  return {
    turnPlayerId: state.activePlayerId,
    phase: state.phase,
    combatStep: state.combat?.step ?? null,
    turnNumber: state.turnNumber,
    combatNumber: state.players[state.activePlayerId]?.history.combatChain.combatNumber ?? null,
    chainLinkNumber: state.combat?.chainLinkNumber ?? null,
  };
}
