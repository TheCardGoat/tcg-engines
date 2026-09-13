import { grandArchiveEventRecipientBinding } from "../../kernel/observed-events.ts";
import { continuousEffectSourceContext } from "../state/continuous-source.ts";
import type {
  GrandArchiveEventPattern,
  GrandArchiveEventSubject,
  GrandArchiveTriggerMultiplierEffect,
  GrandArchiveTriggeredAbility,
} from "@tcg/grand-archive-types";
import {
  declareGrandArchiveTargetsWithRandom,
  getGrandArchiveAnnouncementModes,
  grandArchiveAnnouncementModesHaveLegalSelection,
  grandArchiveTargetDeclarationHasLegalSelection,
  grandArchiveTargetingContext,
} from "../../procedures/activation/activation.ts";
import {
  flattenGrandArchiveAbilities,
  grandArchiveAbilityExecutionObject,
  grandArchiveAbilityIsFunctional,
  grandArchiveAbilityFunctionalZones,
  grandArchiveObjectFace,
} from "../../game/card-runtime.ts";
import {
  currentGrandArchiveDelayedTriggerBindings,
  grandArchiveDelayedTriggerIsActive,
} from "./delayed-triggers.ts";
import type { GrandArchiveCommittedEvent, GrandArchiveProposedEvent } from "../../kernel/events.ts";
import {
  evaluateGrandArchiveCondition,
  evaluateGrandArchiveAmount,
  grandArchiveCounterKey,
  grandArchiveEvaluationObject,
  grandArchiveLastKnownObject,
  matchesGrandArchiveEventPattern,
  resolveGrandArchivePlayers,
  GrandArchiveUnsupportedRuleError,
  withGrandArchiveDerivedVariables,
  type GrandArchiveEvaluationContext,
} from "../../procedures/effects/evaluation.ts";
import {
  grandArchiveContinuousEffectIsActive,
  grandArchiveObjectCurrentCharacteristics,
  grandArchiveObjectTimestamp,
} from "../state/continuous.ts";
import { grandArchiveDecisionId, grandArchiveStackItemId } from "../../game/identity.ts";
import type { GrandArchiveEventId } from "../../game/identity.ts";
import {
  grandArchiveObjectActiveAbilities,
  grandArchiveObjectActiveKeywords,
} from "./intrinsic-keywords.ts";
import type { GrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type {
  GrandArchiveCardInstance,
  GrandArchiveDeclaredTarget,
  GrandArchiveMatchState,
  GrandArchivePendingTrigger,
  GrandArchiveStackItem,
} from "../../game/model.ts";
import { grandArchiveModifiedResultBinding } from "../../kernel/modified-results.ts";
import {
  observeGrandArchiveCommittedEvent,
  type GrandArchiveObservedEvent,
} from "../../kernel/observed-events.ts";
import {
  activeGrandArchivePlayers,
  grandArchiveOpportunityIsSuppressed,
  openGrandArchiveOpportunity,
} from "../../procedures/game-flow/opportunity.ts";
import { grandArchivePlayerHasState } from "../state/player-continuous.ts";
import {
  grandArchiveActiveMasteryAbilities,
  grandArchivePlayerMastery,
} from "../../game/mastery.ts";
import {
  GRAND_ARCHIVE_STATIC_COUNTER_TRIGGERED_ABILITY,
  GRAND_ARCHIVE_WITHER_TRIGGERED_ABILITY,
} from "./game-abilities.ts";
import { GRAND_ARCHIVE_CROWDS_FAVOR_TARGETED_ABILITY } from "./status-abilities.ts";

function sourceWasDealtDamageSincePreviousTurnEnd(
  state: GrandArchiveMatchState,
  source: GrandArchiveCardInstance,
): boolean {
  let turnPlayerId = state.turnOrder[0];
  let previousEndIndex = -1;
  let currentObjectStartedIndex = -1;
  for (let index = 0; index < state.eventHistory.length; index += 1) {
    const event = state.eventHistory[index]!;
    if (event.type === "turn-started") turnPlayerId = event.playerId;
    if (event.type === "object-moved" && event.objectId === source.id && event.to === "field") {
      currentObjectStartedIndex = index;
    }
    if (
      event.type === "phase-changed" &&
      event.phase === "end" &&
      turnPlayerId === source.controllerId
    ) {
      previousEndIndex = index;
    }
  }
  return state.eventHistory
    .slice(Math.max(previousEndIndex, currentObjectStartedIndex) + 1)
    .some(
      (event) => event.type === "damage-marked" && event.objectId === source.id && event.amount > 0,
    );
}

function triggerMatches(
  ability: GrandArchiveTriggeredAbility,
  observed: GrandArchiveObservedEvent,
  source: GrandArchiveCardInstance,
  evaluation: GrandArchiveEvaluationContext,
): boolean {
  if ("intrinsic" in ability && ability.intrinsic) {
    if (ability.keyword.name === "intercept") {
      const event = observed.committedEvent;
      const combat = event.type === "combat-started" ? event.combat : undefined;
      return Boolean(
        combat &&
        observed.subjectId === combat.attackerId &&
        !combat.cleavePlayerId &&
        source.zone === "field" &&
        !source.states.has("rested") &&
        !combat.targetIds.includes(source.id) &&
        grandArchiveObjectCurrentCharacteristics(
          evaluation.program,
          evaluation.state,
          source,
        ).types.includes("ALLY") &&
        combat.targetIds.some((objectId) => {
          const target = evaluation.state.objects[objectId];
          return (
            target?.zone === "field" &&
            target.controllerId === source.controllerId &&
            grandArchiveObjectCurrentCharacteristics(
              evaluation.program,
              evaluation.state,
              target,
            ).types.includes("CHAMPION")
          );
        }),
      );
    }
    if (ability.keyword.name === "vigor") {
      const event = observed.committedEvent;
      return (
        event.type === "phase-changed" &&
        event.phase === "end" &&
        source.zone === "field" &&
        grandArchiveObjectCurrentCharacteristics(
          evaluation.program,
          evaluation.state,
          source,
        ).types.some((type) => type === "ALLY" || type === "CHAMPION") &&
        evaluation.state.turn.playerId === source.controllerId
      );
    }
    if (ability.keyword.name === "foster") {
      const event = observed.committedEvent;
      return (
        event.type === "phase-changed" &&
        event.phase === "recollection" &&
        source.zone === "field" &&
        !source.states.has("fostered") &&
        grandArchiveObjectCurrentCharacteristics(
          evaluation.program,
          evaluation.state,
          source,
        ).types.includes("ALLY") &&
        evaluation.state.turn.playerId === source.controllerId &&
        !sourceWasDealtDamageSincePreviousTurnEnd(evaluation.state, source)
      );
    }
    if (ability.keyword.name === "preserve") {
      const event = observed.committedEvent;
      return (
        observed.name === "object-destroyed" &&
        event.type === "object-moved" &&
        event.objectId === source.id &&
        event.from === "field" &&
        event.to === "graveyard"
      );
    }
    throw new GrandArchiveUnsupportedRuleError(`intrinsic trigger ${ability.keyword.name}`);
  }
  if (!ability.trigger) return false;
  if (ability.trigger.kind === "state") {
    return evaluateGrandArchiveCondition(ability.trigger.condition, evaluation);
  }
  const event = ability.trigger.event;
  const matched =
    "anyOf" in event
      ? event.anyOf.some((pattern) =>
          matchesGrandArchiveEventPattern(pattern, observed, source, evaluation),
        )
      : matchesGrandArchiveEventPattern(event, observed, source, evaluation);
  return (
    matched &&
    (!ability.trigger.condition ||
      evaluateGrandArchiveCondition(ability.trigger.condition, evaluation))
  );
}

function isOnChargeAbility(ability: GrandArchiveTriggeredAbility): boolean {
  return ability.label?.name.trim().toLocaleLowerCase("en-US") === "on charge";
}

function currentSourceInstanceHistoryStart(
  state: GrandArchiveMatchState,
  sourceId: GrandArchiveCardInstance["id"],
): number {
  for (let index = state.eventHistory.length - 1; index >= 0; index -= 1) {
    const event = state.eventHistory[index]!;
    if (
      (event.type === "object-moved" && event.objectId === sourceId) ||
      (event.type === "object-created" && event.object.id === sourceId) ||
      (event.type === "tokens-summoned" && event.objects.some((object) => object.id === sourceId))
    ) {
      return index + 1;
    }
  }
  return 0;
}

function onChargeAbilityHasTriggered(
  state: GrandArchiveMatchState,
  sourceId: GrandArchiveCardInstance["id"],
  abilityId: string,
): boolean {
  return state.eventHistory
    .slice(currentSourceInstanceHistoryStart(state, sourceId))
    .some(
      (event) =>
        event.type === "pending-trigger-added" &&
        event.trigger.sourceId === sourceId &&
        event.trigger.ability.id === abilityId,
    );
}

/** Adds the recollection TBA counter once per object with an untriggered On Charge ability. */
export function collectGrandArchiveOnChargeCounterEvents(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  playerId: import("../../game/identity.ts").GrandArchivePlayerId,
): readonly GrandArchiveProposedEvent[] {
  return Object.values(state.objects).flatMap((source): readonly GrandArchiveProposedEvent[] => {
    if (source.zone !== "field" || source.controllerId !== playerId) return [];
    const face = grandArchiveObjectFace(program, source);
    const evaluation: GrandArchiveEvaluationContext = {
      program,
      state,
      controllerId: playerId,
      sourceId: source.id,
      abilityBearerId: source.id,
      bindings: {},
    };
    const hasUntriggeredOnCharge = executableTriggeredAbilitiesForObject(
      program,
      state,
      source,
      grandArchiveObjectActiveAbilities(program, state, source),
    ).some(
      (ability) =>
        isOnChargeAbility(ability) &&
        grandArchiveAbilityIsFunctional(face, ability, source) &&
        !ability.restrictions?.some(
          (restriction) =>
            restriction.kind === "static" &&
            !evaluateGrandArchiveCondition(restriction.condition, evaluation),
        ) &&
        !onChargeAbilityHasTriggered(state, source.id, ability.id),
    );
    return hasUntriggeredOnCharge
      ? [
          {
            type: "counter-changed",
            objectId: source.id,
            counter: grandArchiveCounterKey({ named: "charge" }),
            delta: 1,
            actorId: playerId,
            cause: { kind: "rule", rule: "on-charge-recollection-turn-based-action" },
          },
        ]
      : [];
  });
}

function executableTriggeredAbilities(
  abilities: ReturnType<typeof flattenGrandArchiveAbilities>,
): readonly GrandArchiveTriggeredAbility[] {
  const result: GrandArchiveTriggeredAbility[] = [];
  const redundantIntrinsicNames = new Set<string>();
  for (const ability of abilities) {
    if (ability.kind === "triggered") {
      if (
        "intrinsic" in ability &&
        ability.intrinsic &&
        (ability.keyword.name === "intercept" || ability.keyword.name === "foster")
      ) {
        if (redundantIntrinsicNames.has(ability.keyword.name)) continue;
        redundantIntrinsicNames.add(ability.keyword.name);
      }
      result.push(ability);
      continue;
    }
    const intrinsicKeywords =
      ability.kind === "keyword-group"
        ? ability.keywords
        : ability.kind === "static" &&
            ability.staticKind === "intrinsic" &&
            ability.keyword.name === "preserve"
          ? [ability.keyword]
          : [];
    for (const keyword of intrinsicKeywords) {
      if (
        keyword.name !== "intercept" &&
        keyword.name !== "vigor" &&
        keyword.name !== "foster" &&
        keyword.name !== "preserve"
      ) {
        continue;
      }
      if (keyword.name === "intercept" || keyword.name === "foster") {
        if (redundantIntrinsicNames.has(keyword.name)) continue;
        redundantIntrinsicNames.add(keyword.name);
      }
      result.push({
        id: ability.id,
        kind: "triggered",
        intrinsic: true,
        text: ability.text,
        keyword,
        ...(ability.functionalZones ? { functionalZones: ability.functionalZones } : {}),
        ...(ability.executionSource ? { executionSource: ability.executionSource } : {}),
        ...(ability.restrictions ? { restrictions: ability.restrictions } : {}),
      });
    }
  }
  return result;
}

const INTRINSIC_TRIGGERED_KEYWORD_NAMES = new Set(["intercept", "vigor", "foster", "preserve"]);

function isIntrinsicTriggeredAbility(
  ability: GrandArchiveTriggeredAbility,
): ability is Extract<GrandArchiveTriggeredAbility, { readonly intrinsic: true }> {
  return "intrinsic" in ability && ability.intrinsic;
}

/**
 * Layer D grants and removals change keyword abilities, not merely keyword queries. Reconcile the
 * executable intrinsic triggers with the fully derived keyword instances so a granted keyword can
 * trigger and a removed keyword cannot. Printed/granted abilities retain their authored identity;
 * a direct grant-keyword modifier receives a deterministic engine-owned identity.
 */
function executableTriggeredAbilitiesForObject(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  source: GrandArchiveCardInstance,
  abilities: ReturnType<typeof flattenGrandArchiveAbilities>,
): readonly GrandArchiveTriggeredAbility[] {
  const candidates = executableTriggeredAbilities(abilities);
  const activeKeywords = grandArchiveObjectActiveKeywords(program, state, source);
  const consumedKeywordIndexes = new Set<number>();
  const includedRedundantKeywords = new Set<string>();
  const result: GrandArchiveTriggeredAbility[] = [];

  const consumeMatchingKeyword = (
    keyword: Extract<GrandArchiveTriggeredAbility, { readonly intrinsic: true }>["keyword"],
  ): number | undefined => {
    const exact = JSON.stringify(keyword);
    const exactIndex = activeKeywords.findIndex(
      (candidate, index) =>
        !consumedKeywordIndexes.has(index) && JSON.stringify(candidate) === exact,
    );
    if (exactIndex >= 0) return exactIndex;
    const nameIndex = activeKeywords.findIndex(
      (candidate, index) => !consumedKeywordIndexes.has(index) && candidate.name === keyword.name,
    );
    return nameIndex >= 0 ? nameIndex : undefined;
  };

  for (const ability of candidates) {
    if (!isIntrinsicTriggeredAbility(ability)) {
      result.push(ability);
      continue;
    }
    const executionObject = grandArchiveAbilityExecutionObject(state, source, ability);
    const intrinsicEvaluation: GrandArchiveEvaluationContext | undefined = executionObject
      ? {
          program,
          state,
          controllerId: executionObject.controllerId,
          sourceId: executionObject.id,
          abilityBearerId: executionObject.id,
          bindings: {},
        }
      : undefined;
    if (
      !intrinsicEvaluation ||
      ability.restrictions?.some(
        (restriction) =>
          restriction.kind === "static" &&
          !evaluateGrandArchiveCondition(restriction.condition, intrinsicEvaluation),
      )
    ) {
      continue;
    }
    const keywordName = ability.keyword.name;
    if (!INTRINSIC_TRIGGERED_KEYWORD_NAMES.has(keywordName)) {
      result.push(ability);
      continue;
    }
    const keywordIndex = consumeMatchingKeyword(ability.keyword);
    if (keywordIndex === undefined) continue;
    consumedKeywordIndexes.add(keywordIndex);
    if (
      (keywordName === "intercept" || keywordName === "foster") &&
      includedRedundantKeywords.has(keywordName)
    ) {
      continue;
    }
    if (keywordName === "intercept" || keywordName === "foster") {
      includedRedundantKeywords.add(keywordName);
    }
    result.push(ability);
  }

  for (const [keywordIndex, keyword] of activeKeywords.entries()) {
    if (
      consumedKeywordIndexes.has(keywordIndex) ||
      !INTRINSIC_TRIGGERED_KEYWORD_NAMES.has(keyword.name)
    ) {
      continue;
    }
    if (
      (keyword.name === "intercept" || keyword.name === "foster") &&
      includedRedundantKeywords.has(keyword.name)
    ) {
      continue;
    }
    if (keyword.name === "intercept" || keyword.name === "foster") {
      includedRedundantKeywords.add(keyword.name);
    }
    result.push({
      id: `layerDKeyword${keywordIndex}-a${keywordIndex}`,
      kind: "triggered",
      intrinsic: true,
      text: keyword.name,
      keyword,
    });
  }

  return result;
}

function intrinsicBindings(
  program: GrandArchiveMatchProgram,
  ability: GrandArchiveTriggeredAbility,
  observed: GrandArchiveObservedEvent,
  source: GrandArchiveCardInstance,
  state: GrandArchiveMatchState,
): GrandArchiveEvaluationContext["bindings"] {
  const bindings = {
    ...observedBindings(observed),
    ...abilityPatternBindings(ability, observed),
  };
  if (!("intrinsic" in ability) || !ability.intrinsic || ability.keyword.name !== "intercept") {
    return bindings;
  }
  const event = observed.committedEvent;
  if (event.type !== "combat-started") return bindings;
  const championId = event.combat.targetIds.find((objectId) => {
    const object = state.objects[objectId];
    return (
      object?.controllerId === source.controllerId &&
      grandArchiveObjectCurrentCharacteristics(program, state, object).types.includes("CHAMPION")
    );
  });
  return championId ? { ...bindings, eventRecipient: [championId] } : bindings;
}

interface TriggerCandidateBase {
  readonly controllerId: import("../../game/identity.ts").GrandArchivePlayerId;
  readonly ability: GrandArchiveTriggeredAbility;
  readonly bindings: GrandArchiveEvaluationContext["bindings"];
  readonly variables: Readonly<Partial<Record<"X" | "Y" | "Z", number>>>;
  readonly activationPayment: readonly import("../../game/model.ts").GrandArchiveActivationPaymentRecord[];
  readonly createdAtVersion: number;
  readonly cascadeCounts: Readonly<Record<string, number>>;
  readonly advanceCascadeOnObject: boolean;
  /** Present on exactly one pending trigger for each admitted limited occurrence. */
  readonly triggerLimitUsageKey?: string;
  /** Marks a non-object mastery source; its identity is carried in bindings. */
  readonly masterySource?: {
    readonly playerId: import("../../game/identity.ts").GrandArchivePlayerId;
    readonly name: string;
  };
  readonly generatedTriggerId?: string;
  readonly delayedTriggerProgress?: "consume" | "remove";
  readonly delayedTriggerId?: string;
}

type TriggerCandidate = TriggerCandidateBase &
  (
    | {
        readonly source: GrandArchiveCardInstance;
        readonly sourceLkiEventId?: GrandArchiveEventId;
        readonly gameSource?: never;
      }
    | {
        readonly source?: never;
        readonly gameSource: import("../../game/model.ts").GrandArchiveGameAbilitySource;
      }
  );

function triggerCandidateSourceKey(candidate: TriggerCandidate): string {
  if (candidate.source) return candidate.source.id;
  if (candidate.gameSource) return `game:${candidate.gameSource.name}`;
  return assertNever(candidate);
}

type TriggerSourceIdentity =
  | {
      readonly kind: "object";
      readonly objectId: GrandArchiveCardInstance["id"];
      readonly incarnation: number;
    }
  | {
      readonly kind: "mastery";
      readonly playerId: import("../../game/identity.ts").GrandArchivePlayerId;
      readonly name: string;
    }
  | { readonly kind: "delayed"; readonly triggerId: string };

interface TriggerAdmissionLedger {
  readonly occurrenceClaims: Set<string>;
  readonly limitUsages: Map<string, number>;
}

function createTriggerAdmissionLedger(state: GrandArchiveMatchState): TriggerAdmissionLedger {
  const limitUsages = new Map<string, number>();
  for (const event of state.eventHistory) {
    if (event.type !== "pending-trigger-added" || !event.trigger.triggerLimitUsageKey) continue;
    const key = event.trigger.triggerLimitUsageKey;
    limitUsages.set(key, (limitUsages.get(key) ?? 0) + 1);
  }
  return { occurrenceClaims: new Set(), limitUsages };
}

function triggerSourceIdentityKey(identity: TriggerSourceIdentity): string {
  switch (identity.kind) {
    case "object":
      return `object:${identity.objectId}:${identity.incarnation}`;
    case "mastery":
      return `mastery:${identity.playerId}:${identity.name}`;
    case "delayed":
      return `delayed:${identity.triggerId}`;
    default:
      return assertNever(identity);
  }
}

function triggerLimitUsageKey(
  state: GrandArchiveMatchState,
  ability: GrandArchiveTriggeredAbility,
  identity: TriggerSourceIdentity,
): string | undefined {
  if (!("limit" in ability) || !ability.limit) return undefined;
  const abilityKey = `${triggerSourceIdentityKey(identity)}:ability:${ability.id}`;
  switch (ability.limit.per) {
    case "source-instance":
      return `${abilityKey}:source-instance`;
    case "turn":
      return `${abilityKey}:turn:${state.turn.number}`;
    case "game":
      return `${abilityKey}:game`;
    default:
      return assertNever(ability.limit.per);
  }
}

function triggerUsesOneOrMoreCardinality(ability: GrandArchiveTriggeredAbility): boolean {
  if (!ability.trigger) return false;
  const trigger = ability.trigger;
  return trigger.kind === "event" && trigger.cardinality === "one-or-more";
}

function committedObservationId(
  observed: GrandArchiveObservedEvent,
  groupGameEvent: boolean,
): string {
  if (!("eventId" in observed.committedEvent)) {
    throw new Error("Trigger collection requires a committed event observation");
  }
  return groupGameEvent
    ? (observed.committedEvent.gameEventId ?? observed.committedEvent.eventId)
    : observed.committedEvent.eventId;
}

/**
 * Claims one rules occurrence before creating pending trigger copies. A single
 * committed event cannot trigger the same ability twice through two semantic
 * observations, and `one-or-more` collapses every matching event in this batch.
 */
function claimObservedTrigger(
  state: GrandArchiveMatchState,
  ledger: TriggerAdmissionLedger,
  ability: GrandArchiveTriggeredAbility,
  identity: TriggerSourceIdentity,
  observed: GrandArchiveObservedEvent,
  abilityOccurrenceIndex?: number,
): { readonly admitted: boolean; readonly triggerLimitUsageKey?: string } {
  const sourceKey = triggerSourceIdentityKey(identity);
  const groupGameEvent = triggerUsesOneOrMoreCardinality(ability);
  const abilityOccurrenceKey =
    abilityOccurrenceIndex === undefined
      ? ability.id
      : `${ability.id}:instance:${abilityOccurrenceIndex}`;
  const occurrenceKey = `${sourceKey}:ability:${abilityOccurrenceKey}:event:${committedObservationId(
    observed,
    groupGameEvent,
  )}`;
  if (ledger.occurrenceClaims.has(occurrenceKey)) return { admitted: false };

  const usageKey = triggerLimitUsageKey(state, ability, identity);
  if (usageKey && "limit" in ability && ability.limit) {
    const used = ledger.limitUsages.get(usageKey) ?? 0;
    if (used >= ability.limit.count) return { admitted: false };
    ledger.limitUsages.set(usageKey, used + 1);
  }
  ledger.occurrenceClaims.add(occurrenceKey);
  return {
    admitted: true,
    ...(usageKey ? { triggerLimitUsageKey: usageKey } : {}),
  };
}

function claimNamedTrigger(
  state: GrandArchiveMatchState,
  ledger: TriggerAdmissionLedger,
  ability: GrandArchiveTriggeredAbility,
  source: GrandArchiveCardInstance,
  triggerName: string,
): { readonly admitted: boolean; readonly triggerLimitUsageKey?: string } {
  const identity: TriggerSourceIdentity = {
    kind: "object",
    objectId: source.id,
    incarnation: source.incarnation,
  };
  const occurrenceKey = `${triggerSourceIdentityKey(identity)}:ability:${ability.id}:named:${triggerName}`;
  if (ledger.occurrenceClaims.has(occurrenceKey)) return { admitted: false };
  const usageKey = triggerLimitUsageKey(state, ability, identity);
  if (usageKey && "limit" in ability && ability.limit) {
    const used = ledger.limitUsages.get(usageKey) ?? 0;
    if (used >= ability.limit.count) return { admitted: false };
    ledger.limitUsages.set(usageKey, used + 1);
  }
  ledger.occurrenceClaims.add(occurrenceKey);
  return {
    admitted: true,
    ...(usageKey ? { triggerLimitUsageKey: usageKey } : {}),
  };
}

function observedBindings(
  observed: GrandArchiveObservedEvent,
): GrandArchiveEvaluationContext["bindings"] {
  const eventSourceId = observed.sourceId ?? observed.subjectId;
  const committed = observed.committedEvent;
  const eventSubjectControllerIds = (() => {
    if (
      committed.type === "object-moved" &&
      observed.subjectId === committed.objectId &&
      committed.previousControllerId
    ) {
      return [committed.previousControllerId];
    }
    if (
      committed.type === "object-removed-from-game" &&
      observed.subjectId === committed.object.id
    ) {
      return [committed.object.controllerId];
    }
    if (committed.type === "tokens-summoned" && observed.subjectIds?.length) {
      const subjectIds = new Set(observed.subjectIds);
      return [
        ...new Set(
          committed.objects
            .filter((object) => subjectIds.has(object.id))
            .map((object) => object.controllerId),
        ),
      ];
    }
    return [];
  })();
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
    ...(observed.name === "attack-declared" && observed.subjectId
      ? {
          eventAttacker: [
            committed.type === "combat-started" ? committed.combat.attackerId : observed.subjectId,
          ],
        }
      : {}),
    ...(observed.recipientIds?.length || observed.recipientId
      ? { eventRecipient: grandArchiveEventRecipientBinding(observed) }
      : {}),
    ...(observed.amount !== undefined ? { eventAmount: observed.amount } : {}),
    ...(observed.amount !== undefined &&
    (observed.name === "damage-dealt" || observed.name === "attack-hit")
      ? { [grandArchiveModifiedResultBinding("damage-dealt")]: observed.amount }
      : {}),
    ...(observed.state ? { eventState: observed.state } : {}),
    ...(observed.stackItemId ? { eventStackItem: [observed.stackItemId] } : {}),
    ...(eventSubjectControllerIds.length > 0
      ? { eventSubjectController: eventSubjectControllerIds }
      : {}),
  };
}

