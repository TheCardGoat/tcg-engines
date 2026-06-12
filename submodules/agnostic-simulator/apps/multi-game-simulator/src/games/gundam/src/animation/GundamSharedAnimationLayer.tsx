import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Card } from "@tcg/gundam-types";
import type { GundamMoveLog } from "@tcg/gundam-engine";
import type { SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";
import {
  cardMoveRecordsToSimulatorEvents,
  SimulatorAnimationLayer,
  VisualAnimationLayer,
  type CardMoveAnimationRecord,
  type VisualAnimationEvent,
} from "@tcg/simulator-ui";
import {
  useBoardProjection,
  useGundamGame,
  useMoveLogs,
  useStatus,
  useViewerId,
} from "../game/index.ts";
import type { TurnTaggedMoveLog } from "../game/adapter.ts";
import type { BoardProjection } from "../game/index.ts";
import { cardImageUrlOf, findCardByInstanceId } from "../components/containers/mappers.ts";

const MAX_PHASE_EVENTS = 10;
const HIDDEN_DRAW_CARD_ID_PREFIX = "__gundam_hidden_draw__";

export function GundamSharedAnimationLayer({ children }: { readonly children: ReactNode }) {
  const view = useBoardProjection();
  const status = useStatus();
  const viewerSeatId = String(useViewerId());
  const moveLogs = useMoveLogs();
  const newMoveLogs = useMoveLogsAfterPreviousSnapshot(moveLogs);
  const { adapter } = useGundamGame();
  const phaseEvents = usePhaseChangeEvents(status);

  const cardEvents = useMemo(() => {
    const records = newMoveLogs.flatMap(({ log }) => gundamMoveLogToCardMoveRecords(log, view));
    return cardMoveRecordsToSimulatorEvents(records, {
      viewerSeatId,
      resolveEntity: (cardId) => simulatorEntityForCard(cardId, view, adapter.cardDefinitionOf),
      zoneDescriptor: gundamZoneDescriptor,
    });
  }, [adapter, newMoveLogs, view, viewerSeatId]);

  const visualEvents = useMemo(
    () => [
      ...newMoveLogs.flatMap(({ log }) => gundamMoveLogToVisualEvents(log, view)),
      ...phaseEvents,
    ],
    [newMoveLogs, phaseEvents, view],
  );

  return (
    <VisualAnimationLayer events={visualEvents}>
      <SimulatorAnimationLayer events={cardEvents}>{children}</SimulatorAnimationLayer>
    </VisualAnimationLayer>
  );
}

function useMoveLogsAfterPreviousSnapshot(
  moveLogs: readonly TurnTaggedMoveLog[],
): readonly TurnTaggedMoveLog[] {
  const previousMoveLogsRef = useRef<readonly TurnTaggedMoveLog[] | null>(null);
  const previousMoveLogs = previousMoveLogsRef.current;

  useEffect(() => {
    previousMoveLogsRef.current = moveLogs;
  }, [moveLogs]);

  if (!previousMoveLogs || moveLogs.length <= previousMoveLogs.length) {
    return [];
  }

  return moveLogs.slice(previousMoveLogs.length);
}

function gundamMoveLogToCardMoveRecords(
  log: GundamMoveLog,
  view: BoardProjection,
): CardMoveAnimationRecord[] {
  const records: CardMoveAnimationRecord[] = [];
  const prefix = log.commandID ?? `${log.timestamp}:${log.type}`;

  if (log.type === "deployUnit") {
    records.push(playedCardRecord(prefix, log.cardId, log.playerId, "battleArea"));
  } else if (log.type === "deployBase") {
    records.push(playedCardRecord(prefix, log.cardId, log.playerId, "baseSection"));
  } else if (log.type === "playCommand") {
    records.push(playedCardRecord(prefix, log.cardId, log.playerId, "removalArea"));
  } else if (log.type === "assignPilot") {
    records.push(playedCardRecord(prefix, log.pilotId, log.playerId, "battleArea"));
  }

  for (const moved of log.outcomes?.cardsMoved ?? []) {
    const cardId = String(moved.cardId);
    records.push({
      id: `${prefix}:move:${cardId}:${records.length}`,
      cardId,
      ownerId: ownerIdForCard(cardId, view, String(log.playerId)),
      fromZoneId: moved.from,
      toZoneId: moved.to,
    });
  }

  for (const cardId of log.outcomes?.cardsReturnedToHand ?? []) {
    const resolvedCardId = String(cardId);
    records.push({
      id: `${prefix}:return:${resolvedCardId}:${records.length}`,
      cardId: resolvedCardId,
      ownerId: ownerIdForCard(resolvedCardId, view, String(log.playerId)),
      toZoneId: "hand",
    });
  }

  for (const cardId of log.outcomes?.cardsDiscarded ?? []) {
    const resolvedCardId = String(cardId);
    records.push({
      id: `${prefix}:discard:${resolvedCardId}:${records.length}`,
      cardId: resolvedCardId,
      ownerId: ownerIdForCard(resolvedCardId, view, String(log.playerId)),
      toZoneId: "trash",
    });
  }

  for (const defeated of log.outcomes?.unitsDefeated ?? []) {
    records.push({
      id: `${prefix}:defeated:${defeated.cardId}:${records.length}`,
      cardId: String(defeated.cardId),
      ownerId: String(defeated.ownerId),
      toZoneId: "trash",
    });
  }

  for (const shield of log.outcomes?.shieldsRemoved ?? []) {
    records.push({
      id: `${prefix}:shield:${shield.cardId}:${records.length}`,
      cardId: String(shield.cardId),
      ownerId: String(shield.playerId),
      fromZoneId: "shieldArea",
      toZoneId: "hand",
    });
  }

  for (const placed of log.outcomes?.resourcesPlaced ?? []) {
    records.push({
      id: `${prefix}:resource:${placed.cardId}:${records.length}`,
      cardId: String(placed.cardId),
      ownerId: String(placed.playerId),
      toZoneId: "resourceArea",
    });
  }

  const drawOutcome = log.outcomes?.cardsDrawn;
  const visibleDrawnCardIds = visiblePrivateValues(drawOutcome?.cardIds);
  const drawOwnerId = String(drawOutcome?.playerId ?? log.playerId);
  drawRecordCardIds({
    prefix,
    ownerId: drawOwnerId,
    visibleCardIds: visibleDrawnCardIds,
    publicCount: drawOutcome?.count ?? visibleDrawnCardIds.length,
  }).forEach((cardId, index) => {
    records.push({
      id: `${prefix}:draw-outcome:${cardId}:${index}`,
      cardId,
      ownerId: ownerIdForCard(cardId, view, drawOwnerId),
      fromZoneId: "deck",
      toZoneId: "hand",
      reason: "draw",
      delayMs: index * 70,
    });
  });

  return dedupeRecords(records);
}

function gundamMoveLogToVisualEvents(
  log: GundamMoveLog,
  view: BoardProjection,
): VisualAnimationEvent[] {
  const events: VisualAnimationEvent[] = [];
  const prefix = log.commandID ?? `${log.timestamp}:${log.type}`;

  if (log.type === "attack") {
    events.push({
      id: `${prefix}:combat:declared:${log.attackerId}:${log.targetId}`,
      primitive: "combat",
      sourceEntityId: String(log.attackerId),
      ...(log.targetId === "direct"
        ? { targetPlayerId: opponentOf(view, String(log.playerId)) ?? String(log.playerId) }
        : { targetEntityId: String(log.targetId) }),
      reason: "declared",
    });
  } else if (log.type === "block") {
    events.push({
      id: `${prefix}:combat:block:${log.blockerId}:${log.attackerId}`,
      primitive: "combat",
      sourceEntityId: String(log.blockerId),
      targetEntityId: String(log.attackerId),
      reason: "declared",
    });
  }

  for (const damage of log.outcomes?.damageDealt ?? []) {
    const sourceEntityId =
      damage.sourceCardId ??
      (log.type === "attack" ? log.attackerId : log.type === "block" ? log.blockerId : undefined);
    if (!sourceEntityId) {
      continue;
    }
    events.push({
      id: `${prefix}:combat:resolved:${sourceEntityId}:${damage.targetId}:${events.length}`,
      primitive: "combat",
      sourceEntityId: String(sourceEntityId),
      targetEntityId: String(damage.targetId),
      reason: "resolved",
      delayMs: 120,
    });
  }

  const spent = log.outcomes?.resourcesSpent;
  if (spent && (spent.regularCount > 0 || spent.exRemovedCount > 0)) {
    const total = spent.regularCount + spent.exRemovedCount;
    events.push({
      id: `${prefix}:resource:spent`,
      primitive: "resourceFloat",
      playerId: String(log.playerId),
      delta: -total,
      label: "RES",
    });
  }

  for (const placed of log.outcomes?.resourcesPlaced ?? []) {
    events.push({
      id: `${prefix}:resource:placed:${placed.cardId}`,
      primitive: "resourceFloat",
      playerId: String(placed.playerId),
      delta: 1,
      label: "RES",
      delayMs: 120,
    });
  }

  return events;
}

function usePhaseChangeEvents(status: BoardProjection["status"]): readonly VisualAnimationEvent[] {
  const [events, setEvents] = useState<VisualAnimationEvent[]>([]);
  const previousRef = useRef<string | null>(null);
  const current = statusLabel(status);

  useEffect(() => {
    const previous = previousRef.current;
    previousRef.current = current;
    if (!previous || previous === current) {
      return;
    }
    const event: VisualAnimationEvent = {
      id: `phase:${status.turn}:${status.gameSegment ?? ""}:${status.phase ?? ""}:${status.step ?? ""}`,
      primitive: "phaseChange",
      from: previous,
      to: current,
    };
    setEvents((existing) => [...existing, event].slice(-MAX_PHASE_EVENTS));
  }, [current, status.gameSegment, status.phase, status.step, status.turn]);

  return events;
}

function playedCardRecord(
  prefix: string,
  cardId: string,
  playerId: string,
  toZoneId: string,
): CardMoveAnimationRecord {
  return {
    id: `${prefix}:play:${cardId}`,
    cardId: String(cardId),
    ownerId: String(playerId),
    fromZoneId: "hand",
    toZoneId,
  };
}

function visiblePrivateValues(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((id): id is string => typeof id === "string");
  }
  if (
    typeof value === "object" &&
    value !== null &&
    "value" in value &&
    Array.isArray((value as { value?: unknown }).value)
  ) {
    return (value as { value: unknown[] }).value.filter(
      (id): id is string => typeof id === "string",
    );
  }
  return [];
}

