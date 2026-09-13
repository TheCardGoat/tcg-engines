import type { GrandArchiveProposedEvent } from "../../kernel/events.ts";
import { grandArchiveDecisionId } from "../../game/identity.ts";
import { grandArchiveCharacteristicsAreSiegeable } from "../../game/functional-subtypes.ts";
import type { GrandArchiveObjectId, GrandArchivePlayerId } from "../../game/identity.ts";
import type { GrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveCardInstance, GrandArchiveMatchState } from "../../game/model.ts";
import type { GrandArchiveStackItem } from "../../game/model.ts";

type GrandArchiveCardStackItem = Extract<
  GrandArchiveStackItem,
  { readonly kind: "card-activation" | "materialization" | "bestowment" }
>;
import {
  collectExpiredGrandArchiveContinuousEffects,
  deriveGrandArchiveController,
  deriveGrandArchiveNumericProperty,
  grandArchiveObjectCurrentCharacteristics,
} from "./continuous.ts";
import { collectExpiredGrandArchiveDelayedTriggers } from "../abilities/delayed-triggers.ts";
import { collectGrandArchiveInvalidCombatRoleEvents } from "../../procedures/combat/combat.ts";
import {
  grandArchiveObjectActiveAbilities,
  grandArchiveObjectHasActiveKeyword,
} from "../abilities/intrinsic-keywords.ts";
import { grandArchiveActiveLinkKeywords, grandArchiveLinkIsLegal } from "../../game/link.ts";
import { collectExpiredGrandArchiveReplacementEffects } from "../replacements/replacements.ts";
import { collectExpiredGrandArchiveRuleModifications } from "./rule-modifications.ts";
import { grandArchivePlayerHasState } from "./player-continuous.ts";
import {
  evaluateGrandArchiveStackItemTargetLegality,
  grandArchiveFizzledCardDispositionEvent,
  grandArchiveStackItemStateBasedFizzleReason,
} from "../../procedures/effects/stack-resolution.ts";

function isDepartedToken(object: GrandArchiveCardInstance): object is GrandArchiveCardInstance & {
  readonly zone: Exclude<GrandArchiveCardInstance["zone"], "field">;
} {
  return object.isToken && object.zone !== "field";
}

function isExpiredNonFieldCopy(
  object: GrandArchiveCardInstance,
  state: GrandArchiveMatchState,
): object is GrandArchiveCardInstance & {
  readonly zone: Exclude<GrandArchiveCardInstance["zone"], "field">;
} {
  if (!object.copy || object.zone === "field") return false;
  if (object.copy.expires === "end-of-combat") {
    return object.zone !== "intent" || state.combat === null;
  }
  return !state.stack.some(
    (item) =>
      (item.kind === "card-activation" ||
        item.kind === "materialization" ||
        item.kind === "bestowment") &&
      item.cardId === object.id,
  );
}

function objectSpecificZoneEntryIndex(
  state: GrandArchiveMatchState,
  object: GrandArchiveCardInstance,
): number {
  for (let index = state.eventHistory.length - 1; index >= 0; index -= 1) {
    const event = state.eventHistory[index]!;
    if (
      event.type === "object-moved" &&
      event.objectId === object.id &&
      event.to === object.zone &&
      event.hostId === object.hostId
    ) {
      return index;
    }
    if (
      object.zone === "inner-lineage" &&
      event.type === "champion-leveled-up" &&
      event.cardId === object.id &&
      event.championId === object.hostId
    ) {
      return index;
    }
    if (event.type === "object-created" && event.object.id === object.id) return index;
  }
  return -1;
}

/**
 * Object-specific zones belong to one field incarnation of their host. A host
 * that leaves and re-enters is a new object even though its stable id is reused,
 * so checking only its current zone would incorrectly preserve the old cards.
 */