function subjectBinding(
  subject: GrandArchiveEventSubject | undefined,
  objectIds:
    | readonly import("../../game/identity.ts").GrandArchiveTargetId[]
    | import("../../procedures/effects/evaluation.ts").GrandArchiveObjectIdentityBinding,
): GrandArchiveEvaluationContext["bindings"] {
  if (!subject || ("kind" in objectIds ? objectIds.ids.length : objectIds.length) === 0) return {};
  if (subject.kind === "event-object" && subject.bindAs) return { [subject.bindAs]: objectIds };
  if (subject.kind === "any-of") {
    return Object.assign(
      {},
      ...subject.subjects.map((candidate) => subjectBinding(candidate, objectIds)),
    );
  }
  return {};
}

export function grandArchiveEventPatternBindings(
  pattern: GrandArchiveEventPattern,
  observed: GrandArchiveObservedEvent,
): GrandArchiveEvaluationContext["bindings"] {
  return {
    ...subjectBinding(
      pattern.subject,
      observed.subjectIds ?? (observed.subjectId ? [observed.subjectId] : []),
    ),
    ...("recipient" in pattern
      ? subjectBinding(pattern.recipient, grandArchiveEventRecipientBinding(observed))
      : {}),
    ...("using" in pattern
      ? subjectBinding(pattern.using, observed.sourceId ? [observed.sourceId] : [])
      : {}),
    ...("previousObject" in pattern
      ? subjectBinding(
          pattern.previousObject,
          observed.previousObjectId ? [observed.previousObjectId] : [],
        )
      : {}),
  };
}

