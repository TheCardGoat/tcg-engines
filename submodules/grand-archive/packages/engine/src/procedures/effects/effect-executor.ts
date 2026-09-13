import type {
  GrandArchiveEffect,
  GrandArchiveMoveDestination,
  GrandArchivePlayerSet,
} from "@tcg/grand-archive-types";
import { grandArchiveObjectActiveAbilities } from "../../rules/abilities/intrinsic-keywords.ts";
import { grandArchiveObjectFace } from "../../game/card-runtime.ts";
import {
  deriveGrandArchiveCharacteristics,
  grandArchiveObjectCurrentCharacteristics,
} from "../../rules/state/continuous.ts";
import {
  isGrandArchiveTargetCandidate,
  randomlyDeclareGrandArchiveResolutionChoice,
} from "../activation/activation.ts";
import type {
  GrandArchiveCommittedEvent,
  GrandArchiveOrderedPrivatePlacementKnowledge,
  GrandArchiveProposedEvent,
} from "../../kernel/events.ts";
import { proposeGrandArchiveAttackRedirection } from "../combat/combat.ts";
import {
  evaluateGrandArchiveAmount,
  evaluateGrandArchiveCondition,
  grandArchiveCounterKey,
  grandArchiveObjectCounterCount,
  matchesGrandArchiveCardFilter,
  resolveGrandArchiveCollection,
  resolveGrandArchivePlayers,
  resolveGrandArchiveSubjectObjects,
  GrandArchiveUnsupportedRuleError,
  type GrandArchiveEvaluationContext,
  type GrandArchiveExecutionBinding,
} from "./evaluation.ts";
import {
  grandArchiveGameEventId,
  grandArchiveObjectId,
  grandArchiveStackItemId,
} from "../../game/identity.ts";
import type {
  GrandArchiveObjectId,
  GrandArchivePlayerId,
  GrandArchiveStackItemId,
} from "../../game/identity.ts";
import { createGrandArchiveDelayedTrigger } from "../../rules/abilities/delayed-triggers.ts";
import { anchorGrandArchiveDuration } from "../../rules/state/durations.ts";
import { requireGrandArchiveCard } from "../../kernel/match-program.ts";
import {
  grandArchiveMasteryDefinition,
  grandArchiveMasteryCounterCount,
  grandArchivePlayerMastery,
} from "../../game/mastery.ts";
import { grandArchiveLinkChoiceCandidates } from "../../game/link.ts";
import type {
  GrandArchiveCardInstance,
  GrandArchiveMatchState,
  GrandArchiveStackItem,
} from "../../game/model.ts";
import {
  grandArchiveModifiedResultAmount,
  grandArchiveModifiedResultBinding,
  grandArchiveModifiedResultMetricForEffect,
} from "../../kernel/modified-results.ts";
import {
  grandArchivePlayerHasState,
  grandArchivePlayerStateStorageKey,
} from "../../rules/state/player-continuous.ts";
import {
  grandArchiveObjectHasState,
  grandArchiveStateUsesActivationProperty,
} from "../../game/object-state.ts";
import { rollGrandArchiveDice, shuffleGrandArchiveObjects } from "../../game/random.ts";
import { applyGrandArchiveReferenceSubstitutions } from "../../kernel/reference-substitution.ts";
import {
  collectGrandArchiveActionRules,
  collectGrandArchivePlayerActionRules,
  grandArchiveActionIsForbidden,
  grandArchivePlayerActionIsForbidden,
  grandArchiveRemainingPlayerActionAllowance,
} from "../../rules/state/rule-modifications.ts";
import { collectGrandArchiveNamedTriggeredAbilityEvents } from "../../rules/abilities/triggers.ts";
import { grandArchivePlayerZoneObjectIds } from "../../game/zone-ownership.ts";
import { GRAND_ARCHIVE_PRIVATE_ZONES } from "../../game/zones.ts";

export interface GrandArchiveEffectCommitResult {
  readonly state: GrandArchiveMatchState;
  readonly events: readonly GrandArchiveCommittedEvent[];
}

export type GrandArchiveEffectCommit = (
  state: GrandArchiveMatchState,
  events: readonly GrandArchiveProposedEvent[],
) => GrandArchiveEffectCommitResult;

export interface GrandArchiveEffectExecutionInput extends Omit<
  GrandArchiveEvaluationContext,
  "state"
> {
  readonly state: GrandArchiveMatchState;
  /** Per-object hosts already chosen for simultaneous non-stack field entries. */
  readonly entryLinkHostIds?: Readonly<Record<GrandArchiveObjectId, GrandArchiveObjectId>>;
  /** Incarnations produced by a zone move that this effect precedes. */
  readonly pendingMoveIncarnations?: Readonly<Partial<Record<GrandArchiveObjectId, number>>>;
  /** Privacy retained while a suspended simultaneous private placement resumes. */
  readonly orderedPrivatePlacementKnowledge?: GrandArchiveOrderedPrivatePlacementKnowledge;
}

export interface GrandArchiveEffectExecutionResult {
  readonly state: GrandArchiveMatchState;
  readonly events: readonly GrandArchiveCommittedEvent[];
  readonly bindings: Readonly<Record<string, GrandArchiveExecutionBinding>>;
  /** Whether the instructed action was performed, independent of its replaced outcome. */
  readonly outcome: "performed" | "not-performed";
  readonly resultObjectIds: readonly GrandArchiveObjectId[];
  /** Stack items created mid-resolution and promoted only after the parent finishes. */
  readonly deferredStackItems: readonly GrandArchiveStackItem[];
}

interface MutableExecution {
  state: GrandArchiveMatchState;
  bindings: Record<string, GrandArchiveExecutionBinding>;
  readonly events: GrandArchiveCommittedEvent[];
  /** Counts proposed actions before replacement effects adjust their outcomes. */
  proposedActionCount: number;
  readonly deferredStackItems: GrandArchiveStackItem[];
  base: Omit<GrandArchiveEffectExecutionInput, "state" | "bindings">;
  readonly commit: GrandArchiveEffectCommit;
}

function boundMasterySource(
  evaluation: GrandArchiveEvaluationContext,
): { readonly playerId: GrandArchivePlayerId; readonly name: string } | undefined {
  const name = evaluation.bindings.masterySourceName;
  if (typeof name !== "string" || !Array.isArray(evaluation.bindings.masterySourcePlayer)) {
    return undefined;
  }
  const players = resolveGrandArchivePlayers({ binding: "masterySourcePlayer" }, evaluation);
  const playerId = players.length === 1 ? players[0] : undefined;
  return playerId && grandArchivePlayerMastery(evaluation.state, playerId, name)
    ? { playerId, name }
    : undefined;
}

function context(execution: MutableExecution): GrandArchiveEvaluationContext {
  return {
    ...execution.base,
    state: execution.state,
    bindings: execution.bindings,
    rollDice: (sides, count) => {
      const rolled = rollGrandArchiveDice(execution.state.random, sides, count);
      commit(execution, [
        {
          type: "random-state-changed",
          random: rolled.random,
          result: { kind: "die-roll", sides, ...rolled.value },
          cause: { kind: "rule", rule: "die-roll-effect" },
        },
      ]);
      return rolled.value.total;
    },
  };
}

function commit(execution: MutableExecution, events: readonly GrandArchiveProposedEvent[]): void {
  if (events.length === 0) return;
  execution.proposedActionCount += 1;
  const gameEventId = grandArchiveGameEventId(
    `game-event-${execution.state.nextEventOrdinal}-${execution.proposedActionCount}`,
  );
  const groupedEvents = events.map((event) => {
    const effectEvent =
      event.type === "object-moved" && !event.effectSpecified
        ? { ...event, effectSpecified: true as const }
        : event;
    return effectEvent.gameEventId ? effectEvent : { ...effectEvent, gameEventId };
  });
  const result = execution.commit(execution.state, groupedEvents);
  const sourceMove =
    execution.base.sourceId &&
    execution.base.sourceLkiEventId === undefined &&
    execution.base.sourceIncarnation !== undefined
      ? result.events.find(
          (event) =>
            event.type === "object-moved" &&
            event.objectId === execution.base.sourceId &&
            event.previousObject?.incarnation === execution.base.sourceIncarnation,
        )
      : undefined;
  if (sourceMove?.type === "object-moved" && sourceMove.previousObject) {
    execution.base = {
      ...execution.base,
      sourceIncarnation: sourceMove.previousObject.incarnation + 1,
      sourceLkiEventId: sourceMove.eventId,
    };
  }
  execution.state = result.state;
  execution.bindings = {
    ...applyGrandArchiveReferenceSubstitutions(execution.bindings, result.events),
  };
  execution.events.push(...result.events);
}

function counterChangeEvents(
  effect: Extract<GrandArchiveEffect, { readonly kind: "add-counter" | "remove-counter" }>,
  execution: MutableExecution,
): readonly GrandArchiveProposedEvent[] {
  const evaluation = context(execution);
  const removesAll =
    effect.kind === "remove-counter" &&
    typeof effect.amount === "object" &&
    effect.amount.kind === "all";
  const amountFor = (current: number): number =>
    removesAll ? current : evaluateGrandArchiveAmount(effect.amount, evaluation);
  const counter = grandArchiveCounterKey(effect.counter);
  const sourceMastery =
    effect.subject.kind === "source" ? boundMasterySource(evaluation) : undefined;
  let masteryName: string | undefined;
  let masteryPlayerIds: readonly GrandArchivePlayerId[] = [];
  if (effect.subject.kind === "mastery") {
    masteryName = effect.subject.name;
    masteryPlayerIds = resolveGrandArchivePlayers(effect.subject.player, evaluation);
  } else if (sourceMastery) {
    masteryName = sourceMastery.name;
    masteryPlayerIds = [sourceMastery.playerId];
  }
  if (masteryName) {
    return masteryPlayerIds.flatMap((playerId) => {
      const mastery = grandArchivePlayerMastery(execution.state, playerId, masteryName);
      if (!mastery) return [];
      const current = grandArchiveMasteryCounterCount(
        execution.state,
        playerId,
        mastery.name,
        effect.counter,
      );
      const amount = amountFor(current);
      const delta = effect.kind === "add-counter" ? amount : -amount;
      const exactDelta = delta < 0 && current < Math.abs(delta) ? 0 : delta;
      return exactDelta === 0
        ? []
        : [
            {
              type: "mastery-counter-changed" as const,
              playerId,
              mastery: mastery.name,
              counter,
              delta: exactDelta,
            },
          ];
    });
  }
  return resolveGrandArchiveSubjectObjects(effect.subject, evaluation).flatMap((object) => {
    const current = grandArchiveObjectCounterCount(object, effect.counter);
    const amount = amountFor(current);
    const delta = effect.kind === "add-counter" ? amount : -amount;
    const exactDelta = delta < 0 && current < Math.abs(delta) ? 0 : delta;
    return exactDelta === 0
      ? []
      : [{ type: "counter-changed", objectId: object.id, counter, delta: exactDelta }];
  });
}

function destinationPlacement(
  destination: GrandArchiveMoveDestination,
): "top" | "bottom" | "unordered" {
  const placement = destination.placement;
  if (!placement || placement.kind === "unordered") return "unordered";
  if (placement.kind === "top" || placement.kind === "bottom") return placement.kind;
  throw new GrandArchiveUnsupportedRuleError(`move placement ${placement.kind}`);
}