function objectSpecificZoneHostLeftField(
  state: GrandArchiveMatchState,
  object: GrandArchiveCardInstance,
): boolean {
  if ((object.zone !== "loaded" && object.zone !== "inner-lineage") || !object.hostId) {
    return false;
  }
  const host = state.objects[object.hostId];
  if (!host || host.zone !== "field") return true;
  const entryIndex = objectSpecificZoneEntryIndex(state, object);
  return state.eventHistory
    .slice(entryIndex + 1)
    .some(
      (event) =>
        (event.type === "object-moved" &&
          event.objectId === object.hostId &&
          event.from === "field") ||
        (event.type === "object-removed-from-game" &&
          event.object.id === object.hostId &&
          event.object.zone === "field"),
    );
}

function stackItemCardId(item: GrandArchiveStackItem): GrandArchiveObjectId | undefined {
  return item.kind === "card-activation" ||
    item.kind === "materialization" ||
    item.kind === "bestowment"
    ? item.cardId
    : undefined;
}

function isCardStackItem(item: GrandArchiveStackItem): item is GrandArchiveCardStackItem {
  return (
    item.kind === "card-activation" || item.kind === "materialization" || item.kind === "bestowment"
  );
}

function latestStackItemForCard(
  state: GrandArchiveMatchState,
  cardId: GrandArchiveObjectId,
): GrandArchiveCardStackItem | undefined {
  for (let index = state.eventHistory.length - 1; index >= 0; index -= 1) {
    const event = state.eventHistory[index]!;
    if (
      event.type !== "stack-item-added" &&
      event.type !== "stack-item-deferred" &&
      event.type !== "deferred-stack-item-promoted" &&
      event.type !== "stack-item-retargeted" &&
      event.type !== "stack-item-targets-invalidated" &&
      event.type !== "stack-item-fizzled" &&
      event.type !== "stack-item-negated"
    ) {
      continue;
    }
    if (isCardStackItem(event.item) && event.item.cardId === cardId) return event.item;
  }
  return undefined;
}

function stackFizzleOpportunityEvents(
  state: GrandArchiveMatchState,
  fizzledIds: ReadonlySet<GrandArchiveStackItem["id"]>,
): readonly GrandArchiveProposedEvent[] {
  const topItem = state.stack.at(-1);
  const remainingStack = state.stack.filter((item) => !fizzledIds.has(item.id));
  const holderId = state.opportunity?.holderId ?? state.turn.playerId;
  return topItem &&
    fizzledIds.has(topItem.id) &&
    remainingStack.every((item) => item.opportunityPolicy === "normal") &&
    (state.opportunity !== null ||
      remainingStack.length > 0 ||
      topItem.opportunityPolicy === "interdiction")
    ? [
        {
          type: "opportunity-opened",
          window: {
            holderId,
            startedById: holderId,
            passedPlayerIds: [],
            reason: "state-based-stack-change",
          },
          cause: { kind: "rule", rule: "top-stack-item-fizzled" },
        },
      ]
    : [];
}

function finishEvents(
  state: GrandArchiveMatchState,
  losingPlayers: ReadonlySet<GrandArchivePlayerId>,
): readonly GrandArchiveProposedEvent[] {
  const remaining = state.turnOrder.filter(
    (playerId) => state.players[playerId]?.lost === false && !losingPlayers.has(playerId),
  );
  return remaining.length <= 1
    ? [
        {
          type: "match-finished" as const,
          winnerIds: remaining,
          cause: { kind: "rule" as const, rule: "game-ending-state-check" },
        },
      ]
    : [];
}

function previousControllerAfterPlayerLoss(
  state: GrandArchiveMatchState,
  object: GrandArchiveCardInstance,
): GrandArchivePlayerId | undefined {
  const isActive = (playerId: GrandArchivePlayerId) => state.players[playerId]?.lost === false;
  if (isActive(object.baseControllerId)) return object.baseControllerId;
  let currentControllerId = object.baseControllerId;
  for (let index = state.eventHistory.length - 1; index >= 0; index -= 1) {
    const event = state.eventHistory[index]!;
    if (
      event.type !== "object-controller-changed" ||
      event.continuousDerivation ||
      event.objectId !== object.id ||
      event.controllerId !== currentControllerId
    ) {
      continue;
    }
    const previousControllerId = event.previousBaseControllerId ?? object.ownerId;
    if (isActive(previousControllerId)) return previousControllerId;
    currentControllerId = previousControllerId;
  }
  return isActive(object.ownerId) ? object.ownerId : undefined;
}

