import type { ReactNode } from "react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { AnimationPlanStepV1, AnimationPlanV1, AnimationZoneRef } from "@tcg/protocol";
import type { SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";
import type { LiveStateTransition } from "@tcg/simulator-runtime/live-transition";
import { LayoutGroup, MotionConfig, useReducedMotion } from "motion/react";

import {
  BeamMotionOverlay,
  CardMotionOverlay,
  LayoutShiftSentinel,
  PhaseMotionOverlay,
  ResourceMotionOverlay,
  type MotionEntityRenderer,
} from "./MotionOverlays";
import type {
  BeamOverlayState,
  CardOverlayState,
  LayoutShiftState,
  PhaseOverlayState,
  ResourceOverlayState,
} from "./motionTypes";
import { stepKeyOf } from "./motionTypes";
import { planStepToOverlay } from "./planStepToOverlay";
import {
  buildDestinationZoneSuppressionCss,
  buildSuppressionCss,
  emptyRectCache,
  readRectCache,
} from "./rectRegistry";
import type { RectCache } from "./rectRegistry";

const ANIMATION_PLAN_WATCHDOG_TIMEOUT_MS = 10_000;

export interface MotionAnimationSurfaceProps<TState = unknown> {
  readonly activeTransition?: LiveStateTransition<TState, AnimationPlanV1> | null;
  readonly animationPlans?: readonly AnimationPlanV1[] | null;
  readonly viewerSeatId?: string | null;
  readonly children: ReactNode;
  readonly resolveEntity?: (entityId: string) => SimulatorEntity | null | undefined;
  readonly resolveZone?: (zoneRef: AnimationZoneRef) => SimulatorZone | null | undefined;
  readonly renderEntity?: MotionEntityRenderer;
  readonly getCardSuppressionDelayMs?: (overlay: CardOverlayState) => number;
  readonly onAnimationStepsScheduled?: (steps: readonly ScheduledAnimationStep[]) => void;
  readonly onPlanComplete?: (planId: string) => void;
  readonly onTransitionComplete?: (transitionId: string) => void;
}

export interface ScheduledAnimationStep {
  readonly planId: string;
  readonly stepId: string;
  readonly step: AnimationPlanStepV1;
  readonly delayMs: number;
  readonly durationMs: number;
}

export function MotionAnimationSurface<TState = unknown>({
  activeTransition = null,
  animationPlans = null,
  viewerSeatId = null,
  children,
  resolveEntity,
  resolveZone,
  renderEntity,
  getCardSuppressionDelayMs,
  onAnimationStepsScheduled,
  onPlanComplete,
  onTransitionComplete,
}: MotionAnimationSurfaceProps<TState>) {
  const plans = useMemo(
    () => [...(activeTransition?.animationPlan ?? []), ...(animationPlans ?? [])],
    [activeTransition?.animationPlan, animationPlans],
  );
  const planById = useMemo(() => new Map(plans.map((plan) => [plan.id, plan])), [plans]);
  const [cardOverlays, setCardOverlays] = useState<CardOverlayState[]>([]);
  const [beamOverlays, setBeamOverlays] = useState<BeamOverlayState[]>([]);
  const [resourceOverlays, setResourceOverlays] = useState<ResourceOverlayState[]>([]);
  const [phaseOverlays, setPhaseOverlays] = useState<PhaseOverlayState[]>([]);
  const [layoutShifts, setLayoutShifts] = useState<LayoutShiftState[]>([]);
  const [completedStepIds, setCompletedStepIds] = useState<ReadonlySet<string>>(() => new Set());
  const [suppressedCardOverlayIds, setSuppressedCardOverlayIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const completedPlanIdsRef = useRef<Set<string>>(new Set());
  const completedStepIdsRef = useRef<ReadonlySet<string>>(new Set());
  const completedTransitionIdRef = useRef<string | null>(null);
  const seenStepIdsRef = useRef<Set<string>>(new Set());
  const rectCacheRef = useRef<RectCache>(emptyRectCache());
  const pendingInteractionRectCacheRef = useRef<RectCache | null>(null);
  const pendingInteractionRectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressionTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const planWatchdogsRef = useRef<
    Map<string, { plan: AnimationPlanV1; timer: ReturnType<typeof setTimeout> }>
  >(new Map());
  const onPlanCompleteRef = useRef(onPlanComplete);
  const onTransitionCompleteRef = useRef(onTransitionComplete);
  const onAnimationStepsScheduledRef = useRef(onAnimationStepsScheduled);
  const getCardSuppressionDelayMsRef = useRef(getCardSuppressionDelayMs);
  const prefersReducedMotion = useReducedMotion();
  const layoutGroupId = activeTransition?.id ?? plans.map((plan) => plan.id).join(":") ?? "motion";

  useEffect(() => {
    onPlanCompleteRef.current = onPlanComplete;
    onTransitionCompleteRef.current = onTransitionComplete;
    onAnimationStepsScheduledRef.current = onAnimationStepsScheduled;
    getCardSuppressionDelayMsRef.current = getCardSuppressionDelayMs;
  }, [getCardSuppressionDelayMs, onAnimationStepsScheduled, onPlanComplete, onTransitionComplete]);

  useEffect(
    () => () => {
      if (pendingInteractionRectTimerRef.current) {
        clearTimeout(pendingInteractionRectTimerRef.current);
        pendingInteractionRectTimerRef.current = null;
      }
      for (const timer of suppressionTimersRef.current.values()) {
        clearTimeout(timer);
      }
      suppressionTimersRef.current.clear();
      for (const watchdog of planWatchdogsRef.current.values()) {
        clearTimeout(watchdog.timer);
      }
      planWatchdogsRef.current.clear();
    },
    [],
  );

  const clearPendingInteractionRectCache = useCallback(() => {
    pendingInteractionRectCacheRef.current = null;
    if (pendingInteractionRectTimerRef.current) {
      clearTimeout(pendingInteractionRectTimerRef.current);
      pendingInteractionRectTimerRef.current = null;
    }
  }, []);

  const capturePendingInteractionRectCache = useCallback(() => {
    pendingInteractionRectCacheRef.current = readRectCache();
    if (pendingInteractionRectTimerRef.current) {
      clearTimeout(pendingInteractionRectTimerRef.current);
    }
    pendingInteractionRectTimerRef.current = setTimeout(() => {
      pendingInteractionRectCacheRef.current = null;
      pendingInteractionRectTimerRef.current = null;
    }, 2_000);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined" || typeof window === "undefined") {
      return;
    }
    const win = window as Window & {
      __simulatorAnimationCaptureRects?: () => void;
    };
    const previousCapture = win.__simulatorAnimationCaptureRects;
    win.__simulatorAnimationCaptureRects = capturePendingInteractionRectCache;
    document.addEventListener("pointerdown", capturePendingInteractionRectCache, true);
    document.addEventListener("keydown", capturePendingInteractionRectCache, true);
    return () => {
      document.removeEventListener("pointerdown", capturePendingInteractionRectCache, true);
      document.removeEventListener("keydown", capturePendingInteractionRectCache, true);
      if (win.__simulatorAnimationCaptureRects === capturePendingInteractionRectCache) {
        win.__simulatorAnimationCaptureRects = previousCapture;
      }
    };
  }, [capturePendingInteractionRectCache]);

  useEffect(() => {
    if (plans.length > 0) {
      return;
    }
    seenStepIdsRef.current.clear();
    completedPlanIdsRef.current.clear();
    setCompletedStepIds((current) => {
      if (current.size === 0) {
        return current;
      }
      const next = new Set<string>();
      completedStepIdsRef.current = next;
      return next;
    });
  }, [plans.length]);

  const markStepComplete = useCallback((stepKey: string) => {
    setCompletedStepIds((current) => {
      if (current.has(stepKey)) {
        return current;
      }
      const next = new Set(current);
      next.add(stepKey);
      completedStepIdsRef.current = next;
      return next;
    });
  }, []);

  const markPlanStepsComplete = useCallback((plan: AnimationPlanV1) => {
    setCompletedStepIds((current) => {
      const next = new Set(current);
      for (const step of plan.steps) {
        next.add(stepKeyOf(plan.id, step.id));
      }
      completedStepIdsRef.current = next;
      return next.size === current.size ? current : next;
    });
  }, []);

  const clearPlanVisuals = useCallback((plan: AnimationPlanV1) => {
    const stepKeys = new Set(plan.steps.map((step) => stepKeyOf(plan.id, step.id)));
    for (const stepKey of stepKeys) {
      const suppressionTimer = suppressionTimersRef.current.get(stepKey);
      if (suppressionTimer) {
        clearTimeout(suppressionTimer);
        suppressionTimersRef.current.delete(stepKey);
      }
    }
    setCardOverlays((current) => current.filter((overlay) => overlay.planId !== plan.id));
    setBeamOverlays((current) => current.filter((overlay) => overlay.planId !== plan.id));
    setResourceOverlays((current) => current.filter((overlay) => overlay.planId !== plan.id));
    setPhaseOverlays((current) => current.filter((overlay) => overlay.planId !== plan.id));
    setLayoutShifts((current) => current.filter((overlay) => overlay.planId !== plan.id));
    setSuppressedCardOverlayIds((current) => {
      const next = new Set([...current].filter((overlayId) => !stepKeys.has(overlayId)));
      return next.size === current.size ? current : next;
    });
  }, []);

  const suppressCardOverlay = useCallback((overlayId: string) => {
    setSuppressedCardOverlayIds((current) => {
      if (current.has(overlayId)) {
        return current;
      }
      const next = new Set(current);
      next.add(overlayId);
      return next;
    });
  }, []);

  const scheduleCardSuppression = useCallback(
    (overlays: readonly CardOverlayState[]) => {
      for (const overlay of overlays) {
        if (overlay.suppressEntity === false) {
          continue;
        }
        const delayMs = Math.max(0, getCardSuppressionDelayMsRef.current?.(overlay) ?? 0);
        if (delayMs <= 0) {
          suppressCardOverlay(overlay.id);
          continue;
        }
        const timer = setTimeout(() => {
          suppressionTimersRef.current.delete(overlay.id);
          suppressCardOverlay(overlay.id);
        }, delayMs);
        suppressionTimersRef.current.set(overlay.id, timer);
      }
    },
    [suppressCardOverlay],
  );

  useLayoutEffect(() => {
    const cache = pendingInteractionRectCacheRef.current ?? rectCacheRef.current;
    const newOverlays = collectNewOverlays({
      plans,
      seenStepIds: seenStepIdsRef.current,
      cache,
      viewerSeatId,
      resolveEntity,
      resolveZone,
      markStepComplete,
    });
    const overlayCount =
      newOverlays.card.length +
      newOverlays.beam.length +
      newOverlays.resource.length +
      newOverlays.phase.length +
      newOverlays.layoutShift.length;

    if (newOverlays.steps.length > 0) {
      onAnimationStepsScheduledRef.current?.(newOverlays.steps);
    }

    if (newOverlays.card.length > 0) {
      setCardOverlays((current) => [...current, ...newOverlays.card]);
      scheduleCardSuppression(newOverlays.card);
    }
    if (newOverlays.beam.length > 0) {
      setBeamOverlays((current) => [...current, ...newOverlays.beam]);
    }
    if (newOverlays.resource.length > 0) {
      setResourceOverlays((current) => [...current, ...newOverlays.resource]);
    }
    if (newOverlays.phase.length > 0) {
      setPhaseOverlays((current) => [...current, ...newOverlays.phase]);
    }
    if (newOverlays.layoutShift.length > 0) {
      setLayoutShifts((current) => [...current, ...newOverlays.layoutShift]);
    }

    if (overlayCount > 0) {
      clearPendingInteractionRectCache();
      rectCacheRef.current = readRectCache();
    } else if (!pendingInteractionRectCacheRef.current) {
      rectCacheRef.current = readRectCache();
    }
  }, [
    clearPendingInteractionRectCache,
    markStepComplete,
    plans,
    resolveEntity,
    resolveZone,
    scheduleCardSuppression,
    viewerSeatId,
  ]);

  useEffect(() => {
    const activePlanIds = new Set(planById.keys());
    for (const [planId, watchdog] of planWatchdogsRef.current) {
      if (activePlanIds.has(planId)) {
        continue;
      }
      clearTimeout(watchdog.timer);
      clearPlanVisuals(watchdog.plan);
      planWatchdogsRef.current.delete(planId);
    }

    for (const [planId, plan] of planById) {
      if (completedPlanIdsRef.current.has(planId) || planWatchdogsRef.current.has(planId)) {
        continue;
      }
      const timer = setTimeout(() => {
        planWatchdogsRef.current.delete(planId);
        const pendingStepIds = plan.steps
          .filter((step) => !completedStepIdsRef.current.has(stepKeyOf(planId, step.id)))
          .map((step) => step.id);
        if (pendingStepIds.length === 0) {
          return;
        }
        console.warn("[sim-animation] animation plan watchdog timed out", {
          planId,
          pendingStepIds,
          timeoutMs: ANIMATION_PLAN_WATCHDOG_TIMEOUT_MS,
        });
        clearPlanVisuals(plan);
        markPlanStepsComplete(plan);
      }, ANIMATION_PLAN_WATCHDOG_TIMEOUT_MS);
      planWatchdogsRef.current.set(planId, { plan, timer });
    }
  }, [clearPlanVisuals, markPlanStepsComplete, planById]);

  useEffect(() => {
    for (const [planId, plan] of planById) {
      if (completedPlanIdsRef.current.has(planId)) {
        continue;
      }
      if (plan.steps.every((step) => completedStepIds.has(stepKeyOf(planId, step.id)))) {
        completedPlanIdsRef.current.add(planId);
        const watchdog = planWatchdogsRef.current.get(planId);
        if (watchdog) {
          clearTimeout(watchdog.timer);
          planWatchdogsRef.current.delete(planId);
        }
        onPlanCompleteRef.current?.(planId);
      }
    }

    const active = activeTransition;
    if (!active || completedTransitionIdRef.current === active.id) {
      return;
    }
    if (active.animationPlan.every((plan) => completedPlanIdsRef.current.has(plan.id))) {
      completedTransitionIdRef.current = active.id;
      onTransitionCompleteRef.current?.(active.id);
    }
  }, [activeTransition, completedStepIds, planById]);

  const completeCard = (overlay: CardOverlayState) => {
    const suppressionTimer = suppressionTimersRef.current.get(overlay.id);
    if (suppressionTimer) {
      clearTimeout(suppressionTimer);
      suppressionTimersRef.current.delete(overlay.id);
    }
    setCardOverlays((current) => current.filter((item) => item.id !== overlay.id));
    setSuppressedCardOverlayIds((current) => {
      if (!current.has(overlay.id)) {
        return current;
      }
      const next = new Set(current);
      next.delete(overlay.id);
      return next;
    });
    markStepComplete(stepKeyOf(overlay.planId, overlay.stepId));
  };
  const completeBeam = (overlay: BeamOverlayState) => {
    setBeamOverlays((current) => current.filter((item) => item.id !== overlay.id));
    markStepComplete(stepKeyOf(overlay.planId, overlay.stepId));
  };
  const completeResource = (overlay: ResourceOverlayState) => {
    setResourceOverlays((current) => current.filter((item) => item.id !== overlay.id));
    markStepComplete(stepKeyOf(overlay.planId, overlay.stepId));
  };
  const completePhase = (overlay: PhaseOverlayState) => {
    setPhaseOverlays((current) => current.filter((item) => item.id !== overlay.id));
    markStepComplete(stepKeyOf(overlay.planId, overlay.stepId));
  };
  const completeLayoutShift = (overlay: LayoutShiftState) => {
    setLayoutShifts((current) => current.filter((item) => item.id !== overlay.id));
    markStepComplete(stepKeyOf(overlay.planId, overlay.stepId));
  };

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup id={layoutGroupId || "motion-animation-surface"}>
        <div className="motion-animation-stage contents">{children}</div>
        <style>
          {[
            buildDestinationZoneSuppressionCss(
              cardOverlays.filter((overlay) => !suppressedCardOverlayIds.has(overlay.id)),
            ),
            buildSuppressionCss(
              cardOverlays.filter((overlay) => suppressedCardOverlayIds.has(overlay.id)),
            ),
          ].join("\n")}
        </style>
        {cardOverlays.map((overlay) => (
          <CardMotionOverlay
            key={overlay.id}
            overlay={overlay}
            reduced={Boolean(prefersReducedMotion)}
            visible={overlay.suppressEntity === false || suppressedCardOverlayIds.has(overlay.id)}
            renderEntity={renderEntity}
            onComplete={completeCard}
          />
        ))}
        {beamOverlays.map((overlay) => (
          <BeamMotionOverlay
            key={overlay.id}
            overlay={overlay}
            reduced={Boolean(prefersReducedMotion)}
            onComplete={completeBeam}
          />
        ))}
        {resourceOverlays.map((overlay) => (
          <ResourceMotionOverlay
            key={overlay.id}
            overlay={overlay}
            reduced={Boolean(prefersReducedMotion)}
            onComplete={completeResource}
          />
        ))}
        {phaseOverlays.map((overlay) => (
          <PhaseMotionOverlay
            key={overlay.id}
            overlay={overlay}
            reduced={Boolean(prefersReducedMotion)}
            onComplete={completePhase}
          />
        ))}
        {layoutShifts.map((overlay) => (
          <LayoutShiftSentinel
            key={overlay.id}
            overlay={overlay}
            reduced={Boolean(prefersReducedMotion)}
            onComplete={completeLayoutShift}
          />
        ))}
      </LayoutGroup>
    </MotionConfig>
  );
}

