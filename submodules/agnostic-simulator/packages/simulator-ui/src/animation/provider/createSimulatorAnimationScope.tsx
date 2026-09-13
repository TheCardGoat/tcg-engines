import type { AnimationPlanV2, AnimationZoneRef } from "@tcg/protocol/animations";
import type { SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";
import {
  compileAnimationPlan,
  createSimulatorAnimationStore,
  type AnimationPhase,
  type AnimationSpeed,
  type CompiledAudioCue,
  type CompiledAnimationPlan,
  type EnqueueSimulatorAnimationInput,
  type SimulatorAnimationSnapshot,
  type SimulatorAnimationStore,
} from "@tcg/simulator-runtime/animation";
import { LayoutGroup, MotionConfig, useReducedMotion } from "motion/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ComponentType,
  type ReactNode,
} from "react";

import { AnimationDriver } from "../driver/AnimationDriver";
import { SimulatorEntityVisualProvider } from "../components/SimulatorEntityVisual";
import { createAnimationNodeRegistry } from "../lib/node-registry";
import {
  AnimationRuntimeContext,
  AnimationStoreContext,
  type SimulatorEntityVisualProps,
  type SimulatorValueDeltaVisualProps,
} from "./contexts";

export interface SimulatorAnimationProjection<TState> {
  getEntity(state: TState, entityId: string, face: "public" | "hidden"): SimulatorEntity | null;
  getZone(state: TState, ref: AnimationZoneRef): SimulatorZone | null;
}

export interface SimulatorAnimationRootProps<TState> {
  readonly sessionKey: string;
  readonly initialState: TState;
  readonly initialVersion: number;
  readonly projection: SimulatorAnimationProjection<TState>;
  readonly entityRenderer: ComponentType<SimulatorEntityVisualProps>;
  readonly valueDeltaRenderer?: ComponentType<SimulatorValueDeltaVisualProps>;
  readonly viewerSeatId: string | null;
  readonly animationSpeed: AnimationSpeed;
  readonly onScheduleAudio?: (steps: readonly CompiledAudioCue[]) => void;
  readonly onCancelAudio?: () => void;
  readonly onTransitionSettled?: (event: SimulatorTransitionSettledEvent) => void;
  /** Only live streams may discard a playback backlog. Local/replay queues remain ordered. */
  readonly liveCatchUp?: boolean;
  readonly layoutDurationMs?: number;
  readonly transferFaceChange?: "flip" | "instant";
  /** Short non-spatial transfer crossfade used when reduced motion is requested. */
  readonly reducedMotionTransferDurationMs?: number;
  readonly children: ReactNode;
}

export type SimulatorTransitionOutcome = "completed" | "skipped";

export interface SimulatorTransitionSettledEvent {
  readonly transitionId: string;
  readonly correlationId: string;
  readonly outcome: SimulatorTransitionOutcome;
}

export interface SimulatorAnimationStatus {
  readonly isAnimating: boolean;
  readonly phase: AnimationPhase | null;
  readonly transitionId: string | null;
  readonly queuedCount: number;
}

export interface SimulatorCommandGate {
  readonly isBlocked: boolean;
  readonly reason: "animation-active" | null;
  canDispatch(): boolean;
  guard<TArgs extends readonly unknown[], TResult>(
    dispatch: (...args: TArgs) => TResult,
  ): (...args: TArgs) => TResult | false;
}

export interface SimulatorAnimationActions<TState> {
  readonly enqueue: (input: EnqueueSimulatorAnimationInput<TState>) => boolean;
  readonly refreshFromProjection: (input: { state: TState; version: number }) => boolean;
  readonly replaceFromSync: (input: { state: TState; version: number }) => void;
  readonly skipActive: (reason: string) => void;
  readonly reset: () => void;
  readonly whenIdle: (timeoutMs?: number) => Promise<"idle" | "timeout">;
}

