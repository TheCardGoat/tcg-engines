/**
 * Move Log Factory
 *
 * Converts the typed log entries emitted by move handlers (via ctx.framework.log())
 * into unified MoveLog entries. Each move handler still calls ctx.framework.log()
 * with a LorcanaGameLogEntry — this module converts those to the new MoveLog format.
 *
 * System events (TURN_STARTED, GAME_ENDED) are also converted here.
 */

import type { CardInstanceId, LogValue, PlayerId, PublishedGameEvent } from "#core";
import type {
  ActionLogMessageKey,
  LorcanaGameLogEntry,
  LorcanaLogMessage,
  LorcanaLogMessageKey,
  LorcanaLogMessageMap,
  LogTargetId,
  ResolveBagCancelledCause,
  ScryDestinationEntry,
} from "../types/log-messages";
import type { ProjectedLogEntry } from "../core/runtime/match-runtime.types";
import type { PrivateField } from "../core/runtime/private-field";
import type { MoveLog, MoveLogType, MoveOutcomes } from "../types/move-log";

type PrivateAppendix<T> = {
  value: T;
  visibleTo: readonly string[];
};

type LookedAtInkwellDetail = {
  count: number;
  cardIds?: PrivateAppendix<CardInstanceId[]>;
};

type ResolveBagStatus = "completed" | "skipped" | "pending" | "cancelled";

type BagLogInput = {
  playerId: PlayerId;
  sourceCardId: CardInstanceId;
  abilityName?: string;
  status: ResolveBagStatus;
  cancelReason?: "no-valid-targets" | "condition-not-met" | "restriction";
  targets?: Array<CardInstanceId | PlayerId>;
  lookedAtInkwell?: LookedAtInkwellDetail;
};

type EffectLogResolution =
  | { kind: "targetSelection"; targets: Array<CardInstanceId | PlayerId>; effectType?: string }
  | { kind: "discardChoice"; discarded: Array<CardInstanceId | PlayerId> }
  | {
      kind: "choiceSelection";
      choiceIndex: number;
      choiceLabel?: string;
      revealedCardId?: CardInstanceId;
    }
  | {
      kind: "optionalSelection";
      accepted: boolean;
      targets?: Array<CardInstanceId | PlayerId>;
      abilityName?: string;
    }
  | { kind: "nameCardSelection"; namedCard: string }
  | {
      kind: "scrySelection";
      count: number;
      detail?: PrivateAppendix<ScryDestinationEntry[]>;
      publicRevealed?: ScryDestinationEntry[];
    }
  | {
      kind: "revealTopCard";
      targetPlayerId: PlayerId;
      cardId: CardInstanceId;
      destination: "bottom";
      isAutoBottom: boolean;
    }
  | { kind: "cancelled"; cause: ResolveBagCancelledCause };

type EffectLogInput = {
  playerId: PlayerId;
  sourceCardId: CardInstanceId;
  resolution: EffectLogResolution;
};

/**
 * Build a MoveLog from the move's typed log entries + accumulated outcomes.
 * Returns undefined if the entries can't be converted (should not happen for migrated moves).
 */
export function buildMoveLog(
  moveLogEntries: readonly ProjectedLogEntry[],
  moveId: string,
  playerId: PlayerId,
  timestamp: number,
  outcomes?: MoveOutcomes,
): MoveLog | undefined {
  return buildVisibleMoveLog(moveLogEntries, moveId, playerId, timestamp, outcomes);
}

function buildVisibleMoveLog(
  moveLogEntries: readonly ProjectedLogEntry[],
  moveId: string,
  playerId: PlayerId,
  timestamp: number,
  outcomes?: MoveOutcomes,
): MoveLog | undefined {
  // Find the primary action entry (the one from ctx.framework.log() in the move handler)
  const actionEntry = moveLogEntries.find(
    (e) => e.typedEntry?.category === "action" && e.typedEntry?.type.startsWith("lorcana."),
  );

  if (!actionEntry?.typedEntry) {
    const lookAtInkwellEntry = moveLogEntries.find(
      (entry) =>
        entry.typedEntry?.type === "lorcana.effect.lookAtInkwell" ||
        entry.typedEntry?.type === "lorcana.effect.lookAtInkwell.detail",
    );
    if (lookAtInkwellEntry?.typedEntry) {
      return convertProjectedEntry(lookAtInkwellEntry, timestamp, outcomes);
    }

    // Fallback: try to build from moveId alone for simple moves
    return buildFromMoveId(moveId, playerId, timestamp, outcomes);
  }

  const moveLog = convertProjectedEntry(actionEntry, timestamp, outcomes, playerId);
  const lookedAtInkwell = extractLookAtInkwellDetail(moveLogEntries);
  if (moveLog?.moveType === "resolveBag" && lookedAtInkwell) {
    appendLookedAtInkwellMessages(moveLog, moveLog.playerId, lookedAtInkwell);
  }

  return moveLog;
}

function extractLookAtInkwellDetail(
  moveLogEntries: readonly ProjectedLogEntry[],
): LookedAtInkwellDetail | undefined {
  const entry = moveLogEntries.find(isLookAtInkwellProjectedEntry);
  if (!entry) {
    return undefined;
  }

  const values = entry.typedEntry.values;
  const count = values.count;

  if (entry.visibility.mode === "PUBLIC_WITH_OVERRIDES") {
    for (const [viewerId, override] of Object.entries(entry.visibility.overrides)) {
      if (override.key === "lorcana.effect.lookAtInkwell.detail") {
        const detailValues = override.values;
        const cardIds = getLogCardInstanceIds(detailValues.cardIds);
        return {
          count: getLogCount(detailValues.count, count),
          cardIds: { value: cardIds, visibleTo: [viewerId] },
        };
      }
    }
  }

  if (entry.typedEntry.type === "lorcana.effect.lookAtInkwell.detail") {
    const detailValues = entry.typedEntry.values;
    return {
      count: detailValues.cardIds.length,
      cardIds: { value: detailValues.cardIds, visibleTo: [detailValues.playerId] },
    };
  }

  return {
    count,
  };
}