function playerLossCleanupEvents(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
): readonly GrandArchiveProposedEvent[] {
  const lostPlayerIds = new Set(
    state.turnOrder.filter((playerId) => state.players[playerId]?.lost === true),
  );
  if (lostPlayerIds.size === 0) return [];
  const pendingCardIds = new Set(
    state.stack.flatMap((item) =>
      item.kind === "card-activation" ||
      item.kind === "materialization" ||
      item.kind === "bestowment"
        ? [item.cardId]
        : [],
    ),
  );
  const events: GrandArchiveProposedEvent[] = [];
  for (const object of Object.values(state.objects)) {
    if (lostPlayerIds.has(object.ownerId)) {
      if (object.zone === "effects-stack" && pendingCardIds.has(object.id)) continue;
      events.push({
        type: "object-removed-from-game",
        object,
        losingPlayerId: object.ownerId,
        ...(object.zone === "field" &&
        grandArchiveObjectCurrentCharacteristics(program, state, object).types.includes("CHAMPION")
          ? { leftFieldAsChampion: true as const }
          : {}),
        cause: { kind: "rule", rule: "losing-player-owned-object-removed" },
      });
      continue;
    }
    if (!lostPlayerIds.has(object.controllerId)) continue;
    const previousControllerId = previousControllerAfterPlayerLoss(state, object);
    if (previousControllerId) {
      events.push({
        type: "object-controller-changed",
        objectId: object.id,
        controllerId: previousControllerId,
        cause: { kind: "rule", rule: "losing-player-control-restored" },
      });
    } else {
      events.push({
        type: "object-removed-from-game",
        object,
        losingPlayerId: object.controllerId,
        ...(object.zone === "field" &&
        grandArchiveObjectCurrentCharacteristics(program, state, object).types.includes("CHAMPION")
          ? { leftFieldAsChampion: true as const }
          : {}),
        cause: { kind: "rule", rule: "losing-player-controlled-object-ceased" },
      });
    }
  }
  return events;
}

function playerLossFlowEvents(
  state: GrandArchiveMatchState,
  activePlayers: readonly GrandArchivePlayerId[],
): readonly GrandArchiveProposedEvent[] {
  const nextActivePlayerAfter = (playerId: GrandArchivePlayerId) => {
    const start = state.turnOrder.indexOf(playerId);
    for (let offset = 1; offset <= state.turnOrder.length; offset += 1) {
      const candidate = state.turnOrder[(start + offset) % state.turnOrder.length];
      if (candidate && activePlayers.includes(candidate)) return candidate;
    }
    return undefined;
  };
  const activeTurnPlayerLost = state.players[state.turn.playerId]?.lost === true;
  if (
    activeTurnPlayerLost &&
    state.stack.length === 0 &&
    !state.resolution &&
    state.turn.phase !== "end"
  ) {
    const nextPlayerId = nextActivePlayerAfter(state.turn.playerId);
    if (!nextPlayerId) return [];
    return [
      ...(state.opportunity
        ? ([
            {
              type: "opportunity-closed",
              cause: { kind: "rule", rule: "losing-active-player-opportunity-ended" },
            },
          ] as const)
        : []),
      {
        type: "phase-changed",
        phase: "end",
        actorId: state.turn.playerId,
        cause: { kind: "rule", rule: "losing-active-player-end-phase" },
      },
      {
        type: "opportunity-opened",
        window: {
          holderId: nextPlayerId,
          startedById: nextPlayerId,
          passedPlayerIds: [],
          reason: "phase-begin",
        },
        cause: { kind: "rule", rule: "losing-active-player-end-phase-opportunity" },
      },
    ];
  }
  if (state.opportunity && state.players[state.opportunity.holderId]?.lost) {
    const nextPlayerId = nextActivePlayerAfter(state.opportunity.holderId);
    if (!nextPlayerId) return [];
    return [
      {
        type: "opportunity-closed",
        cause: { kind: "rule", rule: "losing-player-opportunity-ended" },
      },
      {
        type: "opportunity-opened",
        window: {
          holderId: nextPlayerId,
          startedById: nextPlayerId,
          passedPlayerIds: [],
          reason: state.opportunity.reason,
        },
        cause: { kind: "rule", rule: "losing-player-opportunity-continued" },
      },
    ];
  }
  return [];
}

