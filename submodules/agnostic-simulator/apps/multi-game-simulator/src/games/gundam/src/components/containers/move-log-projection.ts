import type { SimulatorEventLogEntry } from "@tcg/simulator-contract";
import type { GundamMoveLog } from "@tcg/gundam-engine";

import type { EngineAdapter, TurnTaggedLogEntry, TurnTaggedMoveLog } from "../../game/adapter.ts";

type CardResolver = EngineAdapter["cardDefinitionOf"];

const DEFAULT_CARD_RESOLVER: CardResolver = () => null;

interface ProjectionOptions {
  readonly revealPrivateFields?: boolean;
}

export function projectGundamMoveLogEntries(
  logs: readonly TurnTaggedMoveLog[],
  viewerId: string,
  phase: string,
  resolveCard: CardResolver = DEFAULT_CARD_RESOLVER,
  options: ProjectionOptions = {},
): SimulatorEventLogEntry[] {
  return logs.flatMap((entry, index) => {
    const log = entry.log;
    const baseId = `gundam-move-log-${log.commandID ?? log.stateID ?? `${entry.turnNumber}-${index}`}`;
    const baseEntry = entryFor({
      id: baseId,
      log,
      turn: entry.turnNumber,
      phase,
      viewerId,
      message: primaryMessage(log, viewerId, resolveCard),
      tags: primaryTags(log.type),
      entityIds: primaryEntityIds(log),
    });
    const outcomeEntries = outcomeMessages(log, viewerId, resolveCard, options).map(
      (outcome, outcomeIndex) =>
        entryFor({
          id: `${baseId}-outcome-${outcomeIndex}`,
          log,
          turn: entry.turnNumber,
          phase,
          viewerId,
          message: outcome.message,
          tags: outcome.tags,
          entityIds: outcome.entityIds,
        }),
    );

    return [baseEntry, ...outcomeEntries];
  });
}

export function projectGundamLegacyEventLogEntries(
  entries: readonly TurnTaggedLogEntry[],
  viewerId: string,
  phase: string,
  resolveCard: CardResolver = DEFAULT_CARD_RESOLVER,
): SimulatorEventLogEntry[] {
  return entries.flatMap((tagged) => {
    const entry = tagged.entry;
    const values = valuesOf(entry);
    const playerId = authorOf(entry, values);
    const base = {
      id: `gundam-legacy-log-${entry.id}`,
      turn: tagged.turnNumber,
      phase,
      timestamp: timestampFromNumber(entry.timestamp),
      ...(playerId ? { seatId: playerId === viewerId ? "player" : "opponent" } : {}),
    };

    switch (entry.type) {
      case "gundam.effect.deckRevealed": {
        if (!playerId) return [];
        const cardIds = stringArray(values.cardIds ?? entry.cardIds);
        const cardList = cardIds.map((id) => cardName(id, resolveCard)).join(", ");
        return [
          {
            ...base,
            tags: ["ability"] as SimulatorEventLogEntry["tags"],
            message:
              cardIds.length > 0
                ? `${playerName(playerId, viewerId)} revealed ${cardIds.length}: ${cardList} from deck.`
                : `${playerName(playerId, viewerId)} revealed cards from deck.`,
            entityIds: unique(cardIds),
          },
        ];
      }
      case "gundam.effect.cardTutored": {
        if (!playerId) return [];
        const cardId = stringValue(values.cardId) ?? entry.cardIds?.[0];
        return [
          {
            ...base,
            tags: ["ability"] as SimulatorEventLogEntry["tags"],
            message: cardId
              ? `${playerName(playerId, viewerId)} searched for ${cardName(cardId, resolveCard)}.`
              : `${playerName(playerId, viewerId)} searched their deck.`,
            entityIds: cardId ? [cardId] : undefined,
          },
        ];
      }
      default:
        if (entry.type.startsWith("gundam.setup.") && entry.message) {
          return [
            {
              ...base,
              message: prettifyLegacyMessage(entry.message, values, viewerId, resolveCard),
              tags: ["system"] as SimulatorEventLogEntry["tags"],
              entityIds: unique(collectLegacyEntityIds(entry, values)),
            },
          ];
        }
        return [];
    }
  });
}

