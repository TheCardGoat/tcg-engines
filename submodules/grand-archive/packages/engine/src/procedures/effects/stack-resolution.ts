import { grandArchiveCardIsObject, grandArchiveObjectFace } from "../../game/card-runtime.ts";
import type {
  GrandArchiveAbilityCost,
  GrandArchiveAmount,
  GrandArchiveCardFilter,
  GrandArchiveEffect,
  GrandArchiveMoveDestination,
  GrandArchiveObjectState,
  GrandArchiveResolutionChoice,
  GrandArchiveSelectionCount,
  GrandArchiveTargetDeclaration,
  GrandArchiveVariableDeclaration,
} from "@tcg/grand-archive-types";
import {
  grandArchiveEffectAttackCandidates,
  grandArchiveResolvedAttackCandidates,
} from "../combat/combat.ts";
import {
  deriveGrandArchiveCharacteristics,
  grandArchiveObjectCurrentCharacteristics,
} from "../../rules/state/continuous.ts";
import {
  declareGrandArchiveModes,
  declareGrandArchiveTargets,
  grandArchiveChampionLevelUpRequirements,
  deterministicallyDeclareGrandArchiveResolutionChoice,
  grandArchiveLevelUpCandidates,
  grandArchiveSelectionCountBounds,
  getGrandArchiveAnnouncementModes,
  grandArchiveTargetingContext,
  isGrandArchiveTargetCandidate,
  randomlyDeclareGrandArchiveResolutionChoice,
  ruleGrantsPermissionToPlayer,
} from "../activation/activation.ts";
import {
  executeGrandArchiveEffect,
  grandArchiveEffectFieldEntryObjects,
} from "./effect-executor.ts";
import type {
  GrandArchiveCommittedEvent,
  GrandArchiveProposedEvent,
  GrandArchiveStackItemFizzleReason,
} from "../../kernel/events.ts";
import {
  evaluateGrandArchiveAmount,
  evaluateGrandArchiveCondition,
  grandArchiveCounterKey,
  grandArchiveEvaluationObject,
  grandArchiveObjectCounterCount,
  resolveGrandArchiveCollection,
  resolveGrandArchivePlayers,
  resolveGrandArchiveSubjectObjects,
  type GrandArchiveEvaluationContext,
  type GrandArchiveExecutionBinding,
  GrandArchiveUnsupportedRuleError,
} from "./evaluation.ts";
import { grandArchiveDecisionId, grandArchiveObjectId } from "../../game/identity.ts";
import type {
  GrandArchiveObjectId,
  GrandArchivePlayerId,
  GrandArchiveTargetId,
} from "../../game/identity.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import {
  GRAND_ARCHIVE_LINK_TARGET_BINDING,
  grandArchiveLinkChoiceCandidates,
} from "../../game/link.ts";
import type { GrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { grandArchiveMasteryCounterCount } from "../../game/mastery.ts";
import type {
  GrandArchiveEffectResolution,
  GrandArchiveCardInstance,
  GrandArchiveMatchState,
  GrandArchiveResolutionFrame,
  GrandArchiveShiftingCurrentsDirection,
  GrandArchiveStackItem,
} from "../../game/model.ts";
import {
  grandArchiveModifiedResultAmount,
  grandArchiveModifiedResultBinding,
  grandArchiveModifiedResultMetricForEffect,
  type GrandArchiveModifiedResultMetric,
} from "../../kernel/modified-results.ts";
import {
  grandArchiveOpportunityIsSuppressed,
  openGrandArchiveOpportunity,
} from "../game-flow/opportunity.ts";
import { nextGrandArchiveRandom, rollGrandArchiveDice } from "../../game/random.ts";
import { applyGrandArchiveReferenceSubstitutions } from "../../kernel/reference-substitution.ts";
import { composeGrandArchivePendingCardResolution } from "../activation/play-restrictions.ts";
import {
  collectGrandArchiveActionRules,
  grandArchivePlayerActionIsForbidden,
} from "../../rules/state/rule-modifications.ts";
import {
  grandArchiveObjectHasActiveKeyword,
  grandArchivePlayerControlsActiveKeyword,
} from "../../rules/abilities/intrinsic-keywords.ts";
import {
  grandArchiveSimultaneousSelectionIsPublic,
  type GrandArchivePublicSimultaneousSelection,
} from "../../projection/simultaneous-selection-visibility.ts";
import { applyGrandArchiveInlineRestrictions } from "../../rules/abilities/ability-restrictions.ts";

export interface GrandArchiveStackResolutionResult {
  readonly state: GrandArchiveMatchState;
  readonly events: readonly GrandArchiveCommittedEvent[];
  readonly resolvedItem: GrandArchiveStackItem;
  readonly fizzled: boolean;
  readonly paused: boolean;
  readonly triggerEvents: readonly GrandArchiveCommittedEvent[];
}

function itemEffect(
  item: GrandArchiveStackItem,
  ability = itemAbility(item),
): GrandArchiveEffect | undefined {
  if (item.kind === "replacement-follow-up") return item.effect;
  if (
    item.kind === "card-activation" ||
    item.kind === "materialization" ||
    item.kind === "bestowment"
  ) {
    const effects = [
      ...(ability?.effect ? [applyGrandArchiveInlineRestrictions(ability, ability.effect)] : []),
      ...(item.activationResult?.afterResolutionEffects ?? []),
    ];
    const [first, ...rest] = effects;
    if (!first) return undefined;
    return rest.length === 0 ? first : { kind: "sequence", effects: [first, ...rest] };
  }
  if (!ability) return undefined;
  if ("effect" in ability && ability.effect) {
    return applyGrandArchiveInlineRestrictions(ability, ability.effect);
  }
  if ("intrinsic" in ability && ability.intrinsic && ability.keyword.name === "intercept") {
    return {
      kind: "optional",
      player: "controller",
      allOrNothing: true,
      effect: {
        kind: "retarget",
        subject: { kind: "current-attack" },
        chooser: "controller",
        oldTarget: { kind: "event-recipient" },
        newTarget: { kind: "source" },
        requireNewTargetObedience: true,
      },
    };
  }
  if ("intrinsic" in ability && ability.intrinsic && ability.keyword.name === "vigor") {
    return { kind: "wake", subject: { kind: "source" } };
  }
  if ("intrinsic" in ability && ability.intrinsic && ability.keyword.name === "foster") {
    return {
      kind: "set-object-state",
      subject: { kind: "source" },
      state: "fostered",
      value: true,
    };
  }
  if ("intrinsic" in ability && ability.intrinsic && ability.keyword.name === "preserve") {
    return {
      kind: "sequence",
      effects: [
        {
          kind: "move",
          subject: { kind: "source" },
          from: "graveyard",
          destination: { zone: "material-deck" },
          facing: "face-up",
          bindResultAs: "preserved-card",
        },
        {
          kind: "set-object-state",
          subject: { kind: "bound", binding: "preserved-card" },
          state: "preserved",
          value: true,
        },
      ],
    };
  }
  if ("cascade" in ability && ability.cascade) {
    const selected = item.selectedModeIds.flatMap((modeId) => {
      const mode = ability.cascade?.modes.find((entry) => entry.id === modeId);
      return mode ? [mode] : [];
    });
    if (selected.length > 1) {
      throw new Error("A Cascade ability selected more than one corresponding effect");
    }
    return selected[0]?.effect;
  }
  throw new GrandArchiveUnsupportedRuleError("intrinsic stack ability registry");
}

function itemAbility(item: GrandArchiveStackItem) {
  return item.kind === "replacement-follow-up" ? undefined : item.ability;
}

function effectiveItemAbility(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  item: GrandArchiveStackItem,
  championLevelModifier: number,
  elysianAuraActive: boolean,
) {
  if (
    item.kind !== "card-activation" &&
    item.kind !== "materialization" &&
    item.kind !== "bestowment"
  ) {
    return itemAbility(item);
  }
  const source = state.objects[item.cardId];
  if (!source) return item.ability;
  return composeGrandArchivePendingCardResolution(
    grandArchiveObjectFace(program, source),
    {
      program,
      state,
      controllerId: item.controllerId,
      sourceId: source.id,
      abilityBearerId: source.id,
      bindings: item.bindings,
      variables: item.variables,
      ...(championLevelModifier > 0
        ? {
            championLevelModifier: {
              controllerId: item.controllerId,
              amount: championLevelModifier,
            },
          }
        : {}),
    },
    item.announcedCardResolutionAbilities,
    {
      reevaluateStaticRestrictions:
        item.kind === "card-activation" &&
        item.elysianAuraActiveAtAnnouncement !== elysianAuraActive,
    },
  );
}

function allEmbeddedModes(
  effect: import("@tcg/grand-archive-types").GrandArchiveEffect,
): readonly import("@tcg/grand-archive-types").GrandArchiveModeEffect[] {
  switch (effect.kind) {
    case "select-modes":
      return effect.modes;
    case "sequence":
      return effect.effects.flatMap(allEmbeddedModes);
    case "conditional":
      return [
        ...allEmbeddedModes(effect.then),
        ...(effect.else ? allEmbeddedModes(effect.else) : []),
      ];
    case "perform-as":
    case "bind-value":
    case "attempt":
      return allEmbeddedModes(effect.effect);
    case "unless-performed":
      return [...allEmbeddedModes(effect.alternative), ...allEmbeddedModes(effect.otherwise)];
    default:
      return [];
  }
}

function selectedModes(item: GrandArchiveStackItem, ability = itemAbility(item)) {
  const explicit = ability?.modes?.modes ?? [];
  const cascade = ability && "cascade" in ability ? (ability.cascade?.modes ?? []) : [];
  const effect = itemEffect(item, ability);
  const embedded = effect ? allEmbeddedModes(effect) : [];
  return item.selectedModeIds.map((id) => {
    const mode = [...explicit, ...cascade, ...embedded].find((candidate) => candidate.id === id);
    if (!mode) throw new Error(`Selected mode no longer exists: ${id}`);
    return mode;
  });
}

function targetDeclarationsForItem(
  item: GrandArchiveStackItem,
): readonly import("@tcg/grand-archive-types").GrandArchiveTargetDeclaration[] {
  if (item.targetDeclarations) return item.targetDeclarations;
  const ability = itemAbility(item);
  return [
    ...(ability?.targets ?? []),
    ...selectedModes(item).flatMap((mode) => mode.targets ?? []),
  ];
}

export function declareGrandArchiveRetargetedStackItem(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  item: GrandArchiveStackItem,
  declarations: readonly import("@tcg/grand-archive-types").GrandArchiveTargetDeclaration[],
  submitted: Readonly<Record<string, readonly GrandArchiveTargetId[]>>,
): GrandArchiveStackItem {
  const sourceInformationContext: GrandArchiveEvaluationContext = {
    program,
    state,
    controllerId: item.controllerId,
    ...(item.sourceId
      ? {
          sourceId: item.sourceId,
          abilityBearerId: item.sourceId,
          sourceIdentityId: item.sourceId,
          ...(item.sourceIncarnation !== undefined
            ? { sourceIncarnation: item.sourceIncarnation }
            : {}),
        }
      : {}),
    ...(item.sourceLkiEventId
      ? {
          sourceLkiEventId: item.sourceLkiEventId,
          sourceInformationBasis: "last-known",
        }
      : {}),
    bindings: item.bindings,
    variables: item.variables,
  };
  const source = item.sourceId
    ? grandArchiveEvaluationObject(item.sourceId, sourceInformationContext, true)
    : undefined;
  const kind =
    item.kind === "materialization"
      ? "materialization"
      : item.kind === "activated-ability"
        ? "activated-ability"
        : item.kind === "triggered-ability"
          ? "triggered-ability"
          : item.kind === "bestowment"
            ? "bestowment"
            : "card-activation";
  const evaluation: GrandArchiveEvaluationContext = {
    program,
    state,
    controllerId: item.controllerId,
    ...(item.sourceId
      ? {
          sourceId: item.sourceId,
          abilityBearerId: item.sourceId,
          sourceIdentityId: item.sourceId,
          ...(item.sourceIncarnation !== undefined
            ? { sourceIncarnation: item.sourceIncarnation }
            : {}),
        }
      : {}),
    ...(item.sourceLkiEventId ? { sourceLkiEventId: item.sourceLkiEventId } : {}),
    bindings: item.bindings,
    variables: item.variables,
    ...(source
      ? {
          targeting: grandArchiveTargetingContext(
            kind,
            grandArchiveObjectCurrentCharacteristics(program, state, source).subtypes,
            [itemEffect(item), ...selectedModes(item).map((mode) => mode.effect)],
            item.kind === "triggered-ability" &&
              "resolutionAs" in item.ability &&
              item.ability.resolutionAs === "spell",
          ),
        }
      : {}),
  };
  const targets = declareGrandArchiveTargets(declarations, submitted, evaluation);
  return {
    ...item,
    targetDeclarations: declarations,
    targets,
  };
}

export function declareGrandArchiveRemodedStackItem(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  item: GrandArchiveStackItem,
  selectedModeIds: readonly string[],
  mayRetarget: boolean,
): GrandArchiveStackItem {
  const remoded: GrandArchiveStackItem = {
    ...item,
    selectedModeIds,
    targetDeclarations: undefined,
  };
  if (mayRetarget) return remoded;
  const declarations = targetDeclarationsForItem(remoded);
  const existingByBinding = new Map(
    item.targets.map((target) => [target.binding, target.targetIds]),
  );
  const submitted = Object.fromEntries(
    declarations.map((declaration) => [
      declaration.id,
      existingByBinding.get(declaration.id) ?? [],
    ]),
  );
  return declareGrandArchiveRetargetedStackItem(program, state, remoded, declarations, submitted);
}

function defaultCardDestination(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  item: Extract<
    GrandArchiveStackItem,
    { readonly kind: "card-activation" | "materialization" | "bestowment" }
  >,
  fizzled: boolean,
): GrandArchiveProposedEvent | null {
  const card = state.objects[item.cardId];
  if (!card || card.zone !== "effects-stack") return null;
  const face = grandArchiveObjectFace(program, card);
  const characteristics = grandArchiveObjectCurrentCharacteristics(program, state, card);
  if (fizzled) {
    const specifiedDestination = grandArchiveFizzledCardDispositionEvent(program, state, item);
    if (specifiedDestination) return specifiedDestination;
  }
  if (item.kind === "bestowment") {
    return {
      type: "object-moved",
      objectId: card.id,
      from: "effects-stack",
      to: "pantheon",
      entryFacing: "face-up",
      cause: { kind: "stack-item", stackItemId: item.id },
    };
  }
  const activatedViaEphemerate = item.activationStates.includes("ephemeral");
  const destinationStates = new Set<GrandArchiveObjectState>(
    activatedViaEphemerate ? ["ephemeral"] : [],
  );
  for (const change of item.activationResult?.entryStateChanges ?? []) {
    if (change.value) destinationStates.add(change.state);
    else destinationStates.delete(change.state);
  }
  if (!fizzled && characteristics.types.includes("CHAMPION")) {
    const champion = Object.values(state.objects).find(
      (object) =>
        object.controllerId === item.controllerId &&
        object.zone === "field" &&
        grandArchiveObjectCurrentCharacteristics(program, state, object).types.includes("CHAMPION"),
    );
    if (!champion) return null;
    return {
      type: "champion-leveled-up",
      championId: champion.id,
      cardId: card.id,
      actorId: item.controllerId,
      cause: { kind: "stack-item", stackItemId: item.id },
    };
  }
  if (!fizzled && characteristics.types.includes("ATTACK")) {
    if (
      state.stack.length > 1 ||
      state.turn.phase !== "main" ||
      state.turn.playerId !== item.controllerId ||
      state.combat
    ) {
      return {
        type: "object-moved",
        objectId: card.id,
        from: "effects-stack",
        to: "graveyard",
        cause: { kind: "rule", rule: "attack-resolution-fizzled" },
      };
    }
    const attacker = item.attackAttackerId ? state.objects[item.attackAttackerId] : undefined;
    if (!attacker || attacker.controllerId !== item.controllerId || attacker.zone !== "field") {
      return {
        type: "object-moved",
        objectId: card.id,
        from: "effects-stack",
        to: "graveyard",
        cause: { kind: "rule", rule: "attack-resolution-lost-attacker" },
      };
    }
    return {
      type: "object-moved",
      objectId: card.id,
      from: "effects-stack",
      to: "intent",
      hostId: attacker.id,
      ...(destinationStates.size > 0 ? { entryStates: [...destinationStates] } : {}),
      entryActivationStates: item.activationStates.filter(
        (state) =>
          state === "prepared" ||
          state === "imbued" ||
          state === "brewed" ||
          state === "starcalled",
      ),
      entryActivationPayment: item.activationPayment,
      entryActivationBindings: item.bindings,
      entryActivationVariables: item.variables,
      cause: { kind: "stack-item", stackItemId: item.id },
    };
  }
  const becomesObject = !fizzled && grandArchiveCardIsObject(face);
  const destination = becomesObject
    ? "field"
    : activatedViaEphemerate && !grandArchiveCardIsObject(face)
      ? "banishment"
      : item.originZone === "material-deck" || item.paidCostKind === "memory"
        ? "banishment"
        : "graveyard";
  const declaredLinkTargetId = item.targets.find(
    (target) => target.binding === GRAND_ARCHIVE_LINK_TARGET_BINDING,
  )?.targetIds[0];
  const linkTargetId = Object.values(state.objects).find(
    (object) => object.id === declaredLinkTargetId,
  )?.id;
  return {
    type: "object-moved",
    objectId: card.id,
    from: "effects-stack",
    to: destination,
    ...(destination === "field"
      ? {
          newControllerId: item.controllerId,
          ...(linkTargetId ? { hostId: linkTargetId } : {}),
        }
      : {}),
    ...(destination === "field" && destinationStates.size > 0
      ? { entryStates: [...destinationStates] }
      : {}),
    ...(destination === "field"
      ? {
          entryActivationStates: item.activationStates.filter(
            (state) =>
              state === "prepared" ||
              state === "imbued" ||
              state === "brewed" ||
              state === "starcalled",
          ),
          entryActivationPayment: item.activationPayment,
          entryActivationBindings: item.bindings,
          entryActivationVariables: item.variables,
        }
      : {}),
    ...(destination === "field" && face.stats.durability !== undefined
      ? { initialCounters: { durability: face.stats.durability } }
      : {}),
    cause: { kind: "stack-item", stackItemId: item.id },
  };
}

interface GrandArchiveSelfDisposition {
  readonly destination: GrandArchiveMoveDestination;
  readonly facing?: "face-up" | "face-down";
}

function dispositionPlacement(
  destination: GrandArchiveMoveDestination,
): "top" | "bottom" | "unordered" {
  const placement = destination.placement;
  if (!placement || placement.kind === "unordered") return "unordered";
  if (placement.kind === "top" || placement.kind === "bottom") return placement.kind;
  throw new GrandArchiveUnsupportedRuleError(`fizzled card placement ${placement.kind}`);
}

/**
 * Reads only the resolving card's own zone-change instruction. Action rule 5.1
 * survives a fizzle, but the rest of the invalidated effect does not resolve.
 */
function selfDispositionFromEffect(
  effect: GrandArchiveEffect,
  item: GrandArchiveStackItem,
  evaluation: GrandArchiveEvaluationContext,
): GrandArchiveSelfDisposition | undefined {
  switch (effect.kind) {
    case "banish-object":
      return effect.subject.kind === "source"
        ? {
            destination: { zone: "banishment" },
            ...(effect.faceDown ? { facing: "face-down" as const } : {}),
          }
        : undefined;
    case "move":
      return effect.subject.kind === "source"
        ? {
            destination: effect.destination,
            ...(effect.facing ? { facing: effect.facing } : {}),
          }
        : undefined;
    case "sequence":
      return effect.effects.reduce<GrandArchiveSelfDisposition | undefined>(
        (latest, instruction) => selfDispositionFromEffect(instruction, item, evaluation) ?? latest,
        undefined,
      );
    case "conditional":
      return evaluateGrandArchiveCondition(effect.condition, evaluation)
        ? selfDispositionFromEffect(effect.then, item, evaluation)
        : effect.else
          ? selfDispositionFromEffect(effect.else, item, evaluation)
          : undefined;
    case "perform-as":
    case "attempt":
      return selfDispositionFromEffect(effect.effect, item, evaluation);
    case "bind-value": {
      const value = evaluateGrandArchiveAmount(effect.value, evaluation);
      return selfDispositionFromEffect(effect.effect, item, {
        ...evaluation,
        bindings: { ...evaluation.bindings, [effect.bindAs]: value },
      });
    }
    case "repeat":
      return selfDispositionFromEffect(effect.effect, item, evaluation);
    case "branch-on-value": {
      const value = evaluateGrandArchiveAmount(effect.value, evaluation);
      const branch = effect.branches.find((candidate) => {
        const minimum = evaluateGrandArchiveAmount(candidate.minimum, evaluation);
        const maximum = candidate.maximum
          ? evaluateGrandArchiveAmount(candidate.maximum, evaluation)
          : Number.POSITIVE_INFINITY;
        return value >= minimum && value <= maximum;
      });
      return branch ? selfDispositionFromEffect(branch.effect, item, evaluation) : undefined;
    }
    case "select-modes":
      return item.selectedModeIds.reduce<GrandArchiveSelfDisposition | undefined>(
        (latest, modeId) => {
          const mode = effect.modes.find((candidate) => candidate.id === modeId);
          if (!mode) throw new Error(`Selected mode is not part of this effect: ${modeId}`);
          return selfDispositionFromEffect(mode.effect, item, evaluation) ?? latest;
        },
        undefined,
      );
    default:
      return undefined;
  }
}

/**
 * Action rule 5.1: an Action's instruction that sends itself elsewhere still
 * determines its destination when the Action fizzles. This deliberately emits
 * only that move; no other instruction from the invalidated effect is run.
 */
export function grandArchiveFizzledCardDispositionEvent(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  item: Extract<
    GrandArchiveStackItem,
    { readonly kind: "card-activation" | "materialization" | "bestowment" }
  >,
): Extract<GrandArchiveProposedEvent, { readonly type: "object-moved" }> | undefined {
  if (item.kind !== "card-activation") return undefined;
  const card = state.objects[item.cardId];
  if (!card || card.zone !== "effects-stack") return undefined;
  const characteristics = grandArchiveObjectCurrentCharacteristics(program, state, card);
  if (!characteristics.types.includes("ACTION")) return undefined;
  const evaluation: GrandArchiveEvaluationContext = {
    program,
    state,
    controllerId: item.controllerId,
    sourceId: card.id,
    abilityBearerId: card.id,
    sourceIdentityId: card.id,
    sourceIncarnation: card.incarnation,
    bindings: item.bindings,
    variables: item.variables,
    ...(item.championLevelModifier > 0
      ? {
          championLevelModifier: {
            controllerId: item.controllerId,
            amount: item.championLevelModifier,
          },
        }
      : {}),
  };
  const effect = itemEffect(item, item.ability);
  if (!effect) return undefined;
  const disposition = selfDispositionFromEffect(effect, item, evaluation);
  if (!disposition) return undefined;
  const destination = disposition.destination;
  const hostSubject =
    destination.zone === "loaded" ||
    destination.zone === "inner-lineage" ||
    destination.zone === "intent"
      ? destination.host
      : destination.zone === "field"
        ? destination.linkTo
        : undefined;
  const hosts = hostSubject ? resolveGrandArchiveSubjectObjects(hostSubject, evaluation) : [];
  if (hostSubject && (hosts.length !== 1 || hosts[0]?.zone !== "field")) return undefined;
  const controllerIds =
    destination.zone === "field" && destination.controller
      ? resolveGrandArchivePlayers(destination.controller, evaluation)
      : [];
  if (destination.zone === "field" && destination.controller && controllerIds.length !== 1) {
    return undefined;
  }
  return {
    type: "object-moved",
    objectId: card.id,
    from: "effects-stack",
    to: destination.zone,
    effectSpecified: true,
    ...(controllerIds[0] ? { newControllerId: controllerIds[0] } : {}),
    ...(hosts[0] ? { hostId: hosts[0].id } : {}),
    ...(destination.zone === "banishment" ? { banishedBySourceId: card.id } : {}),
    placement: dispositionPlacement(destination),
    ...(disposition.facing ? { entryFacing: disposition.facing } : {}),
    ...(destination.zone === "field" && destination.face ? { entryFace: destination.face } : {}),
    ...(disposition.facing === "face-down" ? { revealAtEndOfGame: true as const } : {}),
    cause: { kind: "stack-item", stackItemId: item.id },
  };
}

function copiedCardResolutionEvents(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  item: Extract<
    GrandArchiveStackItem,
    { readonly kind: "card-activation" | "materialization" | "bestowment" }
  >,
  fizzled: boolean,
): readonly GrandArchiveProposedEvent[] {
  const card = state.objects[item.cardId];
  if (!card || card.zone !== "effects-stack" || !card.copy) return [];
  const face = grandArchiveObjectFace(program, card);
  const characteristics = grandArchiveObjectCurrentCharacteristics(program, state, card);
  const cease = {
    type: "object-ceased" as const,
    objectId: card.id,
    from: "effects-stack" as const,
    cause: { kind: "stack-item" as const, stackItemId: item.id },
  };
  if (fizzled) return [cease];
  if (characteristics.types.includes("ATTACK")) {
    const destination = defaultCardDestination(program, state, item, false);
    return destination?.type === "object-moved" && destination.to === "intent"
      ? [destination]
      : [cease];
  }
  if (!grandArchiveCardIsObject(face)) return [cease];
  const destinationStates = new Set<GrandArchiveObjectState>();
  for (const change of item.activationResult?.entryStateChanges ?? []) {
    if (change.value) destinationStates.add(change.state);
    else destinationStates.delete(change.state);
  }
  const declaredLinkTargetId = item.targets.find(
    (target) => target.binding === GRAND_ARCHIVE_LINK_TARGET_BINDING,
  )?.targetIds[0];
  const linkTargetId = Object.values(state.objects).find(
    (object) => object.id === declaredLinkTargetId,
  )?.id;
  const token: GrandArchiveCardInstance = {
    id: grandArchiveObjectId(`object-${state.nextObjectOrdinal}`),
    definitionId: card.activeDefinitionId ?? card.definitionId,
    isToken: true,
    copy: {
      sourceObjectId: card.copy.sourceObjectId,
      expires: "when-unassociated",
    },
    ownerId: item.controllerId,
    baseControllerId: item.controllerId,
    controllerId: item.controllerId,
    zone: "field",
    ...(linkTargetId ? { hostId: linkTargetId } : {}),
    face: card.face,
    facing: "face-up",
    states: destinationStates,
    activationStates: new Set(
      item.activationStates.filter(
        (activationState) =>
          activationState === "prepared" ||
          activationState === "imbued" ||
          activationState === "brewed" ||
          activationState === "starcalled",
      ),
    ),
    activationPayment: item.activationPayment,
    activationBindings: item.bindings,
    activationVariables: item.variables,
    cascadeCounts: {},
    counters: face.stats.durability === undefined ? {} : { durability: face.stats.durability },
    damage: 0,
    incarnation: 1,
    objectVersion: 1,
  };
  return [
    {
      type: "object-created",
      object: token,
      cause: { kind: "stack-item", stackItemId: item.id },
    },
    cease,
  ];
}

function resolutionContext(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  resolution: GrandArchiveEffectResolution,
): GrandArchiveEvaluationContext {
  const stackItem = state.stack.find((item) => item.id === resolution.stackItemId);
  return {
    program,
    state,
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
    ...(stackItem?.kind === "activated-ability" || stackItem?.kind === "triggered-ability"
      ? { abilityId: stackItem.ability.id }
      : {}),
    bindings: resolution.bindings,
    variables: resolution.variables,
    ...(stackItem ? { resultVariables: resultVariableDeclarations(stackItem) } : {}),
    resolutionStartedEventHistoryIndex: resolution.startedEventHistoryIndex,
    resolvingStackItemId: resolution.stackItemId,
    ...(resolution.championLevelModifier > 0
      ? {
          championLevelModifier: {
            controllerId: resolution.controllerId,
            amount: resolution.championLevelModifier,
          },
        }
      : {}),
  };
}

function prependFrames(
  frames: readonly GrandArchiveResolutionFrame[],
  existing: readonly GrandArchiveResolutionFrame[],
): readonly GrandArchiveResolutionFrame[] {
  return [...frames, ...existing];
}

function resolvedEntryLinkHostIds(
  frame: Extract<GrandArchiveResolutionFrame, { readonly kind: "effect" }>,
  resolution: GrandArchiveEffectResolution,
  state: GrandArchiveMatchState,
): Readonly<Record<GrandArchiveObjectId, GrandArchiveObjectId>> {
  const hostIds: Record<GrandArchiveObjectId, GrandArchiveObjectId> = {};
  for (const [objectId, binding] of Object.entries(frame.entryLinkHostBindings ?? {})) {
    const selected = resolution.bindings[binding];
    if (!Array.isArray(selected) || selected.length !== 1) {
      throw new GrandArchiveUnsupportedRuleError(`Link entry binding ${binding}`);
    }
    const host = state.objects[selected[0]!];
    if (!host || host.zone !== "field") {
      throw new Error("The chosen Link object is no longer on the field");
    }
    hostIds[grandArchiveObjectId(objectId)] = host.id;
  }
  return hostIds;
}

function committedResultObjectIds(
  committedEvents: readonly GrandArchiveCommittedEvent[],
): readonly GrandArchiveObjectId[] {
  return [
    ...new Set(
      committedEvents.flatMap((event): readonly GrandArchiveObjectId[] => {
        if (event.type === "object-created") return [event.object.id];
        if (event.type === "tokens-summoned") {
          return event.objects.map((object) => object.id);
        }
        if (event.type === "card-revealed") return [event.objectId];
        if (event.type === "cards-looked-at" || event.type === "cards-searched") {
          return event.objectIds;
        }
        if ("objectId" in event) return [event.objectId];
        if (event.type === "champion-leveled-up") return [event.championId];
        if (event.type === "champion-deleveled") return [event.championId];
        return [];
      }),
    ),
  ];
}

function committedCounterRemovalResult(committedEvents: readonly GrandArchiveCommittedEvent[]): {
  readonly amount: number;
  readonly objectIds: readonly GrandArchiveObjectId[];
} {
  const removals = committedEvents.filter(
    (event): event is Extract<GrandArchiveCommittedEvent, { readonly type: "counter-changed" }> =>
      event.type === "counter-changed" && event.delta < 0,
  );
  return {
    amount: removals.reduce((total, event) => total - event.delta, 0),
    objectIds: [...new Set(removals.map((event) => event.objectId))],
  };
}

function counterSelectionBounds(
  count: import("@tcg/grand-archive-types").GrandArchiveSelectionCount,
  available: number,
  evaluation: GrandArchiveEvaluationContext,
): { readonly minimum: number; readonly maximum: number } {
  const evaluated = (() => {
    switch (count.kind) {
      case "exactly": {
        const amount = evaluateGrandArchiveAmount(count.amount, evaluation);
        return { minimum: amount, maximum: amount };
      }
      case "up-to":
        return { minimum: 0, maximum: evaluateGrandArchiveAmount(count.amount, evaluation) };
      case "at-least":
        return {
          minimum: evaluateGrandArchiveAmount(count.amount, evaluation),
          maximum: available,
        };
      case "between":
        return {
          minimum: evaluateGrandArchiveAmount(count.minimum, evaluation),
          maximum: evaluateGrandArchiveAmount(count.maximum, evaluation),
        };
      case "all":
        return { minimum: available, maximum: available };
      case "any-number":
        return { minimum: 0, maximum: available };
      case "conditional":
        return counterSelectionBounds(
          evaluateGrandArchiveCondition(count.condition, evaluation) ? count.then : count.else,
          available,
          evaluation,
        );
      default:
        return assertNever(count);
    }
  })();
  if (
    !Number.isSafeInteger(evaluated.minimum) ||
    !Number.isSafeInteger(evaluated.maximum) ||
    evaluated.minimum < 0 ||
    evaluated.maximum < evaluated.minimum
  ) {
    throw new Error("Counter allocation count must have valid non-negative integer bounds");
  }
  return { minimum: evaluated.minimum, maximum: Math.min(evaluated.maximum, available) };
}

function snapshotEffectPaymentSelectionCount(
  count: GrandArchiveSelectionCount,
  evaluation: GrandArchiveEvaluationContext,
): GrandArchiveSelectionCount {
  switch (count.kind) {
    case "exactly":
    case "up-to":
    case "at-least":
      return { ...count, amount: evaluateGrandArchiveAmount(count.amount, evaluation) };
    case "between":
      return {
        ...count,
        minimum: evaluateGrandArchiveAmount(count.minimum, evaluation),
        maximum: evaluateGrandArchiveAmount(count.maximum, evaluation),
      };
    case "conditional":
      return snapshotEffectPaymentSelectionCount(
        evaluateGrandArchiveCondition(count.condition, evaluation) ? count.then : count.else,
        evaluation,
      );
    case "all":
    case "any-number":
      return count;
    default:
      return assertNever(count);
  }
}

/** Freezes state-dependent quantities when a player is offered an effect payment. */
function snapshotEffectPaymentCost(
  cost: GrandArchiveAbilityCost,
  evaluation: GrandArchiveEvaluationContext,
): GrandArchiveAbilityCost {
  switch (cost.kind) {
    case "all": {
      const [first, ...rest] = cost.costs;
      return {
        ...cost,
        costs: [
          snapshotEffectPaymentCost(first, evaluation),
          ...rest.map((entry) => snapshotEffectPaymentCost(entry, evaluation)),
        ],
      };
    }
    case "one-of": {
      const [first, second, ...rest] = cost.costs;
      return {
        ...cost,
        costs: [
          snapshotEffectPaymentCost(first, evaluation),
          snapshotEffectPaymentCost(second, evaluation),
          ...rest.map((entry) => snapshotEffectPaymentCost(entry, evaluation)),
        ],
      };
    }
    case "optional":
      return { ...cost, cost: snapshotEffectPaymentCost(cost.cost, evaluation) };
    case "pay-reserve":
    case "pay-memory":
    case "recover":
    case "take-damage":
    case "add-counter":
    case "remove-counter":
      return { ...cost, amount: evaluateGrandArchiveAmount(cost.amount, evaluation) };
    case "select-and-sacrifice":
    case "select-and-rest":
    case "select-and-move":
    case "select-and-remove-counters":
    case "select-and-reveal":
    case "reveal":
      return { ...cost, count: snapshotEffectPaymentSelectionCount(cost.count, evaluation) };
    case "rest":
    case "wake":
    case "sacrifice":
    case "banish-self":
    case "discard-self":
    case "move-self":
    case "delevel-champion":
      return cost;
    default:
      return assertNever(cost);
  }
}

function eventRepresentsPerformedAction(event: GrandArchiveCommittedEvent): boolean {
  switch (event.type) {
    case "object-created":
    case "tokens-summoned":
    case "object-moved":
    case "object-state-changed":
    case "object-activation-state-changed":
    case "object-facing-changed":
    case "object-characteristic-tracked":
    case "card-revealed":
    case "cards-looked-at":
    case "cards-searched":
    case "zone-reordered":
    case "player-state-changed":
    case "game-state-changed":
    case "keyword-action-performed":
    case "counter-changed":
    case "damage-marked":
    case "damage-cleared":
    case "damage-removed":
    case "damage-prevented":
    case "object-controller-changed":
    case "object-transformed":
    case "object-became-copy":
    case "champion-leveled-up":
    case "champion-deleveled":
    case "combat-started":
    case "combat-step-changed":
    case "combat-ended":
    case "phase-end-requested":
    case "turn-end-requested":
    case "continuous-effect-created":
    case "replacement-effect-created":
    case "rule-modification-created":
    case "stack-item-retargeted":
    case "stack-item-negated":
    case "boon-gained":
    case "player-first-turn-completed":
    case "player-lost":
    case "game-outcome-declared":
    case "match-finished":
      return true;
    case "random-state-changed":
    case "phase-skip-added":
    case "phase-skip-consumed":
    case "object-ceased":
    case "object-removed-from-game":
    case "pregame-player-advanced":
    case "pregame-starting-cards-entered":
    case "pregame-completed":
    case "mastery-changed":
    case "mastery-counter-changed":
    case "cascade-advanced":
    case "combat-retaliators-ordered":
    case "combat-defender-redirected":
    case "termination-cleared":
    case "continuous-effect-expired":
    case "replacement-effect-consumed":
    case "replacement-follow-up-created":
    case "replacement-follow-up-consumed":
    case "replacement-pre-commit-created":
    case "replacement-pre-commit-started":
    case "replacement-pre-commit-cleared":
    case "replacement-capacity-consumed":
    case "replacement-effect-expired":
    case "replacement-limit-used":
    case "rule-modification-expired":
    case "pending-trigger-added":
    case "pending-trigger-removed":
    case "pending-trigger-batch-ordered":
    case "reflexive-trigger-generated":
    case "reflexive-trigger-consumed":
    case "delayed-trigger-created":
    case "delayed-trigger-consumed":
    case "delayed-trigger-removed":
    case "stack-item-added":
    case "stack-item-deferred":
    case "stack-item-after-resolution-scheduled":
    case "stack-item-fizzled":
    case "stack-item-targets-invalidated":
    case "deferred-stack-item-promoted":
    case "stack-item-removed":
    case "effect-resolution-suspended":
    case "effect-resolution-cleared":
    case "opportunity-opened":
    case "opportunity-passed":
    case "opportunity-closed":
    case "phase-changed":
    case "cards-recollected":
    case "materialization-choice-consumed":
    case "turn-cleanup-pending-changed":
    case "attack-declaration-attempted":
    case "game-outcome-cleared":
    case "turn-started":
    case "decision-created":
    case "decision-cleared":
    case "replacement-pre-commit-critical-declined":
    case "replacement-pre-commit-critical-paid":
    case "replacement-pre-commit-critical-doubled":
    case "object-reference-substituted":
      return false;
    default:
      return assertNever(event);
  }
}

function markPendingAttemptsPerformed(
  resolution: GrandArchiveEffectResolution,
  outcome: import("./effect-executor.ts").GrandArchiveEffectExecutionResult["outcome"],
): GrandArchiveEffectResolution {
  if (outcome !== "performed") return resolution;
  const pendingAttemptBindings = resolution.frames.flatMap((frame) =>
    frame.kind === "finish-attempt" ? [frame.bindSucceededAs] : [],
  );
  if (pendingAttemptBindings.length === 0) return resolution;
  return {
    ...resolution,
    bindings: pendingAttemptBindings.reduce(
      (bindings, binding) => ({ ...bindings, [binding]: true }),
      resolution.bindings,
    ),
  };
}

function effectFrames(
  effects: readonly import("@tcg/grand-archive-types").GrandArchiveEffect[],
): readonly GrandArchiveResolutionFrame[] {
  return effects.map((effect) => ({ kind: "effect" as const, effect }));
}

function shiftingCurrentsDirectionCandidates(
  current: GrandArchiveShiftingCurrentsDirection,
  effect: Extract<GrandArchiveEffect, { readonly kind: "choose-direction" }>,
): readonly GrandArchiveShiftingCurrentsDirection[] {
  const adjacent: Readonly<
    Record<GrandArchiveShiftingCurrentsDirection, readonly GrandArchiveShiftingCurrentsDirection[]>
  > = {
    north: ["east", "west"],
    east: ["north", "south"],
    south: ["east", "west"],
    west: ["north", "south"],
  };
  const opposite: Readonly<
    Record<GrandArchiveShiftingCurrentsDirection, GrandArchiveShiftingCurrentsDirection>
  > = { north: "south", east: "west", south: "north", west: "east" };
  return effect.directions.filter((direction) => {
    if (effect.differentFromCurrent && direction === current) return false;
    if (effect.relationToCurrent === "adjacent") return adjacent[current].includes(direction);
    if (effect.relationToCurrent === "opposite") return opposite[current] === direction;
    return true;
  });
}

function copiedItemRetargetFrames(
  effect: GrandArchiveEffect,
  copiedItems: readonly GrandArchiveStackItem[],
  parentItem: GrandArchiveStackItem,
): readonly GrandArchiveResolutionFrame[] {
  if (effect.kind !== "copy" || !effect.mayChooseNewTargets) return [];
  return copiedItems.flatMap((copiedItem, index): readonly GrandArchiveResolutionFrame[] => {
    const binding = `copy-retarget-${parentItem.id}-${index}`;
    return [
      { kind: "set-binding", binding, value: [copiedItem.id] },
      {
        kind: "effect",
        effect: {
          kind: "optional",
          player: "controller",
          allOrNothing: true,
          effect: {
            kind: "retarget",
            subject: { kind: "bound", binding },
            chooser: "controller",
          },
        },
      },
    ];
  });
}

function copiedItemModeFrames(
  effect: GrandArchiveEffect,
  copiedItems: readonly GrandArchiveStackItem[],
): readonly GrandArchiveResolutionFrame[] {
  if (effect.kind !== "copy" || !effect.mayChooseNewModes) return [];
  return copiedItems.map((copiedItem) => ({
    kind: "remode-copied-stack-item" as const,
    targetStackItemId: copiedItem.id,
    mayRetarget: effect.mayChooseNewTargets === true,
  }));
}

function stackItemModeEvaluation(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  item: GrandArchiveStackItem,
): GrandArchiveEvaluationContext {
  return {
    program,
    state,
    controllerId: item.controllerId,
    ...(item.sourceId
      ? {
          sourceId: item.sourceId,
          abilityBearerId: item.sourceId,
          sourceIdentityId: item.sourceId,
          ...(item.sourceIncarnation !== undefined
            ? { sourceIncarnation: item.sourceIncarnation }
            : {}),
        }
      : {}),
    ...(item.sourceLkiEventId ? { sourceLkiEventId: item.sourceLkiEventId } : {}),
    bindings: item.bindings,
    variables: item.variables,
  };
}

function stackItemModeChoices(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  item: GrandArchiveStackItem,
): readonly (readonly string[])[] {
  const ability = itemAbility(item);
  if (!ability) return [];
  const evaluation = stackItemModeEvaluation(program, state, item);
  const declaration =
    ability.kind === "activated" && ability.cascade
      ? {
          choose: { kind: "exactly" as const, amount: 1 },
          modes: ability.cascade.modes,
        }
      : getGrandArchiveAnnouncementModes(ability.modes, itemEffect(item, ability), evaluation);
  if (!declaration || declaration.random) return [];
  const eligibleIds = declaration.modes
    .filter((mode) => !mode.condition || evaluateGrandArchiveCondition(mode.condition, evaluation))
    .map((mode) => mode.id);
  const bounds = grandArchiveSelectionCountBounds({ count: declaration.choose }, evaluation);
  if (!Number.isFinite(bounds.maximum)) {
    throw new GrandArchiveUnsupportedRuleError("unbounded copied mode selection");
  }
  const choices: string[][] = [];
  const selected: string[] = [];
  const visit = (amount: number): void => {
    if (selected.length === amount) {
      try {
        choices.push([...declareGrandArchiveModes(declaration, selected, evaluation).ids]);
      } catch {
        // The declaration remains the single authority for conditional and repetition legality.
      }
      return;
    }
    for (const id of eligibleIds) {
      if (!declaration.allowRepeat && selected.includes(id)) continue;
      selected.push(id);
      visit(amount);
      selected.pop();
    }
  };
  for (let amount = bounds.minimum; amount <= bounds.maximum; amount += 1) visit(amount);
  return choices;
}

function materializationFrames(
  effect: Extract<GrandArchiveEffect, { readonly kind: "materialize-card" }>,
  evaluation: GrandArchiveEvaluationContext,
  attemptBinding?: string,
): readonly GrandArchiveResolutionFrame[] {
  const materializers = resolveGrandArchivePlayers(effect.materializer ?? "controller", evaluation);
  if (materializers.length !== 1) {
    throw new GrandArchiveUnsupportedRuleError(
      "effect-granted materialization requires exactly one materializing player",
    );
  }
  return resolveGrandArchiveSubjectObjects(effect.subject, evaluation).map((object) => ({
    kind: "announce-materialization" as const,
    playerId: materializers[0]!,
    cardId: object.id,
    payCosts: effect.payCosts !== false,
    ignoreElementRequirements: effect.ignoreElementRequirements === true,
    costModifiers: effect.costModifiers ?? [],
    ...(attemptBinding ? { attemptBinding } : {}),
  }));
}

function activationFrames(
  effect: Extract<GrandArchiveEffect, { readonly kind: "activate-card" }>,
  evaluation: GrandArchiveEvaluationContext,
): readonly GrandArchiveResolutionFrame[] {
  const activators = resolveGrandArchivePlayers(effect.activator ?? "controller", evaluation);
  if (activators.length !== 1) {
    throw new GrandArchiveUnsupportedRuleError(
      "effect-granted activation requires exactly one activating player",
    );
  }
  return resolveGrandArchiveSubjectObjects(effect.subject, evaluation).map((object) => ({
    kind: "announce-activation" as const,
    playerId: activators[0]!,
    cardId: object.id,
    payCosts: effect.payCosts !== false,
    ignoreElementRequirements: effect.ignoreElementRequirements === true,
    ...(effect.speed ? { speed: effect.speed } : {}),
    costModifiers: effect.costModifiers ?? [],
  }));
}

function playFrames(
  effect: Extract<GrandArchiveEffect, { readonly kind: "play-card" }>,
  evaluation: GrandArchiveEvaluationContext,
): readonly GrandArchiveResolutionFrame[] {
  const players = resolveGrandArchivePlayers(effect.player ?? "controller", evaluation);
  if (players.length !== 1) {
    throw new GrandArchiveUnsupportedRuleError(
      "effect-granted play requires exactly one playing player",
    );
  }
  return resolveGrandArchiveSubjectObjects(effect.subject, evaluation).map((object) => {
    const characteristics = deriveGrandArchiveCharacteristics(object, evaluation);
    const materializes =
      characteristics.types.includes("CHAMPION") || characteristics.supertypes.includes("REGALIA");
    return materializes
      ? {
          kind: "announce-materialization" as const,
          playerId: players[0]!,
          cardId: object.id,
          payCosts: effect.payCosts !== false,
          ignoreElementRequirements: effect.ignoreElementRequirements === true,
          costModifiers: effect.costModifiers ?? [],
        }
      : {
          kind: "announce-activation" as const,
          playerId: players[0]!,
          cardId: object.id,
          payCosts: effect.payCosts !== false,
          ignoreElementRequirements: effect.ignoreElementRequirements === true,
          ...(effect.speed ? { speed: effect.speed } : {}),
          costModifiers: effect.costModifiers ?? [],
        };
  });
}

function modeFrames(
  modes: readonly import("@tcg/grand-archive-types").GrandArchiveModeEffect[],
): readonly GrandArchiveResolutionFrame[] {
  return modes.flatMap((mode): readonly GrandArchiveResolutionFrame[] => [
    ...variableFrames(mode.variables),
    { kind: "effect", effect: mode.effect },
  ]);
}

function variableFrames(
  variables:
    | readonly import("@tcg/grand-archive-types").GrandArchiveVariableDeclaration[]
    | undefined,
): readonly GrandArchiveResolutionFrame[] {
  return (variables ?? []).flatMap((variable): readonly GrandArchiveResolutionFrame[] =>
    variable.kind === "derived" && !grandArchiveAmountUsesModifiedResult(variable.amount)
      ? [{ kind: "set-derived-variable", symbol: variable.symbol, amount: variable.amount }]
      : [],
  );
}

function isGrandArchiveModifiedResultMetric(
  value: unknown,
): value is GrandArchiveModifiedResultMetric {
  return (
    value === "cards-moved" ||
    value === "counters-removed" ||
    value === "damage-dealt" ||
    value === "damage-prevented" ||
    value === "objects-sacrificed"
  );
}

function grandArchiveModifiedResultMetricsIn(
  value: unknown,
): readonly GrandArchiveModifiedResultMetric[] {
  if (value === null || typeof value !== "object") return [];
  if (
    "kind" in value &&
    value.kind === "modified-ability-result-amount" &&
    "metric" in value &&
    isGrandArchiveModifiedResultMetric(value.metric)
  ) {
    return [value.metric];
  }
  return [
    ...new Set(Object.values(value).flatMap((child) => grandArchiveModifiedResultMetricsIn(child))),
  ];
}

function grandArchiveAmountUsesModifiedResult(amount: GrandArchiveAmount): boolean {
  return grandArchiveModifiedResultMetricsIn(amount).length > 0;
}

function resultVariableDeclarations(
  item: GrandArchiveStackItem,
): readonly Extract<GrandArchiveVariableDeclaration, { readonly kind: "derived" }>[] {
  const ability = itemAbility(item);
  return [
    ...(ability?.variables ?? []),
    ...selectedModes(item, ability).flatMap((mode) => mode.variables ?? []),
  ].filter(
    (
      variable,
    ): variable is Extract<GrandArchiveVariableDeclaration, { readonly kind: "derived" }> =>
      variable.kind === "derived" && grandArchiveAmountUsesModifiedResult(variable.amount),
  );
}

function refreshGrandArchiveModifiedResultVariables(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  item: GrandArchiveStackItem,
  resolution: GrandArchiveEffectResolution,
): GrandArchiveEffectResolution {
  if (item.sourceId !== resolution.sourceId) return resolution;
  let variables = { ...resolution.variables };
  let changed = false;
  for (const declaration of resultVariableDeclarations(item)) {
    const metrics = grandArchiveModifiedResultMetricsIn(declaration.amount);
    if (
      metrics.length === 0 ||
      metrics.some(
        (metric) =>
          typeof resolution.bindings[grandArchiveModifiedResultBinding(metric)] !== "number",
      )
    ) {
      continue;
    }
    const value = evaluateGrandArchiveAmount(declaration.amount, {
      ...resolutionContext(program, state, { ...resolution, variables }),
      variables,
    });
    if (variables[declaration.symbol] !== value) changed = true;
    variables = { ...variables, [declaration.symbol]: value };
  }
  return changed ? { ...resolution, variables } : resolution;
}

export interface GrandArchiveStackItemTargetLegality {
  readonly targets: readonly import("../../game/model.ts").GrandArchiveDeclaredTarget[];
  readonly bindings: Readonly<Record<string, GrandArchiveExecutionBinding>>;
  readonly championLevelModifier: number;
  readonly elysianAuraActive: boolean;
  readonly anyRequiredTargetInvalid: boolean;
}

export function evaluateGrandArchiveStackItemTargetLegality(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  item: GrandArchiveStackItem,
): GrandArchiveStackItemTargetLegality {
  const elysianAuraActive =
    itemUsesElysianAura(program, state, item) &&
    grandArchivePlayerControlsActiveKeyword(program, state, item.controllerId, "elysian-aura");
  const championLevelModifier = item.championLevelModifier + (elysianAuraActive ? 2 : 0);
  const ability = itemAbility(item);
  const baseDeclarations =
    item.kind === "activated-ability" || item.kind === "triggered-ability"
      ? item.ability.targets
      : ability?.targets;
  const chosenModes = selectedModes(item);
  const declarations = item.targetDeclarations ?? [
    ...(baseDeclarations ?? []),
    ...chosenModes.flatMap((mode) => mode.targets ?? []),
  ];
  const bindings: Record<string, GrandArchiveExecutionBinding> = { ...item.bindings };
  const targets = item.targets.map((target) => ({ ...target }));
  const sourceInformationContext: GrandArchiveEvaluationContext = {
    program,
    state,
    controllerId: item.controllerId,
    ...(item.sourceId
      ? {
          sourceId: item.sourceId,
          abilityBearerId: item.sourceId,
          sourceIdentityId: item.sourceId,
          ...(item.sourceIncarnation !== undefined
            ? { sourceIncarnation: item.sourceIncarnation }
            : {}),
        }
      : {}),
    ...(item.sourceLkiEventId
      ? {
          sourceLkiEventId: item.sourceLkiEventId,
          sourceInformationBasis: "last-known",
        }
      : {}),
    bindings,
    variables: item.variables,
  };
  const sourceInformation = item.sourceId
    ? grandArchiveEvaluationObject(item.sourceId, sourceInformationContext, true)
    : undefined;
  for (const declaration of declarations) {
    const targetIndex = targets.findIndex((candidate) => candidate.binding === declaration.id);
    const target = targets[targetIndex];
    if (!target) continue;
    const evaluation: GrandArchiveEvaluationContext = {
      program,
      state,
      controllerId: item.controllerId,
      ...(item.sourceId
        ? {
            sourceId: item.sourceId,
            abilityBearerId: item.sourceId,
            sourceIdentityId: item.sourceId,
            ...(item.sourceIncarnation !== undefined
              ? { sourceIncarnation: item.sourceIncarnation }
              : {}),
          }
        : {}),
      ...(item.sourceLkiEventId ? { sourceLkiEventId: item.sourceLkiEventId } : {}),
      bindings,
      variables: item.variables,
      ...(sourceInformation
        ? {
            targeting: grandArchiveTargetingContext(
              item.kind === "materialization"
                ? "materialization"
                : item.kind === "activated-ability"
                  ? "activated-ability"
                  : item.kind === "triggered-ability"
                    ? "triggered-ability"
                    : "card-activation",
              grandArchiveObjectCurrentCharacteristics(program, state, sourceInformation).subtypes,
              [itemEffect(item), ...chosenModes.map((mode) => mode.effect)],
              item.kind === "triggered-ability" &&
                "resolutionAs" in item.ability &&
                item.ability.resolutionAs === "spell",
            ),
          }
        : {}),
      ...(championLevelModifier > 0
        ? {
            championLevelModifier: {
              controllerId: item.controllerId,
              amount: championLevelModifier,
            },
          }
        : {}),
    };
    const legalTargetIds = target.targetIds.filter((targetId) => {
      const declaredIncarnation = target.targetObjectIncarnations[targetId as GrandArchiveObjectId];
      const currentObject = state.objects[targetId as GrandArchiveObjectId];
      if (declaredIncarnation !== undefined && currentObject?.incarnation !== declaredIncarnation) {
        return false;
      }
      return isGrandArchiveTargetCandidate(targetId, declaration, evaluation);
    });
    targets[targetIndex] = { ...target, targetIds: legalTargetIds };
    bindings[declaration.id] = legalTargetIds;
  }
  return {
    targets,
    bindings,
    championLevelModifier,
    elysianAuraActive,
    anyRequiredTargetInvalid: item.targets.some((declaredTarget, index) => {
      const legalTarget = targets[index];
      return (
        declaredTarget.required &&
        (!legalTarget || legalTarget.targetIds.length !== declaredTarget.targetIds.length)
      );
    }),
  };
}

export function grandArchiveStackItemStateBasedFizzleReason(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  item: GrandArchiveStackItem,
): GrandArchiveStackItemFizzleReason | undefined {
  if (evaluateGrandArchiveStackItemTargetLegality(program, state, item).anyRequiredTargetInvalid) {
    return "required-target-invalid";
  }
  if (
    (item.kind === "card-activation" ||
      item.kind === "materialization" ||
      item.kind === "bestowment") &&
    state.objects[item.cardId]?.zone !== "effects-stack"
  ) {
    return "source-card-missing";
  }
  if (
    (item.kind === "card-activation" ||
      item.kind === "materialization" ||
      item.kind === "bestowment") &&
    item.isCopy
  ) {
    const copiedCard = state.objects[item.cardId];
    const sourceCard = copiedCard?.copy ? state.objects[copiedCard.copy.sourceObjectId] : undefined;
    if (!sourceCard || sourceCard.zone !== "effects-stack") {
      return "source-card-missing";
    }
  }
  if (item.kind === "materialization") {
    const card = state.objects[item.cardId];
    if (!card) return "source-card-missing";
    if (grandArchiveObjectCurrentCharacteristics(program, state, card).types.includes("CHAMPION")) {
      const champion = Object.values(state.objects).find(
        (object) =>
          object.controllerId === item.controllerId &&
          object.zone === "field" &&
          grandArchiveObjectCurrentCharacteristics(program, state, object).types.includes(
            "CHAMPION",
          ),
      );
      if (!champion) return "champion-materialization-illegal";
      const requirements = grandArchiveChampionLevelUpRequirements(program, state, card, champion);
      if (!requirements.lineageSatisfied) return "champion-materialization-illegal";
      if (!requirements.nextBaseLevel) {
        const evaluation: GrandArchiveEvaluationContext = {
          program,
          state,
          controllerId: item.controllerId,
          sourceId: champion.id,
          abilityBearerId: champion.id,
          candidateId: card.id,
          bindings: item.bindings,
          variables: item.variables,
        };
        const levelUpRules = collectGrandArchiveActionRules({
          action: "level-up",
          activationKind: "card",
          playerId: item.controllerId,
          candidateId: champion.id,
          destinationId: card.id,
          fromZone: champion.zone,
          evaluation,
        });
        if (!levelUpRules.some((rule) => ruleGrantsPermissionToPlayer(rule, item.controllerId))) {
          return "champion-materialization-illegal";
        }
      }
    }
  }
  return undefined;
}

function resolutionChoiceCannotMeetMinimum(
  selection: GrandArchiveResolutionChoice,
  evaluation: GrandArchiveEvaluationContext,
): boolean {
  try {
    const minimum = grandArchiveSelectionCountBounds(selection, evaluation).minimum;
    if (minimum <= 0) return false;
    if (
      selection.candidates.kind !== "card" &&
      selection.candidates.kind !== "object" &&
      selection.candidates.kind !== "union"
    ) {
      return false;
    }
    const declaration: GrandArchiveTargetDeclaration = {
      ...selection,
      kind: "target",
      declared: "announcement",
    };
    let eligible = 0;
    for (const object of Object.values(evaluation.state.objects)) {
      if (isGrandArchiveTargetCandidate(object.id, declaration, evaluation)) eligible += 1;
      if (eligible >= minimum) return false;
    }
    return true;
  } catch (error) {
    if (error instanceof GrandArchiveUnsupportedRuleError) return false;
    throw error;
  }
}

function knownOptionalAmount(
  amount: Parameters<typeof evaluateGrandArchiveAmount>[0],
  evaluation: GrandArchiveEvaluationContext,
): number | undefined {
  try {
    return evaluateGrandArchiveAmount(amount, evaluation);
  } catch (error) {
    if (error instanceof GrandArchiveUnsupportedRuleError) return undefined;
    throw error;
  }
}

function subjectMayBeBoundByAnEarlierEffect(
  subject: import("@tcg/grand-archive-types").GrandArchiveSubject,
): boolean {
  return subject.kind === "bound" || subject.kind === "binding-remainder";
}

/** Whether an all-or-nothing optional clause is already known to be impossible. */
function optionalEffectCannotBeFullyPerformed(
  effect: GrandArchiveEffect,
  evaluation: GrandArchiveEvaluationContext,
): boolean {
  switch (effect.kind) {
    case "recover": {
      const amount = knownOptionalAmount(effect.amount, evaluation);
      return (
        amount !== undefined &&
        amount > 0 &&
        resolveGrandArchivePlayers(effect.player, evaluation).some((playerId) =>
          grandArchivePlayerActionIsForbidden({
            action: "recover",
            playerId,
            evaluation: { ...evaluation, controllerId: playerId },
          }),
        )
      );
    }
    case "keyword-action": {
      if (effect.action !== "glimpse") return false;
      const amount = knownOptionalAmount(effect.amount ?? 0, evaluation);
      return (
        amount !== undefined &&
        amount > 0 &&
        resolveGrandArchivePlayers(effect.player ?? "controller", evaluation).some((playerId) =>
          grandArchivePlayerActionIsForbidden({
            action: "glimpse",
            playerId,
            evaluation: { ...evaluation, controllerId: playerId },
          }),
        )
      );
    }
    case "remove-counter": {
      const amount = knownOptionalAmount(effect.amount, evaluation);
      if (amount === undefined || amount <= 0) return false;
      if (effect.subject.kind === "mastery") {
        const masterySubject = effect.subject;
        const playerIds = resolveGrandArchivePlayers(masterySubject.player, evaluation);
        return playerIds.some(
          (playerId) =>
            grandArchiveMasteryCounterCount(
              evaluation.state,
              playerId,
              masterySubject.name,
              effect.counter,
            ) < amount,
        );
      }
      const subjects = resolveGrandArchiveSubjectObjects(effect.subject, evaluation);
      if (subjects.length === 0) return !subjectMayBeBoundByAnEarlierEffect(effect.subject);
      return subjects.some(
        (object) => grandArchiveObjectCounterCount(object, effect.counter) < amount,
      );
    }
    case "rest":
    case "wake": {
      const subjects = resolveGrandArchiveSubjectObjects(effect.subject, evaluation);
      if (subjects.length === 0) return !subjectMayBeBoundByAnEarlierEffect(effect.subject);
      const mustAlreadyBeRested = effect.kind === "wake";
      return subjects.some(
        (object) => object.zone !== "field" || object.states.has("rested") !== mustAlreadyBeRested,
      );
    }
    case "choose":
      return resolutionChoiceCannotMeetMinimum(effect.selection, evaluation);
    case "banish":
    case "discard":
      return (
        effect.selection !== undefined &&
        resolutionChoiceCannotMeetMinimum(effect.selection, evaluation)
      );
    case "reflexive":
      return optionalEffectCannotBeFullyPerformed(effect.action, evaluation);
    case "sequence":
      return effect.effects.some((child) =>
        optionalEffectCannotBeFullyPerformed(child, evaluation),
      );
    case "conditional":
      return false;
    case "repeat":
      return false;
    case "attempt":
      return optionalEffectCannotBeFullyPerformed(effect.effect, evaluation);
    default:
      return false;
  }
}

function generationLegalSelection(
  selection: GrandArchiveResolutionChoice,
  playerId: GrandArchivePlayerId,
  evaluation: GrandArchiveEvaluationContext,
): GrandArchiveResolutionChoice {
  if (selection.candidates.kind !== "catalog-card") return selection;
  const forbiddenDefinitionIds = Object.keys(evaluation.program.cardsById).filter((definitionId) =>
    grandArchivePlayerActionIsForbidden({
      action: "generate",
      playerId,
      candidateDefinitionId: definitionId,
      evaluation: { ...evaluation, controllerId: playerId },
    }),
  );
  if (forbiddenDefinitionIds.length === 0) return selection;
  const forbiddenFilter: GrandArchiveCardFilter =
    forbiddenDefinitionIds.length === 1
      ? { kind: "canonical-id", value: forbiddenDefinitionIds[0]! }
      : {
          kind: "any",
          filters: forbiddenDefinitionIds.map((value) => ({ kind: "canonical-id", value })),
        };
  return {
    ...selection,
    candidates: {
      ...selection.candidates,
      filter: {
        kind: "all",
        filters: [selection.candidates.filter, { kind: "not", filter: forbiddenFilter }],
      },
    },
  };
}

function grandArchivePlayersFromTurnPlayer(
  state: GrandArchiveMatchState,
  playerIds: readonly GrandArchivePlayerId[],
): readonly GrandArchivePlayerId[] {
  const included = new Set(playerIds);
  const start = state.turnOrder.indexOf(state.turn.playerId);
  const ordered =
    start < 0
      ? state.turnOrder
      : [...state.turnOrder.slice(start), ...state.turnOrder.slice(0, start)];
  return ordered.filter((playerId) => included.has(playerId));
}

function grandArchiveCardChoiceCandidatesForController(
  candidates: import("@tcg/grand-archive-types").GrandArchiveCardSelectionCandidates,
  participantSet: "each-player" | "each-opponent",
): import("@tcg/grand-archive-types").GrandArchiveCardSelectionCandidates {
  return "player" in candidates && candidates.player === participantSet
    ? { ...candidates, player: "controller" as const }
    : candidates;
}

function grandArchiveMultiPlayerChoiceForController(
  selection: GrandArchiveResolutionChoice,
  participantSet: "each-player" | "each-opponent",
): GrandArchiveResolutionChoice {
  const candidates = selection.candidates;
  switch (candidates.kind) {
    case "card":
      return {
        ...selection,
        chooser: "controller",
        candidates: grandArchiveCardChoiceCandidatesForController(candidates, participantSet),
      };
    case "union": {
      const [first, second, ...remaining] = candidates.sources;
      return {
        ...selection,
        chooser: "controller",
        candidates: {
          ...candidates,
          sources: [
            grandArchiveCardChoiceCandidatesForController(first, participantSet),
            grandArchiveCardChoiceCandidatesForController(second, participantSet),
            ...remaining.map((source) =>
              grandArchiveCardChoiceCandidatesForController(source, participantSet),
            ),
          ],
        },
      };
    }
    case "object":
      return {
        ...selection,
        chooser: "controller",
        candidates:
          candidates.player === participantSet
            ? { ...candidates, player: "controller" }
            : candidates,
      };
    case "player":
      return {
        ...selection,
        chooser: "controller",
        candidates:
          candidates.players === participantSet
            ? { ...candidates, players: "controller" }
            : candidates,
      };
    case "catalog-card":
    case "stack-item":
    case "number":
    case "option":
    case "characteristic":
      return { ...selection, chooser: "controller" };
    default:
      return assertNever(candidates);
  }
}

/** A card selection immediately followed by its ordered move is one player choice. */
function combineSelectionAndMoveOrder(
  effect: Extract<GrandArchiveEffect, { readonly kind: "choose" }>,
): Extract<GrandArchiveEffect, { readonly kind: "choose" }> {
  const nested = effect.effect;
  const first = nested?.kind === "sequence" ? nested.effects[0] : nested;
  if (
    first?.kind !== "move" ||
    first.subject.kind !== "bound" ||
    first.subject.binding !== effect.selection.id
  )
    return effect;
  const placement = first.destination.placement;
  if (
    (placement?.kind !== "top" && placement?.kind !== "bottom") ||
    placement.orderChosenBy !== effect.selection.chooser ||
    placement.order
  )
    return effect;
  const { orderChosenBy: _orderChosenBy, ...orderedPlacement } = placement;
  const orderedMove: GrandArchiveEffect = {
    ...first,
    destination: { ...first.destination, placement: orderedPlacement },
  };
  return {
    ...effect,
    selection: { ...effect.selection, ordered: true },
    effect:
      nested?.kind === "sequence"
        ? { ...nested, effects: [orderedMove, ...nested.effects.slice(1)] }
        : orderedMove,
  };
}

function prepareGrandArchivePlayerChoices(
  selection: GrandArchiveResolutionChoice,
  playerIds: readonly GrandArchivePlayerId[],
  evaluation: GrandArchiveEvaluationContext,
  determineNonEmpty: boolean,
  options: { readonly mayFailToFind?: true } = {},
):
  | { readonly kind: "determined"; readonly binding: readonly GrandArchiveObjectId[] }
  | {
      readonly kind: "pending";
      readonly playerId: GrandArchivePlayerId;
      readonly selection: GrandArchiveResolutionChoice;
      readonly controllerId?: GrandArchivePlayerId;
      readonly simultaneous?: NonNullable<
        GrandArchiveEffectResolution["pendingChoice"]
      >["simultaneous"];
    } {
  if (playerIds.length === 0) {
    throw new GrandArchiveUnsupportedRuleError("resolution choice without a deciding player");
  }
  const multiPlayer = playerIds.length > 1;
  if (multiPlayer && selection.chooser !== "each-player" && selection.chooser !== "each-opponent") {
    throw new GrandArchiveUnsupportedRuleError("unsupported multi-player choice set");
  }
  const ordered = multiPlayer
    ? grandArchivePlayersFromTurnPlayer(evaluation.state, playerIds)
    : playerIds;
  const selected: GrandArchiveObjectId[] = [];
  const publicSelections: GrandArchivePublicSimultaneousSelection[] = [];
  const choices: {
    readonly playerId: GrandArchivePlayerId;
    readonly selection: GrandArchiveResolutionChoice;
  }[] = [];
  for (const playerId of ordered) {
    const scoped =
      multiPlayer && (selection.chooser === "each-player" || selection.chooser === "each-opponent")
        ? grandArchiveMultiPlayerChoiceForController(selection, selection.chooser)
        : selection;
    const determined = deterministicallyDeclareGrandArchiveResolutionChoice(
      scoped,
      {
        ...evaluation,
        ...(multiPlayer ? { controllerId: playerId } : {}),
      },
      options,
    );
    if (determined !== undefined && (determineNonEmpty || determined.length === 0)) {
      selected.push(...determined);
      if (multiPlayer && grandArchiveSimultaneousSelectionIsPublic(evaluation.state, determined)) {
        publicSelections.push({ playerId, targetIds: determined });
      }
    } else {
      choices.push({ playerId, selection: scoped });
    }
  }
  if (choices.length === 0) return { kind: "determined", binding: selected };
  const [first, ...remaining] = choices;
  if (!first) throw new GrandArchiveUnsupportedRuleError("multi-player choice without players");
  return {
    kind: "pending",
    ...first,
    ...(multiPlayer ? { controllerId: first.playerId } : {}),
    ...(multiPlayer ? { simultaneous: { selected, publicSelections, remaining } } : {}),
  };
}

/**
 * Searching and Finding 1.1–2: a characteristic-filtered search of a private
 * zone may fail to find, but an unfiltered instruction to find "a card" may not.
 */
function grandArchiveSearchMayFailToFind(
  effect: Extract<GrandArchiveEffect, { readonly kind: "search" }>,
): boolean {
  if (!["main-deck", "material-deck", "memory", "hand"].includes(effect.zone)) return false;
  const candidates = effect.selection.candidates;
  if (candidates.kind === "card") return candidates.filter !== undefined;
  return (
    candidates.kind === "union" && candidates.sources.every((source) => source.filter !== undefined)
  );
}

function randomlyDeclareGrandArchiveMultiPlayerChoices(
  selection: GrandArchiveResolutionChoice,
  playerIds: readonly GrandArchivePlayerId[],
  evaluation: GrandArchiveEvaluationContext,
): {
  readonly binding: GrandArchiveExecutionBinding;
  readonly random: GrandArchiveMatchState["random"];
} {
  if (selection.chooser !== "each-player" && selection.chooser !== "each-opponent") {
    throw new GrandArchiveUnsupportedRuleError("random multi-player choice set");
  }
  let random = evaluation.state.random;
  const selected: GrandArchiveObjectId[] = [];
  for (const playerId of grandArchivePlayersFromTurnPlayer(evaluation.state, playerIds)) {
    const scoped = grandArchiveMultiPlayerChoiceForController(selection, selection.chooser);
    const declared = randomlyDeclareGrandArchiveResolutionChoice(scoped, {
      ...evaluation,
      controllerId: playerId,
      state: { ...evaluation.state, random },
    });
    if (!Array.isArray(declared.binding)) {
      throw new GrandArchiveUnsupportedRuleError(
        "random multi-player choice with a non-object selection",
      );
    }
    for (const value of declared.binding) {
      const object = Object.values(evaluation.state.objects).find(
        (candidate) => candidate.id === value,
      );
      if (!object) {
        throw new GrandArchiveUnsupportedRuleError(
          "random multi-player choice with an unknown object",
        );
      }
      selected.push(object.id);
    }
    random = declared.random;
  }
  return { binding: selected, random };
}

function initialResolution(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  item: GrandArchiveStackItem,
): { readonly resolution: GrandArchiveEffectResolution; readonly targetsInvalid: boolean } {
  const targetLegality = evaluateGrandArchiveStackItemTargetLegality(program, state, item);
  const { championLevelModifier, elysianAuraActive } = targetLegality;
  const ability = effectiveItemAbility(
    program,
    state,
    item,
    championLevelModifier,
    elysianAuraActive,
  );
  const effect = itemEffect(item, ability);
  const chosenModes = selectedModes(item, ability);
  return {
    targetsInvalid: targetLegality.anyRequiredTargetInvalid,
    resolution: {
      stackItemId: item.id,
      legalityChecked: false,
      controllerId: item.controllerId,
      ...(item.sourceId ? { sourceId: item.sourceId } : {}),
      ...(item.sourceIncarnation !== undefined
        ? { sourceIncarnation: item.sourceIncarnation }
        : {}),
      ...(item.sourceLkiEventId ? { sourceLkiEventId: item.sourceLkiEventId } : {}),
      championLevelModifier,
      elysianAuraActive,
      elysianAuraEligible: itemUsesElysianAura(program, state, item),
      selectedModeIds: item.selectedModeIds,
      frames: [
        ...variableFrames(ability?.variables),
        ...(ability?.modes ? modeFrames(chosenModes) : []),
        ...(effect ? [{ kind: "effect" as const, effect }] : []),
        ...(item.kind === "replacement-follow-up" && item.resumeReplacementPreCommit
          ? [{ kind: "resume-replacement-pre-commit" as const }]
          : []),
      ],
      bindings: targetLegality.bindings,
      variables: item.variables,
      startedEventHistoryIndex: state.eventHistory.length,
      deferredStackItems: [],
    },
  };
}

function itemUsesElysianAura(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  item: GrandArchiveStackItem,
): boolean {
  if (item.kind !== "card-activation" || !item.sourceId) return false;
  const source = state.objects[item.sourceId];
  if (!source) return false;
  const subtypes = grandArchiveObjectCurrentCharacteristics(program, state, source).subtypes;
  return subtypes.includes("AENEAN") && subtypes.includes("SPELL");
}

function stackItemFizzles(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  item: GrandArchiveStackItem,
  resolution: GrandArchiveEffectResolution,
): boolean {
  if (
    item.negated ||
    grandArchiveStackItemStateBasedFizzleReason(program, state, item) !== undefined
  ) {
    return true;
  }
  if (
    item.kind === "triggered-ability" &&
    item.ability.interveningCondition &&
    !evaluateGrandArchiveCondition(
      item.ability.interveningCondition,
      resolutionContext(program, state, resolution),
    )
  ) {
    return true;
  }
  return false;
}

function finishResolution(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  kernel: GrandArchiveTransactionKernel,
  item: GrandArchiveStackItem,
  fizzled: boolean,
  priorEvents: readonly GrandArchiveCommittedEvent[],
  startedEventHistoryIndex: number,
  deferredStackItems: readonly GrandArchiveStackItem[],
): GrandArchiveStackResolutionResult {
  const finalEvents: GrandArchiveProposedEvent[] = [];
  const scheduledAfterResolutionItems = fizzled
    ? []
    : (state.stack.find((candidate) => candidate.id === item.id)?.scheduledAfterResolutionItems ??
      []);
  const resolvedCard = item.kind === "card-activation" ? state.objects[item.cardId] : undefined;
  const incrementsAeneanProgression = Boolean(
    !fizzled &&
    resolvedCard &&
    grandArchiveObjectHasActiveKeyword(program, state, resolvedCard, "aenean-progression"),
  );
  let resolvedAttackId: GrandArchiveObjectId | undefined;
  let preserveDestinationDecision = false;
  if (state.resolution) {
    finalEvents.push({
      type: "effect-resolution-cleared",
      stackItemId: item.id,
      cause: { kind: "stack-item", stackItemId: item.id },
    });
  }
  finalEvents.push({
    type: "stack-item-removed",
    itemId: item.id,
    outcome: fizzled ? "fizzled" : "resolved",
    ...(item.kind === "replacement-follow-up" ? { internal: true } : {}),
    cause: { kind: "stack-item", stackItemId: item.id },
  });
  if (item.kind === "replacement-follow-up") {
    finalEvents.push(...(item.internalAfterResolutionEvents ?? []));
  }
  if (incrementsAeneanProgression) {
    const previous = state.players[item.controllerId]?.states.aeneanProgressionResolved;
    finalEvents.push({
      type: "player-state-changed",
      playerId: item.controllerId,
      state: "aeneanProgressionResolved",
      value: (typeof previous === "number" ? previous : 0) + 1,
      cause: { kind: "rule", rule: "aenean-progression-card-resolved" },
    });
  }
  if (
    item.kind === "card-activation" ||
    item.kind === "materialization" ||
    item.kind === "bestowment"
  ) {
    if (item.isCopy) {
      finalEvents.push(...copiedCardResolutionEvents(program, state, item, fizzled));
    } else {
      const destination = defaultCardDestination(program, state, item, fizzled);
      if (destination) {
        const card = state.objects[item.cardId];
        const preserveInsteadOfBanishment =
          destination.type === "object-moved" &&
          destination.to === "banishment" &&
          card !== undefined &&
          !grandArchiveCardIsObject(grandArchiveObjectFace(program, card)) &&
          grandArchiveObjectHasActiveKeyword(program, state, card, "preserve");
        if (preserveInsteadOfBanishment) {
          preserveDestinationDecision = true;
          finalEvents.push({
            type: "decision-created",
            decision: {
              id: grandArchiveDecisionId(`decision-${state.nextDecisionOrdinal}`),
              kind: "choose-preserve-destination",
              playerId: item.controllerId,
              cardId: item.cardId,
              stackItemId: item.id,
              stateVersion: state.stateVersion,
            },
            cause: { kind: "rule", rule: "preserve-banishment-choice" },
          });
        } else {
          finalEvents.push(destination);
          if (item.kind === "bestowment" && !fizzled) {
            finalEvents.push({
              type: "boon-gained",
              objectId: item.cardId,
              playerId: item.controllerId,
              cause: { kind: "stack-item", stackItemId: item.id },
            });
          }
        }
        if (
          !preserveInsteadOfBanishment &&
          destination.type === "object-moved" &&
          destination.to === "intent"
        ) {
          resolvedAttackId = destination.objectId;
        }
      }
    }
  }
  for (const deferred of deferredStackItems) {
    finalEvents.push({
      type: "deferred-stack-item-promoted",
      item: deferred,
      cause: { kind: "rule", rule: "current-effect-resolution-complete" },
    });
  }
  for (const scheduled of scheduledAfterResolutionItems) {
    finalEvents.push({
      type: "deferred-stack-item-promoted",
      item: scheduled,
      cause: { kind: "rule", rule: "scheduled-stack-item-resolution-complete" },
    });
  }
  const completesTurnBasedMaterialization =
    item.kind === "materialization" &&
    item.materializationContext === "turn-based-action" &&
    !item.isCopy &&
    state.turn.phase === "materialize" &&
    state.stack.length === 1 &&
    deferredStackItems.length === 0 &&
    scheduledAfterResolutionItems.length === 0;
  if (resolvedAttackId) {
    const candidates = grandArchiveResolvedAttackCandidates(
      program,
      state,
      item.controllerId,
      resolvedAttackId,
      item.attackAttackerId,
    );
    if (candidates.attackerCandidates.length > 0 && candidates.targetCandidates.length > 0) {
      finalEvents.push({
        type: "decision-created",
        decision: {
          id: grandArchiveDecisionId(`decision-${state.nextDecisionOrdinal}`),
          kind: "declare-resolved-attack",
          playerId: item.controllerId,
          intentId: resolvedAttackId,
          attackerCandidates: candidates.attackerCandidates,
          targetCandidates: candidates.targetCandidates,
          weaponCandidates: candidates.weaponCandidates,
          cleavePlayerCandidates: candidates.cleavePlayerCandidates,
          stateVersion: state.stateVersion,
        },
        cause: { kind: "rule", rule: "resolved-attack-requires-declaration" },
      });
    } else {
      finalEvents.push({
        type: "object-moved",
        objectId: resolvedAttackId,
        from: "intent",
        to: "graveyard",
        cause: { kind: "rule", rule: "resolved-attack-fizzled-without-declaration" },
      });
    }
  }
  if (
    item.kind !== "replacement-follow-up" &&
    !completesTurnBasedMaterialization &&
    !preserveDestinationDecision &&
    (!resolvedAttackId || finalEvents.at(-1)?.type !== "decision-created") &&
    !grandArchiveOpportunityIsSuppressed(state, item.id) &&
    ![...deferredStackItems, ...scheduledAfterResolutionItems].some(
      (deferred) => deferred.opportunityPolicy === "interdiction",
    )
  ) {
    finalEvents.push({
      type: "opportunity-opened",
      window: openGrandArchiveOpportunity(
        state,
        state.turn.playerId,
        "stack-item-resolved",
        item.id,
      ),
      cause: { kind: "stack-item", stackItemId: item.id },
    });
  }
  const transaction = kernel.transact(state, finalEvents);
  const events = [...priorEvents, ...transaction.result.events];
  return {
    state: transaction.state,
    events,
    resolvedItem: item,
    fizzled,
    paused: false,
    triggerEvents: transaction.state.eventHistory.slice(startedEventHistoryIndex),
  };
}

function advanceResolution(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  kernel: GrandArchiveTransactionKernel,
  startingResolution: GrandArchiveEffectResolution,
): GrandArchiveStackResolutionResult {
  const item = state.stack.at(-1);
  if (!item || item.id !== startingResolution.stackItemId) {
    throw new Error("The suspended resolution is not the top Effects Stack item");
  }
  let current = state;
  let resolution: GrandArchiveEffectResolution = {
    ...startingResolution,
    legalityChecked: true,
  };
  const events: GrandArchiveCommittedEvent[] = [];
  const resolvingEvaluation = (): GrandArchiveEvaluationContext => ({
    ...resolutionContext(program, current, resolution),
    rollDice: (sides, count) => {
      const rolled = rollGrandArchiveDice(current.random, sides, count);
      const transaction = kernel.transact(current, [
        {
          type: "random-state-changed",
          random: rolled.random,
          result: { kind: "die-roll", sides, ...rolled.value },
          cause: { kind: "stack-item", stackItemId: item.id },
        },
      ]);
      current = transaction.state;
      events.push(...transaction.result.events);
      return rolled.value.total;
    },
  });
  const fizzled =
    !startingResolution.legalityChecked &&
    stackItemFizzles(program, state, item, startingResolution);
  if (fizzled) {
    return finishResolution(
      program,
      current,
      kernel,
      item,
      true,
      events,
      resolution.startedEventHistoryIndex,
      resolution.deferredStackItems,
    );
  }

  for (let step = 0; step < 4096; step += 1) {
    const trackedItem = current.stack.find((candidate) => candidate.id === item.id);
    if (resolution.sourceLkiEventId === undefined && trackedItem?.sourceLkiEventId !== undefined) {
      resolution = {
        ...resolution,
        sourceIncarnation: trackedItem.sourceIncarnation,
        sourceLkiEventId: trackedItem.sourceLkiEventId,
      };
    }
    const elysianAuraActive =
      resolution.elysianAuraEligible &&
      grandArchivePlayerControlsActiveKeyword(
        program,
        current,
        resolution.controllerId,
        "elysian-aura",
      );
    if (elysianAuraActive !== resolution.elysianAuraActive) {
      resolution = {
        ...resolution,
        championLevelModifier: resolution.championLevelModifier + (elysianAuraActive ? 2 : -2),
        elysianAuraActive,
      };
    }
    resolution = refreshGrandArchiveModifiedResultVariables(program, current, item, resolution);
    const [frame, ...remaining] = resolution.frames;
    if (!frame) {
      return finishResolution(
        program,
        current,
        kernel,
        item,
        false,
        events,
        resolution.startedEventHistoryIndex,
        resolution.deferredStackItems,
      );
    }
    if (frame.kind === "replacement-follow-up") {
      const followUp = frame.followUp;
      resolution = {
        ...resolution,
        controllerId: followUp.controllerId,
        sourceId: followUp.sourceId,
        sourceIncarnation: followUp.sourceIncarnation,
        sourceLkiEventId: followUp.sourceLkiEventId,
        championLevelModifier: 0,
        elysianAuraActive: false,
        elysianAuraEligible: false,
        selectedModeIds: [],
        bindings: followUp.bindings,
        variables: followUp.variables,
        frames: prependFrames(
          [
            { kind: "effect", effect: followUp.effect },
            {
              kind: "restore-resolution-context",
              context: {
                controllerId: resolution.controllerId,
                ...(resolution.sourceId ? { sourceId: resolution.sourceId } : {}),
                ...(resolution.sourceIncarnation !== undefined
                  ? { sourceIncarnation: resolution.sourceIncarnation }
                  : {}),
                ...(resolution.sourceLkiEventId
                  ? { sourceLkiEventId: resolution.sourceLkiEventId }
                  : {}),
                championLevelModifier: resolution.championLevelModifier,
                elysianAuraActive: resolution.elysianAuraActive,
                elysianAuraEligible: resolution.elysianAuraEligible,
                selectedModeIds: resolution.selectedModeIds,
                bindings: resolution.bindings,
                variables: resolution.variables,
              },
            },
          ],
          remaining,
        ),
      };
      continue;
    }
    if (frame.kind === "restore-resolution-context") {
      resolution = {
        ...resolution,
        controllerId: frame.context.controllerId,
        sourceId: frame.context.sourceId,
        sourceIncarnation: frame.context.sourceIncarnation,
        sourceLkiEventId: frame.context.sourceLkiEventId,
        championLevelModifier: frame.context.championLevelModifier,
        elysianAuraActive: frame.context.elysianAuraActive,
        elysianAuraEligible: frame.context.elysianAuraEligible,
        selectedModeIds: frame.context.selectedModeIds,
        bindings: frame.context.bindings,
        variables: frame.context.variables,
        frames: remaining,
      };
      continue;
    }
    if (frame.kind === "track-selected-characteristic") {
      const selected = resolution.bindings[frame.selectionId];
      if (typeof selected === "number") {
        resolution = { ...resolution, frames: remaining };
        continue;
      }
      const values =
        typeof selected === "string"
          ? [selected]
          : Array.isArray(selected) && selected.every((value) => typeof value === "string")
            ? selected
            : undefined;
      if (!values || !resolution.sourceId) {
        throw new GrandArchiveUnsupportedRuleError(
          `tracked characteristic selection ${frame.selectionId}`,
        );
      }
      const transaction = kernel.transact(current, [
        {
          type: "object-characteristic-tracked",
          objectId: resolution.sourceId,
          key: frame.trackAs,
          values,
          cause: { kind: "stack-item", stackItemId: item.id },
        },
      ]);
      current = transaction.state;
      events.push(...transaction.result.events);
      resolution = {
        ...resolution,
        bindings: { ...resolution.bindings, [`tracked:${frame.trackAs}`]: values },
        frames: remaining,
      };
      continue;
    }
    if (frame.kind === "resume-replacement-pre-commit") {
      const pending = current.replacementPreCommit;
      if (!pending || pending.status !== "resolving") {
        throw new Error("Pre-commit replacement continuation is not resolving");
      }
      const resultEventHistoryIndex = pending.continuation.startedEventHistoryIndex;
      const cleared = kernel.transact(current, [
        {
          type: "replacement-pre-commit-cleared",
          cause: { kind: "rule", rule: "event-processing-effect-completed" },
        },
      ]);
      current = cleared.state;
      events.push(...cleared.result.events);
      const resumed = kernel.resumeReplacementPreCommit(current, pending.continuation);
      current = resumed.state;
      events.push(...resumed.result.events);
      resolution = { ...resolution, frames: remaining };
      if (current.decision?.kind === "choose-replacement") {
        resolution = {
          ...resolution,
          pendingReplacement: { resultEventHistoryIndex },
        };
        const suspended = kernel.transact(current, [
          {
            type: "effect-resolution-suspended",
            resolution,
            cause: { kind: "stack-item", stackItemId: item.id },
          },
        ]);
        events.push(...suspended.result.events);
        return {
          state: suspended.state,
          events,
          resolvedItem: item,
          fizzled: false,
          paused: true,
          triggerEvents: [],
        };
      }
      const integratedPreCommit = integrateGrandArchiveReplacementPreCommit(
        current,
        kernel,
        resolution,
      );
      current = integratedPreCommit.state;
      events.push(...integratedPreCommit.events);
      resolution = integratedPreCommit.resolution;
      const integratedFollowUps = integrateGrandArchiveReplacementFollowUps(
        current,
        kernel,
        resolution,
      );
      current = integratedFollowUps.state;
      events.push(...integratedFollowUps.events);
      resolution = integratedFollowUps.resolution;
      continue;
    }
    if (frame.kind === "remode-copied-stack-item") {
      const targetItem = resolution.deferredStackItems.find(
        (candidate) => candidate.id === frame.targetStackItemId,
      );
      if (!targetItem) {
        throw new GrandArchiveUnsupportedRuleError(
          "copied mode selection requires a deferred copied stack item",
        );
      }
      const choices = stackItemModeChoices(program, current, targetItem).filter((choice) => {
        try {
          declareGrandArchiveRemodedStackItem(
            program,
            current,
            targetItem,
            choice,
            frame.mayRetarget,
          );
          return true;
        } catch {
          return false;
        }
      });
      if (
        choices.length === 0 ||
        (choices.length === 1 &&
          choices[0]?.length === targetItem.selectedModeIds.length &&
          choices[0]?.every((id, index) => id === targetItem.selectedModeIds[index]))
      ) {
        resolution = { ...resolution, frames: remaining };
        continue;
      }
      const suspended: GrandArchiveEffectResolution = {
        ...resolution,
        frames: remaining,
        pendingRemode: {
          targetStackItemId: targetItem.id,
          choices,
          mayRetarget: frame.mayRetarget,
        },
      };
      const transaction = kernel.transact(current, [
        {
          type: "effect-resolution-suspended",
          resolution: suspended,
          cause: { kind: "stack-item", stackItemId: item.id },
        },
        {
          type: "decision-created",
          decision: {
            id: grandArchiveDecisionId(`decision-${current.nextDecisionOrdinal}`),
            kind: "remode-stack-item",
            playerId: resolution.controllerId,
            stackItemId: item.id,
            targetStackItemId: targetItem.id,
            choices,
            stateVersion: current.stateVersion,
          },
          cause: { kind: "stack-item", stackItemId: item.id },
        },
      ]);
      events.push(...transaction.result.events);
      return {
        state: transaction.state,
        events,
        resolvedItem: item,
        fizzled: false,
        paused: true,
        triggerEvents: [],
      };
    }
    if (frame.kind === "set-binding") {
      resolution = {
        ...resolution,
        frames: remaining,
        bindings: { ...resolution.bindings, [frame.binding]: frame.value },
      };
      continue;
    }
    if (frame.kind === "set-derived-variable") {
      const variableEvaluation: GrandArchiveEvaluationContext = resolution.sourceLkiEventId
        ? { ...resolvingEvaluation(), sourceInformationBasis: "last-known" }
        : resolvingEvaluation();
      resolution = {
        ...resolution,
        frames: remaining,
        variables: {
          ...resolution.variables,
          [frame.symbol]: evaluateGrandArchiveAmount(frame.amount, variableEvaluation),
        },
      };
      continue;
    }
    if (frame.kind === "summon-selected-token") {
      const selected = resolution.bindings[frame.selectionId];
      if (typeof selected !== "string") {
        throw new GrandArchiveUnsupportedRuleError(
          `summon-one-of selection binding ${frame.selectionId}`,
        );
      }
      resolution = {
        ...resolution,
        frames: prependFrames(
          [
            {
              kind: "effect",
              effect: {
                kind: "summon",
                object: selected,
                controller: frame.controller,
                ...(frame.bindResultAs ? { bindResultAs: frame.bindResultAs } : {}),
              },
            },
          ],
          remaining,
        ),
      };
      continue;
    }
    if (frame.kind === "generate-selected-cards") {
      const selected = resolution.bindings[frame.selectionId];
      if (
        !Array.isArray(selected) ||
        selected.some((definitionId) => typeof definitionId !== "string")
      ) {
        throw new GrandArchiveUnsupportedRuleError(
          `generate-selected binding ${frame.selectionId}`,
        );
      }
      resolution = {
        ...resolution,
        frames: prependFrames(
          selected.map((definitionId) => ({
            kind: "effect" as const,
            effect: {
              kind: "generate" as const,
              card: definitionId,
              player: frame.player,
              destination: frame.destination,
            },
          })),
          remaining,
        ),
      };
      continue;
    }
    if (frame.kind === "announce-materialization") {
      const suspended: GrandArchiveEffectResolution = {
        ...resolution,
        frames: remaining,
        pendingMaterialization: {
          playerId: frame.playerId,
          cardId: frame.cardId,
          payCosts: frame.payCosts,
          ignoreElementRequirements: frame.ignoreElementRequirements,
          costModifiers: frame.costModifiers,
          ...(frame.attemptBinding ? { attemptBinding: frame.attemptBinding } : {}),
        },
      };
      const transaction = kernel.transact(current, [
        {
          type: "effect-resolution-suspended",
          resolution: suspended,
          cause: { kind: "stack-item", stackItemId: item.id },
        },
        {
          type: "decision-created",
          decision: {
            id: grandArchiveDecisionId(`decision-${current.nextDecisionOrdinal}`),
            kind: "announce-effect-materialization",
            playerId: frame.playerId,
            stackItemId: item.id,
            cardId: frame.cardId,
            payCosts: frame.payCosts,
            ignoreElementRequirements: frame.ignoreElementRequirements,
            costModifiers: frame.costModifiers,
            ...(frame.attemptBinding ? { attemptBinding: frame.attemptBinding } : {}),
            stateVersion: current.stateVersion,
          },
          cause: { kind: "stack-item", stackItemId: item.id },
        },
      ]);
      events.push(...transaction.result.events);
      return {
        state: transaction.state,
        events,
        resolvedItem: item,
        fizzled: false,
        paused: true,
        triggerEvents: [],
      };
    }
    if (frame.kind === "announce-activation") {
      const suspended: GrandArchiveEffectResolution = {
        ...resolution,
        frames: remaining,
        pendingActivation: {
          playerId: frame.playerId,
          cardId: frame.cardId,
          payCosts: frame.payCosts,
          ignoreElementRequirements: frame.ignoreElementRequirements,
          ...(frame.speed ? { speed: frame.speed } : {}),
          costModifiers: frame.costModifiers,
        },
      };
      const transaction = kernel.transact(current, [
        {
          type: "effect-resolution-suspended",
          resolution: suspended,
          cause: { kind: "stack-item", stackItemId: item.id },
        },
        {
          type: "decision-created",
          decision: {
            id: grandArchiveDecisionId(`decision-${current.nextDecisionOrdinal}`),
            kind: "announce-effect-activation",
            playerId: frame.playerId,
            stackItemId: item.id,
            cardId: frame.cardId,
            payCosts: frame.payCosts,
            ignoreElementRequirements: frame.ignoreElementRequirements,
            ...(frame.speed ? { speed: frame.speed } : {}),
            costModifiers: frame.costModifiers,
            stateVersion: current.stateVersion,
          },
          cause: { kind: "stack-item", stackItemId: item.id },
        },
      ]);
      events.push(...transaction.result.events);
      return {
        state: transaction.state,
        events,
        resolvedItem: item,
        fizzled: false,
        paused: true,
        triggerEvents: [],
      };
    }
    if (frame.kind === "apply-selection") {
      const selected = resolution.bindings[frame.selectionId];
      if (!Array.isArray(selected)) {
        throw new GrandArchiveUnsupportedRuleError(`selection binding ${frame.selectionId}`);
      }
      const selectedObjects = selected.flatMap((objectId) => {
        const object = current.objects[objectId];
        return object ? [object] : [];
      });
      const affectedPlayer = (object: GrandArchiveCardInstance): GrandArchivePlayerId =>
        frame.playerIds.length === 1 ? frame.playerIds[0] : object.ownerId;
      const proposed: GrandArchiveProposedEvent[] = [];
      if (frame.operation === "reserve") {
        for (const object of selectedObjects) {
          if (object.zone !== "hand") continue;
          proposed.push({
            type: "object-moved",
            objectId: object.id,
            from: "hand",
            to: "memory",
            actorId: affectedPlayer(object),
            cause: { kind: "stack-item", stackItemId: item.id },
          });
        }
      } else if (frame.operation === "discard" || frame.operation === "banish") {
        const destination = frame.operation === "discard" ? "graveyard" : "banishment";
        for (const object of selectedObjects) {
          if (object.zone === destination) continue;
          proposed.push({
            type: "object-moved",
            objectId: object.id,
            from: object.zone,
            to: destination,
            ...(frame.operation === "discard" ? { discarded: true as const } : {}),
            ...(frame.operation === "banish" && resolution.sourceId
              ? { banishedBySourceId: resolution.sourceId }
              : {}),
            actorId: affectedPlayer(object),
            cause: { kind: "stack-item", stackItemId: item.id },
          });
          if (frame.faceDown) {
            proposed.push({
              type: "object-facing-changed",
              objectId: object.id,
              facing: "face-down",
              actorId: affectedPlayer(object),
              cause: { kind: "stack-item", stackItemId: item.id },
            });
          }
        }
      } else if (frame.operation === "reveal") {
        for (const object of selectedObjects) {
          proposed.push({
            type: "card-revealed",
            objectId: object.id,
            playerId: affectedPlayer(object),
            actorId: affectedPlayer(object),
            cause: { kind: "stack-item", stackItemId: item.id },
          });
        }
      } else if (frame.operation === "look-at") {
        for (const playerId of frame.playerIds) {
          const objectIds = selectedObjects
            .filter((object) => affectedPlayer(object) === playerId)
            .map((object) => object.id);
          if (objectIds.length === 0) continue;
          proposed.push({
            type: "cards-looked-at",
            objectIds,
            playerId,
            actorId: playerId,
            cause: { kind: "stack-item", stackItemId: item.id },
          });
        }
      } else {
        for (const playerId of frame.playerIds) {
          const playerObjects = selectedObjects.filter(
            (object) => affectedPlayer(object) === playerId,
          );
          proposed.push({
            type: "cards-searched",
            objectIds: playerObjects.map((object) => object.id),
            playerId,
            actorId: playerId,
            cause: { kind: "stack-item", stackItemId: item.id },
          });
          if (!frame.revealSearch) continue;
          for (const object of playerObjects) {
            proposed.push({
              type: "card-revealed",
              objectId: object.id,
              playerId,
              actorId: playerId,
              cause: { kind: "stack-item", stackItemId: item.id },
            });
          }
        }
      }
      let committedSelectionEvents: readonly GrandArchiveCommittedEvent[] = [];
      const resultEventHistoryIndex = current.eventHistory.length;
      if (proposed.length > 0) {
        const transaction = kernel.transact(current, proposed);
        current = transaction.state;
        events.push(...transaction.result.events);
        committedSelectionEvents = transaction.result.events;
      }
      const movesCards =
        frame.operation === "reserve" ||
        frame.operation === "discard" ||
        frame.operation === "banish";
      resolution = {
        ...resolution,
        frames: remaining,
        bindings: {
          ...resolution.bindings,
          ...(frame.bindResultAs ? { [frame.bindResultAs]: selected } : {}),
          ...(movesCards
            ? {
                [grandArchiveModifiedResultBinding("cards-moved")]:
                  grandArchiveModifiedResultAmount("cards-moved", committedSelectionEvents),
              }
            : {}),
        },
      };
      if (current.decision?.kind === "choose-replacement") {
        resolution = {
          ...resolution,
          ...(movesCards
            ? {
                pendingReplacement: {
                  resultEventHistoryIndex,
                  resultMetric: "cards-moved" as const,
                },
              }
            : {}),
        };
        const suspended = kernel.transact(current, [
          {
            type: "effect-resolution-suspended",
            resolution,
            cause: { kind: "stack-item", stackItemId: item.id },
          },
        ]);
        events.push(...suspended.result.events);
        return {
          state: suspended.state,
          events,
          resolvedItem: item,
          fizzled: false,
          paused: true,
          triggerEvents: [],
        };
      }
      continue;
    }
    if (frame.kind === "finish-reflexive") {
      const actionEvents = current.eventHistory.slice(frame.startedEventHistoryIndex);
      resolution = { ...resolution, frames: remaining };
      if (!actionEvents.some(eventRepresentsPerformedAction)) continue;
      const sourceId = resolution.sourceId;
      if (!sourceId) {
        throw new GrandArchiveUnsupportedRuleError("reflexive trigger without source object");
      }
      const resultIds = committedResultObjectIds(actionEvents);
      const instances: readonly (GrandArchiveObjectId | undefined)[] =
        frame.cardinality === "each-result-object" ? resultIds : [undefined];
      if (instances.length === 0) continue;
      const generatedEvents: GrandArchiveProposedEvent[] = instances.map(
        (resultObjectId, index) => {
          const ordinal = current.nextGeneratedTriggerOrdinal + index;
          return {
            type: "reflexive-trigger-generated",
            trigger: {
              id: `reflexive-trigger-${ordinal}`,
              sourceId,
              controllerId: resolution.controllerId,
              ability: {
                id: `reflexive-${ordinal}-a1`,
                kind: "triggered",
                text: "Reflexive triggered effect.",
                trigger: { kind: "event", event: { name: "effect-resolved" } },
                ...(frame.targets ? { targets: frame.targets } : {}),
                effect: frame.consequence,
              },
              bindings: {
                ...resolution.bindings,
                ...(resultObjectId ? { reflexiveResult: [resultObjectId] } : {}),
              },
              variables: resolution.variables,
              createdAtVersion: current.stateVersion,
            },
            cause: { kind: "stack-item", stackItemId: item.id },
          };
        },
      );
      const generated = kernel.transact(current, generatedEvents);
      current = generated.state;
      events.push(...generated.result.events);
      continue;
    }
    if (frame.kind === "finish-attempt") {
      const actionEvents = current.eventHistory.slice(frame.startedEventHistoryIndex);
      resolution = {
        ...resolution,
        frames: remaining,
        bindings: {
          ...resolution.bindings,
          [frame.bindSucceededAs]:
            resolution.bindings[frame.bindSucceededAs] === true ||
            actionEvents.some(eventRepresentsPerformedAction),
        },
      };
      continue;
    }

    const effect =
      frame.effect.kind === "choose" ? combineSelectionAndMoveOrder(frame.effect) : frame.effect;
    const evaluation = resolvingEvaluation();
    if (frame.entryLinkHostBindings === undefined) {
      const objects = (() => {
        if (
          effect.kind !== "move" ||
          effect.destination.zone !== "field" ||
          effect.destination.linkTo !== undefined
        ) {
          return grandArchiveEffectFieldEntryObjects(effect, evaluation);
        }
        const destinationControllers = effect.destination.controller
          ? resolveGrandArchivePlayers(effect.destination.controller, evaluation)
          : [];
        if (effect.destination.controller && destinationControllers.length !== 1) {
          throw new GrandArchiveUnsupportedRuleError(
            "Link entry control requires exactly one destination controller",
          );
        }
        return resolveGrandArchiveSubjectObjects(effect.subject, evaluation)
          .filter(
            (object) =>
              object.zone !== "field" &&
              object.zone !== "effects-stack" &&
              (effect.from === undefined || object.zone === effect.from),
          )
          .map((object) => {
            const controllerId = destinationControllers[0] ?? object.ownerId;
            return {
              ...object,
              zone: "field" as const,
              baseControllerId: controllerId,
              controllerId,
              hostId: undefined,
            };
          });
      })();
      const choiceFrames: GrandArchiveResolutionFrame[] = [];
      const entryLinkHostBindings: Record<GrandArchiveObjectId, string> = {};
      for (const [index, object] of objects.entries()) {
        const candidates = grandArchiveLinkChoiceCandidates(program, current, object);
        if (!candidates) continue;
        const hostBinding = `intrinsic-link-entry-host-${item.id}-${index}`;
        const controllerBinding = `intrinsic-link-entry-controller-${item.id}-${index}`;
        const selection = {
          id: hostBinding,
          kind: "choice",
          declared: "resolution",
          chooser: { binding: controllerBinding },
          count: { kind: "exactly", amount: 1 },
          unique: true,
          candidates,
        } as const satisfies import("@tcg/grand-archive-types").GrandArchiveResolutionChoice;
        const declaration = {
          ...selection,
          kind: "target",
          declared: "announcement",
        } as const satisfies import("@tcg/grand-archive-types").GrandArchiveTargetDeclaration;
        const objectEvaluation: GrandArchiveEvaluationContext = {
          ...evaluation,
          sourceId: object.id,
          abilityBearerId: object.id,
        };
        const hasLegalCandidate = Object.values(current.objects).some(
          (candidate) =>
            candidate.id !== object.id &&
            isGrandArchiveTargetCandidate(candidate.id, declaration, objectEvaluation),
        );
        if (!hasLegalCandidate) continue;
        entryLinkHostBindings[object.id] = hostBinding;
        choiceFrames.push(
          { kind: "set-binding", binding: controllerBinding, value: [object.controllerId] },
          { kind: "effect", effect: { kind: "choose", selection } },
        );
      }
      if (choiceFrames.length > 0) {
        resolution = {
          ...resolution,
          frames: prependFrames(
            [...choiceFrames, { kind: "effect", effect, entryLinkHostBindings }],
            remaining,
          ),
        };
        continue;
      }
    }
    if (effect.kind === "unless-performed") {
      const binding = `unless-performed-${item.id}-${current.nextDecisionOrdinal}`;
      resolution = {
        ...resolution,
        frames: prependFrames(
          [
            {
              kind: "effect",
              effect: {
                kind: "optional",
                player: effect.player,
                allOrNothing: true,
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "attempt",
                      effect: effect.alternative,
                      bindSucceededAs: binding,
                    },
                    {
                      kind: "conditional",
                      condition: { kind: "effect-succeeded", binding },
                      then: { kind: "no-op" },
                      else: effect.otherwise,
                    },
                  ],
                },
                otherwise: effect.otherwise,
              },
            },
          ],
          remaining,
        ),
      };
      continue;
    }
    if (effect.kind === "level-up") {
      const champions = resolveGrandArchiveSubjectObjects(effect.subject, evaluation);
      if (champions.length !== 1) {
        throw new GrandArchiveUnsupportedRuleError("level up requires exactly one champion");
      }
      const champion = champions[0]!;
      const candidates = grandArchiveLevelUpCandidates(program, current, champion, evaluation);
      if (candidates.length === 0) {
        resolution = { ...resolution, frames: remaining };
        continue;
      }
      if (candidates.length === 1) {
        const resultEventHistoryIndex = current.eventHistory.length;
        const transaction = kernel.transact(current, [
          {
            type: "champion-leveled-up",
            championId: champion.id,
            cardId: candidates[0]!.id,
            actorId: champion.controllerId,
            cause: { kind: "stack-item", stackItemId: item.id },
          },
        ]);
        current = transaction.state;
        events.push(...transaction.result.events);
        resolution = { ...resolution, frames: remaining };
        if (current.decision?.kind === "choose-replacement") {
          resolution = {
            ...resolution,
            pendingReplacement: { resultEventHistoryIndex },
          };
          const suspended = kernel.transact(current, [
            {
              type: "effect-resolution-suspended",
              resolution,
              cause: { kind: "stack-item", stackItemId: item.id },
            },
          ]);
          events.push(...suspended.result.events);
          return {
            state: suspended.state,
            events,
            resolvedItem: item,
            fizzled: false,
            paused: true,
            triggerEvents: [],
          };
        }
        continue;
      }
      const candidateCardIds: readonly [
        GrandArchiveObjectId,
        GrandArchiveObjectId,
        ...GrandArchiveObjectId[],
      ] = [candidates[0]!.id, candidates[1]!.id, ...candidates.slice(2).map((card) => card.id)];
      const suspended: GrandArchiveEffectResolution = {
        ...resolution,
        frames: remaining,
        pendingLevelUp: { championId: champion.id, candidateCardIds },
      };
      const transaction = kernel.transact(current, [
        {
          type: "effect-resolution-suspended",
          resolution: suspended,
          cause: { kind: "stack-item", stackItemId: item.id },
        },
        {
          type: "decision-created",
          decision: {
            id: grandArchiveDecisionId(`decision-${current.nextDecisionOrdinal}`),
            kind: "resolve-level-up",
            playerId: champion.controllerId,
            stackItemId: item.id,
            championId: champion.id,
            candidateCardIds,
            stateVersion: current.stateVersion,
          },
          cause: { kind: "stack-item", stackItemId: item.id },
        },
      ]);
      events.push(...transaction.result.events);
      return {
        state: transaction.state,
        events,
        resolvedItem: item,
        fizzled: false,
        paused: true,
        triggerEvents: [],
      };
    }
    if (effect.kind === "choose-direction") {
      const playerIds = resolveGrandArchivePlayers(effect.player, evaluation);
      if (playerIds.length !== 1) {
        throw new GrandArchiveUnsupportedRuleError("direction choice requires exactly one player");
      }
      const playerId = playerIds[0]!;
      const player = current.players[playerId];
      const direction = player?.states[effect.state];
      if (
        player?.mastery?.name !== "Shifting Currents" ||
        (direction !== "north" &&
          direction !== "east" &&
          direction !== "south" &&
          direction !== "west")
      ) {
        resolution = { ...resolution, frames: remaining };
        continue;
      }
      const candidates = shiftingCurrentsDirectionCandidates(direction, effect);
      if (candidates.length === 0) {
        resolution = { ...resolution, frames: remaining };
        continue;
      }
      if (candidates.length === 1) {
        const transaction = kernel.transact(current, [
          {
            type: "player-state-changed",
            playerId,
            state: effect.state,
            value: candidates[0]!,
            actorId: playerId,
            cause: { kind: "stack-item", stackItemId: item.id },
          },
        ]);
        current = transaction.state;
        events.push(...transaction.result.events);
        resolution = { ...resolution, frames: remaining };
        continue;
      }
      const directionCandidates: readonly [
        GrandArchiveShiftingCurrentsDirection,
        ...GrandArchiveShiftingCurrentsDirection[],
      ] = [candidates[0]!, ...candidates.slice(1)];
      const suspended: GrandArchiveEffectResolution = {
        ...resolution,
        frames: remaining,
        pendingDirectionChoice: {
          playerId,
          state: effect.state,
          from: direction,
          directions: directionCandidates,
        },
      };
      const transaction = kernel.transact(current, [
        {
          type: "effect-resolution-suspended",
          resolution: suspended,
          cause: { kind: "stack-item", stackItemId: item.id },
        },
        {
          type: "decision-created",
          decision: {
            id: grandArchiveDecisionId(`decision-${current.nextDecisionOrdinal}`),
            kind: "resolve-direction-choice",
            playerId,
            stackItemId: item.id,
            state: effect.state,
            from: direction,
            directions: directionCandidates,
            stateVersion: current.stateVersion,
          },
          cause: { kind: "stack-item", stackItemId: item.id },
        },
      ]);
      events.push(...transaction.result.events);
      return {
        state: transaction.state,
        events,
        resolvedItem: item,
        fizzled: false,
        paused: true,
        triggerEvents: [],
      };
    }
    if (effect.kind === "declare-attack") {
      const attackers = resolveGrandArchiveSubjectObjects(effect.attacker, evaluation);
      if (attackers.length !== 1) {
        throw new GrandArchiveUnsupportedRuleError(
          "effect attack declaration requires exactly one attacker",
        );
      }
      const attacker = attackers[0]!;
      const candidates = grandArchiveEffectAttackCandidates(program, current, attacker.id);
      if (
        attacker.zone !== "field" ||
        attacker.controllerId !== resolution.controllerId ||
        candidates.targetCandidates.length === 0 ||
        (current.combat !== null && (!effect.additional || current.combat.step !== "end"))
      ) {
        resolution = { ...resolution, frames: remaining };
        continue;
      }
      const suspended: GrandArchiveEffectResolution = {
        ...resolution,
        frames: remaining,
        pendingEffectAttack: {
          playerId: attacker.controllerId,
          attackerId: attacker.id,
          additional: effect.additional === true,
          ...(effect.cost ? { cost: effect.cost } : {}),
          ...(effect.ifDeclared ? { ifDeclared: effect.ifDeclared } : {}),
        },
      };
      const transaction = kernel.transact(current, [
        {
          type: "effect-resolution-suspended",
          resolution: suspended,
          cause: { kind: "stack-item", stackItemId: item.id },
        },
        {
          type: "decision-created",
          decision: {
            id: grandArchiveDecisionId(`decision-${current.nextDecisionOrdinal}`),
            kind: "announce-effect-attack",
            playerId: attacker.controllerId,
            stackItemId: item.id,
            attackerId: attacker.id,
            additional: effect.additional === true,
            targetCandidates: candidates.targetCandidates,
            weaponCandidates: candidates.weaponCandidates,
            cleavePlayerCandidates: candidates.cleavePlayerCandidates,
            ...(effect.cost ? { cost: effect.cost } : {}),
            stateVersion: current.stateVersion,
          },
          cause: { kind: "stack-item", stackItemId: item.id },
        },
      ]);
      events.push(...transaction.result.events);
      return {
        state: transaction.state,
        events,
        resolvedItem: item,
        fizzled: false,
        paused: true,
        triggerEvents: [],
      };
    }
    if (
      effect.kind === "move-counters-from-collection" ||
      effect.kind === "remove-counters-from-collection"
    ) {
      const choosingPlayers = resolveGrandArchivePlayers(effect.chooser, evaluation);
      if (choosingPlayers.length !== 1) {
        throw new GrandArchiveUnsupportedRuleError(
          "collection counter allocation requires exactly one choosing player",
        );
      }
      const destination =
        effect.kind === "move-counters-from-collection"
          ? resolveGrandArchiveSubjectObjects(effect.to, evaluation)[0]
          : undefined;
      if (effect.kind === "move-counters-from-collection" && !destination) {
        resolution = { ...resolution, frames: remaining };
        continue;
      }
      const counter = grandArchiveCounterKey(effect.counter);
      const candidates = resolveGrandArchiveCollection(effect.collection, evaluation)
        .filter((object) => object.id !== destination?.id)
        .map((object) => ({
          objectId: object.id,
          available: grandArchiveObjectCounterCount(object, effect.counter),
        }))
        .filter((candidate) => candidate.available > 0);
      const available = candidates.reduce((total, candidate) => total + candidate.available, 0);
      const bounds = counterSelectionBounds(effect.count, available, evaluation);
      if (bounds.minimum > bounds.maximum || bounds.maximum === 0) {
        resolution = {
          ...resolution,
          frames: remaining,
          bindings: {
            ...resolution.bindings,
            ...(effect.bindResultAs ? { [effect.bindResultAs]: [] } : {}),
            "modifiedResult:counters-removed": 0,
          },
        };
        continue;
      }
      const playerId = choosingPlayers[0]!;
      const operation = destination
        ? ({ kind: "move", destinationId: destination.id } as const)
        : ({ kind: "remove" } as const);
      const suspended: GrandArchiveEffectResolution = {
        ...resolution,
        frames: remaining,
        pendingCounterAllocation: {
          playerId,
          counter,
          candidates,
          minimum: bounds.minimum,
          maximum: bounds.maximum,
          ...(effect.bindResultAs ? { bindResultAs: effect.bindResultAs } : {}),
          operation,
        },
      };
      const transaction = kernel.transact(current, [
        {
          type: "effect-resolution-suspended",
          resolution: suspended,
          cause: { kind: "stack-item", stackItemId: item.id },
        },
        {
          type: "decision-created",
          decision: {
            id: grandArchiveDecisionId(`decision-${current.nextDecisionOrdinal}`),
            kind: "resolve-counter-allocation",
            playerId,
            stackItemId: item.id,
            counter,
            candidates,
            minimum: bounds.minimum,
            maximum: bounds.maximum,
            ...(operation.kind === "move"
              ? { operation: "move" as const, destinationId: operation.destinationId }
              : { operation: "remove" as const }),
            stateVersion: current.stateVersion,
          },
          cause: { kind: "stack-item", stackItemId: item.id },
        },
      ]);
      events.push(...transaction.result.events);
      return {
        state: transaction.state,
        events,
        resolvedItem: item,
        fizzled: false,
        paused: true,
        triggerEvents: [],
      };
    }
    if (effect.kind === "distribute") {
      const amount = evaluateGrandArchiveAmount(effect.amount, evaluation);
      if (!Number.isSafeInteger(amount) || amount < 0) {
        throw new Error("A distributed amount must be a non-negative safe integer");
      }
      if (amount === 0) {
        resolution = { ...resolution, frames: remaining };
        continue;
      }
      if (effect.among.method === "random" || effect.among.random === true) {
        throw new GrandArchiveUnsupportedRuleError("random distribution recipients");
      }
      const choosingPlayers = resolveGrandArchivePlayers(effect.among.chooser, evaluation);
      if (choosingPlayers.length !== 1) {
        throw new GrandArchiveUnsupportedRuleError(
          "distribution requires exactly one allocating player",
        );
      }
      const playerId = choosingPlayers[0]!;
      const suspended: GrandArchiveEffectResolution = {
        ...resolution,
        frames: remaining,
        pendingDistribution: {
          playerId,
          amount,
          among: effect.among,
          payload: effect.payload,
        },
      };
      const transaction = kernel.transact(current, [
        {
          type: "effect-resolution-suspended",
          resolution: suspended,
          cause: { kind: "stack-item", stackItemId: item.id },
        },
        {
          type: "decision-created",
          decision: {
            id: grandArchiveDecisionId(`decision-${current.nextDecisionOrdinal}`),
            kind: "resolve-distribution",
            playerId,
            stackItemId: item.id,
            amount,
            among: effect.among,
            payload: effect.payload,
            stateVersion: current.stateVersion,
          },
          cause: { kind: "stack-item", stackItemId: item.id },
        },
      ]);
      events.push(...transaction.result.events);
      return {
        state: transaction.state,
        events,
        resolvedItem: item,
        fizzled: false,
        paused: true,
        triggerEvents: [],
      };
    }
    if (effect.kind === "move") {
      const placement = effect.destination.placement;
      if ((placement?.kind === "top" || placement?.kind === "bottom") && placement.orderChosenBy) {
        if (placement.order) {
          throw new GrandArchiveUnsupportedRuleError("move order cannot be both chosen and random");
        }
        const objects = resolveGrandArchiveSubjectObjects(effect.subject, evaluation).filter(
          (object) => !effect.from || object.zone === effect.from,
        );
        if (objects.length > 1) {
          let ordinal = 0;
          while (
            `ordered-move-candidates-${ordinal}` in resolution.bindings ||
            `ordered-move-result-${ordinal}` in resolution.bindings
          )
            ordinal++;
          const candidatesBinding = `ordered-move-candidates-${ordinal}`;
          const resultBinding = `ordered-move-result-${ordinal}`;
          const { orderChosenBy, ...orderedPlacement } = placement;
          resolution = {
            ...resolution,
            bindings: {
              ...resolution.bindings,
              [candidatesBinding]: objects.map((object) => object.id),
            },
            frames: prependFrames(
              [
                {
                  kind: "effect",
                  effect: {
                    kind: "choose",
                    selection: {
                      id: resultBinding,
                      kind: "choice",
                      declared: "resolution",
                      chooser: orderChosenBy,
                      count: { kind: "all" },
                      ordered: true,
                      candidates: { kind: "card", binding: candidatesBinding },
                    },
                    effect: {
                      ...effect,
                      subject: { kind: "bound", binding: resultBinding },
                      destination: { ...effect.destination, placement: orderedPlacement },
                    },
                  },
                },
              ],
              remaining,
            ),
          };
          continue;
        }
      }
    }
    if (effect.kind === "move-partition") {
      const choosingPlayers = resolveGrandArchivePlayers(effect.chooser, evaluation);
      if (choosingPlayers.length !== 1) {
        throw new GrandArchiveUnsupportedRuleError(
          "move partition requires exactly one choosing player",
        );
      }
      const objectIds = resolveGrandArchiveSubjectObjects(effect.subject, evaluation).map(
        (object) => object.id,
      );
      if (objectIds.length === 0) {
        resolution = { ...resolution, frames: remaining };
        continue;
      }
      const playerId = choosingPlayers[0]!;
      const suspended: GrandArchiveEffectResolution = {
        ...resolution,
        frames: remaining,
        pendingMovePartition: {
          playerId,
          objectIds,
          destinations: effect.destinations,
        },
      };
      const transaction = kernel.transact(current, [
        {
          type: "effect-resolution-suspended",
          resolution: suspended,
          cause: { kind: "stack-item", stackItemId: item.id },
        },
        {
          type: "decision-created",
          decision: {
            id: grandArchiveDecisionId(`decision-${current.nextDecisionOrdinal}`),
            kind: "resolve-move-partition",
            playerId,
            stackItemId: item.id,
            objectIds,
            destinations: effect.destinations,
            stateVersion: current.stateVersion,
          },
          cause: { kind: "stack-item", stackItemId: item.id },
        },
      ]);
      events.push(...transaction.result.events);
      return {
        state: transaction.state,
        events,
        resolvedItem: item,
        fizzled: false,
        paused: true,
        triggerEvents: [],
      };
    }
    if (effect.kind === "pay" || effect.kind === "pay-cost" || effect.kind === "unless-paid") {
      const payingPlayers = resolveGrandArchivePlayers(effect.player, evaluation);
      if (
        payingPlayers.length === 0 ||
        (effect.kind !== "unless-paid" && payingPlayers.length !== 1)
      ) {
        throw new GrandArchiveUnsupportedRuleError("effect payment requires exactly one player");
      }
      const mayDecline = effect.kind === "unless-paid";
      const paymentCost = snapshotEffectPaymentCost(effect.cost, evaluation);
      const suspended: GrandArchiveEffectResolution = {
        ...resolution,
        frames: remaining,
        pendingPayment: {
          playerId: payingPlayers[0]!,
          ...(payingPlayers.length > 1 ? { remainingPlayerIds: payingPlayers.slice(1) } : {}),
          cost: paymentCost,
          mayDecline,
          ...(effect.kind === "pay" && effect.then ? { afterPaid: effect.then } : {}),
          ...(effect.kind === "unless-paid" ? { afterDeclined: effect.otherwise } : {}),
        },
      };
      const transaction = kernel.transact(current, [
        {
          type: "effect-resolution-suspended",
          resolution: suspended,
          cause: { kind: "stack-item", stackItemId: item.id },
        },
        {
          type: "decision-created",
          decision: {
            id: grandArchiveDecisionId(`decision-${current.nextDecisionOrdinal}`),
            kind: "resolve-effect-payment",
            playerId: payingPlayers[0]!,
            stackItemId: item.id,
            cost: paymentCost,
            mayDecline,
            stateVersion: current.stateVersion,
          },
          cause: { kind: "stack-item", stackItemId: item.id },
        },
      ]);
      events.push(...transaction.result.events);
      return {
        state: transaction.state,
        events,
        resolvedItem: item,
        fizzled: false,
        paused: true,
        triggerEvents: [],
      };
    }
    if (effect.kind === "retarget" && effect.subject.kind !== "current-attack") {
      const binding =
        effect.subject.kind === "bound"
          ? effect.subject.binding
          : effect.subject.kind === "tracked"
            ? effect.subject.key
            : undefined;
      const bound = binding ? resolution.bindings[binding] : undefined;
      const ids = Array.isArray(bound) ? bound : [];
      const candidates = [...resolution.deferredStackItems, ...current.stack].filter((candidate) =>
        ids.includes(candidate.id),
      );
      if (candidates.length !== 1) {
        throw new GrandArchiveUnsupportedRuleError(
          "retarget requires exactly one bound Effects Stack item",
        );
      }
      const targetItem = candidates[0]!;
      const declarations = targetDeclarationsForItem(targetItem);
      if (declarations.length === 0) {
        resolution = { ...resolution, frames: remaining };
        continue;
      }
      const choosingPlayers = resolveGrandArchivePlayers(effect.chooser, evaluation);
      if (choosingPlayers.length !== 1) {
        throw new GrandArchiveUnsupportedRuleError("retarget requires exactly one chooser");
      }
      const suspended: GrandArchiveEffectResolution = {
        ...resolution,
        frames: remaining,
        pendingRetarget: {
          targetStackItemId: targetItem.id,
          declarations,
        },
      };
      const transaction = kernel.transact(current, [
        {
          type: "effect-resolution-suspended",
          resolution: suspended,
          cause: { kind: "stack-item", stackItemId: item.id },
        },
        {
          type: "decision-created",
          decision: {
            id: grandArchiveDecisionId(`decision-${current.nextDecisionOrdinal}`),
            kind: "retarget-stack-item",
            playerId: choosingPlayers[0]!,
            stackItemId: item.id,
            targetStackItemId: targetItem.id,
            declarations,
            stateVersion: current.stateVersion,
          },
          cause: { kind: "stack-item", stackItemId: item.id },
        },
      ]);
      events.push(...transaction.result.events);
      return {
        state: transaction.state,
        events,
        resolvedItem: item,
        fizzled: false,
        paused: true,
        triggerEvents: [],
      };
    }
    switch (effect.kind) {
      case "sequence":
        resolution = {
          ...resolution,
          frames: prependFrames(effectFrames(effect.effects), remaining),
        };
        continue;
      case "conditional": {
        const branch = evaluateGrandArchiveCondition(effect.condition, evaluation)
          ? effect.then
          : effect.else;
        resolution = {
          ...resolution,
          frames: branch
            ? prependFrames([{ kind: "effect", effect: branch }], remaining)
            : remaining,
        };
        continue;
      }
      case "repeat": {
        const count = Math.max(0, evaluateGrandArchiveAmount(effect.count, evaluation));
        resolution = {
          ...resolution,
          frames: prependFrames(
            Array.from({ length: count }, () => ({
              kind: "effect" as const,
              effect: effect.effect,
            })),
            remaining,
          ),
        };
        continue;
      }
      case "for-each": {
        const frames = resolveGrandArchiveCollection(effect.collection, evaluation).flatMap(
          (object): readonly GrandArchiveResolutionFrame[] => [
            { kind: "set-binding", binding: effect.bindEachAs, value: [object.id] },
            { kind: "effect", effect: effect.effect },
          ],
        );
        resolution = { ...resolution, frames: prependFrames(frames, remaining) };
        continue;
      }
      case "for-each-player": {
        const frames = resolveGrandArchivePlayers(effect.players, evaluation).flatMap(
          (playerId): readonly GrandArchiveResolutionFrame[] => [
            { kind: "set-binding", binding: effect.bindEachAs, value: [playerId] },
            { kind: "effect", effect: effect.effect },
          ],
        );
        resolution = { ...resolution, frames: prependFrames(frames, remaining) };
        continue;
      }
      case "perform-as":
        resolution = {
          ...resolution,
          frames: prependFrames([{ kind: "effect", effect: effect.effect }], remaining),
        };
        continue;
      case "bind-value":
        resolution = {
          ...resolution,
          frames: prependFrames([{ kind: "effect", effect: effect.effect }], remaining),
          bindings: {
            ...resolution.bindings,
            [effect.bindAs]: evaluateGrandArchiveAmount(effect.value, evaluation),
          },
        };
        continue;
      case "branch-on-value": {
        const value = evaluateGrandArchiveAmount(effect.value, evaluation);
        const branch = effect.branches.find((candidate) => {
          const minimum = evaluateGrandArchiveAmount(candidate.minimum, evaluation);
          const maximum = candidate.maximum
            ? evaluateGrandArchiveAmount(candidate.maximum, evaluation)
            : Number.POSITIVE_INFINITY;
          return value >= minimum && value <= maximum;
        });
        resolution = {
          ...resolution,
          frames: branch
            ? prependFrames([{ kind: "effect", effect: branch.effect }], remaining)
            : remaining,
        };
        continue;
      }
      case "random": {
        const random = nextGrandArchiveRandom(current.random);
        const index = Math.min(
          effect.choices.length - 1,
          Math.floor(random.value * effect.choices.length),
        );
        const selected = effect.choices[index]!;
        const transaction = kernel.transact(current, [
          {
            type: "random-state-changed",
            random: random.random,
            cause: { kind: "stack-item", stackItemId: item.id },
          },
        ]);
        current = transaction.state;
        events.push(...transaction.result.events);
        resolution = {
          ...resolution,
          frames: prependFrames([{ kind: "effect", effect: selected }], remaining),
        };
        continue;
      }
      case "select-modes": {
        const modes = resolution.selectedModeIds.map((id) => {
          const mode = effect.modes.find((candidate) => candidate.id === id);
          if (!mode) throw new Error(`Selected mode is not part of this effect: ${id}`);
          return mode;
        });
        resolution = {
          ...resolution,
          frames: prependFrames(modeFrames(modes), remaining),
        };
        continue;
      }
      case "materialize-card": {
        const frames = materializationFrames(effect, evaluation);
        resolution = {
          ...resolution,
          frames: prependFrames(frames, remaining),
        };
        continue;
      }
      case "activate-card": {
        resolution = {
          ...resolution,
          frames: prependFrames(activationFrames(effect, evaluation), remaining),
        };
        continue;
      }
      case "play-card": {
        resolution = {
          ...resolution,
          frames: prependFrames(playFrames(effect, evaluation), remaining),
        };
        continue;
      }
      case "attempt": {
        if (effect.effect.kind === "remove-counter") {
          const counterRemoval = effect.effect;
          const amount = evaluateGrandArchiveAmount(counterRemoval.amount, evaluation);
          const subjects = resolveGrandArchiveSubjectObjects(counterRemoval.subject, evaluation);
          const canRemoveFullAmount =
            amount > 0 &&
            subjects.length > 0 &&
            subjects.every(
              (object) => grandArchiveObjectCounterCount(object, counterRemoval.counter) >= amount,
            );
          if (!canRemoveFullAmount) {
            resolution = {
              ...resolution,
              frames: remaining,
              bindings: { ...resolution.bindings, [effect.bindSucceededAs]: false },
            };
            continue;
          }
        }
        if (effect.effect.kind === "materialize-card") {
          const frames = materializationFrames(effect.effect, evaluation, effect.bindSucceededAs);
          resolution = {
            ...resolution,
            bindings:
              frames.length === 0
                ? { ...resolution.bindings, [effect.bindSucceededAs]: false }
                : resolution.bindings,
            frames: prependFrames(frames, remaining),
          };
          continue;
        }
        resolution = {
          ...resolution,
          bindings: { ...resolution.bindings, [effect.bindSucceededAs]: false },
          frames: prependFrames(
            [
              { kind: "effect", effect: effect.effect },
              {
                kind: "finish-attempt",
                startedEventHistoryIndex: current.eventHistory.length,
                bindSucceededAs: effect.bindSucceededAs,
              },
            ],
            remaining,
          ),
        };
        continue;
      }
      case "keyword-action": {
        if (effect.action === "glimpse") {
          const players = resolveGrandArchivePlayers(effect.player ?? "controller", evaluation);
          if (players.length !== 1) {
            throw new GrandArchiveUnsupportedRuleError(
              "glimpse requires exactly one affected player",
            );
          }
          const amount = Math.max(0, evaluateGrandArchiveAmount(effect.amount ?? 0, evaluation));
          const playerId = players[0]!;
          const glimpseIsForbidden = grandArchivePlayerActionIsForbidden({
            action: "glimpse",
            playerId,
            evaluation: { ...evaluation, controllerId: playerId },
          });
          if (amount === 0 || glimpseIsForbidden) {
            resolution = {
              ...resolution,
              ...(effect.bindResultAs
                ? { bindings: { ...resolution.bindings, [effect.bindResultAs]: [] } }
                : {}),
              frames: remaining,
            };
            continue;
          }
          const cardIds = current.zones[playerId]["main-deck"].slice(0, amount);
          if (cardIds.length === 0) {
            const transaction = kernel.transact(current, [
              {
                type: "keyword-action-performed",
                action: "glimpse",
                playerId,
                objectIds: [],
                cause: { kind: "stack-item", stackItemId: item.id },
              },
            ]);
            current = transaction.state;
            events.push(...transaction.result.events);
            resolution = { ...resolution, frames: remaining };
            continue;
          }
          const suspended: GrandArchiveEffectResolution = {
            ...resolution,
            frames: remaining,
            pendingGlimpse: {
              cardIds,
              ...(effect.bindResultAs ? { bindResultAs: effect.bindResultAs } : {}),
            },
          };
          const transaction = kernel.transact(current, [
            {
              type: "effect-resolution-suspended",
              resolution: suspended,
              cause: { kind: "stack-item", stackItemId: item.id },
            },
            {
              type: "decision-created",
              decision: {
                id: grandArchiveDecisionId(`decision-${current.nextDecisionOrdinal}`),
                kind: "resolve-glimpse",
                playerId,
                stackItemId: item.id,
                cardIds,
                stateVersion: current.stateVersion,
              },
              cause: { kind: "stack-item", stackItemId: item.id },
            },
          ]);
          events.push(...transaction.result.events);
          return {
            state: transaction.state,
            events,
            resolvedItem: item,
            fizzled: false,
            paused: true,
            triggerEvents: [],
          };
        }
        const resultEventHistoryIndex = current.eventHistory.length;
        const modifiedResultMetric = grandArchiveModifiedResultMetricForEffect(effect);
        const entryLinkHostIds = resolvedEntryLinkHostIds(frame, resolution, current);
        const execution = executeGrandArchiveEffect(
          effect,
          {
            ...resolutionContext(program, current, resolution),
            ...(Object.keys(entryLinkHostIds).length > 0 ? { entryLinkHostIds } : {}),
            ...(frame.orderedPrivatePlacementKnowledge
              ? {
                  orderedPrivatePlacementKnowledge: frame.orderedPrivatePlacementKnowledge,
                }
              : {}),
          },
          (effectState, proposedEvents) => {
            const transaction = kernel.transact(effectState, proposedEvents);
            return { state: transaction.state, events: transaction.result.events };
          },
        );
        current = execution.state;
        events.push(...execution.events);
        resolution = {
          ...resolution,
          frames: remaining,
          bindings: execution.bindings,
          deferredStackItems: [...resolution.deferredStackItems, ...execution.deferredStackItems],
        };
        resolution = markPendingAttemptsPerformed(resolution, execution.outcome);
        const integratedPreCommit = integrateGrandArchiveReplacementPreCommit(
          current,
          kernel,
          resolution,
        );
        current = integratedPreCommit.state;
        events.push(...integratedPreCommit.events);
        resolution = integratedPreCommit.resolution;
        const integratedFollowUps = integrateGrandArchiveReplacementFollowUps(
          current,
          kernel,
          resolution,
        );
        current = integratedFollowUps.state;
        events.push(...integratedFollowUps.events);
        resolution = integratedFollowUps.resolution;
        if (current.decision?.kind === "choose-replacement") {
          resolution = {
            ...resolution,
            pendingReplacement: {
              resultEventHistoryIndex,
              ...("bindResultAs" in effect && typeof effect.bindResultAs === "string"
                ? { bindResultAs: effect.bindResultAs }
                : {}),
              ...(modifiedResultMetric ? { resultMetric: modifiedResultMetric } : {}),
            },
          };
          const suspended = kernel.transact(current, [
            {
              type: "effect-resolution-suspended",
              resolution,
              cause: { kind: "stack-item", stackItemId: item.id },
            },
          ]);
          events.push(...suspended.result.events);
          return {
            state: suspended.state,
            events,
            resolvedItem: item,
            fizzled: false,
            paused: true,
            triggerEvents: [],
          };
        }
        continue;
      }
      case "reflexive": {
        resolution = {
          ...resolution,
          frames: prependFrames(
            [
              { kind: "effect", effect: effect.action },
              {
                kind: "finish-reflexive",
                startedEventHistoryIndex: current.eventHistory.length,
                ...(effect.targets ? { targets: effect.targets } : {}),
                ...(effect.cardinality ? { cardinality: effect.cardinality } : {}),
                consequence: effect.consequence,
              },
            ],
            remaining,
          ),
        };
        continue;
      }
      case "optional": {
        const players = resolveGrandArchivePlayers(effect.player, evaluation);
        if (players.length !== 1) {
          throw new GrandArchiveUnsupportedRuleError(
            "optional resolution requires exactly one deciding player",
          );
        }
        if (optionalEffectCannotBeFullyPerformed(effect.effect, evaluation)) {
          resolution = {
            ...resolution,
            frames: effect.otherwise
              ? prependFrames([{ kind: "effect", effect: effect.otherwise }], remaining)
              : remaining,
          };
          continue;
        }
        const suspended: GrandArchiveEffectResolution = {
          ...resolution,
          frames: remaining,
          pendingOptional: {
            effect: effect.effect,
            ...(effect.otherwise ? { otherwise: effect.otherwise } : {}),
          },
        };
        const transaction = kernel.transact(current, [
          {
            type: "effect-resolution-suspended",
            resolution: suspended,
            cause: { kind: "stack-item", stackItemId: item.id },
          },
          {
            type: "decision-created",
            decision: {
              id: grandArchiveDecisionId(`decision-${current.nextDecisionOrdinal}`),
              kind: "resolve-optional-effect",
              playerId: players[0]!,
              stackItemId: item.id,
              stateVersion: current.stateVersion,
            },
            cause: { kind: "stack-item", stackItemId: item.id },
          },
        ]);
        events.push(...transaction.result.events);
        return {
          state: transaction.state,
          events,
          resolvedItem: item,
          fizzled: false,
          paused: true,
          triggerEvents: [],
        };
      }
      case "choose-value": {
        const players = resolveGrandArchivePlayers(effect.selection.chooser, evaluation);
        if (players.length !== 1) {
          throw new GrandArchiveUnsupportedRuleError(
            "tracked characteristic choice requires exactly one deciding player",
          );
        }
        const suspended: GrandArchiveEffectResolution = {
          ...resolution,
          frames: remaining,
          pendingChoice: {
            selection: effect.selection,
            framesAfterChoice: [
              {
                kind: "track-selected-characteristic",
                selectionId: effect.selection.id,
                trackAs: effect.trackAs,
              },
            ],
          },
        };
        const transaction = kernel.transact(current, [
          {
            type: "effect-resolution-suspended",
            resolution: suspended,
            cause: { kind: "stack-item", stackItemId: item.id },
          },
          {
            type: "decision-created",
            decision: {
              id: grandArchiveDecisionId(`decision-${current.nextDecisionOrdinal}`),
              kind: "resolve-effect-choice",
              playerId: players[0]!,
              stackItemId: item.id,
              selection: effect.selection,
              stateVersion: current.stateVersion,
            },
            cause: { kind: "stack-item", stackItemId: item.id },
          },
        ]);
        events.push(...transaction.result.events);
        return {
          state: transaction.state,
          events,
          resolvedItem: item,
          fizzled: false,
          paused: true,
          triggerEvents: [],
        };
      }
      case "reserve":
      case "discard":
      case "banish":
      case "reveal":
      case "look-at":
      case "search": {
        const mayFailToFind = effect.kind === "search" && grandArchiveSearchMayFailToFind(effect);
        const operationPlayerIds = resolveGrandArchivePlayers(effect.player, evaluation);
        if (operationPlayerIds.length === 0) {
          throw new GrandArchiveUnsupportedRuleError(
            `${effect.kind} requires at least one affected player`,
          );
        }
        const choosingPlayers = resolveGrandArchivePlayers(effect.selection.chooser, evaluation);
        const affectedPlayerIds =
          effect.selection.chooser === "each-player" || effect.selection.chooser === "each-opponent"
            ? choosingPlayers
            : operationPlayerIds;
        if (affectedPlayerIds.length === 0) {
          throw new GrandArchiveUnsupportedRuleError(
            `${effect.kind} selection requires at least one participating player`,
          );
        }
        const applicationFrame: GrandArchiveResolutionFrame = {
          kind: "apply-selection",
          selectionId: effect.selection.id,
          operation: effect.kind,
          playerIds: [affectedPlayerIds[0]!, ...affectedPlayerIds.slice(1)],
          ...(effect.kind === "search" && effect.reveal ? { revealSearch: true } : {}),
          ...((effect.kind === "discard" || effect.kind === "banish") && effect.faceDown
            ? { faceDown: true }
            : {}),
          ...(effect.bindResultAs ? { bindResultAs: effect.bindResultAs } : {}),
        };
        if (effect.selection.method === "random" || effect.selection.random === true) {
          const declared =
            effect.selection.chooser === "each-player" ||
            effect.selection.chooser === "each-opponent"
              ? randomlyDeclareGrandArchiveMultiPlayerChoices(
                  effect.selection,
                  choosingPlayers,
                  evaluation,
                )
              : randomlyDeclareGrandArchiveResolutionChoice(effect.selection, evaluation);
          const transaction = kernel.transact(current, [
            {
              type: "random-state-changed",
              random: declared.random,
              cause: { kind: "stack-item", stackItemId: item.id },
            },
          ]);
          current = transaction.state;
          events.push(...transaction.result.events);
          resolution = {
            ...resolution,
            bindings: {
              ...resolution.bindings,
              [effect.selection.id]: declared.binding,
              ...(effect.bindResultAs ? { [effect.bindResultAs]: declared.binding } : {}),
            },
            frames: prependFrames([applicationFrame], remaining),
          };
          continue;
        }
        const determined = deterministicallyDeclareGrandArchiveResolutionChoice(
          effect.selection,
          evaluation,
          mayFailToFind ? { mayFailToFind: true } : {},
        );
        if (determined !== undefined) {
          resolution = {
            ...resolution,
            bindings: {
              ...resolution.bindings,
              [effect.selection.id]: determined,
              ...(effect.bindResultAs ? { [effect.bindResultAs]: determined } : {}),
            },
            frames: prependFrames([applicationFrame], remaining),
          };
          continue;
        }
        const prepared = prepareGrandArchivePlayerChoices(
          effect.selection,
          choosingPlayers,
          evaluation,
          true,
          mayFailToFind ? { mayFailToFind: true } : {},
        );
        if (prepared.kind === "determined") {
          resolution = {
            ...resolution,
            bindings: {
              ...resolution.bindings,
              [effect.selection.id]: prepared.binding,
              ...(effect.bindResultAs ? { [effect.bindResultAs]: prepared.binding } : {}),
            },
            frames: prependFrames([applicationFrame], remaining),
          };
          continue;
        }
        const suspended: GrandArchiveEffectResolution = {
          ...resolution,
          frames: remaining,
          pendingChoice: {
            selection: prepared.selection,
            framesAfterChoice: [applicationFrame],
            ...(effect.bindResultAs ? { bindResultAs: effect.bindResultAs } : {}),
            ...(mayFailToFind ? { mayFailToFind: true } : {}),
            ...(prepared.controllerId ? { controllerId: prepared.controllerId } : {}),
            ...(prepared.simultaneous ? { simultaneous: prepared.simultaneous } : {}),
          },
        };
        const transaction = kernel.transact(current, [
          {
            type: "effect-resolution-suspended",
            resolution: suspended,
            cause: { kind: "stack-item", stackItemId: item.id },
          },
          {
            type: "decision-created",
            decision: {
              id: grandArchiveDecisionId(`decision-${current.nextDecisionOrdinal}`),
              kind: "resolve-effect-choice",
              playerId: prepared.playerId,
              stackItemId: item.id,
              selection: prepared.selection,
              ...(prepared.simultaneous?.publicSelections?.length
                ? { publicSelections: prepared.simultaneous.publicSelections }
                : {}),
              ...(mayFailToFind ? { mayFailToFind: true } : {}),
              stateVersion: current.stateVersion,
            },
            cause: { kind: "stack-item", stackItemId: item.id },
          },
        ]);
        events.push(...transaction.result.events);
        return {
          state: transaction.state,
          events,
          resolvedItem: item,
          fizzled: false,
          paused: true,
          triggerEvents: [],
        };
      }
      case "choose": {
        if (effect.selection.method === "random" || effect.selection.random === true) {
          const declared = randomlyDeclareGrandArchiveResolutionChoice(
            effect.selection,
            evaluation,
          );
          const transaction = kernel.transact(current, [
            {
              type: "random-state-changed",
              random: declared.random,
              cause: { kind: "stack-item", stackItemId: item.id },
            },
          ]);
          current = transaction.state;
          events.push(...transaction.result.events);
          resolution = {
            ...resolution,
            bindings: {
              ...resolution.bindings,
              [effect.selection.id]: declared.binding,
            },
            frames: effect.effect
              ? prependFrames([{ kind: "effect", effect: effect.effect }], remaining)
              : remaining,
          };
          continue;
        }
        const players = resolveGrandArchivePlayers(effect.selection.chooser, evaluation);
        const prepared = prepareGrandArchivePlayerChoices(
          effect.selection,
          players,
          evaluation,
          effect.selection.count.kind === "all",
        );
        if (prepared.kind === "determined") {
          const requiredSelections = players.reduce(
            (total, playerId) =>
              total +
              grandArchiveSelectionCountBounds(effect.selection, {
                ...evaluation,
                ...(players.length > 1 ? { controllerId: playerId } : {}),
              }).minimum,
            0,
          );
          resolution = {
            ...resolution,
            bindings: {
              ...resolution.bindings,
              [effect.selection.id]: prepared.binding,
            },
            // A nested instruction contingent on a mandatory resolution
            // choice cannot run when the choice has no legal selection.
            frames:
              prepared.binding.length >= requiredSelections && effect.effect
                ? prependFrames([{ kind: "effect", effect: effect.effect }], remaining)
                : remaining,
          };
          continue;
        }
        const suspended: GrandArchiveEffectResolution = {
          ...resolution,
          frames: remaining,
          pendingChoice: {
            selection: prepared.selection,
            framesAfterChoice: effect.effect ? [{ kind: "effect", effect: effect.effect }] : [],
            ...(prepared.controllerId ? { controllerId: prepared.controllerId } : {}),
            ...(prepared.simultaneous ? { simultaneous: prepared.simultaneous } : {}),
          },
        };
        const transaction = kernel.transact(current, [
          {
            type: "effect-resolution-suspended",
            resolution: suspended,
            cause: { kind: "stack-item", stackItemId: item.id },
          },
          {
            type: "decision-created",
            decision: {
              id: grandArchiveDecisionId(`decision-${current.nextDecisionOrdinal}`),
              kind: "resolve-effect-choice",
              playerId: prepared.playerId,
              stackItemId: item.id,
              selection: prepared.selection,
              ...(prepared.simultaneous?.publicSelections?.length
                ? { publicSelections: prepared.simultaneous.publicSelections }
                : {}),
              stateVersion: current.stateVersion,
            },
            cause: { kind: "stack-item", stackItemId: item.id },
          },
        ]);
        events.push(...transaction.result.events);
        return {
          state: transaction.state,
          events,
          resolvedItem: item,
          fizzled: false,
          paused: true,
          triggerEvents: [],
        };
      }
      case "summon-one-of": {
        const players = resolveGrandArchivePlayers(effect.chooser, evaluation);
        if (players.length !== 1) {
          throw new GrandArchiveUnsupportedRuleError(
            "summon-one-of requires exactly one deciding player",
          );
        }
        const selectionId = `summon-one-of-${current.nextDecisionOrdinal}`;
        const selection: import("@tcg/grand-archive-types").GrandArchiveResolutionChoice = {
          id: selectionId,
          kind: "choice",
          declared: "resolution",
          chooser: effect.chooser,
          count: { kind: "exactly", amount: 1 },
          candidates: { kind: "option", options: effect.objects },
        };
        const suspended: GrandArchiveEffectResolution = {
          ...resolution,
          frames: remaining,
          pendingChoice: {
            selection,
            framesAfterChoice: [
              {
                kind: "summon-selected-token",
                selectionId,
                controller: effect.controller,
                ...(effect.bindResultAs ? { bindResultAs: effect.bindResultAs } : {}),
              },
            ],
          },
        };
        const transaction = kernel.transact(current, [
          {
            type: "effect-resolution-suspended",
            resolution: suspended,
            cause: { kind: "stack-item", stackItemId: item.id },
          },
          {
            type: "decision-created",
            decision: {
              id: grandArchiveDecisionId(`decision-${current.nextDecisionOrdinal}`),
              kind: "resolve-effect-choice",
              playerId: players[0]!,
              stackItemId: item.id,
              selection,
              stateVersion: current.stateVersion,
            },
            cause: { kind: "stack-item", stackItemId: item.id },
          },
        ]);
        events.push(...transaction.result.events);
        return {
          state: transaction.state,
          events,
          resolvedItem: item,
          fizzled: false,
          paused: true,
          triggerEvents: [],
        };
      }
      case "generate-selected": {
        const choosers = resolveGrandArchivePlayers(effect.selection.chooser, evaluation);
        const generators = resolveGrandArchivePlayers(effect.player, evaluation);
        if (choosers.length !== 1 || generators.length !== 1) {
          throw new GrandArchiveUnsupportedRuleError(
            "generate-selected requires exactly one deciding and generating player",
          );
        }
        const selection = generationLegalSelection(effect.selection, generators[0]!, evaluation);
        const suspended: GrandArchiveEffectResolution = {
          ...resolution,
          frames: remaining,
          pendingChoice: {
            selection,
            framesAfterChoice: [
              {
                kind: "generate-selected-cards",
                selectionId: selection.id,
                player: effect.player,
                destination: effect.destination,
              },
            ],
          },
        };
        const transaction = kernel.transact(current, [
          {
            type: "effect-resolution-suspended",
            resolution: suspended,
            cause: { kind: "stack-item", stackItemId: item.id },
          },
          {
            type: "decision-created",
            decision: {
              id: grandArchiveDecisionId(`decision-${current.nextDecisionOrdinal}`),
              kind: "resolve-effect-choice",
              playerId: choosers[0]!,
              stackItemId: item.id,
              selection,
              stateVersion: current.stateVersion,
            },
            cause: { kind: "stack-item", stackItemId: item.id },
          },
        ]);
        events.push(...transaction.result.events);
        return {
          state: transaction.state,
          events,
          resolvedItem: item,
          fizzled: false,
          paused: true,
          triggerEvents: [],
        };
      }
      default: {
        const resultEventHistoryIndex = current.eventHistory.length;
        const modifiedResultMetric = grandArchiveModifiedResultMetricForEffect(effect);
        const entryLinkHostIds = resolvedEntryLinkHostIds(frame, resolution, current);
        const execution = executeGrandArchiveEffect(
          effect,
          {
            ...resolutionContext(program, current, resolution),
            ...(Object.keys(entryLinkHostIds).length > 0 ? { entryLinkHostIds } : {}),
          },
          (effectState, proposedEvents) => {
            const transaction = kernel.transact(effectState, proposedEvents);
            return { state: transaction.state, events: transaction.result.events };
          },
        );
        current = execution.state;
        events.push(...execution.events);
        resolution = {
          ...resolution,
          frames: prependFrames(
            [
              ...copiedItemModeFrames(effect, execution.deferredStackItems),
              ...copiedItemRetargetFrames(effect, execution.deferredStackItems, item),
            ],
            remaining,
          ),
          bindings: execution.bindings,
          deferredStackItems: [...resolution.deferredStackItems, ...execution.deferredStackItems],
        };
        resolution = markPendingAttemptsPerformed(resolution, execution.outcome);
        const integratedPreCommit = integrateGrandArchiveReplacementPreCommit(
          current,
          kernel,
          resolution,
        );
        current = integratedPreCommit.state;
        events.push(...integratedPreCommit.events);
        resolution = integratedPreCommit.resolution;
        const integratedFollowUps = integrateGrandArchiveReplacementFollowUps(
          current,
          kernel,
          resolution,
        );
        current = integratedFollowUps.state;
        events.push(...integratedFollowUps.events);
        resolution = integratedFollowUps.resolution;
        if (current.decision?.kind === "choose-replacement") {
          resolution = {
            ...resolution,
            pendingReplacement: {
              resultEventHistoryIndex,
              ...("bindResultAs" in effect && typeof effect.bindResultAs === "string"
                ? { bindResultAs: effect.bindResultAs }
                : {}),
              ...(modifiedResultMetric ? { resultMetric: modifiedResultMetric } : {}),
            },
          };
          const suspended = kernel.transact(current, [
            {
              type: "effect-resolution-suspended",
              resolution,
              cause: { kind: "stack-item", stackItemId: item.id },
            },
          ]);
          events.push(...suspended.result.events);
          return {
            state: suspended.state,
            events,
            resolvedItem: item,
            fizzled: false,
            paused: true,
            triggerEvents: [],
          };
        }
      }
    }
  }
  throw new Error("Grand Archive effect resolution exceeded its instruction limit");
}