function moveEvents(
  effect: Extract<GrandArchiveEffect, { readonly kind: "move" }>,
  execution: MutableExecution,
): readonly Extract<GrandArchiveProposedEvent, { readonly type: "object-moved" }>[] {
  const evaluation = context(execution);
  const objects = resolveGrandArchiveSubjectObjects(effect.subject, evaluation);
  if (objects.length === 0) return [];
  const destination = effect.destination;
  const hostSubject =
    destination.zone === "loaded" ||
    destination.zone === "inner-lineage" ||
    destination.zone === "intent"
      ? destination.host
      : destination.zone === "field"
        ? destination.linkTo
        : undefined;
  const hosts = hostSubject ? resolveGrandArchiveSubjectObjects(hostSubject, evaluation) : [];
  if (hostSubject && hosts.length !== 1) {
    throw new GrandArchiveUnsupportedRuleError(
      `hosted move to ${destination.zone} requires exactly one host`,
    );
  }
  const sharedHostId = hosts[0]?.id;
  if (sharedHostId && hosts[0]?.zone !== "field") {
    throw new Error(`The host for a ${destination.zone} move must be an object on the field`);
  }
  const controllerId =
    destination.zone === "field" && destination.controller
      ? resolveSinglePlayer(destination.controller, evaluation)
      : undefined;
  const orderedPrivateDestination =
    (destination.zone === "main-deck" || destination.zone === "material-deck") &&
    (destination.placement?.kind === "top" || destination.placement?.kind === "bottom");
  return objects.flatMap((object) => {
    if (effect.from && object.zone !== effect.from) return [];
    const hostId = execution.base.entryLinkHostIds?.[object.id] ?? sharedHostId;
    if (hostId === object.id) throw new Error("A card cannot host itself");
    if (destination.zone === "field" && !hostId) {
      assertEntryLinkChoiceWasPlanned(
        {
          ...object,
          zone: "field",
          baseControllerId: controllerId ?? object.ownerId,
          controllerId: controllerId ?? object.ownerId,
          hostId: undefined,
        },
        execution,
      );
    }
    return [
      {
        type: "object-moved",
        objectId: object.id,
        from: object.zone,
        to: destination.zone,
        ...(controllerId ? { newControllerId: controllerId } : {}),
        ...(hostId ? { hostId } : {}),
        ...(destination.zone === "banishment" && evaluation.sourceId
          ? { banishedBySourceId: evaluation.sourceId }
          : {}),
        placement: destinationPlacement(destination),
        ...(orderedPrivateDestination && execution.base.orderedPrivatePlacementKnowledge
          ? {
              orderedPrivatePlacementKnowledge: execution.base.orderedPrivatePlacementKnowledge,
            }
          : {}),
        ...(effect.facing ? { entryFacing: effect.facing } : {}),
        ...(destination.zone === "field" && destination.face
          ? { entryFace: destination.face }
          : {}),
        ...(effect.facing === "face-down" ? { revealAtEndOfGame: true as const } : {}),
      },
    ];
  });
}

function resolveSinglePlayer(
  players: GrandArchivePlayerSet,
  evaluation: GrandArchiveEvaluationContext,
): GrandArchivePlayerId {
  const resolved = resolveGrandArchivePlayers(players, evaluation);
  if (resolved.length !== 1)
    throw new GrandArchiveUnsupportedRuleError("effect requires one player");
  return resolved[0]!;
}

function afterResolutionTarget(
  effect: Extract<GrandArchiveEffect, { readonly kind: "after-resolution" }>,
  evaluation: GrandArchiveEvaluationContext,
): GrandArchiveStackItem {
  if (effect.stackItem.kind === "event-subject") {
    const eventStackItems = evaluation.bindings.eventStackItem;
    if (Array.isArray(eventStackItems)) {
      const ids = new Set<string>(eventStackItems);
      const exact = evaluation.state.stack.filter((item) => ids.has(item.id));
      if (exact.length === 1) return exact[0]!;
      if (exact.length > 1) {
        throw new GrandArchiveUnsupportedRuleError(
          "after-resolution event refers to multiple stack items",
        );
      }
    }
  }
  if (evaluation.resolvingStackItemId) {
    const resolving = evaluation.state.stack.find(
      (item) => item.id === evaluation.resolvingStackItemId,
    );
    if (resolving && effect.stackItem.kind === "source") return resolving;
  }
  const objectIds = new Set(
    resolveGrandArchiveSubjectObjects(effect.stackItem, evaluation).map((object) => object.id),
  );
  const matches = evaluation.state.stack.filter(
    (item) =>
      (item.sourceId !== undefined && objectIds.has(item.sourceId)) ||
      ((item.kind === "card-activation" ||
        item.kind === "materialization" ||
        item.kind === "bestowment") &&
        objectIds.has(item.cardId)),
  );
  if (matches.length !== 1) {
    throw new GrandArchiveUnsupportedRuleError(
      `after-resolution requires one stack item, found ${matches.length}`,
    );
  }
  return matches[0]!;
}

function topCards(
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  amount: number,
): readonly GrandArchiveObjectId[] {
  return state.zones[playerId]["main-deck"].slice(0, Math.max(0, amount));
}

function findDefinitionId(
  program: GrandArchiveEvaluationContext["program"],
  identity: string,
): string {
  const direct = program.cardsById[identity];
  if (direct) return direct.canonicalId;
  const matches = Object.values(program.cardsById).filter((card) => {
    const face = card.layout.kind === "single-faced" ? card.layout.face : card.layout.defaultFace;
    return card.slug === identity || face.name === identity;
  });
  if (matches.length !== 1)
    throw new GrandArchiveUnsupportedRuleError(`generated card identity ${identity}`);
  return matches[0]!.canonicalId;
}

function createdObject(
  program: GrandArchiveEvaluationContext["program"],
  definitionId: string,
  ownerId: GrandArchivePlayerId,
  zone: GrandArchiveCardInstance["zone"],
  ordinal: number,
  isToken: boolean,
): GrandArchiveCardInstance {
  requireGrandArchiveCard(program, definitionId);
  const id = grandArchiveObjectId(`object-${ordinal}`);
  return {
    id,
    definitionId,
    isToken,
    ownerId,
    baseControllerId: ownerId,
    controllerId: ownerId,
    zone,
    face: "default",
    facing: (GRAND_ARCHIVE_PRIVATE_ZONES as readonly GrandArchiveCardInstance["zone"][]).includes(
      zone,
    )
      ? "face-down"
      : "face-up",
    states: new Set(),
    activationStates: new Set(),
    activationPayment: [],
    activationBindings: {},
    activationVariables: {},
    cascadeCounts: {},
    counters: ((): Readonly<Record<string, number>> => {
      if (zone !== "field") return {};
      const card = requireGrandArchiveCard(program, definitionId);
      const face = card.layout.kind === "single-faced" ? card.layout.face : card.layout.defaultFace;
      return face.stats.durability === undefined ? {} : { durability: face.stats.durability };
    })(),
    damage: 0,
    incarnation: 1,
    objectVersion: 1,
  };
}

function copiedBaseObject(
  program: GrandArchiveEvaluationContext["program"],
  source: GrandArchiveCardInstance,
  ownerId: GrandArchivePlayerId,
  zone: GrandArchiveCardInstance["zone"],
  ordinal: number,
  isToken: boolean,
  nameOverride?: string,
): GrandArchiveCardInstance {
  const copy: GrandArchiveCardInstance = {
    ...createdObject(
      program,
      source.activeDefinitionId ?? source.definitionId,
      ownerId,
      zone,
      ordinal,
      isToken,
    ),
    face: source.face,
    ...(nameOverride ? { nameOverride } : {}),
    ...(zone === "intent" && source.hostId ? { hostId: source.hostId } : {}),
    copy: {
      sourceObjectId: source.id,
      expires: zone === "intent" ? "end-of-combat" : "when-unassociated",
    },
  };
  if (zone !== "field") return copy;
  const face = grandArchiveObjectFace(program, copy);
  return {
    ...copy,
    counters: face.stats.durability === undefined ? {} : { durability: face.stats.durability },
  };
}

type GrandArchiveObjectCreatingEffect = Extract<
  GrandArchiveEffect,
  { readonly kind: "copy" | "generate" | "keyword-action" | "summon" | "summon-copies" }
>;

const GRAND_ARCHIVE_GATHER_INGREDIENTS = [
  "Blightroot",
  "Fraysia",
  "Manaroot",
  "Razorvine",
  "Silvershine",
  "Springleaf",
] as const;

function createdObjectsForEffect(
  effect: GrandArchiveObjectCreatingEffect,
  evaluation: GrandArchiveEvaluationContext,
): readonly GrandArchiveCardInstance[] {
  switch (effect.kind) {
    case "summon": {
      const players = resolveGrandArchivePlayers(effect.controller, evaluation);
      const amount = effect.amount ? evaluateGrandArchiveAmount(effect.amount, evaluation) : 1;
      const copiedObjects = effect.copyOf
        ? resolveGrandArchiveSubjectObjects(effect.copyOf, evaluation)
        : [];
      if (effect.copyOf && copiedObjects.length !== 1) {
        throw new Error("Summoning a copy requires exactly one copied object");
      }
      const copiedDefinitionId = copiedObjects[0]
        ? (copiedObjects[0].activeDefinitionId ?? copiedObjects[0].definitionId)
        : undefined;
      const namedDefinitionId = effect.object
        ? findDefinitionId(evaluation.program, effect.object)
        : undefined;
      if (!copiedDefinitionId && !namedDefinitionId) {
        throw new Error("Summoning requires a named or copied object");
      }
      const objects: GrandArchiveCardInstance[] = [];
      for (const playerId of players) {
        for (let index = 0; index < amount; index += 1) {
          const definitionId = copiedDefinitionId ?? namedDefinitionId;
          if (!definitionId) throw new Error("Summoned object definition is unavailable");
          const object = copiedObjects[0]
            ? copiedBaseObject(
                evaluation.program,
                copiedObjects[0],
                playerId,
                "field",
                evaluation.state.nextObjectOrdinal + objects.length,
                true,
              )
            : createdObject(
                evaluation.program,
                definitionId,
                playerId,
                "field",
                evaluation.state.nextObjectOrdinal + objects.length,
                true,
              );
          const states = new Set(object.states);
          for (const state of effect.entersWithStates ?? []) states.add(state);
          const counters = { ...object.counters };
          for (const entry of effect.entersWithCounters ?? []) {
            counters[grandArchiveCounterKey(entry.counter)] = evaluateGrandArchiveAmount(
              entry.amount,
              evaluation,
            );
          }
          objects.push({ ...object, states, counters });
        }
      }
      return objects;
    }
    case "summon-copies": {
      const players = resolveGrandArchivePlayers(effect.controller, evaluation);
      const copiedObjects = resolveGrandArchiveSubjectObjects(effect.subjects, evaluation);
      const objects: GrandArchiveCardInstance[] = [];
      for (const playerId of players) {
        for (const copiedObject of copiedObjects) {
          objects.push(
            copiedBaseObject(
              evaluation.program,
              copiedObject,
              playerId,
              "field",
              evaluation.state.nextObjectOrdinal + objects.length,
              true,
            ),
          );
        }
      }
      return objects;
    }
    case "generate": {
      const playerId = resolveSinglePlayer(effect.player, evaluation);
      const amount = effect.amount ? evaluateGrandArchiveAmount(effect.amount, evaluation) : 1;
      if (!Number.isSafeInteger(amount) || amount < 0) {
        throw new GrandArchiveUnsupportedRuleError(
          "generate amount must be a non-negative integer",
        );
      }
      const requestedDestination = effect.destination?.zone ?? "hand";
      if (requestedDestination === "intent") {
        throw new GrandArchiveUnsupportedRuleError("generate to intent");
      }
      let destination = requestedDestination;
      const destinationHost =
        effect.destination &&
        (effect.destination.zone === "loaded" || effect.destination.zone === "inner-lineage")
          ? (() => {
              const hosts = resolveGrandArchiveSubjectObjects(effect.destination.host, evaluation);
              if (hosts.length > 1) {
                throw new GrandArchiveUnsupportedRuleError(
                  `generate to ${effect.destination.zone} cannot resolve more than one host`,
                );
              }
              const host = hosts[0];
              if (!host || host.zone !== "field") {
                destination = "hand";
                return undefined;
              }
              if (
                effect.destination.zone === "inner-lineage" &&
                !grandArchiveObjectCurrentCharacteristics(
                  evaluation.program,
                  evaluation.state,
                  host,
                ).types.includes("CHAMPION")
              ) {
                destination = "hand";
                return undefined;
              }
              return host;
            })()
          : undefined;
      const definitionId = findDefinitionId(evaluation.program, effect.card);
      if (
        amount === 0 ||
        grandArchivePlayerActionIsForbidden({
          action: "generate",
          playerId,
          candidateDefinitionId: definitionId,
          evaluation: { ...evaluation, controllerId: playerId },
        })
      ) {
        return [];
      }
      return Array.from({ length: amount }, (_, index) => {
        const object = createdObject(
          evaluation.program,
          definitionId,
          playerId,
          destination,
          evaluation.state.nextObjectOrdinal + index,
          false,
        );
        return destinationHost ? { ...object, hostId: destinationHost.id } : object;
      });
    }
    case "copy": {
      if (effect.copy !== "object") return [];
      const amount = Math.max(0, evaluateGrandArchiveAmount(effect.amount ?? 1, evaluation));
      const sources = resolveGrandArchiveSubjectObjects(effect.subject, evaluation);
      return sources.flatMap((source, sourceIndex) =>
        Array.from({ length: amount }, (_, copyIndex) => {
          const ordinal = evaluation.state.nextObjectOrdinal + sourceIndex * amount + copyIndex;
          return copiedBaseObject(
            evaluation.program,
            source,
            evaluation.controllerId,
            source.zone,
            ordinal,
            source.zone === "field",
            effect.exceptName,
          );
        }),
      );
    }
    case "keyword-action": {
      if (effect.action !== "gather") return [];
      const playerIds = resolveGrandArchivePlayers(effect.player ?? "controller", evaluation);
      if (playerIds.length !== 1) {
        throw new GrandArchiveUnsupportedRuleError("gather requires exactly one affected player");
      }
      const shuffled = shuffleGrandArchiveObjects(
        GRAND_ARCHIVE_GATHER_INGREDIENTS,
        evaluation.state.random,
      );
      return [
        createdObject(
          evaluation.program,
          findDefinitionId(evaluation.program, shuffled.value[0]!),
          playerIds[0]!,
          "field",
          evaluation.state.nextObjectOrdinal,
          true,
        ),
      ];
    }
  }
}

