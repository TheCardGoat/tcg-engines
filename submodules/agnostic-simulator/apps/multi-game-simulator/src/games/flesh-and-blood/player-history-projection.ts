import type {
  SimulatorCardReference,
  SimulatorMatchHistoryDetail,
  SimulatorMatchHistoryMetric,
  SimulatorMatchHistoryRow,
} from "@tcg/simulator-contract";
import { FAB_LOG_KEY_NARRATIVE_ROLES, type FabLogKey } from "@tcg/flesh-and-blood-engine/log";
import type { FabMoveLog, FabMoveLogMessage } from "@tcg/flesh-and-blood-engine/simulator";

import {
  fabLogCategoryFor,
  renderFabMoveLogMessage,
  type FabLogActorLabel,
} from "./log-projection";

const FAB_KEY_PREFIX = "flesh-and-blood.";

function isFabLogKey(key: string): key is FabLogKey {
  return key.startsWith(FAB_KEY_PREFIX) && fabLogCategoryFor(key) !== undefined;
}

function messagesFor(log: FabMoveLog, viewerId: string, includePrivate: boolean) {
  return [...log.public, ...(includePrivate ? (log.privateByPlayerId?.[viewerId] ?? []) : [])];
}

function cardReferences(message: FabMoveLogMessage): SimulatorCardReference[] {
  const references: SimulatorCardReference[] = [];
  for (const [slot, reference] of Object.entries(message.objectRefs ?? {})) {
    const name = message.values?.[slot];
    if (typeof name !== "string" || !reference) continue;
    references.push({
      name,
      entityId: reference.instanceId,
      ...(reference.canonicalId ? { definitionId: reference.canonicalId } : {}),
    });
  }
  if (message.key === "flesh-and-blood.draw.private" && references.length === 0) {
    const names = String(message.values?.cardNames ?? "")
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean);
    references.push(...names.map((name) => ({ name })));
  }
  return references;
}

function sameReferencedCard(left: FabMoveLogMessage, right: FabMoveLogMessage): boolean {
  const leftId = left.objectRefs?.cardName?.instanceId;
  const rightId = right.objectRefs?.cardName?.instanceId;
  return leftId !== undefined && rightId !== undefined && leftId === rightId;
}

function activityControllerId(message: FabMoveLogMessage): string | undefined {
  switch (message.activityRef?.kind) {
    case "stack-layer-opened":
    case "stack-layer-event":
      return message.activityRef.controllerId;
    case "stack-window-event":
    case undefined:
      return undefined;
  }
}

function activitySourceInstanceId(message: FabMoveLogMessage): string | undefined {
  switch (message.activityRef?.kind) {
    case "stack-layer-opened":
      return message.activityRef.sourceInstanceId;
    case "stack-layer-event":
      return message.activityRef.sourceInstanceId ?? undefined;
    case "stack-window-event":
    case undefined:
      return undefined;
  }
}

function messageSubjectId(message: FabMoveLogMessage): string | undefined {
  if (typeof message.values?.actorId === "string") return message.values.actorId;
  return typeof message.values?.playerId === "string" ? message.values.playerId : undefined;
}

function historyActorId(message: FabMoveLogMessage, turnOwnerId?: string): string | undefined {
  return (
    activityControllerId(message) ??
    messageSubjectId(message) ??
    (message.combatState?.kind === "outcome" ? turnOwnerId : undefined)
  );
}

function isRoutineSourceLifecycle(
  message: FabMoveLogMessage,
  receiptMessages: readonly FabMoveLogMessage[],
): boolean {
  if (
    message.key !== "flesh-and-blood.move-zone" &&
    message.key !== "flesh-and-blood.move-zone.hidden" &&
    message.key !== "flesh-and-blood.enter-arena" &&
    message.key !== "flesh-and-blood.put-into-graveyard"
  ) {
    return false;
  }
  const cardInstanceId = message.objectRefs?.cardName?.instanceId;
  if (!cardInstanceId) return false;
  const sourceInstanceId = activitySourceInstanceId(message);
  if (sourceInstanceId) return sourceInstanceId === cardInstanceId;
  return receiptMessages.some(
    (candidate) =>
      (candidate.key === "flesh-and-blood.play" || candidate.key === "flesh-and-blood.activate") &&
      sameReferencedCard(candidate, message),
  );
}