function abilityPatternBindings(
  ability: GrandArchiveTriggeredAbility,
  observed: GrandArchiveObservedEvent,
): GrandArchiveEvaluationContext["bindings"] {
  if (!ability.trigger || ability.trigger.kind !== "event") return {};
  const patterns =
    "anyOf" in ability.trigger.event ? ability.trigger.event.anyOf : [ability.trigger.event];
  const pattern = patterns.find((candidate) => candidate.name === observed.name);
  return pattern ? grandArchiveEventPatternBindings(pattern, observed) : {};
}

function candidateSources(
  state: GrandArchiveMatchState,
  committedEvents: readonly GrandArchiveCommittedEvent[],
): readonly GrandArchiveCardInstance[] {
  const sources = new Map(
    Object.values(state.objects).map((object) => [object.id, object] as const),
  );
  for (const event of committedEvents) {
    if (event.type === "object-removed-from-game" && !sources.has(event.object.id)) {
      sources.set(event.object.id, event.object);
    }
  }
  return [...sources.values()];
}

function pendingTriggerEvents(
  state: GrandArchiveMatchState,
  candidates: readonly TriggerCandidate[],
): readonly GrandArchiveProposedEvent[] {
  if (candidates.length === 0) return [];
  const orderedPlayers = [
    ...state.turnOrder.slice(state.turnOrder.indexOf(state.turn.playerId)),
    ...state.turnOrder.slice(0, state.turnOrder.indexOf(state.turn.playerId)),
  ];
  const sortedCandidates = [...candidates].sort((left, right) => {
    const controllerOrder =
      orderedPlayers.indexOf(left.controllerId) - orderedPlayers.indexOf(right.controllerId);
    return (
      controllerOrder ||
      triggerCandidateSourceKey(left).localeCompare(triggerCandidateSourceKey(right)) ||
      left.ability.id.localeCompare(right.ability.id)
    );
  });
  const events: GrandArchiveProposedEvent[] = [];
  const batchId = `trigger-batch-${state.nextPendingTriggerOrdinal}`;
  let pendingOffset = 0;
  const cascadeOffsets = new Map<string, number>();
  for (const candidate of sortedCandidates) {
    if (candidate.generatedTriggerId) {
      events.push({
        type: "reflexive-trigger-consumed",
        triggerId: candidate.generatedTriggerId,
        cause: { kind: "rule", rule: "reflexive-trigger-awaiting-stack" },
      });
    }
    if (candidate.delayedTriggerId && candidate.delayedTriggerProgress) {
      events.push({
        type:
          candidate.delayedTriggerProgress === "remove"
            ? "delayed-trigger-removed"
            : "delayed-trigger-consumed",
        triggerId: candidate.delayedTriggerId,
        cause: { kind: "rule", rule: "delayed-trigger-triggered" },
      });
    }
    let selectedModeIds: readonly string[] = [];
    const cascade = "cascade" in candidate.ability ? candidate.ability.cascade : undefined;
    if (cascade) {
      if (cascade.advanceOn !== "trigger") {
        throw new GrandArchiveUnsupportedRuleError(
          "triggered Cascade configured to advance on activation",
        );
      }
      if (!candidate.source) {
        throw new GrandArchiveUnsupportedRuleError("game-sourced Cascade triggered ability");
      }
      const cascadeKey = `${candidate.source.id}\u0000${candidate.ability.id}`;
      const offset = cascadeOffsets.get(cascadeKey) ?? 0;
      const count = (candidate.cascadeCounts[candidate.ability.id] ?? 0) + offset + 1;
      cascadeOffsets.set(cascadeKey, offset + 1);
      const mode = cascade.modes.find((entry) => entry.counts.includes(count));
      selectedModeIds = mode ? [mode.id] : [];
      if (candidate.advanceCascadeOnObject) {
        events.push({
          type: "cascade-advanced",
          objectId: candidate.source.id,
          abilityId: candidate.ability.id,
          count,
          cause: { kind: "rule", rule: "cascade-ability-triggered" },
        });
      }
    }
    events.push({
      type: "pending-trigger-added",
      trigger: {
        id: `pending-trigger-${state.nextPendingTriggerOrdinal + pendingOffset}`,
        batchId,
        orderingConfirmed: false,
        ...(candidate.masterySource
          ? { masterySource: candidate.masterySource }
          : candidate.gameSource
            ? { gameSource: candidate.gameSource }
            : {
                sourceId: candidate.source.id,
                sourceIncarnation:
                  state.objects[candidate.source.id]?.incarnation ?? candidate.source.incarnation,
                ...(candidate.sourceLkiEventId
                  ? { sourceLkiEventId: candidate.sourceLkiEventId }
                  : {}),
              }),
        controllerId: candidate.controllerId,
        ability: candidate.ability,
        selectedModeIds,
        bindings: candidate.bindings,
        variables: candidate.variables,
        activationPayment: candidate.activationPayment,
        createdAtVersion: candidate.createdAtVersion,
        ...(candidate.triggerLimitUsageKey
          ? { triggerLimitUsageKey: candidate.triggerLimitUsageKey }
          : {}),
      },
      cause: { kind: "rule", rule: "triggered-ability-awaiting-stack" },
    });
    pendingOffset += 1;
  }
  return events;
}

