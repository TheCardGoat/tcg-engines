import type { AnimationPhase } from "@tcg/simulator-runtime/animation";
import { motion } from "motion/react";
import { useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { TargetingArrow } from "../../components/TargetingArrow";
import { SimulatorEntityVisual } from "../components/SimulatorEntityVisual";
import { useAnimationRegistryVersion } from "../hooks/useAnimationRegistryVersion";
import { useAnimationRuntime } from "../provider/contexts";
import { centerForBoardOverlay, centerForRef, overlayPortalRoot } from "./overlay-utils";
import classes from "./EffectOverlay.module.css";

interface EffectArrowProps {
  readonly id: string;
  readonly source: { readonly x: number; readonly y: number };
  readonly destination: { readonly x: number; readonly y: number };
  readonly startAtMs: number;
  readonly durationMs: number;
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
  const registryVersion = useAnimationRegistryVersion(runtime.registry);
  const sourceEntryRects = useRef(new Map<string, DOMRect>());
  const activeTransition = runtime.activeTransition;

  useLayoutEffect(() => {
    if (activeTransition?.phase !== "preparing" || !runtime.compiledPlan) return;
    for (const compiled of runtime.compiledPlan.steps) {
      if (
        compiled.step.type !== "effect" ||
        compiled.step.presentation !== "source-card" ||
        !compiled.step.source
      ) {
        continue;
      }
      const node = runtime.registry.getPreferred(compiled.step.source)?.node;
      if (!node) continue;
      const rect = node.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        sourceEntryRects.current.set(`${activeTransition.id}:${compiled.step.id}`, rect);
      }
    }
  }, [activeTransition, registryVersion, runtime.compiledPlan, runtime.registry]);

  if (
    typeof document === "undefined" ||
    !shouldRenderEffectOverlay(runtime.activeTransition?.phase)
  ) {
    return null;
  }
  const boardCenter = centerForBoardOverlay(runtime.registry);
  const items = (runtime.compiledPlan?.steps ?? []).flatMap((compiled) => {
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
      sourceEntryNode?.getBoundingClientRect() ??
      sourceEntryRects.current.get(`${runtime.activeTransition!.id}:${compiled.step.id}`) ??
      null;
    const sourceExitNode = effectCompiled.step.sourceExitTo
      ? (sourceRecords.find(
          (record) =>
            record.presence === "present" && record.zoneId === effectCompiled.step.sourceExitTo?.id,
        )?.node ?? runtime.registry.getPreferred(effectCompiled.step.sourceExitTo)?.node)
      : null;
    const sourceExitRect = sourceExitNode?.getBoundingClientRect() ?? null;
    const lines = effectCompiled.step.targets.flatMap((target) => {
      const destination = centerForRef(runtime.registry, target);
      const destinationNode = runtime.registry.getPreferred(target)?.node;
      const destinationRect = destinationNode?.getBoundingClientRect();
      return source && destination
        ? [
            {
              compiled: effectCompiled,
              source,
              destination,
              destinationRect: destinationRect
                ? {
                    left: destinationRect.left,
                    top: destinationRect.top,
                    width: destinationRect.width,
                    height: destinationRect.height,
                  }
                : null,
            },
          ]
        : [];
    });
    return [
      {
        compiled: effectCompiled,
        lines,
        sourceCardCenter,
        sourceEntity,
        sourceEntryRect,
        sourceExitRect,
      },
    ];
  });
  if (items.length === 0) return null;
  return createPortal(
    overlayPortalRoot(
      <>
        <svg width="100%" height="100%">
          {items.flatMap(({ lines }) =>
            lines.map(({ compiled, source, destination }, index) => (
              <EffectArrow
                key={`${compiled.step.id}:${index}`}
                id={`${compiled.step.id}:${index}`}
                source={source}
                destination={destination}
                startAtMs={
                  compiled.step.presentation === "source-card"
                    ? compiled.startAtMs + 600
                    : compiled.startAtMs
                }
                durationMs={
                  compiled.step.presentation === "source-card"
                    ? Math.max(0, compiled.durationMs - 1_300)
                    : compiled.durationMs
                }
              />
            )),
          )}
        </svg>
        {items.flatMap(({ lines }) =>
          lines.flatMap(({ compiled, destinationRect }, index) =>
            compiled.step.presentation === "source-card" && destinationRect ? (
              <motion.div
                key={`${compiled.step.id}:target:${index}`}
                className={classes.targetImpact}
                data-animation-effect-target="true"
                initial={{ opacity: 0, transform: "translate3d(0, 0, 0) scale(0.92)" }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  transform: [
                    "translate3d(0, 0, 0) scale(0.92)",
                    "translate3d(0, 0, 0) scale(1.04)",
                    "translate3d(0, 0, 0) scale(1)",
                    "translate3d(0, 0, 0) scale(1)",
                  ],
                }}
                transition={{
                  delay: (compiled.startAtMs + 700) / 1_000,
                  duration: Math.max(0, compiled.durationMs - 1_400) / 1_000,
                  ease: [0.16, 1, 0.3, 1],
                  times: [0, 0.2, 0.78, 1],
                }}
                style={destinationRect}
              >
                <span className={classes.targetLabel}>Target</span>
              </motion.div>
            ) : (
              []
            ),
          ),
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
                style={{ left: sourceCardCenter.x, top: sourceCardCenter.y }}
              >
                <motion.span
                  className={classes.sourceLabel}
                  animate={{ opacity: sourceExitRect ? [0, 0, 1, 1, 0] : 1 }}
                  transition={{
                    delay: compiled.startAtMs / 1_000,
                    duration: Math.min(compiled.durationMs, 1_600) / 1_000,
                    times: [0, 0.32, 0.4, 0.82, 1],
                  }}
                >
                  Source
                </motion.span>
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
                    times: sourceExitRect ? [0, 0.28, 0.62, 0.96, 1] : [0, 0.28, 0.78, 1],
                  }}
                >
                  <SimulatorEntityVisual entity={sourceEntity} density="normal" />
                </motion.div>
                <motion.span
                  className={classes.sourceName}
                  animate={{ opacity: sourceExitRect ? [0, 0, 1, 1, 0] : 1 }}
                  transition={{
                    delay: compiled.startAtMs / 1_000,
                    duration: Math.min(compiled.durationMs, 1_600) / 1_000,
                    times: [0, 0.32, 0.4, 0.82, 1],
                  }}
                >
                  {sourceEntity.title}
                </motion.span>
                <motion.div
                  className={classes.impactCopy}
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
              </motion.div>
            ) : (
              <motion.div
                key={compiled.step.id}
                data-animation-overlay="effect"
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
