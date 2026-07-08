import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type {
  AnimationPlanStepV1,
  AnimationPlanV1,
  AnimationRef,
  AnimationZoneRef,
} from "@tcg/protocol";
import type { Card } from "@tcg/gundam-types";
import type { GundamMoveLog } from "@tcg/gundam-engine";
import type { SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";
import {
  cardMoveRecordsToAnimationPlans,
  MotionAnimationSurface,
  type CardMoveAnimationRecord,
} from "@tcg/simulator-ui";
import { useSimulatorAudio } from "../../../../simulator/audio";
import {
  useBoardProjection,
  useGundamGame,
  useMoveLogs,
  usePacketAnimations,
  useStatus,
  useViewerId,
} from "../game/index.ts";
import type { TurnTaggedPacketAnimation } from "../game/adapter.ts";
import type { BoardProjection } from "../game/index.ts";
import { cardImageUrlOf, findCardByInstanceId } from "../components/containers/mappers.ts";

const MAX_PHASE_EVENTS = 10;
const HIDDEN_DRAW_CARD_ID_PREFIX = "__gundam_hidden_draw__";

export function GundamSharedAnimationLayer({ children }: { readonly children: ReactNode }) {
  const view = useBoardProjection();
  const status = useStatus();
  const viewerSeatId = String(useViewerId());
  const moveLogs = useMoveLogs();
  const packetAnimations = usePacketAnimations();
  const moveLogSnapshot = useItemsAfterPreviousSnapshot(moveLogs);
  const packetAnimationSnapshot = useItemsAfterPreviousSnapshot(packetAnimations);
  const newMoveLogs = moveLogSnapshot.newItems;
  const newPacketAnimations = packetAnimationSnapshot.newItems;
  const { adapter } = useGundamGame();
  const phasePlans = usePhaseChangePlans(status);
  const { cancelScheduledCues, scheduleAnimationSteps } = useSimulatorAudio();

  const cardPlans = useMemo(() => {
    const records = newPacketAnimations.flatMap((entry) =>
      gundamPacketAnimationToCardMoveRecords(entry, view, viewerSeatId),
    );
    return cardMoveRecordsToAnimationPlans(records.map(gundamCanonicalCardMoveRecord));
  }, [newPacketAnimations, view, viewerSeatId]);

  const visualPlans = useMemo(
    () => [
      ...newMoveLogs.flatMap(({ log }) => gundamMoveLogToAnimationPlans(log, view)),
      ...phasePlans,
    ],
    [newMoveLogs, phasePlans, view],
  );
  const animationPlans = useMemo(() => [...cardPlans, ...visualPlans], [cardPlans, visualPlans]);

  useEffect(() => {
    if (moveLogSnapshot.didReset || packetAnimationSnapshot.didReset) {
      cancelScheduledCues();
    }
  }, [cancelScheduledCues, moveLogSnapshot.didReset, packetAnimationSnapshot.didReset]);

  useEffect(() => () => cancelScheduledCues(), [cancelScheduledCues]);

  return (
    <MotionAnimationSurface
      animationPlans={animationPlans}
      viewerSeatId={viewerSeatId}
      resolveEntity={(cardId) => simulatorEntityForCard(cardId, view, adapter.cardDefinitionOf)}
      resolveZone={gundamAnimationZoneResolver}
      onAnimationStepsScheduled={scheduleAnimationSteps}
    >
      {children}
    </MotionAnimationSurface>
  );
}

interface SnapshotDelta<T> {
  readonly newItems: readonly T[];
  readonly didReset: boolean;
}

function useItemsAfterPreviousSnapshot<T>(items: readonly T[]): SnapshotDelta<T> {
  const previousItemsRef = useRef<readonly T[] | null>(null);
  const previousItems = previousItemsRef.current;

  useEffect(() => {
    previousItemsRef.current = items;
  }, [items]);

  const didReset = Boolean(previousItems && items.length < previousItems.length);
  const newItems =
    !previousItems || items.length <= previousItems.length ? [] : items.slice(previousItems.length);

  return { newItems, didReset };
}

function gundamPacketAnimationToCardMoveRecords(
  entry: TurnTaggedPacketAnimation,
  view: BoardProjection,
  viewerSeatId: string,
): CardMoveAnimationRecord[] {
  const { animation } = entry;
  if (animation.data.kind !== "cardMove") {
    return [];
  }
  const { cardId, fromZone, toZone } = animation.data;
  return [
    {
      id: animation.id,
      cardId,
      ownerId: ownerIdForCard(cardId, view, viewerSeatId),
      ...(fromZone ? { fromZoneId: fromZone } : {}),
      toZoneId: toZone,
      ...(baseZoneId(fromZone) === "deck" && baseZoneId(toZone) === "hand"
        ? { reason: "draw" as const }
        : {}),
      audioCue: gundamCardMoveAudioCue(fromZone, toZone),
    },
  ];
}

export function gundamMoveLogToCardMoveRecords(
  log: GundamMoveLog,
  view: BoardProjection,
  viewerSeatId: string,
  revealPrivateFields = false,
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
    if (isDeckToHandMove(moved.from, moved.to)) {
      continue;
    }
    records.push({
      id: `${prefix}:move:${cardId}:${records.length}`,
      cardId,
      ownerId: ownerIdForCard(cardId, view, String(log.playerId)),
      fromZoneId: moved.from,
      toZoneId: moved.to,
      audioCue: gundamCardMoveAudioCue(moved.from, moved.to),
    });
  }

  for (const cardId of log.outcomes?.cardsReturnedToHand ?? []) {
    const resolvedCardId = String(cardId);
    records.push({
      id: `${prefix}:return:${resolvedCardId}:${records.length}`,
      cardId: resolvedCardId,
      ownerId: ownerIdForCard(resolvedCardId, view, String(log.playerId)),
      toZoneId: "hand",
      audioCue: "card.move",
    });
  }

  for (const cardId of log.outcomes?.cardsDiscarded ?? []) {
    const resolvedCardId = String(cardId);
    records.push({
      id: `${prefix}:discard:${resolvedCardId}:${records.length}`,
      cardId: resolvedCardId,
      ownerId: ownerIdForCard(resolvedCardId, view, String(log.playerId)),
      toZoneId: "trash",
      audioCue: "card.discard",
    });
  }

  for (const defeated of log.outcomes?.unitsDefeated ?? []) {
    records.push({
      id: `${prefix}:defeated:${defeated.cardId}:${records.length}`,
      cardId: String(defeated.cardId),
      ownerId: String(defeated.ownerId),
      toZoneId: "trash",
      audioCue: "card.discard",
    });
  }

  for (const shield of log.outcomes?.shieldsRemoved ?? []) {
    records.push({
      id: `${prefix}:shield:${shield.cardId}:${records.length}`,
      cardId: String(shield.cardId),
      ownerId: String(shield.playerId),
      fromZoneId: "shieldArea",
      toZoneId: "hand",
      audioCue: "card.draw",
    });
  }

  for (const placed of log.outcomes?.resourcesPlaced ?? []) {
    records.push({
      id: `${prefix}:resource:${placed.cardId}:${records.length}`,
      cardId: String(placed.cardId),
      ownerId: String(placed.playerId),
      toZoneId: "resourceArea",
      audioCue: "resource.gain",
    });
  }

  const drawOutcome = log.outcomes?.cardsDrawn;
  const visibleDrawnCardIds = visiblePrivateValues(
    drawOutcome?.cardIds,
    viewerSeatId,
    revealPrivateFields,
  );
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
      audioCue: "card.draw",
    });
  });

  return dedupeRecords(records);
}