export function createSimulatorAnimationScope<TState>() {
  const StateContext = createContext<SimulatorAnimationSnapshot<TState> | null>(null);
  const ActionsContext = createContext<SimulatorAnimationActions<TState> | null>(null);
  const StatusContext = createContext<SimulatorAnimationStatus | null>(null);

  function Root(props: SimulatorAnimationRootProps<TState>) {
    const {
      sessionKey,
      initialState,
      initialVersion,
      projection,
      entityRenderer,
      valueDeltaRenderer,
      viewerSeatId,
      animationSpeed,
      onScheduleAudio,
      onCancelAudio,
      onTransitionSettled,
      children,
      liveCatchUp = false,
      layoutDurationMs,
      transferFaceChange = "flip",
      reducedMotionTransferDurationMs = 0,
    } = props;
    const reducedMotion = useReducedMotion() ?? false;
    const harnessMotionSuppressed = testHarnessDisablesMotion();
    const motionSuppressed = shouldSuppressSimulatorMotion(reducedMotion, harnessMotionSuppressed);
    const reducedMotionCrossfade =
      reducedMotion && !harnessMotionSuppressed && reducedMotionTransferDurationMs > 0;
    const generatedScopeId = useId();
    const scopeId = `${sessionKey}:${generatedScopeId}`;
    const store = useMemo(() => {
      const next = createSimulatorAnimationStore<TState>();
      next.hydrate({ state: initialState, version: initialVersion });
      return next;
    }, [sessionKey]);
    const registry = useMemo(() => createAnimationNodeRegistry(), [sessionKey]);
    const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
    const active = snapshot.activeTransition;
    const activePlan = active?.plan;
    const activeId = active?.id;
    const activePhase = active?.phase;
    const compiledPlan = useMemo(() => {
      if (!activePlan) return null;
      const playbackPlan = reducedMotionCrossfade
        ? reducedMotionTransferPlan(activePlan, reducedMotionTransferDurationMs)
        : activePlan;
      return withViewerRelativeResultAudio(
        compileAnimationPlan(
          playbackPlan,
          animationSpeed,
          motionSuppressed && !reducedMotionCrossfade,
          reducedMotionCrossfade ? 0 : layoutDurationMs,
        ),
        viewerSeatId,
      );
    }, [
      activePlan,
      animationSpeed,
      layoutDurationMs,
      motionSuppressed,
      reducedMotionCrossfade,
      reducedMotionTransferDurationMs,
      viewerSeatId,
    ]);
    const settledCallback = useRef(onTransitionSettled);
    settledCallback.current = onTransitionSettled;
    const settledTransitionsRef = useMemo<{ id: string | null }>(
      () => ({ id: null }),
      [sessionKey],
    );
    const notifySettled = useCallback(
      (
        transition: { readonly id: string; readonly correlationId?: string },
        outcome: SimulatorTransitionOutcome,
      ) => {
        if (settledTransitionsRef.id === transition.id) return;
        settledTransitionsRef.id = transition.id;
        settledCallback.current?.({
          transitionId: transition.id,
          correlationId: transition.correlationId ?? transition.id,
          outcome,
        });
      },
      [settledTransitionsRef],
    );

    const callbacks = useRef({ onScheduleAudio, onCancelAudio });
    callbacks.current = { onScheduleAudio, onCancelAudio };
    const deadline = useRef(0);

    // Notify every discarded correlation before one terminal store mutation.
    const settle = useCallback(
      (
        outcome: SimulatorTransitionOutcome,
        action:
          | { type: "finish" }
          | { type: "latest" }
          | { type: "sync"; input: { state: TState; version: number } }
          | { type: "skip"; reason: string }
          | { type: "reset" } = { type: "finish" },
      ) => {
        const current = store.getSnapshot();
        callbacks.current.onCancelAudio?.();
        if (current.activeTransition) notifySettled(current.activeTransition, outcome);
        if (action.type === "latest" || action.type === "sync" || action.type === "reset") {
          for (const queued of current.queuedTransitions) notifySettled(queued, outcome);
        }
        switch (action.type) {
          case "latest":
            if (current.authoritativeState !== null && current.authoritativeVersion !== null) {
              store.replaceFromSync({
                state: current.authoritativeState,
                version: current.authoritativeVersion,
              });
            }
            break;
          case "sync":
            store.replaceFromSync(action.input);
            break;
          case "skip":
            store.skipActive(action.reason);
            break;
          case "reset":
            store.reset();
            break;
          case "finish":
            if (current.activeTransition) store.finishActive(current.activeTransition.id);
            break;
          default: {
            const exhaustive: never = action;
            return exhaustive;
          }
        }
      },
      [notifySettled, store],
    );

    const playbackStartedAtMs = useMemo(
      () => (active?.phase === "running" ? performance.now() : undefined),
      [active?.id, active?.phase],
    );

    useEffect(() => {
      if (!activeId || !activePhase || !compiledPlan) return;
      if ((motionSuppressed && !reducedMotionCrossfade) || animationSpeed === "off") {
        settle("completed", { type: "latest" });
        return;
      }
      if (activePhase === "preparing") {
        const frame = requestAnimationFrame(() => store.startActive(activeId));
        return () => cancelAnimationFrame(frame);
      }
      const duration =
        activePhase === "running"
          ? compiledPlan.interactionBlockingDurationMs
          : compiledPlan.reflowDurationMs;
      deadline.current =
        (activePhase === "running"
          ? (playbackStartedAtMs ?? performance.now())
          : performance.now()) + duration;
      if (activePhase === "running") callbacks.current.onScheduleAudio?.(compiledPlan.audioCues);
      // The compiled timeline owns completion. Missing nodes and visual callbacks
      // cannot extend gameplay locks or prevent the next transition from starting.
      const timer = setTimeout(
        () => {
          if (store.getSnapshot().activeTransition?.id !== activeId) return;
          if (activePhase === "running") store.beginReflow(activeId);
          else settle("completed");
        },
        Math.max(0, deadline.current - performance.now()),
      );
      return () => clearTimeout(timer);
    }, [
      activeId,
      activePhase,
      compiledPlan,
      motionSuppressed,
      reducedMotionCrossfade,
      animationSpeed,
      playbackStartedAtMs,
      settle,
      store,
    ]);

    useEffect(() => {
      if (!liveCatchUp || !active || snapshot.queuedTransitions.length === 0) return;
      const remaining =
        active.phase === "preparing"
          ? (compiledPlan?.interactionBlockingDurationMs ?? 0) +
            (compiledPlan?.reflowDurationMs ?? 0)
          : Math.max(0, deadline.current - performance.now()) +
            (active.phase === "running" ? (compiledPlan?.reflowDurationMs ?? 0) : 0);
      const queued = snapshot.queuedTransitions.reduce((total, transition) => {
        if (!transition.plan) return total;
        const plan = compileAnimationPlan(
          transition.plan,
          animationSpeed,
          motionSuppressed,
          layoutDurationMs,
        );
        return total + plan.interactionBlockingDurationMs + plan.reflowDurationMs;
      }, 0);
      if (remaining + queued > 6_000) {
        console.info("[simulator-animation]", {
          reason: "live-backlog",
          transitionId: active.id,
          queueDurationMs: remaining + queued,
        });
        settle("skipped", { type: "latest" });
      }
    }, [
      liveCatchUp,
      active,
      snapshot.queuedTransitions,
      compiledPlan,
      animationSpeed,
      motionSuppressed,
      layoutDurationMs,
      settle,
    ]);

    useEffect(() => {
      const capturedWidth = window.innerWidth;
      const capturedHeight = window.innerHeight;
      let resizeTimer: ReturnType<typeof setTimeout> | undefined;
      const onResize = () => {
        clearTimeout(resizeTimer);
        if (!store.getSnapshot().activeTransition) return;
        // Mobile chrome can emit duplicate or transient resize events while
        // scrolling. Only settle when the layout viewport remains changed.
        resizeTimer = setTimeout(() => {
          if (window.innerWidth === capturedWidth && window.innerHeight === capturedHeight) return;
          if (store.getSnapshot().activeTransition) settle("skipped", { type: "latest" });
        }, 150);
      };
      const onVisibility = () => {
        if (liveCatchUp && document.visibilityState === "visible")
          settle("skipped", { type: "latest" });
      };
      window.addEventListener("resize", onResize);
      document.addEventListener("visibilitychange", onVisibility);
      return () => {
        clearTimeout(resizeTimer);
        window.removeEventListener("resize", onResize);
        document.removeEventListener("visibilitychange", onVisibility);
      };
    }, [activeId, liveCatchUp, settle, store]);

    const previousSpeed = useRef(animationSpeed);
    useEffect(() => {
      if (previousSpeed.current !== animationSpeed) settle("skipped", { type: "latest" });
      previousSpeed.current = animationSpeed;
    }, [animationSpeed, settle]);

    useEffect(
      () => () => {
        settle("skipped", { type: "latest" });
        registry.clear();
      },
      [settle, registry],
    );

    const actions = useMemo<SimulatorAnimationActions<TState>>(
      () => ({
        enqueue: (input) => store.enqueue(input),
        refreshFromProjection: (input) => store.refreshFromProjection(input),
        replaceFromSync: (input) => settle("skipped", { type: "sync", input }),
        skipActive: (reason) => settle("skipped", { type: "skip", reason }),
        reset: () => settle("skipped", { type: "reset" }),
        whenIdle: (timeoutMs) => store.whenIdle(timeoutMs),
      }),
      [settle, store],
    );
    const status = useMemo<SimulatorAnimationStatus>(
      () => ({
        isAnimating: active !== null,
        phase: active?.phase ?? null,
        transitionId: active?.id ?? null,
        queuedCount: snapshot.queuedTransitions.length,
      }),
      [active, snapshot.queuedTransitions.length],
    );
    const runtime = useMemo(
      () => ({
        scopeId,
        speed: animationSpeed,
        spatialMotionSuppressed: reducedMotionCrossfade,
        transferFaceChange,
        playbackStartedAtMs,
        viewerSeatId,
        compiledPlan,
        activeTransition: active,
        registry,
        entityRenderer,
        valueDeltaRenderer,
        getEntity: (state: unknown, entityId: string, face: "public" | "hidden") =>
          projection.getEntity(state as TState, entityId, face),
        getZone: (state: unknown, ref: AnimationZoneRef) =>
          projection.getZone(state as TState, ref),
      }),
      [
        active,
        animationSpeed,
        reducedMotionCrossfade,
        transferFaceChange,
        playbackStartedAtMs,
        compiledPlan,
        entityRenderer,
        valueDeltaRenderer,
        projection,
        registry,
        scopeId,
        viewerSeatId,
      ],
    );

    return (
      <StateContext.Provider value={snapshot}>
        <ActionsContext.Provider value={actions}>
          <StatusContext.Provider value={status}>
            <AnimationStoreContext.Provider
              value={{ store: store as SimulatorAnimationStore<unknown> }}
            >
              <AnimationRuntimeContext.Provider value={runtime}>
                <SimulatorEntityVisualProvider renderer={entityRenderer}>
                  <MotionConfig reducedMotion="user">
                    <LayoutGroup id={scopeId}>
                      {children}
                      <AnimationDriver />
                    </LayoutGroup>
                  </MotionConfig>
                </SimulatorEntityVisualProvider>
              </AnimationRuntimeContext.Provider>
            </AnimationStoreContext.Provider>
          </StatusContext.Provider>
        </ActionsContext.Provider>
      </StateContext.Provider>
    );
  }

  function useState(): SimulatorAnimationSnapshot<TState> {
    return requireContext(StateContext, "useState");
  }

  function useActions(): SimulatorAnimationActions<TState> {
    return requireContext(ActionsContext, "useActions");
  }

  function useStatus(): SimulatorAnimationStatus {
    return requireContext(StatusContext, "useStatus");
  }

  function useCommandGate(): SimulatorCommandGate {
    const { isAnimating } = useStatus();
    const guard = useCallback(
      <TArgs extends readonly unknown[], TResult>(dispatch: (...args: TArgs) => TResult) =>
        (...args: TArgs): TResult | false =>
          isAnimating ? false : dispatch(...args),
      [isAnimating],
    );
    return useMemo(
      () => ({
        isBlocked: isAnimating,
        reason: isAnimating ? ("animation-active" as const) : null,
        canDispatch: () => !isAnimating,
        guard,
      }),
      [guard, isAnimating],
    );
  }

  return { Root, useState, useActions, useStatus, useCommandGate };
}