function abilityObservesNamedTrigger(
  ability: GrandArchiveTriggeredAbility,
  triggerName: "on-attack" | "on-hit" | "on-enter",
): boolean {
  if (("intrinsic" in ability && ability.intrinsic) || !ability.trigger) return false;
  if (ability.trigger.kind !== "event") return false;
  const expectedEvent =
    triggerName === "on-enter"
      ? "object-entered-field"
      : triggerName === "on-attack"
        ? "attack-declared"
        : "attack-hit";
  const patterns =
    "anyOf" in ability.trigger.event ? ability.trigger.event.anyOf : [ability.trigger.event];
  return patterns.some((pattern) => pattern.name === expectedEvent);
}

interface TriggerMultiplier {
  readonly id: string;
  readonly effect: GrandArchiveTriggerMultiplierEffect;
  readonly evaluation: GrandArchiveEvaluationContext;
  readonly timestamp: number;
}

function triggerMultiplierTotal(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  observed: GrandArchiveObservedEvent,
  triggerName: GrandArchiveTriggerMultiplierEffect["triggerName"],
): number {
  const multipliers: TriggerMultiplier[] = [];
  for (const source of Object.values(state.objects)) {
    const face = grandArchiveObjectFace(program, source);
    for (const ability of grandArchiveObjectActiveAbilities(program, state, source)) {
      if (ability.kind !== "static" || ability.staticKind !== "effects") continue;
      const executionObject = grandArchiveAbilityExecutionObject(state, source, ability);
      if (!executionObject) continue;
      const evaluation = withGrandArchiveDerivedVariables(ability.variables, {
        program,
        state,
        controllerId: executionObject.controllerId,
        sourceId: executionObject.id,
        abilityBearerId: executionObject.id,
        bindings: observedBindings(observed),
      });
      if (
        !grandArchiveAbilityIsFunctional(face, ability, source) ||
        ability.restrictions?.some(
          (restriction) =>
            restriction.kind === "static" &&
            !evaluateGrandArchiveCondition(restriction.condition, evaluation),
        ) ||
        (ability.condition && !evaluateGrandArchiveCondition(ability.condition, evaluation))
      ) {
        continue;
      }
      for (const [effectIndex, effect] of ability.effects.entries()) {
        if (
          effect.kind === "trigger-multiplier" &&
          effect.triggerName === triggerName &&
          matchesGrandArchiveEventPattern(effect.event, observed, executionObject, evaluation)
        ) {
          multipliers.push({
            id: `static:${source.id}:${ability.id}:${effectIndex}`,
            effect,
            evaluation,
            timestamp: grandArchiveObjectTimestamp(source, evaluation),
          });
        }
      }
    }
  }
  for (const instance of state.continuousEffects) {
    if (instance.effect.kind !== "trigger-multiplier") continue;
    const source = instance.sourceId ? state.objects[instance.sourceId] : undefined;
    if (!source) continue;
    const evaluation: GrandArchiveEvaluationContext = {
      program,
      state,
      controllerId: instance.controllerId,
      ...continuousEffectSourceContext(instance),
      bindings: { ...observedBindings(observed), ...instance.bindings },
      variables: instance.variables,
    };
    if (
      grandArchiveContinuousEffectIsActive(instance, evaluation) &&
      instance.effect.triggerName === triggerName &&
      matchesGrandArchiveEventPattern(instance.effect.event, observed, source, evaluation)
    ) {
      multipliers.push({
        id: instance.id,
        effect: instance.effect,
        evaluation,
        timestamp: instance.createdAtVersion,
      });
    }
  }
  let total = 1;
  for (const multiplier of multipliers.sort(
    (left, right) => left.timestamp - right.timestamp || left.id.localeCompare(right.id),
  )) {
    const operation = multiplier.effect.operation;
    const amount = evaluateGrandArchiveAmount(
      operation.kind === "add" ? operation.additionalTimes : operation.totalTimes,
      multiplier.evaluation,
    );
    if (!Number.isSafeInteger(amount) || amount < 0) {
      throw new GrandArchiveUnsupportedRuleError("trigger multiplier must be non-negative integer");
    }
    total = operation.kind === "add" ? total + amount : amount;
  }
  return total;
}

