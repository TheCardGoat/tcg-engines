import { declareGrandArchiveResolutionChoice } from "../../activation/activation.ts";
import type {
  GrandArchiveCommandFailure,
  GrandArchiveCommandSuccess,
  GrandArchiveCommandTransition,
} from "../../../kernel/command-results.ts";
import type { GrandArchiveCommandFor } from "../../../commands/command-router.ts";
import type { GrandArchiveCommandHandlerContext } from "../../../commands/handler-context.ts";
import type {
  GrandArchiveCommittedEvent,
  GrandArchiveProposedEvent,
} from "../../../kernel/events.ts";
import {
  grandArchiveCounterKey,
  resolveGrandArchiveSubjectObjects,
  GrandArchiveUnsupportedRuleError,
} from "../../effects/evaluation.ts";
import { grandArchiveObjectId } from "../../../game/identity.ts";
import type { GrandArchiveObjectId, GrandArchivePlayerId } from "../../../game/identity.ts";
import { resumeGrandArchiveEffectResolution } from "../../effects/stack-resolution.ts";
import type { GrandArchiveDecisionFor, GrandArchiveDecisionResolver } from "../types.ts";

class GrandArchiveAllocationDecisionHandler {
  public constructor(private readonly context: GrandArchiveCommandHandlerContext) {}

