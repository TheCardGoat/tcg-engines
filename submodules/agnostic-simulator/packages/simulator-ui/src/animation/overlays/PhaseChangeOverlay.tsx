import { motion } from "motion/react";
import type { PhaseChangeStepV2 } from "@tcg/protocol/animations";
import type { CompiledAnimationStep } from "@tcg/simulator-runtime/animation";
import { useLayoutEffect, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";

import { useAnimationRegistryVersion } from "../hooks/useAnimationRegistryVersion";
import { useAnimationRuntime } from "../provider/contexts";
import classes from "./PhaseChangeOverlay.module.css";
import {
  centerForBoardOverlay,
  cssVariableForBoardOverlay,
  overlayPortalRoot,
  rectForPhaseChangeOverlayAnchor,
} from "./overlay-utils";

interface PhaseChangePresentation {
  readonly transitionId: string;
  readonly expiresAtMs: number;
  readonly items: readonly (CompiledAnimationStep & { readonly step: PhaseChangeStepV2 })[];
  readonly center: { readonly x: number; readonly y: number } | null;
  readonly phaseChangeAnchor: {
    readonly center: { readonly x: number; readonly y: number };
    readonly width: number;
  } | null;
  readonly accent: string;
}

function phaseChangeItems(runtime: ReturnType<typeof useAnimationRuntime>) {
  return (runtime.compiledPlan?.steps ?? []).filter(
    (compiled): compiled is typeof compiled & { step: PhaseChangeStepV2 } =>
      compiled.step.type === "phaseChange",
  );
}

function titleForPhaseChange(step: PhaseChangeStepV2): string {
  if (step.variant === "turn") {
    return step.turnNumber ? `Turn ${step.turnNumber}` : "Next turn";
  }
  const phase = step.to.replaceAll("-", " ").trim();
  if (/\bstep$/i.test(phase)) return phase;
  return /\bphase$/i.test(phase) ? phase : `${phase} phase`;
}

export function PhaseChangeOverlay() {
  const runtime = useAnimationRuntime();
  const registryVersion = useAnimationRegistryVersion(runtime.registry);
  const [presentation, setPresentation] = useState<PhaseChangePresentation | null>(null);

  useLayoutEffect(() => {
    const transition = runtime.activeTransition;
    if (transition?.phase !== "running") return;
    const items = phaseChangeItems(runtime);
    if (items.length === 0) return;
    const center = centerForBoardOverlay(runtime.registry);
    const phaseChangeAnchor = rectForPhaseChangeOverlayAnchor();
    const accent = cssVariableForBoardOverlay(runtime.registry, "--game-accent") ?? "#c4a35a";
    const expiresAtMs =
      (runtime.playbackStartedAtMs ?? performance.now()) +
      items.reduce((latest, item) => Math.max(latest, item.endAtMs), 0);
    setPresentation((current) => ({
      transitionId: transition.id,
      expiresAtMs: current?.transitionId === transition.id ? current.expiresAtMs : expiresAtMs,
      items,
      center,
      phaseChangeAnchor,
      accent,
    }));
  }, [
    registryVersion,
    runtime.activeTransition,
    runtime.compiledPlan,
    runtime.playbackStartedAtMs,
    runtime.registry,
  ]);

  useLayoutEffect(() => {
    if (!presentation) return;
    const timer = setTimeout(
      () =>
        setPresentation((current) =>
          current?.transitionId === presentation.transitionId ? null : current,
        ),
      Math.max(0, presentation.expiresAtMs - performance.now()),
    );
    return () => clearTimeout(timer);
  }, [presentation?.expiresAtMs, presentation?.transitionId]);

  if (typeof document === "undefined" || !presentation) return null;
  const boardCenter = presentation.center;
  const phaseChangeAnchor = presentation.phaseChangeAnchor;
  const boardAccent = presentation.accent;
  return createPortal(
    overlayPortalRoot(
      presentation.items.map((compiled) => {
        const title = titleForPhaseChange(compiled.step);
        const combatStep = compiled.step.variant === "phase" && /-step$/i.test(compiled.step.to);
        const supersededByPhase =
          compiled.step.variant === "turn" &&
          presentation.items.some(
            (other) =>
              other.step.type === "phaseChange" &&
              other.step.variant !== "turn" &&
              other.startAtMs === compiled.startAtMs,
          );
        return (
          <div
            key={compiled.step.id}
            className={classes.positioner}
            data-combat-step={combatStep ? "true" : undefined}
            style={
              {
                left: combatStep
                  ? (phaseChangeAnchor?.center.x ?? boardCenter?.x ?? "50%")
                  : (boardCenter?.x ?? "50%"),
                top: combatStep
                  ? (phaseChangeAnchor?.center.y ?? boardCenter?.y ?? "50%")
                  : (boardCenter?.y ?? "50%"),
                "--phase-change-accent": boardAccent,
                "--phase-change-anchor-width": phaseChangeAnchor
                  ? `${phaseChangeAnchor.width}px`
                  : undefined,
                visibility: supersededByPhase ? "hidden" : undefined,
              } as CSSProperties
            }
          >
            <motion.div
              className={classes.announcement}
              data-animation-overlay="phase-change"
              data-animation-variant={compiled.step.variant}
              data-animation-interaction="nonblocking"
              initial={{
                opacity: 0,
                transform: combatStep
                  ? "translate3d(0, -4px, 0) scale(0.98)"
                  : "translate3d(0, 8px, 0) scale(0.96)",
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                transform: combatStep
                  ? [
                      "translate3d(0, -4px, 0) scale(0.98)",
                      "translate3d(0, 0, 0) scale(1)",
                      "translate3d(0, 0, 0) scale(1)",
                      "translate3d(0, -2px, 0) scale(1)",
                    ]
                  : [
                      "translate3d(0, 8px, 0) scale(0.96)",
                      "translate3d(0, 0, 0) scale(1)",
                      "translate3d(0, 0, 0) scale(1)",
                      "translate3d(0, -4px, 0) scale(1.015)",
                    ],
              }}
              transition={{
                delay: compiled.startAtMs / 1_000,
                duration: compiled.durationMs / 1_000,
                ease: [0.16, 1, 0.3, 1],
                times: combatStep ? [0, 0.12, 0.88, 1] : [0, 0.18, 0.78, 1],
              }}
            >
              <span className={classes.rule} />
              <span className={classes.plaque}>
                {!combatStep ? (
                  <span className={classes.context}>
                    {compiled.step.variant === "turn" ? "Turn change" : "Phase change"}
                  </span>
                ) : null}
                <strong className={classes.title}>{title}</strong>
              </span>
              <span className={classes.rule} />
            </motion.div>
          </div>
        );
      }),
    ),
    document.body,
  );
}