/** A broadcast plan cannot know whether the current browser won or lost. */
export function withViewerRelativeResultAudio(
  plan: CompiledAnimationPlan,
  viewerSeatId: string | null,
): CompiledAnimationPlan {
  const nonResultCues = plan.audioCues.filter(
    (cue) => cue.cue !== "game.win" && cue.cue !== "game.loss",
  );
  if (!viewerSeatId) return { ...plan, audioCues: nonResultCues };

  const resultCues = plan.steps.flatMap(({ step, startAtMs }) => {
    if (step.type !== "gameResult" || step.outcome !== "winner" || !step.winner) return [];
    return [
      {
        planId: plan.id,
        stepId: step.id,
        cue: step.winner.id === viewerSeatId ? ("game.win" as const) : ("game.loss" as const),
        startAtMs,
      },
    ];
  });
  return { ...plan, audioCues: [...nonResultCues, ...resultCues] };
}

function requireContext<T>(context: React.Context<T | null>, hookName: string): T {
  const value = useContext(context);
  if (!value) throw new Error(`${hookName} must be used inside its simulator animation scope.`);
  return value;
}

export function shouldSuppressSimulatorMotion(
  reducedMotion: boolean,
  testHarnessDisabled = testHarnessDisablesMotion(),
): boolean {
  return reducedMotion || testHarnessDisabled;
}

export function reducedMotionTransferPlan(
  plan: AnimationPlanV2,
  durationMs: number,
): AnimationPlanV2 {
  return {
    ...plan,
    steps: plan.steps.flatMap((step) =>
      step.type === "entityTransfer" ? [{ ...step, startAtMs: 0, durationMs }] : [],
    ),
  };
}

function testHarnessDisablesMotion(): boolean {
  return Boolean(
    (globalThis as typeof globalThis & { __TCG_TEST_DISABLE_SIMULATOR_MOTION__?: boolean })
      .__TCG_TEST_DISABLE_SIMULATOR_MOTION__,
  );
}
