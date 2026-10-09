import { cinematicSceneRefs, type AnimationRef } from "@tcg/protocol/animations";
import type { AnimationPhase } from "@tcg/simulator-runtime/animation";
import { motion } from "motion/react";
import {
  createContext,
  useContext,
  type ComponentType,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { TargetingArrow } from "../../components/TargetingArrow";
import { SimulatorEntityVisual } from "../components/SimulatorEntityVisual";
import { useAnimationRegistryVersion } from "../hooks/useAnimationRegistryVersion";
import { animationRefKey } from "../lib/node-registry";
import { useAnimationRuntime } from "../provider/contexts";
import {
  centerForBoardOverlay,
  centerForRef,
  overlayPortalRoot,
  simulatorBoardCenterAnimationRef,
  captureOverlayScroll,
  overlayScrollDisplacement,
} from "./overlay-utils";
import classes from "./EffectOverlay.module.css";
import { SceneEffect } from "./SceneEffect";
import { CinematicEffect } from "./CinematicEffect";

export interface EffectArrowProps {
  readonly sourceId?: string;
  readonly id: string;
  readonly source: { readonly x: number; readonly y: number };
  readonly destination: { readonly x: number; readonly y: number };
  readonly startAtMs: number;
  readonly durationMs: number;
}

/** Optional game renderer; source-card staging and timing remain owned by this overlay. */
export const EffectConnectionsContext = createContext<ComponentType<{
  connections: readonly EffectArrowProps[];
  playbackStartedAtMs?: number;
}> | null>(null);

export interface SourceCardEffectTiming {
  readonly impactAtMs: number;
  readonly arrowStartMs: number;
  readonly arrowDurationMs: number;
}

export function sourceCardEffectTiming(durationMs: number): SourceCardEffectTiming {
  const duration = Math.max(0, durationMs);
  const impactAtMs = Math.round(duration * 0.5);
  const arrowStartMs = Math.round(duration * 0.25);
  const arrowEndMs = Math.min(duration, impactAtMs + Math.round(duration * 0.14));
  return {
    impactAtMs,
    arrowStartMs,
    arrowDurationMs: Math.max(0, arrowEndMs - arrowStartMs),
  };
}

export function EffectArrow({ id, source, destination, startAtMs, durationMs }: EffectArrowProps) {
  return (
    <motion.g
      data-animation-effect-arrow="true"
      data-effect-arrow-id={id}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{
        delay: startAtMs / 1_000,
        duration: durationMs / 1_000,
        times: [0, 0.16, 0.82, 1],
      }}
    >
      <TargetingArrow
        x1={source.x}
        y1={source.y}
        x2={destination.x}
        y2={destination.y}
        curved={false}
        color="var(--game-accent, #5eead4)"
        variant="effect"
      />
    </motion.g>
  );
}

export function shouldRenderEffectOverlay(phase: AnimationPhase | null | undefined): boolean {
  return phase === "running" || phase === "reflowing";
}