/** Prospective objects that this atomic effect would create directly on the field. */
export function grandArchiveEffectFieldEntryObjects(
  effect: GrandArchiveEffect,
  evaluation: GrandArchiveEvaluationContext,
): readonly GrandArchiveCardInstance[] {
  switch (effect.kind) {
    case "copy":
    case "generate":
    case "keyword-action":
    case "summon":
    case "summon-copies":
      return createdObjectsForEffect(effect, evaluation).filter(
        (object) => object.zone === "field",
      );
    default:
      return [];
  }
}

function applyEntryLinkHost(
  object: GrandArchiveCardInstance,
  execution: MutableExecution,
): GrandArchiveCardInstance {
  const hostId = execution.base.entryLinkHostIds?.[object.id];
  if (hostId) return { ...object, hostId };
  assertEntryLinkChoiceWasPlanned(object, execution);
  return object;
}

function assertEntryLinkChoiceWasPlanned(
  object: GrandArchiveCardInstance,
  execution: MutableExecution,
): void {
  const candidates = grandArchiveLinkChoiceCandidates(
    execution.base.program,
    execution.state,
    object,
  );
  if (!candidates) return;
  const declaration = {
    id: "intrinsic-link-entry-preflight",
    kind: "target",
    declared: "announcement",
    chooser: "controller",
    count: { kind: "exactly", amount: 1 },
    candidates,
  } as const satisfies import("@tcg/grand-archive-types").GrandArchiveTargetDeclaration;
  const evaluation: GrandArchiveEvaluationContext = {
    ...context(execution),
    controllerId: object.controllerId,
    sourceId: object.id,
    abilityBearerId: object.id,
  };
  const hasLegalCandidate = Object.values(execution.state.objects).some(
    (candidate) =>
      candidate.id !== object.id &&
      isGrandArchiveTargetCandidate(candidate.id, declaration, evaluation),
  );
  if (hasLegalCandidate) {
    throw new GrandArchiveUnsupportedRuleError("interactive non-stack Link entry");
  }
}

function tokenSummonEvents(
  objects: readonly GrandArchiveCardInstance[],
): readonly GrandArchiveProposedEvent[] {
  const byController = new Map<GrandArchivePlayerId, GrandArchiveCardInstance[]>();
  for (const object of objects) {
    if (!object.isToken || object.zone !== "field") {
      throw new Error("A Summon effect must create token objects on the field");
    }
    const group = byController.get(object.controllerId) ?? [];
    group.push(object);
    byController.set(object.controllerId, group);
  }
  return [...byController].map(([playerId, group]) => {
    const first = group[0];
    if (!first) throw new Error("A token summon batch cannot be empty");
    return {
      type: "tokens-summoned" as const,
      playerId,
      objects: [first, ...group.slice(1)] as const,
      actorId: playerId,
      cause: { kind: "rule" as const, rule: "summon-effect" },
    };
  });
}

function boundStackItems(
  binding: string,
  execution: MutableExecution,
): readonly GrandArchiveStackItem[] {
  const value = execution.bindings[binding];
  if (!Array.isArray(value)) return [];
  return value.flatMap((id) => {
    const item = execution.state.stack.find((candidate) => candidate.id === id);
    return item ? [item] : [];
  });
}

function subjectStackItems(
  subject: import("@tcg/grand-archive-types").GrandArchiveSubject,
  execution: MutableExecution,
): readonly GrandArchiveStackItem[] {
  switch (subject.kind) {
    case "bound":
      return boundStackItems(subject.binding, execution);
    case "tracked":
      return boundStackItems(subject.key, execution);
    case "event-subject":
      return boundStackItems("eventStackItem", execution);
    default:
      return [];
  }
}

function copyCardForStackItem(
  original: Extract<
    GrandArchiveStackItem,
    { readonly kind: "card-activation" | "materialization" | "bestowment" }
  >,
  objectOrdinal: number,
  execution: MutableExecution,
): GrandArchiveCardInstance {
  const sourceCard = execution.state.objects[original.cardId];
  if (!sourceCard) {
    throw new GrandArchiveUnsupportedRuleError("copy card activation without source card");
  }
  const definitionId = sourceCard.activeDefinitionId ?? sourceCard.definitionId;
  const characteristics = grandArchiveObjectCurrentCharacteristics(
    execution.base.program,
    execution.state,
    sourceCard,
  );
  return {
    ...createdObject(
      execution.base.program,
      definitionId,
      execution.base.controllerId,
      "effects-stack",
      objectOrdinal,
      false,
    ),
    face: sourceCard.face,
    copy: {
      sourceObjectId: sourceCard.copy?.sourceObjectId ?? sourceCard.id,
      expires: characteristics.types.includes("ATTACK") ? "end-of-combat" : "when-unassociated",
    },
  };
}

function copiedStackItem(
  original: GrandArchiveStackItem,
  copyKind: "ability" | "card-activation" | "materialization",
  id: GrandArchiveStackItemId,
  copiedCardId: GrandArchiveObjectId | undefined,
  execution: MutableExecution,
): GrandArchiveStackItem {
  if (copyKind === "ability") {
    if (original.kind !== "activated-ability" && original.kind !== "triggered-ability") {
      throw new GrandArchiveUnsupportedRuleError(`copy ability from ${original.kind}`);
    }
    const { scheduledAfterResolutionItems: _externalConsequences, ...copyableOriginal } = original;
    return {
      ...copyableOriginal,
      id,
      controllerId: execution.base.controllerId,
      createdAtVersion: execution.state.stateVersion,
      isCopy: true,
      negated: false,
      opportunityPolicy: "normal",
    };
  }
  if (!copiedCardId) throw new Error("A copied card stack item requires a copied card identity");
  if (copyKind === "card-activation") {
    if (original.kind !== "card-activation") {
      throw new GrandArchiveUnsupportedRuleError(`copy card activation from ${original.kind}`);
    }
    const { scheduledAfterResolutionItems: _externalConsequences, ...copyableOriginal } = original;
    return {
      ...copyableOriginal,
      id,
      cardId: copiedCardId,
      sourceId: copiedCardId,
      controllerId: execution.base.controllerId,
      createdAtVersion: execution.state.stateVersion,
      isCopy: true,
      negated: false,
      // Copy rules preserve the activation's properties and characteristics;
      // an Interdiction copy therefore suppresses Opportunity independently.
      opportunityPolicy: original.opportunityPolicy,
    };
  }
  if (original.kind !== "materialization") {
    throw new GrandArchiveUnsupportedRuleError(`copy materialization from ${original.kind}`);
  }
  const { scheduledAfterResolutionItems: _externalConsequences, ...copyableOriginal } = original;
  return {
    ...copyableOriginal,
    id,
    cardId: copiedCardId,
    sourceId: copiedCardId,
    controllerId: execution.base.controllerId,
    createdAtVersion: execution.state.stateVersion,
    isCopy: true,
    negated: false,
    opportunityPolicy: "normal",
  };
}

function negateStackItems(
  items: readonly GrandArchiveStackItem[],
  execution: MutableExecution,
): readonly GrandArchiveStackItem[] {
  const unique = [
    ...new Map(
      items
        .filter(
          (item) =>
            item.id !== execution.base.resolvingStackItemId &&
            execution.state.stack.some((candidate) => candidate.id === item.id) &&
            !stackItemNegationIsForbidden(item, execution),
        )
        .map((item) => [item.id, item]),
    ).values(),
  ];
  commit(
    execution,
    unique.map((item) => ({
      type: "stack-item-negated" as const,
      item: { ...item, negated: true },
      actorId: execution.base.controllerId,
      cause: { kind: "rule" as const, rule: "negate-effect" },
    })),
  );
  return unique;
}

function stackItemNegationIsForbidden(
  item: GrandArchiveStackItem,
  execution: MutableExecution,
): boolean {
  const targetId = item.sourceId ?? ("cardId" in item ? item.cardId : undefined);
  if (!targetId) return false;
  const target = execution.state.objects[targetId];
  if (!target) return false;
  return collectGrandArchiveActionRules({
    action: "negate",
    activationKind:
      item.kind === "card-activation" ||
      item.kind === "materialization" ||
      item.kind === "bestowment"
        ? "card"
        : "ability",
    playerId: execution.base.controllerId,
    subjectPlayerId: item.controllerId,
    candidateId: target.id,
    stackItemId: item.id,
    fromZone: target.zone,
    againstIds: [target.id],
    evaluation: {
      ...context(execution),
      candidateId: target.id,
    },
  }).some((rule) => rule.effect.mode === "forbid");
}

function triggerObservesEvent(
  trigger: import("@tcg/grand-archive-types").GrandArchiveTrigger,
  eventName: import("@tcg/grand-archive-types").GrandArchiveObservableEventName,
): boolean {
  if (trigger.kind !== "event") return false;
  return "anyOf" in trigger.event
    ? trigger.event.anyOf.some((event) => event.name === eventName)
    : trigger.event.name === eventName;
}

function executeRandomSelection(
  effect: Extract<
    GrandArchiveEffect,
    {
      readonly kind: "reserve" | "discard" | "banish" | "reveal" | "look-at" | "search";
    }
  >,
  execution: MutableExecution,
): boolean {
  if (effect.selection.method !== "random" && effect.selection.random !== true) {
    throw new GrandArchiveUnsupportedRuleError(`${effect.kind} outside stack resolution`);
  }
  const evaluation = context(execution);
  const playerIds = resolveGrandArchivePlayers(effect.player, evaluation);
  if (playerIds.length !== 1) {
    throw new GrandArchiveUnsupportedRuleError(
      `${effect.kind} requires exactly one affected player`,
    );
  }
  const playerId = playerIds[0]!;
  const declared = randomlyDeclareGrandArchiveResolutionChoice(effect.selection, evaluation);
  if (!Array.isArray(declared.binding)) {
    throw new GrandArchiveUnsupportedRuleError(`random ${effect.kind} object selection`);
  }
  const selectedObjects = declared.binding.flatMap((objectId) => {
    const object = execution.state.objects[objectId];
    return object ? [object] : [];
  });
  const events: GrandArchiveProposedEvent[] = [
    {
      type: "random-state-changed",
      random: declared.random,
      actorId: playerId,
      cause: { kind: "rule", rule: `random-${effect.kind}-selection` },
    },
  ];
  if (effect.kind === "reserve") {
    for (const object of selectedObjects) {
      if (object.zone !== "hand") continue;
      events.push({
        type: "object-moved",
        objectId: object.id,
        from: "hand",
        to: "memory",
        actorId: playerId,
        cause: { kind: "rule", rule: "reserve-effect" },
      });
    }
  } else if (effect.kind === "discard" || effect.kind === "banish") {
    const destination = effect.kind === "discard" ? "graveyard" : "banishment";
    for (const object of selectedObjects) {
      if (object.zone === destination) continue;
      events.push({
        type: "object-moved",
        objectId: object.id,
        from: object.zone,
        to: destination,
        ...(effect.kind === "discard" ? { discarded: true as const } : {}),
        ...(effect.kind === "banish" && execution.base.sourceId
          ? { banishedBySourceId: execution.base.sourceId }
          : {}),
        ...(effect.kind === "banish" && effect.faceDown
          ? { entryFacing: "face-down" as const, revealAtEndOfGame: true as const }
          : {}),
        actorId: playerId,
        cause: { kind: "rule", rule: `${effect.kind}-effect` },
      });
    }
  } else if (effect.kind === "reveal") {
    for (const object of selectedObjects) {
      events.push({
        type: "card-revealed",
        objectId: object.id,
        playerId,
        actorId: playerId,
        cause: { kind: "rule", rule: "reveal-effect" },
      });
    }
  } else if (effect.kind === "look-at") {
    if (selectedObjects.length > 0) {
      events.push({
        type: "cards-looked-at",
        objectIds: selectedObjects.map((object) => object.id),
        playerId,
        actorId: playerId,
        cause: { kind: "rule", rule: "look-at-effect" },
      });
    }
  } else if (effect.kind === "search") {
    events.push({
      type: "cards-searched",
      objectIds: selectedObjects.map((object) => object.id),
      playerId,
      actorId: playerId,
      cause: { kind: "rule", rule: "search-effect" },
    });
    if (effect.reveal) {
      for (const object of selectedObjects) {
        events.push({
          type: "card-revealed",
          objectId: object.id,
          playerId,
          actorId: playerId,
          cause: { kind: "rule", rule: "search-reveal-effect" },
        });
      }
    }
  } else {
    throw new GrandArchiveUnsupportedRuleError(`random selection effect ${effect.kind}`);
  }
  commit(execution, events);
  execution.bindings[effect.selection.id] = declared.binding;
  if (effect.bindResultAs) execution.bindings[effect.bindResultAs] = declared.binding;
  return true;
}