function dedupeRecords(records: readonly CardMoveAnimationRecord[]): CardMoveAnimationRecord[] {
  const seen = new Set<string>();
  return records.filter((record) => {
    const key = `${record.cardId}:${record.fromZoneId ?? ""}:${record.toZoneId}:${record.reason ?? ""}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function simulatorEntityForCard(
  cardId: string,
  view: BoardProjection,
  resolveDefinition: (instanceId: string) => Card | null,
): SimulatorEntity | null {
  const hiddenDrawOwnerId = hiddenDrawOwnerIdFromCardId(cardId);
  if (hiddenDrawOwnerId) {
    return hiddenDrawEntity(cardId, hiddenDrawOwnerId);
  }

  const visibleCard = findCardByInstanceId(view, cardId);
  const definition = visibleCard?.definition ?? resolveDefinition(cardId);
  if (!definition) {
    return null;
  }

  return {
    id: cardId,
    title: definition.name,
    subtitle: definition.type,
    kind: simulatorEntityKind(definition.type),
    ownerId: visibleCard?.ownerId ?? ownerIdFromCardId(cardId) ?? "",
    face: visibleCard?.faceDown ? "hidden" : "public",
    states: visibleCard?.meta?.exhausted ? ["rested"] : [],
    stats: simulatorStats(definition),
    traits: definition.traits ?? [],
    imageUrl: cardImageUrlOf(definition),
  };
}

function simulatorStats(definition: Card): SimulatorEntity["stats"] {
  if (definition.type === "unit") {
    return [
      { label: "AP", value: String(definition.ap) },
      { label: "HP", value: String(definition.hp) },
    ];
  }
  if (definition.type === "base") {
    return [{ label: "HP", value: String(definition.hp) }];
  }
  return [];
}

function drawRecordCardIds({
  prefix,
  ownerId,
  visibleCardIds,
  publicCount,
}: {
  readonly prefix: string;
  readonly ownerId: string;
  readonly visibleCardIds: readonly string[];
  readonly publicCount: number;
}): string[] {
  const count = Math.max(0, publicCount);
  const hiddenCount = Math.max(0, count - visibleCardIds.length);
  return [
    ...visibleCardIds,
    ...Array.from({ length: hiddenCount }, (_, index) =>
      hiddenDrawCardId(prefix, ownerId, visibleCardIds.length + index),
    ),
  ];
}

function hiddenDrawCardId(prefix: string, ownerId: string, index: number): string {
  return `${HIDDEN_DRAW_CARD_ID_PREFIX}${ownerId}:${prefix}:${index}`;
}

function hiddenDrawOwnerIdFromCardId(cardId: string): string | null {
  if (!cardId.startsWith(HIDDEN_DRAW_CARD_ID_PREFIX)) {
    return null;
  }
  const withoutPrefix = cardId.slice(HIDDEN_DRAW_CARD_ID_PREFIX.length);
  const separatorIndex = withoutPrefix.indexOf(":");
  return separatorIndex > 0 ? withoutPrefix.slice(0, separatorIndex) : null;
}

function hiddenDrawEntity(cardId: string, ownerId: string): SimulatorEntity {
  return {
    id: cardId,
    title: "Hidden Card",
    subtitle: "Card",
    kind: "card",
    ownerId,
    face: "hidden",
    states: [],
    stats: [],
    traits: [],
  };
}

function simulatorEntityKind(type: Card["type"]): SimulatorEntity["kind"] {
  switch (type) {
    case "unit":
      return "unit";
    case "resource":
      return "resource";
    case "base":
      return "leader";
    default:
      return "card";
  }
}

function ownerIdForCard(cardId: string, view: BoardProjection, fallbackOwnerId: string): string {
  return (
    findCardByInstanceId(view, cardId)?.ownerId ?? ownerIdFromCardId(cardId) ?? fallbackOwnerId
  );
}

function ownerIdFromCardId(cardId: string): string | null {
  const match = /^(.*)_(deck|resourceDeck|resource|shield)_/.exec(cardId);
  return match?.[1] ?? null;
}

function opponentOf(view: BoardProjection, playerId: string): string | null {
  for (const player of view.players) {
    const candidate = String(player.playerId);
    if (candidate !== playerId) {
      return candidate;
    }
  }
  return null;
}

function statusLabel(status: BoardProjection["status"]): string {
  return [status.gameSegment, status.phase, status.step].filter(Boolean).join(" / ");
}

function gundamZoneDescriptor(zoneId: string, ownerId: string): SimulatorZone {
  const id = `${zoneId}:${ownerId}`;
  switch (zoneId) {
    case "deck":
      return zoneDescriptor(id, "Deck", "deck", ownerId, "secret");
    case "hand":
      return zoneDescriptor(id, "Hand", "hand", ownerId, "private");
    case "battleArea":
      return zoneDescriptor(id, "Battle Area", "battlefield", ownerId, "public");
    case "baseSection":
      return zoneDescriptor(id, "Base", "leader", ownerId, "public");
    case "shieldArea":
      return zoneDescriptor(id, "Shields", "life", ownerId, "secret");
    case "resourceArea":
      return zoneDescriptor(id, "Resources", "resource", ownerId, "public");
    case "trash":
      return zoneDescriptor(id, "Trash", "discard", ownerId, "public");
    case "removalArea":
      return zoneDescriptor(id, "Removal Area", "custom", ownerId, "public");
    default:
      return zoneDescriptor(id, zoneId, "custom", ownerId, "public");
  }
}

function zoneDescriptor(
  id: string,
  label: string,
  role: SimulatorZone["role"],
  ownerId: string,
  visibility: SimulatorZone["visibility"],
): SimulatorZone {
  return {
    id,
    label,
    role,
    ownerId,
    visibility,
    entityIds: [],
    hint: label,
  };
}