  get #program() {
    return this.context.getProgram();
  }

  get #state() {
    return this.context.getState();
  }

  set #state(state: ReturnType<GrandArchiveCommandHandlerContext["getState"]>) {
    this.context.replaceState(state);
  }

  get #kernel() {
    return this.context.getKernel();
  }

  #stabilize(
    committed: GrandArchiveCommittedEvent[],
    initialTriggerEvents: readonly GrandArchiveCommittedEvent[] = committed,
  ): GrandArchiveCommandSuccess {
    return this.context.stabilize(committed, initialTriggerEvents);
  }

  #failure(code: GrandArchiveCommandFailure["code"], message: string): GrandArchiveCommandFailure {
    return this.context.failure(code, message);
  }

  #activationFailure(error: unknown): GrandArchiveCommandFailure {
    if (error instanceof GrandArchiveUnsupportedRuleError) {
      return this.#failure("not-implemented", error.message);
    }
    if (error instanceof Error) return this.#failure("illegal-command", error.message);
    throw error;
  }

  public resolveDistribution(
    decision: GrandArchiveDecisionFor<"resolve-distribution">,
    command: GrandArchiveCommandFor<"answer-decision">,
    playerId: GrandArchivePlayerId,
  ): GrandArchiveCommandTransition {
    const resolution = this.#state.resolution;
    if (!resolution || resolution.stackItemId !== decision.stackItemId) {
      return this.#failure("illegal-command", "Effect resolution is no longer suspended");
    }
    const pending = resolution.pendingDistribution;
    if (
      !pending ||
      pending.playerId !== decision.playerId ||
      pending.amount !== decision.amount ||
      pending.among.id !== decision.among.id
    ) {
      return this.#failure("illegal-command", "Distribution is no longer pending");
    }
    const answer = command.answer;
    if (
      typeof answer !== "object" ||
      answer === null ||
      Array.isArray(answer) ||
      Object.keys(answer).some((key) => key !== "allocations") ||
      !("allocations" in answer) ||
      !Array.isArray(answer.allocations)
    ) {
      return this.#failure("illegal-command", "Distribution answer is malformed");
    }
    const allocations: { readonly objectId: GrandArchiveObjectId; readonly amount: number }[] = [];
    for (const entry of answer.allocations) {
      if (
        typeof entry !== "object" ||
        entry === null ||
        Array.isArray(entry) ||
        Object.keys(entry).some((key) => key !== "objectId" && key !== "amount") ||
        !("objectId" in entry) ||
        !("amount" in entry) ||
        typeof entry.objectId !== "string" ||
        typeof entry.amount !== "number" ||
        !Number.isSafeInteger(entry.amount) ||
        entry.amount <= 0
      ) {
        return this.#failure("illegal-command", "Distribution allocation is malformed");
      }
      allocations.push({
        objectId: grandArchiveObjectId(entry.objectId),
        amount: entry.amount,
      });
    }
    if (new Set(allocations.map((allocation) => allocation.objectId)).size !== allocations.length) {
      return this.#failure("illegal-command", "A distribution recipient cannot appear twice");
    }
    if (
      allocations.reduce((total, allocation) => total + allocation.amount, 0) !== pending.amount
    ) {
      return this.#failure("illegal-command", "Distribution must allocate the exact amount");
    }
    const evaluation = {
      program: this.#program,
      state: this.#state,
      controllerId: resolution.controllerId,
      ...(resolution.sourceId
        ? {
            sourceId: resolution.sourceId,
            abilityBearerId: resolution.sourceId,
            sourceIdentityId: resolution.sourceId,
            ...(resolution.sourceIncarnation !== undefined
              ? { sourceIncarnation: resolution.sourceIncarnation }
              : {}),
          }
        : {}),
      ...(resolution.sourceLkiEventId ? { sourceLkiEventId: resolution.sourceLkiEventId } : {}),
      bindings: resolution.bindings,
      variables: resolution.variables,
      resolvingStackItemId: resolution.stackItemId,
      resolutionStartedEventHistoryIndex: resolution.startedEventHistoryIndex,
    };
    let recipients: import("../../effects/evaluation.ts").GrandArchiveExecutionBinding;
    try {
      recipients = declareGrandArchiveResolutionChoice(
        pending.among,
        allocations.map((allocation) => allocation.objectId),
        evaluation,
      );
    } catch (error) {
      return this.#activationFailure(error);
    }
    if (!Array.isArray(recipients)) {
      return this.#failure("illegal-command", "Distribution recipients must be objects");
    }
    const source =
      pending.payload.kind === "damage"
        ? pending.payload.source
          ? resolveGrandArchiveSubjectObjects(pending.payload.source, evaluation)[0]
          : resolution.sourceId
            ? resolveGrandArchiveSubjectObjects({ kind: "source" }, evaluation)[0]
            : undefined
        : undefined;
    const effectEvents: GrandArchiveProposedEvent[] = allocations.map((allocation) =>
      pending.payload.kind === "damage"
        ? {
            type: "damage-marked",
            objectId: allocation.objectId,
            amount: allocation.amount,
            ...(source ? { sourceId: source.id } : {}),
            ...(pending.payload.preventable === false ? { preventable: false as const } : {}),
            actorId: playerId,
            cause: { kind: "stack-item", stackItemId: decision.stackItemId },
          }
        : {
            type: "counter-changed",
            objectId: allocation.objectId,
            counter: grandArchiveCounterKey(pending.payload.counter),
            delta: allocation.amount,
            actorId: playerId,
            cause: { kind: "stack-item", stackItemId: decision.stackItemId },
          },
    );
    const original = this.#state;
    try {
      const { pendingDistribution: _pendingDistribution, ...baseResolution } = resolution;
      const resumed = {
        ...baseResolution,
        bindings: { ...resolution.bindings, [pending.among.id]: recipients },
      };
      const transaction = this.#kernel.transact(this.#state, [
        {
          type: "decision-cleared",
          decisionId: decision.id,
          actorId: playerId,
          cause: { kind: "command", move: "answer-decision" },
        },
        {
          type: "effect-resolution-suspended",
          resolution: resumed,
          cause: { kind: "stack-item", stackItemId: decision.stackItemId },
        },
        ...effectEvents,
      ]);
      this.#state = transaction.state;
      const events = [...transaction.result.events];
      if (this.#state.decision?.kind === "choose-replacement") {
        return { ok: true, state: this.#state, events };
      }
      const currentResolution = this.#state.resolution;
      if (!currentResolution) throw new Error("Distribution lost its resolution");
      const continuation = resumeGrandArchiveEffectResolution(
        this.#program,
        this.#state,
        this.#kernel,
        currentResolution,
      );
      this.#state = continuation.state;
      events.push(...continuation.events);
      if (continuation.paused) return { ok: true, state: this.#state, events };
      return this.#stabilize(events, continuation.triggerEvents);
    } catch (error) {
      this.#state = original;
      return this.#activationFailure(error);
    }
  }

  public resolveCounterAllocation(
    decision: GrandArchiveDecisionFor<"resolve-counter-allocation">,
    command: GrandArchiveCommandFor<"answer-decision">,
    playerId: GrandArchivePlayerId,
  ): GrandArchiveCommandTransition {
    const resolution = this.#state.resolution;
    if (!resolution || resolution.stackItemId !== decision.stackItemId) {
      return this.#failure("illegal-command", "Effect resolution is no longer suspended");
    }
    const pending = resolution.pendingCounterAllocation;
    if (
      !pending ||
      pending.playerId !== decision.playerId ||
      pending.counter !== decision.counter ||
      pending.operation.kind !== decision.operation
    ) {
      return this.#failure("illegal-command", "Counter allocation is no longer pending");
    }
    const answer = command.answer;
    if (
      typeof answer !== "object" ||
      answer === null ||
      Array.isArray(answer) ||
      Object.keys(answer).some((key) => key !== "allocations") ||
      !("allocations" in answer) ||
      !Array.isArray(answer.allocations)
    ) {
      return this.#failure("illegal-command", "Counter allocation answer is malformed");
    }
    const allocations: { readonly objectId: GrandArchiveObjectId; readonly amount: number }[] = [];
    for (const entry of answer.allocations) {
      if (
        typeof entry !== "object" ||
        entry === null ||
        Array.isArray(entry) ||
        Object.keys(entry).some((key) => key !== "objectId" && key !== "amount") ||
        !("objectId" in entry) ||
        !("amount" in entry) ||
        typeof entry.objectId !== "string" ||
        typeof entry.amount !== "number" ||
        !Number.isSafeInteger(entry.amount) ||
        entry.amount <= 0
      ) {
        return this.#failure("illegal-command", "Counter allocation entry is malformed");
      }
      allocations.push({
        objectId: grandArchiveObjectId(entry.objectId),
        amount: entry.amount,
      });
    }
    if (new Set(allocations.map((entry) => entry.objectId)).size !== allocations.length) {
      return this.#failure("illegal-command", "A counter source cannot appear twice");
    }
    const total = allocations.reduce((sum, entry) => sum + entry.amount, 0);
    if (total < pending.minimum || total > pending.maximum) {
      return this.#failure(
        "illegal-command",
        `Counter allocation must total between ${pending.minimum} and ${pending.maximum}`,
      );
    }
    const candidateAvailability = new Map(
      pending.candidates.map((candidate) => [candidate.objectId, candidate.available]),
    );
    for (const allocation of allocations) {
      const declaredAvailable = candidateAvailability.get(allocation.objectId);
      const object = this.#state.objects[allocation.objectId];
      const currentAvailable =
        pending.counter === "damage" ? object?.damage : object?.counters[pending.counter];
      if (
        declaredAvailable === undefined ||
        !object ||
        allocation.amount > declaredAvailable ||
        allocation.amount > (currentAvailable ?? 0)
      ) {
        return this.#failure(
          "illegal-command",
          "A counter allocation exceeds its source's available counters",
        );
      }
    }
    const destination =
      pending.operation.kind === "move"
        ? this.#state.objects[pending.operation.destinationId]
        : undefined;
    if (pending.operation.kind === "move" && !destination) {
      return this.#failure("illegal-command", "The counter destination no longer exists");
    }
    const effectEvents: GrandArchiveProposedEvent[] = [
      ...allocations.map((allocation) => ({
        type: "counter-changed" as const,
        objectId: allocation.objectId,
        counter: pending.counter,
        delta: -allocation.amount,
        actorId: playerId,
        cause: { kind: "stack-item" as const, stackItemId: decision.stackItemId },
      })),
      ...(destination && total > 0
        ? [
            {
              type: "counter-changed" as const,
              objectId: destination.id,
              counter: pending.counter,
              delta: total,
              actorId: playerId,
              cause: { kind: "stack-item" as const, stackItemId: decision.stackItemId },
            },
          ]
        : []),
    ];
    const original = this.#state;
    try {
      const resultEventHistoryIndex = this.#state.eventHistory.length;
      const { pendingCounterAllocation: _pendingCounterAllocation, ...baseResolution } = resolution;
      const transaction = this.#kernel.transact(this.#state, [
        {
          type: "decision-cleared",
          decisionId: decision.id,
          actorId: playerId,
          cause: { kind: "command", move: "answer-decision" },
        },
        {
          type: "effect-resolution-suspended",
          resolution: baseResolution,
          cause: { kind: "stack-item", stackItemId: decision.stackItemId },
        },
        ...effectEvents,
      ]);
      this.#state = transaction.state;
      const events = [...transaction.result.events];
      if (this.#state.decision?.kind === "choose-replacement") {
        const currentResolution = this.#state.resolution;
        if (!currentResolution) throw new Error("Counter allocation lost its resolution");
        const suspended = this.#kernel.transact(this.#state, [
          {
            type: "effect-resolution-suspended",
            resolution: {
              ...currentResolution,
              pendingReplacement: {
                resultEventHistoryIndex,
                ...(pending.bindResultAs ? { counterRemovalBinding: pending.bindResultAs } : {}),
                resultMetric: "counters-removed",
              },
            },
            cause: { kind: "stack-item", stackItemId: decision.stackItemId },
          },
        ]);
        this.#state = suspended.state;
        events.push(...suspended.result.events);
        return { ok: true, state: this.#state, events };
      }
      const committedRemovals = transaction.result.events.filter(
        (
          event,
        ): event is Extract<GrandArchiveCommittedEvent, { readonly type: "counter-changed" }> =>
          event.type === "counter-changed" && event.delta < 0,
      );
      const removedAmount = committedRemovals.reduce((sum, event) => sum - event.delta, 0);
      const removedObjectIds = [...new Set(committedRemovals.map((event) => event.objectId))];
      const currentResolution = this.#state.resolution;
      if (!currentResolution) throw new Error("Counter allocation lost its resolution");
      const resumed = {
        ...currentResolution,
        bindings: {
          ...currentResolution.bindings,
          ...(pending.bindResultAs ? { [pending.bindResultAs]: removedObjectIds } : {}),
          "modifiedResult:counters-removed": removedAmount,
        },
      };
      const continuation = resumeGrandArchiveEffectResolution(
        this.#program,
        this.#state,
        this.#kernel,
        resumed,
      );
      this.#state = continuation.state;
      events.push(...continuation.events);
      if (continuation.paused) return { ok: true, state: this.#state, events };
      return this.#stabilize(events, continuation.triggerEvents);
    } catch (error) {
      this.#state = original;
      return this.#activationFailure(error);
    }
  }

  public resolveMovePartition(
    decision: GrandArchiveDecisionFor<"resolve-move-partition">,
    command: GrandArchiveCommandFor<"answer-decision">,
    playerId: GrandArchivePlayerId,
  ): GrandArchiveCommandTransition {
    const resolution = this.#state.resolution;
    if (!resolution || resolution.stackItemId !== decision.stackItemId) {
      return this.#failure("illegal-command", "Effect resolution is no longer suspended");
    }
    const pending = resolution.pendingMovePartition;
    if (
      !pending ||
      pending.playerId !== decision.playerId ||
      pending.objectIds.length !== decision.objectIds.length
    ) {
      return this.#failure("illegal-command", "Move partition is no longer pending");
    }
    const answer = command.answer;
    if (
      typeof answer !== "object" ||
      answer === null ||
      Array.isArray(answer) ||
      Object.keys(answer).some((key) => key !== "partitions") ||
      !("partitions" in answer) ||
      !Array.isArray(answer.partitions) ||
      answer.partitions.length !== 2
    ) {
      return this.#failure("illegal-command", "Move partition answer is malformed");
    }
    const partitions: [GrandArchiveObjectId[], GrandArchiveObjectId[]] = [[], []];
    for (let index = 0; index < 2; index += 1) {
      const submittedPartition = answer.partitions[index];
      if (!Array.isArray(submittedPartition)) {
        return this.#failure("illegal-command", "Move partition answer is malformed");
      }
      for (const objectId of submittedPartition) {
        if (typeof objectId !== "string") {
          return this.#failure("illegal-command", "Move partition answer is malformed");
        }
        partitions[index]!.push(grandArchiveObjectId(objectId));
      }
    }
    const submitted = partitions.flat();
    const expected = new Set(pending.objectIds);
    if (
      submitted.length !== pending.objectIds.length ||
      new Set(submitted).size !== submitted.length ||
      submitted.some((objectId) => !expected.has(objectId))
    ) {
      return this.#failure(
        "illegal-command",
        "Move partitions must be an exact permutation of the affected cards",
      );
    }
    const bindingNames = [
      `move-partition-0-${decision.id}`,
      `move-partition-1-${decision.id}`,
    ] as const;
    const partitionBindings = Object.fromEntries(
      partitions.map((partition, index) => [bindingNames[index]!, partition]),
    );
    const { pendingMovePartition: _pendingMovePartition, ...baseResolution } = resolution;
    const resumed = {
      ...baseResolution,
      bindings: { ...resolution.bindings, ...partitionBindings },
      frames: [
        ...pending.destinations.map(
          (destination, index) =>
            ({
              kind: "effect" as const,
              effect: {
                kind: "move" as const,
                subject: { kind: "bound" as const, binding: bindingNames[index]! },
                // The partition answer already includes the complete order.
                destination: { ...destination, placement: { kind: destination.placement.kind } },
              },
              ...(pending.objectIds.length > 1 &&
              (destination.zone === "main-deck" || destination.zone === "material-deck") &&
              (destination.placement?.kind === "top" || destination.placement?.kind === "bottom")
                ? { orderedPrivatePlacementKnowledge: "owner-only" as const }
                : {}),
            }) satisfies import("../../../game/model.ts").GrandArchiveResolutionFrame,
        ),
        ...resolution.frames,
      ],
    };
    const original = this.#state;
    try {
      const cleared = this.#kernel.transact(this.#state, [
        {
          type: "decision-cleared",
          decisionId: decision.id,
          actorId: playerId,
          cause: { kind: "command", move: "answer-decision" },
        },
      ]);
      this.#state = cleared.state;
      const continuation = resumeGrandArchiveEffectResolution(
        this.#program,
        this.#state,
        this.#kernel,
        resumed,
      );
      this.#state = continuation.state;
      const events = [...cleared.result.events, ...continuation.events];
      if (continuation.paused) return { ok: true, state: this.#state, events };
      return this.#stabilize(events, continuation.triggerEvents);
    } catch (error) {
      this.#state = original;
      return this.#activationFailure(error);
    }
  }
}