function executeAtomic(effect: GrandArchiveEffect, execution: MutableExecution): boolean {
  const evaluation = context(execution);
  switch (effect.kind) {
    case "no-op":
      return true;
    case "reserve":
    case "discard":
    case "banish":
    case "reveal":
    case "look-at":
    case "search":
      return executeRandomSelection(effect, execution);
    case "choose": {
      if (effect.selection.method !== "random" && effect.selection.random !== true) {
        throw new GrandArchiveUnsupportedRuleError("choice outside stack resolution");
      }
      const declared = randomlyDeclareGrandArchiveResolutionChoice(effect.selection, evaluation);
      commit(execution, [
        {
          type: "random-state-changed",
          random: declared.random,
          actorId: execution.base.controllerId,
          cause: { kind: "rule", rule: "random-choice-effect" },
        },
      ]);
      execution.bindings[effect.selection.id] = declared.binding;
      return effect.effect ? execute(effect.effect, execution) : true;
    }
    case "draw": {
      const amount = evaluateGrandArchiveAmount(effect.amount, evaluation);
      if (!Number.isSafeInteger(amount) || amount < 0) {
        throw new GrandArchiveUnsupportedRuleError("draw amount must be a non-negative integer");
      }
      const destination = effect.to ?? "hand";
      const gameEventId = grandArchiveGameEventId(
        `game-event-${execution.state.nextEventOrdinal}-${execution.proposedActionCount + 1}`,
      );
      for (const playerId of resolveGrandArchivePlayers(effect.player, evaluation)) {
        for (let drawIndex = 0; drawIndex < amount; drawIndex += 1) {
          if (
            grandArchivePlayerActionIsForbidden({
              action: "draw",
              playerId,
              evaluation: { ...context(execution), controllerId: playerId },
            }) ||
            grandArchiveRemainingPlayerActionAllowance({
              action: "draw",
              playerId,
              evaluation: { ...context(execution), controllerId: playerId },
            }) <= 0
          ) {
            break;
          }
          const objectId = execution.state.zones[playerId]["main-deck"][0];
          if (objectId) {
            commit(execution, [
              ...(grandArchivePlayerHasState(execution.base.program, execution.state, playerId, {
                named: "top-main-deck-revealed",
              })
                ? [
                    {
                      type: "card-revealed" as const,
                      objectId,
                      playerId,
                      gameEventId,
                      cause: { kind: "rule" as const, rule: "revealed-top-card-drawn" },
                    },
                  ]
                : []),
              {
                type: "object-moved",
                objectId,
                from: "main-deck",
                to: destination,
                actorId: playerId,
                gameEventId,
                cause: { kind: "rule", rule: "draw-effect" },
              },
            ]);
            continue;
          }
          const loseGameIsForbidden = collectGrandArchivePlayerActionRules({
            action: "lose-game",
            playerId,
            evaluation: { ...context(execution), controllerId: playerId },
          }).some((rule) => rule.effect.mode === "forbid");
          if (!loseGameIsForbidden) {
            commit(execution, [
              {
                type: "player-lost",
                playerId,
                reason: "deck-out",
                gameEventId,
                cause: { kind: "rule", rule: "empty-deck-draw-attempt" },
              },
            ]);
          }
          break;
        }
      }
      return true;
    }
    case "mill": {
      const amount = evaluateGrandArchiveAmount(effect.amount, evaluation);
      if (!Number.isSafeInteger(amount) || amount < 0) {
        throw new GrandArchiveUnsupportedRuleError("mill amount must be a non-negative integer");
      }
      const gameEventId = grandArchiveGameEventId(
        `game-event-${execution.state.nextEventOrdinal}-${execution.proposedActionCount + 1}`,
      );
      for (const playerId of resolveGrandArchivePlayers(effect.player, evaluation)) {
        for (let millIndex = 0; millIndex < amount; millIndex += 1) {
          const objectId = execution.state.zones[playerId]["main-deck"][0];
          if (!objectId) break;
          commit(execution, [
            {
              type: "object-moved" as const,
              objectId,
              from: "main-deck" as const,
              to: "graveyard" as const,
              gameEventId,
              cause: { kind: "rule" as const, rule: "mill-effect" },
            },
          ]);
        }
      }
      return true;
    }
    case "shuffle": {
      const playerIds = resolveGrandArchivePlayers(effect.player, evaluation);
      if (playerIds.length !== 1) {
        throw new GrandArchiveUnsupportedRuleError("shuffle requires exactly one player");
      }
      const playerId = playerIds[0]!;
      const shuffled = shuffleGrandArchiveObjects(
        execution.state.zones[playerId][effect.zone],
        execution.state.random,
      );
      commit(execution, [
        {
          type: "random-state-changed",
          random: shuffled.random,
          actorId: playerId,
          cause: { kind: "rule", rule: "shuffle-effect" },
        },
        {
          type: "zone-reordered",
          playerId,
          zone: effect.zone,
          objectIds: shuffled.value,
          actorId: playerId,
          cause: { kind: "rule", rule: "shuffle-effect" },
        },
      ]);
      return true;
    }
    case "swap-zones": {
      const playerId = resolveSinglePlayer(effect.player, evaluation);
      const [firstZone, secondZone] = effect.zones;
      if (firstZone === secondZone) {
        throw new Error("Swapping a zone with itself is not a zone change");
      }
      const firstObjectIds = [
        ...grandArchivePlayerZoneObjectIds(execution.state, playerId, firstZone),
      ];
      const secondObjectIds = [
        ...grandArchivePlayerZoneObjectIds(execution.state, playerId, secondZone),
      ];
      const events: GrandArchiveProposedEvent[] = [
        ...firstObjectIds.map((objectId) => ({
          type: "object-moved" as const,
          objectId,
          from: firstZone,
          to: secondZone,
        })),
        ...secondObjectIds.map((objectId) => ({
          type: "object-moved" as const,
          objectId,
          from: secondZone,
          to: firstZone,
        })),
      ];
      if (events.length === 0) return false;
      commit(execution, events);
      return true;
    }
    case "skip-next-phase": {
      const playerIds = resolveGrandArchivePlayers(effect.player, evaluation);
      commit(
        execution,
        playerIds.map((playerId) => ({
          type: "phase-skip-added" as const,
          playerId,
          phase: effect.phase,
          actorId: execution.base.controllerId,
          cause: { kind: "rule" as const, rule: "skip-next-phase-effect" },
        })),
      );
      return playerIds.length > 0;
    }
    case "reveal-until": {
      const playerId = resolveSinglePlayer(effect.player, evaluation);
      const zone = execution.state.zones[playerId][effect.zone];
      const matchIndex = zone.findIndex((objectId) => {
        const object = execution.state.objects[objectId];
        return object ? matchesGrandArchiveCardFilter(object, effect.stopWhen, evaluation) : false;
      });
      const revealed = zone.slice(0, matchIndex < 0 ? zone.length : matchIndex + 1);
      const matchId = matchIndex < 0 ? undefined : revealed.at(-1);
      execution.bindings[effect.bindMatchAs] = matchId ? [matchId] : [];
      execution.bindings[effect.bindRemainderAs] = matchId ? revealed.slice(0, -1) : revealed;
      commit(
        execution,
        revealed.map((objectId) => ({
          type: "card-revealed" as const,
          objectId,
          playerId,
          actorId: playerId,
          cause: { kind: "rule" as const, rule: "reveal-until-effect" },
        })),
      );
      return revealed.length > 0;
    }
    case "trigger-abilities": {
      const sources = resolveGrandArchiveSubjectObjects(effect.subject, evaluation);
      const events = collectGrandArchiveNamedTriggeredAbilityEvents(
        execution.base.program,
        execution.state,
        sources,
        effect.triggerName,
      );
      commit(execution, events);
      return events.length > 0;
    }
    case "after-resolution": {
      const target = afterResolutionTarget(effect, evaluation);
      const ordinal = execution.state.nextStackOrdinal;
      const scheduled: GrandArchiveStackItem = {
        id: grandArchiveStackItemId(`stack-${ordinal}`),
        kind: "triggered-ability",
        controllerId: execution.base.controllerId,
        ...(execution.base.sourceId ? { sourceId: execution.base.sourceId } : {}),
        ...(execution.base.sourceIncarnation !== undefined
          ? { sourceIncarnation: execution.base.sourceIncarnation }
          : {}),
        ...(execution.base.sourceLkiEventId
          ? { sourceLkiEventId: execution.base.sourceLkiEventId }
          : {}),
        selectedModeIds: [],
        ability: {
          id: `scheduledAfterResolution-a${ordinal}`,
          kind: "triggered",
          text: "Resolve a scheduled after-resolution effect.",
          trigger: { kind: "event", event: { name: "effect-resolved" } },
          effect: effect.effect,
        },
        targets: [],
        createdAtVersion: execution.state.stateVersion,
        activationPhase: execution.state.turn.phase,
        isCopy: false,
        negated: false,
        opportunityPolicy: "interdiction",
        activationStates: [],
        activationPayment: [],
        championLevelModifier: 0,
        variables: execution.base.variables ?? {},
        bindings: { ...execution.bindings },
      };
      commit(execution, [
        {
          type: "stack-item-after-resolution-scheduled",
          targetStackItemId: target.id,
          item: scheduled,
          actorId: execution.base.controllerId,
          cause: { kind: "rule", rule: "schedule-after-resolution-effect" },
        },
      ]);
      return true;
    }
    case "recover": {
      const amount = evaluateGrandArchiveAmount(effect.amount, evaluation);
      if (!Number.isSafeInteger(amount) || amount < 0) {
        throw new GrandArchiveUnsupportedRuleError("recover amount must be a non-negative integer");
      }
      if (amount === 0) return false;
      const events = resolveGrandArchivePlayers(effect.player, evaluation).flatMap((playerId) =>
        grandArchivePlayerActionIsForbidden({
          action: "recover",
          playerId,
          evaluation: { ...context(execution), controllerId: playerId },
        })
          ? []
          : resolveGrandArchiveSubjectObjects(
              { kind: "champion", player: { binding: `recover-${playerId}` } },
              {
                ...evaluation,
                bindings: { ...evaluation.bindings, [`recover-${playerId}`]: [playerId] },
              },
            ).map((object) => ({
              type: "damage-removed" as const,
              objectId: object.id,
              amount,
              actorId: playerId,
              cause: { kind: "rule" as const, rule: "recover-effect" },
            })),
      );
      commit(execution, events);
      return events.length > 0;
    }
    case "deal-damage": {
      const amount = evaluateGrandArchiveAmount(effect.amount, evaluation);
      if (amount <= 0) return false;
      const source = effect.source
        ? resolveGrandArchiveSubjectObjects(effect.source, evaluation)[0]
        : evaluation.sourceId
          ? evaluation.state.objects[evaluation.sourceId]
          : undefined;
      const events = resolveGrandArchiveSubjectObjects(effect.recipient, evaluation).map(
        (object): GrandArchiveProposedEvent => ({
          type: "damage-marked" as const,
          objectId: object.id,
          amount,
          ...(source ? { sourceId: source.id } : {}),
          ...(effect.preventable === false ? { preventable: false as const } : {}),
          cause: { kind: "rule" as const, rule: "deal-damage-effect" },
        }),
      );
      commit(execution, events);
      return events.length > 0;
    }
    case "rest":
    case "wake": {
      const rested = effect.kind === "rest";
      const candidates = resolveGrandArchiveSubjectObjects(effect.subject, evaluation);
      const events = candidates.flatMap((object): readonly GrandArchiveProposedEvent[] => {
        const wakeIsForbidden =
          effect.kind === "wake" &&
          grandArchiveActionIsForbidden({
            action: "wake",
            activationKind: "card",
            playerId: evaluation.controllerId,
            candidateId: object.id,
            fromZone: object.zone,
            evaluation: { ...evaluation, candidateId: object.id },
          });
        return object.states.has("rested") === rested || wakeIsForbidden
          ? []
          : [
              {
                type: "object-state-changed" as const,
                objectId: object.id,
                state: "rested" as const,
                value: rested,
              },
            ];
      });
      commit(execution, events);
      return events.length > 0;
    }
    case "destroy":
    case "sacrifice":
    case "discard-object": {
      commit(
        execution,
        resolveGrandArchiveSubjectObjects(effect.subject, evaluation).flatMap((object) =>
          object.zone === "graveyard"
            ? []
            : [
                {
                  type: "object-moved" as const,
                  objectId: object.id,
                  from: object.zone,
                  to: "graveyard" as const,
                  ...(effect.kind === "discard-object" ? { discarded: true as const } : {}),
                  cause: { kind: "rule" as const, rule: `${effect.kind}-effect` },
                },
              ],
        ),
      );
      return true;
    }
    case "banish-object": {
      commit(
        execution,
        resolveGrandArchiveSubjectObjects(effect.subject, evaluation).flatMap((object) =>
          object.zone === "banishment"
            ? []
            : [
                {
                  type: "object-moved" as const,
                  objectId: object.id,
                  from: object.zone,
                  to: "banishment" as const,
                  ...(effect.faceDown
                    ? { entryFacing: "face-down" as const, revealAtEndOfGame: true as const }
                    : {}),
                  ...(evaluation.sourceId ? { banishedBySourceId: evaluation.sourceId } : {}),
                  cause: { kind: "rule" as const, rule: "banish-object-effect" },
                },
              ],
        ),
      );
      return true;
    }
    case "move": {
      const placement = effect.destination.placement;
      const moved = moveEvents(effect, execution);
      // Each top insertion prepends one card. Commit from the end of the
      // requested sequence so the first selected card remains the top card.
      const events = placement?.kind === "top" ? [...moved].reverse() : moved;
      const isSimultaneousOrderedPrivatePlacement =
        events.length > 1 &&
        (effect.destination.zone === "main-deck" || effect.destination.zone === "material-deck") &&
        (placement?.kind === "top" || placement?.kind === "bottom");
      if (isSimultaneousOrderedPrivatePlacement && placement.order?.kind === "random") {
        const shuffled = shuffleGrandArchiveObjects(events, execution.state.random);
        commit(execution, [
          {
            type: "random-state-changed",
            random: shuffled.random,
            actorId: execution.base.controllerId,
            cause: { kind: "rule", rule: "random-move-order" },
          },
          ...shuffled.value.map((event) => ({
            ...event,
            orderedPrivatePlacementKnowledge: "none" as const,
          })),
        ]);
        return true;
      }
      commit(
        execution,
        isSimultaneousOrderedPrivatePlacement
          ? events.map((event) => ({
              ...event,
              orderedPrivatePlacementKnowledge:
                event.orderedPrivatePlacementKnowledge ?? ("owner-only" as const),
            }))
          : events,
      );
      return true;
    }
    case "add-counter":
    case "remove-counter":
      commit(execution, counterChangeEvents(effect, execution));
      return true;
    case "move-counter": {
      const amount = evaluateGrandArchiveAmount(effect.amount, evaluation);
      const from =
        effect.from.kind === "mastery"
          ? (() => {
              const playerId = resolveGrandArchivePlayers(effect.from.player, evaluation)[0];
              const mastery = playerId
                ? grandArchivePlayerMastery(execution.state, playerId, effect.from.name)
                : undefined;
              return playerId && mastery
                ? { kind: "mastery" as const, playerId, mastery: mastery.name }
                : undefined;
            })()
          : (() => {
              const object = resolveGrandArchiveSubjectObjects(effect.from, evaluation)[0];
              return object ? { kind: "object" as const, object } : undefined;
            })();
      const to =
        effect.to.kind === "mastery"
          ? (() => {
              const playerId = resolveGrandArchivePlayers(effect.to.player, evaluation)[0];
              const mastery = playerId
                ? grandArchivePlayerMastery(execution.state, playerId, effect.to.name)
                : undefined;
              return playerId && mastery
                ? { kind: "mastery" as const, playerId, mastery: mastery.name }
                : undefined;
            })()
          : (() => {
              const object = resolveGrandArchiveSubjectObjects(effect.to, evaluation)[0];
              return object ? { kind: "object" as const, object } : undefined;
            })();
      if (!from || !to) return false;
      const key = grandArchiveCounterKey(effect.counter);
      const available =
        from.kind === "object"
          ? grandArchiveObjectCounterCount(from.object, effect.counter)
          : grandArchiveMasteryCounterCount(
              execution.state,
              from.playerId,
              from.mastery,
              effect.counter,
            );
      const moved = Math.min(amount, available);
      const fromEvent: GrandArchiveProposedEvent =
        from.kind === "object"
          ? { type: "counter-changed", objectId: from.object.id, counter: key, delta: -moved }
          : {
              type: "mastery-counter-changed",
              playerId: from.playerId,
              mastery: from.mastery,
              counter: key,
              delta: -moved,
            };
      const toEvent: GrandArchiveProposedEvent =
        to.kind === "object"
          ? { type: "counter-changed", objectId: to.object.id, counter: key, delta: moved }
          : {
              type: "mastery-counter-changed",
              playerId: to.playerId,
              mastery: to.mastery,
              counter: key,
              delta: moved,
            };
      commit(execution, moved === 0 ? [] : [fromEvent, toEvent]);
      return true;
    }
    case "retarget": {
      if (effect.subject.kind !== "current-attack" || !effect.newTarget) {
        throw new GrandArchiveUnsupportedRuleError("retarget selection or non-attack subject");
      }
      const combat = execution.state.combat;
      if (!combat) return false;
      const previousDefenders = effect.oldTarget
        ? resolveGrandArchiveSubjectObjects(effect.oldTarget, evaluation)
        : combat.targetIds.length === 1
          ? [execution.state.objects[combat.targetIds[0]!]].filter(
              (object): object is GrandArchiveCardInstance => object !== undefined,
            )
          : [];
      const newDefenders = resolveGrandArchiveSubjectObjects(effect.newTarget, evaluation);
      if (previousDefenders.length !== 1 || newDefenders.length !== 1) return false;
      try {
        commit(
          execution,
          proposeGrandArchiveAttackRedirection(
            execution.base.program,
            execution.state,
            previousDefenders[0]!.id,
            newDefenders[0]!.id,
            effect.requireNewTargetObedience
              ? { requireNewDefenderObedience: true, asIntercept: true }
              : {},
          ),
        );
        return true;
      } catch {
        return false;
      }
    }
    case "copy": {
      const amount = Math.max(0, evaluateGrandArchiveAmount(effect.amount ?? 1, evaluation));
      if (effect.copy === "object") {
        const copies = createdObjectsForEffect(effect, evaluation).map((copy) =>
          applyEntryLinkHost(copy, execution),
        );
        commit(
          execution,
          copies.map((object) => ({
            type: "object-created" as const,
            object,
            cause: { kind: "rule" as const, rule: "copy-object-effect" },
          })),
        );
        if (effect.bindResultAs) {
          execution.bindings[effect.bindResultAs] = copies.map((copy) => copy.id);
        }
        return copies.length > 0;
      }
      const originals = subjectStackItems(effect.subject, execution);
      const copiedItemIds: GrandArchiveStackItemId[] = [];
      const proposed: GrandArchiveProposedEvent[] = [];
      let stackOffset = 0;
      let objectOffset = 0;
      for (const original of originals) {
        for (let copyIndex = 0; copyIndex < amount; copyIndex += 1) {
          const stackItemId = grandArchiveStackItemId(
            `stack-${execution.state.nextStackOrdinal + stackOffset}`,
          );
          stackOffset += 1;
          let copiedCardId: GrandArchiveObjectId | undefined;
          if (effect.copy === "card-activation" || effect.copy === "materialization") {
            if (
              original.kind !== "card-activation" &&
              original.kind !== "materialization" &&
              original.kind !== "bestowment"
            ) {
              throw new GrandArchiveUnsupportedRuleError(
                `copy ${effect.copy} from ${original.kind}`,
              );
            }
            const copiedCard = copyCardForStackItem(
              original,
              execution.state.nextObjectOrdinal + objectOffset,
              execution,
            );
            objectOffset += 1;
            copiedCardId = copiedCard.id;
            proposed.push({
              type: "object-created",
              object: copiedCard,
              cause: { kind: "rule", rule: `copy-${effect.copy}-card` },
            });
          }
          const copiedItem = copiedStackItem(
            original,
            effect.copy,
            stackItemId,
            copiedCardId,
            execution,
          );
          proposed.push({
            type: "stack-item-deferred",
            item: copiedItem,
            cause: { kind: "rule", rule: `copy-${effect.copy}` },
          });
          execution.deferredStackItems.push(copiedItem);
          copiedItemIds.push(stackItemId);
        }
      }
      commit(execution, proposed);
      if (effect.bindResultAs) execution.bindings[effect.bindResultAs] = copiedItemIds;
      return copiedItemIds.length > 0;
    }
    case "become-copy": {
      if (effect.duration.kind !== "permanent") {
        throw new GrandArchiveUnsupportedRuleError(`become-copy duration ${effect.duration.kind}`);
      }
      const source = resolveGrandArchiveSubjectObjects(effect.copyOf, evaluation)[0];
      if (!source || source.zone !== "field") return false;
      const subjects = resolveGrandArchiveSubjectObjects(effect.subject, evaluation);
      commit(
        execution,
        subjects.map((object) => ({
          type: "object-became-copy" as const,
          objectId: object.id,
          copiedDefinitionId: source.activeDefinitionId ?? source.definitionId,
          copiedFace: source.face,
          ...(effect.exceptName ? { nameOverride: effect.exceptName } : {}),
          cause: { kind: "rule" as const, rule: "become-copy-effect" },
        })),
      );
      return subjects.length > 0;
    }
    case "negate": {
      const negated = negateStackItems(subjectStackItems(effect.subject, execution), execution);
      if (effect.bindResultAs) {
        execution.bindings[effect.bindResultAs] = negated.map((item) => item.id);
      }
      return negated.length > 0;
    }
    case "negate-matching-stack-items": {
      const declaration: import("@tcg/grand-archive-types").GrandArchiveTargetDeclaration = {
        id: "negate-matching-stack-items",
        kind: "target",
        declared: "announcement",
        chooser: "controller",
        count: { kind: "all" },
        unique: true,
        candidates: effect.candidates,
      };
      const matching = execution.state.stack.filter((item) =>
        isGrandArchiveTargetCandidate(item.id, declaration, evaluation),
      );
      return negateStackItems(matching, execution).length > 0;
    }
    case "negate-triggered-abilities": {
      const sourceIds = new Set(
        resolveGrandArchiveSubjectObjects(effect.source, evaluation).map((object) => object.id),
      );
      const matching = execution.state.stack.filter(
        (item) =>
          item.kind === "triggered-ability" &&
          item.sourceId !== undefined &&
          sourceIds.has(item.sourceId) &&
          (!effect.triggerEvent ||
            (item.ability.trigger !== undefined &&
              triggerObservesEvent(item.ability.trigger, effect.triggerEvent))),
      );
      return negateStackItems(matching, execution).length > 0;
    }
    case "transform": {
      const events = resolveGrandArchiveSubjectObjects(effect.subject, evaluation).flatMap(
        (object): readonly GrandArchiveProposedEvent[] => {
          const definition = execution.base.program.cardsById[object.definitionId];
          return object.zone === "field" &&
            object.facing === "face-up" &&
            object.copy === undefined &&
            object.activeDefinitionId === undefined &&
            definition?.layout.kind === "double-faced"
            ? [{ type: "object-transformed", objectId: object.id }]
            : [];
        },
      );
      commit(execution, events);
      return events.length > 0;
    }
    case "delevel": {
      const events = resolveGrandArchiveSubjectObjects(effect.subject, evaluation).flatMap(
        (champion): readonly GrandArchiveProposedEvent[] => {
          const lineage = execution.state.zones[champion.ownerId]["inner-lineage"].filter(
            (objectId) => execution.state.objects[objectId]?.hostId === champion.id,
          );
          const cardId = lineage.at(-1);
          return cardId
            ? [
                {
                  type: "champion-deleveled",
                  championId: champion.id,
                  cardId,
                  cause: { kind: "rule", rule: "delevel-effect" },
                },
              ]
            : [];
        },
      );
      commit(execution, events);
      return events.length > 0;
    }
    case "set-object-state": {
      const events = resolveGrandArchiveSubjectObjects(effect.subject, evaluation).flatMap(
        (object): readonly GrandArchiveProposedEvent[] => {
          if (grandArchiveObjectHasState(execution.state, object, effect.state) === effect.value) {
            return [];
          }
          if (effect.state === "awake") {
            return [
              {
                type: "object-state-changed" as const,
                objectId: object.id,
                state: "rested" as const,
                value: !effect.value,
              },
            ];
          }
          if (grandArchiveStateUsesActivationProperty(effect.state)) {
            return [
              {
                type: "object-activation-state-changed" as const,
                objectId: object.id,
                state: effect.state,
                value: effect.value,
              },
            ];
          }
          if (effect.state === "damaged" || effect.state === "loaded") {
            throw new GrandArchiveUnsupportedRuleError(
              `direct assignment of derived object state ${effect.state}`,
            );
          }
          return [
            {
              type: "object-state-changed" as const,
              objectId: object.id,
              state: effect.state,
              value: effect.value,
            },
          ];
        },
      );
      commit(execution, events);
      return events.length > 0;
    }
    case "set-activation-state": {
      const events = resolveGrandArchiveSubjectObjects(effect.subject, evaluation).flatMap(
        (object): readonly GrandArchiveProposedEvent[] =>
          object.activationStates.has(effect.state) === effect.value
            ? []
            : [
                {
                  type: "object-activation-state-changed" as const,
                  objectId: object.id,
                  state: effect.state,
                  value: effect.value,
                },
              ],
      );
      commit(execution, events);
      return events.length > 0;
    }
    case "track-characteristic": {
      const subjects = resolveGrandArchiveSubjectObjects(effect.subject, evaluation);
      if (subjects.length !== 1 || !evaluation.sourceId) {
        throw new GrandArchiveUnsupportedRuleError(
          "track-characteristic requires one subject and a source",
        );
      }
      const subject = subjects[0]!;
      const characteristics = deriveGrandArchiveCharacteristics(subject, evaluation);
      const values =
        effect.characteristic === "card-name"
          ? characteristics.names
          : effect.characteristic === "class"
            ? characteristics.classes
            : effect.characteristic === "element"
              ? characteristics.elements
              : effect.characteristic === "subtype"
                ? characteristics.subtypes
                : characteristics.types;
      if (values.length !== 1) {
        throw new GrandArchiveUnsupportedRuleError(
          `track-characteristic ${effect.characteristic} requires one value`,
        );
      }
      const value = values[0]!;
      execution.bindings[`tracked:${effect.trackAs}`] = value;
      commit(execution, [
        {
          type: "object-characteristic-tracked",
          objectId: evaluation.sourceId,
          key: effect.trackAs,
          values: [value],
          cause: { kind: "rule", rule: "track-characteristic-effect" },
        },
      ]);
      return true;
    }
    case "set-card-facing": {
      const objects = resolveGrandArchiveSubjectObjects(effect.subject, evaluation).filter(
        (object) => object.facing !== effect.facing,
      );
      if (objects.length === 0) return false;
      commit(
        execution,
        objects.map((object) => ({
          type: "object-facing-changed" as const,
          objectId: object.id,
          facing: effect.facing,
          ...(effect.facing === "face-down" ? { revealAtEndOfGame: true as const } : {}),
        })),
      );
      return true;
    }
    case "set-player-state": {
      const playerIds = resolveGrandArchivePlayers(effect.player, evaluation);
      if (playerIds.length !== 1) {
        throw new GrandArchiveUnsupportedRuleError("player state requires exactly one player");
      }
      const playerId = playerIds[0]!;
      if (effect.state !== "agility") {
        if (effect.amount !== undefined) {
          throw new GrandArchiveUnsupportedRuleError("quantified named player state");
        }
        const eventState = execution.bindings.eventState;
        const state =
          typeof effect.state === "object" && "kind" in effect.state
            ? typeof eventState === "string"
              ? { named: eventState }
              : undefined
            : effect.state;
        if (!state) {
          throw new GrandArchiveUnsupportedRuleError("event player state outside event context");
        }
        if (effect.duration) {
          return execute(
            {
              kind: "continuous-player-state",
              players: effect.player,
              state,
              value: effect.value,
              duration: effect.duration,
            },
            execution,
          );
        }
        const stateKey = grandArchivePlayerStateStorageKey(state);
        const events: GrandArchiveProposedEvent[] = [];
        if (stateKey === "crowds-favor" && effect.value) {
          for (const opponentId of execution.state.turnOrder) {
            if (
              opponentId !== playerId &&
              execution.state.players[opponentId]?.states["crowds-favor"] === true
            ) {
              events.push({
                type: "player-state-changed",
                playerId: opponentId,
                state: "crowds-favor",
                value: false,
                actorId: playerId,
                cause: { kind: "rule", rule: "crowds-favor-transfers" },
              });
            }
          }
        }
        events.push({
          type: "player-state-changed",
          playerId,
          state: stateKey,
          value: effect.value,
          actorId: evaluation.controllerId,
          cause: { kind: "rule", rule: "set-player-state-effect" },
        });
        commit(execution, events);
        return true;
      }
      if (!effect.value || effect.amount === undefined || effect.duration?.kind !== "this-turn") {
        throw new GrandArchiveUnsupportedRuleError("agility state without amount and duration");
      }
      const amount = Math.max(0, evaluateGrandArchiveAmount(effect.amount, evaluation));
      if (amount === 0) return false;
      const selectionId = `agility-return-${execution.state.nextDelayedTriggerOrdinal}`;
      const delayedEffect: Extract<
        GrandArchiveEffect,
        { readonly kind: "create-delayed-trigger" }
      > = {
        kind: "create-delayed-trigger",
        trigger: { kind: "event", event: { name: "phase-begins", phase: "end" } },
        limit: 1,
        expires: { kind: "this-turn" },
        effect: {
          kind: "choose",
          selection: {
            id: selectionId,
            kind: "choice",
            declared: "resolution",
            chooser: "controller",
            count: {
              kind: "exactly",
              amount: {
                kind: "calculate",
                operator: "minimum",
                operands: [
                  amount,
                  {
                    kind: "count",
                    collection: { zones: ["memory"], player: "controller" },
                  },
                ],
              },
            },
            unique: true,
            candidates: {
              kind: "card",
              zones: ["memory"],
              relationship: "zone-of",
              player: "controller",
            },
          },
          effect: {
            kind: "move",
            subject: { kind: "bound", binding: selectionId },
            destination: { zone: "hand" },
          },
        },
      };
      commit(execution, [
        {
          type: "player-state-changed",
          playerId,
          state: "agility",
          value: true,
          actorId: playerId,
          cause: { kind: "rule", rule: "gain-agility" },
        },
        {
          type: "delayed-trigger-created",
          trigger: createGrandArchiveDelayedTrigger(delayedEffect, {
            ...evaluation,
            state: execution.state,
            controllerId: playerId,
          }),
          actorId: playerId,
          cause: { kind: "rule", rule: "agility-end-phase-trigger" },
        },
      ]);
      return true;
    }
    case "set-game-state": {
      if (effect.duration && effect.duration.kind !== "permanent") {
        throw new GrandArchiveUnsupportedRuleError(
          `temporary game state ${effect.state} (${effect.duration.kind})`,
        );
      }
      if (execution.state.gameStates[effect.state] === effect.value) return false;
      commit(execution, [
        {
          type: "game-state-changed",
          state: effect.state,
          value: effect.value,
          cause: { kind: "rule", rule: "set-game-state-effect" },
        },
      ]);
      return true;
    }
    case "end-phase":
      if (execution.state.turn.phase !== effect.phase) return false;
      commit(execution, [
        {
          type: "phase-end-requested",
          phase: effect.phase,
          cause: { kind: "rule", rule: "end-phase-effect" },
        },
      ]);
      return true;
    case "end-turn":
      commit(execution, [
        {
          type: "turn-end-requested",
          cause: { kind: "rule", rule: "end-turn-effect" },
        },
      ]);
      return true;
    case "change-control": {
      const controllerId = resolveSinglePlayer(effect.controller, evaluation);
      commit(
        execution,
        resolveGrandArchiveSubjectObjects(effect.subject, evaluation).map((object) => ({
          type: "object-controller-changed" as const,
          objectId: object.id,
          controllerId,
        })),
      );
      return true;
    }
    case "gain-mastery": {
      const playerId = resolveSinglePlayer(effect.player, evaluation);
      const mastery = effect.mastery.trim();
      if (!mastery) throw new Error("A mastery must have a name");
      if (!grandArchiveMasteryDefinition(execution.base.program, mastery)) {
        throw new GrandArchiveUnsupportedRuleError(`unknown mastery ${mastery}`);
      }
      const hadShiftingCurrents =
        execution.state.players[playerId]?.mastery?.name === "Shifting Currents";
      const gainsShiftingCurrents = mastery === "Shifting Currents";
      commit(execution, [
        {
          type: "mastery-changed",
          playerId,
          mastery,
          actorId: playerId,
          cause: { kind: "rule", rule: "gain-mastery" },
        },
        ...(gainsShiftingCurrents
          ? [
              {
                type: "player-state-changed" as const,
                playerId,
                state: "shifting-currents",
                value: "north",
                actorId: playerId,
                cause: { kind: "rule" as const, rule: "shifting-currents-starting-direction" },
              },
            ]
          : hadShiftingCurrents
            ? [
                {
                  type: "player-state-changed" as const,
                  playerId,
                  state: "shifting-currents",
                  value: false,
                  actorId: playerId,
                  cause: { kind: "rule" as const, rule: "replace-shifting-currents-mastery" },
                },
              ]
            : []),
      ]);
      return true;
    }
    case "continuous": {
      if (effect.change.kind === "copy-abilities") {
        const change = effect.change;
        const abilities = resolveGrandArchiveSubjectObjects(change.from, evaluation)
          .flatMap((object) =>
            grandArchiveObjectActiveAbilities(evaluation.program, evaluation.state, object),
          )
          .filter(
            (ability) =>
              !change.abilityKinds ||
              ((ability.kind === "activated" ||
                ability.kind === "triggered" ||
                ability.kind === "static") &&
                change.abilityKinds.includes(ability.kind)),
          );
        // A resolved copying instruction captures the abilities at that moment.
        // Static copy effects continue to derive their source's current abilities.
        for (const ability of abilities)
          execute({ ...effect, change: { kind: "grant-ability", ability } }, execution);
        return abilities.length > 0;
      }
      const affectedObjects =
        effect.affectedSet === "locked"
          ? resolveGrandArchiveSubjectObjects(effect.subjects, evaluation)
          : [];
      const affectedObjectIds = affectedObjects.map((object) => object.id);
      if (effect.bindResultAs) execution.bindings[effect.bindResultAs] = affectedObjectIds;
      commit(execution, [
        {
          type: "continuous-effect-created",
          effect: {
            id: `continuous-${execution.state.nextContinuousOrdinal}`,
            ...(evaluation.sourceId ? { sourceId: evaluation.sourceId } : {}),
            ...(evaluation.sourceIncarnation !== undefined
              ? { sourceIncarnation: evaluation.sourceIncarnation }
              : {}),
            ...(evaluation.sourceLkiEventId
              ? { sourceLkiEventId: evaluation.sourceLkiEventId }
              : {}),
            controllerId: evaluation.controllerId,
            effect,
            affectedObjectIds,
            affectedObjectIncarnations: Object.fromEntries(
              affectedObjects.map((object) => [
                object.id,
                execution.base.pendingMoveIncarnations?.[object.id] ??
                  (execution.state.replacementPreCommit?.status === "resolving" &&
                  execution.state.replacementPreCommit.followUp.sourceId === object.id
                    ? object.incarnation + 1
                    : object.incarnation),
              ]),
            ),
            bindings: evaluation.bindings,
            variables: evaluation.variables ?? {},
            durationAnchors: anchorGrandArchiveDuration(effect.duration, evaluation),
            createdAtVersion: execution.state.stateVersion,
            createdTurnNumber: execution.state.turn.number,
            createdPhase: execution.state.turn.phase,
          },
          cause: { kind: "rule", rule: "continuous-effect-resolution" },
        },
      ]);
      return true;
    }
    case "continuous-player-property":
    case "continuous-player-state": {
      const playerIds = resolveGrandArchivePlayers(effect.players, evaluation);
      if (playerIds.length === 0) return false;
      let playerBinding = `$engine:continuous-player:${execution.state.nextContinuousOrdinal}`;
      while (evaluation.bindings[playerBinding] !== undefined) playerBinding += ":next";
      const lockedEffect = { ...effect, players: { binding: playerBinding } };
      commit(execution, [
        {
          type: "continuous-effect-created",
          effect: {
            id: `continuous-${execution.state.nextContinuousOrdinal}`,
            ...(evaluation.sourceId ? { sourceId: evaluation.sourceId } : {}),
            ...(evaluation.sourceIncarnation !== undefined
              ? { sourceIncarnation: evaluation.sourceIncarnation }
              : {}),
            ...(evaluation.sourceLkiEventId
              ? { sourceLkiEventId: evaluation.sourceLkiEventId }
              : {}),
            controllerId: evaluation.controllerId,
            effect: lockedEffect,
            affectedObjectIds: [],
            affectedObjectIncarnations: {},
            bindings: { ...evaluation.bindings, [playerBinding]: playerIds },
            variables: evaluation.variables ?? {},
            durationAnchors: anchorGrandArchiveDuration(effect.duration, evaluation),
            createdAtVersion: execution.state.stateVersion,
            createdTurnNumber: execution.state.turn.number,
            createdPhase: execution.state.turn.phase,
          },
          cause: { kind: "rule", rule: "continuous-player-effect-resolution" },
        },
      ]);
      return true;
    }
    case "trigger-multiplier":
      commit(execution, [
        {
          type: "continuous-effect-created",
          effect: {
            id: `continuous-${execution.state.nextContinuousOrdinal}`,
            ...(evaluation.sourceId ? { sourceId: evaluation.sourceId } : {}),
            ...(evaluation.sourceIncarnation !== undefined
              ? { sourceIncarnation: evaluation.sourceIncarnation }
              : {}),
            ...(evaluation.sourceLkiEventId
              ? { sourceLkiEventId: evaluation.sourceLkiEventId }
              : {}),
            controllerId: evaluation.controllerId,
            effect,
            affectedObjectIds: [],
            affectedObjectIncarnations: {},
            bindings: evaluation.bindings,
            variables: evaluation.variables ?? {},
            durationAnchors: anchorGrandArchiveDuration(effect.duration, evaluation),
            createdAtVersion: execution.state.stateVersion,
            createdTurnNumber: execution.state.turn.number,
            createdPhase: execution.state.turn.phase,
          },
          cause: { kind: "rule", rule: "trigger-multiplier-resolution" },
        },
      ]);
      return true;
    case "replacement": {
      const capacityAmount = effect.capacity
        ? evaluateGrandArchiveAmount(effect.capacity.amount, evaluation)
        : undefined;
      if (
        capacityAmount !== undefined &&
        (!Number.isSafeInteger(capacityAmount) || capacityAmount < 0)
      ) {
        throw new GrandArchiveUnsupportedRuleError(
          "replacement capacity must be a non-negative integer",
        );
      }
      commit(execution, [
        {
          type: "replacement-effect-created",
          replacement: {
            id: `replacement-${execution.state.nextReplacementOrdinal}`,
            ...(evaluation.sourceId ? { sourceId: evaluation.sourceId } : {}),
            controllerId: evaluation.controllerId,
            ...(evaluation.abilityId ? { abilityId: evaluation.abilityId } : {}),
            effect,
            bindings: evaluation.bindings,
            variables: evaluation.variables ?? {},
            ...(evaluation.resultVariables ? { resultVariables: evaluation.resultVariables } : {}),
            durationAnchors: anchorGrandArchiveDuration(effect.duration, evaluation),
            capacity:
              capacityAmount === undefined || !effect.capacity
                ? null
                : effect.capacity.scope === "replacement-instance"
                  ? {
                      scope: "replacement-instance",
                      initial: capacityAmount,
                      remaining: capacityAmount,
                    }
                  : {
                      scope: "per-object",
                      initial: capacityAmount,
                      remainingByObject: {},
                    },
            createdAtVersion: execution.state.stateVersion,
            createdTurnNumber: execution.state.turn.number,
            createdPhase: execution.state.turn.phase,
          },
          cause: { kind: "rule", rule: "replacement-effect-resolution" },
        },
      ]);
      return true;
    }
    case "rule-modification":
      if (effect.mode === "grant-keyword" && !effect.grantedKeyword) {
        throw new GrandArchiveUnsupportedRuleError(
          `rule modification ${effect.mode} without a granted keyword`,
        );
      }
      if (
        effect.mode !== "grant-keyword" &&
        !(
          effect.mode === "payment-contribution" &&
          effect.action === "pay-cost" &&
          effect.costKind
        ) &&
        !(
          (effect.mode === "modify-cost" ||
            effect.mode === "replace-cost" ||
            effect.mode === "add-cost") &&
          (effect.action === "activate" ||
            effect.action === "attack" ||
            effect.action === "pay-cost" ||
            effect.action === "materialize" ||
            effect.action === "bestow")
        ) &&
        !(
          (effect.mode === "allow" || effect.mode === "forbid" || effect.mode === "require") &&
          (effect.action === "activate" ||
            effect.action === "attack" ||
            effect.action === "attack-as-ally" ||
            effect.action === "draw" ||
            effect.action === "grant-keyword" ||
            effect.action === "glimpse" ||
            effect.action === "look-at" ||
            effect.action === "play" ||
            effect.action === "pay-cost" ||
            effect.action === "recover" ||
            effect.action === "materialize" ||
            effect.action === "bestow" ||
            effect.action === "negate" ||
            effect.action === "redirect" ||
            effect.action === "intercept" ||
            effect.action === "declare-target" ||
            effect.action === "use-weapon-for-attack" ||
            effect.action === "suppress" ||
            effect.action === "level-up" ||
            effect.action === "wake" ||
            effect.action === "activate-fast" ||
            effect.action === "ignore-element-requirement")
        ) &&
        !(
          effect.mode === "modify-limit" &&
          (effect.action === "draw" || effect.action === "play" || effect.action === "recollect")
        ) &&
        !(
          effect.mode === "use-property" &&
          effect.action === "assign-combat-damage" &&
          effect.valueProperty !== undefined
        )
      ) {
        throw new GrandArchiveUnsupportedRuleError(
          `rule modification ${effect.mode} ${effect.action}`,
        );
      }
      const affectedObjects =
        effect.affectedSet === "locked" && effect.subject && effect.subject.kind !== "player"
          ? resolveGrandArchiveSubjectObjects(effect.subject, evaluation)
          : [];
      commit(execution, [
        {
          type: "rule-modification-created",
          modification: {
            id: `rule-modification-${execution.state.nextRuleModificationOrdinal}`,
            ...(evaluation.sourceId ? { sourceId: evaluation.sourceId } : {}),
            controllerId: evaluation.controllerId,
            effect,
            affectedObjectIds: affectedObjects.map((object) => object.id),
            affectedObjectIncarnations: Object.fromEntries(
              affectedObjects.map((object) => [object.id, object.incarnation]),
            ),
            bindings: evaluation.bindings,
            variables: evaluation.variables ?? {},
            durationAnchors: anchorGrandArchiveDuration(effect.duration, evaluation),
            createdAtVersion: execution.state.stateVersion,
            createdTurnNumber: execution.state.turn.number,
            createdPhase: execution.state.turn.phase,
          },
          cause: { kind: "rule", rule: "rule-modification-resolution" },
        },
      ]);
      return true;
    case "create-delayed-trigger":
      commit(execution, [
        {
          type: "delayed-trigger-created",
          trigger: createGrandArchiveDelayedTrigger(effect, evaluation),
          cause: { kind: "rule", rule: "delayed-trigger-created" },
        },
      ]);
      return true;
    case "summon": {
      const events = tokenSummonEvents(
        createdObjectsForEffect(effect, evaluation).map((object) =>
          applyEntryLinkHost(object, execution),
        ),
      );
      commit(execution, events);
      return true;
    }
    case "summon-copies": {
      const events = tokenSummonEvents(
        createdObjectsForEffect(effect, evaluation).map((object) =>
          applyEntryLinkHost(object, execution),
        ),
      );
      commit(execution, events);
      return events.length > 0;
    }
    case "generate": {
      const events = createdObjectsForEffect(effect, evaluation).flatMap(
        (object): readonly GrandArchiveProposedEvent[] => {
          const created = applyEntryLinkHost(object, execution);
          const creation: GrandArchiveProposedEvent = {
            type: "object-created",
            object: created,
            ...(effect.destination && created.zone === effect.destination.zone
              ? { placement: destinationPlacement(effect.destination) }
              : {}),
          };
          return (
            GRAND_ARCHIVE_PRIVATE_ZONES as readonly GrandArchiveCardInstance["zone"][]
          ).includes(created.zone)
            ? [
                creation,
                {
                  type: "card-revealed",
                  objectId: created.id,
                  playerId: created.ownerId,
                  revealedBeforePrivateEntry: true,
                  cause: { kind: "rule", rule: "specified-card-private-entry-reveal" },
                },
              ]
            : [creation];
        },
      );
      commit(execution, events);
      return true;
    }
    case "keyword-action": {
      if (effect.action === "glimpse") {
        throw new GrandArchiveUnsupportedRuleError("glimpse outside stack resolution");
      }
      const playerIds = resolveGrandArchivePlayers(effect.player ?? "controller", evaluation);
      if (playerIds.length !== 1) {
        throw new GrandArchiveUnsupportedRuleError(
          `${effect.action} requires exactly one affected player`,
        );
      }
      const playerId = playerIds[0]!;
      if (effect.action === "empower") {
        const amount = evaluateGrandArchiveAmount(effect.amount ?? 0, evaluation);
        if (amount <= 0) return false;
        const current = execution.state.players[playerId]?.states.empower;
        const existing = typeof current === "number" ? current : 0;
        commit(execution, [
          {
            type: "player-state-changed",
            playerId,
            state: "empower",
            value: existing + amount,
            cause: { kind: "rule", rule: "empower-keyword-action" },
          },
          {
            type: "keyword-action-performed",
            action: "empower",
            playerId,
            objectIds: [],
            amount,
            cause: { kind: "rule", rule: "empower-keyword-action" },
          },
        ]);
        return true;
      }
      if (effect.action === "gather") {
        const shuffled = shuffleGrandArchiveObjects(
          GRAND_ARCHIVE_GATHER_INGREDIENTS,
          execution.state.random,
        );
        const definitionId = findDefinitionId(execution.base.program, shuffled.value[0]!);
        const object = applyEntryLinkHost(
          createdObject(
            execution.base.program,
            definitionId,
            playerId,
            "field",
            execution.state.nextObjectOrdinal,
            true,
          ),
          execution,
        );
        commit(execution, [
          {
            type: "random-state-changed",
            random: shuffled.random,
            cause: { kind: "rule", rule: "gather-random-ingredient" },
          },
          {
            type: "tokens-summoned",
            playerId,
            objects: [object],
            actorId: playerId,
            cause: { kind: "rule", rule: "gather-summon" },
          },
          {
            type: "keyword-action-performed",
            action: "gather",
            playerId,
            objectIds: [object.id],
            cause: { kind: "rule", rule: "gather-keyword-action" },
          },
        ]);
        if (effect.bindResultAs) execution.bindings[effect.bindResultAs] = [object.id];
        return true;
      }
      if (effect.action === "scavenge") {
        if (!effect.filter) {
          throw new GrandArchiveUnsupportedRuleError("scavenge without a card filter");
        }
        const amount = Math.max(0, evaluateGrandArchiveAmount(effect.amount ?? 0, evaluation));
        if (amount === 0) {
          if (effect.bindResultAs) execution.bindings[effect.bindResultAs] = [];
          return false;
        }
        const deck = execution.state.zones[playerId]["main-deck"];
        const inspected = deck.slice(0, amount);
        const matchIndex = inspected.findIndex((objectId) => {
          const object = execution.state.objects[objectId];
          return object && matchesGrandArchiveCardFilter(object, effect.filter!, evaluation);
        });
        const revealed = inspected.slice(0, matchIndex >= 0 ? matchIndex + 1 : inspected.length);
        const matchId = matchIndex >= 0 ? revealed.at(-1) : undefined;
        const remainder = matchId ? revealed.slice(0, -1) : revealed;
        const shuffled = shuffleGrandArchiveObjects(remainder, execution.state.random);
        const untouched = deck.slice(revealed.length);
        const destination = effect.resultDestination?.zone ?? "hand";
        if (
          destination === "loaded" ||
          destination === "inner-lineage" ||
          destination === "intent"
        ) {
          throw new GrandArchiveUnsupportedRuleError(`scavenge destination ${destination}`);
        }
        const proposed: GrandArchiveProposedEvent[] = revealed.map((objectId) => ({
          type: "card-revealed",
          objectId,
          playerId,
          cause: { kind: "rule", rule: "scavenge-reveal" },
        }));
        proposed.push({
          type: "random-state-changed",
          random: shuffled.random,
          cause: { kind: "rule", rule: "scavenge-random-bottom-order" },
        });
        if (matchId) {
          proposed.push({
            type: "object-moved",
            objectId: matchId,
            from: "main-deck",
            to: destination,
            ...(destination === "field" ? { newControllerId: playerId } : {}),
            cause: { kind: "rule", rule: "scavenge-result" },
          });
        }
        proposed.push(
          {
            type: "zone-reordered",
            playerId,
            zone: "main-deck",
            objectIds: [...untouched, ...shuffled.value],
            cause: { kind: "rule", rule: "scavenge-remainder-bottomed" },
          },
          {
            type: "keyword-action-performed",
            action: "scavenge",
            playerId,
            objectIds: revealed,
            cause: { kind: "rule", rule: "scavenge-keyword-action" },
          },
        );
        commit(execution, proposed);
        if (effect.bindResultAs) execution.bindings[effect.bindResultAs] = matchId ? [matchId] : [];
        return true;
      }
      if (!effect.subject) {
        throw new GrandArchiveUnsupportedRuleError("suppress without a subject");
      }
      const suppressed = resolveGrandArchiveSubjectObjects(effect.subject, evaluation).filter(
        (object) =>
          object.zone === "field" &&
          !collectGrandArchiveActionRules({
            action: "suppress",
            activationKind: "ability",
            playerId: evaluation.controllerId,
            candidateId: object.id,
            fromZone: object.zone,
            evaluation: { ...evaluation, candidateId: object.id },
          }).some((rule) => rule.effect.mode === "forbid"),
      );
      if (suppressed.length === 0) {
        if (effect.bindResultAs) execution.bindings[effect.bindResultAs] = [];
        return false;
      }
      for (const object of suppressed) {
        commit(execution, [
          {
            type: "object-moved",
            objectId: object.id,
            from: "field",
            to: "banishment",
            ...(evaluation.sourceId ? { banishedBySourceId: evaluation.sourceId } : {}),
            cause: { kind: "rule", rule: "suppress-banish" },
          },
        ]);
        const delayedEvaluation = {
          ...context(execution),
          bindings: { ...execution.bindings, suppressedObject: [object.id] },
        };
        commit(execution, [
          {
            type: "delayed-trigger-created",
            trigger: createGrandArchiveDelayedTrigger(
              {
                kind: "create-delayed-trigger",
                trigger: {
                  kind: "event",
                  event: { name: "phase-begins", phase: "end" },
                },
                limit: 1,
                expires: { kind: "until-end-of-next-phase", phase: "end" },
                effect: {
                  kind: "move",
                  subject: { kind: "bound", binding: "suppressedObject" },
                  from: "banishment",
                  destination: {
                    zone: "field",
                    controller: { ownerOf: "suppressedObject" },
                  },
                },
              },
              delayedEvaluation,
            ),
            cause: { kind: "rule", rule: "suppress-return-trigger" },
          },
        ]);
      }
      commit(execution, [
        {
          type: "keyword-action-performed",
          action: "suppress",
          playerId,
          objectIds: suppressed.map((object) => object.id),
          cause: { kind: "rule", rule: "suppress-keyword-action" },
        },
      ]);
      if (effect.bindResultAs) {
        execution.bindings[effect.bindResultAs] = suppressed.map((object) => object.id);
      }
      return suppressed.length > 0;
    }
    case "lose-game": {
      const playerId = resolveSinglePlayer(effect.player, evaluation);
      commit(execution, [{ type: "player-lost", playerId, reason: "effect" }]);
      return true;
    }
    case "win-game": {
      const winnerId = resolveSinglePlayer(effect.player, evaluation);
      commit(execution, [
        { type: "game-outcome-declared", outcome: { kind: "wins", playerIds: [winnerId] } },
      ]);
      return true;
    }
    case "draw-game":
      commit(execution, [{ type: "game-outcome-declared", outcome: { kind: "draw" } }]);
      return true;
    case "sequence":
    case "conditional":
    case "repeat":
    case "for-each":
    case "for-each-player":
    case "perform-as":
    case "bind-value":
    case "attempt":
      return false;
    default:
      throw new GrandArchiveUnsupportedRuleError(`effect ${effect.kind}`);
  }
}