export function EffectOverlay() {
  const runtime = useAnimationRuntime();
  const Connections = useContext(EffectConnectionsContext);
  const registryVersion = useAnimationRegistryVersion(runtime.registry);
  const entryGeometry = useRef<{
    transitionId: string;
    rects: Map<string, DOMRect>;
    scroll: ReturnType<typeof captureOverlayScroll>;
  }>({
    transitionId: "",
    rects: new Map<string, DOMRect>(),
    scroll: { x: 0, y: 0, parents: [] },
  });
  const activeTransition = runtime.activeTransition;

  const [, updateScroll] = useState(0);
  useLayoutEffect(() => {
    if (!activeTransition) return;
    const update = () => updateScroll((value) => value + 1);
    window.addEventListener("scroll", update, true);
    return () => window.removeEventListener("scroll", update, true);
  }, [activeTransition?.id]);

  useLayoutEffect(() => {
    if (entryGeometry.current.transitionId !== (activeTransition?.id ?? "")) {
      const sceneBoard = runtime.compiledPlan?.steps.flatMap((entry) =>
        entry.step.type === "effect" && entry.step.scene ? [entry.step.scene.board] : [],
      )[0];
      entryGeometry.current = {
        transitionId: activeTransition?.id ?? "",
        rects: new Map(),
        scroll: captureOverlayScroll(runtime.registry, sceneBoard),
      };
    }
    if (activeTransition?.phase !== "preparing" || !runtime.compiledPlan) return;
    for (const compiled of runtime.compiledPlan.steps) {
      if (compiled.step.type !== "effect") continue;
      // Preparing still renders fromState. Once running starts, a target may
      // already be registered in its destination zone (or have no old node).
      const refs = [
        simulatorBoardCenterAnimationRef,
        ...(compiled.step.source ? [compiled.step.source] : []),
        ...compiled.step.targets,
        ...(compiled.step.scene ? cinematicSceneRefs(compiled.step.scene) : []),
      ];
      for (const ref of refs) {
        const dragOrigin =
          compiled.step.presentation === "source-card" &&
          ref === compiled.step.source &&
          ref.kind === "entity"
            ? runtime.registry.takeDragOrigin(ref.id)
            : null;
        const rect =
          dragOrigin ??
          entryGeometry.current.rects.get(animationRefKey(ref)) ??
          runtime.registry.getPreferred(ref)?.node.getBoundingClientRect();
        if (rect && rect.width > 0 && rect.height > 0) {
          entryGeometry.current.rects.set(animationRefKey(ref), rect);
        }
      }
    }
  }, [activeTransition, registryVersion, runtime.compiledPlan, runtime.registry]);

  const capturedRect = (ref: AnimationRef): DOMRect | null => {
    const captured = entryGeometry.current.rects.get(animationRefKey(ref));
    if (!captured) return runtime.registry.getPreferred(ref)?.node.getBoundingClientRect() ?? null;
    const { x: dx, y: dy } = overlayScrollDisplacement(entryGeometry.current.scroll);
    return new DOMRect(captured.left + dx, captured.top + dy, captured.width, captured.height);
  };
  if (typeof document === "undefined") return null;
  const visible = shouldRenderEffectOverlay(runtime.activeTransition?.phase);
  const boardCenter = centerForBoardOverlay(runtime.registry);
  const items = (visible ? (runtime.compiledPlan?.steps ?? []) : []).flatMap((compiled) => {
    if (compiled.step.type !== "effect") return [];
    const effectCompiled = { ...compiled, step: compiled.step };
    const sourceCardCenter =
      effectCompiled.step.presentation === "source-card" ? stagedSourceCardCenter() : null;
    const source = sourceCardCenter ?? centerForRef(runtime.registry, effectCompiled.step.source);
    const sourceEntity =
      effectCompiled.step.presentation === "source-card" &&
      effectCompiled.step.source?.kind === "entity"
        ? (runtime.getEntity(
            runtime.activeTransition!.toState,
            effectCompiled.step.source.id,
            effectCompiled.step.sourceFace ?? "public",
          ) ??
          runtime.getEntity(
            runtime.activeTransition!.fromState,
            effectCompiled.step.source.id,
            effectCompiled.step.sourceFace ?? "public",
          ))
        : null;
    const sourceRecords = effectCompiled.step.source
      ? runtime.registry.get(effectCompiled.step.source)
      : [];
    const sourceEntryNode = sourceRecords.find((record) => record.presence === "exiting")?.node;
    const sourceEntryRect =
      (effectCompiled.step.source ? capturedRect(effectCompiled.step.source) : undefined) ??
      sourceEntryNode?.getBoundingClientRect() ??
      null;
    const sourceExitNode = effectCompiled.step.sourceExitTo
      ? (sourceRecords.find(
          (record) =>
            record.presence === "present" && record.zoneId === effectCompiled.step.sourceExitTo?.id,
        )?.node ?? runtime.registry.getPreferred(effectCompiled.step.sourceExitTo)?.node)
      : null;
    const sourceExitRect = sourceExitNode?.getBoundingClientRect() ?? null;
    const targetPoints = effectCompiled.step.targets.flatMap((target) => {
      const destinationRect = capturedRect(target);
      const destination =
        destinationRect && destinationRect.width > 0 && destinationRect.height > 0
          ? {
              x: destinationRect.left + destinationRect.width / 2,
              y: destinationRect.top + destinationRect.height / 2,
            }
          : null;
      return destination ? [destination] : [];
    });
    const lines = source
      ? targetPoints.map((destination) => ({ compiled: effectCompiled, source, destination }))
      : [];
    return [
      {
        compiled: effectCompiled,
        lines,
        source,
        targetPoints,
        sourceCardCenter,
        sourceEntity,
        sourceEntryRect,
        sourceExitRect,
      },
    ];
  });
  if (items.length === 0 && !Connections) return null;
  return createPortal(
    overlayPortalRoot(
      <>
        {Connections ? (
          <Connections
            playbackStartedAtMs={runtime.playbackStartedAtMs}
            connections={items
              .filter(({ compiled }) => !compiled.step.cinematic && !compiled.step.scene)
              .flatMap(({ lines }) =>
                lines.map(({ compiled, source, destination }, index) => ({
                  id: `${compiled.step.id}:${index}`,
                  source,
                  destination,
                  sourceId: compiled.step.source?.id,
                  startAtMs:
                    compiled.startAtMs +
                    (compiled.step.presentation === "source-card"
                      ? sourceCardEffectTiming(compiled.durationMs).arrowStartMs
                      : 0),
                  durationMs:
                    compiled.step.presentation === "source-card"
                      ? sourceCardEffectTiming(compiled.durationMs).arrowDurationMs
                      : compiled.durationMs,
                })),
              )}
          />
        ) : (
          <svg width="100%" height="100%">
            {items
              .filter(({ compiled }) => !compiled.step.cinematic && !compiled.step.scene)
              .flatMap(({ lines }) =>
                lines.map(({ compiled, source, destination }, index) => (
                  <EffectArrow
                    key={`${compiled.step.id}:${index}`}
                    id={`${compiled.step.id}:${index}`}
                    source={source}
                    destination={destination}
                    startAtMs={
                      compiled.step.presentation === "source-card"
                        ? compiled.startAtMs +
                          sourceCardEffectTiming(compiled.durationMs).arrowStartMs
                        : compiled.startAtMs
                    }
                    durationMs={
                      compiled.step.presentation === "source-card"
                        ? sourceCardEffectTiming(compiled.durationMs).arrowDurationMs
                        : compiled.durationMs
                    }
                  />
                )),
              )}
          </svg>
        )}
        {!runtime.spatialMotionSuppressed && (
          <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
            {items.map(({ compiled, source, targetPoints }) =>
              compiled.step.cinematic ? (
                <CinematicEffect
                  key={compiled.step.id}
                  style={compiled.step.cinematic}
                  source={source}
                  targets={targetPoints}
                  center={compiled.step.targets.length === 0 ? boardCenter : null}
                  startAtMs={
                    compiled.startAtMs +
                    (compiled.step.presentation === "source-card"
                      ? sourceCardEffectTiming(compiled.durationMs).arrowStartMs
                      : 0)
                  }
                  durationMs={
                    compiled.step.presentation === "source-card"
                      ? sourceCardEffectTiming(compiled.durationMs).arrowDurationMs
                      : compiled.durationMs
                  }
                  tone={compiled.step.tone}
                />
              ) : null,
            )}
          </svg>
        )}
        {!runtime.spatialMotionSuppressed &&
          runtime.activeTransition?.phase === "running" &&
          items.map(({ compiled }) =>
            compiled.step.scene ? (
              <SceneEffect
                key={compiled.step.id}
                scene={compiled.step.scene}
                startAtMs={compiled.startAtMs}
                durationMs={compiled.durationMs}
                registry={runtime.registry}
                scopeId={runtime.scopeId}
                rectFor={capturedRect}
                playbackStartedAtMs={runtime.playbackStartedAtMs}
              />
            ) : null,
          )}
        {items.map(
          ({ compiled, sourceCardCenter, sourceEntity, sourceEntryRect, sourceExitRect }) =>
            compiled.step.presentation === "source-card" && sourceCardCenter && sourceEntity ? (
              <motion.div
                key={compiled.step.id}
                className={classes.sourceCardEffect}
                data-animation-overlay="source-card-effect"
                data-effect-tone={compiled.step.tone ?? "neutral"}
                initial={{
                  opacity: 0,
                  transform: "translate3d(-50%, calc(-50% + 6px), 0)",
                }}
                animate={{
                  opacity: sourceExitRect ? [0, 1, 1, 1] : [0, 1, 1, 0],
                  transform: [
                    "translate3d(-50%, calc(-50% + 6px), 0)",
                    "translate3d(-50%, -50%, 0)",
                    "translate3d(-50%, -50%, 0)",
                    "translate3d(-50%, -50%, 0)",
                  ],
                }}
                transition={{
                  delay: compiled.startAtMs / 1_000,
                  duration: compiled.durationMs / 1_000,
                  ease: [0.16, 1, 0.3, 1],
                  times: [0, 0.14, 0.84, 1],
                }}
                style={{
                  left: sourceCardCenter.x,
                  top: sourceCardCenter.y,
                  aspectRatio: sourceEntity.imageAspectRatio ?? 1,
                }}
              >
                {compiled.step.showText === false ? null : (
                  <motion.span
                    className={classes.sourceLabel}
                    data-animation-label
                    animate={{ opacity: sourceExitRect ? [0, 0, 1, 1, 0] : 1 }}
                    transition={{
                      delay: compiled.startAtMs / 1_000,
                      duration: Math.min(compiled.durationMs, 1_600) / 1_000,
                      times: [0, 0.32, 0.4, 0.82, 1],
                    }}
                  >
                    Source
                  </motion.span>
                )}
                <motion.div
                  className={classes.sourceCardFrame}
                  animate={{
                    transform: sourceCardTransformKeyframes(
                      sourceEntryRect,
                      sourceExitRect,
                      sourceCardCenter,
                    ),
                  }}
                  transition={{
                    delay: compiled.startAtMs / 1_000,
                    duration: compiled.durationMs / 1_000,
                    ease: sourceExitRect
                      ? [[0.22, 0.61, 0.36, 1], "linear", [0.4, 0, 0.2, 1], "linear"]
                      : [0.22, 0.61, 0.36, 1],
                    times: sourceExitRect ? [0, 0.22, 0.5, 0.94, 1] : [0, 0.22, 0.78, 1],
                  }}
                >
                  <SimulatorEntityVisual entity={sourceEntity} density="normal" />
                </motion.div>
                {compiled.step.showText === false ? null : (
                  <motion.span
                    className={classes.sourceName}
                    data-animation-label
                    animate={{ opacity: sourceExitRect ? [0, 0, 1, 1, 0] : 1 }}
                    transition={{
                      delay: compiled.startAtMs / 1_000,
                      duration: Math.min(compiled.durationMs, 1_600) / 1_000,
                      times: [0, 0.32, 0.4, 0.82, 1],
                    }}
                  >
                    {sourceEntity.title}
                  </motion.span>
                )}
                {compiled.step.showText === false ? null : (
                  <motion.div
                    className={classes.impactCopy}
                    data-animation-label
                    data-tone={compiled.step.tone ?? "neutral"}
                    animate={{ opacity: sourceExitRect ? [0, 0, 1, 1, 0] : 1 }}
                    transition={{
                      delay: compiled.startAtMs / 1_000,
                      duration: Math.min(compiled.durationMs, 1_600) / 1_000,
                      times: [0, 0.32, 0.4, 0.82, 1],
                    }}
                  >
                    {compiled.step.valueLabel ? (
                      <strong className={classes.impactValue}>{compiled.step.valueLabel}</strong>
                    ) : null}
                    {compiled.step.label ? (
                      <span className={classes.impactLabel}>{compiled.step.label}</span>
                    ) : null}
                  </motion.div>
                )}
              </motion.div>
            ) : compiled.step.showText === false ? null : (
              <motion.div
                key={compiled.step.id}
                data-animation-overlay="effect"
                data-animation-label-only
                initial={{ opacity: 0, transform: "translate3d(-50%, -50%, 0) scale(0.9)" }}
                animate={{
                  opacity: [0, 1, 0],
                  transform: [
                    "translate3d(-50%, -50%, 0) scale(0.9)",
                    "translate3d(-50%, -50%, 0) scale(1)",
                    "translate3d(-50%, -50%, 0) scale(1.05)",
                  ],
                }}
                transition={{
                  delay: compiled.startAtMs / 1_000,
                  duration: compiled.durationMs / 1_000,
                }}
                style={{
                  position: "fixed",
                  left: boardCenter?.x ?? "50%",
                  top: boardCenter?.y ?? "42%",
                  color: "var(--game-accent, #5eead4)",
                  fontWeight: 900,
                }}
              >
                {compiled.step.label}
              </motion.div>
            ),
        )}
      </>,
    ),
    document.body,
  );
}

