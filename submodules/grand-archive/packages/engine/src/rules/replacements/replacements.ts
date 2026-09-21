import { grandArchiveEventRecipientBinding } from "../../kernel/observed-events.ts";
import type {
  GrandArchiveCharacteristicChange,
  GrandArchiveContinuousEffect,
  GrandArchiveEffect,
  GrandArchiveReplacementEffect,
  GrandArchiveReplacementOperation,
} from "@tcg/grand-archive-types";
import {
  flattenGrandArchiveAbilities,
  grandArchiveAbilityExecutionObject,
  grandArchiveAbilityFunctionalZones,
  grandArchiveCardIsObject,
  grandArchiveObjectFace,
  grandArchiveObjectHasConcealedCharacteristics,
} from "../../game/card-runtime.ts";
import type {
  GrandArchiveProposedEvent,
  GrandArchiveReplacementCandidate,
  GrandArchiveReplacementResult,
} from "../../kernel/events.ts";
import {
  evaluateGrandArchiveAmount,
  evaluateGrandArchiveCondition,
  grandArchiveCounterKey,
  resolveGrandArchivePlayers,
  resolveGrandArchiveSubjectObjects,
  GrandArchiveUnsupportedRuleError,
  withGrandArchiveDerivedVariables,
  type GrandArchiveEvaluationContext,
} from "../../procedures/effects/evaluation.ts";
import { grandArchiveDurationStatus, type GrandArchiveDurationStatus } from "../state/durations.ts";
import { grandArchiveObjectCurrentCharacteristics } from "../state/continuous.ts";
import { executeGrandArchiveEffect } from "../../procedures/effects/effect-executor.ts";
import type { GrandArchiveObjectId } from "../../game/identity.ts";
import type { GrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type {
  GrandArchiveCardInstance,
  GrandArchiveMatchState,
  GrandArchiveReplacementEffectInstance,
} from "../../game/model.ts";
import { observeGrandArchiveProposedEvent } from "../../kernel/observed-events.ts";
import {
  evaluateGrandArchiveActiveKeywordAmount,
  grandArchiveObjectActiveAbilities,
  grandArchiveObjectActiveKeywordInstances,
  grandArchiveObjectActiveKeywords,
  grandArchiveObjectHasActiveKeyword,
} from "../abilities/intrinsic-keywords.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { grandArchiveLinkIsLegal } from "../../game/link.ts";
import { matchesGrandArchiveEventPattern } from "../../procedures/effects/evaluation.ts";
import { collectGrandArchiveActionRules } from "../state/rule-modifications.ts";
import { grandArchiveEventPatternBindings } from "../abilities/triggers.ts";
import {
  grandArchiveModifiedResultAmount,
  grandArchiveModifiedResultBinding,
  type GrandArchiveModifiedResultMetric,
} from "../../kernel/modified-results.ts";

function mapNonEmpty<T, U>(
  values: readonly [T, ...T[]],
  transform: (value: T, index: number) => U,
): readonly [U, ...U[]] {
  return [
    transform(values[0], 0),
    ...values.slice(1).map((value, index) => transform(value, index + 1)),
  ];
}

function affectedPlayerForEvent(
  state: GrandArchiveMatchState,
  event: GrandArchiveProposedEvent,
): import("../../game/identity.ts").GrandArchivePlayerId | undefined {
  if (event.type === "object-created") return event.object.controllerId;
  if (event.type === "tokens-summoned") return event.playerId;
  if ("objectId" in event && typeof event.objectId === "string") {
    return state.objects[event.objectId]?.controllerId;
  }
  if ("playerId" in event && typeof event.playerId === "string") return event.playerId;
  return undefined;
}

function resultEvents(result: GrandArchiveReplacementResult, fallback: GrandArchiveProposedEvent) {
  if (result.kind === "prevented") return [];
  if (result.kind === "unchanged") return [fallback];
  if (result.kind === "resolve-before-commit") {
    throw new GrandArchiveUnsupportedRuleError("nested event-processing replacement continuation");
  }
  return result.events;
}

function replacementFollowUp(
  effect: GrandArchiveEffect,
  evaluation: GrandArchiveEvaluationContext,
): import("../../game/model.ts").GrandArchiveReplacementFollowUp {
  return {
    kind: "effect",
    effect,
    controllerId: evaluation.controllerId,
    ...(evaluation.sourceId ? { sourceId: evaluation.sourceId } : {}),
    ...(evaluation.sourceIncarnation !== undefined
      ? { sourceIncarnation: evaluation.sourceIncarnation }
      : {}),
    ...(evaluation.sourceLkiEventId ? { sourceLkiEventId: evaluation.sourceLkiEventId } : {}),
    bindings: evaluation.bindings,
    variables: evaluation.variables ?? {},
  };
}

function replaceWithEvents(
  events: readonly GrandArchiveProposedEvent[],
): GrandArchiveReplacementResult {
  if (events.length === 0) return { kind: "prevented", reason: "replacement prevented event" };
  return { kind: "replaced", events: [events[0]!, ...events.slice(1)] };
}

function replacementEventBindings(
  state: GrandArchiveMatchState,
  event: GrandArchiveProposedEvent,
  pattern?: GrandArchiveReplacementEffect["event"],
): GrandArchiveEvaluationContext["bindings"] {
  const observed = observeGrandArchiveProposedEvent(event)[0];
  if (!observed) return {};
  const eventSourceId = observed.sourceId ?? observed.subjectId;
  const eventSubjectControllerIds = [
    ...new Set(
      (observed.subjectIds ?? (observed.subjectId ? [observed.subjectId] : [])).flatMap(
        (objectId) => {
          const object = state.objects[objectId];
          return object ? [object.controllerId] : [];
        },
      ),
    ),
  ];
  return {
    ...(observed.actorId ? { eventActor: [observed.actorId] } : {}),
    ...(observed.subjectIds?.length
      ? { eventSubject: observed.subjectIds }
      : observed.subjectId
        ? { eventSubject: [observed.subjectId] }
        : {}),
    ...(observed.subjectIds?.length
      ? { eventSource: observed.subjectIds }
      : eventSourceId
        ? { eventSource: [eventSourceId] }
        : {}),
    ...(observed.recipientIds?.length || observed.recipientId
      ? { eventRecipient: grandArchiveEventRecipientBinding(observed) }
      : {}),
    ...(observed.amount !== undefined ? { eventAmount: observed.amount } : {}),
    ...(observed.stackItemId ? { eventStackItem: [observed.stackItemId] } : {}),
    ...(eventSubjectControllerIds.length > 0
      ? { eventSubjectController: eventSubjectControllerIds }
      : {}),
    ...(pattern ? grandArchiveEventPatternBindings(pattern, observed) : {}),
  };
}

function replacementResultBindings(
  events: readonly GrandArchiveProposedEvent[],
): GrandArchiveEvaluationContext["bindings"] {
  const metrics: readonly GrandArchiveModifiedResultMetric[] = [
    "cards-moved",
    "counters-removed",
    "damage-dealt",
    "damage-prevented",
    "objects-sacrificed",
  ];
  return Object.fromEntries(
    metrics.map((metric) => [
      grandArchiveModifiedResultBinding(metric),
      grandArchiveModifiedResultAmount(metric, events),
    ]),
  );
}

/**
 * Proposed summon objects are temporarily visible so replacement patterns and
 * derived values can inspect them. They are not committed objects, however,
 * so a substitute summon must be able to reuse their deterministic identity
 * slots when its preview transaction is compiled.
 */
function stripUncommittedTokenSubjects(
  state: GrandArchiveMatchState,
  bindings: GrandArchiveEvaluationContext["bindings"],
): GrandArchiveMatchState {
  const eventSubjects = bindings.eventSubject;
  if (!Array.isArray(eventSubjects) || eventSubjects.length === 0) return state;
  const zonedObjectIds = new Set([
    ...Object.values(state.zones).flatMap((zones) => Object.values(zones).flat()),
    ...Object.values(state.sharedZones).flat(),
  ] as readonly GrandArchiveObjectId[]);
  const uncommittedIds = eventSubjects.filter((id): id is GrandArchiveObjectId => {
    if (typeof id !== "string" || zonedObjectIds.has(id as GrandArchiveObjectId)) return false;
    const object = state.objects[id as GrandArchiveObjectId];
    return object?.isToken === true && object.zone === "field";
  });
  if (uncommittedIds.length === 0) return state;
  const objects = { ...state.objects };
  for (const id of uncommittedIds) delete objects[id];
  return { ...state, objects };
}

function compileReplacementEffect(
  effect: GrandArchiveEffect,
  evaluation: GrandArchiveEvaluationContext,
  priorEvents: readonly GrandArchiveProposedEvent[] = [],
  pendingMove?: GrandArchiveProposedEvent,
): {
  readonly events: readonly GrandArchiveProposedEvent[];
  readonly state: GrandArchiveMatchState;
  readonly bindings: GrandArchiveEvaluationContext["bindings"];
} {
  const previewKernel = new GrandArchiveTransactionKernel();
  const previewState =
    priorEvents.length > 0
      ? previewKernel.transact(evaluation.state, priorEvents).state
      : evaluation.state;
  const proposed: GrandArchiveProposedEvent[] = [];
  const result = executeGrandArchiveEffect(
    effect,
    {
      ...evaluation,
      state: previewState,
      ...(pendingMove?.type === "object-moved" && previewState.objects[pendingMove.objectId]
        ? {
            pendingMoveIncarnations: {
              [pendingMove.objectId]: previewState.objects[pendingMove.objectId]!.incarnation + 1,
            },
          }
        : {}),
    },
    (state, events) => {
      proposed.push(...events);
      const transaction = previewKernel.transact(
        stripUncommittedTokenSubjects(state, evaluation.bindings),
        events,
      );
      return { state: transaction.state, events: transaction.result.events };
    },
  );
  if (result.deferredStackItems.length > 0 || result.state.decision !== previewState.decision) {
    throw new GrandArchiveUnsupportedRuleError("interactive replacement effect execution");
  }
  return { events: proposed, state: result.state, bindings: result.bindings };
}

function appendReplacementEvents(
  result: GrandArchiveReplacementResult,
  original: GrandArchiveProposedEvent,
  trailing: readonly GrandArchiveProposedEvent[],
): GrandArchiveReplacementResult {
  if (trailing.length === 0) return result;
  if (result.kind === "prevented") {
    return { kind: "replaced", events: [trailing[0]!, ...trailing.slice(1)] };
  }
  if (result.kind === "unchanged") {
    return { kind: "replaced", events: [original, ...trailing] };
  }
  if (result.kind === "resolve-before-commit") {
    throw new GrandArchiveUnsupportedRuleError(
      "event-processing replacement with trailing linked effect",
    );
  }
  return { kind: "replaced", events: [...result.events, ...trailing] };
}

function applyAfterReplacementEffect(
  replacement: GrandArchiveReplacementEffect,
  result: GrandArchiveReplacementResult,
  original: GrandArchiveProposedEvent,
  evaluation: GrandArchiveEvaluationContext,
): GrandArchiveReplacementResult {
  if (!replacement.afterApply) return result;
  const replacedEvents = resultEvents(result, original);
  const followUpEvaluation = withGrandArchiveDerivedVariables(evaluation.resultVariables, {
    ...evaluation,
    bindings: {
      ...evaluation.bindings,
      ...replacementResultBindings(replacedEvents),
    },
  });
  try {
    const afterApply = compileReplacementEffect(
      replacement.afterApply,
      followUpEvaluation,
      replacedEvents,
    ).events;
    return appendReplacementEvents(result, original, afterApply);
  } catch (error) {
    if (!(error instanceof GrandArchiveUnsupportedRuleError)) throw error;
    return appendReplacementEvents(result, original, [
      {
        type: "replacement-follow-up-created",
        followUp: {
          kind: "effect",
          effect: replacement.afterApply,
          controllerId: followUpEvaluation.controllerId,
          ...(followUpEvaluation.sourceId ? { sourceId: followUpEvaluation.sourceId } : {}),
          ...(followUpEvaluation.sourceIncarnation !== undefined
            ? { sourceIncarnation: followUpEvaluation.sourceIncarnation }
            : {}),
          ...(followUpEvaluation.sourceLkiEventId
            ? { sourceLkiEventId: followUpEvaluation.sourceLkiEventId }
            : {}),
          bindings: followUpEvaluation.bindings,
          variables: followUpEvaluation.variables ?? {},
        },
        cause: { kind: "rule", rule: "linked-replacement-effect" },
      },
    ]);
  }
}

function replacementLimitUsageKey(
  replacement: GrandArchiveReplacementEffect,
  candidateId: string,
  event: GrandArchiveProposedEvent,
  state: GrandArchiveMatchState,
): string | undefined {
  const limit = replacement.limit;
  if (!limit) return undefined;
  switch (limit.per) {
    case "game":
      return `${candidateId}:game`;
    case "turn":
      return `${candidateId}:turn:${state.turn.number}`;
    case "source-instance": {
      const sourceId = "sourceId" in event ? event.sourceId : undefined;
      const source = sourceId ? state.objects[sourceId] : undefined;
      if (!source) {
        throw new GrandArchiveUnsupportedRuleError(
          "source-instance replacement limit without an event source",
        );
      }
      return `${candidateId}:source:${source.id}:${source.incarnation}`;
    }
    case "object": {
      const object =
        event.type === "object-created"
          ? event.object
          : "objectId" in event
            ? state.objects[event.objectId]
            : undefined;
      if (!object) {
        throw new GrandArchiveUnsupportedRuleError(
          "per-object replacement limit without an affected object",
        );
      }
      const incarnation =
        event.type === "object-moved" ? object.incarnation + 1 : object.incarnation;
      return `${candidateId}:object:${object.id}:${incarnation}`;
    }
    default:
      return assertNever(limit.per);
  }
}

function trackReplacementLimit(
  result: GrandArchiveReplacementResult,
  original: GrandArchiveProposedEvent,
  usageKey: string | undefined,
): GrandArchiveReplacementResult {
  if (!usageKey) return result;
  const usage: GrandArchiveProposedEvent = {
    type: "replacement-limit-used",
    usageKey,
    cause: { kind: "rule", rule: "limited-replacement-applied" },
  };
  if (result.kind === "prevented") return { kind: "replaced", events: [usage] };
  if (result.kind === "unchanged") return { kind: "replaced", events: [original, usage] };
  if (result.kind === "resolve-before-commit") {
    throw new GrandArchiveUnsupportedRuleError("limited event-processing replacement");
  }
  return { kind: "replaced", events: [...result.events, usage] };
}

function modifiedCharacteristicResult(
  change: Extract<GrandArchiveCharacteristicChange, { readonly kind: "numeric" | "grant-ability" }>,
  event: GrandArchiveProposedEvent,
  evaluation: GrandArchiveEvaluationContext,
): GrandArchiveReplacementResult {
  const subject = resolveGrandArchiveSubjectObjects({ kind: "event-subject" }, evaluation)[0];
  if (!subject) {
    throw new GrandArchiveUnsupportedRuleError(
      `${change.kind} replacement without an event subject`,
    );
  }
  if (change.kind === "numeric" && change.operation === "swap") {
    throw new GrandArchiveUnsupportedRuleError("replacement numeric swap");
  }
  const nextIncarnation =
    event.type === "object-moved"
      ? subject.incarnation + 1
      : event.type === "object-created"
        ? event.object.incarnation
        : observeGrandArchiveProposedEvent(event).some(
              (observed) =>
                observed.name === "card-activated" &&
                grandArchiveObjectCurrentCharacteristics(
                  evaluation.program,
                  evaluation.state,
                  subject,
                ).types.includes("ATTACK"),
            )
          ? subject.incarnation + 1
          : subject.incarnation;
  const binding = `replacement-characteristic:${subject.id}`;
  const resolvedChange =
    change.kind === "numeric"
      ? {
          ...change,
          amount: evaluateGrandArchiveAmount(change.amount ?? 0, evaluation),
        }
      : change;
  const effect: GrandArchiveContinuousEffect = {
    kind: "continuous",
    subjects: { kind: "bound", binding },
    affectedSet: "locked",
    duration: { kind: "permanent" },
    layer:
      change.kind === "numeric"
        ? { layer: "E", modifies: "stat", sublayer: "modifier" }
        : { layer: "D", modifies: "ability" },
    change: resolvedChange,
  };
  const identity = [
    evaluation.sourceId ?? "game",
    evaluation.abilityId ?? "replacement",
    subject.id,
    evaluation.state.stateVersion,
  ].join(":");
  return {
    kind: "replaced",
    events: [
      event,
      {
        type: "continuous-effect-created",
        effect: {
          id: `continuous-${evaluation.state.nextContinuousOrdinal}:${identity}`,
          ...(evaluation.sourceId ? { sourceId: evaluation.sourceId } : {}),
          controllerId: evaluation.controllerId,
          effect,
          affectedObjectIds: [subject.id],
          affectedObjectIncarnations: { [subject.id]: nextIncarnation },
          bindings: { ...evaluation.bindings, [binding]: [subject.id] },
          variables: evaluation.variables ?? {},
          durationAnchors: {},
          createdAtVersion: evaluation.state.stateVersion,
          createdTurnNumber: evaluation.state.turn.number,
          createdPhase: evaluation.state.turn.phase,
        },
        cause: { kind: "rule", rule: "replacement-modified-characteristic" },
      },
    ],
  };
}

function applyOperation(
  operation: GrandArchiveReplacementOperation,
  event: GrandArchiveProposedEvent,
  evaluation: GrandArchiveEvaluationContext,
): GrandArchiveReplacementResult {
  switch (operation.kind) {
    case "prevent": {
      if (event.type === "damage-marked" && event.preventable === false)
        return { kind: "unchanged" };
      if (operation.amount === undefined) {
        return event.type === "damage-marked"
          ? {
              kind: "replaced",
              events: [
                {
                  type: "damage-prevented",
                  objectId: event.objectId,
                  amount: event.amount,
                  ...(event.sourceId ? { sourceId: event.sourceId } : {}),
                  ...(event.combatDamage !== undefined ? { combatDamage: event.combatDamage } : {}),
                },
              ],
            }
          : { kind: "prevented", reason: "prevent replacement" };
      }
      if (event.type !== "damage-marked") {
        throw new GrandArchiveUnsupportedRuleError("partial prevention of a non-damage event");
      }
      const prevented = Math.max(0, evaluateGrandArchiveAmount(operation.amount, evaluation));
      const amount = Math.max(0, event.amount - prevented);
      const prevention: GrandArchiveProposedEvent = {
        type: "damage-prevented",
        objectId: event.objectId,
        amount: Math.min(event.amount, prevented),
        ...(event.sourceId ? { sourceId: event.sourceId } : {}),
        ...(event.combatDamage !== undefined ? { combatDamage: event.combatDamage } : {}),
      };
      return amount === 0
        ? { kind: "replaced", events: [prevention] }
        : { kind: "replaced", events: [{ ...event, amount }, prevention] };
    }
    case "modify-amount": {
      if (
        event.type !== "damage-marked" &&
        event.type !== "damage-removed" &&
        event.type !== "counter-changed"
      ) {
        throw new GrandArchiveUnsupportedRuleError("amount replacement event type");
      }
      const modifier = evaluateGrandArchiveAmount(operation.amount, evaluation);
      const original = event.type === "counter-changed" ? Math.abs(event.delta) : event.amount;
      let amount: number;
      switch (operation.operation) {
        case "add":
          amount = original + modifier;
          break;
        case "subtract":
          amount = original - modifier;
          break;
        case "multiply":
          amount = original * modifier;
          break;
        case "set":
          amount = modifier;
          break;
        default:
          return assertNever(operation.operation);
      }
      if (operation.minimumResult !== undefined) {
        amount = Math.max(amount, evaluateGrandArchiveAmount(operation.minimumResult, evaluation));
      }
      amount = Math.max(0, amount);
      if (event.type === "damage-marked") {
        const prevention: GrandArchiveProposedEvent = {
          type: "damage-prevented",
          objectId: event.objectId,
          amount: original - amount,
          ...(event.sourceId ? { sourceId: event.sourceId } : {}),
          ...(event.combatDamage !== undefined ? { combatDamage: event.combatDamage } : {}),
        };
        return {
          kind: "replaced",
          events:
            amount < original
              ? amount === 0
                ? [prevention]
                : [{ ...event, amount }, prevention]
              : [{ ...event, amount }],
        };
      }
      if (event.type === "damage-removed") {
        return amount === 0
          ? { kind: "prevented", reason: "zero-magnitude recovery" }
          : { kind: "replaced", events: [{ ...event, amount }] };
      }
      return {
        kind: "replaced",
        events: [{ ...event, delta: Math.sign(event.delta) * amount }],
      };
    }
    case "modify-object-state": {
      if (event.type === "object-moved" && event.to === "field") {
        const states = new Set(event.entryStates ?? []);
        if (operation.value) states.add(operation.state);
        else states.delete(operation.state);
        return { kind: "replaced", events: [{ ...event, entryStates: [...states] }] };
      }
      if (event.type === "object-created" && event.object.zone === "field") {
        const states = new Set(event.object.states);
        if (operation.value) states.add(operation.state);
        else states.delete(operation.state);
        return { kind: "replaced", events: [{ ...event, object: { ...event.object, states } }] };
      }
      if (event.type === "tokens-summoned") {
        return {
          kind: "replaced",
          events: [
            {
              ...event,
              objects: mapNonEmpty(event.objects, (object) => {
                const states = new Set(object.states);
                if (operation.value) states.add(operation.state);
                else states.delete(operation.state);
                return { ...object, states };
              }),
            },
          ],
        };
      }
      throw new GrandArchiveUnsupportedRuleError("state replacement outside field entry");
    }
    case "add-object-counters": {
      if (event.type === "object-moved" && event.to === "field") {
        const initialCounters = { ...event.initialCounters };
        for (const entry of operation.counters) {
          const key = grandArchiveCounterKey(entry.counter);
          initialCounters[key] =
            (initialCounters[key] ?? 0) + evaluateGrandArchiveAmount(entry.amount, evaluation);
        }
        return { kind: "replaced", events: [{ ...event, initialCounters }] };
      }
      if (event.type === "object-created" && event.object.zone === "field") {
        const counters = { ...event.object.counters };
        for (const entry of operation.counters) {
          const key = grandArchiveCounterKey(entry.counter);
          counters[key] =
            (counters[key] ?? 0) + evaluateGrandArchiveAmount(entry.amount, evaluation);
        }
        return { kind: "replaced", events: [{ ...event, object: { ...event.object, counters } }] };
      }
      if (event.type === "tokens-summoned") {
        return {
          kind: "replaced",
          events: [
            {
              ...event,
              objects: mapNonEmpty(event.objects, (object) => {
                const counters = { ...object.counters };
                for (const entry of operation.counters) {
                  const key = grandArchiveCounterKey(entry.counter);
                  counters[key] =
                    (counters[key] ?? 0) + evaluateGrandArchiveAmount(entry.amount, evaluation);
                }
                return { ...object, counters };
              }),
            },
          ],
        };
      }
      throw new GrandArchiveUnsupportedRuleError("entry counters outside field entry");
    }
    case "redirect": {
      if (event.type !== "damage-marked" || operation.recipient.kind === "choice") {
        throw new GrandArchiveUnsupportedRuleError("replacement redirection choice");
      }
      const recipient = resolveGrandArchiveSubjectObjects(operation.recipient, evaluation)[0];
      if (!recipient) return { kind: "unchanged" };
      return { kind: "replaced", events: [{ ...event, objectId: recipient.id }] };
    }
    case "sequence": {
      const beforeCommit: GrandArchiveProposedEvent[] = [];
      let events: readonly GrandArchiveProposedEvent[] = [event];
      let childEvaluation = evaluation;
      for (const child of operation.operations) {
        if (child.kind === "perform-before-commit") {
          const compiled = compileReplacementEffect(child.effect, childEvaluation, [], event);
          beforeCommit.push(...compiled.events);
          childEvaluation = {
            ...childEvaluation,
            state: compiled.state,
            bindings: compiled.bindings,
          };
          continue;
        }
        events = events.flatMap((candidate) =>
          resultEvents(applyOperation(child, candidate, childEvaluation), candidate),
        );
      }
      return replaceWithEvents([...beforeCommit, ...events]);
    }
    case "modify-characteristic": {
      if (operation.change.kind === "numeric" || operation.change.kind === "grant-ability") {
        return modifiedCharacteristicResult(operation.change, event, evaluation);
      }
      if (operation.change.kind !== "control") {
        throw new GrandArchiveUnsupportedRuleError(
          `replacement characteristic ${operation.change.kind}`,
        );
      }
      const controllers = resolveGrandArchivePlayers(operation.change.controller, evaluation);
      if (controllers.length !== 1) {
        throw new GrandArchiveUnsupportedRuleError(
          "replacement control requires exactly one controller",
        );
      }
      const controllerId = controllers[0]!;
      if (event.type === "object-moved" && event.to === "field") {
        return { kind: "replaced", events: [{ ...event, newControllerId: controllerId }] };
      }
      if (event.type === "object-created" && event.object.zone === "field") {
        return {
          kind: "replaced",
          events: [
            {
              ...event,
              object: {
                ...event.object,
                baseControllerId: controllerId,
                controllerId,
              },
            },
          ],
        };
      }
      if (event.type === "tokens-summoned") {
        return {
          kind: "replaced",
          events: [
            {
              ...event,
              playerId: controllerId,
              objects: mapNonEmpty(event.objects, (object) => ({
                ...object,
                baseControllerId: controllerId,
                controllerId,
              })),
            },
          ],
        };
      }
      throw new GrandArchiveUnsupportedRuleError("replacement control outside field entry");
    }
    case "replace-with":
      try {
        return replaceWithEvents(compileReplacementEffect(operation.effect, evaluation).events);
      } catch (error) {
        if (!(error instanceof GrandArchiveUnsupportedRuleError)) throw error;
        return {
          kind: "resolve-before-commit",
          followUp: replacementFollowUp(operation.effect, evaluation),
          resumeEvent: false,
        };
      }
    case "perform-before-commit":
      try {
        return replaceWithEvents([
          ...compileReplacementEffect(operation.effect, evaluation, [], event).events,
          event,
        ]);
      } catch (error) {
        if (!(error instanceof GrandArchiveUnsupportedRuleError)) throw error;
        return {
          kind: "resolve-before-commit",
          followUp: replacementFollowUp(operation.effect, evaluation),
          resumeEvent: true,
        };
      }
    default:
      return assertNever(operation);
  }
}

function replacementDurationStatus(
  instance: GrandArchiveReplacementEffectInstance,
  evaluation: GrandArchiveEvaluationContext,
): GrandArchiveDurationStatus {
  const duration = instance.effect.duration;
  const subjects =
    duration.kind === "while-subjects-in-zone"
      ? resolveGrandArchiveSubjectObjects(duration.subjects, evaluation)
      : [];
  return grandArchiveDurationStatus(duration, instance, evaluation, {
    conditionMet:
      !instance.effect.condition ||
      evaluateGrandArchiveCondition(instance.effect.condition, evaluation),
    subjectsRemainInZone:
      duration.kind === "while-subjects-in-zone" &&
      subjects.length > 0 &&
      (duration.scope === "all"
        ? subjects.every((object) => object.zone === duration.zone)
        : subjects.some((object) => object.zone === duration.zone)),
  });
}

function replacementInstanceEvaluation(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  instance: GrandArchiveReplacementEffectInstance,
  event?: GrandArchiveProposedEvent,
): GrandArchiveEvaluationContext {
  // Created objects are not committed yet, but entry replacement filters and
  // event bindings must be able to inspect their proposed characteristics.
  const evaluationState =
    event?.type === "object-created"
      ? { ...state, objects: { ...state.objects, [event.object.id]: event.object } }
      : event?.type === "tokens-summoned"
        ? {
            ...state,
            objects: {
              ...state.objects,
              ...Object.fromEntries(event.objects.map((object) => [object.id, object])),
            },
          }
        : state;
  return {
    program,
    state: evaluationState,
    controllerId: instance.controllerId,
    ...(instance.sourceId
      ? { sourceId: instance.sourceId, abilityBearerId: instance.sourceId }
      : {}),
    bindings: {
      ...instance.bindings,
      ...(event ? replacementEventBindings(evaluationState, event, instance.effect.event) : {}),
    },
    variables: instance.variables,
    ...(instance.resultVariables ? { resultVariables: instance.resultVariables } : {}),
    abilityId: instance.abilityId ?? instance.id,
  };
}

function remainingReplacementCapacity(
  instance: GrandArchiveReplacementEffectInstance,
  event: GrandArchiveProposedEvent,
  evaluation: GrandArchiveEvaluationContext,
): number | undefined {
  const capacity = instance.capacity;
  if (!capacity) return undefined;
  if (event.type !== "damage-marked") {
    throw new GrandArchiveUnsupportedRuleError("shielding capacity for a non-damage event");
  }
  if (capacity.scope === "replacement-instance") return capacity.remaining;
  const object = evaluation.state.objects[event.objectId];
  if (!object) return capacity.initial;
  const tracked = capacity.remainingByObject[event.objectId];
  return tracked?.incarnation === object.incarnation ? tracked.remaining : capacity.initial;
}

function applyInstancedReplacement(
  instance: GrandArchiveReplacementEffectInstance,
  event: GrandArchiveProposedEvent,
  evaluation: GrandArchiveEvaluationContext,
): GrandArchiveReplacementResult {
  const remainingCapacity = remainingReplacementCapacity(instance, event, evaluation);
  const operation =
    remainingCapacity === undefined
      ? instance.effect.operation
      : instance.effect.operation.kind === "prevent"
        ? { ...instance.effect.operation, amount: remainingCapacity }
        : (() => {
            throw new GrandArchiveUnsupportedRuleError(
              `shielding capacity with ${instance.effect.operation.kind}`,
            );
          })();
  const operationResult = applyOperation(operation, event, evaluation);
  const result = applyAfterReplacementEffect(instance.effect, operationResult, event, evaluation);
  const trailingEvents: GrandArchiveProposedEvent[] = [];
  if (remainingCapacity !== undefined && operationResult.kind === "replaced") {
    const prevented = operationResult.events.reduce(
      (total, candidate) => total + (candidate.type === "damage-prevented" ? candidate.amount : 0),
      0,
    );
    if (prevented > 0) {
      const object =
        event.type === "damage-marked" ? evaluation.state.objects[event.objectId] : undefined;
      trailingEvents.push({
        type: "replacement-capacity-consumed",
        replacementId: instance.id,
        amount: prevented,
        ...(instance.capacity?.scope === "per-object"
          ? object
            ? {
                scope: "per-object" as const,
                objectId: object.id,
                objectIncarnation: object.incarnation,
              }
            : (() => {
                throw new GrandArchiveUnsupportedRuleError(
                  "per-object shielding without a damage recipient",
                );
              })()
          : { scope: "replacement-instance" as const }),
        cause: { kind: "rule", rule: "damage-prevention-shield-consumed" },
      });
    }
  }
  if (instance.effect.duration.kind === "for-next-event") {
    trailingEvents.push({
      type: "replacement-effect-consumed",
      replacementId: instance.id,
      cause: { kind: "rule", rule: "next-event-replacement-consumed" },
    });
  }
  return appendReplacementEvents(result, event, trailingEvents);
}

export function collectExpiredGrandArchiveReplacementEffects(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
): readonly string[] {
  return state.replacementEffects.flatMap((instance) => {
    const evaluation = replacementInstanceEvaluation(program, state, instance);
    return replacementDurationStatus(instance, evaluation) === "expired" ? [instance.id] : [];
  });
}

function replacementMatches(
  replacement: GrandArchiveReplacementEffect,
  event: GrandArchiveProposedEvent,
  source: GrandArchiveCardInstance,
  evaluation: GrandArchiveEvaluationContext,
): boolean {
  if (replacement.condition && !evaluateGrandArchiveCondition(replacement.condition, evaluation))
    return false;
  return observeGrandArchiveProposedEvent(event).some((observed) =>
    matchesGrandArchiveEventPattern(replacement.event, observed, source, evaluation),
  );
}

function staticRestrictionsAreSatisfied(
  ability: Exclude<
    import("@tcg/grand-archive-types").GrandArchiveExecutableAbility,
    { readonly kind: "composite" }
  >,
  evaluation: GrandArchiveEvaluationContext,
): boolean {
  return !ability.restrictions?.some(
    (restriction) =>
      restriction.kind === "static" &&
      !evaluateGrandArchiveCondition(restriction.condition, evaluation),
  );
}

function intrinsicFieldEntryCandidate(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  event: GrandArchiveProposedEvent,
): GrandArchiveReplacementCandidate | undefined {
  const movingObject =
    event.type === "object-moved" && event.to === "field"
      ? state.objects[event.objectId]
      : undefined;
  const object =
    event.type === "object-moved" && event.to === "field" && movingObject
      ? {
          ...movingObject,
          zone: "field" as const,
          baseControllerId: event.newControllerId ?? movingObject.ownerId,
          controllerId: event.newControllerId ?? movingObject.ownerId,
          facing: event.entryFacing ?? "face-up",
          face:
            event.entryFacing === "face-down"
              ? ("default" as const)
              : (event.entryFace ?? movingObject.face),
        }
      : event.type === "object-created" && event.object.zone === "field"
        ? event.object
        : event.type === "tokens-summoned"
          ? event.objects[0]
          : undefined;
  if (!object) return undefined;
  if (grandArchiveObjectHasConcealedCharacteristics(program, object)) return undefined;
  const face = grandArchiveObjectFace(program, object);
  let hindered = false;
  let bulwark = 0;
  const evaluation: GrandArchiveEvaluationContext = {
    program,
    state:
      movingObject === undefined
        ? state
        : { ...state, objects: { ...state.objects, [object.id]: object } },
    controllerId: object.controllerId,
    sourceId: object.id,
    abilityBearerId: object.id,
    bindings: {},
  };
  for (const ability of flattenGrandArchiveAbilities(face.abilities)) {
    if (
      ability.restrictions?.some(
        (restriction) =>
          restriction.kind === "static" &&
          !evaluateGrandArchiveCondition(restriction.condition, evaluation),
      ) ||
      (ability.kind === "static" &&
        ability.condition !== undefined &&
        !evaluateGrandArchiveCondition(ability.condition, evaluation))
    ) {
      continue;
    }
    const keywords =
      ability.kind === "keyword-group"
        ? ability.keywords
        : ability.kind === "static" && ability.staticKind === "intrinsic"
          ? [ability.keyword]
          : [];
    for (const keyword of keywords) {
      if (keyword.name === "hindered") hindered = true;
      if (keyword.name === "bulwark") bulwark += 1;
    }
  }
  const printedDurability = face.stats.durability;
  if (event.type === "object-moved") {
    const entryStates = new Set(event.entryStates ?? []);
    if (hindered) entryStates.add("rested");
    const initialCounters = { ...event.initialCounters };
    if (printedDurability !== undefined && initialCounters.durability === undefined) {
      initialCounters.durability = printedDurability;
    }
    if (bulwark > 0) initialCounters.bulwark = (initialCounters.bulwark ?? 0) + bulwark;
    const statesChanged =
      entryStates.size !== (event.entryStates?.length ?? 0) ||
      [...entryStates].some((stateName) => !event.entryStates?.includes(stateName));
    const countersChanged =
      Object.keys(initialCounters).length !== Object.keys(event.initialCounters ?? {}).length ||
      Object.entries(initialCounters).some(
        ([counter, amount]) => event.initialCounters?.[counter] !== amount,
      );
    if (!statesChanged && !countersChanged) return undefined;
    return {
      id: `game:field-entry:${object.id}`,
      affectedPlayerId: object.controllerId,
      apply: (proposed) =>
        proposed.type === "object-moved"
          ? {
              kind: "replaced",
              events: [
                {
                  ...proposed,
                  entryStates: [...entryStates],
                  initialCounters,
                },
              ],
            }
          : { kind: "unchanged" },
    };
  }
  const enteringObjects =
    event.type === "object-created" && event.object.zone === "field"
      ? [event.object]
      : event.type === "tokens-summoned"
        ? event.objects
        : [];
  if (enteringObjects.length === 0) return undefined;
  const changedObjects = enteringObjects.map((enteringObject) => {
    const enteringFace = grandArchiveObjectFace(program, enteringObject);
    const enteringEvaluation: GrandArchiveEvaluationContext = {
      program,
      state,
      controllerId: enteringObject.controllerId,
      sourceId: enteringObject.id,
      abilityBearerId: enteringObject.id,
      bindings: {},
    };
    let entersHindered = false;
    let entersBulwark = 0;
    for (const ability of flattenGrandArchiveAbilities(enteringFace.abilities)) {
      if (
        ability.restrictions?.some(
          (restriction) =>
            restriction.kind === "static" &&
            !evaluateGrandArchiveCondition(restriction.condition, enteringEvaluation),
        ) ||
        (ability.kind === "static" &&
          ability.condition !== undefined &&
          !evaluateGrandArchiveCondition(ability.condition, enteringEvaluation))
      ) {
        continue;
      }
      const enteringKeywords =
        ability.kind === "keyword-group"
          ? ability.keywords
          : ability.kind === "static" && ability.staticKind === "intrinsic"
            ? [ability.keyword]
            : [];
      for (const keyword of enteringKeywords) {
        if (keyword.name === "hindered") entersHindered = true;
        if (keyword.name === "bulwark") entersBulwark += 1;
      }
    }
    const states = new Set(enteringObject.states);
    if (entersHindered) states.add("rested");
    const counters = { ...enteringObject.counters };
    const durability = enteringFace.stats.durability;
    if (durability !== undefined && counters.durability === undefined) {
      counters.durability = durability;
    }
    if (entersBulwark > 0) counters.bulwark = (counters.bulwark ?? 0) + entersBulwark;
    return { ...enteringObject, states, counters };
  });
  const changed = changedObjects.some((changedObject, index) => {
    const original = enteringObjects[index]!;
    return (
      changedObject.states.size !== original.states.size ||
      [...changedObject.states].some((stateName) => !original.states.has(stateName)) ||
      Object.entries(changedObject.counters).some(
        ([counter, amount]) => original.counters[counter] !== amount,
      )
    );
  });
  if (!changed) return undefined;
  return {
    id: `game:field-entry:${enteringObjects.map((entry) => entry.id).join(":")}`,
    affectedPlayerId: event.type === "tokens-summoned" ? event.playerId : object.controllerId,
    apply: (proposed) => {
      if (proposed.type === "object-created") {
        return { kind: "replaced", events: [{ ...proposed, object: changedObjects[0]! }] };
      }
      if (proposed.type === "tokens-summoned") {
        const first = changedObjects[0];
        if (!first) return { kind: "unchanged" };
        return {
          kind: "replaced",
          events: [{ ...proposed, objects: [first, ...changedObjects.slice(1)] }],
        };
      }
      return { kind: "unchanged" };
    },
  };
}

function intrinsicMovementCandidate(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  event: GrandArchiveProposedEvent,
): GrandArchiveReplacementCandidate | undefined {
  if (event.type !== "object-moved") return undefined;
  const object = state.objects[event.objectId];
  if (!object) return undefined;
  const face = grandArchiveObjectFace(program, object);
  if (
    event.from === "effects-stack" &&
    event.to === "graveyard" &&
    event.cause?.kind === "stack-item" &&
    !grandArchiveCardIsObject(face) &&
    grandArchiveObjectHasActiveKeyword(program, state, object, "preserve")
  ) {
    return {
      id: `game:preserve-resolution:${object.id}`,
      affectedPlayerId: object.controllerId,
      apply: (proposed) =>
        proposed.type === "object-moved"
          ? {
              kind: "replaced",
              events: [
                {
                  ...proposed,
                  to: "material-deck",
                  entryFacing: "face-up",
                  entryStates: ["preserved"],
                  cause: { kind: "rule", rule: "preserve-resolution-replacement" },
                },
              ],
            }
          : { kind: "unchanged" },
    };
  }
  if (
    event.from === "field" &&
    event.to === "graveyard" &&
    !(event.cause?.kind === "rule" && event.cause.rule === "unique-object-sacrifice") &&
    grandArchiveObjectHasActiveKeyword(program, state, object, "immortality")
  ) {
    return {
      id: `game:immortality:${object.id}`,
      affectedPlayerId: object.controllerId,
      apply: () => ({
        kind: "prevented",
        reason: "Immortality prohibits field-to-graveyard movement",
      }),
    };
  }
  if (
    (event.from === "field" || event.from === "effects-stack") &&
    event.to !== "banishment" &&
    object.states.has("ephemeral")
  ) {
    return {
      id: `game:ephemeral:${object.id}`,
      affectedPlayerId: object.controllerId,
      apply: (proposed) =>
        proposed.type === "object-moved"
          ? {
              kind: "replaced",
              events: [
                {
                  ...proposed,
                  to: "banishment",
                  cause: { kind: "rule", rule: "ephemeral-destination-replacement" },
                },
              ],
            }
          : { kind: "unchanged" },
    };
  }
  if (
    (event.from === "field" || event.from === "intent") &&
    event.to === "banishment" &&
    grandArchiveObjectHasActiveKeyword(program, state, object, "renewable")
  ) {
    return {
      id: `game:renewable:${object.id}`,
      affectedPlayerId: object.controllerId,
      apply: (proposed) =>
        proposed.type === "object-moved"
          ? {
              kind: "replaced",
              events: [
                {
                  ...proposed,
                  to: "material-deck",
                  cause: { kind: "rule", rule: "renewable-destination-replacement" },
                },
              ],
            }
          : { kind: "unchanged" },
    };
  }
  return undefined;
}

/** CR Champion 8 and Supertypes — Regalia 4–5. */
function intrinsicRestrictedCardDestinationCandidate(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  event: GrandArchiveProposedEvent,
): GrandArchiveReplacementCandidate | undefined {
  if (event.type !== "object-moved") return undefined;
  const object = state.objects[event.objectId];
  if (!object) return undefined;
  const characteristics = grandArchiveObjectCurrentCharacteristics(program, state, object);
  const definition = program.cardsById[object.definitionId];
  // Double-Faced Cards rule 4.2 applies the default side's destination rules,
  // even while the field object is showing a differently typed flip face.
  const destinationTypeLine =
    object.face === "transformed" && definition?.layout.kind === "double-faced"
      ? definition.layout.defaultFace.typeLine
      : characteristics;
  const isChampion = destinationTypeLine.types.includes("CHAMPION");
  const isRegalia = destinationTypeLine.supertypes.includes("REGALIA");

  if (event.to === "graveyard" && (isChampion || isRegalia)) {
    return {
      id: `game:${isChampion ? "champion" : "regalia"}-graveyard-destination:${object.id}`,
      affectedPlayerId: object.controllerId,
      apply: (proposed) =>
        proposed.type === "object-moved"
          ? {
              kind: "replaced",
              // Preserve the cause: a redirected sacrifice is still sacrificed and destroyed.
              events: [{ ...proposed, to: "banishment" }],
            }
          : { kind: "unchanged" },
    };
  }

  if (
    isRegalia &&
    event.effectSpecified === true &&
    (event.to === "hand" || event.to === "main-deck" || event.to === "memory")
  ) {
    return {
      id: `game:regalia-effect-destination:${object.id}`,
      affectedPlayerId: object.controllerId,
      apply: (proposed) =>
        proposed.type === "object-moved"
          ? {
              kind: "replaced",
              events: [
                {
                  ...proposed,
                  to: "material-deck",
                  placement: "unordered",
                },
              ],
            }
          : { kind: "unchanged" },
    };
  }
  return undefined;
}

function intrinsicLinkShieldCandidates(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  event: GrandArchiveProposedEvent,
): readonly GrandArchiveReplacementCandidate[] {
  if (event.type !== "object-moved" || event.from !== "field" || event.to !== "graveyard") {
    return [];
  }
  const rule = event.cause?.kind === "rule" ? event.cause.rule : "";
  const sacrifice = rule.includes("sacrifice");
  const destroy =
    !sacrifice &&
    (rule.includes("destroy") ||
      rule === "lethal-damage-state-check" ||
      rule === "zero-durability-state-check");
  if (!sacrifice && !destroy) return [];
  const linked = state.objects[event.objectId];
  if (!linked) return [];
  return Object.values(state.objects).flatMap(
    (shield): readonly GrandArchiveReplacementCandidate[] => {
      if (
        shield.zone !== "field" ||
        shield.hostId !== linked.id ||
        !grandArchiveLinkIsLegal(program, state, shield) ||
        !grandArchiveObjectHasActiveKeyword(program, state, shield, "link-shield")
      ) {
        return [];
      }
      return [
        {
          id: `game:link-shield:${shield.id}`,
          affectedPlayerId: linked.controllerId,
          apply: (proposed) => {
            if (
              proposed.type !== "object-moved" ||
              proposed.objectId !== linked.id ||
              proposed.from !== "field" ||
              proposed.to !== "graveyard"
            ) {
              return { kind: "unchanged" };
            }
            const shieldMove: GrandArchiveProposedEvent = {
              type: "object-moved",
              objectId: shield.id,
              from: "field",
              to: "graveyard",
              ...(proposed.actorId ? { actorId: proposed.actorId } : {}),
              cause: {
                kind: "rule",
                rule: sacrifice
                  ? "link-shield-sacrifice-replacement"
                  : "link-shield-destroy-replacement",
              },
            };
            return {
              kind: "replaced",
              events:
                destroy && linked.damage > 0
                  ? [
                      {
                        type: "object-reference-substituted",
                        originalObjectId: linked.id,
                        substituteObjectId: shield.id,
                        cause: { kind: "rule", rule: "link-shield-reference-substitution" },
                      },
                      {
                        type: "damage-cleared",
                        objectId: linked.id,
                        cause: { kind: "rule", rule: "link-shield-remove-damage" },
                      },
                      shieldMove,
                    ]
                  : [
                      {
                        type: "object-reference-substituted",
                        originalObjectId: linked.id,
                        substituteObjectId: shield.id,
                        cause: { kind: "rule", rule: "link-shield-reference-substitution" },
                      },
                      shieldMove,
                    ],
            };
          },
        },
      ];
    },
  );
}

function intrinsicGameOutcomeCandidate(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  event: GrandArchiveProposedEvent,
): GrandArchiveReplacementCandidate | undefined {
  if (event.type === "player-lost" && event.reason === "champion-died") {
    const championStillPresent = Object.values(state.objects).some(
      (object) =>
        object.controllerId === event.playerId &&
        object.zone === "field" &&
        grandArchiveObjectCurrentCharacteristics(program, state, object).types.includes("CHAMPION"),
    );
    if (!championStillPresent) return undefined;
    return {
      id: `game:champion-death-replaced:${event.playerId}`,
      affectedPlayerId: event.playerId,
      apply: () => ({
        kind: "prevented",
        reason: "The champion death event was replaced",
      }),
    };
  }
  if (
    event.type === "match-finished" &&
    event.cause?.kind === "rule" &&
    event.cause.rule === "game-ending-state-check"
  ) {
    const activePlayers = state.turnOrder.filter(
      (playerId) => state.players[playerId]?.lost === false,
    );
    const affectedPlayerId = activePlayers[0];
    if (activePlayers.length <= 1 || !affectedPlayerId) return undefined;
    return {
      id: "game:premature-match-finish",
      affectedPlayerId,
      apply: () => ({
        kind: "prevented",
        reason: "The game still has multiple active players",
      }),
    };
  }
  return undefined;
}

function intrinsicUnpreventableDamageCandidate(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  event: GrandArchiveProposedEvent,
): GrandArchiveReplacementCandidate | undefined {
  if (event.type !== "damage-marked" || event.amount <= 0 || event.preventable === false) {
    return undefined;
  }
  const recipient = state.objects[event.objectId];
  if (!recipient) return undefined;
  const usingIds = event.combatParticipantIds ?? (event.sourceId ? [event.sourceId] : []);
  const rules = collectGrandArchiveActionRules({
    action: "prevent-damage",
    activationKind: "card",
    playerId: recipient.controllerId,
    candidateId: recipient.id,
    ...(event.sourceId ? { sourceId: event.sourceId, againstIds: [event.sourceId] } : {}),
    damageKind: event.combatDamage === true ? "combat" : "non-combat",
    fromZone: recipient.zone,
    usingIds,
    evaluation: {
      program,
      state,
      controllerId: recipient.controllerId,
      candidateId: recipient.id,
      bindings: {
        ...(event.sourceId ? { eventSource: [event.sourceId] } : {}),
        eventRecipient: [recipient.id],
        eventAmount: event.amount,
      },
    },
  });
  if (!rules.some((rule) => rule.effect.mode === "forbid")) return undefined;
  return {
    id: `game:unpreventable-damage:${event.sourceId ?? "unknown"}:${recipient.id}`,
    affectedPlayerId: recipient.controllerId,
    apply: (proposed) =>
      proposed.type === "damage-marked"
        ? { kind: "replaced", events: [{ ...proposed, preventable: false }] }
        : { kind: "unchanged" },
  };
}

function intrinsicCriticalCandidates(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  event: GrandArchiveProposedEvent,
): readonly GrandArchiveReplacementCandidate[] {
  if (
    event.type !== "damage-marked" ||
    event.combatDamage !== true ||
    event.amount <= 0 ||
    event.criticalDoubled ||
    !event.sourceId
  ) {
    return [];
  }
  const recipient = state.objects[event.objectId];
  const source = state.objects[event.sourceId];
  if (!recipient || !source) return [];
  const participantIds = event.combatParticipantIds ?? [event.sourceId];
  return participantIds.flatMap((participantId) => {
    const participant = state.objects[participantId];
    if (!participant) return [];
    return grandArchiveObjectActiveKeywordInstances(program, state, participant).flatMap(
      (instance, keywordIndex): readonly GrandArchiveReplacementCandidate[] => {
        const keyword = instance.keyword;
        if (keyword.name !== "critical") return [];
        const amount = evaluateGrandArchiveActiveKeywordAmount(instance, keyword.value);
        if (!Number.isSafeInteger(amount) || amount < 0) {
          throw new GrandArchiveUnsupportedRuleError(
            "Critical requires a non-negative integer discard amount",
          );
        }
        if (amount === 0) return [];
        return [
          {
            id: `game:critical:${participant.id}:${keywordIndex}`,
            affectedPlayerId: recipient.controllerId,
            apply: (proposed) => {
              if (
                proposed.type !== "damage-marked" ||
                proposed.combatDamage !== true ||
                proposed.criticalDoubled
              ) {
                return { kind: "unchanged" };
              }
              return {
                kind: "resolve-before-commit",
                followUp: {
                  kind: "critical",
                  amount,
                  actorId: proposed.actorId ?? source.controllerId,
                  sourceId: proposed.sourceId ?? source.id,
                  recipientId: proposed.objectId,
                  declinedOpponentIds: [],
                },
                resumeEvent: true,
              };
            },
          },
        ];
      },
    );
  });
}

export function collectGrandArchiveReplacementCandidates(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  event: GrandArchiveProposedEvent,
): readonly GrandArchiveReplacementCandidate[] {
  if (event.type === "object-removed-from-game" || event.gameActionKind === "special-game-action") {
    return [];
  }
  if (
    event.type === "keyword-action-performed" &&
    ((event.action === "glimpse" && event.glimpseStage === "complete") ||
      (event.action === "suppress" && event.suppressStage === "complete"))
  )
    return [];
  const candidates: GrandArchiveReplacementCandidate[] = [];
  const gameOutcome = intrinsicGameOutcomeCandidate(program, state, event);
  if (gameOutcome) candidates.push(gameOutcome);
  const unpreventableDamage = intrinsicUnpreventableDamageCandidate(program, state, event);
  if (unpreventableDamage) candidates.push(unpreventableDamage);
  candidates.push(...intrinsicCriticalCandidates(program, state, event));
  candidates.push(...intrinsicLinkShieldCandidates(program, state, event));
  const restrictedDestination = intrinsicRestrictedCardDestinationCandidate(program, state, event);
  if (restrictedDestination) candidates.push(restrictedDestination);
  const intrinsicMovement = intrinsicMovementCandidate(program, state, event);
  if (intrinsicMovement) candidates.push(intrinsicMovement);
  const intrinsicEntry = intrinsicFieldEntryCandidate(program, state, event);
  if (intrinsicEntry) candidates.push(intrinsicEntry);
  if (event.type === "damage-marked" && event.combatDamage) {
    const recipient = state.objects[event.objectId];
    if (recipient && (recipient.counters.bulwark ?? 0) > 0) {
      candidates.push({
        id: `game:bulwark:${recipient.id}`,
        affectedPlayerId: recipient.controllerId,
        apply: (proposed) => {
          if (proposed.type !== "damage-marked") return { kind: "unchanged" };
          const removeCounter: GrandArchiveProposedEvent = {
            type: "counter-changed",
            objectId: recipient.id,
            counter: "bulwark",
            delta: -1,
            cause: { kind: "rule", rule: "bulwark-damage-replacement" },
          };
          if (proposed.preventable === false) {
            return { kind: "replaced", events: [proposed, removeCounter] };
          }
          return {
            kind: "replaced",
            events: [
              {
                type: "damage-prevented",
                objectId: proposed.objectId,
                amount: proposed.amount,
                ...(proposed.sourceId ? { sourceId: proposed.sourceId } : {}),
                combatDamage: true,
              },
              removeCounter,
            ],
          };
        },
      });
    }
  }
  for (const instance of state.replacementEffects) {
    const source = instance.sourceId ? state.objects[instance.sourceId] : undefined;
    if (!source) continue;
    const evaluation = replacementInstanceEvaluation(program, state, instance, event);
    if (
      replacementDurationStatus(instance, evaluation) !== "active" ||
      !replacementMatches(instance.effect, event, source, evaluation)
    ) {
      continue;
    }
    const affectedPlayerId = affectedPlayerForEvent(state, event) ?? instance.controllerId;
    const optionalPlayers = instance.effect.optionalFor
      ? resolveGrandArchivePlayers(instance.effect.optionalFor, evaluation)
      : [];
    if (optionalPlayers.length > 1) {
      throw new GrandArchiveUnsupportedRuleError(
        "optional replacement controlled by multiple players",
      );
    }
    if (remainingReplacementCapacity(instance, event, evaluation) === 0) continue;
    const candidateId = `instance:${instance.id}`;
    const usageKey = replacementLimitUsageKey(instance.effect, candidateId, event, state);
    if (instance.effect.limit) {
      if (!usageKey) throw new Error("Limited replacement has no usage key");
      if ((state.replacementLimitUsages[usageKey] ?? 0) >= instance.effect.limit.count) continue;
    }
    candidates.push({
      id: candidateId,
      affectedPlayerId,
      ...(optionalPlayers[0] ? { optionalPlayerId: optionalPlayers[0] } : {}),
      apply: (proposed) =>
        trackReplacementLimit(
          applyInstancedReplacement(instance, proposed, evaluation),
          proposed,
          usageKey,
        ),
    });
  }
  const staticSources = Object.values(state.objects);
  if (event.type === "object-created" && !state.objects[event.object.id]) {
    staticSources.push(event.object);
  }
  if (event.type === "tokens-summoned") {
    staticSources.push(...event.objects.filter((object) => !state.objects[object.id]));
  }
  for (const source of staticSources) {
    const face = grandArchiveObjectFace(program, source);
    const evaluationState =
      event.type === "object-created" && !state.objects[event.object.id]
        ? { ...state, objects: { ...state.objects, [event.object.id]: event.object } }
        : event.type === "tokens-summoned"
          ? {
              ...state,
              objects: {
                ...state.objects,
                ...Object.fromEntries(event.objects.map((object) => [object.id, object])),
              },
            }
          : state.objects[source.id]
            ? state
            : { ...state, objects: { ...state.objects, [source.id]: source } };
    for (const ability of grandArchiveObjectActiveAbilities(program, evaluationState, source)) {
      if (ability.kind !== "static" || ability.staticKind !== "effects") continue;
      const functionalZones = grandArchiveAbilityFunctionalZones(face, ability);
      const sourceIsEnteringFunctionalZone =
        event.type === "object-moved" &&
        event.objectId === source.id &&
        functionalZones.includes(event.to);
      if (!functionalZones.includes(source.zone) && !sourceIsEnteringFunctionalZone) continue;
      const executionObject = grandArchiveAbilityExecutionObject(evaluationState, source, ability);
      if (!executionObject) continue;
      const baseEvaluation = withGrandArchiveDerivedVariables(ability.variables, {
        program,
        state: evaluationState,
        controllerId: executionObject.controllerId,
        sourceId: executionObject.id,
        abilityBearerId: executionObject.id,
        variables:
          event.type === "object-moved" &&
          event.objectId === executionObject.id &&
          event.to === "field"
            ? (event.entryActivationVariables ?? {})
            : executionObject.activationVariables,
        bindings: replacementEventBindings(evaluationState, event),
      });
      if (
        !staticRestrictionsAreSatisfied(ability, baseEvaluation) ||
        (ability.condition && !evaluateGrandArchiveCondition(ability.condition, baseEvaluation))
      )
        continue;
      for (const [effectIndex, effect] of ability.effects.entries()) {
        if (effect.kind !== "replacement") continue;
        const evaluation: GrandArchiveEvaluationContext = {
          ...baseEvaluation,
          abilityId: `${ability.id}:${effectIndex}`,
          bindings: {
            ...baseEvaluation.bindings,
            ...replacementEventBindings(evaluationState, event, effect.event),
          },
        };
        if (!replacementMatches(effect, event, executionObject, evaluation)) continue;
        if (effect.capacity) {
          throw new GrandArchiveUnsupportedRuleError("capacitated static replacement");
        }
        const affectedPlayerId =
          affectedPlayerForEvent(state, event) ?? executionObject.controllerId;
        const optionalPlayers = effect.optionalFor
          ? resolveGrandArchivePlayers(effect.optionalFor, evaluation)
          : [];
        if (optionalPlayers.length > 1) {
          throw new GrandArchiveUnsupportedRuleError(
            "optional replacement controlled by multiple players",
          );
        }
        const candidateId = `${source.id}:${ability.id}:${effectIndex}`;
        const usageKey = replacementLimitUsageKey(effect, candidateId, event, state);
        if (effect.limit) {
          if (!usageKey) throw new Error("Limited replacement has no usage key");
          if ((state.replacementLimitUsages[usageKey] ?? 0) >= effect.limit.count) continue;
        }
        candidates.push({
          id: candidateId,
          affectedPlayerId,
          ...(optionalPlayers[0] ? { optionalPlayerId: optionalPlayers[0] } : {}),
          apply: (proposed) =>
            trackReplacementLimit(
              applyAfterReplacementEffect(
                effect,
                applyOperation(effect.operation, proposed, evaluation),
                proposed,
                evaluation,
              ),
              proposed,
              usageKey,
            ),
        });
      }
    }
  }
  return candidates;
}

export function chooseGrandArchiveReplacement(
  candidates: readonly GrandArchiveReplacementCandidate[],
): GrandArchiveReplacementCandidate | undefined {
  const unpreventableDamage = candidates.find(
    grandArchiveReplacementCandidateMarksDamageUnpreventable,
  );
  if (unpreventableDamage) return unpreventableDamage;
  const immortality = candidates.find((candidate) => candidate.id.startsWith("game:immortality:"));
  if (immortality) return immortality;
  const intrinsicEntry = candidates.find((candidate) =>
    candidate.id.startsWith("game:field-entry:"),
  );
  if (intrinsicEntry) return intrinsicEntry;
  if (candidates.length !== 1 || candidates[0]?.optionalPlayerId) return undefined;
  return candidates[0];
}

export function grandArchiveReplacementCandidateMarksDamageUnpreventable(
  candidate: GrandArchiveReplacementCandidate,
): boolean {
  return candidate.id.startsWith("game:unpreventable-damage:");
}

function assertNever(value: never): never {
  throw new Error(`Unhandled Grand Archive replacement variant: ${JSON.stringify(value)}`);
}