function metricsFor(message: FabMoveLogMessage): SimulatorMatchHistoryMetric[] | undefined {
  const combat = message.combatState;
  if (!combat) return undefined;
  switch (combat.kind) {
    case "attack":
      return [{ kind: "value", label: "Attack", value: combat.after.attack }];
    case "defense":
      return [{ kind: "value", label: "Defense", value: combat.cardDefense }];
    case "reaction": {
      const label = combat.role === "attack-reaction" ? "Attack" : "Defense";
      const before =
        combat.role === "attack-reaction" ? combat.before.attack : combat.before.defense;
      const after = combat.role === "attack-reaction" ? combat.after.attack : combat.after.defense;
      return [{ kind: "change", label, before, after }];
    }
    case "outcome":
      return [
        {
          kind: "comparison",
          leftLabel: "Attack",
          left: combat.final.attack,
          rightLabel: "Defense",
          right: combat.final.defense,
        },
      ];
  }
}

/** The group heading owns the causal actor, so row copy starts with the action. */
function playerHistoryTitle(
  message: FabMoveLogMessage,
  rowActorId: string | undefined,
  actorLabel?: FabLogActorLabel,
): string {
  const cardName = String(message.values?.cardName ?? "the card");
  const subjectId = messageSubjectId(message);
  const subjectPrefix =
    subjectId && subjectId !== rowActorId
      ? `${actorLabel?.(subjectId, "subject") ?? subjectId} `
      : "";
  switch (message.key) {
    case "flesh-and-blood.play":
      return `Played ${cardName}`;
    case "flesh-and-blood.activate":
      return `Activated ${cardName}`;
    case "flesh-and-blood.pitch":
      return `Pitched ${cardName}`;
    case "flesh-and-blood.discard":
      return `Discarded ${cardName}`;
    case "flesh-and-blood.discard.random":
      return `Discarded ${cardName} at random`;
    case "flesh-and-blood.draw":
      return subjectPrefix ? `${subjectPrefix}drew a card` : "Drew a card";
    case "flesh-and-blood.draw.cards":
      return subjectPrefix
        ? `${subjectPrefix}drew ${String(message.values?.count ?? 0)} cards`
        : `Drew ${String(message.values?.count ?? 0)} cards`;
    case "flesh-and-blood.draw.private":
      return subjectPrefix
        ? `${subjectPrefix}drew: ${String(message.values?.cardNames ?? "a card")}`
        : `Drew: ${String(message.values?.cardNames ?? "a card")}`;
    case "flesh-and-blood.gain-life":
      return subjectPrefix
        ? `${subjectPrefix}gained ${String(message.values?.amount ?? 0)} life`
        : `Gained ${String(message.values?.amount ?? 0)} life`;
    case "flesh-and-blood.lose-life":
      return subjectPrefix
        ? `${subjectPrefix}lost ${String(message.values?.amount ?? 0)} life`
        : `Lost ${String(message.values?.amount ?? 0)} life`;
    case "flesh-and-blood.move-zone":
      return subjectPrefix
        ? `${subjectPrefix}moved ${cardName} from ${String(message.values?.from ?? "a zone")} to ${String(message.values?.to ?? "a zone")}`
        : `Moved ${cardName} from ${String(message.values?.from ?? "a zone")} to ${String(message.values?.to ?? "a zone")}`;
    case "flesh-and-blood.enter-arena":
      return subjectPrefix
        ? `${subjectPrefix}put ${cardName} into the arena`
        : `${cardName} entered the arena`;
    case "flesh-and-blood.put-into-graveyard":
      return `${cardName} was put into the graveyard`;
    case "flesh-and-blood.attack":
      return `Attack with ${cardName}`;
    case "flesh-and-blood.defend":
      return `Defend with ${cardName}`;
    case "flesh-and-blood.combat.hit":
      return `Hit with ${cardName} for`;
    case "flesh-and-blood.combat.miss":
      return `Blocked ${cardName}`;
    default:
      return renderFabMoveLogMessage(message, actorLabel);
  }
}

function detailFor(message: FabMoveLogMessage, actorLabel?: FabLogActorLabel) {
  if (!isFabLogKey(message.key)) return undefined;
  const text = renderFabMoveLogMessage(message, actorLabel);
  const cards = cardReferences(message);
  switch (message.key) {
    case "flesh-and-blood.pitch":
      return {
        kind: "cards" as const,
        label: "Cost",
        lead: "Pitched",
        cards: cards.length > 0 ? cards : [{ name: String(message.values?.cardName ?? "a card") }],
      };
    case "flesh-and-blood.discard":
    case "flesh-and-blood.discard.random":
      return {
        kind: "cards" as const,
        label: "Additional cost",
        lead: "Discarded",
        cards: cards.length > 0 ? cards : [{ name: String(message.values?.cardName ?? "a card") }],
        ...(message.key === "flesh-and-blood.discard.random" ? { trail: " at random" } : {}),
      };
    case "flesh-and-blood.cost-life":
    case "flesh-and-blood.cost-chi":
      return { kind: "text" as const, label: "Cost", text };
    default:
      return undefined;
  }
}