function triggerFamilyForObservedAbility(
  ability: GrandArchiveTriggeredAbility,
  observed: GrandArchiveObservedEvent,
): GrandArchiveTriggerMultiplierEffect["triggerName"] | undefined {
  const triggerName =
    observed.name === "object-entered-field"
      ? "on-enter"
      : observed.name === "attack-declared"
        ? "on-attack"
        : observed.name === "attack-hit"
          ? "on-hit"
          : undefined;
  return triggerName && abilityObservesNamedTrigger(ability, triggerName) ? triggerName : undefined;
}

/** Creates explicit named triggers without pretending that their ordinary game event occurred. */
export function collectGrandArchiveNamedTriggeredAbilityEvents(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  sources: readonly GrandArchiveCardInstance[],
  triggerName: "on-attack" | "on-hit" | "on-enter",
): readonly GrandArchiveProposedEvent[] {
  const candidates: TriggerCandidate[] = [];
  const admission = createTriggerAdmissionLedger(state);
  for (const source of sources) {
    const face = grandArchiveObjectFace(program, source);
    for (const ability of executableTriggeredAbilitiesForObject(
      program,
      state,
      source,
      grandArchiveObjectActiveAbilities(program, state, source),
    )) {
      if (!abilityObservesNamedTrigger(ability, triggerName)) continue;
      if (!grandArchiveAbilityIsFunctional(face, ability, source)) continue;
      const executionObject = grandArchiveAbilityExecutionObject(state, source, ability);
      if (!executionObject) continue;
      const bindings: GrandArchiveEvaluationContext["bindings"] = {
        ...executionObject.activationBindings,
        eventSubject: [executionObject.id],
        eventSource: [executionObject.id],
        ...(state.combat
          ? {
              eventAttacker: [state.combat.attackerId],
              ...(state.combat.targetIds[0] ? { eventRecipient: [state.combat.targetIds[0]] } : {}),
            }
          : {}),
      };
      const evaluation: GrandArchiveEvaluationContext = {
        program,
        state,
        controllerId: executionObject.controllerId,
        sourceId: executionObject.id,
        abilityBearerId: executionObject.id,
        abilityId: ability.id,
        bindings,
        variables: executionObject.activationVariables,
      };
      if (
        ability.restrictions?.some(
          (restriction) =>
            restriction.kind === "static" &&
            !evaluateGrandArchiveCondition(restriction.condition, evaluation),
        )
      ) {
        continue;
      }
      if (
        ability.interveningCondition &&
        !evaluateGrandArchiveCondition(ability.interveningCondition, evaluation)
      ) {
        continue;
      }
      const claimed = claimNamedTrigger(state, admission, ability, executionObject, triggerName);
      if (!claimed.admitted) continue;
      candidates.push({
        source: executionObject,
        controllerId: executionObject.controllerId,
        ability,
        bindings,
        variables: executionObject.activationVariables,
        activationPayment: executionObject.activationPayment,
        createdAtVersion: state.stateVersion,
        cascadeCounts: executionObject.cascadeCounts,
        advanceCascadeOnObject: true,
        ...(claimed.triggerLimitUsageKey
          ? { triggerLimitUsageKey: claimed.triggerLimitUsageKey }
          : {}),
      });
    }
  }
  return pendingTriggerEvents(state, candidates);
}