function executeCore(effect: GrandArchiveEffect, execution: MutableExecution): boolean {
  switch (effect.kind) {
    case "sequence":
      for (const child of effect.effects) execute(child, execution);
      return true;
    case "conditional": {
      const branch = evaluateGrandArchiveCondition(effect.condition, context(execution))
        ? effect.then
        : effect.else;
      return branch ? execute(branch, execution) : true;
    }
    case "repeat": {
      const count = evaluateGrandArchiveAmount(effect.count, context(execution));
      for (let index = 0; index < count; index += 1) execute(effect.effect, execution);
      return true;
    }
    case "for-each": {
      const objectIds = resolveGrandArchiveCollection(effect.collection, context(execution)).map(
        (object) => object.id,
      );
      for (const objectId of objectIds) {
        execution.bindings[effect.bindEachAs] = [objectId];
        execute(effect.effect, execution);
      }
      return true;
    }
    case "for-each-player": {
      const playerIds = resolveGrandArchivePlayers(effect.players, context(execution));
      for (const playerId of playerIds) {
        execution.bindings[effect.bindEachAs] = [playerId];
        execute(effect.effect, execution);
      }
      return true;
    }
    case "perform-as":
      return execute(effect.effect, execution);
    case "bind-value":
      execution.bindings[effect.bindAs] = evaluateGrandArchiveAmount(
        effect.value,
        context(execution),
      );
      return execute(effect.effect, execution);
    case "attempt": {
      const before = execution.proposedActionCount;
      const performed = execute(effect.effect, execution);
      execution.bindings[effect.bindSucceededAs] =
        performed && execution.proposedActionCount > before;
      return true;
    }
    default:
      return executeAtomic(effect, execution);
  }
}