function lethalCombatParticipantIds(
  state: GrandArchiveMatchState,
  object: GrandArchiveCardInstance,
  life: number,
): readonly GrandArchiveObjectId[] {
  let resetIndex = -1;
  for (let index = state.eventHistory.length - 1; index >= 0; index -= 1) {
    const event = state.eventHistory[index]!;
    if (
      (event.type === "damage-cleared" && event.objectId === object.id) ||
      (event.type === "object-moved" && event.objectId === object.id && event.to === "field") ||
      (event.type === "object-created" && event.object.id === object.id) ||
      (event.type === "tokens-summoned" &&
        event.objects.some((summoned) => summoned.id === object.id))
    ) {
      resetIndex = index;
      break;
    }
  }
  const contributions: {
    readonly delta: number;
    readonly combatDamage: boolean;
    readonly sourceId?: GrandArchiveObjectId;
    readonly combatParticipantIds?: readonly GrandArchiveObjectId[];
  }[] = [];
  for (const event of state.eventHistory.slice(resetIndex + 1)) {
    if (event.type === "damage-marked" && event.objectId === object.id) {
      contributions.push({
        delta: event.amount,
        combatDamage: event.combatDamage === true,
        ...(event.sourceId ? { sourceId: event.sourceId } : {}),
        ...(event.combatParticipantIds ? { combatParticipantIds: event.combatParticipantIds } : {}),
      });
      continue;
    }
    if (event.type === "damage-removed" && event.objectId === object.id) {
      contributions.push({ delta: -event.amount, combatDamage: false });
      continue;
    }
    if (
      event.type === "counter-changed" &&
      event.objectId === object.id &&
      event.counter === "damage"
    ) {
      contributions.push({ delta: event.delta, combatDamage: false });
    }
  }
  let markedDamage = object.damage - contributions.reduce((total, entry) => total + entry.delta, 0);
  for (const contribution of contributions) {
    const before = markedDamage;
    markedDamage += contribution.delta;
    if (before < life && markedDamage >= life && contribution.combatDamage) {
      return (
        contribution.combatParticipantIds ?? (contribution.sourceId ? [contribution.sourceId] : [])
      );
    }
  }
  return [];
}

function collectControlDerivationEvents(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
): readonly GrandArchiveProposedEvent[] {
  return Object.values(state.objects).flatMap((object) => {
    const derived = deriveGrandArchiveController(object, {
      program,
      state,
      controllerId: object.controllerId,
      sourceId: object.id,
      abilityBearerId: object.id,
      bindings: {},
    });
    return derived.controllerId === object.controllerId
      ? []
      : [
          {
            type: "object-controller-changed" as const,
            objectId: object.id,
            controllerId: derived.controllerId,
            continuousDerivation: derived.effectId ? { effectId: derived.effectId } : {},
            cause: { kind: "rule" as const, rule: "continuous-control-layer" },
          },
        ];
  });
}

