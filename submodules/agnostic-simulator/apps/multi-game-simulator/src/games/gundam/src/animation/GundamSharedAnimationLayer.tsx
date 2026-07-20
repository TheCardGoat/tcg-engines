import { useEffect, useMemo, useRef, useState, type MutableRefObject, type ReactNode } from "react";
import type {
  AnimationAnchorRef,
  AnimationPlanStepV1,
  AnimationPlanV1,
  AnimationEntityRef,
  AnimationZoneRef,
} from "@tcg/protocol";
import type { Card } from "@tcg/gundam-types";
import type { MatchRuntime } from "@tcg/gundam-engine";
import type { SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";
import {
  cardMoveRecordsToAnimationPlans,
  MotionAnimationSurface,
  type CardMoveAnimationRecord,
  type ScheduledAnimationStep,
  useAnimationPlanQueue,
} from "@tcg/simulator-ui";
import { useSimulatorAudio } from "../../../../simulator/audio";
import { useBoardProjection, useGundamGame, usePacketAnimations } from "../game/index.ts";
import type { TurnTaggedPacketAnimation } from "../game/adapter.ts";
import type { BoardProjection } from "../game/index.ts";
import { cardImageUrlOf, findCardByInstanceId } from "../components/containers/mappers.ts";
import { animationPlaybackGateFor } from "../game/bot/animation-playback-gate.ts";
import { CommandFocusArea, GUNDAM_COMMAND_FOCUS_ANCHOR_ID } from "./CommandFocusArea.tsx";

export function GundamSharedAnimationLayer({
  children,
  runtime,
}: {
  readonly children: ReactNode;
  readonly runtime: MatchRuntime;
}) {
  const view = useBoardProjection();
  const packetAnimations = usePacketAnimations();
  const packetAnimationSnapshot = useItemsAfterPreviousSnapshot(
    packetAnimations,
    (entry) => entry.animation.id,
  );
  const newPacketAnimations = packetAnimationSnapshot.newItems;
  const { adapter } = useGundamGame();
  const viewerSeatId = adapter.viewerContext.playerId
    ? String(adapter.viewerContext.playerId)
    : null;
  const { cancelScheduledCues, scheduleAnimationSteps } = useSimulatorAudio();
  const animationGate = useMemo(() => animationPlaybackGateFor(runtime), [runtime]);
  const historicalEntitiesRef = useHistoricalSimulatorEntities(view);
  const incomingCommandId = latestPlayedCommandPacketId(newPacketAnimations);
  const [focusedCommand, setFocusedCommand] = useState<{
    readonly id: string;
    readonly visible: boolean;
  } | null>(null);

  useEffect(() => {
    if (incomingCommandId && incomingCommandId !== focusedCommand?.id) {
      setFocusedCommand({ id: incomingCommandId, visible: false });
    }
  }, [focusedCommand?.id, incomingCommandId]);

  const incomingPlans = useMemo(
    () =>
      newPacketAnimations.flatMap((entry) =>
        gundamPacketAnimationToAnimationPlans(entry, view, viewerSeatId),
      ),
    [newPacketAnimations, view, viewerSeatId],
  );
  const animationsReset = packetAnimationSnapshot.didReset;
  const {
    plans: retainedPlans,
    completePlan,
    clearPlans,
  } = useAnimationPlanQueue({
    incomingPlans,
    reset: animationsReset,
    gate: animationGate,
  });

  useEffect(() => {
    if (packetAnimationSnapshot.didReset) {
      cancelScheduledCues();
      animationGate.clear();
      clearPlans();
      setFocusedCommand(null);
    }
  }, [animationGate, cancelScheduledCues, packetAnimationSnapshot.didReset, clearPlans]);

  useEffect(
    () => () => {
      cancelScheduledCues();
      animationGate.clear();
    },
    [animationGate, cancelScheduledCues],
  );

  const onAnimationStepsScheduled = (steps: readonly ScheduledAnimationStep[]) => {
    scheduleAnimationSteps(steps);
  };
  const onPlanComplete = (planId: string) => {
    if (isCommandEntryPlanId(planId)) {
      setFocusedCommand((current) => (current ? { ...current, visible: true } : current));
    }
    const completedPlan = retainedPlans.find((plan) => plan.id === planId);
    if (completedPlan && planCleansUpCommand(completedPlan)) {
      setFocusedCommand(null);
    }
    completePlan(planId);
  };

  const focusedCommandId = incomingCommandId ?? focusedCommand?.id ?? null;
  const focusedCommandEntity =
    focusedCommandId && focusedCommand?.id === focusedCommandId && focusedCommand?.visible === true
      ? simulatorEntityForCard(focusedCommandId, view)
      : null;

  return (
    <MotionAnimationSurface
      animationPlans={retainedPlans}
      viewerSeatId={viewerSeatId}
      resolveEntity={(cardId) =>
        resolveAnimatedEntity(
          simulatorEntityForCard(cardId, view),
          historicalEntitiesRef.current.get(cardId) ?? null,
          viewerSeatId,
        )
      }
      resolveZone={gundamAnimationZoneResolver}
      onAnimationStepsScheduled={onAnimationStepsScheduled}
      onPlanComplete={onPlanComplete}
    >
      {children}
      <CommandFocusArea entity={focusedCommandEntity} active={focusedCommandId !== null} />
    </MotionAnimationSurface>
  );
}

interface SnapshotDelta<T> {
  readonly newItems: readonly T[];
  readonly didReset: boolean;
}

function useItemsAfterPreviousSnapshot<T>(
  items: readonly T[],
  itemKey: (item: T) => string,
): SnapshotDelta<T> {
  const previousItemsRef = useRef<readonly T[] | null>(null);
  const previousItems = previousItemsRef.current;

  useEffect(() => {
    previousItemsRef.current = items;
  }, [items]);

  return itemsAfterPreviousSnapshot(items, previousItems, itemKey);
}

export function itemsAfterPreviousSnapshot<T>(
  items: readonly T[],
  previousItems: readonly T[] | null,
  itemKey: (item: T) => string,
): SnapshotDelta<T> {
  if (!previousItems) return { newItems: [], didReset: false };
  if (items.length < previousItems.length) return { newItems: [], didReset: true };

  const previousLast = previousItems.at(-1);
  if (!previousLast) return { newItems: items, didReset: false };
  const previousLastKey = itemKey(previousLast);
  const previousLastIndex = items.findIndex((item) => itemKey(item) === previousLastKey);
  if (previousLastIndex >= 0) {
    return { newItems: items.slice(previousLastIndex + 1), didReset: false };
  }

  return {
    newItems: items.length > previousItems.length ? items.slice(previousItems.length) : items,
    didReset: false,
  };
}

export function gundamPacketAnimationToAnimationPlans(
  entry: TurnTaggedPacketAnimation,
  view: BoardProjection,
  viewerSeatId: string | null,
): AnimationPlanV1[] {
  const { animation } = entry;
  const { data } = animation;

  if (data.kind === "cardMove") {
    const { cardId, fromZone, toZone } = data;
    if (
      baseZoneId(fromZone) === "removalArea" &&
      baseZoneId(toZone) === "trash" &&
      isCommandCard(view, cardId)
    ) {
      return [];
    }
    const ownerId = data.ownerId ?? ownerIdForCard(cardId, view, viewerSeatId ?? "");
    const record: CardMoveAnimationRecord = {
      id: animation.id,
      cardId,
      ownerId,
      ...(fromZone ? { fromZoneId: fromZone } : {}),
      toZoneId: toZone,
      ...(baseZoneId(fromZone) === "deck" && baseZoneId(toZone) === "hand"
        ? { reason: "draw" as const }
        : {}),
      audioCue: gundamCardMoveAudioCue(fromZone, toZone),
    };
    const plans = cardMoveRecordsToAnimationPlans([gundamCanonicalCardMoveRecord(record)]);
    if (baseZoneId(toZone) === "resourceArea") {
      plans.push(
        animationPlan(`${animation.id}:resource-gain`, {
          id: `${animation.id}:resource-gain:step`,
          type: "resourceDelta",
          player: { kind: "player", id: ownerId },
          anchor: { kind: "anchor", id: `resourceArea:${ownerId}` },
          delta: 1,
          label: "RES",
          delayMs: 120,
          audioCue: "resource.gain",
        }),
      );
    }
    return plans;
  }

  if (data.kind === "damage") {
    if (!data.sourceId) return [];
    return [
      animationPlan(`${animation.id}:resolved`, {
        id: `${animation.id}:resolved:step`,
        type: "combat",
        source: entityRef(data.sourceId),
        target: entityRef(data.targetId),
        reason: "resolved",
        detailLabel: `${data.amount} DMG`,
        audioCue: "combat.hit",
      }),
    ];
  }

  if (data.kind !== "generic") return [];
  const { name, params } = data;

  if (name === "attackDeclared") {
    const attackerId = stringParam(params, "attackerId");
    const targetId = stringParam(params, "targetId");
    const playerId = stringParam(params, "playerId");
    if (!attackerId || !targetId || !playerId) return [];
    const target =
      targetId === "direct"
        ? gundamZoneRef("baseSection", opponentOf(view, playerId) ?? playerId)
        : entityRef(targetId);
    return [
      animationPlan(`${animation.id}:declared`, {
        id: `${animation.id}:declared:step`,
        type: "combat",
        source: entityRef(attackerId),
        target,
        reason: "declared",
        audioCue: "combat.start",
      }),
    ];
  }

  if (name === "blockDeclared") {
    const blockerId = stringParam(params, "blockerId");
    const attackerId = stringParam(params, "attackerId");
    if (!blockerId || !attackerId) return [];
    return [
      animationPlan(`${animation.id}:declared`, {
        id: `${animation.id}:declared:step`,
        type: "combat",
        source: entityRef(blockerId),
        target: entityRef(attackerId),
        reason: "declared",
        audioCue: "combat.start",
      }),
    ];
  }

  if (name === "commandPlayed") {
    const cardId = stringParam(params, "cardId");
    const ownerId = stringParam(params, "ownerId");
    if (!cardId || !ownerId) return [];
    const entryPlan = animationPlan(`${animation.id}:command:entry:${cardId}`, {
      id: `${animation.id}:command:entry:step`,
      type: "moveEntity",
      entity: entityRef(cardId),
      from: gundamZoneRef("hand", ownerId),
      to: commandFocusRef(),
      label: "COMMAND",
      durationMs: 460,
      audioCue: "card.play",
    });
    return params.awaitsResolution === true
      ? [entryPlan]
      : [entryPlan, commandResolutionPlan(`${animation.id}:command:auto`, cardId, ownerId, 500)];
  }

  if (name === "effectResolved") {
    const sourceCardId = stringParam(params, "sourceCardId");
    const playerId = stringParam(params, "playerId");
    if (!sourceCardId || !playerId) return [];
    const targets = stringArrayParam(params, "targets").map(entityRef);
    if (isCommandCard(view, sourceCardId)) {
      return [
        commandResolutionPlan(
          `${animation.id}:command:resolved`,
          sourceCardId,
          ownerIdForCard(sourceCardId, view, playerId),
          0,
          targets,
          findCardByInstanceId(view, sourceCardId)?.zoneId !== "removalArea",
        ),
      ];
    }
    const source = entityRef(sourceCardId);
    return [
      animationPlan(`${animation.id}:effect`, {
        id: `${animation.id}:effect:step`,
        ...(targets.length > 0
          ? { type: "effect" as const, source, targets, label: "EFFECT" }
          : {
              type: "spotlightEntity" as const,
              entity: source,
              at: source,
              label: "EFFECT",
            }),
        audioCue: "effect.trigger",
      }),
    ];
  }

  if (name === "resourcesSpent") {
    const playerId = stringParam(params, "playerId");
    const amount = numberParam(params, "amount");
    if (!playerId || !amount) return [];
    return [
      animationPlan(`${animation.id}:resource-spent`, {
        id: `${animation.id}:resource-spent:step`,
        type: "resourceDelta",
        player: { kind: "player", id: playerId },
        anchor: { kind: "anchor", id: `resourceArea:${playerId}` },
        delta: -amount,
        label: "RES",
        audioCue: "resource.spend",
      }),
    ];
  }

  if (name === "cardStateChanged") {
    const cardId = stringParam(params, "cardId");
    const state = stringParam(params, "state");
    if (!cardId || (state !== "ready" && state !== "rested")) return [];
    return [
      animationPlan(`${animation.id}:state`, {
        id: `${animation.id}:state:step`,
        type: "spotlightEntity",
        entity: entityRef(cardId),
        at: entityRef(cardId),
        label: state === "ready" ? "READY" : "REST",
        durationMs: 360,
      }),
    ];
  }

  if (name === "turnChanged") {
    const previousTurn = numberParam(params, "previousTurn");
    const turn = numberParam(params, "turn");
    const playerId = stringParam(params, "playerId");
    if (previousTurn === null || turn === null || !playerId) return [];
    return [projectedTurnAnimationPlan(previousTurn, { number: turn, playerId })];
  }

  if (name === "phaseChanged") {
    const from = stringParam(params, "from");
    const to = stringParam(params, "to");
    if (!from || !to) return [];
    return [
      animationPlan(`${animation.id}:phase`, {
        id: `${animation.id}:phase:step`,
        type: "phaseChange",
        from,
        to,
        audioCue: "phase.change",
      }),
    ];
  }

  return [];
}

function baseZoneId(zoneId: string | undefined): string | undefined {
  return zoneId?.split(":")[0];
}

export function projectedTurnAnimationPlan(
  previousTurn: number,
  currentTurn: { readonly number: number; readonly playerId: string },
): AnimationPlanV1 {
  const id = `turn:${currentTurn.number}:${currentTurn.playerId}`;
  return animationPlan(id, {
    id: `${id}:change`,
    type: "phaseChange",
    from: `Turn ${previousTurn}`,
    to: `Turn ${currentTurn.number}`,
    variant: "turn",
    player: { kind: "player", id: currentTurn.playerId },
    turnNumber: Math.max(1, currentTurn.number),
    audioCue: "turn.change",
  });
}

function useHistoricalSimulatorEntities(
  view: BoardProjection,
): MutableRefObject<Map<string, SimulatorEntity>> {
  const entitiesRef = useRef(new Map<string, SimulatorEntity>());

  useEffect(() => {
    for (const zone of Object.values(view.zones.zones)) {
      for (const card of zone.cards) {
        const entity = simulatorEntityForCard(String(card.instanceId), view);
        if (entity) {
          entitiesRef.current.set(String(card.instanceId), entity);
        }
      }
    }
  }, [view]);

  return entitiesRef;
}

export function resolveAnimatedEntity(
  current: SimulatorEntity | null,
  historical: SimulatorEntity | null,
  viewerSeatId: string | null,
): SimulatorEntity | null {
  // A card that just left the viewer's private hand may already be projected as
  // hidden in its destination zone. Preserve the last viewer-authorized public
  // projection for the outgoing motion. Opponent and spectator entities never
  // satisfy this branch, so a stale cache cannot reveal private information.
  if (
    current?.face === "hidden" &&
    historical?.face === "public" &&
    historical.ownerId === viewerSeatId
  ) {
    return historical;
  }
  return current ?? historical;
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

function simulatorEntityForCard(cardId: string, view: BoardProjection): SimulatorEntity | null {
  const visibleCard = findCardByInstanceId(view, cardId);
  const definition = visibleCard?.definition;
  if (visibleCard && (!definition || visibleCard.faceDown)) {
    return hiddenCardEntity(cardId, String(visibleCard.ownerId));
  }
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

function hiddenCardEntity(cardId: string, ownerId: string): SimulatorEntity {
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

function commandResolutionPlan(
  id: string,
  cardId: string,
  ownerId: string,
  initialDelayMs: number,
  targets: readonly AnimationEntityRef[] = [],
  cleanup = true,
): AnimationPlanV1 {
  const entity = entityRef(cardId);
  const source = commandFocusRef();
  const effectDurationMs = 620;
  return {
    id,
    version: 1,
    anchors: [],
    steps: [
      targets.length > 0
        ? {
            id: `${id}:effect`,
            type: "effect",
            source,
            targets: [...targets],
            label: "COMMAND EFFECT",
            delayMs: initialDelayMs,
            durationMs: effectDurationMs,
            audioCue: "effect.trigger",
          }
        : {
            id: `${id}:spotlight`,
            type: "spotlightEntity",
            entity,
            at: source,
            label: "COMMAND EFFECT",
            delayMs: initialDelayMs,
            durationMs: effectDurationMs,
            audioCue: "effect.trigger",
          },
      ...(cleanup
        ? [
            {
              id: `${id}:cleanup`,
              type: "moveEntity" as const,
              entity,
              from: source,
              to: gundamZoneRef("trash", ownerId),
              delayMs: initialDelayMs + effectDurationMs,
              durationMs: 420,
              audioCue: "card.discard" as const,
            },
          ]
        : []),
    ],
  };
}

function commandFocusRef(): AnimationAnchorRef {
  return { kind: "anchor", id: GUNDAM_COMMAND_FOCUS_ANCHOR_ID };
}

function latestPlayedCommandPacketId(entries: readonly TurnTaggedPacketAnimation[]): string | null {
  for (let index = entries.length - 1; index >= 0; index -= 1) {
    const data = entries[index]?.animation.data;
    if (data?.kind === "generic" && data.name === "commandPlayed") {
      return stringParam(data.params, "cardId");
    }
  }
  return null;
}

function stringParam(params: Record<string, unknown>, key: string): string | null {
  return typeof params[key] === "string" ? params[key] : null;
}

function numberParam(params: Record<string, unknown>, key: string): number | null {
  const value = params[key];
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function stringArrayParam(params: Record<string, unknown>, key: string): string[] {
  const value = params[key];
  return Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === "string")
    : [];
}

function isCommandCard(view: BoardProjection, cardId: string): boolean {
  return findCardByInstanceId(view, cardId)?.definition?.type === "command";
}

function isCommandEntryPlanId(planId: string): boolean {
  return planId.includes(":command:entry:");
}

function planCleansUpCommand(plan: AnimationPlanV1): boolean {
  return plan.steps.some(
    (step) =>
      step.type === "moveEntity" &&
      step.from?.kind === "anchor" &&
      step.from.id === GUNDAM_COMMAND_FOCUS_ANCHOR_ID &&
      step.to.kind === "zone" &&
      baseZoneId(step.to.id) === "trash",
  );
}

function entityRef(id: string): AnimationEntityRef {
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
