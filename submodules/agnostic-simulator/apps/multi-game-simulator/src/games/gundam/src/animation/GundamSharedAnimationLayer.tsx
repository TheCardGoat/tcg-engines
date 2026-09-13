import { GUNDAM_FULL_CARD_ASPECT_RATIO } from "../components/ui/card/card-image-format.ts";
import {
  GUNDAM_ANIMATION_DURATION_MS,
  gundamPacketAnimationToAnimationPlans,
  prepareGundamSharedAnimationSteps,
  gundamLifecycleAnimationSteps,
} from "@tcg/gundam-server-adapter";
import { useEffect, useLayoutEffect, useMemo, useRef, type ReactNode } from "react";
import type { AnimationRef, AnimationPlanV2, AnimationZoneRef } from "@tcg/protocol";
import type { Card } from "@tcg/gundam-types";
import type { MatchRuntime } from "@tcg/gundam-engine";
import type { SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";
import { simulatorExternalCommandGateFor } from "@tcg/simulator-runtime/animation";
import {
  AnimationInteractionBoundary,
  createSimulatorAnimationScope,
  isSimulatorAnimationDebugEnabled,
  simulatorAnimationDebug,
} from "@tcg/simulator-ui";
import { useSimulatorAudio } from "../../../../simulator/audio";
import { useSimulatorSettings } from "../../../../simulator/settings";
import { useLayoutMode } from "../lib/use-layout-mode.ts";
import {
  useAcceptedAnimations,
  useBoardProjection,
  useGundamGame,
  useInteractionView,
} from "../game/index.ts";
import type { TurnTaggedPacketAnimation } from "../game/adapter.ts";
import type { BoardProjection } from "../game/index.ts";
import {
  cardImageUrlOf,
  findCardByInstanceId,
  toGameCardData,
} from "../components/containers/mappers.ts";
import { useGundamDragCommands } from "../components/ui/playerSeat/gundam-drag-drop-context.tsx";
import { GundamPresentationProvider } from "../game/presentation-context.tsx";
import {
  burstDecisionFocusLabel,
  CommandFocusArea,
  effectDecisionFocusLabel,
  GUNDAM_COMMAND_FOCUS_ANCHOR_ID,
} from "./CommandFocusArea.tsx";
import { GundamSimulatorEntityVisual } from "./gundamAnimationVisual.tsx";

export function GundamSharedAnimationLayer({
  children,
  runtime,
  live = false,
}: {
  readonly children: ReactNode;
  readonly runtime: MatchRuntime;
  readonly live?: boolean;
}) {
  const view = useBoardProjection();
  const { adapter } = useGundamGame();
  const viewerSeatId = adapter.viewerContext.playerId
    ? String(adapter.viewerContext.playerId)
    : null;
  const { cancelScheduledCues, scheduleAnimationSteps } = useSimulatorAudio();
  const {
    settings: { animationSpeed },
  } = useSimulatorSettings();
  const projection = useMemo(
    () => ({
      getEntity: (state: BoardProjection, cardId: string) => simulatorEntityForCard(cardId, state),
      getZone: (_state: BoardProjection, ref: AnimationZoneRef) => gundamAnimationZoneResolver(ref),
    }),
    [],
  );

  return (
    <GundamAnimation.Root
      sessionKey={`gundam:${viewerSeatId ?? "spectator"}`}
      initialState={view}
      initialVersion={view.stateID}
      projection={projection}
      entityRenderer={GundamSimulatorEntityVisual}
      viewerSeatId={viewerSeatId}
      animationSpeed={animationSpeed}
      liveCatchUp={live}
      layoutDurationMs={GUNDAM_ANIMATION_DURATION_MS.layout}
      onScheduleAudio={scheduleAnimationSteps}
      onCancelAudio={cancelScheduledCues}
    >
      <GundamAnimationBridge runtime={runtime} viewerSeatId={viewerSeatId}>
        {children}
      </GundamAnimationBridge>
    </GundamAnimation.Root>
  );
}

const GundamAnimation = createSimulatorAnimationScope<BoardProjection>();

function GundamAnimationBridge({
  children,
  runtime,
  viewerSeatId,
}: {
  readonly children: ReactNode;
  readonly runtime: MatchRuntime;
  readonly viewerSeatId: string | null;
}) {
  const view = useBoardProjection();
  const interactionView = useInteractionView();
  const { adapter } = useGundamGame();
  const { records: acceptedAnimations, didHistoryReset } = useAcceptedAnimations();
  const { enqueue, replaceFromSync } = GundamAnimation.useActions();
  const snapshot = GundamAnimation.useState();
  const status = GundamAnimation.useStatus();
  const layoutMode = useLayoutMode();
  const { consumeDragHandledTransfer } = useGundamDragCommands();
  const animationGate = useMemo(() => simulatorExternalCommandGateFor(runtime), [runtime]);
  const wasAnimating = useRef(status.isAnimating);
  const focusedMobileCombatRef = useRef(false);
  const combatFocus = animationCombatFocusRef(snapshot.activeTransition?.plan ?? null);
  const combatFocusKey = combatFocus
    ? `${combatFocus.kind}:${"ownerId" in combatFocus ? (combatFocus.ownerId ?? "") : ""}:${combatFocus.id}`
    : "";

  useLayoutEffect(() => {
    if (layoutMode !== "mobile") {
      focusedMobileCombatRef.current = false;
      return;
    }

    if (status.isAnimating && combatFocus) {
      const board = document.querySelector<HTMLElement>(".gundam-simulator-root [data-sim-board]");
      const selector = animationFocusSelector(combatFocus);
      if (!board || !selector) return;

      let focusFrame = 0;
      const revealTarget = () => {
        const target =
          board.querySelector<HTMLElement>(selector) ??
          document.querySelector<HTMLElement>(selector);
        if (!target) {
          debugGundamAnimation("gundam.mobile-combat-focus", {
            combatFocus,
            result: "target-missing",
          });
          return;
        }

        focusedMobileCombatRef.current = true;
        const boardRect = board.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const visibleTop = boardRect.top + 12;
        const visibleBottom = boardRect.bottom - 12;
        if (targetRect.top < visibleTop) {
          board.scrollTop += targetRect.top - visibleTop;
        } else if (targetRect.bottom > visibleBottom) {
          board.scrollTop += targetRect.bottom - visibleBottom;
        }
        debugGundamAnimation("gundam.mobile-combat-focus", {
          combatFocus,
          result: "focused",
          scrollTop: board.scrollTop,
          targetTop: targetRect.top,
          targetBottom: targetRect.bottom,
        });
      };
      const scheduleFocus = () => {
        window.cancelAnimationFrame(focusFrame);
        focusFrame = window.requestAnimationFrame(revealTarget);
      };
      // Persistent combat teardown may restore the player edge after playback
      // starts. Keep the animation target focused for this brief transition.
      const startFrame = window.requestAnimationFrame(scheduleFocus);
      board.addEventListener("scroll", scheduleFocus, { passive: true });
      return () => {
        board.removeEventListener("scroll", scheduleFocus);
        window.cancelAnimationFrame(startFrame);
        window.cancelAnimationFrame(focusFrame);
      };
    }

    if (status.isAnimating || !focusedMobileCombatRef.current) return;
    focusedMobileCombatRef.current = false;
    const frame = window.requestAnimationFrame(() => {
      const board = document.querySelector<HTMLElement>(".gundam-simulator-root [data-sim-board]");
      if (board) board.scrollTop = board.scrollHeight - board.clientHeight;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [combatFocusKey, layoutMode, status.isAnimating]);

  useEffect(() => {
    debugGundamAnimation("gundam.bridge.lifecycle", {
      authoritativeVersion: snapshot.authoritativeVersion,
      settledVersion: snapshot.settledVersion,
      presentationVersion: snapshot.presentationVersion,
      activeTransition: snapshot.activeTransition
        ? {
            id: snapshot.activeTransition.id,
            planId: snapshot.activeTransition.plan.id,
            phase: snapshot.activeTransition.phase,
            fromVersion: snapshot.activeTransition.fromVersion,
            toVersion: snapshot.activeTransition.toVersion,
            combatFocus,
          }
        : null,
      queuedTransitions: snapshot.queuedTransitions.map((transition) => ({
        id: transition.id,
        planId: transition.plan?.id ?? null,
        fromVersion: transition.fromVersion,
        toVersion: transition.toVersion,
      })),
    });
  }, [
    snapshot.activeTransition,
    combatFocusKey,
    snapshot.authoritativeVersion,
    snapshot.presentationVersion,
    snapshot.queuedTransitions,
    snapshot.settledVersion,
  ]);

  useEffect(() => {
    debugGundamAnimation("gundam.bridge.effect", {
      viewVersion: view.stateID,
      authoritativeVersion: snapshot.authoritativeVersion,
      acceptedAnimations: acceptedAnimations.map((entry) => ({
        stateID: entry.stateID,
        id: entry.plan?.id ?? entry.animation?.id ?? null,
        kind: entry.plan ? "plan" : (entry.animation?.data.kind ?? null),
      })),
      didHistoryReset,
    });
    if (didHistoryReset) {
      animationGate.setBlocked(false);
      replaceFromSync({ state: view, version: view.stateID });
      return;
    }
    const dragHandled = new Set<string>();
    const partialPlans = acceptedAnimations.flatMap((entry) => {
      if (
        isHandToBattleAreaTransfer(entry) &&
        consumeDragHandledTransfer(entry.animation.data.cardId)
      ) {
        dragHandled.add(entry.animation.data.cardId);
        return [];
      }
      return gundamPacketAnimationToAnimationPlans(entry, view, viewerSeatId);
    });
    const packetSteps = partialPlans.flatMap((partial) => partial.steps);
    const lifecycleSteps =
      snapshot.authoritativeState && view.stateID > (snapshot.authoritativeVersion ?? -1)
        ? gundamLifecycleAnimationSteps(
            snapshot.authoritativeState,
            view,
            packetSteps,
            viewerSeatId,
          ).filter((step) => step.type !== "entityTransfer" || !dragHandled.has(step.entity.id))
        : [];
    const steps = [...packetSteps, ...lifecycleSteps];
    const plan: AnimationPlanV2 | null =
      steps.length === 0
        ? null
        : {
            id: `gundam:${view.stateID}`,
            version: 2,
            steps: prepareGundamSharedAnimationSteps(steps),
          };
    const accepted = enqueue({
      state: view,
      version: view.stateID,
      plan,
      correlationId:
        acceptedAnimations.at(-1)?.plan?.id ?? acceptedAnimations.at(-1)?.animation?.id,
      source: "local",
    });
    debugGundamAnimation("gundam.bridge.enqueue", {
      accepted,
      viewVersion: view.stateID,
      planId: plan?.id ?? null,
      stepIds: plan?.steps.map((step) => step.id) ?? [],
    });
  }, [
    animationGate,
    acceptedAnimations,
    consumeDragHandledTransfer,
    didHistoryReset,
    enqueue,
    replaceFromSync,
    snapshot.authoritativeVersion,
    snapshot.authoritativeState,
    view,
    viewerSeatId,
  ]);

  useEffect(() => {
    animationGate.setBlocked(status.isAnimating);
    return () => animationGate.setBlocked(false);
  }, [animationGate, status.isAnimating]);

  useEffect(() => {
    const justSettled = wasAnimating.current && !status.isAnimating;
    wasAnimating.current = status.isAnimating;
    if (!justSettled || status.queuedCount > 0) return;
    if (snapshot.presentationVersion === view.stateID && snapshot.presentationState === view) {
      return;
    }
    replaceFromSync({ state: view, version: view.stateID });
  }, [
    replaceFromSync,
    snapshot.presentationState,
    snapshot.presentationVersion,
    status.isAnimating,
    status.queuedCount,
    view,
  ]);

  const focusedCommandId = commandCardIdFromPlan(snapshot.activeTransition?.plan ?? null);
  const pendingBurst = adapter.pendingBurst();
  const resolution = interactionView.resolution;
  const partitionWorkspaceActive = interactionView.actions.some((action) =>
    action.inputs.some((input) => input.kind === "entity-partition"),
  );
  const resolvingEffectCardId =
    resolution?.currentEffect.source?.kind === "card"
      ? resolution.currentEffect.source.instanceId
      : null;
  const focusedCardId =
    focusedCommandId ?? pendingBurst?.sourceCardId ?? resolvingEffectCardId ?? null;
  const focusedCardView = snapshot.activeTransition?.toState ?? view;
  const focusedCard = focusedCardId ? findCardByInstanceId(focusedCardView, focusedCardId) : null;
  const focusedCommandEntity = focusedCardId
    ? simulatorEntityForCard(focusedCardId, focusedCardView)
    : null;
  const focusedPreviewCard = focusedCard ? toGameCardData(focusedCardView, focusedCard) : null;
  const burstDecisionLabel = pendingBurst
    ? burstDecisionFocusLabel(pendingBurst.controllerId, viewerSeatId)
    : undefined;
  const effectDecisionLabel = resolution
    ? effectDecisionFocusLabel(resolution.actingPlayerId, viewerSeatId)
    : undefined;

  return (
    <>
      <AnimationInteractionBoundary active={status.isAnimating}>
        <GundamPresentationProvider value={snapshot.presentationState ?? view}>
          {children}
        </GundamPresentationProvider>
      </AnimationInteractionBoundary>
      <CommandFocusArea
        entity={focusedCommandEntity}
        previewCard={focusedPreviewCard}
        active={focusedCardId !== null && !partitionWorkspaceActive}
        label={
          focusedCommandId
            ? "Command resolving"
            : (burstDecisionLabel ?? effectDecisionLabel ?? "Command resolving")
        }
      />
    </>
  );
}

export function animationCombatFocusRef(plan: AnimationPlanV2 | null): AnimationRef | null {
  return plan?.steps.find((step) => step.type === "combat")?.target ?? null;
}

function animationFocusSelector(ref: AnimationRef): string | null {
  const id =
    typeof CSS !== "undefined" && typeof CSS.escape === "function"
      ? CSS.escape(ref.id)
      : ref.id.replace(/["\\\n\r\f]/g, (character) => `\\${character}`);
  switch (ref.kind) {
    case "entity":
      return `[data-sim-entity-id="${id}"]`;
    case "player":
      return `[data-sim-player-target-id="${id}"]`;
    case "zone":
      return `[data-sim-zone-id="${id}"]`;
    case "anchor":
      return null;
  }
}

export function isHandToBattleAreaTransfer(
  entry: TurnTaggedPacketAnimation,
): entry is TurnTaggedPacketAnimation & {
  readonly animation: NonNullable<TurnTaggedPacketAnimation["animation"]> & {
    readonly data: {
      readonly kind: "cardMove";
      readonly cardId: string;
      readonly fromZone: string;
      readonly toZone: string;
    };
  };
} {
  const data = entry.animation?.data;
  return (
    data?.kind === "cardMove" &&
    data.fromZone?.split(":")[0] === "hand" &&
    data.toZone?.split(":")[0] === "battleArea"
  );
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
    imageAspectRatio: GUNDAM_FULL_CARD_ASPECT_RATIO,
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
    imageAspectRatio: GUNDAM_FULL_CARD_ASPECT_RATIO,
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

function ownerIdFromCardId(cardId: string): string | null {
  const match = /^(.*)_(deck|resourceDeck|resource|shield)_/.exec(cardId);
  return match?.[1] ?? null;
}

function commandCardIdFromPlan(plan: AnimationPlanV2 | null): string | null {
  if (!plan) return null;
  const transfer = plan.steps.find(
    (step) =>
      step.type === "entityTransfer" &&
      (step.from?.kind === "anchor" || step.to?.kind === "anchor") &&
      (step.from?.id === GUNDAM_COMMAND_FOCUS_ANCHOR_ID ||
        step.to?.id === GUNDAM_COMMAND_FOCUS_ANCHOR_ID),
  );
  return transfer?.type === "entityTransfer" ? transfer.entity.id : null;
}

function debugGundamAnimation(label: string, payload: unknown): void {
  if (isSimulatorAnimationDebugEnabled()) simulatorAnimationDebug(label, JSON.stringify(payload));
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

function gundamZoneDescriptor(zoneId: string, ownerId: string): SimulatorZone {
  const id = `${zoneId}:${ownerId}`;
  switch (zoneId) {
    case "deck":
      return zoneDescriptor(id, "Deck Area", "deck", ownerId, "secret");
    case "resourceDeck":
      return zoneDescriptor(id, "Resource Deck Area", "deck", ownerId, "secret");
    case "hand":
      return zoneDescriptor(id, "Hand", "hand", ownerId, "private");
    case "battleArea":
      return zoneDescriptor(id, "Battle Area", "battlefield", ownerId, "public");
    case "baseSection":
      return zoneDescriptor(id, "Base", "leader", ownerId, "public");
    case "shieldArea":
      return zoneDescriptor(id, "Shields", "life", ownerId, "secret");
    case "resourceArea":
      return zoneDescriptor(id, "Resource Area", "resource", ownerId, "public");
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