function collectDamageStateBasedEvents(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
): readonly GrandArchiveProposedEvent[] {
  const deaths: GrandArchiveCardInstance[] = [];
  const losingPlayers = new Set<GrandArchivePlayerId>();

  for (const object of Object.values(state.objects)) {
    if (object.zone !== "field") continue;
    const characteristics = grandArchiveObjectCurrentCharacteristics(program, state, object);
    const isUnit =
      characteristics.types.includes("ALLY") || characteristics.types.includes("CHAMPION");
    const life = deriveGrandArchiveNumericProperty(object, "life", {
      program,
      state,
      controllerId: object.controllerId,
      sourceId: object.id,
      abilityBearerId: object.id,
      bindings: {},
    });
    const immortal = grandArchiveObjectHasActiveKeyword(program, state, object, "immortality");
    if (isUnit && life !== undefined && object.damage >= life) {
      if (!immortal) {
        deaths.push(object);
        if (characteristics.types.includes("CHAMPION")) losingPlayers.add(object.controllerId);
      }
    }
  }

  if (deaths.length === 0) return [];
  const events: GrandArchiveProposedEvent[] = [];
  for (const object of deaths) {
    const life = deriveGrandArchiveNumericProperty(object, "life", {
      program,
      state,
      controllerId: object.controllerId,
      sourceId: object.id,
      abilityBearerId: object.id,
      bindings: {},
    });
    const killedByIds = life === undefined ? [] : lethalCombatParticipantIds(state, object, life);
    events.push({
      type: "object-moved",
      objectId: object.id,
      from: "field",
      to: "graveyard",
      ...(killedByIds.length > 0 ? { killedByIds } : {}),
      // All lethal-damage departures share this checkpoint, even if an aura
      // source is committed before one of its recipients.
      previousAbilities: grandArchiveObjectActiveAbilities(program, state, object),
      cause: { kind: "rule", rule: "lethal-damage-state-check" },
    });
  }
  for (const playerId of losingPlayers) {
    events.push({
      type: "player-lost",
      playerId,
      reason: "champion-died",
      cause: { kind: "rule", rule: "champion-died-state-check" },
    });
  }
  events.push(...finishEvents(state, losingPlayers));
  return events;
}

function collectDurabilityStateBasedEvents(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
): readonly GrandArchiveProposedEvent[] {
  return Object.values(state.objects).flatMap((object): readonly GrandArchiveProposedEvent[] => {
    if (object.zone !== "field") return [];
    const characteristics = grandArchiveObjectCurrentCharacteristics(program, state, object);
    const usesDurabilityStateCheck =
      characteristics.types.includes("WEAPON") ||
      grandArchiveCharacteristicsAreSiegeable(characteristics) ||
      (characteristics.types.includes("DOMAIN") &&
        grandArchiveObjectHasActiveKeyword(program, state, object, "siegeable"));
    if (!usesDurabilityStateCheck) return [];
    const durability = deriveGrandArchiveNumericProperty(object, "durability", {
      program,
      state,
      controllerId: object.controllerId,
      sourceId: object.id,
      abilityBearerId: object.id,
      bindings: {},
    });
    if (
      durability === undefined ||
      (object.counters.durability ?? 0) > 0 ||
      grandArchiveObjectHasActiveKeyword(program, state, object, "immortality")
    ) {
      return [];
    }
    return [
      {
        type: "object-moved",
        objectId: object.id,
        from: "field",
        to: "graveyard",
        cause: { kind: "rule", rule: "zero-durability-state-check" },
      },
    ];
  });
}

function collectUniqueObjectStateBasedDecision(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
): readonly GrandArchiveProposedEvent[] {
  const uniqueGroups = new Map<
    string,
    {
      readonly playerId: GrandArchivePlayerId;
      readonly name: string;
      readonly candidates: GrandArchiveObjectId[];
    }
  >();
  for (const object of Object.values(state.objects)) {
    if (object.zone !== "field") continue;
    const characteristics = grandArchiveObjectCurrentCharacteristics(program, state, object);
    if (!characteristics.supertypes.includes("UNIQUE")) continue;
    for (const name of characteristics.names) {
      const key = `${object.controllerId}\u0000${name}`;
      const group = uniqueGroups.get(key) ?? {
        playerId: object.controllerId,
        name,
        candidates: [],
      };
      group.candidates.push(object.id);
      uniqueGroups.set(key, group);
    }
  }
  for (const group of uniqueGroups.values()) {
    if (group.candidates.length < 2) continue;
    return [
      {
        type: "decision-created",
        decision: {
          id: grandArchiveDecisionId(`decision-${state.nextDecisionOrdinal}`),
          kind: "choose-unique-object",
          playerId: group.playerId,
          name: group.name,
          candidates: group.candidates,
          stateVersion: state.stateVersion,
        },
        cause: { kind: "rule", rule: "unique-object-state-check" },
      },
    ];
  }
  return [];
}