type LookAtInkwellProjectedEntry = ProjectedLogEntry & {
  typedEntry: Extract<
    LorcanaGameLogEntry,
    { type: "lorcana.effect.lookAtInkwell" | "lorcana.effect.lookAtInkwell.detail" }
  >;
};

function isLookAtInkwellProjectedEntry(
  entry: ProjectedLogEntry,
): entry is LookAtInkwellProjectedEntry {
  return (
    entry.typedEntry?.type === "lorcana.effect.lookAtInkwell" ||
    entry.typedEntry?.type === "lorcana.effect.lookAtInkwell.detail"
  );
}

function getLogCardInstanceIds(value: LogValue | undefined): CardInstanceId[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((cardId): cardId is CardInstanceId => typeof cardId === "string");
}

function getLogCount(value: LogValue | undefined, fallback: number): number {
  return typeof value === "number" ? value : fallback;
}

function convertLookAtInkwellProjectedEntry(
  actionEntry: ProjectedLogEntry,
  timestamp: number,
): MoveLog | undefined {
  if (!isLookAtInkwellProjectedEntry(actionEntry)) {
    return undefined;
  }

  const values = actionEntry.typedEntry.values;
  const playerId = values.playerId;
  const visible = createVisibleMoveLog("lookAtInkwell", playerId, timestamp);

  if (actionEntry.visibility.mode === "PUBLIC_WITH_OVERRIDES") {
    for (const [viewerId, override] of Object.entries(actionEntry.visibility.overrides)) {
      if (override.key === "lorcana.effect.lookAtInkwell.detail") {
        const detailValues = override.values;
        const cardIds = getLogCardInstanceIds(detailValues.cardIds);
        appendLookedAtInkwellMessages(visible, playerId, {
          count: getLogCount(detailValues.count, values.count),
          cardIds: { value: cardIds, visibleTo: [viewerId] },
        });
        return visible;
      }
    }
  }

  if (actionEntry.typedEntry.type === "lorcana.effect.lookAtInkwell.detail") {
    const detailValues = actionEntry.typedEntry.values;
    appendLookedAtInkwellMessages(visible, playerId, {
      count: detailValues.cardIds.length,
      cardIds: { value: detailValues.cardIds, visibleTo: [playerId] },
    });
    return visible;
  }

  appendLookedAtInkwellMessages(visible, playerId, { count: values.count });
  return visible;
}

// =============================================================================
// Action key guard — drives exhaustiveness in convertProjectedEntry
// =============================================================================

/**
 * Every ActionLogMessageKey must appear here. satisfies Record<ActionLogMessageKey, true>
 * enforces completeness at compile time: TypeScript errors if any member of
 * ActionLogMessageKey is missing from this object.
 */
const ACTION_LOG_MESSAGE_KEYS = {
  "lorcana.setup.firstPlayerChosen": true,
  "lorcana.setup.mulligan.count": true,
  "lorcana.ability.activated": true,
  "lorcana.ability.activated.named": true,
  "lorcana.ability.activated.named.discardCost": true,
  "lorcana.ability.activated.discardCost": true,
  "lorcana.card.inked": true,
  "lorcana.effect.lookAtInkwell": true,
  "lorcana.effect.lookAtInkwell.detail": true,
  "lorcana.move.playCard": true,
  "lorcana.move.playCard.shift": true,
  "lorcana.move.playCard.sing": true,
  "lorcana.move.quest": true,
  "lorcana.move.questWithAll": true,
  "lorcana.move.challenge": true,
  "lorcana.move.moveCharacterToLocation": true,
  "lorcana.move.passTurn": true,
  "lorcana.move.concede": true,
  "lorcana.move.forfeitGame": true,
  "lorcana.system.turnSkipped": true,
  "lorcana.system.playerDropped": true,
  "lorcana.bag.resolve.completed": true,
  "lorcana.bag.resolve.completed.named": true,
  "lorcana.bag.resolve.completed.targets": true,
  "lorcana.bag.resolve.completed.targets.named": true,
  "lorcana.bag.resolve.skipped": true,
  "lorcana.bag.resolve.skipped.named": true,
  "lorcana.bag.resolve.pending": true,
  "lorcana.bag.resolve.pending.named": true,
  "lorcana.bag.resolve.pending.named.targets": true,
  "lorcana.bag.resolve.cancelled": true,
  "lorcana.bag.resolve.cancelled.named": true,
  "lorcana.effect.cancelled": true,
  "lorcana.effect.resolve.discardChoice": true,
  "lorcana.effect.resolve.targetSelection": true,
  "lorcana.effect.resolve.choiceSelection": true,
  "lorcana.effect.resolve.choiceSelection.withReveal": true,
  "lorcana.effect.resolve.optionalSelection.accepted": true,
  "lorcana.effect.resolve.optionalSelection.accepted.targets": true,
  "lorcana.effect.resolve.optionalSelection.accepted.targets.named": true,
  "lorcana.effect.resolve.optionalSelection.rejected": true,
  "lorcana.effect.resolve.nameCardSelection": true,
  "lorcana.effect.resolve.scrySelection": true,
  "lorcana.effect.resolve.scrySelection.detail": true,
  "lorcana.effect.resolve.revealTopCard": true,
  "lorcana.effect.resolve.revealTopCard.autoBottom": true,
} as const satisfies Record<ActionLogMessageKey, true>;

function isActionLogMessageKey(key: string): key is ActionLogMessageKey {
  return Object.hasOwn(ACTION_LOG_MESSAGE_KEYS, key);
}