function isDeckToHandMove(fromZoneId: string | undefined, toZoneId: string): boolean {
  return baseZoneId(fromZoneId) === "deck" && baseZoneId(toZoneId) === "hand";
}

function baseZoneId(zoneId: string | undefined): string | undefined {
  return zoneId?.split(":")[0];
}

function gundamMoveLogToAnimationPlans(
  log: GundamMoveLog,
  view: BoardProjection,
): AnimationPlanV1[] {
  const plans: AnimationPlanV1[] = [];
  const prefix = log.commandID ?? `${log.timestamp}:${log.type}`;

  if (log.type === "attack") {
    const targetPlayerId = opponentOf(view, String(log.playerId)) ?? String(log.playerId);
    plans.push(
      animationPlan(`${prefix}:combat:declared:${log.attackerId}:${log.targetId}`, {
        id: `${prefix}:combat:declared`,
        type: "combat",
        source: entityRef(String(log.attackerId)),
        target:
          log.targetId === "direct"
            ? gundamZoneRef("baseSection", targetPlayerId)
            : entityRef(String(log.targetId)),
        reason: "declared",
        audioCue: "combat.start",
      }),
    );
  } else if (log.type === "block") {
    plans.push(
      animationPlan(`${prefix}:combat:block:${log.blockerId}:${log.attackerId}`, {
        id: `${prefix}:combat:block`,
        type: "combat",
        source: entityRef(String(log.blockerId)),
        target: entityRef(String(log.attackerId)),
        reason: "declared",
        audioCue: "combat.start",
      }),
    );
  }

  for (const damage of log.outcomes?.damageDealt ?? []) {
    const sourceEntityId =
      damage.sourceCardId ??
      (log.type === "attack" ? log.attackerId : log.type === "block" ? log.blockerId : undefined);
    if (!sourceEntityId) {
      continue;
    }
    plans.push(
      animationPlan(
        `${prefix}:combat:resolved:${sourceEntityId}:${damage.targetId}:${plans.length}`,
        {
          id: `${prefix}:combat:resolved:${plans.length}`,
          type: "combat",
          source: entityRef(String(sourceEntityId)),
          target: entityRef(String(damage.targetId)),
          reason: "resolved",
          delayMs: 120,
          audioCue: "combat.hit",
        },
      ),
    );
  }

  const spent = log.outcomes?.resourcesSpent;
  if (spent && (spent.regularCount > 0 || spent.exRemovedCount > 0)) {
    const total = spent.regularCount + spent.exRemovedCount;
    const playerId = String(log.playerId);
    plans.push(
      animationPlan(`${prefix}:resource:spent`, {
        id: `${prefix}:resource:spent`,
        type: "resourceDelta",
        player: { kind: "player", id: playerId },
        anchor: { kind: "anchor", id: `resourceArea:${playerId}` },
        delta: -total,
        label: "RES",
        audioCue: "resource.spend",
      }),
    );
  }

  for (const placed of log.outcomes?.resourcesPlaced ?? []) {
    const playerId = String(placed.playerId);
    plans.push(
      animationPlan(`${prefix}:resource:placed:${placed.cardId}`, {
        id: `${prefix}:resource:placed:${placed.cardId}`,
        type: "resourceDelta",
        player: { kind: "player", id: playerId },
        anchor: { kind: "anchor", id: `resourceArea:${playerId}` },
        delta: 1,
        label: "RES",
        delayMs: 120,
        audioCue: "resource.gain",
      }),
    );
  }

  return plans;
}