/**
 * Performs one ordered CR state-based pass. The caller repeats passes until no
 * events remain, or pauses when a player decision is required.
 */
export function collectGrandArchiveStateBasedEvents(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
): readonly GrandArchiveProposedEvent[] {
  if (state.status !== "playing" || state.decision) return [];
  if (state.pendingGameOutcome?.kind === "draw") {
    return [
      {
        type: "match-finished",
        winnerIds: [],
        cause: { kind: "rule", rule: "effect-declared-game-draw" },
      },
    ];
  }
  const activePlayers = state.turnOrder.filter(
    (playerId) => state.players[playerId]?.lost === false,
  );
  if (activePlayers.length <= 1 && activePlayers.length < state.turnOrder.length) {
    return [
      {
        type: "match-finished",
        winnerIds: activePlayers,
        cause: { kind: "rule", rule: "last-player-standing" },
      },
    ];
  }
  const lossCleanup = playerLossCleanupEvents(program, state);
  if (lossCleanup.length > 0) return lossCleanup;
  const lossFlow = playerLossFlowEvents(state, activePlayers);
  if (lossFlow.length > 0) return lossFlow;
  // Continuous layers define the current state inspected by the ordered checks below.
  const controlChanges = collectControlDerivationEvents(program, state);
  if (controlChanges.length > 0) return controlChanges;
  const alwaysDistantRangers = Object.values(state.objects).filter((object) => {
    if (object.zone !== "field" || object.states.has("distant")) return false;
    if (
      !grandArchivePlayerHasState(program, state, object.controllerId, {
        named: "ranger-units-always-distant",
      })
    )
      return false;
    const characteristics = grandArchiveObjectCurrentCharacteristics(program, state, object);
    return (
      characteristics.classes.includes("RANGER") &&
      characteristics.types.some((type) => type === "ALLY" || type === "CHAMPION")
    );
  });
  if (alwaysDistantRangers.length > 0) {
    return alwaysDistantRangers.map((object) => ({
      type: "object-state-changed" as const,
      objectId: object.id,
      state: "distant" as const,
      value: true,
      cause: { kind: "rule" as const, rule: "ranger-units-always-distant" },
    }));
  }
  const championAbsentPlayers = new Set(
    activePlayers.filter((playerId) => {
      if (!state.players[playerId]?.hasControlledChampion) return false;
      return !Object.values(state.objects).some(
        (object) =>
          object.zone === "field" &&
          object.controllerId === playerId &&
          grandArchiveObjectCurrentCharacteristics(program, state, object).types.includes(
            "CHAMPION",
          ),
      );
    }),
  );
  if (championAbsentPlayers.size > 0) {
    return [
      ...[...championAbsentPlayers].map((playerId): GrandArchiveProposedEvent => ({
        type: "player-lost",
        playerId,
        reason: "champion-absent",
        cause: { kind: "rule", rule: "champion-absent-state-check" },
      })),
      ...finishEvents(state, championAbsentPlayers),
    ];
  }
  // CR State-Based Checks — Types 2–4: Damage, Durability, then Unique Objects.
  const damage = collectDamageStateBasedEvents(program, state);
  if (damage.length > 0) return damage;
  const durability = collectDurabilityStateBasedEvents(program, state);
  if (durability.length > 0) return durability;
  const uniqueObjectDecision = collectUniqueObjectStateBasedDecision(program, state);
  if (uniqueObjectDecision.length > 0) return uniqueObjectDecision;
  // CR State-Based Checks — Type 5: copies and tokens outside their functional zone cease next.
  const departedTokens = Object.values(state.objects).filter(isDepartedToken);
  if (departedTokens.length > 0) {
    return departedTokens.map((object) => ({
      type: "object-ceased" as const,
      objectId: object.id,
      from: object.zone,
      cause: { kind: "rule" as const, rule: "token-left-field" },
    }));
  }
  const expiredCopies = Object.values(state.objects).filter((object) =>
    isExpiredNonFieldCopy(object, state),
  );
  if (expiredCopies.length > 0) {
    return expiredCopies.map((object) => ({
      type: "object-ceased" as const,
      objectId: object.id,
      from: object.zone,
      cause: { kind: "rule" as const, rule: "copy-duration-ended" },
    }));
  }
  const orphanedObjectSpecificZoneCards = Object.values(state.objects).filter((object) =>
    objectSpecificZoneHostLeftField(state, object),
  );
  if (orphanedObjectSpecificZoneCards.length > 0) {
    return orphanedObjectSpecificZoneCards.map((object) => ({
      type: "object-moved" as const,
      objectId: object.id,
      from: object.zone,
      to: grandArchiveObjectCurrentCharacteristics(program, state, object).supertypes.includes(
        "REGALIA",
      )
        ? ("banishment" as const)
        : ("graveyard" as const),
      cause: { kind: "rule" as const, rule: "object-specific-zone-host-left-field" },
    }));
  }

  const brokenLinks = Object.values(state.objects).filter(
    (object) =>
      object.zone === "field" &&
      (object.hostId !== undefined ||
        grandArchiveActiveLinkKeywords(program, state, object).length > 0) &&
      !grandArchiveLinkIsLegal(program, state, object),
  );
  if (brokenLinks.length > 0) {
    return brokenLinks.map((object) => {
      const linkShield = grandArchiveObjectHasActiveKeyword(program, state, object, "link-shield");
      return {
        type: "object-moved" as const,
        objectId: object.id,
        from: "field" as const,
        to: "graveyard" as const,
        cause: {
          kind: "rule" as const,
          rule: linkShield ? "broken-link-shield-destroy" : "broken-link-sacrifice",
        },
      };
    });
  }

  const invalidCombatRoles = collectGrandArchiveInvalidCombatRoleEvents(program, state);
  if (invalidCombatRoles.length > 0) return invalidCombatRoles;

  const targetStateEvents = state.stack.flatMap((item): readonly GrandArchiveProposedEvent[] => {
    const legality = evaluateGrandArchiveStackItemTargetLegality(program, state, item);
    const changed = item.targets.some((target, index) => {
      const legal = legality.targets[index];
      return (
        !legal ||
        legal.binding !== target.binding ||
        legal.targetIds.length !== target.targetIds.length ||
        legal.targetIds.some((targetId, targetIndex) => targetId !== target.targetIds[targetIndex])
      );
    });
    if (!changed) return [];
    const updatedItem = { ...item, targets: legality.targets };
    return legality.anyRequiredTargetInvalid
      ? [
          {
            type: "stack-item-fizzled",
            item: updatedItem,
            reason: "required-target-invalid",
            cause: { kind: "rule", rule: "pending-stack-item-fizzled" },
          },
        ]
      : [
          {
            type: "stack-item-targets-invalidated",
            item: updatedItem,
            cause: { kind: "rule", rule: "illegal-target-state-check" },
          },
        ];
  });
  if (targetStateEvents.length > 0) {
    const fizzledIds = new Set(
      targetStateEvents.flatMap((event) =>
        event.type === "stack-item-fizzled" ? [event.item.id] : [],
      ),
    );
    return [...targetStateEvents, ...stackFizzleOpportunityEvents(state, fizzledIds)];
  }

  // CR State-Based Checks — Type 9: only after combat-role and targeting
  // checks does a source card with no remaining resolving instance leave the
  // Effects Stack.
  const orphanedStackCards = Object.values(state.objects).flatMap((object) => {
    if (
      object.zone !== "effects-stack" ||
      object.copy ||
      state.stack.some((item) => stackItemCardId(item) === object.id)
    ) {
      return [];
    }
    const item = latestStackItemForCard(state, object.id);
    return item ? [{ object, item }] : [];
  });
  if (orphanedStackCards.length > 0) {
    return orphanedStackCards.map(({ object, item }) => {
      const specifiedDestination = grandArchiveFizzledCardDispositionEvent(program, state, item);
      if (specifiedDestination) return specifiedDestination;
      const characteristics = grandArchiveObjectCurrentCharacteristics(program, state, object);
      const to =
        item.activationStates.includes("ephemeral") ||
        item.originZone === "material-deck" ||
        item.paidCostKind === "memory" ||
        characteristics.supertypes.includes("REGALIA")
          ? ("banishment" as const)
          : ("graveyard" as const);
      return {
        type: "object-moved" as const,
        objectId: object.id,
        from: "effects-stack" as const,
        to,
        cause: { kind: "rule" as const, rule: "card-without-pending-stack-instance" },
      };
    });
  }

  // CR State-Based Checks — Type 10: pending instances then validate their
  // own source and any remaining restrictions, and fizzle when illegal.
  const fizzledStackItems = state.stack.flatMap((item): readonly GrandArchiveProposedEvent[] => {
    const reason = grandArchiveStackItemStateBasedFizzleReason(program, state, item);
    return reason
      ? [
          {
            type: "stack-item-fizzled",
            item,
            reason,
            cause: { kind: "rule", rule: "pending-stack-item-fizzled" },
          },
        ]
      : [];
  });
  if (fizzledStackItems.length > 0) {
    const fizzledIds = new Set(
      fizzledStackItems.flatMap((event) =>
        event.type === "stack-item-fizzled" ? [event.item.id] : [],
      ),
    );
    return [...fizzledStackItems, ...stackFizzleOpportunityEvents(state, fizzledIds)];
  }

  const expiredDelayedTriggers = collectExpiredGrandArchiveDelayedTriggers(state);
  if (expiredDelayedTriggers.length > 0) {
    return expiredDelayedTriggers.map((triggerId) => ({
      type: "delayed-trigger-removed" as const,
      triggerId,
      cause: { kind: "rule" as const, rule: "delayed-trigger-duration-ended" },
    }));
  }

  const expiredEffects = collectExpiredGrandArchiveContinuousEffects({
    program,
    state,
    controllerId: state.turn.playerId,
    bindings: {},
  });
  if (expiredEffects.length > 0) {
    return expiredEffects.map((effectId) => ({
      type: "continuous-effect-expired" as const,
      effectId,
      cause: { kind: "rule" as const, rule: "continuous-duration-ended" },
    }));
  }

  const expiredReplacementEffects = collectExpiredGrandArchiveReplacementEffects(program, state);
  if (expiredReplacementEffects.length > 0) {
    return expiredReplacementEffects.map((replacementId) => ({
      type: "replacement-effect-expired" as const,
      replacementId,
      cause: { kind: "rule" as const, rule: "replacement-duration-ended" },
    }));
  }

  const expiredRuleModifications = collectExpiredGrandArchiveRuleModifications(program, state);
  if (expiredRuleModifications.length > 0) {
    return expiredRuleModifications.map((modificationId) => ({
      type: "rule-modification-expired" as const,
      modificationId,
      cause: { kind: "rule" as const, rule: "rule-modification-duration-ended" },
    }));
  }

  const pendingOutcome = state.pendingGameOutcome;
  if (pendingOutcome) {
    const activeWinnerIds = pendingOutcome.playerIds.filter(
      (playerId) => state.players[playerId]?.lost === false,
    );
    if (activeWinnerIds.length === 0) {
      return [
        {
          type: "game-outcome-cleared",
          cause: { kind: "rule", rule: "declared-winner-also-lost" },
        },
      ];
    }
    const activePlayerIds = state.turnOrder.filter(
      (playerId) => state.players[playerId]?.lost === false,
    );
    const everyRemainingPlayerWon = activePlayerIds.every((playerId) =>
      activeWinnerIds.includes(playerId),
    );
    return [
      {
        type: "match-finished",
        winnerIds: everyRemainingPlayerWon ? [] : activeWinnerIds,
        cause: {
          kind: "rule",
          rule: everyRemainingPlayerWon
            ? "all-remaining-players-won-draw"
            : "effect-declared-player-win",
        },
      },
    ];
  }

  return [];
}