function assertNever(key: never): never {
  throw new Error(`Unhandled ActionLogMessageKey: ${String(key)}`);
}

// =============================================================================

/**
 * Build a MoveLog from a system event (TURN_STARTED, GAME_ENDED).
 */
export function buildSystemMoveLog(event: PublishedGameEvent): MoveLog | undefined {
  const ge = event.event;

  if (ge.kind === "TURN_STARTED") {
    const activePlayer = (ge.playerId ?? "") as PlayerId;
    return createVisibleMoveLog("turnStart", activePlayer, event.timestamp);
  }

  if (ge.kind === "GAME_ENDED") {
    const winnerId = ge.winner ? (ge.winner as PlayerId) : undefined;
    return createVisibleMoveLog("gameEnd", winnerId ?? ("" as PlayerId), event.timestamp);
  }

  return undefined;
}

function buildFromMoveId(
  moveId: string,
  playerId: PlayerId,
  timestamp: number,
  outcomes?: MoveOutcomes,
): MoveLog | undefined {
  switch (moveId) {
    case "passTurn": {
      const visible = createVisibleMoveLog("passTurn", playerId, timestamp);
      pushPublic(visible, "lorcana.move.passTurn", { playerId });
      return visible;
    }
    case "concede": {
      const visible = createVisibleMoveLog("concede", playerId, timestamp);
      pushPublic(visible, "lorcana.move.concede", { playerId });
      return visible;
    }
    case "forfeitGame": {
      const visible = createVisibleMoveLog("forfeitGame", playerId, timestamp);
      pushPublic(visible, "lorcana.move.forfeitGame", { winnerId: playerId, reason: "" });
      appendOutcomeMessages(visible, playerId, outcomes);
      return visible;
    }
    default:
      return undefined;
  }
}