export function collectGrandArchiveTriggeredAbilityEvents(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  committedEvents: readonly GrandArchiveCommittedEvent[],
  collectionContext: {
    readonly resolutionStartedEventHistoryIndex?: number;
  } = {},
): readonly GrandArchiveProposedEvent[] {
  const candidates: TriggerCandidate[] = state.generatedTriggers.flatMap(
    (generated): readonly TriggerCandidate[] => {
      const source = state.objects[generated.sourceId];
      return source
        ? [
            {
              source,
              controllerId: generated.controllerId,
              ability: generated.ability,
              bindings: generated.bindings,
              variables: generated.variables,
              activationPayment: source.activationPayment,
              createdAtVersion: generated.createdAtVersion,
              cascadeCounts: source.cascadeCounts,
              advanceCascadeOnObject: true,
              generatedTriggerId: generated.id,
            },
          ]
        : [];
    },
  );
  const delayedUses = new Map<string, number>();
  const onChargeTriggeredThisBatch = new Set<string>();
  const admission = createTriggerAdmissionLedger(state);
  for (const committedEvent of committedEvents) {
    for (const observed of observeGrandArchiveCommittedEvent(committedEvent)) {
      if (
        observed.name === "phase-begins" &&
        observed.phase === "main" &&
        Object.values(state.objects).some(
          (object) =>
            object.zone === "field" &&
            object.controllerId === state.turn.playerId &&
            (object.counters[grandArchiveCounterKey("wither")] ?? 0) > 0,
        )
      ) {
        candidates.push({
          gameSource: { name: "wither" },
          controllerId: state.turn.playerId,
          ability: GRAND_ARCHIVE_WITHER_TRIGGERED_ABILITY,
          bindings: observedBindings(observed),
          variables: {},
          activationPayment: [],
          createdAtVersion: state.stateVersion,
          cascadeCounts: {},
          advanceCascadeOnObject: false,
        });
      }
      if (
        observed.name === "damage-dealt" &&
        observed.combatDamage === true &&
        (observed.amount ?? 0) > 0 &&
        observed.sourceId
      ) {
        const damageSource = state.objects[observed.sourceId];
        if (damageSource) {
          const characteristics = grandArchiveObjectCurrentCharacteristics(
            program,
            state,
            damageSource,
          );
          const isArcaneUnit =
            characteristics.elements.includes("ARCANE") &&
            (characteristics.types.includes("ALLY") || characteristics.types.includes("CHAMPION"));
          if (isArcaneUnit) {
            for (const staticSource of Object.values(state.objects)) {
              if (
                staticSource.zone !== "field" ||
                staticSource.controllerId !== damageSource.controllerId ||
                (staticSource.counters[grandArchiveCounterKey("static")] ?? 0) <= 0
              ) {
                continue;
              }
              candidates.push({
                source: staticSource,
                controllerId: staticSource.controllerId,
                ability: GRAND_ARCHIVE_STATIC_COUNTER_TRIGGERED_ABILITY,
                bindings: observedBindings(observed),
                variables: {},
                activationPayment: staticSource.activationPayment,
                createdAtVersion: state.stateVersion,
                cascadeCounts: staticSource.cascadeCounts,
                advanceCascadeOnObject: false,
              });
            }
          }
        }
      }
      for (const source of candidateSources(state, committedEvents)) {
        const fieldDeparture = [...committedEvents]
          .reverse()
          .find(
            (
              event,
            ): event is Extract<
              GrandArchiveCommittedEvent,
              { readonly type: "object-moved" | "object-removed-from-game" }
            > =>
              (event.type === "object-moved" &&
                event.objectId === source.id &&
                event.from === "field" &&
                event.to !== "field") ||
              (event.type === "object-removed-from-game" && event.object.id === source.id),
          );
        const sourceForDiscovery = fieldDeparture
          ? fieldDeparture.type === "object-removed-from-game"
            ? fieldDeparture.object
            : (fieldDeparture.previousObject ?? {
                ...source,
                ...(fieldDeparture.from === "field" && fieldDeparture.to !== "field"
                  ? {
                      zone: fieldDeparture.from,
                      incarnation: Math.max(0, source.incarnation - 1),
                    }
                  : {}),
                controllerId: fieldDeparture.previousControllerId ?? source.controllerId,
                activeDefinitionId:
                  fieldDeparture.previousActiveDefinitionId ?? source.activeDefinitionId,
                activationPayment:
                  fieldDeparture.previousActivationPayment ?? source.activationPayment,
                activationBindings:
                  fieldDeparture.previousActivationBindings ?? source.activationBindings,
                activationVariables:
                  fieldDeparture.previousActivationVariables ?? source.activationVariables,
              })
          : source;
        const face = grandArchiveObjectFace(program, sourceForDiscovery);
        for (const [abilityOccurrenceIndex, ability] of executableTriggeredAbilitiesForObject(
          program,
          state,
          sourceForDiscovery,
          fieldDeparture?.type === "object-moved" && fieldDeparture.previousAbilities
            ? fieldDeparture.previousAbilities
            : grandArchiveObjectActiveAbilities(
                program,
                state,
                sourceForDiscovery,
                collectionContext,
              ),
        ).entries()) {
          const functionalZones = grandArchiveAbilityFunctionalZones(face, ability);
          const sourceDeparture = [...committedEvents]
            .reverse()
            .find(
              (
                event,
              ): event is Extract<
                GrandArchiveCommittedEvent,
                { readonly type: "object-moved" | "object-removed-from-game" }
              > =>
                (event.type === "object-moved" &&
                  event.objectId === source.id &&
                  functionalZones.includes(event.from) &&
                  !functionalZones.includes(event.to)) ||
                (event.type === "object-removed-from-game" &&
                  event.object.id === source.id &&
                  functionalZones.includes(event.object.zone)),
            );
          const sourceForAbility = sourceDeparture
            ? sourceDeparture.type === "object-removed-from-game"
              ? sourceDeparture.object
              : (sourceDeparture.previousObject ?? sourceForDiscovery)
            : sourceForDiscovery;
          const isFunctional =
            state.objects[source.id] !== undefined &&
            grandArchiveAbilityIsFunctional(face, ability, sourceForAbility);
          const wasRemovedFromFunctionalZone =
            sourceDeparture?.type === "object-removed-from-game" &&
            functionalZones.includes(sourceDeparture.object.zone);
          const wasSelfOnField =
            (committedEvent.type === "object-moved" &&
              committedEvent.objectId === source.id &&
              functionalZones.includes(committedEvent.from)) ||
            (committedEvent.type === "object-removed-from-game" &&
              committedEvent.object.id === source.id &&
              functionalZones.includes(committedEvent.object.zone));
          const wasCreditedKillSource =
            committedEvent.type === "object-moved" &&
            committedEvent.killedByIds?.includes(source.id) === true &&
            (functionalZones.includes(source.zone) ||
              (sourceDeparture?.type === "object-moved" &&
                functionalZones.includes(sourceDeparture.from)));
          if (
            !isFunctional &&
            !wasRemovedFromFunctionalZone &&
            !wasSelfOnField &&
            !wasCreditedKillSource
          ) {
            continue;
          }
          const executionObject = grandArchiveAbilityExecutionObject(
            state,
            sourceForAbility,
            ability,
          );
          if (!executionObject) continue;
          const sourceLkiEventId =
            sourceDeparture?.type === "object-moved" &&
            executionObject.id === sourceDeparture.objectId
              ? sourceDeparture.eventId
              : undefined;
          const sourceIncarnation =
            state.objects[executionObject.id]?.incarnation ?? executionObject.incarnation;
          const priorController = executionObject.controllerId;
          const bindings = {
            ...executionObject.activationBindings,
            ...intrinsicBindings(program, ability, observed, executionObject, state),
          };
          const evaluation: GrandArchiveEvaluationContext = {
            program,
            state,
            controllerId: priorController,
            sourceId: executionObject.id,
            abilityBearerId: executionObject.id,
            sourceIdentityId: executionObject.id,
            sourceIncarnation,
            ...(sourceLkiEventId
              ? {
                  sourceLkiEventId,
                  sourceInformationBasis: "last-known" as const,
                }
              : {}),
            abilityId: ability.id,
            bindings,
            variables: executionObject.activationVariables,
            ...collectionContext,
          };
          if (
            ability.restrictions?.some(
              (restriction) =>
                restriction.kind === "static" &&
                !evaluateGrandArchiveCondition(restriction.condition, evaluation),
            )
          ) {
            continue;
          }
          if (!triggerMatches(ability, observed, executionObject, evaluation)) continue;
          if (
            ability.interveningCondition &&
            !evaluateGrandArchiveCondition(ability.interveningCondition, evaluation)
          )
            continue;
          if (isOnChargeAbility(ability)) {
            const key = `${executionObject.id}\u0000${ability.id}`;
            if (
              onChargeTriggeredThisBatch.has(key) ||
              onChargeAbilityHasTriggered(state, executionObject.id, ability.id)
            ) {
              continue;
            }
            onChargeTriggeredThisBatch.add(key);
          }
          const claimed = claimObservedTrigger(
            state,
            admission,
            ability,
            {
              kind: "object",
              objectId: executionObject.id,
              incarnation: executionObject.incarnation,
            },
            observed,
            abilityOccurrenceIndex,
          );
          if (!claimed.admitted) continue;
          const candidate: TriggerCandidate = {
            source: executionObject,
            controllerId: priorController,
            ability,
            bindings: evaluation.bindings,
            variables: executionObject.activationVariables,
            activationPayment: executionObject.activationPayment,
            createdAtVersion: state.stateVersion,
            cascadeCounts: executionObject.cascadeCounts,
            advanceCascadeOnObject: state.objects[executionObject.id] !== undefined,
            ...(sourceLkiEventId ? { sourceLkiEventId } : {}),
            ...(claimed.triggerLimitUsageKey
              ? { triggerLimitUsageKey: claimed.triggerLimitUsageKey }
              : {}),
          };
          const triggerFamily = triggerFamilyForObservedAbility(ability, observed);
          const triggerCount = triggerFamily
            ? triggerMultiplierTotal(program, state, observed, triggerFamily)
            : 1;
          for (let triggerIndex = 0; triggerIndex < triggerCount; triggerIndex += 1) {
            candidates.push(
              triggerIndex === 0 ? candidate : { ...candidate, triggerLimitUsageKey: undefined },
            );
          }
        }
      }
      for (const playerId of state.turnOrder) {
        const mastery = grandArchivePlayerMastery(state, playerId);
        if (!mastery) continue;
        const source = Object.values(state.objects).find(
          (object) =>
            object.zone === "field" &&
            object.controllerId === playerId &&
            grandArchiveObjectCurrentCharacteristics(program, state, object).types.includes(
              "CHAMPION",
            ),
        );
        if (!source) continue;
        const bindings: GrandArchiveEvaluationContext["bindings"] = {
          ...observedBindings(observed),
          masterySourcePlayer: [playerId],
          masterySourceName: mastery.name,
        };
        const evaluation: GrandArchiveEvaluationContext = {
          program,
          state,
          controllerId: playerId,
          bindings,
          ...collectionContext,
        };
        for (const ability of executableTriggeredAbilities(
          flattenGrandArchiveAbilities(
            grandArchiveActiveMasteryAbilities(program, state, playerId),
          ),
        )) {
          if (
            ability.restrictions?.some(
              (restriction) =>
                restriction.kind === "static" &&
                !evaluateGrandArchiveCondition(restriction.condition, evaluation),
            ) ||
            !triggerMatches(ability, observed, source, evaluation) ||
            (ability.interveningCondition &&
              !evaluateGrandArchiveCondition(ability.interveningCondition, evaluation))
          ) {
            continue;
          }
          const claimed = claimObservedTrigger(
            state,
            admission,
            ability,
            { kind: "mastery", playerId, name: mastery.name },
            observed,
          );
          if (!claimed.admitted) continue;
          candidates.push({
            source,
            controllerId: playerId,
            ability,
            bindings,
            variables: {},
            activationPayment: [],
            createdAtVersion: state.stateVersion,
            cascadeCounts: {},
            advanceCascadeOnObject: false,
            masterySource: { playerId, name: mastery.name },
            ...(claimed.triggerLimitUsageKey
              ? { triggerLimitUsageKey: claimed.triggerLimitUsageKey }
              : {}),
          });
        }
      }
      if (observed.name === "stack-item-targets-declared" && observed.stackItemId) {
        const targetedControllerIds = new Set(
          (observed.recipientIds ?? []).flatMap((targetId) => {
            const target = Object.values(state.objects).find((object) => object.id === targetId);
            return target ? [target.controllerId] : [];
          }),
        );
        for (const controllerId of targetedControllerIds) {
          if (
            !grandArchivePlayerHasState(program, state, controllerId, {
              named: "crowds-favor",
            })
          ) {
            continue;
          }
          const champion = Object.values(state.objects).find(
            (object) =>
              object.zone === "field" &&
              object.controllerId === controllerId &&
              grandArchiveObjectCurrentCharacteristics(program, state, object).types.includes(
                "CHAMPION",
              ),
          );
          if (!champion) continue;
          candidates.push({
            source: champion,
            controllerId,
            ability: GRAND_ARCHIVE_CROWDS_FAVOR_TARGETED_ABILITY,
            bindings: observedBindings(observed),
            variables: {},
            activationPayment: [],
            createdAtVersion: state.stateVersion,
            cascadeCounts: {},
            advanceCascadeOnObject: false,
          });
        }
      }
      for (const delayed of state.delayedTriggers) {
        if (!grandArchiveDelayedTriggerIsActive(delayed, state)) continue;
        const used = delayedUses.get(delayed.id) ?? 0;
        if (delayed.remainingUses !== undefined && used >= delayed.remainingUses) continue;
        // A delayed trigger is an independent ability once generated. Its
        // source may have ceased to exist (most notably a token), so use the
        // source's immediately preceding object information when no live
        // object remains. Abilities - Resolving Triggered and Activated
        // Abilities rule 1.2.1 explicitly permits this LKI relationship.
        const source =
          state.objects[delayed.sourceId] ?? grandArchiveLastKnownObject(state, delayed.sourceId);
        if (!source) continue;
        const activatedItem =
          observed.name === "ability-activated" &&
          committedEvent.type === "stack-item-added" &&
          committedEvent.item.kind === "activated-ability"
            ? committedEvent.item
            : undefined;
        const activationSourceMove = activatedItem?.sourceLkiEventId
          ? state.eventHistory.find(
              (
                event,
              ): event is Extract<GrandArchiveCommittedEvent, { readonly type: "object-moved" }> =>
                event.type === "object-moved" &&
                event.eventId === activatedItem.sourceLkiEventId &&
                event.objectId === activatedItem.sourceId,
            )
          : undefined;
        const activationOriginIncarnation =
          activationSourceMove?.previousObject?.incarnation ?? activatedItem?.sourceIncarnation;
        const observedActivationSource =
          activatedItem?.sourceId && activationOriginIncarnation !== undefined
            ? {
                objectId: activatedItem.sourceId,
                incarnation: activationOriginIncarnation,
              }
            : undefined;
        const bindings = {
          ...currentGrandArchiveDelayedTriggerBindings(delayed, state, observedActivationSource),
          ...observedBindings(observed),
          ...abilityPatternBindings(delayed.ability, observed),
        };
        const evaluation: GrandArchiveEvaluationContext = {
          program,
          state,
          controllerId: delayed.controllerId,
          sourceId: delayed.sourceId,
          abilityBearerId: delayed.sourceId,
          abilityId: delayed.ability.id,
          bindings,
          variables: delayed.variables,
        };
        if (!triggerMatches(delayed.ability, observed, source, evaluation)) continue;
        if (
          delayed.ability.interveningCondition &&
          !evaluateGrandArchiveCondition(delayed.ability.interveningCondition, evaluation)
        )
          continue;
        const claimed = claimObservedTrigger(
          state,
          admission,
          delayed.ability,
          { kind: "delayed", triggerId: delayed.id },
          observed,
        );
        if (!claimed.admitted) continue;
        const nextUsed = used + 1;
        delayedUses.set(delayed.id, nextUsed);
        candidates.push({
          source,
          controllerId: delayed.controllerId,
          ability: delayed.ability,
          bindings,
          variables: delayed.variables,
          activationPayment: source.activationPayment,
          createdAtVersion: delayed.createdAtVersion,
          cascadeCounts: source.cascadeCounts,
          advanceCascadeOnObject: true,
          delayedTriggerId: delayed.id,
          ...(delayed.remainingUses === undefined
            ? {}
            : {
                delayedTriggerProgress:
                  nextUsed === delayed.remainingUses ? ("remove" as const) : ("consume" as const),
              }),
          ...(claimed.triggerLimitUsageKey
            ? { triggerLimitUsageKey: claimed.triggerLimitUsageKey }
            : {}),
        });
      }
    }
  }
  return pendingTriggerEvents(state, candidates);
}