function usePhaseChangePlans(status: BoardProjection["status"]): readonly AnimationPlanV1[] {
  const [plans, setPlans] = useState<AnimationPlanV1[]>([]);
  const previousRef = useRef<string | null>(null);
  const current = statusLabel(status);

  useEffect(() => {
    const previous = previousRef.current;
    previousRef.current = current;
    if (!previous || previous === current) {
      return;
    }
    const id = `phase:${status.turn}:${status.gameSegment ?? ""}:${status.phase ?? ""}:${status.step ?? ""}`;
    const plan = animationPlan(id, {
      id: `${id}:phase`,
      type: "phaseChange",
      from: previous,
      to: current,
      audioCue: "phase.change",
    });
    setPlans((existing) => [...existing, plan].slice(-MAX_PHASE_EVENTS));
  }, [current, status.gameSegment, status.phase, status.step, status.turn]);

  return plans;
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
    audioCue: "card.play",
  };
}

function gundamCardMoveAudioCue(
  fromZoneId: string | undefined,
  toZoneId: string,
): CardMoveAnimationRecord["audioCue"] {
  if (baseZoneId(fromZoneId) === "deck" && baseZoneId(toZoneId) === "hand") {
    return "card.draw";
  }
  if (baseZoneId(toZoneId) === "trash") {
    return "card.discard";
  }
  if (baseZoneId(toZoneId) === "resourceArea") {
    return "resource.gain";
  }
  return "card.move";
}

function visiblePrivateValues(
  value: unknown,
  viewerSeatId: string,
  revealPrivateFields: boolean,
): string[] {
  if (Array.isArray(value)) {
    return value.filter((id): id is string => typeof id === "string");
  }
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
        visibleTo.some((id) => typeof id === "string" && id === viewerSeatId));
    if (!canReveal) return [];
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

function gundamCanonicalCardMoveRecord(record: CardMoveAnimationRecord): CardMoveAnimationRecord {
  return {
    ...record,
    fromZoneId: record.fromZoneId
      ? gundamRenderedZoneId(record.fromZoneId, record.ownerId)
      : undefined,
    toZoneId: gundamRenderedZoneId(record.toZoneId, record.ownerId),
  };
}

function animationPlan(id: string, step: AnimationPlanStepV1): AnimationPlanV1 {
  return { id, version: 1, anchors: [], steps: [step] };
}

function entityRef(id: string): AnimationRef {
  return { kind: "entity", id };
}

function gundamZoneRef(zoneId: string, ownerId: string): AnimationZoneRef {
  return {
    kind: "zone",
    id: gundamRenderedZoneId(zoneId, ownerId),
    ownerId,
  };
}

function gundamAnimationZoneResolver(ref: AnimationZoneRef): SimulatorZone | null {
  const parsed = parseGundamRenderedZoneId(ref.id, ref.ownerId);
  if (!parsed) {
    return null;
  }
  return gundamZoneDescriptor(parsed.zoneId, parsed.ownerId);
}

function parseGundamRenderedZoneId(
  zoneId: string,
  ownerId: string | undefined,
): { zoneId: string; ownerId: string } | null {
  const separator = zoneId.indexOf(":");
  if (separator > 0) {
    return {
      zoneId: zoneId.slice(0, separator),
      ownerId: zoneId.slice(separator + 1),
    };
  }
  if (!ownerId) {
    return null;
  }
  return { zoneId, ownerId };
}

function gundamRenderedZoneId(zoneId: string, ownerId: string): string {
  return zoneId.includes(":") ? zoneId : `${zoneId}:${ownerId}`;
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