function convertProjectedEntry(
  actionEntry: ProjectedLogEntry,
  timestamp: number,
  outcomes?: MoveOutcomes,
  fallbackPlayerId?: PlayerId,
): MoveLog | undefined {
  const entry = actionEntry.typedEntry;
  if (!entry) {
    return undefined;
  }
  const t = entry.type;
  if (!isActionLogMessageKey(t)) return undefined;
  const v = entry.values as Record<string, unknown>;
  const playerId = (v.playerId ?? fallbackPlayerId ?? "") as PlayerId;

  switch (t) {
    // ── Simple moves ────────────────────────────────────────
    case "lorcana.effect.lookAtInkwell":
    case "lorcana.effect.lookAtInkwell.detail":
      return convertLookAtInkwellProjectedEntry(actionEntry, timestamp);

    case "lorcana.move.passTurn": {
      const visible = createVisibleMoveLog("passTurn", playerId, timestamp);
      pushPublic(visible, "lorcana.move.passTurn", { playerId });
      return visible;
    }

    case "lorcana.move.concede": {
      const visible = createVisibleMoveLog("concede", playerId, timestamp);
      pushPublic(visible, "lorcana.move.concede", { playerId });
      return visible;
    }

    case "lorcana.move.forfeitGame": {
      const winnerId = (v.winnerId ?? playerId) as PlayerId;
      const visible = createVisibleMoveLog("forfeitGame", winnerId, timestamp);
      pushPublic(visible, "lorcana.move.forfeitGame", {
        winnerId,
        reason: (v.reason as string) ?? "",
      });
      return visible;
    }

    case "lorcana.card.inked": {
      const visible = createVisibleMoveLog("inkCard", playerId, timestamp);
      pushPublic(visible, "lorcana.card.inked", {
        playerId,
        cardId: v.cardId as CardInstanceId,
      });
      return visible;
    }

    case "lorcana.move.quest": {
      const visible = createVisibleMoveLog("quest", playerId, timestamp);
      pushPublic(visible, "lorcana.move.quest", {
        playerId,
        cardId: v.cardId as CardInstanceId,
        loreGained: (v.loreGained as number) ?? 0,
      });
      appendOutcomeMessages(visible, playerId, outcomes);
      return visible;
    }

    case "lorcana.move.questWithAll": {
      const cardIds = (v.cardIds as CardInstanceId[]) ?? [];
      const visible = createVisibleMoveLog("questWithAll", playerId, timestamp);
      pushPublic(visible, "lorcana.move.questWithAll", {
        playerId,
        cardIds,
        loreGained: (v.loreGained as number) ?? 0,
        count: cardIds.length,
      });
      appendOutcomeMessages(visible, playerId, outcomes);
      return visible;
    }

    case "lorcana.move.moveCharacterToLocation": {
      const visible = createVisibleMoveLog("moveToLocation", playerId, timestamp);
      pushPublic(visible, "lorcana.move.moveCharacterToLocation", {
        playerId,
        characterId: v.characterId as CardInstanceId,
        locationId: v.locationId as CardInstanceId,
      });
      return visible;
    }

    case "lorcana.move.challenge": {
      const attackerId = v.attackerId as CardInstanceId;
      const defenderId = v.defenderId as CardInstanceId;

      // Extract combat damage from outcomes
      const damage = { attacker: 0, defender: 0 };
      const banished: CardInstanceId[] = [];
      if (outcomes?.damageDealt) {
        for (const d of outcomes.damageDealt) {
          if (d.kind === "combat") {
            if (d.sourceId === attackerId) {
              damage.attacker = d.amount;
            } else {
              damage.defender = d.amount;
            }
          }
        }
      }
      if (outcomes?.cardsBanished) {
        banished.push(...outcomes.cardsBanished);
      }

      const visible = createVisibleMoveLog("challenge", playerId, timestamp);
      pushPublic(visible, "lorcana.move.challenge", {
        playerId,
        attackerId,
        defenderId,
      });
      if (damage.attacker > 0 || damage.defender > 0) {
        pushPublic(visible, "lorcana.outcome.combatDamage", {
          playerId,
          attackerId,
          defenderId,
          attackerDamage: damage.attacker,
          defenderDamage: damage.defender,
        });
      }
      for (const cardId of banished) {
        pushPublic(visible, "lorcana.outcome.cardBanished", { playerId, cardId });
      }
      appendOutcomeMessages(visible, playerId, outcomes, {
        skipCombatDamage: true,
        skipBanished: true,
      });
      return visible;
    }

    // ── PlayCard variants ─────────────────────────────────
    case "lorcana.move.playCard": {
      const visible = createVisibleMoveLog("playCard", playerId, timestamp);
      pushPublic(visible, "lorcana.move.playCard", {
        playerId,
        cardId: v.cardId as CardInstanceId,
      });
      appendOutcomeMessages(visible, playerId, outcomes);
      return visible;
    }

    case "lorcana.move.playCard.shift": {
      const visible = createVisibleMoveLog("shiftCard", playerId, timestamp);
      pushPublic(visible, "lorcana.move.playCard.shift", {
        playerId,
        cardId: v.cardId as CardInstanceId,
        shiftTargetId: v.shiftTargetId as CardInstanceId,
      });
      appendOutcomeMessages(visible, playerId, outcomes);
      return visible;
    }

    case "lorcana.move.playCard.sing": {
      const visible = createVisibleMoveLog("singCard", playerId, timestamp);
      pushPublic(visible, "lorcana.move.playCard.sing", {
        playerId,
        cardId: v.cardId as CardInstanceId,
        singerIds: (v.singerIds as CardInstanceId[]) ?? [],
      });
      appendOutcomeMessages(visible, playerId, outcomes);
      return visible;
    }

    // ── Ability activation ────────────────────────────────
    case "lorcana.ability.activated":
    case "lorcana.ability.activated.named":
    case "lorcana.ability.activated.named.discardCost":
    case "lorcana.ability.activated.discardCost": {
      const visible = createVisibleMoveLog("activateAbility", playerId, timestamp);
      appendAbilityActivationMessage(visible, {
        playerId,
        cardId: v.cardId as CardInstanceId,
        discardCardIds: (v.discardCardIds as CardInstanceId[]) ?? [],
        abilityName: typeof v.abilityName === "string" ? v.abilityName : undefined,
      });
      appendOutcomeMessages(visible, playerId, outcomes);
      return visible;
    }

    // ── Setup ─────────────────────────────────────────────
    case "lorcana.setup.firstPlayerChosen": {
      const chooser = (v.chooser ?? v.playerId ?? fallbackPlayerId) as PlayerId;
      const visible = createVisibleMoveLog("chooseFirstPlayer", chooser, timestamp);
      pushPublic(visible, "lorcana.setup.firstPlayerChosen", {
        chooser,
        chosen: v.chosen as PlayerId,
      });
      return visible;
    }

    case "lorcana.setup.mulligan.count":
      return buildAlterHandMoveLog(actionEntry, playerId, timestamp, v);

    // ── Bag resolution ────────────────────────────────────
    case "lorcana.bag.resolve.completed":
    case "lorcana.bag.resolve.completed.named":
    case "lorcana.bag.resolve.completed.targets":
    case "lorcana.bag.resolve.completed.targets.named":
      return buildResolveBagMoveLog("completed", v, timestamp, outcomes, fallbackPlayerId);

    case "lorcana.bag.resolve.skipped":
    case "lorcana.bag.resolve.skipped.named":
      return buildResolveBagMoveLog("skipped", v, timestamp, outcomes, fallbackPlayerId);

    case "lorcana.bag.resolve.pending":
    case "lorcana.bag.resolve.pending.named":
    case "lorcana.bag.resolve.pending.named.targets":
      return buildResolveBagMoveLog("pending", v, timestamp, outcomes, fallbackPlayerId);

    case "lorcana.bag.resolve.cancelled":
    case "lorcana.bag.resolve.cancelled.named":
      return buildResolveBagMoveLog("cancelled", v, timestamp, outcomes, fallbackPlayerId);

    // ── Effect resolution ─────────────────────────────────
    case "lorcana.effect.resolve.targetSelection":
      return buildResolveEffectMoveLog(
        {
          kind: "targetSelection",
          targets: (v.targets as Array<CardInstanceId | PlayerId>) ?? [],
          effectType: typeof v.effectType === "string" ? v.effectType : undefined,
        },
        v,
        timestamp,
        outcomes,
        fallbackPlayerId,
      );

    case "lorcana.effect.resolve.discardChoice":
      return buildResolveEffectMoveLog(
        { kind: "discardChoice", discarded: (v.targets as Array<CardInstanceId | PlayerId>) ?? [] },
        v,
        timestamp,
        outcomes,
        fallbackPlayerId,
      );

    case "lorcana.effect.resolve.choiceSelection":
      return buildResolveEffectMoveLog(
        {
          kind: "choiceSelection",
          choiceIndex: (v.choiceIndex as number) ?? 0,
          choiceLabel: typeof v.choiceLabel === "string" ? v.choiceLabel : undefined,
          revealedCardId: v.revealedCardId as CardInstanceId | undefined,
        },
        v,
        timestamp,
        outcomes,
        fallbackPlayerId,
      );

    case "lorcana.effect.resolve.choiceSelection.withReveal":
      return buildResolveEffectMoveLog(
        {
          kind: "choiceSelection",
          choiceIndex: (v.choiceIndex as number) ?? 0,
          choiceLabel: typeof v.choiceLabel === "string" ? v.choiceLabel : undefined,
          revealedCardId: v.revealedCardId as CardInstanceId | undefined,
        },
        v,
        timestamp,
        outcomes,
        fallbackPlayerId,
      );

    case "lorcana.effect.resolve.optionalSelection.accepted":
      return buildResolveEffectMoveLog(
        { kind: "optionalSelection", accepted: true },
        v,
        timestamp,
        outcomes,
        fallbackPlayerId,
      );

    case "lorcana.effect.resolve.optionalSelection.accepted.targets":
      return buildResolveEffectMoveLog(
        {
          kind: "optionalSelection",
          accepted: true,
          targets: (v.targets as Array<CardInstanceId | PlayerId>) ?? [],
        },
        v,
        timestamp,
        outcomes,
        fallbackPlayerId,
      );

    case "lorcana.effect.resolve.optionalSelection.accepted.targets.named":
      return buildResolveEffectMoveLog(
        {
          kind: "optionalSelection",
          accepted: true,
          targets: (v.targets as Array<CardInstanceId | PlayerId>) ?? [],
          abilityName: typeof v.abilityName === "string" ? v.abilityName : undefined,
        },
        v,
        timestamp,
        outcomes,
        fallbackPlayerId,
      );

    case "lorcana.effect.resolve.optionalSelection.rejected":
      return buildResolveEffectMoveLog(
        { kind: "optionalSelection", accepted: false },
        v,
        timestamp,
        outcomes,
        fallbackPlayerId,
      );

    case "lorcana.effect.resolve.nameCardSelection":
      return buildResolveEffectMoveLog(
        { kind: "nameCardSelection", namedCard: (v.namedCard as string) ?? "" },
        v,
        timestamp,
        outcomes,
        fallbackPlayerId,
      );

    case "lorcana.effect.resolve.scrySelection":
    case "lorcana.effect.resolve.scrySelection.detail":
      return buildResolveScryEffectLog(actionEntry, v, timestamp, outcomes, fallbackPlayerId);

    case "lorcana.effect.resolve.revealTopCard":
    case "lorcana.effect.resolve.revealTopCard.autoBottom":
      return buildResolveEffectMoveLog(
        {
          kind: "revealTopCard",
          targetPlayerId: (v.targetPlayerId ?? v.playerId ?? fallbackPlayerId) as PlayerId,
          cardId: v.revealedCardId as CardInstanceId,
          destination: "bottom",
          isAutoBottom: t === "lorcana.effect.resolve.revealTopCard.autoBottom",
        },
        v,
        timestamp,
        outcomes,
        fallbackPlayerId,
      );

    case "lorcana.effect.cancelled":
      return buildResolveEffectMoveLog(
        { kind: "cancelled", cause: (v.cause as ResolveBagCancelledCause) ?? "no-valid-targets" },
        v,
        timestamp,
        outcomes,
        fallbackPlayerId,
      );

    case "lorcana.system.turnSkipped": {
      const visible = createVisibleMoveLog(
        "turnSkipped",
        (v.skipperPlayerId ?? playerId) as PlayerId,
        timestamp,
      );
      pushPublic(visible, "lorcana.system.turnSkipped", {
        skipperPlayerId: v.skipperPlayerId as PlayerId,
        stallerPlayerId: v.stallerPlayerId as PlayerId,
      });
      return visible;
    }

    case "lorcana.system.playerDropped": {
      const visible = createVisibleMoveLog(
        "playerDropped",
        (v.dropperPlayerId ?? playerId) as PlayerId,
        timestamp,
      );
      pushPublic(visible, "lorcana.system.playerDropped", {
        dropperPlayerId: v.dropperPlayerId as PlayerId,
        droppedPlayerId: v.droppedPlayerId as PlayerId,
        reason: (v.reason as string) ?? "",
      });
      return visible;
    }

    default:
      return assertNever(t);
  }
}