function integrateGrandArchiveReplacementPreCommit(
  state: GrandArchiveMatchState,
  kernel: GrandArchiveTransactionKernel,
  resolution: GrandArchiveEffectResolution,
): {
  readonly state: GrandArchiveMatchState;
  readonly events: readonly GrandArchiveCommittedEvent[];
  readonly resolution: GrandArchiveEffectResolution;
} {
  const pending = state.replacementPreCommit;
  if (!pending || pending.status !== "pending") return { state, events: [], resolution };
  if (pending.followUp.kind !== "effect") {
    throw new Error(`Critical pre-commit cannot be integrated into a card resolution`);
  }
  const transaction = kernel.transact(state, [
    {
      type: "replacement-pre-commit-started",
      cause: { kind: "rule", rule: "event-processing-effect-entered-resolution" },
    },
  ]);
  return {
    state: transaction.state,
    events: transaction.result.events,
    resolution: {
      ...resolution,
      frames: prependFrames(
        [
          { kind: "replacement-follow-up", followUp: pending.followUp },
          { kind: "resume-replacement-pre-commit" },
        ],
        resolution.frames,
      ),
    },
  };
}

function integrateGrandArchiveReplacementFollowUps(
  state: GrandArchiveMatchState,
  kernel: GrandArchiveTransactionKernel,
  resolution: GrandArchiveEffectResolution,
): {
  readonly state: GrandArchiveMatchState;
  readonly events: readonly GrandArchiveCommittedEvent[];
  readonly resolution: GrandArchiveEffectResolution;
} {
  if (state.replacementFollowUps.length === 0) return { state, events: [], resolution };
  const followUps = state.replacementFollowUps;
  const transaction = kernel.transact(
    state,
    followUps.map(() => ({
      type: "replacement-follow-up-consumed" as const,
      cause: { kind: "rule" as const, rule: "linked-replacement-effect-entered-resolution" },
    })),
  );
  return {
    state: transaction.state,
    events: transaction.result.events,
    resolution: {
      ...resolution,
      frames: prependFrames(
        followUps.map((followUp) => ({ kind: "replacement-follow-up" as const, followUp })),
        resolution.frames,
      ),
    },
  };
}