export function createGrandArchiveTriggeredStackItem(
  state: GrandArchiveMatchState,
  pending: GrandArchivePendingTrigger,
  targets: readonly GrandArchiveDeclaredTarget[],
  selectedModeIds: readonly string[] = pending.selectedModeIds,
  variables: Readonly<Partial<Record<"X" | "Y" | "Z", number>>> = {},
  stackOffset = 0,
): GrandArchiveStackItem {
  return {
    id: grandArchiveStackItemId(`stack-${state.nextStackOrdinal + stackOffset}`),
    kind: "triggered-ability",
    controllerId: pending.controllerId,
    ...(pending.sourceId ? { sourceId: pending.sourceId } : {}),
    ...(pending.sourceId ? { sourceIncarnation: pending.sourceIncarnation } : {}),
    ...(pending.sourceLkiEventId ? { sourceLkiEventId: pending.sourceLkiEventId } : {}),
    ...(pending.masterySource ? { masterySource: pending.masterySource } : {}),
    ...(pending.gameSource ? { gameSource: pending.gameSource } : {}),
    selectedModeIds,
    ability: pending.ability,
    targets,
    createdAtVersion: pending.createdAtVersion,
    activationPhase: state.turn.phase,
    isCopy: false,
    negated: false,
    opportunityPolicy: "normal",
    activationStates: [],
    activationPayment: pending.activationPayment,
    championLevelModifier: 0,
    variables: { ...pending.variables, ...variables },
    bindings: pending.bindings,
  };
}