function buildResolveScryEffectLog(
  actionEntry: ProjectedLogEntry,
  values: Record<string, unknown>,
  timestamp: number,
  outcomes?: MoveOutcomes,
  fallbackPlayerId?: PlayerId,
): MoveLog {
  const visibility = actionEntry.visibility;

  if (visibility.mode === "PUBLIC_WITH_OVERRIDES") {
    // The chooser's override message carries the full destination detail.
    // Find the chooser by looking for the override keyed to the detail message.
    for (const [chooserId, override] of Object.entries(visibility.overrides)) {
      if (override.key === "lorcana.effect.resolve.scrySelection.detail") {
        const detailValues = override.values as Record<string, unknown>;
        const destinations = Array.isArray(detailValues.destinations)
          ? (detailValues.destinations as ScryDestinationEntry[])
          : undefined;
        if (destinations) {
          const publicRevealed = destinations.filter((d) => d.revealed === true);
          return buildResolveEffectMoveLog(
            {
              kind: "scrySelection",
              count: (values.count as number) ?? 0,
              detail: { value: destinations, visibleTo: [chooserId] },
              ...(publicRevealed.length > 0 ? { publicRevealed } : {}),
            },
            values,
            timestamp,
            outcomes,
            fallbackPlayerId,
          );
        }
        break;
      }
    }
  }

  return buildResolveEffectMoveLog(
    { kind: "scrySelection", count: (values.count as number) ?? 0 },
    values,
    timestamp,
    outcomes,
    fallbackPlayerId,
  );
}

function buildAlterHandMoveLog(
  actionEntry: ProjectedLogEntry,
  playerId: PlayerId,
  timestamp: number,
  values: Record<string, unknown>,
): MoveLog {
  const count = (values.count as number) ?? 0;
  const visibility = actionEntry.visibility;
  const visible = createVisibleMoveLog("alterHand", playerId, timestamp);
  pushPublic(visible, "lorcana.setup.mulligan.count", { playerId, count });

  if (visibility.mode !== "PUBLIC_WITH_OVERRIDES") {
    return visible;
  }

  const override = visibility.overrides[playerId];
  if (!override || override.key !== "lorcana.setup.mulligan.detail") {
    return visible;
  }

  const detailValues = override.values as Record<string, unknown>;
  const mulliganed = Array.isArray(detailValues.mulliganed)
    ? (detailValues.mulliganed as CardInstanceId[])
    : [];
  const drawn = Array.isArray(detailValues.drawn) ? (detailValues.drawn as CardInstanceId[]) : [];

  if (mulliganed.length > 0 || drawn.length > 0) {
    pushPrivate(visible, [playerId], "lorcana.private.setup.mulligan.detail", {
      playerId,
      mulliganed,
      drawn,
    });
  }

  return visible;
}