function entryFor(args: {
  readonly id: string;
  readonly log: GundamMoveLog;
  readonly turn: number;
  readonly phase: string;
  readonly viewerId: string;
  readonly message: string;
  readonly tags: SimulatorEventLogEntry["tags"];
  readonly entityIds?: readonly string[];
}): SimulatorEventLogEntry {
  return {
    id: args.id,
    turn: args.turn,
    phase: args.phase,
    seatId: String(args.log.playerId) === args.viewerId ? "player" : "opponent",
    timestamp: timestampFor(args.log),
    message: args.message,
    tags: args.tags,
    entityIds: unique(args.entityIds),
  };
}

function timestampFor(log: GundamMoveLog): string {
  const timestamp = Number.isFinite(log.timestamp) ? log.timestamp : 0;
  return timestampFromNumber(timestamp);
}

function timestampFromNumber(value: number): string {
  const timestamp = Number.isFinite(value) ? value : 0;
  return new Date(timestamp).toISOString();
}

function cardName(cardId: string, resolveCard: CardResolver): string {
  if (cardId === "direct") return "direct";
  return resolveCard(cardId)?.name ?? cardId;
}

function playerName(playerId: string, viewerId: string): string {
  return playerId === viewerId ? "You" : "Opponent";
}

function primaryMessage(log: GundamMoveLog, viewerId: string, resolveCard: CardResolver): string {
  switch (log.type) {
    case "deployUnit":
      return `Deployed ${cardName(log.cardId, resolveCard)}.`;
    case "deployBase":
      return `Deployed base ${cardName(log.cardId, resolveCard)}.`;
    case "playCommand":
      return `Played ${cardName(log.cardId, resolveCard)}.`;
    case "assignPilot":
      return `Paired ${cardName(log.pilotId, resolveCard)} with ${cardName(
        log.unitId,
        resolveCard,
      )}.`;
    case "attack":
      return `Attacked ${cardName(log.targetId, resolveCard)} with ${cardName(
        log.attackerId,
        resolveCard,
      )}.`;
    case "block":
      return `Blocked ${cardName(log.attackerId, resolveCard)} with ${cardName(
        log.blockerId,
        resolveCard,
      )}.`;
    case "resolveEffect":
      return `Resolved effect from ${cardName(log.sourceCardId, resolveCard)}.`;
    case "pass":
      return `Passed (${log.context}).`;
    case "turnStart":
      return `${playerName(String(log.activePlayerId), viewerId)} started the turn.`;
    case "gameEnd":
      return `Game ended: ${log.reason}.`;
    default: {
      const exhaustive: never = log;
      throw new Error(`Unhandled Gundam move log type: ${(exhaustive as { type?: string }).type}`);
    }
  }
}

function primaryTags(logType: GundamMoveLog["type"]): SimulatorEventLogEntry["tags"] {
  switch (logType) {
    case "attack":
    case "block":
      return ["combat"];
    case "resolveEffect":
      return ["ability"];
    case "turnStart":
    case "gameEnd":
      return ["system"];
    default:
      return ["move"];
  }
}

function primaryEntityIds(log: GundamMoveLog): readonly string[] | undefined {
  switch (log.type) {
    case "deployUnit":
    case "deployBase":
    case "playCommand":
      return [String(log.cardId)];
    case "assignPilot":
      return [String(log.pilotId), String(log.unitId)];
    case "attack":
      return [String(log.attackerId), ...entityIdForTarget(log.targetId)];
    case "block":
      return [String(log.blockerId), String(log.attackerId)];
    case "resolveEffect":
      return [String(log.sourceCardId)];
    default:
      return undefined;
  }
}