function committedObjectIds(
  events: readonly GrandArchiveCommittedEvent[],
): readonly GrandArchiveObjectId[] {
  return [
    ...new Set(
      events.flatMap((event): readonly GrandArchiveObjectId[] => {
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

function committedCounterRemovalAmount(
  events: readonly GrandArchiveCommittedEvent[],
  counter: string,
): number {
  return events.reduce(
    (total, event) =>
      total +
      ((event.type === "counter-changed" || event.type === "mastery-counter-changed") &&
      event.counter === counter &&
      event.delta < 0
        ? -event.delta
        : 0),
    0,
  );
}

function updateModifiedAbilityResultBindings(
  effect: GrandArchiveEffect,
  committedEvents: readonly GrandArchiveCommittedEvent[],
  bindings: Record<string, GrandArchiveExecutionBinding>,
): void {
  const metric = grandArchiveModifiedResultMetricForEffect(effect);
  if (!metric) return;
  bindings[grandArchiveModifiedResultBinding(metric)] = grandArchiveModifiedResultAmount(
    metric,
    committedEvents,
  );
}

function execute(effect: GrandArchiveEffect, execution: MutableExecution): boolean {
  const before = execution.events.length;
  const succeeded = executeCore(effect, execution);
  const committedEvents = execution.events.slice(before);
  if ("bindResultAs" in effect && effect.bindResultAs) {
    if (execution.bindings[effect.bindResultAs] === undefined) {
      execution.bindings[effect.bindResultAs] =
        effect.kind === "remove-counter"
          ? committedCounterRemovalAmount(committedEvents, grandArchiveCounterKey(effect.counter))
          : committedObjectIds(committedEvents);
    }
  }
  updateModifiedAbilityResultBindings(effect, committedEvents, execution.bindings);
  return succeeded;
}

export function executeGrandArchiveEffect(
  effect: GrandArchiveEffect,
  input: GrandArchiveEffectExecutionInput,
  commitEffectEvents: GrandArchiveEffectCommit,
): GrandArchiveEffectExecutionResult {
  const execution: MutableExecution = {
    state: input.state,
    bindings: { ...input.bindings },
    events: [],
    proposedActionCount: 0,
    deferredStackItems: [],
    base: {
      program: input.program,
      controllerId: input.controllerId,
      ...(input.sourceId ? { sourceId: input.sourceId } : {}),
      ...(input.abilityBearerId ? { abilityBearerId: input.abilityBearerId } : {}),
      ...(input.sourceIdentityId ? { sourceIdentityId: input.sourceIdentityId } : {}),
      ...(input.sourceIncarnation !== undefined
        ? { sourceIncarnation: input.sourceIncarnation }
        : {}),
      ...(input.sourceLkiEventId ? { sourceLkiEventId: input.sourceLkiEventId } : {}),
      ...(input.objectInformationBasis
        ? { objectInformationBasis: input.objectInformationBasis }
        : {}),
      ...(input.sourceInformationBasis
        ? { sourceInformationBasis: input.sourceInformationBasis }
        : {}),
      ...(input.abilityId ? { abilityId: input.abilityId } : {}),
      ...(input.candidateId ? { candidateId: input.candidateId } : {}),
      ...(input.variables ? { variables: input.variables } : {}),
      ...(input.resultVariables ? { resultVariables: input.resultVariables } : {}),
      ...(input.championLevelModifier
        ? { championLevelModifier: input.championLevelModifier }
        : {}),
      ...(input.resolutionStartedEventHistoryIndex !== undefined
        ? { resolutionStartedEventHistoryIndex: input.resolutionStartedEventHistoryIndex }
        : {}),
      ...(input.resolvingStackItemId ? { resolvingStackItemId: input.resolvingStackItemId } : {}),
      ...(input.pendingMoveIncarnations
        ? { pendingMoveIncarnations: input.pendingMoveIncarnations }
        : {}),
      ...(input.entryLinkHostIds ? { entryLinkHostIds: input.entryLinkHostIds } : {}),
      ...(input.orderedPrivatePlacementKnowledge
        ? { orderedPrivatePlacementKnowledge: input.orderedPrivatePlacementKnowledge }
        : {}),
    },
    commit: commitEffectEvents,
  };
  const performed = execute(effect, execution) && execution.proposedActionCount > 0;
  const resultObjectIds = committedObjectIds(execution.events);
  return {
    state: execution.state,
    events: execution.events,
    bindings: execution.bindings,
    outcome: performed ? "performed" : "not-performed",
    resultObjectIds,
    deferredStackItems: execution.deferredStackItems,
  };
}