function createVisibleMoveLog(
  moveType: MoveLogType,
  playerId: PlayerId,
  timestamp: number,
): MoveLog {
  return {
    moveType,
    playerId,
    timestamp,
    public: [],
  };
}

function pushPublic<TKey extends LorcanaLogMessageKey>(
  visible: MoveLog,
  key: TKey,
  values: LorcanaLogMessageMap[TKey],
): void {
  visible.public.push(createLogMessage(key, values));
}

function appendLookedAtInkwellMessages(
  visible: MoveLog,
  playerId: PlayerId,
  detail: LookedAtInkwellDetail,
): void {
  pushPublic(visible, "lorcana.effect.lookAtInkwell", {
    playerId,
    count: detail.count,
  });
  if (detail.cardIds?.value.length) {
    pushPrivate(visible, detail.cardIds.visibleTo, "lorcana.private.effect.lookAtInkwell.detail", {
      playerId,
      cardIds: detail.cardIds.value,
    });
  }
}

function appendAbilityActivationMessage(
  visible: MoveLog,
  values: {
    playerId: PlayerId;
    cardId: CardInstanceId;
    abilityName?: string;
    discardCardIds?: CardInstanceId[];
  },
): void {
  const discardIds = values.discardCardIds;
  if (discardIds && discardIds.length > 0) {
    if (values.abilityName) {
      pushPublic(visible, "lorcana.ability.activated.named.discardCost", {
        playerId: values.playerId,
        cardId: values.cardId,
        abilityName: values.abilityName,
        discardCardIds: discardIds,
      });
      return;
    }

    pushPublic(visible, "lorcana.ability.activated.discardCost", {
      playerId: values.playerId,
      cardId: values.cardId,
      discardCardIds: discardIds,
    });
    return;
  }

  if (values.abilityName) {
    pushPublic(visible, "lorcana.ability.activated.named", {
      playerId: values.playerId,
      cardId: values.cardId,
      abilityName: values.abilityName,
    });
    return;
  }

  pushPublic(visible, "lorcana.ability.activated", {
    playerId: values.playerId,
    cardId: values.cardId,
  });
}

function appendOutcomeMessages(
  visible: MoveLog,
  actorPlayerId: PlayerId,
  outcomes?: MoveOutcomes,
  options: { skipCombatDamage?: boolean; skipBanished?: boolean; skipEffectDamage?: boolean } = {},
): void {
  if (!outcomes) return;

  for (const cardsDrawn of outcomes.cardsDrawn ?? []) {
    visible.public.push(
      createLogMessage("lorcana.outcome.cardsDrawn", {
        playerId: cardsDrawn.playerId,
        amount: cardsDrawn.amount,
      }),
    );
    const detail = getPrivateField(cardsDrawn.detail);
    if (detail?.value.length) {
      pushPrivate(visible, detail.visibleTo, "lorcana.private.cardsDrawn.detail", {
        playerId: cardsDrawn.playerId,
        cardIds: detail.value,
      });
    }
  }

  if (!options.skipBanished) {
    for (const cardId of outcomes.cardsBanished ?? []) {
      visible.public.push(
        createLogMessage("lorcana.outcome.cardBanished", { playerId: actorPlayerId, cardId }),
      );
    }
  }

  for (const damage of outcomes.damageDealt ?? []) {
    if (damage.kind === "combat") {
      if (options.skipCombatDamage) continue;
      visible.public.push(
        createLogMessage("lorcana.outcome.combatDamage", {
          playerId: actorPlayerId,
          attackerId: damage.sourceId,
          defenderId: damage.targetId,
          attackerDamage: damage.amount,
          defenderDamage: 0,
        }),
      );
      continue;
    }

    if (!options.skipEffectDamage) {
      visible.public.push(
        createLogMessage("lorcana.outcome.effectDamage", {
          playerId: actorPlayerId,
          sourceId: damage.sourceId,
          targetId: damage.targetId,
          amount: damage.amount,
        }),
      );
    }
  }

  for (const moved of outcomes.damageMoved ?? []) {
    visible.public.push(
      createLogMessage("lorcana.outcome.damageMoved", {
        playerId: actorPlayerId,
        sourceId: moved.sourceCharacterId,
        targetId: moved.targetId,
        amount: moved.amount,
      }),
    );
  }

  if (outcomes.loreChanged) {
    visible.public.push(
      outcomes.loreChanged.operation === "add"
        ? createLogMessage("lorcana.outcome.loreGained", {
            playerId: outcomes.loreChanged.playerId,
            amount: outcomes.loreChanged.amount,
          })
        : createLogMessage("lorcana.outcome.loreLost", {
            playerId: outcomes.loreChanged.playerId,
            amount: outcomes.loreChanged.amount,
          }),
    );
  }

  for (const cardId of outcomes.cardsExerted ?? []) {
    visible.public.push(
      createLogMessage("lorcana.outcome.cardExerted", { playerId: actorPlayerId, cardId }),
    );
  }

  for (const cardId of outcomes.cardsReadied ?? []) {
    visible.public.push(
      createLogMessage("lorcana.outcome.cardReadied", { playerId: actorPlayerId, cardId }),
    );
  }

  if (outcomes.cardsMilled) {
    visible.public.push(
      createLogMessage("lorcana.outcome.cardsMilled", {
        playerId: outcomes.cardsMilled.playerId,
        amount: outcomes.cardsMilled.amount,
      }),
    );
  }

  const cardsPutOnBottom = (outcomes.cardsMovedToZone ?? [])
    .filter((move) => move.zone === "deck-bottom")
    .map((move) => move.cardId);
  if (cardsPutOnBottom.length > 0) {
    visible.public.push(
      createLogMessage("lorcana.outcome.cardsPutOnBottom", {
        playerId: actorPlayerId,
        cardIds: cardsPutOnBottom,
      }),
    );
  }

  for (const cardId of outcomes.cardsReturnedToHand ?? []) {
    visible.public.push(
      createLogMessage("lorcana.outcome.cardReturnedToHand", { playerId: actorPlayerId, cardId }),
    );
  }

  for (const { cardId, exerted } of outcomes.cardsInked ?? []) {
    const key = exerted ? "lorcana.outcome.cardInkedExerted" : "lorcana.outcome.cardInked";
    if (typeof cardId === "string") {
      visible.public.push(createLogMessage(key, { playerId: actorPlayerId, cardId }));
      continue;
    }
    const privateCard = getPrivateField(cardId);
    if (privateCard) {
      pushPrivate(visible, privateCard.visibleTo, key, {
        playerId: actorPlayerId,
        cardId: privateCard.value,
      });
    }
  }
}