export function resolveTopGrandArchiveStackItem(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  kernel: GrandArchiveTransactionKernel,
): GrandArchiveStackResolutionResult {
  const item = state.stack.at(-1);
  if (!item) throw new Error("The Effects Stack is empty");
  if (state.resolution) {
    throw new Error("A suspended resolution must be resumed through its decision");
  }
  const prepared = initialResolution(program, state, item);
  if (prepared.targetsInvalid) {
    return finishResolution(
      program,
      state,
      kernel,
      item,
      true,
      [],
      prepared.resolution.startedEventHistoryIndex,
      prepared.resolution.deferredStackItems,
    );
  }
  return advanceResolution(program, state, kernel, prepared.resolution);
}

export function resumeGrandArchiveEffectResolution(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  kernel: GrandArchiveTransactionKernel,
  resolution: GrandArchiveEffectResolution,
): GrandArchiveStackResolutionResult {
  if (!resolution.pendingReplacement) {
    return advanceResolution(program, state, kernel, resolution);
  }
  const pending = resolution.pendingReplacement;
  const { pendingReplacement: _pendingReplacement, ...baseResolution } = resolution;
  const resultEvents = state.eventHistory.slice(pending.resultEventHistoryIndex);
  const resultObjectIds = committedResultObjectIds(resultEvents);
  const substitutedBindings = applyGrandArchiveReferenceSubstitutions(
    resolution.bindings,
    resultEvents,
  );
  const counterRemoval = committedCounterRemovalResult(resultEvents);
  const resumedResolution: GrandArchiveEffectResolution = {
    ...baseResolution,
    bindings: {
      ...substitutedBindings,
      ...(pending.bindResultAs ? { [pending.bindResultAs]: resultObjectIds } : {}),
      ...(pending.counterRemovalBinding
        ? { [pending.counterRemovalBinding]: counterRemoval.objectIds }
        : {}),
      ...(pending.resultMetric
        ? {
            [grandArchiveModifiedResultBinding(pending.resultMetric)]:
              grandArchiveModifiedResultAmount(pending.resultMetric, resultEvents),
          }
        : {}),
    },
  };
  const integratedPreCommit = integrateGrandArchiveReplacementPreCommit(
    state,
    kernel,
    resumedResolution,
  );
  const integratedFollowUps = integrateGrandArchiveReplacementFollowUps(
    integratedPreCommit.state,
    kernel,
    integratedPreCommit.resolution,
  );
  const result = advanceResolution(
    program,
    integratedFollowUps.state,
    kernel,
    integratedFollowUps.resolution,
  );
  return {
    ...result,
    events: [...integratedPreCommit.events, ...integratedFollowUps.events, ...result.events],
  };
}

function assertNever(value: never): never {
  throw new Error(`Unhandled Grand Archive resolution variant: ${JSON.stringify(value)}`);
}
