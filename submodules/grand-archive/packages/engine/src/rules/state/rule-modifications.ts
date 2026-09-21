import type {
  GrandArchiveAbilityCost,
  GrandArchiveKeyword,
  GrandArchiveRuleAction,
  GrandArchiveRuleModification,
  GrandArchiveZone,
} from "@tcg/grand-archive-types";
import {
  flattenGrandArchiveAbilities,
  grandArchiveAbilityExecutionObject,
  grandArchiveAbilityIsFunctional,
  grandArchiveObjectFace,
} from "../../game/card-runtime.ts";
import { grandArchiveObjectTimestamp } from "./continuous.ts";
import { grandArchiveDurationStatus, type GrandArchiveDurationStatus } from "./durations.ts";
import {
  evaluateGrandArchiveAmount,
  evaluateGrandArchiveCondition,
  grandArchiveCounterKey,
  grandArchiveDefinitionMatchesCardFilter,
  matchesGrandArchiveCardFilter,
  resolveGrandArchivePlayers,
  resolveGrandArchiveSubjectObjects,
  GrandArchiveUnsupportedRuleError,
  withGrandArchiveDerivedVariables,
  type GrandArchiveEvaluationContext,
} from "../../procedures/effects/evaluation.ts";
import type {
  GrandArchiveObjectId,
  GrandArchivePlayerId,
  GrandArchiveStackItemId,
} from "../../game/identity.ts";
import { grandArchiveObjectActiveAbilities } from "../abilities/intrinsic-keywords.ts";
import type {
  GrandArchiveMatchState,
  GrandArchiveRuleModificationInstance,
} from "../../game/model.ts";
import type { GrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { observeGrandArchiveCommittedEvent } from "../../kernel/observed-events.ts";
import type { GrandArchiveCommittedEvent } from "../../kernel/events.ts";
import { GRAND_ARCHIVE_CROWDS_FAVOR_TARGET_RULE } from "../abilities/status-abilities.ts";

export interface GrandArchiveAppliedRule {
  /** Stable identity used by commands that opt into one particular optional rule. */
  readonly id: string;
  readonly effect: GrandArchiveRuleModification;
  /** Evaluation is rooted at the rule's source, not the action being modified. */
  readonly evaluation: GrandArchiveEvaluationContext;
  readonly timestamp: number;
  readonly order: number;
}

export interface GrandArchiveRuleRequest {
  readonly action: GrandArchiveRuleAction;
  readonly activationKind: "card" | "ability";
  readonly costComponent?: GrandArchiveRuleModification["costComponent"];
  /** Concrete method used for a `pay-cost` action. */
  readonly paymentMethodKind?: "remove-counter" | "rest";
  /** Counter kind affected by an add/remove-counter rule action. */
  readonly counter?: string;
  readonly playerId: GrandArchivePlayerId;
  /** Player whose object or stack item is acted upon, when distinct from the actor. */
  readonly subjectPlayerId?: GrandArchivePlayerId;
  readonly candidateId: GrandArchiveObjectId;
  /** Exact stack layer acted upon by stack-specific actions such as negation. */
  readonly stackItemId?: GrandArchiveStackItemId;
  /** Source responsible for the modified event, such as the object dealing damage. */
  readonly sourceId?: GrandArchiveObjectId;
  /** Damage classification when the modified action operates on damage prevention. */
  readonly damageKind?: "combat" | "non-combat";
  /**
   * Object performing an action whose concrete candidate is another object. For example,
   * a weapon is the candidate of `use-weapon-for-attack`, while the unit wielding it is
   * the actor object. This keeps filters and costs rooted at the weapon without losing
   * permissions granted to a particular attacker.
   */
  readonly actorObjectId?: GrandArchiveObjectId;
  /** Destination object for transition rules such as champion level-up. */
  readonly destinationId?: GrandArchiveObjectId;
  readonly fromZone: GrandArchiveZone;
  /** Objects explicitly used to perform this action, such as wielded weapons. */
  readonly usingIds?: readonly GrandArchiveObjectId[];
  /** Objects against which this action is performed, such as attack defenders. */
  readonly againstIds?: readonly GrandArchiveObjectId[];
  readonly abilityIdentity?: {
    readonly keyword?: string;
    readonly label?: string;
  };
  /** Keyword being granted when the modified action is `grant-keyword`. */
  readonly grantedKeyword?: GrandArchiveKeyword;
  readonly evaluation: GrandArchiveEvaluationContext;
}

function stackItemAbilityIdentity(
  event: GrandArchiveCommittedEvent,
): GrandArchiveRuleRequest["abilityIdentity"] | undefined {
  if (
    (event.type !== "stack-item-added" && event.type !== "stack-item-deferred") ||
    event.item.kind !== "activated-ability"
  ) {
    return undefined;
  }
  return {
    ...(event.item.ability.keyword ? { keyword: event.item.ability.keyword.name } : {}),
    ...(event.item.ability.label ? { label: event.item.ability.label.name } : {}),
  };
}

function grandArchiveKeywordsAreEqual(
  left: GrandArchiveKeyword,
  right: GrandArchiveKeyword,
): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

export interface GrandArchivePlayerRuleRequest {
  /** Player-level actions intentionally have no synthetic card candidate. */
  readonly action: Extract<
    GrandArchiveRuleAction,
    "draw" | "generate" | "glimpse" | "lose-game" | "play" | "recollect" | "recover"
  >;
  readonly playerId: GrandArchivePlayerId;
  /** Definition affected by a player action that operates on a card outside the game. */
  readonly candidateDefinitionId?: string;
  readonly evaluation: GrandArchiveEvaluationContext;
}

function occurrenceCount(
  instance: Pick<GrandArchiveRuleModificationInstance, "effect" | "createdAtVersion">,
  context: GrandArchiveEvaluationContext,
  playerId: GrandArchivePlayerId,
): number {
  const occurrence = instance.effect.occurrence;
  if (!occurrence) return 0;
  const currentTurnStart =
    occurrence.window === "this-turn"
      ? [...context.state.eventHistory].reverse().find((event) => event.type === "turn-started")
          ?.stateVersion
      : undefined;
  const notBeforeVersion = Math.max(instance.createdAtVersion, currentTurnStart ?? -1);
  let count = 0;
  for (const event of context.state.eventHistory) {
    if (event.stateVersion <= notBeforeVersion) continue;
    for (const observed of observeGrandArchiveCommittedEvent(event)) {
      if (
        observed.name === "keyword-action-performed" &&
        observed.keywordAction === instance.effect.action &&
        observed.actorId &&
        (occurrence.actorScope !== "same-player" || observed.actorId === playerId)
      ) {
        count += 1;
        continue;
      }
      const expectedEvent =
        instance.effect.activationKind === "ability" ? "ability-activated" : "card-activated";
      if (
        observed.name !== expectedEvent ||
        !observed.subjectId ||
        !observed.actorId ||
        (occurrence.actorScope === "same-player" && observed.actorId !== playerId)
      ) {
        continue;
      }
      const candidate = context.state.objects[observed.subjectId];
      const fromZone = observed.from ?? candidate?.zone;
      if (!fromZone) continue;
      const abilityIdentity = stackItemAbilityIdentity(event);
      if (
        ruleAppliesToCandidate(
          instance.effect,
          {
            action: instance.effect.action,
            activationKind: observed.stackItemType === "ability" ? "ability" : "card",
            playerId: observed.actorId,
            candidateId: observed.subjectId,
            fromZone,
            ...(abilityIdentity ? { abilityIdentity } : {}),
            evaluation: context,
          },
          context,
        )
      ) {
        count += 1;
      }
    }
  }
  return count;
}

/** Printed occurrence limits count their whole window, including events before entry. */
function staticRuleOccurrenceIsAvailable(
  effect: GrandArchiveRuleModification,
  context: GrandArchiveEvaluationContext,
  playerId: GrandArchivePlayerId,
): boolean {
  return (
    !effect.occurrence ||
    occurrenceCount({ effect, createdAtVersion: -1 }, context, playerId) < effect.occurrence.count
  );
}

function ruleAppliesToCandidate(
  effect: GrandArchiveRuleModification,
  request: GrandArchiveRuleRequest,
  evaluation: GrandArchiveEvaluationContext,
  lockedSubjects?: ReadonlySet<GrandArchiveObjectId>,
): boolean {
  const candidate = evaluation.state.objects[request.candidateId];
  if (!candidate || effect.action !== request.action) return false;
  if (
    effect.fromTopOfDeck &&
    (candidate.zone !== "main-deck" ||
      evaluation.state.zones[candidate.ownerId]["main-deck"][0] !== candidate.id)
  )
    return false;
  const destination = request.destinationId
    ? evaluation.state.objects[request.destinationId]
    : undefined;
  if (effect.activationKind && effect.activationKind !== request.activationKind) return false;
  if (effect.costComponent && effect.costComponent !== request.costComponent) return false;
  if (effect.counter && grandArchiveCounterKey(effect.counter) !== request.counter) return false;
  if (effect.paymentMethod) {
    if (effect.paymentMethod.kind !== request.paymentMethodKind) return false;
    if (
      effect.paymentMethod.kind === "remove-counter" &&
      grandArchiveCounterKey(effect.paymentMethod.counter) !== request.counter
    ) {
      return false;
    }
    const paymentSubjects = resolveGrandArchiveSubjectObjects(
      effect.paymentMethod.kind === "remove-counter"
        ? effect.paymentMethod.from
        : effect.paymentMethod.subject,
      evaluation,
    );
    if (!paymentSubjects.some((object) => object.id === request.candidateId)) return false;
  }
  if (
    effect.grantedKeyword &&
    (!request.grantedKeyword ||
      !grandArchiveKeywordsAreEqual(effect.grantedKeyword, request.grantedKeyword))
  ) {
    return false;
  }
  if (
    !effect.activationKind &&
    request.action === "activate" &&
    request.activationKind === "ability"
  ) {
    return false;
  }
  if (effect.abilityFilter) {
    if (request.activationKind !== "ability" || !request.abilityIdentity) return false;
    if (
      effect.abilityFilter.keyword &&
      effect.abilityFilter.keyword !== request.abilityIdentity.keyword
    ) {
      return false;
    }
    if (
      effect.abilityFilter.label &&
      effect.abilityFilter.label !== request.abilityIdentity.label
    ) {
      return false;
    }
  }
  if (effect.fromZone && effect.fromZone !== request.fromZone) return false;
  if (effect.damageKind && effect.damageKind !== request.damageKind) return false;
  if (effect.sourceFilter) {
    const source = request.sourceId ? evaluation.state.objects[request.sourceId] : undefined;
    if (
      !source ||
      !matchesGrandArchiveCardFilter(source, effect.sourceFilter, {
        ...evaluation,
        candidateId: source.id,
      })
    ) {
      return false;
    }
  }
  if (
    effect.actor &&
    !resolveGrandArchivePlayers(effect.actor, evaluation).includes(request.playerId)
  ) {
    return false;
  }
  if (effect.using) {
    const usingIds = request.usingIds ?? [];
    if (
      !resolveGrandArchiveSubjectObjects(effect.using, evaluation).some((object) =>
        usingIds.includes(object.id),
      )
    ) {
      return false;
    }
  }
  const conditionEvaluations = effect.against
    ? (request.againstIds ?? []).flatMap((againstId) => {
        const againstEvaluation = { ...evaluation, candidateId: againstId };
        return resolveGrandArchiveSubjectObjects(effect.against!, againstEvaluation).some(
          (object) => object.id === againstId,
        )
          ? [againstEvaluation]
          : [];
      })
    : [evaluation];
  if (conditionEvaluations.length === 0) return false;
  if (effect.subject?.kind === "player") {
    if (
      !resolveGrandArchivePlayers(effect.subject.player, evaluation).includes(
        request.subjectPlayerId ?? request.playerId,
      )
    ) {
      return false;
    }
  } else if (
    effect.subject &&
    !(lockedSubjects
      ? [candidate.id, request.actorObjectId, request.destinationId].some(
          (objectId) => objectId !== undefined && lockedSubjects.has(objectId),
        )
      : resolveGrandArchiveSubjectObjects(effect.subject, evaluation).some(
          (object) =>
            object.id === candidate.id ||
            object.id === request.actorObjectId ||
            ((request.action === "retaliate" ||
              request.action === "intercept" ||
              request.action === "redirect" ||
              request.action === "declare-target") &&
              effect.subject?.kind === "attacks-by" &&
              request.againstIds?.includes(object.id) === true) ||
            (request.action === "prevent-damage" &&
              request.againstIds?.includes(object.id) === true),
        ))
  ) {
    return false;
  }
  if (
    effect.mode !== "require" &&
    effect.destinationFilter &&
    (!destination ||
      !matchesGrandArchiveCardFilter(destination, effect.destinationFilter, {
        ...evaluation,
        candidateId: destination.id,
      }))
  ) {
    return false;
  }
  const filterCandidate = destination ?? candidate;
  return (
    (!effect.filter ||
      matchesGrandArchiveCardFilter(filterCandidate, effect.filter, {
        ...evaluation,
        candidateId: filterCandidate.id,
      })) &&
    (effect.mode === "require" ||
      !effect.condition ||
      conditionEvaluations.some((conditionEvaluation) =>
        evaluateGrandArchiveCondition(effect.condition!, conditionEvaluation),
      ))
  );
}

/**
 * Applies one already-active authored rule to a concrete object action.
 *
 * Card-resolution activation rules are scoped by their owning paragraph rather
 * than discovered as independent static abilities. They still use the exact
 * same candidate, target-binding, actor, and condition semantics as every
 * other rule modification.
 */
export function grandArchiveRuleModificationAppliesToRequest(
  effect: GrandArchiveRuleModification,
  request: GrandArchiveRuleRequest,
  sourceEvaluation: GrandArchiveEvaluationContext = request.evaluation,
): boolean {
  return ruleAppliesToCandidate(effect, request, {
    ...sourceEvaluation,
    bindings: { ...sourceEvaluation.bindings, eventActor: [request.playerId] },
  });
}

function ruleAppliesToPlayerAction(
  effect: GrandArchiveRuleModification,
  request: GrandArchivePlayerRuleRequest,
  evaluation: GrandArchiveEvaluationContext,
): boolean {
  if (effect.action !== request.action) return false;
  if (
    effect.activationKind ||
    effect.abilityFilter ||
    effect.costComponent ||
    effect.fromZone ||
    effect.using ||
    effect.against ||
    effect.destinationFilter ||
    effect.sourceFilter
  ) {
    return false;
  }
  if (
    effect.actor &&
    !resolveGrandArchivePlayers(effect.actor, evaluation).includes(request.playerId)
  ) {
    return false;
  }
  if (
    effect.subject &&
    (effect.subject.kind !== "player" ||
      !resolveGrandArchivePlayers(effect.subject.player, evaluation).includes(request.playerId))
  ) {
    return false;
  }
  if (
    effect.filter &&
    (!request.candidateDefinitionId ||
      !grandArchiveDefinitionMatchesCardFilter(
        request.candidateDefinitionId,
        effect.filter,
        evaluation,
      ))
  ) {
    return false;
  }
  return (
    !effect.condition ||
    evaluateGrandArchiveCondition(effect.condition, {
      ...evaluation,
      bindings: { ...evaluation.bindings, eventActor: [request.playerId] },
    })
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

/**
 * Collects every active rule that changes or adds a cost for one concrete game action.
 * Self-referential printed activation rules are checked on the card before it enters the
 * Effects Stack; other static sources must be in their normal functional zone.
 */
function collectGrandArchiveRules(
  request: GrandArchiveRuleRequest,
  accepts: (effect: GrandArchiveRuleModification) => boolean,
): readonly GrandArchiveAppliedRule[] {
  const { evaluation } = request;
  const candidate = evaluation.state.objects[request.candidateId];
  if (!candidate) return [];
  const actionBindings = { ...evaluation.bindings, eventActor: [request.playerId] };
  const rules: GrandArchiveAppliedRule[] = [];
  let order = 0;
  for (const playerId of evaluation.state.turnOrder) {
    if (evaluation.state.players[playerId]?.states["crowds-favor"] !== true) continue;
    const statusEvaluation: GrandArchiveEvaluationContext = {
      ...evaluation,
      controllerId: playerId,
      candidateId: request.destinationId ?? candidate.id,
      bindings: actionBindings,
    };
    if (
      accepts(GRAND_ARCHIVE_CROWDS_FAVOR_TARGET_RULE) &&
      ruleAppliesToCandidate(GRAND_ARCHIVE_CROWDS_FAVOR_TARGET_RULE, request, statusEvaluation)
    ) {
      rules.push({
        id: `status:crowds-favor:${playerId}`,
        effect: GRAND_ARCHIVE_CROWDS_FAVOR_TARGET_RULE,
        evaluation: statusEvaluation,
        timestamp: 0,
        order: order++,
      });
    }
  }
  for (const source of Object.values(evaluation.state.objects)) {
    const face = grandArchiveObjectFace(evaluation.program, source);
    const abilities = evaluation.skipCrossObjectKeywordDerivation
      ? flattenGrandArchiveAbilities(face.abilities)
      : grandArchiveObjectActiveAbilities(
          evaluation.program,
          evaluation.state,
          source,
          evaluation.derivingProperties
            ? { derivingProperties: evaluation.derivingProperties }
            : {},
        );
    for (const ability of abilities) {
      if (ability.kind !== "static" || ability.staticKind !== "effects") continue;
      if (
        !ability.effects.some((effect) => effect.kind === "rule-modification" && accepts(effect))
      ) {
        continue;
      }
      const executionObject = grandArchiveAbilityExecutionObject(evaluation.state, source, ability);
      if (!executionObject) continue;
      const sourceEvaluation = withGrandArchiveDerivedVariables(ability.variables, {
        ...evaluation,
        controllerId: executionObject.controllerId,
        sourceId: executionObject.id,
        abilityBearerId: executionObject.id,
        candidateId: request.destinationId ?? candidate.id,
        bindings: actionBindings,
      });
      const selfRuleBeforeStackEntry =
        source.id === candidate.id && ability.functionalZones === undefined;
      if (
        (!selfRuleBeforeStackEntry && !grandArchiveAbilityIsFunctional(face, ability, source)) ||
        !staticRestrictionsAreSatisfied(ability, sourceEvaluation) ||
        (ability.condition && !evaluateGrandArchiveCondition(ability.condition, sourceEvaluation))
      ) {
        continue;
      }
      for (const [effectIndex, effect] of ability.effects.entries()) {
        if (
          effect.kind !== "rule-modification" ||
          !accepts(effect) ||
          !ruleAppliesToCandidate(effect, request, sourceEvaluation) ||
          !staticRuleOccurrenceIsAvailable(effect, sourceEvaluation, request.playerId)
        ) {
          continue;
        }
        rules.push({
          id: `static:${source.id}:${ability.id}:${effectIndex}`,
          effect,
          evaluation: sourceEvaluation,
          timestamp: grandArchiveObjectTimestamp(source, sourceEvaluation),
          order: order++,
        });
      }
    }
  }
  for (const instance of evaluation.state.ruleModifications) {
    const effect = instance.effect;
    if (!accepts(effect)) continue;
    const sourceEvaluation: GrandArchiveEvaluationContext = {
      ...evaluation,
      controllerId: instance.controllerId,
      ...(instance.sourceId
        ? { sourceId: instance.sourceId, abilityBearerId: instance.sourceId }
        : {}),
      candidateId: request.destinationId ?? candidate.id,
      bindings: { ...instance.bindings, ...actionBindings },
      variables: { ...instance.variables, ...evaluation.variables },
    };
    const lockedSubjects = new Set(
      instance.affectedObjectIds.filter(
        (objectId) =>
          evaluation.state.objects[objectId]?.incarnation ===
          instance.affectedObjectIncarnations[objectId],
      ),
    );
    if (
      grandArchiveRuleModificationIsActive(instance, sourceEvaluation, request.playerId, request) &&
      ruleAppliesToCandidate(
        effect,
        request,
        sourceEvaluation,
        effect.affectedSet === "locked" ? lockedSubjects : undefined,
      )
    ) {
      rules.push({
        id: `instance:${instance.id}`,
        effect,
        evaluation: sourceEvaluation,
        timestamp: instance.createdAtVersion,
        order: order++,
      });
    }
  }
  return rules.sort((left, right) => left.timestamp - right.timestamp || left.order - right.order);
}

export function collectGrandArchiveCostRules(
  request: GrandArchiveRuleRequest,
): readonly GrandArchiveAppliedRule[] {
  const accepts = (effect: GrandArchiveRuleModification) =>
    effect.mode === "modify-cost" || effect.mode === "replace-cost" || effect.mode === "add-cost";
  const rules = collectGrandArchiveRules(request, accepts);
  if (
    request.action !== "materialize" &&
    !(request.action === "activate" && request.activationKind === "card")
  )
    return rules;
  return [...rules, ...collectGrandArchiveRules({ ...request, action: "play" }, accepts)].sort(
    (left, right) => left.timestamp - right.timestamp || left.order - right.order,
  );
}

export function collectGrandArchiveActionRules(
  request: GrandArchiveRuleRequest,
): readonly GrandArchiveAppliedRule[] {
  return collectGrandArchiveRules(
    request,
    (effect) => effect.mode === "allow" || effect.mode === "forbid" || effect.mode === "require",
  );
}

/** Restrictions using “can't” or “may not” override permissions for an object action. */
export function grandArchiveActionIsForbidden(request: GrandArchiveRuleRequest): boolean {
  return collectGrandArchiveActionRules(request).some((rule) => rule.effect.mode === "forbid");
}

/** Collects optional ways an active rule permits the payer to satisfy part of a cost. */
export function collectGrandArchivePaymentContributionRules(
  request: GrandArchiveRuleRequest,
): readonly GrandArchiveAppliedRule[] {
  return collectGrandArchiveRules(
    request,
    (effect) => effect.mode === "payment-contribution" && effect.action === "pay-cost",
  );
}

/** Collects mutually exclusive rule-value substitutions in oldest-to-newest timestamp order. */
export function collectGrandArchiveValueRules(
  request: GrandArchiveRuleRequest,
): readonly GrandArchiveAppliedRule[] {
  return collectGrandArchiveRules(request, (effect) => effect.mode === "use-property");
}

function collectGrandArchivePlayerRules(
  request: GrandArchivePlayerRuleRequest,
  accepts: (effect: GrandArchiveRuleModification) => boolean,
): readonly GrandArchiveAppliedRule[] {
  const { evaluation } = request;
  const rules: GrandArchiveAppliedRule[] = [];
  let order = 0;
  for (const source of Object.values(evaluation.state.objects)) {
    const face = grandArchiveObjectFace(evaluation.program, source);
    const abilities = evaluation.skipCrossObjectKeywordDerivation
      ? flattenGrandArchiveAbilities(face.abilities)
      : grandArchiveObjectActiveAbilities(
          evaluation.program,
          evaluation.state,
          source,
          evaluation.derivingProperties
            ? { derivingProperties: evaluation.derivingProperties }
            : {},
        );
    for (const ability of abilities) {
      if (ability.kind !== "static" || ability.staticKind !== "effects") continue;
      if (
        !ability.effects.some((effect) => effect.kind === "rule-modification" && accepts(effect))
      ) {
        continue;
      }
      const executionObject = grandArchiveAbilityExecutionObject(evaluation.state, source, ability);
      if (!executionObject) continue;
      const sourceEvaluation = withGrandArchiveDerivedVariables(ability.variables, {
        ...evaluation,
        controllerId: executionObject.controllerId,
        sourceId: executionObject.id,
        abilityBearerId: executionObject.id,
      });
      if (
        !grandArchiveAbilityIsFunctional(face, ability, source) ||
        !staticRestrictionsAreSatisfied(ability, sourceEvaluation) ||
        (ability.condition && !evaluateGrandArchiveCondition(ability.condition, sourceEvaluation))
      ) {
        continue;
      }
      for (const [effectIndex, effect] of ability.effects.entries()) {
        if (
          effect.kind !== "rule-modification" ||
          !accepts(effect) ||
          !ruleAppliesToPlayerAction(effect, request, sourceEvaluation) ||
          !staticRuleOccurrenceIsAvailable(effect, sourceEvaluation, request.playerId)
        ) {
          continue;
        }
        rules.push({
          id: `static:${source.id}:${ability.id}:${effectIndex}`,
          effect,
          evaluation: sourceEvaluation,
          timestamp: grandArchiveObjectTimestamp(source, sourceEvaluation),
          order: order++,
        });
      }
    }
  }
  for (const instance of evaluation.state.ruleModifications) {
    const effect = instance.effect;
    if (!accepts(effect) || effect.action !== request.action) continue;
    const sourceEvaluation: GrandArchiveEvaluationContext = {
      ...evaluation,
      controllerId: instance.controllerId,
      ...(instance.sourceId
        ? { sourceId: instance.sourceId, abilityBearerId: instance.sourceId }
        : {}),
      bindings: { ...instance.bindings, ...evaluation.bindings },
      variables: { ...instance.variables, ...evaluation.variables },
    };
    if (
      grandArchiveRuleModificationIsActive(instance, sourceEvaluation, request.playerId) &&
      ruleAppliesToPlayerAction(effect, request, sourceEvaluation)
    ) {
      rules.push({
        id: `instance:${instance.id}`,
        effect,
        evaluation: sourceEvaluation,
        timestamp: instance.createdAtVersion,
        order: order++,
      });
    }
  }
  return rules.sort((left, right) => left.timestamp - right.timestamp || left.order - right.order);
}

/** Collects rules for actions performed by a player rather than by a card or object. */
export function collectGrandArchivePlayerActionRules(
  request: GrandArchivePlayerRuleRequest,
): readonly GrandArchiveAppliedRule[] {
  return collectGrandArchivePlayerRules(
    request,
    (effect) => effect.mode === "allow" || effect.mode === "forbid" || effect.mode === "require",
  );
}

/** Restrictions using “can't” or “may not” override permissions for a player action. */
export function grandArchivePlayerActionIsForbidden(
  request: GrandArchivePlayerRuleRequest,
): boolean {
  return collectGrandArchivePlayerActionRules(request).some(
    (rule) => rule.effect.mode === "forbid",
  );
}

/** Collects numeric caps and adjustments applied to a player-level action. */
export function collectGrandArchivePlayerLimitRules(
  request: GrandArchivePlayerRuleRequest,
): readonly GrandArchiveAppliedRule[] {
  return collectGrandArchivePlayerRules(request, (effect) => effect.mode === "modify-limit");
}

/** Applies player-action limit rules in continuous-effect timestamp order. */
export function deriveGrandArchivePlayerActionLimit(
  request: GrandArchivePlayerRuleRequest,
  baseLimit: number,
): number {
  let limit = baseLimit;
  for (const rule of collectGrandArchivePlayerLimitRules(request)) {
    const modifier = rule.effect.amount
      ? evaluateGrandArchiveAmount(rule.effect.amount, rule.evaluation)
      : 0;
    if (!Number.isSafeInteger(modifier) || modifier < 0) {
      throw new GrandArchiveUnsupportedRuleError(
        `${request.action} limit modifier must be a non-negative integer`,
      );
    }
    switch (rule.effect.costOperation) {
      case "add":
        limit += modifier;
        break;
      case "subtract":
        limit -= modifier;
        break;
      case "set":
        limit = modifier;
        break;
      case undefined:
        limit = Math.min(limit, modifier);
        break;
    }
  }
  return Math.max(0, limit);
}

function currentTurnBoundary(state: GrandArchiveMatchState): number {
  return (
    [...state.eventHistory].reverse().find((event) => event.type === "turn-started")
      ?.stateVersion ?? -1
  );
}

/** Counts successfully committed player actions during the current global turn. */
export function grandArchivePlayerActionCountThisTurn(
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  action: "draw" | "play",
): number {
  const boundary = currentTurnBoundary(state);
  if (action === "draw") {
    return state.eventHistory.filter(
      (event) =>
        event.stateVersion > boundary &&
        event.type === "object-moved" &&
        event.cause?.kind === "rule" &&
        (event.cause.rule === "draw-effect" || event.cause.rule === "draw-turn-based-action") &&
        (event.actorId === playerId ||
          (!event.actorId && state.objects[event.objectId]?.ownerId === playerId)),
    ).length;
  }
  return state.eventHistory.filter(
    (event) =>
      event.stateVersion > boundary &&
      (event.type === "stack-item-added" || event.type === "stack-item-deferred") &&
      (event.item.kind === "card-activation" ||
        event.item.kind === "materialization" ||
        event.item.kind === "bestowment") &&
      !event.item.isCopy &&
      event.item.controllerId === playerId,
  ).length;
}

/** Remaining draws or card plays available to a player this turn. */
export function grandArchiveRemainingPlayerActionAllowance(
  request: GrandArchivePlayerRuleRequest & { readonly action: "draw" | "play" },
): number {
  const limit = deriveGrandArchivePlayerActionLimit(request, Number.POSITIVE_INFINITY);
  return Math.max(
    0,
    limit -
      grandArchivePlayerActionCountThisTurn(
        request.evaluation.state,
        request.playerId,
        request.action,
      ),
  );
}

export function combineGrandArchiveCosts(
  costs: readonly GrandArchiveAbilityCost[],
): GrandArchiveAbilityCost | undefined {
  const [first, ...rest] = costs;
  if (!first) return undefined;
  return rest.length === 0 ? first : { kind: "all", costs: [first, ...rest] };
}

function durationIsActive(
  instance: GrandArchiveRuleModificationInstance,
  context: GrandArchiveEvaluationContext,
  request?: GrandArchiveRuleRequest,
): boolean {
  const duration = instance.effect.duration;
  if (ruleModificationDurationStatus(instance, context) !== "active") return false;
  if (duration.kind !== "for-next-event") return true;

  const protectedStackItemId = nextEventNegationProtectionStackItemId(instance, context);
  if (protectedStackItemId !== undefined) {
    const remainsPending = context.state.stack.some((item) => item.id === protectedStackItemId);
    if (!remainsPending) return false;
    return request === undefined || request.stackItemId === protectedStackItemId;
  }
  if (instance.effect.mode === "forbid" && instance.effect.action === "negate") {
    return request === undefined;
  }

  const requestForObservedEvent = (
    subjectId: GrandArchiveObjectId,
    actorId: GrandArchivePlayerId,
    fromZone: GrandArchiveZone,
    stackItemType: "ability" | "card-activation" | "materialization" | undefined,
    abilityIdentity?: GrandArchiveRuleRequest["abilityIdentity"],
  ): GrandArchiveRuleRequest | undefined => {
    const action =
      duration.event === "card-activated" || duration.event === "ability-activated"
        ? instance.effect.action === "activate-fast"
          ? "activate-fast"
          : "activate"
        : duration.event === "card-materialized"
          ? "materialize"
          : undefined;
    if (!action) return undefined;
    return {
      action,
      activationKind: stackItemType === "ability" ? "ability" : "card",
      playerId: actorId,
      candidateId: subjectId,
      fromZone,
      ...(abilityIdentity ? { abilityIdentity } : {}),
      evaluation: context,
    };
  };
  let notBeforeVersion = instance.createdAtVersion;
  if (duration.starts) {
    const startEvent = context.state.eventHistory.find(
      (event) =>
        event.stateVersion > instance.createdAtVersion &&
        event.type === "turn-started" &&
        instance.durationAnchors.startsPlayerIds?.includes(event.playerId),
    );
    if (!startEvent) return false;
    notBeforeVersion = startEvent.stateVersion;
  }
  for (const event of context.state.eventHistory) {
    if (event.stateVersion <= notBeforeVersion) continue;
    for (const observed of observeGrandArchiveCommittedEvent(event)) {
      if (observed.name !== duration.event || !observed.subjectId || !observed.actorId) continue;
      const candidate = context.state.objects[observed.subjectId];
      const fromZone = observed.from ?? candidate?.zone;
      if (!fromZone) continue;
      const abilityIdentity = stackItemAbilityIdentity(event);
      const request = requestForObservedEvent(
        observed.subjectId,
        observed.actorId,
        fromZone,
        observed.stackItemType,
        abilityIdentity,
      );
      if (request && ruleAppliesToCandidate(instance.effect, request, context)) return false;
    }
  }
  return true;
}

function nextEventNegationProtectionStackItemId(
  instance: GrandArchiveRuleModificationInstance,
  context: GrandArchiveEvaluationContext,
): GrandArchiveStackItemId | undefined {
  const { duration } = instance.effect;
  if (
    instance.effect.mode !== "forbid" ||
    instance.effect.action !== "negate" ||
    duration.kind !== "for-next-event" ||
    (duration.event !== "card-activated" &&
      duration.event !== "card-materialized" &&
      duration.event !== "ability-activated")
  ) {
    return undefined;
  }
  let notBeforeVersion = instance.createdAtVersion;
  if (duration.starts) {
    const startEvent = context.state.eventHistory.find(
      (event) =>
        event.stateVersion > instance.createdAtVersion &&
        event.type === "turn-started" &&
        instance.durationAnchors.startsPlayerIds?.includes(event.playerId),
    );
    if (!startEvent) return undefined;
    notBeforeVersion = startEvent.stateVersion;
  }
  for (const event of context.state.eventHistory) {
    if (
      event.stateVersion <= notBeforeVersion ||
      (event.type !== "stack-item-added" && event.type !== "stack-item-deferred")
    ) {
      continue;
    }
    for (const observed of observeGrandArchiveCommittedEvent(event)) {
      if (observed.name !== duration.event || !observed.subjectId) {
        continue;
      }
      const observedActorId = observed.actorId ?? event.item.controllerId;
      const candidate = context.state.objects[observed.subjectId];
      const fromZone = observed.from ?? candidate?.zone;
      if (!candidate || !fromZone) continue;
      const activationKind = observed.stackItemType === "ability" ? "ability" : "card";
      const activationAction = observed.name === "card-materialized" ? "materialize" : "activate";
      const matchingEffect: GrandArchiveRuleModification = {
        ...instance.effect,
        action: activationAction,
      };
      if (
        ruleAppliesToCandidate(
          matchingEffect,
          {
            action: activationAction,
            activationKind,
            playerId: observedActorId,
            candidateId: observed.subjectId,
            fromZone,
            evaluation: context,
          },
          context,
        )
      ) {
        return event.item.id;
      }
    }
  }
  return undefined;
}

function ruleModificationDurationStatus(
  instance: GrandArchiveRuleModificationInstance,
  context: GrandArchiveEvaluationContext,
): GrandArchiveDurationStatus {
  const duration = instance.effect.duration;
  const subjects =
    duration.kind === "while-subjects-in-zone"
      ? resolveGrandArchiveSubjectObjects(duration.subjects, context)
      : [];
  return grandArchiveDurationStatus(duration, instance, context, {
    conditionMet:
      !instance.effect.condition ||
      evaluateGrandArchiveCondition(instance.effect.condition, context),
    subjectsRemainInZone:
      duration.kind === "while-subjects-in-zone" &&
      subjects.length > 0 &&
      (duration.scope === "all"
        ? subjects.every((object) => object.zone === duration.zone)
        : subjects.some((object) => object.zone === duration.zone)),
  });
}

function appliesToPlayer(
  effect: GrandArchiveRuleModification,
  playerId: GrandArchivePlayerId,
  context: GrandArchiveEvaluationContext,
): boolean {
  if (effect.actor && !resolveGrandArchivePlayers(effect.actor, context).includes(playerId)) {
    return false;
  }
  if (effect.subject?.kind === "player") {
    return resolveGrandArchivePlayers(effect.subject.player, context).includes(playerId);
  }
  return true;
}

export function grandArchiveRuleModificationIsActive(
  instance: GrandArchiveRuleModificationInstance,
  context: GrandArchiveEvaluationContext,
  playerId: GrandArchivePlayerId = instance.controllerId,
  request?: GrandArchiveRuleRequest,
): boolean {
  const occurrenceIsAvailable =
    !instance.effect.occurrence ||
    instance.effect.mode === "replace-cost" ||
    instance.effect.mode === "add-cost" ||
    instance.effect.duration.kind === "for-next-event" ||
    occurrenceCount(instance, context, playerId) < instance.effect.occurrence.count;
  return (
    durationIsActive(instance, context, request) &&
    (!instance.effect.condition ||
      evaluateGrandArchiveCondition(instance.effect.condition, context)) &&
    occurrenceIsAvailable
  );
}

export function grandArchiveGrantedKeywordsForAction(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  action: GrandArchiveRuleAction,
  objectId: GrandArchiveObjectId,
): readonly GrandArchiveKeyword[] {
  const object = state.objects[objectId];
  if (!object) return [];
  return state.ruleModifications.flatMap((instance): readonly GrandArchiveKeyword[] => {
    const effect = instance.effect;
    if (effect.mode !== "grant-keyword" || effect.action !== action || !effect.grantedKeyword) {
      return [];
    }
    const context: GrandArchiveEvaluationContext = {
      program,
      state,
      controllerId: instance.controllerId,
      ...(instance.sourceId
        ? { sourceId: instance.sourceId, abilityBearerId: instance.sourceId }
        : {}),
      candidateId: object.id,
      bindings: instance.bindings,
      variables: instance.variables,
    };
    return grandArchiveRuleModificationIsActive(instance, context, playerId) &&
      appliesToPlayer(effect, playerId, context) &&
      (!effect.filter || matchesGrandArchiveCardFilter(object, effect.filter, context))
      ? [effect.grantedKeyword]
      : [];
  });
}

export function collectExpiredGrandArchiveRuleModifications(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
): readonly string[] {
  return state.ruleModifications.flatMap((instance) => {
    const context: GrandArchiveEvaluationContext = {
      program,
      state,
      controllerId: instance.controllerId,
      ...(instance.sourceId
        ? { sourceId: instance.sourceId, abilityBearerId: instance.sourceId }
        : {}),
      bindings: instance.bindings,
      variables: instance.variables,
    };
    const status = ruleModificationDurationStatus(instance, context);
    const nextEventWasConsumed =
      instance.effect.duration.kind === "for-next-event" &&
      status === "active" &&
      !durationIsActive(instance, context);
    const occurrenceWasConsumed =
      instance.effect.occurrence !== undefined &&
      instance.effect.mode !== "modify-cost" &&
      instance.effect.mode !== "replace-cost" &&
      instance.effect.mode !== "add-cost" &&
      instance.effect.duration.kind !== "for-next-event" &&
      occurrenceCount(instance, context, instance.controllerId) >= instance.effect.occurrence.count;
    return status === "expired" || nextEventWasConsumed || occurrenceWasConsumed
      ? [instance.id]
      : [];
  });
}

function assertNever(value: never): never {
  throw new Error(`Unhandled Grand Archive rule modification duration: ${JSON.stringify(value)}`);
}
