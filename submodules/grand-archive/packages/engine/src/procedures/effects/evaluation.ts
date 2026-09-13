import type {
  GrandArchiveAmount,
  GrandArchiveCardFilter,
  GrandArchiveCollection,
  GrandArchiveComparisonOperator,
  GrandArchiveCondition,
  GrandArchiveCounterKind,
  GrandArchiveEventPattern,
  GrandArchiveEventSubject,
  GrandArchiveKeyword,
  GrandArchivePlayerSet,
  GrandArchiveRelativePlayer,
  GrandArchiveSubject,
  GrandArchiveVariableDeclaration,
  GrandArchiveValueSubject,
} from "@tcg/grand-archive-types";
import type {
  GrandArchiveEventId,
  GrandArchiveObjectId,
  GrandArchivePlayerId,
  GrandArchiveStackItemId,
  GrandArchiveTargetId,
} from "../../game/identity.ts";
import type { GrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { requireGrandArchiveCard } from "../../kernel/match-program.ts";
import type { GrandArchiveCommittedEvent, GrandArchiveProposedEvent } from "../../kernel/events.ts";
import type {
  GrandArchiveActivationPaymentRecord,
  GrandArchiveCardInstance,
  GrandArchiveMatchState,
  GrandArchiveStackItem,
} from "../../game/model.ts";
import {
  deriveGrandArchiveCharacteristics,
  deriveGrandArchiveNumericProperty,
} from "../../rules/state/continuous.ts";
import { grandArchiveObjectActiveKeywords } from "../../rules/abilities/intrinsic-keywords.ts";
import { grandArchiveCharacteristicsAreSiegeable } from "../../game/functional-subtypes.ts";
import { observeGrandArchiveCommittedEvent } from "../../kernel/observed-events.ts";
import type { GrandArchiveObservedEvent } from "../../kernel/observed-events.ts";
import { grandArchivePlayerHasState } from "../../rules/state/player-continuous.ts";
import { grandArchiveMasteryCounterCount, grandArchivePlayerMastery } from "../../game/mastery.ts";
import { grandArchiveObjectHasState } from "../../game/object-state.ts";

export interface GrandArchiveObjectIdentityBinding {
  readonly kind: "object-identities";
  readonly ids: readonly GrandArchiveTargetId[];
  readonly incarnations: Readonly<Partial<Record<GrandArchiveObjectId, number>>>;
}

export type GrandArchiveExecutionBinding =
  | GrandArchiveObjectIdentityBinding
  | readonly GrandArchiveTargetId[]
  | readonly GrandArchivePlayerId[]
  | readonly string[]
  | number
  | boolean
  | string;

export interface GrandArchiveEvaluationContext {
  readonly program: GrandArchiveMatchProgram;
  readonly state: GrandArchiveMatchState;
  readonly controllerId: GrandArchivePlayerId;
  readonly sourceId?: GrandArchiveObjectId;
  readonly abilityBearerId?: GrandArchiveObjectId;
  /** Object ID paired with the tracked incarnation; prevents nested source-context leakage. */
  readonly sourceIdentityId?: GrandArchiveObjectId;
  /** Incarnation that remains the ability's source through announcement and resolution. */
  readonly sourceIncarnation?: number;
  /** Exact object-moved event whose pre-move checkpoint supplies source LKI. */
  readonly sourceLkiEventId?: GrandArchiveEventId;
  /** Applies source LKI without changing how targets or other bound objects are read. */
  readonly sourceInformationBasis?: "current" | "last-known";
  /** Selects the immediately preceding zone-change checkpoint for object reads. */
  readonly objectInformationBasis?: "current" | "last-known";
  /** Printed ability identity currently being announced or resolved. */
  readonly abilityId?: string;
  /** Exact targets already declared for the activation currently being quoted. */
  readonly declaredTargetIds?: readonly GrandArchiveTargetId[];
  readonly candidateId?: GrandArchiveObjectId;
  /**
   * Attacker whose attack is being derived before combat exists. During combat,
   * the authoritative attacker remains `state.combat.attackerId`.
   */
  readonly prospectiveAttackAttackerId?: GrandArchiveObjectId;
  readonly bindings: Readonly<Record<string, GrandArchiveExecutionBinding>>;
  /** Present only while validating a declared target, never for a resolution-time choice. */
  readonly targeting?: {
    readonly kind:
      | "card-activation"
      | "bestowment"
      | "materialization"
      | "activated-ability"
      | "triggered-ability";
    readonly sourceIsSpell: boolean;
  };
  readonly variables?: Readonly<Partial<Record<"X" | "Y" | "Z", number>>>;
  /** Result-dependent declarations must survive a replacement outliving its creating stack item. */
  readonly resultVariables?: readonly Extract<
    GrandArchiveVariableDeclaration,
    { readonly kind: "derived" }
  >[];
  /** Activation states already fixed during announcement but not yet committed. */
  readonly announcementActivationStates?: readonly import("@tcg/grand-archive-types").GrandArchiveActivationState[];
  /** Activation-scoped adjustment such as Empower; never mutates the champion object. */
  readonly championLevelModifier?: {
    readonly controllerId: GrandArchivePlayerId;
    readonly amount: number;
  };
  /** First event-history index belonging to the currently resolving stack item. */
  readonly resolutionStartedEventHistoryIndex?: number;
  /** Stack identity supplied by the resolver before suspended state is committed. */
  readonly resolvingStackItemId?: GrandArchiveStackItemId;
  /** Supplied only while a resolving effect is permitted to consume deterministic randomness. */
  readonly rollDice?: (sides: number, count: number) => number;
  readonly derivingProperties?: ReadonlySet<string>;
  /** Partially derived Layer B/C values visible while ordering dependent continuous effects. */
  readonly characteristicOverrides?: ReadonlyMap<
    GrandArchiveObjectId,
    import("../../rules/state/continuous.ts").GrandArchiveDerivedCharacteristics
  >;
  /** Partially derived Layer A/E values visible while ordering dependent continuous effects. */
  readonly numericOverrides?: ReadonlyMap<string, number | undefined>;
  /** Partially derived Layer D keywords visible while ordering dependent ability effects. */
  readonly keywordOverrides?: ReadonlyMap<GrandArchiveObjectId, readonly GrandArchiveKeyword[]>;
  /** Internal recursion guard while Layer D asks rule modifiers whether a keyword grant is barred. */
  readonly skipCrossObjectKeywordDerivation?: boolean;
}

export class GrandArchiveUnsupportedRuleError extends Error {
  public constructor(feature: string) {
    super(`Grand Archive rule feature is not implemented: ${feature}`);
    this.name = "GrandArchiveUnsupportedRuleError";
  }
}

export function grandArchiveCounterKey(counter: GrandArchiveCounterKind): string {
  return typeof counter === "string" ? counter : `named:${counter.named}`;
}

export function grandArchiveObjectCounterCount(
  object: GrandArchiveCardInstance,
  counter: GrandArchiveCounterKind,
): number {
  return counter === "damage"
    ? object.damage
    : (object.counters[grandArchiveCounterKey(counter)] ?? 0);
}

/**
 * Returns the complete object information captured immediately before its most
 * recent zone change. Grand Archive LKI never reaches across two zone changes.
 */
export function grandArchiveLastKnownObject(
  state: GrandArchiveMatchState,
  objectId: GrandArchiveObjectId,
): GrandArchiveCardInstance | undefined {
  for (let index = state.eventHistory.length - 1; index >= 0; index -= 1) {
    const event = state.eventHistory[index]!;
    if (event.type === "object-moved" && event.objectId === objectId) {
      return event.previousObject ?? state.objects[objectId];
    }
    if (event.type === "object-removed-from-game" && event.object.id === objectId) {
      return event.object;
    }
  }
  return state.objects[objectId];
}

function lastKnownMoveEvent(
  state: GrandArchiveMatchState,
  objectId: GrandArchiveObjectId,
  eventId?: GrandArchiveEventId,
  resultingIncarnation?: number,
): Extract<GrandArchiveCommittedEvent, { readonly type: "object-moved" }> | undefined {
  for (let index = state.eventHistory.length - 1; index >= 0; index -= 1) {
    const event = state.eventHistory[index]!;
    if (
      event.type === "object-moved" &&
      event.objectId === objectId &&
      (eventId === undefined || event.eventId === eventId) &&
      (resultingIncarnation === undefined ||
        (event.previousObject?.incarnation ?? -1) + 1 === resultingIncarnation)
    ) {
      return event;
    }
  }
  return undefined;
}

function isEvaluationSourceIdentity(
  objectId: GrandArchiveObjectId,
  context: GrandArchiveEvaluationContext,
): boolean {
  return (
    (objectId === context.sourceId || objectId === context.abilityBearerId) &&
    (context.sourceIdentityId === undefined || context.sourceIdentityId === objectId)
  );
}

function evaluationSourceLkiEventId(
  objectId: GrandArchiveObjectId,
  context: GrandArchiveEvaluationContext,
): GrandArchiveEventId | undefined {
  return isEvaluationSourceIdentity(objectId, context) ? context.sourceLkiEventId : undefined;
}

/** Resolves an object while preserving the exact source identity tracked by an ability. */
export function grandArchiveEvaluationObject(
  objectId: GrandArchiveObjectId,
  context: GrandArchiveEvaluationContext,
  trackAsAbilitySource = false,
): GrandArchiveCardInstance | undefined {
  const sourceIdentity = trackAsAbilitySource && isEvaluationSourceIdentity(objectId, context);
  if (
    context.objectInformationBasis === "last-known" ||
    (sourceIdentity && context.sourceInformationBasis === "last-known")
  ) {
    const sourceLkiEventId = evaluationSourceLkiEventId(objectId, context);
    if (sourceIdentity) {
      if (sourceLkiEventId !== undefined) {
        return lastKnownMoveEvent(
          context.state,
          objectId,
          sourceLkiEventId,
          context.sourceIncarnation,
        )?.previousObject;
      }
      const current = context.state.objects[objectId];
      return current &&
        (context.sourceIncarnation === undefined ||
          current.incarnation === context.sourceIncarnation)
        ? current
        : undefined;
    }
    return grandArchiveLastKnownObject(context.state, objectId);
  }
  const object = context.state.objects[objectId];
  if (
    object &&
    sourceIdentity &&
    context.sourceIncarnation !== undefined &&
    object.incarnation !== context.sourceIncarnation
  ) {
    return undefined;
  }
  return object;
}

function observedEventObject(
  observed: GrandArchiveObservedEvent,
  state: GrandArchiveMatchState,
): GrandArchiveCardInstance | undefined {
  const id = observed.subjectId ?? observed.recipientId;
  if (!id) return undefined;
  if (
    observed.committedEvent.type === "object-removed-from-game" &&
    observed.committedEvent.object.id === id
  ) {
    return observed.committedEvent.object;
  }
  const object = state.objects[id];
  if (!object) return undefined;
  const committed = observed.committedEvent;
  if (committed.type === "champion-leveled-up" && id === committed.championId) {
    return { ...object, activeDefinitionId: committed.previousActiveDefinitionId };
  }
  return committed.type === "object-moved"
    ? (committed.previousObject ?? {
        ...object,
        controllerId: committed.previousControllerId ?? object.controllerId,
        activeDefinitionId: committed.previousActiveDefinitionId ?? object.activeDefinitionId,
        activationPayment: committed.previousActivationPayment ?? object.activationPayment,
        activationBindings: committed.previousActivationBindings ?? object.activationBindings,
        activationVariables: committed.previousActivationVariables ?? object.activationVariables,
      })
    : object;
}

function grandArchiveEventSubjectMatches(
  subject: GrandArchiveEventSubject | undefined,
  observed: GrandArchiveObservedEvent,
  source: GrandArchiveCardInstance,
  context: GrandArchiveEvaluationContext,
): boolean {
  if (!subject || subject.kind === "any") return true;
  switch (subject.kind) {
    case "any-of":
      return subject.subjects.some((child) =>
        grandArchiveEventSubjectMatches(child, observed, source, context),
      );
    case "source":
    case "ability-bearer":
      return observed.subjectId === source.id;
    case "event-object": {
      const object = observedEventObject(observed, context.state);
      if (!object) return false;
      if (
        subject.controller &&
        !grandArchiveRelativePlayerMatches(object.controllerId, subject.controller, context)
      ) {
        return false;
      }
      if (
        subject.owner &&
        !grandArchiveRelativePlayerMatches(object.ownerId, subject.owner, context)
      ) {
        return false;
      }
      return !subject.filter || matchesGrandArchiveCardFilter(object, subject.filter, context);
    }
    case "linked-object": {
      const object = observedEventObject(observed, context.state);
      return object?.hostId === source.id || source.hostId === object?.id;
    }
    case "bound-object": {
      const object = observedEventObject(observed, context.state);
      if (
        !object ||
        !bindingObjects(subject.binding, context).some((candidate) => candidate.id === object.id)
      )
        return false;
      return !subject.filter || matchesGrandArchiveCardFilter(object, subject.filter, context);
    }
    default:
      return assertNever(subject);
  }
}

function grandArchiveEventSubjectIncludesSourceIdentity(
  subject: GrandArchiveEventSubject | undefined,
): boolean {
  if (!subject) return false;
  if (subject.kind === "source" || subject.kind === "ability-bearer") return true;
  return (
    subject.kind === "any-of" &&
    subject.subjects.some(grandArchiveEventSubjectIncludesSourceIdentity)
  );
}

const SHIFTING_CURRENTS_DIRECTIONS = ["north", "east", "south", "west"] as const;
type ShiftingCurrentsDirection = (typeof SHIFTING_CURRENTS_DIRECTIONS)[number];

function asShiftingCurrentsDirection(value: unknown): ShiftingCurrentsDirection | undefined {
  if (typeof value !== "string") return undefined;
  const normalized = value.toLowerCase();
  return (SHIFTING_CURRENTS_DIRECTIONS as readonly string[]).includes(normalized)
    ? (normalized as ShiftingCurrentsDirection)
    : undefined;
}

function matchesShiftingCurrentsDirectionTransition(
  fromValue: string | number | boolean | undefined,
  toValue: string | number | boolean | undefined,
  transition: {
    readonly from?: ShiftingCurrentsDirection;
    readonly to?: ShiftingCurrentsDirection;
    readonly relation?: "opposite" | "next-clockwise";
  },
): boolean {
  const from = asShiftingCurrentsDirection(fromValue);
  const to = asShiftingCurrentsDirection(toValue);
  if (!from || !to || from === to) return false;
  if (transition.from && transition.from !== from) return false;
  if (transition.to && transition.to !== to) return false;
  if (transition.relation === "opposite") {
    const opposite = {
      north: "south",
      south: "north",
      east: "west",
      west: "east",
    } as const;
    if (opposite[from] !== to) return false;
  }
  if (transition.relation === "next-clockwise") {
    const next = {
      north: "east",
      east: "south",
      south: "west",
      west: "north",
    } as const;
    if (next[from] !== to) return false;
  }
  return true;
}

export function matchesGrandArchiveEventPattern(
  pattern: GrandArchiveEventPattern,
  observed: GrandArchiveObservedEvent,
  source: GrandArchiveCardInstance,
  context: GrandArchiveEvaluationContext,
  skipOccurrence = false,
): boolean {
  if (pattern.name !== observed.name) return false;
  if (
    pattern.actor &&
    (!observed.actorId ||
      !grandArchiveRelativePlayerMatches(observed.actorId, pattern.actor, context))
  ) {
    return false;
  }
  const subjectIds = observed.subjectIds ?? (observed.subjectId ? [observed.subjectId] : []);
  const sourceParticipatedInHit =
    observed.name === "attack-hit" &&
    grandArchiveEventSubjectIncludesSourceIdentity(pattern.subject) &&
    observed.usingIds?.includes(source.id) === true;
  if (
    !sourceParticipatedInHit &&
    (subjectIds.length > 0
      ? !subjectIds.some((subjectId) =>
          grandArchiveEventSubjectMatches(
            pattern.subject,
            { ...observed, subjectId },
            source,
            context,
          ),
        )
      : !grandArchiveEventSubjectMatches(pattern.subject, observed, source, context))
  ) {
    return false;
  }
  if ("phase" in pattern && pattern.phase !== observed.phase) return false;
  if (pattern.name === "keyword-action-performed" && pattern.action !== observed.keywordAction) {
    return false;
  }
  if ("state" in pattern && pattern.state !== observed.state) return false;
  const stateChange =
    pattern.name === "player-state-changed" || pattern.name === "object-state-changed";
  if (
    "from" in pattern &&
    pattern.from !== undefined &&
    pattern.from !== (stateChange ? observed.stateFrom : observed.from)
  ) {
    return false;
  }
  if ("fromNot" in pattern && pattern.fromNot?.includes(observed.from!)) return false;
  if (
    "to" in pattern &&
    pattern.to !== undefined &&
    pattern.to !== (stateChange ? observed.stateTo : observed.to)
  ) {
    return false;
  }
  if (
    pattern.name === "player-state-changed" &&
    pattern.directionTransition &&
    !matchesShiftingCurrentsDirectionTransition(
      observed.stateFrom,
      observed.stateTo,
      pattern.directionTransition,
    )
  ) {
    return false;
  }
  const eventCause = observed.committedEvent.cause;
  if ((pattern.name === "card-moved" || pattern.name === "object-entered-field") && pattern.cause) {
    if (pattern.cause.kind === "card-activation") {
      if (
        eventCause?.kind !== "stack-item" ||
        eventCause.stackItemKind !== "card-activation" ||
        (pattern.cause.controller !== undefined &&
          (!eventCause.controllerId ||
            !grandArchiveRelativePlayerMatches(
              eventCause.controllerId,
              pattern.cause.controller,
              context,
            )))
      ) {
        return false;
      }
    } else if (!grandArchiveEventCauseMatchesAbility(pattern.cause.ability, eventCause, context)) {
      return false;
    }
  }
  if (
    pattern.name === "object-entered-field" &&
    pattern.causeNot &&
    grandArchiveEventCauseMatchesAbility(pattern.causeNot.ability, eventCause, context)
  ) {
    return false;
  }
  if (
    "activationState" in pattern &&
    pattern.activationState !== undefined &&
    !observed.activationStates?.includes(pattern.activationState)
  ) {
    return false;
  }
  if ("isCopy" in pattern && pattern.isCopy !== undefined && pattern.isCopy !== observed.isCopy) {
    return false;
  }
  if (
    "counter" in pattern &&
    pattern.counter !== undefined &&
    grandArchiveCounterKey(pattern.counter) !== observed.counter
  ) {
    return false;
  }
  if (
    "recipient" in pattern &&
    pattern.recipient &&
    !(observed.recipientIds ?? (observed.recipientId ? [observed.recipientId] : [])).some(
      (recipientId) => {
        const recipient = Object.values(context.state.objects).find(
          (object) => object.id === recipientId,
        );
        return Boolean(
          recipient &&
          grandArchiveEventSubjectMatches(
            pattern.recipient,
            { ...observed, subjectId: recipient.id },
            source,
            context,
          ),
        );
      },
    )
  ) {
    return false;
  }
  if (
    "combatDamage" in pattern &&
    pattern.combatDamage !== undefined &&
    pattern.combatDamage !== (observed.combatDamage === true)
  ) {
    return false;
  }
  if (
    "using" in pattern &&
    pattern.using &&
    !(observed.usingIds ?? (observed.sourceId ? [observed.sourceId] : [])).some((usingId) =>
      grandArchiveEventSubjectMatches(
        pattern.using,
        { ...observed, subjectId: usingId },
        source,
        context,
      ),
    )
  ) {
    return false;
  }
  if (
    "previousObject" in pattern &&
    pattern.previousObject &&
    !grandArchiveEventSubjectMatches(
      pattern.previousObject,
      { ...observed, subjectId: observed.previousObjectId },
      source,
      context,
    )
  ) {
    return false;
  }
  if ("amountComparison" in pattern && pattern.amountComparison) {
    const amountContext = {
      ...context,
      bindings: { ...context.bindings, eventAmount: observed.amount ?? 0 },
    };
    if (
      !compareGrandArchiveNumbers(
        evaluateGrandArchiveAmount(pattern.amountComparison.left, amountContext),
        pattern.amountComparison.operator,
        evaluateGrandArchiveAmount(pattern.amountComparison.right, amountContext),
      )
    ) {
      return false;
    }
  }
  if (
    "itemTypes" in pattern &&
    pattern.itemTypes &&
    (!observed.stackItemType || !pattern.itemTypes.includes(observed.stackItemType))
  ) {
    return false;
  }
  if (
    "abilityKinds" in pattern &&
    pattern.abilityKinds &&
    (!observed.abilityKind || !pattern.abilityKinds.includes(observed.abilityKind))
  ) {
    return false;
  }
  if (pattern.condition && !evaluateGrandArchiveCondition(pattern.condition, context)) return false;
  if (pattern.occurrence && !skipOccurrence) {
    const currentEvent = observed.committedEvent;
    const currentStateVersion =
      "stateVersion" in currentEvent ? currentEvent.stateVersion : undefined;
    const currentEventId = "eventId" in currentEvent ? currentEvent.eventId : undefined;
    let history = context.state.eventHistory.filter(
      (event) => currentStateVersion === undefined || event.stateVersion <= currentStateVersion,
    );
    if (pattern.occurrence.window === "this-turn") {
      const turnStartIndex = history.map((event) => event.type).lastIndexOf("turn-started");
      if (turnStartIndex >= 0) history = history.slice(turnStartIndex);
    }
    const historyIncludesCurrent =
      currentEventId !== undefined && history.some((event) => event.eventId === currentEventId);
    const observations = [
      ...history.flatMap(observeGrandArchiveCommittedEvent),
      ...(!historyIncludesCurrent ? [observed] : []),
    ];
    if (pattern.occurrence.actorScope === "same-player" && !observed.actorId) return false;
    const count = observations.filter(
      (historical) =>
        (pattern.occurrence?.actorScope !== "same-player" ||
          historical.actorId === observed.actorId) &&
        matchesGrandArchiveEventPattern(
          { ...pattern, occurrence: undefined },
          historical,
          source,
          context,
          true,
        ),
    ).length;
    if (count !== pattern.occurrence.count) return false;
  }
  return true;
}

function grandArchiveEventCauseMatchesAbility(
  expected: "this" | string,
  cause: GrandArchiveCommittedEvent["cause"] | GrandArchiveProposedEvent["cause"],
  context: GrandArchiveEvaluationContext,
): boolean {
  if (
    cause?.kind !== "stack-item" ||
    (cause.stackItemKind !== "activated-ability" && cause.stackItemKind !== "triggered-ability") ||
    !cause.abilityId
  ) {
    return false;
  }
  const expectedValue = expected === "this" ? context.abilityId : context.bindings[expected];
  if (typeof expectedValue === "string") {
    return cause.abilityId === expectedValue.split(":", 1)[0];
  }
  return Array.isArray(expectedValue) && expectedValue.includes(cause.abilityId);
}

export function grandArchiveActiveFace(
  program: GrandArchiveMatchProgram,
  object: GrandArchiveCardInstance,
) {
  const card = requireGrandArchiveCard(program, object.activeDefinitionId ?? object.definitionId);
  if (card.layout.kind === "single-faced") return card.layout.face;
  return object.face === "transformed" ? card.layout.flipFace : card.layout.defaultFace;
}

function trackedCharacteristicValues(
  context: GrandArchiveEvaluationContext,
  key: string,
): readonly string[] | undefined {
  const captured = context.bindings[`tracked:${key}`];
  const sourceId = context.abilityBearerId ?? context.sourceId;
  const source = sourceId ? grandArchiveEvaluationObject(sourceId, context, true) : undefined;
  const tracked = source ? context.state.trackedCharacteristics[source.id] : undefined;
  return typeof captured === "string"
    ? [captured]
    : Array.isArray(captured) && captured.every((value) => typeof value === "string")
      ? captured
      : source && tracked?.incarnation === source.incarnation
        ? tracked.values[key]
        : undefined;
}

function matchesTrackedCharacteristic(
  values: readonly string[] | undefined,
  characteristic: Extract<
    GrandArchiveCardFilter,
    { readonly kind: "matches-tracked-characteristic" }
  >["characteristic"],
  candidate: {
    readonly names: readonly string[];
    readonly types: readonly string[];
    readonly classes: readonly string[];
    readonly elements: readonly string[];
    readonly subtypes: readonly string[];
  },
): boolean {
  if (!values || values.length === 0) return false;
  switch (characteristic) {
    case "card-name":
      return values.some((value) => candidate.names.includes(value));
    case "type":
      return values.some((value) => candidate.types.includes(value));
    case "class":
      return values.some((value) => candidate.classes.includes(value));
    case "element":
      return values.some((value) => candidate.elements.includes(value));
    case "subtype":
      return values.some((value) => candidate.subtypes.includes(value));
    default:
      return assertNever(characteristic);
  }
}

function startingDeckDefinitionMatchesFilter(
  definitionId: string,
  filter: GrandArchiveCardFilter,
  context: GrandArchiveEvaluationContext,
): boolean {
  const card = requireGrandArchiveCard(context.program, definitionId);
  const face = card.layout.kind === "single-faced" ? card.layout.face : card.layout.defaultFace;
  switch (filter.kind) {
    case "all":
      return filter.filters.every((child) =>
        startingDeckDefinitionMatchesFilter(definitionId, child, context),
      );
    case "any":
      return filter.filters.some((child) =>
        startingDeckDefinitionMatchesFilter(definitionId, child, context),
      );
    case "not":
      return !startingDeckDefinitionMatchesFilter(definitionId, filter.filter, context);
    case "name":
      return filter.match === "contains"
        ? face.name.includes(filter.value)
        : face.name === filter.value;
    case "champion-name":
      return (
        face.typeLine.types.includes("CHAMPION") &&
        (face.lineageName ?? face.name.split(",", 1)[0]) === filter.value
      );
    case "canonical-id":
      return definitionId === filter.value;
    case "type":
      return filter.oneOf.some((value) => face.typeLine.types.includes(value));
    case "class":
      return filter.oneOf.some((value) => face.typeLine.classes.includes(value));
    case "element":
      return filter.oneOf.some((value) => face.elements.includes(value));
    case "element-category": {
      const matchesCategory = face.elements.some((element) => {
        const isBasic = element === "FIRE" || element === "WATER" || element === "WIND";
        const isAdvanced = element !== "NORM" && !isBasic;
        return filter.value === "basic"
          ? isBasic
          : filter.value === "advanced"
            ? isAdvanced
            : !isAdvanced;
      });
      return matchesCategory;
    }
    case "subtype":
      return filter.oneOf.some((value) => face.typeLine.subtypes.includes(value));
    case "supertype":
      return filter.oneOf.some((value) => face.typeLine.supertypes.includes(value));
    case "speed":
      return face.speed !== undefined && filter.oneOf.includes(face.speed);
    case "token":
      return (card.definitionKind === "token-representation") === filter.value;
    case "matches-tracked-characteristic":
      return matchesTrackedCharacteristic(
        trackedCharacteristicValues(context, filter.key),
        filter.characteristic,
        {
          names: [face.name],
          types: face.typeLine.types,
          classes: face.typeLine.classes,
          elements: face.elements,
          subtypes: face.typeLine.subtypes,
        },
      );
    case "has-link-keyword":
      return face.abilities.some((ability) => {
        if (ability.kind === "keyword-group") {
          return ability.keywords.some(
            (keyword) => keyword.name === "link" && keyword.target === filter.target,
          );
        }
        return (
          ability.kind === "static" &&
          ability.staticKind === "intrinsic" &&
          ((ability.keyword.name === "link" && ability.keyword.target === filter.target) ||
            ability.additionalKeywords?.some(
              (keyword) => keyword.name === "link" && keyword.target === filter.target,
            ) === true)
        );
      });
    case "not-source":
    case "not-subject":
    case "zone":
    case "facing":
    case "numeric":
    case "parity":
    case "has-counter":
    case "has-keyword":
    case "object-state":
    case "attacking-subject":
    case "activation-state":
    case "entered-field-this-turn":
    case "linked":
    case "same-characteristic":
      throw new GrandArchiveUnsupportedRuleError(`starting-deck filter ${filter.kind}`);
    default:
      return assertNever(filter);
  }
}

export function grandArchiveDefinitionMatchesCardFilter(
  definitionId: string,
  filter: GrandArchiveCardFilter,
  context: GrandArchiveEvaluationContext,
): boolean {
  return startingDeckDefinitionMatchesFilter(definitionId, filter, context);
}

function activePlayers(context: GrandArchiveEvaluationContext) {
  return context.state.turnOrder.filter((id) => context.state.players[id]?.lost === false);
}

function grandArchiveRelativePlayerMatches(
  actualPlayerId: GrandArchivePlayerId,
  relativePlayer: GrandArchiveRelativePlayer,
  context: GrandArchiveEvaluationContext,
): boolean {
  if (!activePlayers(context).includes(actualPlayerId)) return false;
  if (relativePlayer === "opponent" || relativePlayer === "another-player") {
    return actualPlayerId !== context.controllerId;
  }
  if (relativePlayer === "non-turn-player") {
    return actualPlayerId !== context.state.turn.playerId;
  }
  return resolveGrandArchivePlayers(relativePlayer, context).includes(actualPlayerId);
}

export function resolveGrandArchivePlayers(
  players: GrandArchivePlayerSet,
  context: GrandArchiveEvaluationContext,
): readonly GrandArchivePlayerId[] {
  if (typeof players === "object") {
    if ("eachExcept" in players) {
      const excluded = new Set(resolveGrandArchivePlayers(players.eachExcept, context));
      return activePlayers(context).filter((id) => !excluded.has(id));
    }
    if ("binding" in players) {
      const binding = context.bindings[players.binding];
      const value =
        binding && typeof binding === "object" && "kind" in binding ? binding.ids : binding;
      if (!Array.isArray(value))
        throw new GrandArchiveUnsupportedRuleError(`player binding ${players.binding}`);
      return value.filter(
        (id): id is GrandArchivePlayerId => context.state.players[id] !== undefined,
      );
    }
    if ("ownerOf" in players || "controllerOf" in players) {
      const binding = "ownerOf" in players ? players.ownerOf : players.controllerOf;
      const objects = bindingObjects(binding, context);
      const value = context.bindings[binding];
      const stackItems = Array.isArray(value)
        ? value.flatMap((id) => {
            const item = context.state.stack.find((candidate) => candidate.id === id);
            return item ? [item] : [];
          })
        : [];
      const stackSources = "ownerOf" in players ? bindingStackSourceObjects(binding, context) : [];
      return [
        ...new Set([
          ...objects.map((object) => ("ownerOf" in players ? object.ownerId : object.controllerId)),
          ...("ownerOf" in players
            ? stackSources.map((object) => object.ownerId)
            : stackItems.map((item) => item.controllerId)),
        ]),
      ];
    }
  }
  switch (players) {
    case "controller":
      return [context.controllerId];
    case "turn-player":
      return [context.state.turn.playerId];
    case "each-player":
      return activePlayers(context);
    case "each-opponent":
      return activePlayers(context).filter((id) => id !== context.controllerId);
    case "opponent":
    case "another-player":
    case "non-turn-player": {
      const candidates = activePlayers(context).filter((id) =>
        players === "non-turn-player"
          ? id !== context.state.turn.playerId
          : id !== context.controllerId,
      );
      if (candidates.length !== 1) {
        throw new GrandArchiveUnsupportedRuleError(
          `${players} requires a declared player in multiplayer`,
        );
      }
      return candidates;
    }
    case "any-opponent-in-turn-order":
      return (() => {
        const controllerIndex = context.state.turnOrder.indexOf(context.controllerId);
        if (controllerIndex < 0) {
          throw new GrandArchiveUnsupportedRuleError("controller outside turn order");
        }
        const orderedAfterController = [
          ...context.state.turnOrder.slice(controllerIndex + 1),
          ...context.state.turnOrder.slice(0, controllerIndex),
        ];
        return orderedAfterController.filter(
          (id) => id !== context.controllerId && context.state.players[id]?.lost === false,
        );
      })();
    case "attacking-player":
      if (!context.state.combat)
        throw new GrandArchiveUnsupportedRuleError("attacking player outside combat");
      return [context.state.combat.attackingPlayerId];
    case "defending-player": {
      if (!context.state.combat)
        throw new GrandArchiveUnsupportedRuleError("defending player outside combat");
      const target = context.state.objects[context.state.combat.targetIds[0]!];
      if (!target) throw new GrandArchiveUnsupportedRuleError("combat target controller");
      return [target.controllerId];
    }
    case "event-actor":
      return resolveGrandArchivePlayers({ binding: "eventActor" }, context);
    case "event-subject-controller": {
      const captured = context.bindings.eventSubjectController;
      if (Array.isArray(captured)) {
        const playerIds = captured.filter(
          (id): id is GrandArchivePlayerId => context.state.players[id] !== undefined,
        );
        if (playerIds.length > 0) return [...new Set(playerIds)];
      }
      const subject = bindingObjects("eventSubject", context)[0];
      if (!subject) {
        throw new GrandArchiveUnsupportedRuleError("event subject controller");
      }
      return [subject.controllerId];
    }
    case "event-recipient-controller": {
      const recipient = bindingObjects("eventRecipient", context)[0];
      if (!recipient) {
        throw new GrandArchiveUnsupportedRuleError("event recipient controller");
      }
      return [recipient.controllerId];
    }
    default:
      throw new GrandArchiveUnsupportedRuleError("relative player expression");
  }
}

function bindingObjects(
  binding: string,
  context: GrandArchiveEvaluationContext,
): readonly GrandArchiveCardInstance[] {
  const value = context.bindings[binding];
  if (value && typeof value === "object" && "kind" in value) {
    return value.ids.flatMap((id) => {
      const current = Object.values(context.state.objects).find((object) => object.id === id);
      const object = current ? grandArchiveEvaluationObject(current.id, context) : undefined;
      return object &&
        (value.incarnations[object.id] === undefined ||
          value.incarnations[object.id] === object.incarnation)
        ? [object]
        : [];
    });
  }
  if (!Array.isArray(value)) return [];
  return value.flatMap((id) => {
    const object = grandArchiveEvaluationObject(id, context);
    return object ? [object] : [];
  });
}

function bindingStackSourceObjects(
  binding: string,
  context: GrandArchiveEvaluationContext,
): readonly GrandArchiveCardInstance[] {
  const value = context.bindings[binding];
  if (!Array.isArray(value)) return [];
  const objects = value.flatMap((id) => {
    const item =
      context.state.stack.find((candidate) => candidate.id === id) ??
      [...context.state.eventHistory]
        .reverse()
        .find(
          (
            event,
          ): event is Extract<
            GrandArchiveCommittedEvent,
            { readonly type: "stack-item-negated" }
          > => event.type === "stack-item-negated" && event.item.id === id,
        )?.item;
    if (!item) return [];
    const sourceId =
      item.kind === "card-activation" ||
      item.kind === "materialization" ||
      item.kind === "bestowment"
        ? item.cardId
        : item.sourceId;
    if (!sourceId) return [];
    const object = grandArchiveEvaluationObject(sourceId, context);
    return object ? [object] : [];
  });
  return [...new Map(objects.map((object) => [object.id, object])).values()];
}

export function resolveGrandArchiveSubjectObjects(
  subject: GrandArchiveSubject,
  context: GrandArchiveEvaluationContext,
): readonly GrandArchiveCardInstance[] {
  switch (subject.kind) {
    case "source": {
      const object = context.sourceId
        ? grandArchiveEvaluationObject(context.sourceId, context, true)
        : undefined;
      return object ? [object] : [];
    }
    case "ability-bearer": {
      const object = context.abilityBearerId
        ? grandArchiveEvaluationObject(context.abilityBearerId, context, true)
        : undefined;
      return object ? [object] : [];
    }
    case "candidate": {
      const object = context.candidateId
        ? grandArchiveEvaluationObject(context.candidateId, context)
        : undefined;
      return object ? [object] : [];
    }
    case "champion": {
      const playerIds = resolveGrandArchivePlayers(subject.player, context);
      return Object.values(context.state.objects).filter(
        (object) =>
          object.zone === "field" &&
          playerIds.includes(object.controllerId) &&
          deriveGrandArchiveCharacteristics(object, context).types.includes("CHAMPION"),
      );
    }
    case "bound":
      return bindingObjects(subject.binding, context);
    case "tracked":
      return bindingObjects(subject.key, context);
    case "stack-source":
      return bindingStackSourceObjects(subject.binding, context);
    case "linked-object": {
      if (!context.sourceId) return [];
      const source = grandArchiveEvaluationObject(context.sourceId, context, true);
      if (!source) return [];
      if (source.hostId) {
        const host = context.state.objects[source.hostId];
        return host ? [host] : [];
      }
      return Object.values(context.state.objects).filter((object) => object.hostId === source.id);
    }
    case "related": {
      const objects = resolveGrandArchiveSubjectObjects(subject.subject, context);
      if (subject.relation === "host") {
        return objects.flatMap((object) => {
          const host = object.hostId ? context.state.objects[object.hostId] : undefined;
          return host ? [host] : [];
        });
      }
      if (subject.relation === "attacker" && context.state.combat) {
        const attacker = context.state.objects[context.state.combat.attackerId];
        return attacker ? [attacker] : [];
      }
      throw new GrandArchiveUnsupportedRuleError(`object relation ${subject.relation}`);
    }
    case "each":
      return resolveGrandArchiveCollection(subject.collection, context);
    case "current-attack": {
      const attackerId = context.state.combat?.attackerId ?? context.prospectiveAttackAttackerId;
      const attacker = attackerId ? context.state.objects[attackerId] : undefined;
      return attacker ? [attacker] : [];
    }
    case "controller":
    case "player":
    case "event-source":
      return bindingObjects("eventSource", context);
    case "mastery":
      return [];
    case "event-subject":
      return bindingObjects("eventSubject", context);
    case "event-recipient":
      return bindingObjects("eventRecipient", context);
    case "event-attacker": {
      const bound = bindingObjects("eventAttacker", context);
      if (bound.length > 0) return bound;
      const attacker = context.state.combat
        ? context.state.objects[context.state.combat.attackerId]
        : undefined;
      return attacker ? [attacker] : [];
    }
    case "binding-remainder": {
      const exclusions = Array.isArray(subject.excluding) ? subject.excluding : [subject.excluding];
      const excludedIds = new Set(
        exclusions.flatMap((binding) =>
          bindingObjects(binding, context).map((object) => object.id),
        ),
      );
      return bindingObjects(subject.binding, context).filter(
        (object) => !excludedIds.has(object.id),
      );
    }
    case "attacks-by": {
      const attackerId = context.state.combat?.attackerId ?? context.prospectiveAttackAttackerId;
      if (!attackerId) return [];
      const attacker = context.state.objects[attackerId];
      if (!attacker) return [];
      return resolveGrandArchiveSubjectObjects(subject.attacker, context).some(
        (candidate) => candidate.id === attacker.id,
      )
        ? [attacker]
        : [];
    }
    default:
      return assertNever(subject);
  }
}

export function compareGrandArchiveNumbers(
  left: number,
  operator: GrandArchiveComparisonOperator,
  right: number,
): boolean {
  switch (operator) {
    case "eq":
      return left === right;
    case "neq":
      return left !== right;
    case "lt":
      return left < right;
    case "lte":
      return left <= right;
    case "gt":
      return left > right;
    case "gte":
      return left >= right;
    default:
      return assertNever(operator);
  }
}

function evaluateFilterAmount(
  amount: GrandArchiveAmount,
  context: GrandArchiveEvaluationContext,
): number | undefined {
  if (typeof amount === "number") return amount;
  if (amount.kind === "property") {
    const subject = valueSubjectToSubject(amount.subject);
    const basisContext =
      amount.basis === "last-known"
        ? { ...context, objectInformationBasis: "last-known" as const }
        : context;
    const object = resolveGrandArchiveSubjectObjects(subject, basisContext)[0];
    return object
      ? numericProperty(object, amount.property, basisContext, amount.basis)
      : undefined;
  }
  return evaluateGrandArchiveAmount(amount, context);
}

function numericProperty(
  object: GrandArchiveCardInstance,
  property: "level" | "power" | "life" | "durability" | "reserve-cost" | "memory-cost",
  context: GrandArchiveEvaluationContext,
  basis: "base" | "current" | "last-known" = "current",
): number | undefined {
  const face = grandArchiveActiveFace(context.program, object);
  if (
    basis === "last-known" ||
    (isEvaluationSourceIdentity(object.id, context) &&
      context.sourceInformationBasis === "last-known")
  ) {
    const isSourceIdentity = isEvaluationSourceIdentity(object.id, context);
    const sourceLkiEventId = evaluationSourceLkiEventId(object.id, context);
    const captured =
      isSourceIdentity && sourceLkiEventId === undefined
        ? undefined
        : lastKnownMoveEvent(
            context.state,
            object.id,
            sourceLkiEventId,
            isSourceIdentity ? context.sourceIncarnation : undefined,
          )?.previousNumericProperties?.[property];
    if (captured !== undefined) return captured;
  }
  switch (property) {
    case "level":
    case "power":
    case "life":
    case "durability":
      return basis === "base"
        ? face.stats[property]
        : deriveGrandArchiveNumericProperty(object, property, context);
    case "reserve-cost":
    case "memory-cost": {
      if (basis !== "base") {
        return deriveGrandArchiveNumericProperty(object, property, context);
      }
      const kind = property === "reserve-cost" ? "reserve" : "memory";
      return face.cost.kind === kind && typeof face.cost.amount === "number"
        ? face.cost.amount
        : undefined;
    }
    default:
      return assertNever(property);
  }
}

export function deriveGrandArchivePlayerProperty(
  playerId: GrandArchivePlayerId,
  property: "influence" | "omens",
  context: GrandArchiveEvaluationContext,
): number {
  if (!context.state.players[playerId]) {
    throw new GrandArchiveUnsupportedRuleError(`unknown player ${playerId}`);
  }
  const objects = Object.values(context.state.objects).filter(
    (object) => object.controllerId === playerId,
  );
  if (property === "influence") {
    return objects.filter((object) => object.zone === "hand" || object.zone === "memory").length;
  }
  return objects.filter(
    (object) => object.zone === "banishment" && grandArchiveObjectCounterCount(object, "omen") > 0,
  ).length;
}

function grandArchivePlayerZoneCardCount(
  playerId: GrandArchivePlayerId,
  zone: import("@tcg/grand-archive-types").GrandArchiveZone,
  filter: GrandArchiveCardFilter | undefined,
  context: GrandArchiveEvaluationContext,
): number {
  return Object.values(context.state.objects).filter(
    (object) =>
      object.controllerId === playerId &&
      object.zone === zone &&
      (!filter || matchesGrandArchiveCardFilter(object, filter, context)),
  ).length;
}

function resolvingStackItem(
  context: GrandArchiveEvaluationContext,
): GrandArchiveStackItem | undefined {
  const stackItemId = context.resolvingStackItemId ?? context.state.resolution?.stackItemId;
  return stackItemId
    ? context.state.stack.find((candidate) => candidate.id === stackItemId)
    : undefined;
}

function currentAbilityTargetIds(
  context: GrandArchiveEvaluationContext,
): readonly GrandArchiveTargetId[] {
  if (context.declaredTargetIds) return context.declaredTargetIds;
  const item = resolvingStackItem(context);
  if (item) {
    const declared = [...new Set(item.targets.flatMap((target) => target.targetIds))];
    if (declared.length > 0) return declared;
    if (context.state.combat) return context.state.combat.targetIds;
  }
  return [];
}

function currentAbilityTargetObjects(
  context: GrandArchiveEvaluationContext,
): readonly GrandArchiveCardInstance[] {
  return currentAbilityTargetIds(context).flatMap((targetId) => {
    const object = context.state.objects[targetId as GrandArchiveObjectId];
    if (object) return [object];
    const item = context.state.stack.find((candidate) => candidate.id === targetId);
    if (!item) return [];
    const sourceId =
      item.kind === "card-activation" ||
      item.kind === "materialization" ||
      item.kind === "bestowment"
        ? item.cardId
        : item.sourceId;
    const source = sourceId ? context.state.objects[sourceId] : undefined;
    return source ? [source] : [];
  });
}

function objectCharacteristicValues(
  object: GrandArchiveCardInstance,
  characteristic: "card-name" | "name" | "type" | "subtype" | "element" | "class" | "reserve-cost",
  context: GrandArchiveEvaluationContext,
): readonly (string | number)[] {
  const characteristics = deriveGrandArchiveCharacteristics(object, context);
  switch (characteristic) {
    case "card-name":
    case "name":
      return characteristics.names;
    case "type":
      return characteristics.types;
    case "subtype":
      return characteristics.subtypes;
    case "element":
      return characteristics.elements;
    case "class":
      return characteristics.classes;
    case "reserve-cost": {
      const cost = numericProperty(object, "reserve-cost", context);
      return cost === undefined ? [] : [cost];
    }
    default:
      return assertNever(characteristic);
  }
}

function sourceAbilityIdentityStartIndex(context: GrandArchiveEvaluationContext): number {
  if (!context.sourceId) return 0;
  for (let index = context.state.eventHistory.length - 1; index >= 0; index -= 1) {
    const event = context.state.eventHistory[index]!;
    if (
      (event.type === "object-moved" &&
        event.objectId === context.sourceId &&
        event.from !== event.to) ||
      ((event.type === "champion-leveled-up" || event.type === "champion-deleveled") &&
        event.championId === context.sourceId)
    ) {
      return index + 1;
    }
  }
  return 0;
}

function matchingAbilityStackEntries(
  context: GrandArchiveEvaluationContext,
): ReadonlyMap<
  GrandArchiveStackItemId,
  { readonly item: GrandArchiveStackItem; readonly index: number }
> {
  if (!context.sourceId || !context.abilityId) {
    throw new GrandArchiveUnsupportedRuleError("ability history without identity");
  }
  const identityStart = sourceAbilityIdentityStartIndex(context);
  const entries = new Map<
    GrandArchiveStackItemId,
    { readonly item: GrandArchiveStackItem; readonly index: number }
  >();
  context.state.eventHistory.forEach((event, index) => {
    if (
      index >= identityStart &&
      (event.type === "stack-item-added" || event.type === "stack-item-deferred") &&
      (event.item.kind === "activated-ability" || event.item.kind === "triggered-ability") &&
      event.item.sourceId === context.sourceId &&
      event.item.ability.id === context.abilityId
    ) {
      entries.set(event.item.id, { item: event.item, index });
    }
  });
  return entries;
}

function activationPaymentForSource(
  sourceId: GrandArchiveObjectId,
  context: GrandArchiveEvaluationContext,
): readonly GrandArchiveActivationPaymentRecord[] {
  const item = resolvingStackItem(context);
  if (item?.sourceId === sourceId) return item.activationPayment;
  return grandArchiveEvaluationObject(sourceId, context, true)?.activationPayment ?? [];
}

function longestConsecutiveRun(values: readonly number[]): number {
  const sorted = [...new Set(values)].sort((left, right) => left - right);
  let longest = 0;
  let current = 0;
  let previous: number | undefined;
  for (const value of sorted) {
    current = previous !== undefined && value === previous + 1 ? current + 1 : 1;
    longest = Math.max(longest, current);
    previous = value;
  }
  return longest;
}

export function evaluateGrandArchiveAmount(
  amount: GrandArchiveAmount,
  context: GrandArchiveEvaluationContext,
): number {
  if (typeof amount === "number") return amount;
  switch (amount.kind) {
    case "variable": {
      const value = context.variables?.[amount.symbol];
      if (value === undefined) {
        throw new GrandArchiveUnsupportedRuleError(`undeclared variable ${amount.symbol}`);
      }
      return value;
    }
    case "binding": {
      const value = context.bindings[amount.binding];
      if (typeof value !== "number")
        throw new GrandArchiveUnsupportedRuleError(`numeric binding ${amount.binding}`);
      return value;
    }
    case "binding-count": {
      const value = context.bindings[amount.binding];
      if (value && typeof value === "object" && "kind" in value)
        return bindingObjects(amount.binding, context).length;
      if (!Array.isArray(value)) {
        throw new GrandArchiveUnsupportedRuleError(`identity collection binding ${amount.binding}`);
      }
      return value.length;
    }
    case "property": {
      const subject = valueSubjectToSubject(amount.subject);
      const basisContext =
        amount.basis === "last-known"
          ? { ...context, objectInformationBasis: "last-known" as const }
          : context;
      const object = resolveGrandArchiveSubjectObjects(subject, basisContext)[0];
      // Before a starting champion enters, that player has no champion level to add.
      // Level restrictions must therefore evaluate against LV 0 rather than making
      // legal-command discovery partial during pre-game actions.
      if (!object && amount.subject.kind === "champion" && amount.property === "level") {
        return 0;
      }
      const value = object
        ? numericProperty(object, amount.property, basisContext, amount.basis)
        : undefined;
      if (value === undefined && amount.missing !== "zero") {
        throw new GrandArchiveUnsupportedRuleError(`missing ${amount.property}`);
      }
      return value ?? 0;
    }
    case "counter-count": {
      if (amount.subject.kind === "mastery") {
        const players = resolveGrandArchivePlayers(amount.subject.player, context);
        if (players.length !== 1) {
          throw new GrandArchiveUnsupportedRuleError("singular mastery counter subject");
        }
        return grandArchiveMasteryCounterCount(
          context.state,
          players[0]!,
          amount.subject.name,
          amount.counter,
        );
      }
      if (amount.subject.kind === "source") {
        const masteryName = context.bindings.masterySourceName;
        const masteryPlayerBinding = context.bindings.masterySourcePlayer;
        if (Array.isArray(masteryPlayerBinding) && typeof masteryName === "string") {
          const masteryPlayers = resolveGrandArchivePlayers(
            { binding: "masterySourcePlayer" },
            context,
          );
          if (masteryPlayers.length !== 1) {
            throw new GrandArchiveUnsupportedRuleError("singular mastery source");
          }
          return grandArchiveMasteryCounterCount(
            context.state,
            masteryPlayers[0]!,
            masteryName,
            amount.counter,
          );
        }
      }
      const subject = valueSubjectToSubject(amount.subject);
      const basisContext =
        amount.basis === "last-known"
          ? { ...context, objectInformationBasis: "last-known" as const }
          : context;
      const object = resolveGrandArchiveSubjectObjects(subject, basisContext)[0];
      if (!object && amount.missing !== "zero")
        throw new GrandArchiveUnsupportedRuleError("missing counter subject");
      return object ? grandArchiveObjectCounterCount(object, amount.counter) : 0;
    }
    case "count":
      return distinctCollectionCount(
        resolveGrandArchiveCollection(amount.collection, context),
        amount.distinctBy,
        context,
      );
    case "aggregate-property": {
      const values = resolveGrandArchiveCollection(amount.collection, context)
        .map((object) => numericProperty(object, amount.property, context, amount.basis))
        .filter((value): value is number => value !== undefined);
      return aggregate(values, amount.operation, amount.emptyValue);
    }
    case "aggregate-counter-count": {
      return aggregate(
        resolveGrandArchiveCollection(amount.collection, context).map((object) =>
          grandArchiveObjectCounterCount(object, amount.counter),
        ),
        amount.operation,
        amount.emptyValue,
      );
    }
    case "sum-counters": {
      return resolveGrandArchiveCollection(amount.collection, context).reduce(
        (sum, object) => sum + grandArchiveObjectCounterCount(object, amount.counter),
        0,
      );
    }
    case "calculate": {
      const operands = amount.operands.map((operand) =>
        evaluateGrandArchiveAmount(operand, context),
      );
      const initial = operands[0];
      if (initial === undefined) throw new GrandArchiveUnsupportedRuleError("empty calculation");
      let value: number;
      const operator = amount.operator;
      switch (operator) {
        case "add":
          value = operands.reduce((sum, operand) => sum + operand, 0);
          break;
        case "subtract":
          value = operands.slice(1).reduce((result, operand) => result - operand, initial);
          break;
        case "multiply":
          value = operands.reduce((result, operand) => result * operand, 1);
          break;
        case "divide": {
          const divisors = operands.slice(1);
          if (divisors.some((divisor) => divisor === 0)) {
            throw new GrandArchiveUnsupportedRuleError("division by zero");
          }
          value = divisors.reduce((result, operand) => result / operand, initial);
          break;
        }
        case "minimum":
          value = Math.min(...operands);
          break;
        case "maximum":
          value = Math.max(...operands);
          break;
        default:
          return assertNever(operator);
      }
      const rounding = amount.operator === "divide" ? (amount.rounding ?? "down") : undefined;
      return rounding === "up" ? Math.ceil(value) : rounding === "down" ? Math.floor(value) : value;
    }
    case "target-count": {
      const stackItemIds =
        amount.ability === "event-stack-item"
          ? context.bindings.eventStackItem
          : context.resolvingStackItemId
            ? [context.resolvingStackItemId]
            : [];
      if (!Array.isArray(stackItemIds)) return 0;
      const ids = new Set(stackItemIds);
      return context.state.stack
        .filter((item) => ids.has(item.id))
        .reduce(
          (count, item) =>
            count +
            item.targets.reduce((targetCount, target) => targetCount + target.targetIds.length, 0),
          0,
        );
    }
    case "player-property": {
      const players = resolveGrandArchivePlayers(amount.player, context);
      if (players.length !== 1) {
        throw new GrandArchiveUnsupportedRuleError("singular player property");
      }
      return deriveGrandArchivePlayerProperty(players[0]!, amount.property, context);
    }
    case "aggregate-player-property":
      return aggregate(
        resolveGrandArchivePlayers(amount.players, context).map((playerId) =>
          deriveGrandArchivePlayerProperty(playerId, amount.property, context),
        ),
        amount.operation,
        amount.emptyValue,
      );
    case "player-zone-count":
      return resolveGrandArchivePlayers(amount.players, context).filter((playerId) =>
        compareGrandArchiveNumbers(
          grandArchivePlayerZoneCardCount(playerId, amount.zone, amount.filter, context),
          amount.comparison.operator,
          evaluateGrandArchiveAmount(amount.comparison.value, context),
        ),
      ).length;
    case "longest-consecutive-property-run":
      return longestConsecutiveRun(
        amount.collections.flatMap((collection) =>
          resolveGrandArchiveCollection(collection, context).flatMap((object) => {
            const value = numericProperty(object, amount.property, context, amount.basis);
            return value === undefined ? [] : [value];
          }),
        ),
      );
    case "conditional":
      return evaluateGrandArchiveAmount(
        evaluateGrandArchiveCondition(amount.condition, context) ? amount.then : amount.else,
        context,
      );
    case "activation-payment-card-count": {
      if (!context.sourceId) {
        throw new GrandArchiveUnsupportedRuleError("activation payment without source");
      }
      return activationPaymentForSource(context.sourceId, context).filter(
        (record) =>
          (amount.from === undefined || record.from === amount.from) &&
          (amount.to === undefined || record.to === amount.to),
      ).length;
    }
    case "all":
    case "event-amount": {
      const value = context.bindings.eventAmount;
      if (typeof value !== "number")
        throw new GrandArchiveUnsupportedRuleError("event amount outside event context");
      return value;
    }
    case "event-total": {
      if (!context.sourceId) {
        throw new GrandArchiveUnsupportedRuleError("event total without a source object");
      }
      const source = historicalObject(context.sourceId, context);
      if (!source) {
        throw new GrandArchiveUnsupportedRuleError("event total with an unknown source object");
      }
      const matches = observedHistoryEvents(amount.window, context).filter((observed) =>
        matchesGrandArchiveEventPattern(amount.event, observed, source, context),
      );
      return amount.metric === "event-count"
        ? matches.length
        : matches.reduce((total, observed) => total + (observed.amount ?? 0), 0);
    }
    case "die": {
      if (!context.rollDice) {
        throw new GrandArchiveUnsupportedRuleError("die roll outside effect resolution");
      }
      return context.rollDice(amount.sides, amount.count ?? 1);
    }
    case "modified-ability-result-amount": {
      const value = context.bindings[`modifiedResult:${amount.metric}`];
      if (typeof value !== "number") {
        throw new GrandArchiveUnsupportedRuleError(
          `modified result amount ${amount.metric} outside replacement context`,
        );
      }
      return value;
    }
    default:
      return assertNever(amount);
  }
}

/**
 * Adds derived X/Y/Z declarations to an evaluation in printed order.
 *
 * Static and duration-bearing effects do not pass through stack variable frames each time their
 * continuously changing values are queried. Their derived variables must therefore be rebuilt
 * from the effect source's current rules context before conditions or payloads are evaluated.
 */
export function withGrandArchiveDerivedVariables(
  declarations: readonly GrandArchiveVariableDeclaration[] | undefined,
  context: GrandArchiveEvaluationContext,
): GrandArchiveEvaluationContext {
  let variables: Readonly<Partial<Record<"X" | "Y" | "Z", number>>> = {
    ...context.variables,
  };
  for (const declaration of declarations ?? []) {
    if (declaration.kind !== "derived") continue;
    const contextual = { ...context, variables };
    variables = {
      ...variables,
      [declaration.symbol]: evaluateGrandArchiveAmount(declaration.amount, contextual),
    };
  }
  return { ...context, variables };
}

function aggregate(
  values: readonly number[],
  operation: "minimum" | "maximum" | "sum",
  emptyValue?: number,
): number {
  if (values.length === 0) {
    if (emptyValue === undefined) throw new GrandArchiveUnsupportedRuleError("empty aggregate");
    return emptyValue;
  }
  if (operation === "sum") return values.reduce((sum, value) => sum + value, 0);
  return operation === "minimum" ? Math.min(...values) : Math.max(...values);
}

function distinctCollectionCount(
  objects: readonly GrandArchiveCardInstance[],
  distinctBy: "name" | "type" | "element" | "class" | "reserve-cost" | undefined,
  context: GrandArchiveEvaluationContext,
): number {
  if (!distinctBy) return objects.length;
  const keys = new Set<string>();
  for (const object of objects) {
    const characteristics = deriveGrandArchiveCharacteristics(object, context);
    if (distinctBy === "name") {
      for (const value of characteristics.names) keys.add(value);
    } else if (distinctBy === "reserve-cost")
      keys.add(String(numericProperty(object, "reserve-cost", context)));
    else if (distinctBy === "type") for (const value of characteristics.types) keys.add(value);
    else if (distinctBy === "class") for (const value of characteristics.classes) keys.add(value);
    else if (distinctBy === "element")
      for (const value of characteristics.elements) keys.add(value);
  }
  return keys.size;
}

function valueSubjectToSubject(subject: GrandArchiveValueSubject): GrandArchiveSubject {
  switch (subject.kind) {
    case "source":
    case "ability-bearer":
    case "candidate":
    case "champion":
    case "event-source":
    case "event-subject":
    case "stack-source":
    case "event-recipient":
    case "event-attacker":
    case "linked-object":
    case "bound":
    case "tracked":
    case "player":
    case "mastery":
      return subject;
    default:
      return assertNever(subject);
  }
}

export function resolveGrandArchiveCollection(
  collection: GrandArchiveCollection,
  context: GrandArchiveEvaluationContext,
): readonly GrandArchiveCardInstance[] {
  const relationshipHosts = collection.host
    ? resolveGrandArchiveSubjectObjects(collection.host, context)
    : [];
  let objects = collection.history
    ? resolveHistoricalCollection(collection, collection.history, context)
    : collection.binding
      ? [...bindingObjects(collection.binding, context)]
      : Object.values(context.state.objects);
  if (collection.relationship === "lineage-of") {
    objects = [
      ...objects,
      ...relationshipHosts.map((host): GrandArchiveCardInstance => ({
        ...host,
        activeDefinitionId: undefined,
        zone: "inner-lineage",
        hostId: host.id,
      })),
    ];
  }
  if (collection.zones)
    objects = objects.filter((object) => collection.zones?.includes(object.zone));
  if (collection.player) {
    const players = resolveGrandArchivePlayers(collection.player, context);
    objects = objects.filter((object) => players.includes(object.controllerId));
  }
  if (collection.host) {
    const hosts = new Set(relationshipHosts.map((object) => object.id));
    switch (collection.relationship) {
      case "banished-by":
        objects = objects.filter(
          (object) =>
            object.zone === "banishment" &&
            object.banishedBySourceId !== undefined &&
            hosts.has(object.banishedBySourceId),
        );
        break;
      case "activation-payment-of":
        objects = objects.filter((object) =>
          [...hosts].some((hostId) =>
            activationPaymentForSource(hostId, context).some(
              (payment) => payment.objectId === object.id,
            ),
          ),
        );
        break;
      case "linked-to":
      case "loaded-into":
      case "lineage-of":
      case "intent-of":
      case undefined:
        objects = objects.filter(
          (object) => object.hostId !== undefined && hosts.has(object.hostId),
        );
        break;
      default:
        assertNever(collection.relationship);
    }
  } else if (collection.relationship) {
    throw new GrandArchiveUnsupportedRuleError(
      `collection relationship ${collection.relationship} without a host`,
    );
  }
  if (collection.filter)
    objects = objects.filter((object) =>
      matchesGrandArchiveCardFilter(object, collection.filter!, context),
    );
  if (collection.excludingSource && context.sourceId) {
    objects = objects.filter((object) => object.id !== context.sourceId);
  }
  return objects;
}

function historyWindowStart(
  window: NonNullable<GrandArchiveCollection["history"]>["window"] | "game",
  context: GrandArchiveEvaluationContext,
): number {
  const history = context.state.eventHistory;
  const lastIndex = (predicate: (event: (typeof history)[number]) => boolean): number => {
    for (let index = history.length - 1; index >= 0; index -= 1) {
      if (predicate(history[index]!)) return index;
    }
    return 0;
  };
  switch (window) {
    case "game":
      return 0;
    case "this-turn":
      return lastIndex((event) => event.type === "turn-started");
    case "this-phase":
      return lastIndex(
        (event) =>
          event.type === "phase-changed" ||
          event.type === "turn-started" ||
          event.type === "combat-started" ||
          event.type === "combat-ended",
      );
    case "this-attack":
      if (!context.state.combat) {
        throw new GrandArchiveUnsupportedRuleError("this-attack history outside combat");
      }
      return lastIndex((event) => event.type === "combat-started");
    case "this-resolution":
      if (context.resolutionStartedEventHistoryIndex === undefined) {
        throw new GrandArchiveUnsupportedRuleError("this-resolution history outside resolution");
      }
      return context.resolutionStartedEventHistoryIndex;
    default:
      return assertNever(window);
  }
}

function observedHistoryEvents(
  window: NonNullable<GrandArchiveCollection["history"]>["window"] | "game",
  context: GrandArchiveEvaluationContext,
): readonly GrandArchiveObservedEvent[] {
  return context.state.eventHistory
    .slice(historyWindowStart(window, context))
    .flatMap(observeGrandArchiveCommittedEvent);
}

function historicalObject(
  objectId: GrandArchiveObjectId,
  context: GrandArchiveEvaluationContext,
): GrandArchiveCardInstance | undefined {
  const current = context.state.objects[objectId];
  if (current) return current;
  for (let index = context.state.eventHistory.length - 1; index >= 0; index -= 1) {
    const event = context.state.eventHistory[index]!;
    if (event.type === "object-created" && event.object.id === objectId) return event.object;
    if (event.type === "object-removed-from-game" && event.object.id === objectId) {
      return event.object;
    }
    if (event.type === "tokens-summoned") {
      const summoned = event.objects.find((object) => object.id === objectId);
      if (summoned) return summoned;
    }
  }
  return undefined;
}

function historicalObservedObject(
  observed: GrandArchiveObservedEvent,
  context: GrandArchiveEvaluationContext,
): GrandArchiveCardInstance | undefined {
  if (!observed.subjectId) return undefined;
  const object = historicalObject(observed.subjectId, context);
  const event = observed.committedEvent;
  if (!object || event.type !== "object-moved" || event.objectId !== observed.subjectId) {
    return object;
  }
  return {
    ...object,
    ...(event.previousControllerId ? { controllerId: event.previousControllerId } : {}),
    activeDefinitionId: event.previousActiveDefinitionId,
    ...(event.previousCascadeCounts ? { cascadeCounts: event.previousCascadeCounts } : {}),
    ...(event.previousActivationPayment
      ? { activationPayment: event.previousActivationPayment }
      : {}),
    ...(event.previousActivationBindings
      ? { activationBindings: event.previousActivationBindings }
      : {}),
    ...(event.previousActivationVariables
      ? { activationVariables: event.previousActivationVariables }
      : {}),
  };
}

function resolveHistoricalCollection(
  collection: GrandArchiveCollection,
  history: NonNullable<GrandArchiveCollection["history"]>,
  context: GrandArchiveEvaluationContext,
): GrandArchiveCardInstance[] {
  if (collection.binding || collection.host || collection.relationship) {
    throw new GrandArchiveUnsupportedRuleError("historical collection relationship or binding");
  }
  return observedHistoryEvents(history.window, context).flatMap((observed) => {
    if (
      observed.name !== history.event ||
      (observed.actorId !== undefined && observed.actorId !== context.controllerId) ||
      (history.keywordAction !== undefined && observed.keywordAction !== history.keywordAction) ||
      (history.from !== undefined && observed.from !== history.from) ||
      observed.subjectId === undefined
    ) {
      return [];
    }
    const object = historicalObservedObject(observed, context);
    return object ? [object] : [];
  });
}

export function matchesGrandArchiveCardFilter(
  object: GrandArchiveCardInstance,
  filter: GrandArchiveCardFilter,
  context: GrandArchiveEvaluationContext,
): boolean {
  const face = grandArchiveActiveFace(context.program, object);
  let derivedCharacteristics: ReturnType<typeof deriveGrandArchiveCharacteristics> | undefined;
  const characteristics = () =>
    (derivedCharacteristics ??= deriveGrandArchiveCharacteristics(object, context));
  const card = requireGrandArchiveCard(
    context.program,
    object.activeDefinitionId ?? object.definitionId,
  );
  switch (filter.kind) {
    case "all":
      return filter.filters.every((child) => matchesGrandArchiveCardFilter(object, child, context));
    case "any":
      return filter.filters.some((child) => matchesGrandArchiveCardFilter(object, child, context));
    case "not":
      return !matchesGrandArchiveCardFilter(object, filter.filter, context);
    case "name":
      return filter.match === "contains"
        ? characteristics().names.some((name) => name.includes(filter.value))
        : characteristics().names.includes(filter.value);
    case "champion-name":
      return (
        characteristics().types.includes("CHAMPION") &&
        (face.lineageName ?? characteristics().names[0]?.split(",", 1)[0]) === filter.value
      );
    case "canonical-id":
      return object.definitionId === filter.value;
    case "not-source": {
      const source = context.sourceId ? context.state.objects[context.sourceId] : undefined;
      if (source && object.zone === "inner-lineage" && object.hostId === source.id) {
        return object.definitionId !== (source.activeDefinitionId ?? source.definitionId);
      }
      return object.id !== context.sourceId;
    }
    case "not-subject":
      return !resolveGrandArchiveSubjectObjects(filter.subject, context).some(
        (candidate) => candidate.id === object.id,
      );
    case "type":
      return filter.oneOf.some((type) => characteristics().types.includes(type));
    case "class":
      return filter.oneOf.some((value) => characteristics().classes.includes(value));
    case "element":
      return filter.oneOf.some((value) => characteristics().elements.includes(value));
    case "element-category": {
      return characteristics().elements.some((element) => {
        const isBasic = element === "FIRE" || element === "WATER" || element === "WIND";
        const isAdvanced = element !== "NORM" && !isBasic;
        return filter.value === "basic"
          ? isBasic
          : filter.value === "advanced"
            ? isAdvanced
            : !isAdvanced;
      });
    }
    case "subtype":
      return filter.oneOf.some((value) => characteristics().subtypes.includes(value));
    case "supertype":
      return filter.oneOf.some((value) => characteristics().supertypes.includes(value));
    case "speed":
      return face.speed !== undefined && filter.oneOf.includes(face.speed);
    case "zone":
      return filter.oneOf.includes(object.zone);
    case "facing":
      return object.facing === filter.value;
    case "has-counter":
      return grandArchiveObjectCounterCount(object, filter.counter) > 0;
    case "attacking-subject": {
      const combat = context.state.combat;
      return Boolean(
        combat &&
        combat.attackerId === object.id &&
        object.states.has("attacking") &&
        resolveGrandArchiveSubjectObjects(filter.defender, context).some(
          (defender) => defender.states.has("defending") && combat.targetIds.includes(defender.id),
        ),
      );
    }
    case "object-state":
      return grandArchiveObjectHasState(context.state, object, filter.state);
    case "activation-state":
      return object.activationStates.has(filter.state);
    case "token":
      return object.isToken === filter.value;
    case "linked":
      return (
        (object.hostId !== undefined ||
          Object.values(context.state.objects).some(
            (candidate) => candidate.zone === "field" && candidate.hostId === object.id,
          )) === filter.value
      );
    case "numeric": {
      const left = evaluateFilterAmount(filter.comparison.left, {
        ...context,
        candidateId: object.id,
      });
      const right = evaluateFilterAmount(filter.comparison.right, {
        ...context,
        candidateId: object.id,
      });
      return (
        left !== undefined &&
        right !== undefined &&
        compareGrandArchiveNumbers(left, filter.comparison.operator, right)
      );
    }
    case "parity": {
      const value = numericProperty(object, filter.property, context);
      return value !== undefined && Math.abs(value % 2) === (filter.value === "even" ? 0 : 1);
    }
    case "has-keyword": {
      const activeKeywords =
        context.keywordOverrides?.get(object.id) ??
        grandArchiveObjectActiveKeywords(
          context.program,
          context.state,
          object,
          context.derivingProperties ? { derivingProperties: context.derivingProperties } : {},
        );
      return (
        (filter.keyword === "siegeable" &&
          grandArchiveCharacteristicsAreSiegeable(characteristics())) ||
        activeKeywords.some((keyword) => keyword.name === filter.keyword)
      );
    }
    case "matches-tracked-characteristic": {
      return matchesTrackedCharacteristic(
        trackedCharacteristicValues(context, filter.key),
        filter.characteristic,
        characteristics(),
      );
    }
    case "has-link-keyword":
      return (
        context.keywordOverrides?.get(object.id) ??
        grandArchiveObjectActiveKeywords(
          context.program,
          context.state,
          object,
          context.derivingProperties ? { derivingProperties: context.derivingProperties } : {},
        )
      ).some((keyword) => keyword.name === "link" && keyword.target === filter.target);
    case "entered-field-this-turn": {
      const turnStart = historyWindowStart("this-turn", context);
      return context.state.eventHistory.slice(turnStart).some((event) => {
        if (event.type === "object-moved") {
          return event.objectId === object.id && event.to === "field";
        }
        if (event.type === "object-created") {
          return event.object.id === object.id && event.object.zone === "field";
        }
        return (
          event.type === "tokens-summoned" &&
          event.objects.some((summoned) => summoned.id === object.id)
        );
      });
    }
    case "same-characteristic": {
      const references = bindingObjects(filter.binding, context);
      const characteristic = filter.characteristic;
      return references.some((reference) => {
        const referenceCharacteristics = deriveGrandArchiveCharacteristics(reference, context);
        switch (characteristic) {
          case "name":
            return characteristics().names.some((value) =>
              referenceCharacteristics.names.includes(value),
            );
          case "type":
            return characteristics().types.some((value) =>
              referenceCharacteristics.types.includes(value),
            );
          case "class":
            return characteristics().classes.some((value) =>
              referenceCharacteristics.classes.includes(value),
            );
          case "element":
            return characteristics().elements.some((value) =>
              referenceCharacteristics.elements.includes(value),
            );
          case "subtype":
            return characteristics().subtypes.some((value) =>
              referenceCharacteristics.subtypes.includes(value),
            );
          case "reserve-cost": {
            const value = numericProperty(object, "reserve-cost", context);
            const referenceValue = numericProperty(reference, "reserve-cost", context);
            return value !== undefined && referenceValue !== undefined && value === referenceValue;
          }
          default:
            return assertNever(characteristic);
        }
      });
    }
    default:
      return assertNever(filter);
  }
}

export function evaluateGrandArchiveCondition(
  condition: GrandArchiveCondition,
  context: GrandArchiveEvaluationContext,
): boolean {
  switch (condition.kind) {
    case "all":
      return condition.conditions.every((child) => evaluateGrandArchiveCondition(child, context));
    case "any":
      return condition.conditions.some((child) => evaluateGrandArchiveCondition(child, context));
    case "not":
      return !evaluateGrandArchiveCondition(condition.condition, context);
    case "compare":
      return compareGrandArchiveNumbers(
        evaluateGrandArchiveAmount(condition.comparison.left, context),
        condition.comparison.operator,
        evaluateGrandArchiveAmount(condition.comparison.right, context),
      );
    case "collection-exists":
      return resolveGrandArchiveCollection(condition.collection, context).length > 0;
    case "subject-matches": {
      const subjects = resolveGrandArchiveSubjectObjects(condition.subject, context);
      return (
        subjects.length > 0 &&
        subjects.every((object) => matchesGrandArchiveCardFilter(object, condition.filter, context))
      );
    }
    case "shares-characteristic": {
      const left = resolveGrandArchiveSubjectObjects(condition.left, context);
      const right = resolveGrandArchiveSubjectObjects(condition.right, context);
      if (left.length === 0 || right.length === 0) return false;
      const excluded = new Set(condition.exclude ?? []);
      return left.some((leftObject) => {
        const values = new Set(
          objectCharacteristicValues(leftObject, condition.characteristic, context).filter(
            (value): value is string => typeof value === "string" && !excluded.has(value),
          ),
        );
        return right.some((rightObject) =>
          objectCharacteristicValues(rightObject, condition.characteristic, context).some(
            (value) => typeof value === "string" && values.has(value),
          ),
        );
      });
    }
    case "controls": {
      const players = resolveGrandArchivePlayers(condition.player, context);
      return Object.values(context.state.objects).some(
        (object) =>
          object.zone === "field" &&
          players.includes(object.controllerId) &&
          matchesGrandArchiveCardFilter(object, condition.filter, context),
      );
    }
    case "controls-subject": {
      const players = resolveGrandArchivePlayers(condition.player, context);
      const subjects = resolveGrandArchiveSubjectObjects(condition.subject, context);
      return (
        subjects.length > 0 && subjects.every((object) => players.includes(object.controllerId))
      );
    }
    case "owns-subject": {
      const players = resolveGrandArchivePlayers(condition.player, context);
      const subjects = resolveGrandArchiveSubjectObjects(condition.subject, context);
      return subjects.length > 0 && subjects.every((object) => players.includes(object.ownerId));
    }
    case "has-related-object": {
      const subjects = resolveGrandArchiveSubjectObjects(condition.subject, context);
      return subjects.some((subject) => {
        const information = subject.hostId
          ? subject
          : (lastKnownMoveEvent(context.state, subject.id)?.previousObject ?? subject);
        const host = information.hostId ? context.state.objects[information.hostId] : undefined;
        const related =
          condition.relation === "host"
            ? host
              ? [host]
              : []
            : host
              ? [host]
              : Object.values(context.state.objects).filter(
                  (object) => object.hostId === information.id,
                );
        return related.some(
          (object) =>
            !condition.filter || matchesGrandArchiveCardFilter(object, condition.filter, context),
        );
      });
    }
    case "combat-relation": {
      const combat = context.state.combat;
      if (!combat) return false;
      const subjects = resolveGrandArchiveSubjectObjects(condition.subject, context);
      const attacker = context.state.objects[combat.attackerId];
      const defenders = combat.targetIds.flatMap((objectId) => {
        const object = context.state.objects[objectId];
        return object?.states.has("defending") ? [object] : [];
      });
      const involvedObjects = [
        ...combat.intentIds.flatMap((objectId) => {
          const object = context.state.objects[objectId];
          return object?.zone === "intent" ? [object] : [];
        }),
        ...combat.weaponIds.flatMap((objectId) => {
          const object = context.state.objects[objectId];
          return object?.zone === "field" ? [object] : [];
        }),
      ];
      if (condition.relation === "attacking") {
        if (!subjects.some((subject) => subject.id === combat.attackerId)) return false;
        if (
          condition.other &&
          !resolveGrandArchiveSubjectObjects(condition.other, context).some((other) =>
            defenders.some((defender) => defender.id === other.id),
          )
        ) {
          return false;
        }
        if (
          condition.otherFilter &&
          !defenders.some((defender) =>
            matchesGrandArchiveCardFilter(defender, condition.otherFilter!, context),
          )
        ) {
          return false;
        }
        if (
          condition.using &&
          !resolveGrandArchiveSubjectObjects(condition.using, context).some((used) =>
            involvedObjects.some((involved) => involved.id === used.id),
          )
        ) {
          return false;
        }
        if (
          condition.usingFilter &&
          !involvedObjects.some((involved) =>
            matchesGrandArchiveCardFilter(involved, condition.usingFilter!, context),
          )
        ) {
          return false;
        }
        return true;
      }
      if (!subjects.some((subject) => combat.retaliatorIds.includes(subject.id))) return false;
      if (!attacker) return false;
      if (
        condition.other &&
        !resolveGrandArchiveSubjectObjects(condition.other, context).some(
          (other) => other.id === attacker.id,
        )
      ) {
        return false;
      }
      return (
        !condition.otherFilter ||
        matchesGrandArchiveCardFilter(attacker, condition.otherFilter, context)
      );
    }
    case "current-attack-target-matches": {
      const combat = context.state.combat;
      if (!combat || combat.cleavePlayerId) return false;
      const controllers = condition.controller
        ? new Set(resolveGrandArchivePlayers(condition.controller, context))
        : undefined;
      return combat.targetIds.some((objectId) => {
        const target = context.state.objects[objectId];
        return Boolean(
          target?.states.has("defending") &&
          (!controllers || controllers.has(target.controllerId)) &&
          (!condition.filter || matchesGrandArchiveCardFilter(target, condition.filter, context)),
        );
      });
    }
    case "turn-player": {
      if (condition.player === "opponent" || condition.player === "another-player") {
        return context.state.turn.playerId !== context.controllerId;
      }
      return resolveGrandArchivePlayers(condition.player, context).includes(
        context.state.turn.playerId,
      );
    }
    case "player-relation": {
      const players = resolveGrandArchivePlayers(condition.player, context);
      return (
        players.length > 0 &&
        players.every((playerId) =>
          condition.relation === "controller"
            ? playerId === context.controllerId
            : playerId !== context.controllerId,
        )
      );
    }
    case "player-turn-count": {
      const players = resolveGrandArchivePlayers(condition.player, context);
      if (players.length !== 1) {
        throw new GrandArchiveUnsupportedRuleError("singular player turn count");
      }
      const playerId = players[0]!;
      const initialTurn = context.state.turnOrder[0] === playerId ? 1 : 0;
      const count =
        initialTurn +
        context.state.eventHistory.filter(
          (event) => event.type === "turn-started" && event.playerId === playerId,
        ).length;
      return compareGrandArchiveNumbers(
        count,
        condition.operator,
        evaluateGrandArchiveAmount(condition.value, context),
      );
    }
    case "phase":
      return context.state.turn.phase === condition.phase;
    case "has-counter": {
      const count = resolveGrandArchiveSubjectObjects(condition.subject, context).reduce(
        (sum, object) => sum + grandArchiveObjectCounterCount(object, condition.counter),
        0,
      );
      return condition.comparison
        ? compareGrandArchiveNumbers(
            evaluateGrandArchiveAmount(condition.comparison.left, {
              ...context,
              bindings: { ...context.bindings, counterCount: count },
            }),
            condition.comparison.operator,
            evaluateGrandArchiveAmount(condition.comparison.right, {
              ...context,
              bindings: { ...context.bindings, counterCount: count },
            }),
          )
        : count > 0;
    }
    case "counter-count-parity": {
      const count = resolveGrandArchiveSubjectObjects(condition.subject, context).reduce(
        (sum, object) => sum + grandArchiveObjectCounterCount(object, condition.counter),
        0,
      );
      return condition.value === "even" ? count % 2 === 0 : Math.abs(count % 2) === 1;
    }
    case "numeric-property-parity": {
      const basisContext =
        condition.basis === "last-known"
          ? { ...context, objectInformationBasis: "last-known" as const }
          : context;
      const object = resolveGrandArchiveSubjectObjects(condition.subject, basisContext)[0];
      if (!object) return false;
      const value = numericProperty(object, condition.property, basisContext, condition.basis);
      if (value === undefined) return false;
      return condition.value === "even" ? value % 2 === 0 : Math.abs(value % 2) === 1;
    }
    case "object-state": {
      const objects = resolveGrandArchiveSubjectObjects(
        condition.subject,
        condition.basis === "last-known"
          ? { ...context, objectInformationBasis: "last-known" }
          : context,
      );
      return (
        objects.length > 0 &&
        objects.every((object) =>
          grandArchiveObjectHasState(context.state, object, condition.state),
        )
      );
    }
    case "player-state": {
      const eventState = context.bindings.eventState;
      const state =
        typeof condition.state === "object" && "kind" in condition.state
          ? typeof eventState === "string"
            ? { named: eventState }
            : undefined
          : condition.state;
      if (!state) {
        throw new GrandArchiveUnsupportedRuleError("event player state outside event context");
      }
      return resolveGrandArchivePlayers(condition.player, context).every((playerId) =>
        grandArchivePlayerHasState(context.program, context.state, playerId, state, context),
      );
    }
    case "player-property-compare": {
      const values = resolveGrandArchivePlayers(condition.players, context).map((playerId) =>
        compareGrandArchiveNumbers(
          deriveGrandArchivePlayerProperty(playerId, condition.property, context),
          condition.operator,
          evaluateGrandArchiveAmount(condition.value, context),
        ),
      );
      return condition.quantifier === "all" ? values.every(Boolean) : values.some(Boolean);
    }
    case "player-property-extreme": {
      const players = resolveGrandArchivePlayers(condition.player, context);
      if (players.length !== 1) {
        throw new GrandArchiveUnsupportedRuleError("singular player property extreme");
      }
      const playerId = players[0]!;
      const active = activePlayers(context);
      if (!active.includes(playerId)) return false;
      const values = active.map((candidateId) => ({
        playerId: candidateId,
        value: deriveGrandArchivePlayerProperty(candidateId, condition.property, context),
      }));
      const extreme =
        condition.extreme === "minimum"
          ? Math.min(...values.map(({ value }) => value))
          : Math.max(...values.map(({ value }) => value));
      if (deriveGrandArchivePlayerProperty(playerId, condition.property, context) !== extreme) {
        return false;
      }
      return (
        condition.ties === "qualify" || values.filter(({ value }) => value === extreme).length === 1
      );
    }
    case "player-zone-count": {
      const values = resolveGrandArchivePlayers(condition.players, context).map((playerId) =>
        compareGrandArchiveNumbers(
          grandArchivePlayerZoneCardCount(playerId, condition.zone, condition.filter, context),
          condition.operator,
          evaluateGrandArchiveAmount(condition.value, context),
        ),
      );
      return condition.quantifier === "all" ? values.every(Boolean) : values.some(Boolean);
    }
    case "mastery-has-counter": {
      if (!grandArchivePlayerMastery(context.state, context.controllerId, condition.mastery)) {
        return false;
      }
      const count = grandArchiveMasteryCounterCount(
        context.state,
        context.controllerId,
        condition.mastery,
        condition.counter,
      );
      return count >= evaluateGrandArchiveAmount(condition.minimum, context);
    }
    case "activation-state": {
      if (context.announcementActivationStates?.includes(condition.state)) return true;
      const resolvingItem = context.state.resolution
        ? context.state.stack.find((item) => item.id === context.state.resolution?.stackItemId)
        : undefined;
      if (resolvingItem?.activationStates.includes(condition.state)) return true;
      const source = context.sourceId
        ? grandArchiveEvaluationObject(context.sourceId, context, true)
        : undefined;
      return source?.activationStates.has(condition.state) ?? false;
    }
    case "source-activation-context": {
      const item = resolvingStackItem(context);
      if (!item || (context.sourceId !== undefined && item.sourceId !== context.sourceId)) {
        throw new GrandArchiveUnsupportedRuleError("source activation context outside resolution");
      }
      if (condition.phase !== undefined && item.activationPhase !== condition.phase) return false;
      if (
        condition.from !== undefined &&
        (!("originZone" in item) || item.originZone !== condition.from)
      ) {
        return false;
      }
      if (condition.reservedCardsToMemory) {
        return compareGrandArchiveNumbers(
          evaluateGrandArchiveAmount(condition.reservedCardsToMemory.left, context),
          condition.reservedCardsToMemory.operator,
          evaluateGrandArchiveAmount(condition.reservedCardsToMemory.right, context),
        );
      }
      return true;
    }
    case "source-zone": {
      const source = context.sourceId
        ? grandArchiveEvaluationObject(context.sourceId, context, true)
        : undefined;
      return (
        source?.zone === condition.zone &&
        (!condition.state || grandArchiveObjectHasState(context.state, source, condition.state))
      );
    }
    case "source-activation-zone": {
      const source = context.sourceId
        ? grandArchiveEvaluationObject(context.sourceId, context, true)
        : undefined;
      return source?.zone === condition.zone;
    }
    case "subjects-in-zone": {
      const values = resolveGrandArchiveSubjectObjects(condition.subject, context).map(
        (object) => object.zone === condition.zone,
      );
      return (
        values.length > 0 &&
        (condition.quantifier === "all" ? values.every(Boolean) : values.some(Boolean))
      );
    }
    case "collection-count-parity": {
      const count = resolveGrandArchiveCollection(condition.collection, context).length;
      return condition.value === "even" ? count % 2 === 0 : count % 2 === 1;
    }
    case "collection-has-shared-characteristic": {
      const minimum = evaluateGrandArchiveAmount(condition.minimumMatching, context);
      const counts = new Map<string | number, number>();
      for (const object of resolveGrandArchiveCollection(condition.collection, context)) {
        for (const value of new Set(
          objectCharacteristicValues(object, condition.characteristic, context),
        )) {
          counts.set(value, (counts.get(value) ?? 0) + 1);
        }
      }
      return [...counts.values()].some((count) => count >= minimum);
    }
    case "target-is-legal":
      return bindingObjects(condition.binding, context).length > 0;
    case "paid-cost":
      return context.bindings[condition.binding] === true;
    case "effect-succeeded":
      return context.bindings[condition.binding] === true;
    case "effect-result-origin":
      return bindingObjects(condition.binding, context).some(
        (object) => lastKnownMoveEvent(context.state, object.id)?.from === condition.zone,
      );
    case "champion-lineage-is":
      return resolveGrandArchiveSubjectObjects(
        { kind: "champion", player: "controller" },
        context,
      ).some(
        (object) => grandArchiveActiveFace(context.program, object).lineageName === condition.name,
      );
    case "champion-matches-source": {
      const source = context.sourceId
        ? grandArchiveEvaluationObject(context.sourceId, context, true)
        : undefined;
      if (!source) return false;
      const sourceFace = grandArchiveActiveFace(context.program, source);
      const sourceCharacteristics = deriveGrandArchiveCharacteristics(source, context);
      return resolveGrandArchiveSubjectObjects(
        { kind: "champion", player: "controller" },
        context,
      ).some((champion) => {
        const championFace = grandArchiveActiveFace(context.program, champion);
        const championCharacteristics = deriveGrandArchiveCharacteristics(champion, context);
        switch (condition.characteristic) {
          case "class":
            return sourceCharacteristics.classes.some((value) =>
              championCharacteristics.classes.includes(value),
            );
          case "element":
            return sourceCharacteristics.elements.some((value) =>
              championCharacteristics.elements.includes(value),
            );
          case "lineage-name":
            return (
              sourceFace.lineageName !== undefined &&
              sourceFace.lineageName === championFace.lineageName
            );
        }
      });
    }
    case "ability-target-matches": {
      const targets = currentAbilityTargetObjects(context);
      const values = targets.map((target) =>
        matchesGrandArchiveCardFilter(target, condition.filter, context),
      );
      return (
        values.length > 0 &&
        (condition.quantifier === "all" ? values.every(Boolean) : values.some(Boolean))
      );
    }
    case "ability-target-characteristic-in-collection": {
      const targets = currentAbilityTargetObjects(context);
      const collection = resolveGrandArchiveCollection(condition.collection, context);
      const values = targets.map((target) => {
        const targetValues = new Set(
          objectCharacteristicValues(target, condition.characteristic, context),
        );
        return collection.some((object) =>
          objectCharacteristicValues(object, condition.characteristic, context).some((value) =>
            targetValues.has(value),
          ),
        );
      });
      return (
        values.length > 0 &&
        (condition.quantifier === "all" ? values.every(Boolean) : values.some(Boolean))
      );
    }
    case "ability-targets-subject": {
      const targetIds = new Set(currentAbilityTargetIds(context));
      const values = resolveGrandArchiveSubjectObjects(condition.subject, context).map((object) =>
        targetIds.has(object.id),
      );
      return (
        values.length > 0 &&
        (condition.quantifier === "all" ? values.every(Boolean) : values.some(Boolean))
      );
    }
    case "ability-activation-count": {
      const windowStart = historyWindowStart(condition.window, context);
      const count = [...matchingAbilityStackEntries(context).values()].filter(
        ({ index }) => index >= windowStart,
      ).length;
      return compareGrandArchiveNumbers(
        count,
        condition.operator,
        evaluateGrandArchiveAmount(condition.value, context),
      );
    }
    case "ability-resolution-count": {
      const entries = matchingAbilityStackEntries(context);
      const windowStart = historyWindowStart(condition.window, context);
      let count = context.state.eventHistory
        .slice(windowStart)
        .filter(
          (event) =>
            event.type === "stack-item-removed" &&
            event.outcome === "resolved" &&
            entries.has(event.itemId),
        ).length;
      const current = resolvingStackItem(context);
      if (
        condition.includesCurrent &&
        current &&
        (current.kind === "activated-ability" || current.kind === "triggered-ability") &&
        current.sourceId === context.sourceId &&
        current.ability.id === context.abilityId &&
        entries.has(current.id)
      ) {
        count += 1;
      }
      return compareGrandArchiveNumbers(
        count,
        condition.operator,
        evaluateGrandArchiveAmount(condition.value, context),
      );
    }
    case "history": {
      const actors = condition.actor
        ? new Set(resolveGrandArchivePlayers(condition.actor, context))
        : undefined;
      const stackControllers = condition.stackItemController
        ? new Set(resolveGrandArchivePlayers(condition.stackItemController, context))
        : undefined;
      const subjects = condition.subject
        ? new Set(resolveGrandArchiveSubjectObjects(condition.subject, context).map(({ id }) => id))
        : undefined;
      const recipients = condition.recipient
        ? new Set(
            resolveGrandArchiveSubjectObjects(condition.recipient, context).map(({ id }) => id),
          )
        : undefined;
      const sources = condition.source
        ? new Set(resolveGrandArchiveSubjectObjects(condition.source, context).map(({ id }) => id))
        : undefined;
      const count = observedHistoryEvents(condition.window, context).filter((observed) => {
        if (observed.name !== condition.event) return false;
        if (actors && (!observed.actorId || !actors.has(observed.actorId))) return false;
        if (stackControllers && (!observed.actorId || !stackControllers.has(observed.actorId)))
          return false;
        if (subjects && (!observed.subjectId || !subjects.has(observed.subjectId))) return false;
        if (recipients && (!observed.recipientId || !recipients.has(observed.recipientId)))
          return false;
        if (sources && (!observed.sourceId || !sources.has(observed.sourceId))) return false;
        if (condition.filter) {
          const object = historicalObservedObject(observed, context);
          const event = observed.committedEvent;
          const historicalContext =
            object &&
            (event.type === "stack-item-added" || event.type === "stack-item-deferred") &&
            event.sourceCharacteristics
              ? {
                  ...context,
                  characteristicOverrides: new Map([
                    ...(context.characteristicOverrides?.entries() ?? []),
                    [object.id, event.sourceCharacteristics] as const,
                  ]),
                }
              : context;
          if (
            !object ||
            !matchesGrandArchiveCardFilter(object, condition.filter, historicalContext)
          ) {
            return false;
          }
        }
        if (
          condition.activationState &&
          !observed.activationStates?.includes(condition.activationState)
        )
          return false;
        if (condition.keywordAction && observed.keywordAction !== condition.keywordAction)
          return false;
        if (
          condition.combatDamage !== undefined &&
          (observed.combatDamage === true) !== condition.combatDamage
        )
          return false;
        if (
          condition.directionTransition &&
          (observed.stateFrom !== condition.directionTransition.from ||
            observed.stateTo !== condition.directionTransition.to)
        )
          return false;
        if (
          condition.itemTypes &&
          (!observed.stackItemType || !condition.itemTypes.includes(observed.stackItemType))
        )
          return false;
        if (
          condition.eventAmountMinimum !== undefined &&
          (observed.amount === undefined ||
            observed.amount < evaluateGrandArchiveAmount(condition.eventAmountMinimum, context))
        )
          return false;
        return true;
      }).length;
      return count >= evaluateGrandArchiveAmount(condition.minimum ?? 1, context);
    }
    case "starting-deck-count": {
      const definitions =
        context.state.players[context.controllerId]?.startingDeckDefinitionIds[condition.zone];
      if (!definitions) {
        throw new GrandArchiveUnsupportedRuleError("starting-deck identity");
      }
      const filter = condition.filter;
      const count = filter
        ? definitions.filter((definitionId) =>
            startingDeckDefinitionMatchesFilter(definitionId, filter, context),
          ).length
        : definitions.length;
      return compareGrandArchiveNumbers(
        count,
        condition.operator,
        evaluateGrandArchiveAmount(condition.value, context),
      );
    }
    default:
      return assertNever(condition);
  }
}

function assertNever(value: never): never {
  throw new Error(`Unhandled Grand Archive rules variant: ${JSON.stringify(value)}`);
}