function sourceCardTransformKeyframes(
  sourceEntryRect: DOMRect | null,
  sourceExitRect: DOMRect | null,
  center: { readonly x: number; readonly y: number },
): string[] {
  if (!sourceExitRect) {
    return [
      "translate3d(24px, 0, 0) scale(0.92)",
      "translate3d(0, 0, 0) scale(1)",
      "translate3d(0, 0, 0) scale(1)",
      "translate3d(-4px, 0, 0) scale(0.98)",
    ];
  }
  const sourceX = sourceEntryRect
    ? sourceEntryRect.left + sourceEntryRect.width / 2 - center.x
    : 24;
  const sourceY = sourceEntryRect ? sourceEntryRect.top + sourceEntryRect.height / 2 - center.y : 0;
  const exitX = sourceExitRect.left + sourceExitRect.width / 2 - center.x;
  const exitY = sourceExitRect.top + sourceExitRect.height / 2 - center.y;
  const entryScale = sourceEntryRect ? sourceScale(sourceEntryRect.width) : 0.92;
  const exitScale = sourceExitScale(sourceExitRect.width);
  return [
    translateScale(sourceX, sourceY, entryScale),
    translateScale(0, 0, 1),
    translateScale(0, 0, 1),
    translateScale(exitX, exitY, exitScale),
    translateScale(exitX, exitY, exitScale),
  ];
}

function translateScale(x: number, y: number, scale: number): string {
  return `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
}

function stagedSourceCardCenter(): { readonly x: number; readonly y: number } {
  const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
  const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
  return {
    x: viewportWidth * (viewportWidth < 768 ? 0.72 : 0.78),
    y: viewportHeight * 0.43,
  };
}

function sourceExitScale(destinationWidth: number): number {
  return Math.min(1, Math.max(0.35, destinationWidth / sourceSpotlightWidth()));
}

function sourceScale(sourceWidth: number): number {
  return Math.min(1, Math.max(0.35, sourceWidth / sourceSpotlightWidth()));
}

function sourceSpotlightWidth(): number {
  const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
  return viewportWidth < 768
    ? Math.min(100, Math.max(76, viewportWidth * 0.2))
    : Math.min(124, Math.max(92, viewportWidth * 0.085));
}