export function collectGrandArchivePendingTriggerProgressEvents(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
): readonly GrandArchiveProposedEvent[] {
  if (state.decision || state.pendingTriggers.length === 0) return [];
  if (
    state.status === "pregame" &&
    state.pregame?.stage === "starting-champions" &&
    state.stack.length > 0
  ) {
    return [];
  }
  const pending = state.pendingTriggers[0]!;
  const controllerBatch = state.pendingTriggers.filter(
    (trigger) =>
      trigger.batchId === pending.batchId && trigger.controllerId === pending.controllerId,
  );
  if (controllerBatch.length > 1 && controllerBatch.some((trigger) => !trigger.orderingConfirmed)) {
    if (state.players[pending.controllerId]?.lost) {
      return [
        {
          type: "pending-trigger-batch-ordered",
          batchId: pending.batchId,
          controllerId: pending.controllerId,
          triggerIds: controllerBatch.map((trigger) => trigger.id),
          cause: { kind: "rule", rule: "losing-player-trigger-order" },
        },
      ];
    }
    return [
      {
        type: "decision-created",
        decision: {
          id: grandArchiveDecisionId(`decision-${state.nextDecisionOrdinal}`),
          kind: "order-triggered-abilities",
          playerId: pending.controllerId,
          batchId: pending.batchId,
          pendingTriggerIds: controllerBatch.map((trigger) => trigger.id),
          stateVersion: state.stateVersion,
        },
        cause: { kind: "rule", rule: "order-simultaneous-triggered-abilities" },
      },
    ];
  }
  const evaluation: GrandArchiveEvaluationContext = {
    program,
    state,
    controllerId: pending.controllerId,
    ...(pending.sourceId
      ? {
          sourceId: pending.sourceId,
          abilityBearerId: pending.sourceId,
          sourceIdentityId: pending.sourceId,
          sourceIncarnation: pending.sourceIncarnation,
        }
      : {}),
    ...(pending.sourceLkiEventId ? { sourceLkiEventId: pending.sourceLkiEventId } : {}),
    ...(pending.sourceLkiEventId ? { sourceInformationBasis: "last-known" } : {}),
    bindings: pending.bindings,
  };
  const modes = getGrandArchiveAnnouncementModes(
    pending.ability.modes,
    "effect" in pending.ability ? pending.ability.effect : undefined,
    evaluation,
  );
  if (modes?.random) {
    throw new GrandArchiveUnsupportedRuleError("random triggered-ability modes");
  }
  if (modes && !grandArchiveAnnouncementModesHaveLegalSelection(modes, evaluation)) {
    return [
      {
        type: "pending-trigger-removed",
        triggerId: pending.id,
        cause: { kind: "rule", rule: "triggered-ability-has-no-legal-modes" },
      },
    ];
  }
  const cascade = "cascade" in pending.ability ? pending.ability.cascade : undefined;
  const cascadeModes = cascade
    ? pending.selectedModeIds.flatMap((modeId) => {
        const mode = cascade.modes.find((entry) => entry.id === modeId);
        return mode ? [mode] : [];
      })
    : [];
  const baseTargets = cascade
    ? cascadeModes.flatMap((mode) => mode.targets ?? [])
    : (pending.ability.targets ?? []);
  const source = pending.sourceId
    ? grandArchiveEvaluationObject(pending.sourceId, evaluation, true)
    : undefined;
  const targetEvaluation: GrandArchiveEvaluationContext = {
    ...evaluation,
    targeting: grandArchiveTargetingContext(
      "triggered-ability",
      source ? grandArchiveObjectCurrentCharacteristics(program, state, source).subtypes : [],
      [pending.ability.effect, ...cascadeModes.map((mode) => mode.effect)],
      "resolutionAs" in pending.ability && pending.ability.resolutionAs === "spell",
    ),
  };
  if (
    baseTargets.some(
      (target) => !grandArchiveTargetDeclarationHasLegalSelection(target, targetEvaluation),
    )
  ) {
    return [
      {
        type: "pending-trigger-removed",
        triggerId: pending.id,
        cause: { kind: "rule", rule: "triggered-ability-has-no-legal-targets" },
      },
    ];
  }
  const randomTargetsCanBeAutomatic =
    !modes && baseTargets.length > 0 && baseTargets.every((target) => target.method === "random");
  const hasChosenVariables = pending.ability.variables?.some(
    (variable) => variable.kind === "chosen",
  );
  if (!modes && !hasChosenVariables && (baseTargets.length === 0 || randomTargetsCanBeAutomatic)) {
    const targetDeclaration = randomTargetsCanBeAutomatic
      ? declareGrandArchiveTargetsWithRandom(baseTargets, undefined, targetEvaluation)
      : { targets: [] as const };
    const events: GrandArchiveProposedEvent[] = [
      {
        type: "pending-trigger-removed",
        triggerId: pending.id,
        cause: { kind: "rule", rule: "trigger-ready-for-stack" },
      },
      ...(targetDeclaration.random
        ? [
            {
              type: "random-state-changed" as const,
              random: targetDeclaration.random,
              actorId: pending.controllerId,
              cause: { kind: "rule" as const, rule: "random-trigger-announcement" },
            },
          ]
        : []),
      {
        type: "stack-item-added",
        item: createGrandArchiveTriggeredStackItem(
          state,
          pending,
          targetDeclaration.targets,
          pending.selectedModeIds,
          pending.variables,
        ),
        actorId: pending.controllerId,
        cause: { kind: "rule", rule: "triggered-ability" },
      },
    ];
    if (state.pendingTriggers.length === 1 && !grandArchiveOpportunityIsSuppressed(state)) {
      const activePlayers = activeGrandArchivePlayers(state);
      const turnPlayerIndex = state.turnOrder.indexOf(state.turn.playerId);
      const opportunityStarter = activePlayers.includes(state.turn.playerId)
        ? state.turn.playerId
        : [...state.turnOrder, ...state.turnOrder]
            .slice(turnPlayerIndex + 1, turnPlayerIndex + 1 + state.turnOrder.length)
            .find((playerId) => activePlayers.includes(playerId));
      if (!opportunityStarter) return events;
      events.push({
        type: "opportunity-opened",
        window: openGrandArchiveOpportunity(state, opportunityStarter, "stack-item-added"),
        cause: { kind: "rule", rule: "triggered-abilities-entered-stack" },
      });
    }
    return events;
  }
  return [
    {
      type: "decision-created",
      decision: {
        id: grandArchiveDecisionId(`decision-${state.nextDecisionOrdinal}`),
        kind: "announce-triggered-ability",
        playerId: pending.controllerId,
        pendingTriggerId: pending.id,
        ...(modes
          ? {
              modes: {
                choose: modes.choose,
                ...(modes.allowRepeat ? { allowRepeat: true as const } : {}),
                modes: modes.modes,
              },
            }
          : {}),
        baseTargets,
        stateVersion: state.stateVersion,
      },
      cause: { kind: "rule", rule: "announce-triggered-ability" },
    },
  ];
}

function assertNever(value: never): never {
  throw new Error(`Unhandled Grand Archive trigger variant: ${JSON.stringify(value)}`);
}