function entityIdForTarget(targetId: string): readonly string[] {
  return targetId === "direct" ? [] : [targetId];
}

function outcomeMessages(
  log: GundamMoveLog,
  viewerId: string,
  resolveCard: CardResolver,
  options: ProjectionOptions,
): Array<{
  readonly message: string;
  readonly tags: SimulatorEventLogEntry["tags"];
  readonly entityIds?: readonly string[];
}> {
  const outcomes = log.outcomes;
  if (!outcomes) return [];
  const messages: Array<{
    readonly message: string;
    readonly tags: SimulatorEventLogEntry["tags"];
    readonly entityIds?: readonly string[];
  }> = [];

  for (const damage of outcomes.damageDealt ?? []) {
    messages.push({
      message: `${cardName(damage.targetId, resolveCard)} took ${damage.amount} damage.`,
      tags: ["combat"],
      entityIds: unique([damage.sourceCardId, damage.targetId]),
    });
  }

  for (const shield of outcomes.shieldsRemoved ?? []) {
    messages.push({
      message: `${cardName(shield.cardId, resolveCard)} lost a shield.`,
      tags: ["combat"],
      entityIds: unique([shield.sourceCardId, shield.cardId]),
    });
  }

  for (const defeated of outcomes.unitsDefeated ?? []) {
    messages.push({
      message: `${cardName(defeated.cardId, resolveCard)} was defeated.`,
      tags: ["combat"],
      entityIds: unique([defeated.defeatedBy, defeated.cardId]),
    });
  }

  if (outcomes.cardsDrawn) {
    const visibleIds = visibleCardIds(
      outcomes.cardsDrawn.cardIds,
      viewerId,
      options.revealPrivateFields === true,
    );
    messages.push({
      message:
        visibleIds.length > 0
          ? `Drew ${outcomes.cardsDrawn.count}: ${visibleIds
              .map((id) => cardName(id, resolveCard))
              .join(", ")}.`
          : `Drew ${outcomes.cardsDrawn.count} card(s).`,
      tags: ["move"],
      entityIds: visibleIds,
    });
  }

  if (outcomes.resourcesSpent) {
    messages.push({
      message: `Spent ${outcomes.resourcesSpent.regularCount} resources and removed ${outcomes.resourcesSpent.exRemovedCount} EX tokens.`,
      tags: ["move"],
    });
  }

  for (const id of outcomes.cardsDiscarded ?? []) {
    messages.push({
      message: `Discarded ${cardName(id, resolveCard)}.`,
      tags: ["move"],
      entityIds: [String(id)],
    });
  }

  for (const id of outcomes.unitsRested ?? []) {
    messages.push({
      message: `${cardName(id, resolveCard)} was rested for cost.`,
      tags: ["move"],
      entityIds: [String(id)],
    });
  }

  for (const moved of outcomes.cardsMoved ?? []) {
    if (isDeckToHandMove(moved.from, moved.to)) {
      continue;
    }
    messages.push({
      message: `${cardName(moved.cardId, resolveCard)} moved${
        moved.from ? ` from ${moved.from}` : ""
      } to ${moved.to}.`,
      tags: ["move"],
      entityIds: [String(moved.cardId)],
    });
  }

  for (const id of outcomes.cardsReturnedToHand ?? []) {
    messages.push({
      message: `${cardName(id, resolveCard)} returned to hand.`,
      tags: ["move"],
      entityIds: [String(id)],
    });
  }

  for (const id of outcomes.cardsExhausted ?? []) {
    messages.push({
      message: `${cardName(id, resolveCard)} was exhausted.`,
      tags: ["move"],
      entityIds: [String(id)],
    });
  }

  for (const id of outcomes.cardsReadied ?? []) {
    messages.push({
      message: `${cardName(id, resolveCard)} was readied.`,
      tags: ["move"],
      entityIds: [String(id)],
    });
  }

  for (const placed of outcomes.resourcesPlaced ?? []) {
    messages.push({
      message: `${cardName(placed.cardId, resolveCard)} was placed as a ${placed.state} resource.`,
      tags: ["move"],
      entityIds: [String(placed.cardId)],
    });
  }

  for (const effect of outcomes.effectsQueued ?? []) {
    messages.push({
      message: `${cardName(effect.sourceCardId, resolveCard)} queued ${effect.kind}.`,
      tags: ["ability"],
      entityIds: [String(effect.sourceCardId)],
    });
  }

  for (const effect of outcomes.effectsResolved ?? []) {
    messages.push({
      message: `${cardName(effect.sourceCardId, resolveCard)} resolved an effect.`,
      tags: ["ability"],
      entityIds: [String(effect.sourceCardId)],
    });
  }

  return messages;
}