function appendResolveBagMessages(visible: MoveLog, moveLog: BagLogInput): void {
  const commonValues = {
    playerId: moveLog.playerId,
    sourceId: moveLog.sourceCardId,
  };
  const targets = moveLog.targets;

  switch (moveLog.status) {
    case "completed":
      if (targets?.length) {
        visible.public.push(
          moveLog.abilityName
            ? createLogMessage("lorcana.bag.resolve.completed.targets.named", {
                ...commonValues,
                abilityName: moveLog.abilityName,
                targets,
              })
            : createLogMessage("lorcana.bag.resolve.completed.targets", {
                ...commonValues,
                targets,
              }),
        );
      } else {
        visible.public.push(
          moveLog.abilityName
            ? createLogMessage("lorcana.bag.resolve.completed.named", {
                ...commonValues,
                abilityName: moveLog.abilityName,
              })
            : createLogMessage("lorcana.bag.resolve.completed", commonValues),
        );
      }
      break;
    case "skipped":
      visible.public.push(
        moveLog.abilityName
          ? createLogMessage("lorcana.bag.resolve.skipped.named", {
              ...commonValues,
              abilityName: moveLog.abilityName,
            })
          : createLogMessage("lorcana.bag.resolve.skipped", commonValues),
      );
      break;
    case "pending":
      visible.public.push(
        targets?.length && moveLog.abilityName
          ? createLogMessage("lorcana.bag.resolve.pending.named.targets", {
              ...commonValues,
              abilityName: moveLog.abilityName,
              targets,
            })
          : moveLog.abilityName
            ? createLogMessage("lorcana.bag.resolve.pending.named", {
                ...commonValues,
                abilityName: moveLog.abilityName,
              })
            : createLogMessage("lorcana.bag.resolve.pending", commonValues),
      );
      break;
    case "cancelled":
      visible.public.push(
        moveLog.abilityName
          ? createLogMessage("lorcana.bag.resolve.cancelled.named", {
              ...commonValues,
              abilityName: moveLog.abilityName,
              cause: moveLog.cancelReason ?? "restriction",
            })
          : createLogMessage("lorcana.bag.resolve.cancelled", {
              ...commonValues,
              cause: moveLog.cancelReason ?? "restriction",
            }),
      );
      break;
  }

  if (moveLog.lookedAtInkwell) {
    appendLookedAtInkwellMessages(visible, moveLog.playerId, moveLog.lookedAtInkwell);
  }
}

function appendResolveEffectMessages(visible: MoveLog, moveLog: EffectLogInput): void {
  const commonValues = {
    playerId: moveLog.playerId,
    sourceCardId: moveLog.sourceCardId,
  };

  switch (moveLog.resolution.kind) {
    case "targetSelection":
      visible.public.push(
        createLogMessage("lorcana.effect.resolve.targetSelection", {
          ...commonValues,
          targets: moveLog.resolution.targets,
          effectType: moveLog.resolution.effectType,
        }),
      );
      return;
    case "discardChoice":
      visible.public.push(
        createLogMessage("lorcana.effect.resolve.discardChoice", {
          ...commonValues,
          targets: moveLog.resolution.discarded,
        }),
      );
      return;
    case "choiceSelection":
      visible.public.push(
        moveLog.resolution.revealedCardId
          ? createLogMessage("lorcana.effect.resolve.choiceSelection.withReveal", {
              ...commonValues,
              revealedCardId: moveLog.resolution.revealedCardId,
              choiceIndex: moveLog.resolution.choiceIndex,
              choiceLabel: moveLog.resolution.choiceLabel,
            })
          : createLogMessage("lorcana.effect.resolve.choiceSelection", {
              ...commonValues,
              choiceIndex: moveLog.resolution.choiceIndex,
              choiceLabel: moveLog.resolution.choiceLabel,
            }),
      );
      return;
    case "optionalSelection": {
      if (!moveLog.resolution.accepted) {
        visible.public.push(
          createLogMessage("lorcana.effect.resolve.optionalSelection.rejected", commonValues),
        );
        return;
      }
      const targets = moveLog.resolution.targets;
      if (targets && targets.length > 0) {
        visible.public.push(
          moveLog.resolution.abilityName
            ? createLogMessage("lorcana.effect.resolve.optionalSelection.accepted.targets.named", {
                ...commonValues,
                abilityName: moveLog.resolution.abilityName,
                targets,
              })
            : createLogMessage("lorcana.effect.resolve.optionalSelection.accepted.targets", {
                ...commonValues,
                targets,
              }),
        );
        return;
      }
      visible.public.push(
        createLogMessage("lorcana.effect.resolve.optionalSelection.accepted", commonValues),
      );
      return;
    }
    case "nameCardSelection":
      visible.public.push(
        createLogMessage("lorcana.effect.resolve.nameCardSelection", {
          ...commonValues,
          namedCard: moveLog.resolution.namedCard,
        }),
      );
      return;
    case "scrySelection": {
      const publicRevealed = moveLog.resolution.publicRevealed;
      if (publicRevealed?.length) {
        visible.public.push(
          createLogMessage("lorcana.effect.resolve.scrySelection.detail", {
            ...commonValues,
            selection: [],
            destinations: publicRevealed,
          }),
        );
      } else {
        visible.public.push(createLogMessage("lorcana.effect.resolve.scrySelection", commonValues));
      }

      const detail = moveLog.resolution.detail;
      if (detail?.value.length) {
        pushPrivate(
          visible,
          detail.visibleTo,
          "lorcana.private.effect.resolve.scrySelection.detail",
          {
            ...commonValues,
            selection: [],
            destinations: detail.value,
          },
        );
      }
      return;
    }
    case "revealTopCard":
      visible.public.push(
        createLogMessage(
          moveLog.resolution.isAutoBottom
            ? "lorcana.effect.resolve.revealTopCard.autoBottom"
            : "lorcana.effect.resolve.revealTopCard",
          {
            ...commonValues,
            targetPlayerId: moveLog.resolution.targetPlayerId,
            revealedCardId: moveLog.resolution.cardId,
          },
        ),
      );
      return;
    case "cancelled":
      visible.public.push(
        createLogMessage("lorcana.effect.cancelled", {
          ...commonValues,
          cause: moveLog.resolution.cause,
        }),
      );
      return;
  }
}