function appendHistoryDetail(
  details: SimulatorMatchHistoryDetail[],
  detail: SimulatorMatchHistoryDetail,
) {
  if (detail.kind !== "cards") {
    details.push(detail);
    return;
  }
  const matchingIndex = details.findIndex(
    (candidate) =>
      candidate.kind === "cards" &&
      candidate.label === detail.label &&
      candidate.lead === detail.lead &&
      candidate.trail === detail.trail,
  );
  const matching = details[matchingIndex];
  if (matching?.kind !== "cards") {
    details.push(detail);
    return;
  }
  details[matchingIndex] = { ...matching, cards: [...matching.cards, ...detail.cards] };
}

export interface FabPlayerHistoryProjectionOptions {
  readonly viewerId: string;
  readonly firstTurnPlayerId?: string;
  readonly seatIds?: readonly string[];
  readonly actorLabel?: FabLogActorLabel;
  readonly includePrivate?: boolean;
}

/** Project canonical FAB receipts into a flat, viewer-safe player history. */
export function projectFabPlayerHistoryRows(
  logs: readonly FabMoveLog[],
  options: FabPlayerHistoryProjectionOptions,
): SimulatorMatchHistoryRow[] {
  const rows: SimulatorMatchHistoryRow[] = [];
  const includePrivate = options.includePrivate ?? true;
  const knownSeats = new Set([options.viewerId, ...(options.seatIds ?? [])]);
  const actorLabel: FabLogActorLabel =
    options.actorLabel ??
    ((actorId, usage) => {
      if (!knownSeats.has(actorId)) return undefined;
      if (actorId === options.viewerId) {
        return usage === "possessive" ? "Your" : usage === "possessive-lower" ? "your" : "You";
      }
      return usage === "possessive"
        ? "Opponent's"
        : usage === "possessive-lower"
          ? "opponent's"
          : "Opponent";
    });
  let turnOwnerId = options.firstTurnPlayerId;
  const pendingReactionDetails = new Map<string, SimulatorMatchHistoryDetail[]>();
  let latestPendingReactionId: string | null = null;
  if (options.firstTurnPlayerId) {
    const firstLabel =
      actorLabel(options.firstTurnPlayerId, "subject") ?? options.firstTurnPlayerId;
    rows.push({
      id: "fab-match-start",
      turn: 1,
      timestamp: new Date(logs[0]?.timestamp ?? 0).toISOString(),
      kind: "match-start",
      title: `Match started · ${firstLabel} ${firstLabel === "You" ? "go" : "goes"} first`,
      actorSeatId: options.firstTurnPlayerId,
      turnOwnerSeatId: options.firstTurnPlayerId,
    });
  }

  for (const log of logs) {
    const messages = messagesFor(log, options.viewerId, includePrivate);
    for (const message of messages) {
      if (
        message.key === "flesh-and-blood.phase.start" &&
        typeof message.values?.turnPlayerId === "string"
      ) {
        turnOwnerId = message.values.turnPlayerId;
      }
    }
    const details: SimulatorMatchHistoryDetail[] = [];
    const headlineMessages: FabMoveLogMessage[] = [];
    const hasPrivateDraw = messages.some(
      (message) => message.key === "flesh-and-blood.draw.private",
    );
    for (const message of messages) {
      if (!isFabLogKey(message.key)) continue;
      const role = message.narrativeRole ?? FAB_LOG_KEY_NARRATIVE_ROLES[message.key];
      if (role === "detail") {
        const detail = detailFor(message, actorLabel);
        if (detail) appendHistoryDetail(details, detail);
      } else if (role !== "diagnostic" && role !== "transient") {
        if (
          hasPrivateDraw &&
          (message.key === "flesh-and-blood.draw" || message.key === "flesh-and-blood.draw.cards")
        ) {
          continue;
        }
        if (isRoutineSourceLifecycle(message, messages)) {
          continue;
        }
        // A completed zone move immediately following discard is reducer
        // bookkeeping, not a second player action.
        if (
          message.key === "flesh-and-blood.put-into-graveyard" &&
          messages.some(
            (candidate) =>
              (candidate.key === "flesh-and-blood.discard" ||
                candidate.key === "flesh-and-blood.discard.random") &&
              sameReferencedCard(candidate, message),
          )
        ) {
          continue;
        }
        headlineMessages.push(message);
      }
    }

    // Payment may span several accepted commands. When a receipt contains
    // only a cost detail (most commonly one pitched card), retain it as its
    // own activity unless it belongs to a reaction that is still resolving.
    if (headlineMessages.length === 0 && details.length > 0) {
      if (latestPendingReactionId) {
        pendingReactionDetails.set(latestPendingReactionId, [
          ...(pendingReactionDetails.get(latestPendingReactionId) ?? []),
          ...details,
        ]);
      } else {
        const detailMessage = messages.find(
          (message) =>
            isFabLogKey(message.key) &&
            (message.narrativeRole ?? FAB_LOG_KEY_NARRATIVE_ROLES[message.key]) === "detail",
        );
        if (detailMessage) headlineMessages.push(detailMessage);
      }
    }

    if (log.moveType === "end-turn") {
      const nextTurn = messages.find((message) => message.key === "flesh-and-blood.turn.started")
        ?.values?.turnNumber;
      const endedTurn = typeof nextTurn === "number" ? Math.max(1, nextTurn - 1) : log.turnNumber;
      rows.push({
        id: `${log.commandId}:${log.sequence}:turn-end`,
        turn: endedTurn,
        timestamp: new Date(log.timestamp).toISOString(),
        actorSeatId: log.playerId,
        turnOwnerSeatId: log.playerId,
        kind: "turn-end",
        title: "Ended the turn",
      });
    }

    for (let index = 0; index < headlineMessages.length; index += 1) {
      const message = headlineMessages[index]!;
      if (message.key === "flesh-and-blood.turn.started") continue;
      const refs = cardReferences(message);
      const primaryRef = refs[0]?.entityId;
      const unresolvedReaction =
        message.key === "flesh-and-blood.play" &&
        (message.combatRole === "attack-reaction" || message.combatRole === "defense-reaction") &&
        message.combatState == null;
      if (unresolvedReaction && primaryRef) {
        latestPendingReactionId = primaryRef;
        pendingReactionDetails.set(primaryRef, [
          ...(pendingReactionDetails.get(primaryRef) ?? []),
          ...(index === 0 ? details : []),
        ]);
        continue;
      }
      const resolvedReactionDetails =
        message.combatState?.kind === "reaction" && primaryRef
          ? (pendingReactionDetails.get(primaryRef) ?? [])
          : [];
      if (message.combatState?.kind === "reaction" && primaryRef) {
        pendingReactionDetails.delete(primaryRef);
        if (latestPendingReactionId === primaryRef) latestPendingReactionId = null;
      }
      const role = message.narrativeRole ?? FAB_LOG_KEY_NARRATIVE_ROLES[message.key as FabLogKey];
      const rowDetails = [
        ...resolvedReactionDetails,
        ...(index === 0 && role !== "detail" ? details : []),
      ];
      const rowActorId = historyActorId(message, turnOwnerId);
      rows.push({
        id: `${log.commandId}:${log.sequence}:${index}:${message.key}`,
        turn: log.turnNumber,
        timestamp: new Date(log.timestamp).toISOString(),
        ...(rowActorId ? { actorSeatId: rowActorId } : {}),
        kind:
          role === "outcome"
            ? "outcome"
            : fabLogCategoryFor(message.key) === "combat"
              ? "combat"
              : "activity",
        title: playerHistoryTitle(message, rowActorId, actorLabel),
        ...(turnOwnerId ? { turnOwnerSeatId: turnOwnerId } : {}),
        ...(rowDetails.length > 0 ? { details: rowDetails } : {}),
        ...(metricsFor(message) ? { metrics: metricsFor(message) } : {}),
        ...(refs.length > 0
          ? {
              cardRefs: refs,
              entityIds: refs.flatMap((reference) =>
                reference.entityId ? [reference.entityId] : [],
              ),
            }
          : {}),
      });
    }
  }

  const trailingPasses: FabMoveLog[] = [];
  for (let index = logs.length - 1; index >= 0; index -= 1) {
    const log = logs[index]!;
    if (
      log.moveType !== "pass" ||
      !messagesFor(log, options.viewerId, includePrivate).some(
        (message) => message.key === "flesh-and-blood.command.pass",
      )
    ) {
      break;
    }
    trailingPasses.unshift(log);
  }
  for (const log of trailingPasses) {
    rows.push({
      id: `${log.commandId}:${log.sequence}:priority-pass`,
      turn: log.turnNumber,
      timestamp: new Date(log.timestamp).toISOString(),
      actorSeatId: log.playerId,
      ...(turnOwnerId ? { turnOwnerSeatId: turnOwnerId } : {}),
      kind: "priority-pass",
      title: "Passed priority",
    });
  }

  return rows;
}