interface OverlayBuckets {
  card: CardOverlayState[];
  beam: BeamOverlayState[];
  resource: ResourceOverlayState[];
  phase: PhaseOverlayState[];
  layoutShift: LayoutShiftState[];
  steps: ScheduledAnimationStep[];
}

function collectNewOverlays({
  plans,
  seenStepIds,
  cache,
  viewerSeatId,
  resolveEntity,
  resolveZone,
  markStepComplete,
}: {
  plans: readonly AnimationPlanV1[];
  seenStepIds: Set<string>;
  cache: RectCache;
  viewerSeatId: string | null;
  resolveEntity?: (entityId: string) => SimulatorEntity | null | undefined;
  resolveZone?: (zoneRef: AnimationZoneRef) => SimulatorZone | null | undefined;
  markStepComplete: (stepKey: string) => void;
}): OverlayBuckets {
  const overlays: OverlayBuckets = {
    card: [],
    beam: [],
    resource: [],
    phase: [],
    layoutShift: [],
    steps: [],
  };

  for (const plan of plans) {
    for (const step of plan.steps) {
      const stepKey = stepKeyOf(plan.id, step.id);
      if (seenStepIds.has(stepKey)) {
        continue;
      }
      seenStepIds.add(stepKey);
      overlays.steps.push({
        planId: plan.id,
        stepId: step.id,
        step,
        delayMs: step.delayMs ?? 0,
        durationMs: step.durationMs ?? 0,
      });

      const created = planStepToOverlay({
        plan,
        step,
        cache,
        viewerSeatId,
        resolveEntity,
        resolveZone,
      });
      if (!created) {
        markStepComplete(stepKey);
        continue;
      }

      switch (created.type) {
        case "card":
          overlays.card.push(created.overlay);
          break;
        case "beam":
          overlays.beam.push(created.overlay);
          break;
        case "resource":
          overlays.resource.push(created.overlay);
          break;
        case "phase":
          overlays.phase.push(created.overlay);
          break;
        case "layout-shift":
          overlays.layoutShift.push(created.overlay);
          break;
      }
    }
  }

  return overlays;
}