function pushPrivate<TKey extends LorcanaLogMessageKey>(
  visible: MoveLog,
  playerIds: readonly string[],
  key: TKey,
  values: LorcanaLogMessageMap[TKey],
): void {
  if (playerIds.length === 0) return;
  const privateByPlayerId = visible.privateByPlayerId ?? (visible.privateByPlayerId = {});
  for (const playerId of playerIds) {
    const typedPlayerId = playerId as PlayerId;
    const messages = privateByPlayerId[typedPlayerId] ?? (privateByPlayerId[typedPlayerId] = []);
    messages.push(createLogMessage(key, values));
  }
}

function createLogMessage<TKey extends LorcanaLogMessageKey>(
  key: TKey,
  values: LorcanaLogMessageMap[TKey],
): LorcanaLogMessage<TKey> {
  return { key, values } as LorcanaLogMessage<TKey>;
}

function getPrivateField<T>(value: T | PrivateField<T> | undefined): PrivateField<T> | undefined {
  if (
    typeof value === "object" &&
    value !== null &&
    "__private" in value &&
    (value as PrivateField<T>).__private === true &&
    "value" in value &&
    "visibleTo" in value
  ) {
    return value as PrivateField<T>;
  }
  return undefined;
}

/**
 * If outcomes.cardsInked contains entries with PrivateField-wrapped cardIds,
 * return the single owner those cardIds are visible to. Returns undefined
 * when no private inked entries exist (so resolveBag targets stay public).
 * Private targets are omitted from the public bag sentence; the named card is
 * appended for the owner through the private card-inked outcome message.
 */
function getPrivateCardsInkedOwner(outcomes?: MoveOutcomes): PlayerId | undefined {
  const entries = outcomes?.cardsInked;
  if (!entries) return undefined;
  for (const entry of entries) {
    const cardId = entry.cardId as
      | CardInstanceId
      | { __private: true; value: CardInstanceId; visibleTo: string[] };
    if (
      typeof cardId === "object" &&
      cardId !== null &&
      "__private" in cardId &&
      cardId.__private === true &&
      Array.isArray(cardId.visibleTo) &&
      cardId.visibleTo.length === 1
    ) {
      return cardId.visibleTo[0] as PlayerId;
    }
  }
  return undefined;
}

function buildResolveBagMoveLog(
  status: ResolveBagStatus,
  v: Record<string, unknown>,
  timestamp: number,
  outcomes?: MoveOutcomes,
  fallbackPlayerId?: PlayerId,
): MoveLog {
  const targets = v.targets as Array<CardInstanceId | PlayerId> | undefined;
  const ownerOnlyViewer = getPrivateCardsInkedOwner(outcomes);
  const playerId = (v.playerId ?? fallbackPlayerId ?? "") as PlayerId;
  const visible = createVisibleMoveLog("resolveBag", playerId, timestamp);

  appendResolveBagMessages(visible, {
    playerId,
    sourceCardId: (v.sourceId ?? "") as CardInstanceId,
    abilityName: v.abilityName as string | undefined,
    status,
    cancelReason: v.cause as BagLogInput["cancelReason"],
    targets: ownerOnlyViewer ? undefined : targets,
  });
  appendOutcomeMessages(visible, playerId, outcomes);
  return visible;
}

function buildResolveEffectMoveLog(
  resolution: EffectLogResolution,
  v: Record<string, unknown>,
  timestamp: number,
  outcomes?: MoveOutcomes,
  fallbackPlayerId?: PlayerId,
): MoveLog {
  const playerId = (v.playerId ?? fallbackPlayerId ?? "") as PlayerId;
  const visible = createVisibleMoveLog("resolveEffect", playerId, timestamp);

  appendResolveEffectMessages(visible, {
    playerId,
    sourceCardId: (v.sourceCardId ?? "") as CardInstanceId,
    resolution,
  });
  appendOutcomeMessages(visible, playerId, outcomes);
  return visible;
}