export const resolveGrandArchiveDistributionDecision: GrandArchiveDecisionResolver<
  "resolve-distribution"
> = ({ match, decision, command, playerId }) =>
  new GrandArchiveAllocationDecisionHandler(match).resolveDistribution(decision, command, playerId);

export const resolveGrandArchiveCounterAllocationDecision: GrandArchiveDecisionResolver<
  "resolve-counter-allocation"
> = ({ match, decision, command, playerId }) =>
  new GrandArchiveAllocationDecisionHandler(match).resolveCounterAllocation(
    decision,
    command,
    playerId,
  );

export const resolveGrandArchiveMovePartitionDecision: GrandArchiveDecisionResolver<
  "resolve-move-partition"
> = ({ match, decision, command, playerId }) =>
  new GrandArchiveAllocationDecisionHandler(match).resolveMovePartition(
    decision,
    command,
    playerId,
  );

export const grandArchiveAllocationDecisionResolvers = {
  "resolve-distribution": resolveGrandArchiveDistributionDecision,
  "resolve-counter-allocation": resolveGrandArchiveCounterAllocationDecision,
  "resolve-move-partition": resolveGrandArchiveMovePartitionDecision,
} satisfies {
  readonly [
    Kind in "resolve-distribution" | "resolve-counter-allocation" | "resolve-move-partition"
  ]: GrandArchiveDecisionResolver<Kind>;
};