function isDeckToHandMove(fromZoneId: string | undefined, toZoneId: string): boolean {
  return baseZoneId(fromZoneId) === "deck" && baseZoneId(toZoneId) === "hand";
}

function baseZoneId(zoneId: string | undefined): string | undefined {
  return zoneId?.split(":")[0];
}

function visibleCardIds(value: unknown, viewerId: string, revealPrivateFields: boolean): string[] {
  if (Array.isArray(value)) return value.filter((id): id is string => typeof id === "string");
  if (
    typeof value === "object" &&
    value !== null &&
    "__private" in value &&
    (value as { __private?: unknown }).__private === true &&
    "value" in value &&
    "visibleTo" in value &&
    Array.isArray((value as { value?: unknown }).value)
  ) {
    const visibleTo = (value as { visibleTo?: unknown }).visibleTo;
    const canReveal =
      revealPrivateFields ||
      (Array.isArray(visibleTo) &&
        visibleTo.some((id) => typeof id === "string" && id === viewerId));
    if (!canReveal) return [];
    return (value as { value: unknown[] }).value.filter(
      (id): id is string => typeof id === "string",
    );
  }
  return [];
}

function unique(values: readonly (string | undefined)[] | undefined): string[] | undefined {
  const ids = [...new Set((values ?? []).filter((value): value is string => Boolean(value)))];
  return ids.length > 0 ? ids : undefined;
}

function valuesOf(entry: TurnTaggedLogEntry["entry"]): Record<string, unknown> {
  const values = (entry.data as { values?: unknown } | undefined)?.values;
  return typeof values === "object" && values !== null ? (values as Record<string, unknown>) : {};
}

function authorOf(
  entry: TurnTaggedLogEntry["entry"],
  values: Record<string, unknown>,
): string | undefined {
  return stringValue(entry.playerId) ?? stringValue(values.playerId) ?? stringValue(values.chooser);
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function prettifyLegacyMessage(
  message: string,
  values: Record<string, unknown>,
  viewerId: string,
  resolveCard: CardResolver,
): string {
  let out = message;
  for (const [key, value] of Object.entries(values)) {
    if (typeof value !== "string") continue;
    const replacement = isPlayerValueKey(key)
      ? playerName(value, viewerId)
      : cardName(value, resolveCard);
    out = out.replaceAll(value, replacement);
  }
  return out;
}

function isPlayerValueKey(key: string): boolean {
  return key === "playerId" || key === "chooser" || key === "chosen" || key.endsWith("PlayerId");
}

function collectLegacyEntityIds(
  entry: TurnTaggedLogEntry["entry"],
  values: Record<string, unknown>,
): string[] {
  const ids = new Set<string>(entry.cardIds ?? []);
  for (const key of ["cardId", "sourceCardId", "targetId"]) {
    const value = values[key];
    if (typeof value === "string") ids.add(value);
  }
  for (const value of stringArray(values.cardIds)) {
    ids.add(value);
  }
  return [...ids];
}
