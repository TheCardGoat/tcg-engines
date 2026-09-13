import type { EmphasizeStepV2 } from "@tcg/protocol/animations";
import { motion, useReducedMotion } from "motion/react";
import { createPortal } from "react-dom";

import { useAnimationRegistryVersion } from "../hooks/useAnimationRegistryVersion";
import { useAnimationRuntime } from "../provider/contexts";
import { centerForRef, overlayPortalRoot } from "./overlay-utils";

type EmphasisTone = NonNullable<EmphasizeStepV2["tone"]>;
const EMPHASIS_SIZE = 200;
const EMPHASIS_VIEWPORT_GUTTER = 8;

export function emphasisOverlayPosition(
  center: { readonly x: number; readonly y: number },
  viewport: { readonly width: number; readonly height: number },
) {
  const maxLeft = Math.max(
    EMPHASIS_VIEWPORT_GUTTER,
    viewport.width - EMPHASIS_SIZE - EMPHASIS_VIEWPORT_GUTTER,
  );
  const maxTop = Math.max(
    EMPHASIS_VIEWPORT_GUTTER,
    viewport.height - EMPHASIS_SIZE - EMPHASIS_VIEWPORT_GUTTER,
  );
  return {
    left: Math.min(Math.max(center.x - EMPHASIS_SIZE / 2, EMPHASIS_VIEWPORT_GUTTER), maxLeft),
    top: Math.min(Math.max(center.y - EMPHASIS_SIZE / 2, EMPHASIS_VIEWPORT_GUTTER), maxTop),
  };
}

export function emphasisVisualStyle(tone: EmphasisTone | undefined) {
  switch (tone ?? "neutral") {
    case "positive":
      return {
        tone: "positive" as const,
        color: "#ffd66b",
        surface: "rgba(45, 28, 10, 0.94)",
        borderStyle: "solid" as const,
        travel: -20,
      };
    case "negative":
      return {
        tone: "negative" as const,
        color: "#ef7783",
        surface: "rgba(48, 18, 23, 0.94)",
        borderStyle: "dashed" as const,
        travel: 20,
      };
    case "neutral":
      return {
        tone: "neutral" as const,
        color: "var(--game-accent, #5eead4)",
        surface: "rgba(16, 27, 29, 0.94)",
        borderStyle: "solid" as const,
        travel: 0,
      };
  }
}

export function EmphasisOverlay() {
  const runtime = useAnimationRuntime();
  const reduceMotion = useReducedMotion();
  useAnimationRegistryVersion(runtime.registry);
  if (typeof document === "undefined" || runtime.activeTransition?.phase !== "running") return null;
  const items = (runtime.compiledPlan?.steps ?? []).flatMap((compiled) => {
    if (compiled.step.type !== "emphasize") return [];
    const step: EmphasizeStepV2 = compiled.step;
    const center = centerForRef(runtime.registry, step.at);
    return center ? [{ compiled, step, center }] : [];
  });
  if (items.length === 0) return null;
  return createPortal(
    overlayPortalRoot(
      items.map(({ compiled, step, center }) => {
        const visual = emphasisVisualStyle(step.tone);
        const position = emphasisOverlayPosition(center, {
          width: window.innerWidth,
          height: window.innerHeight,
        });
        const delay = compiled.startAtMs / 1_000;
        const duration = compiled.durationMs / 1_000;
        return (
          <motion.div
            key={step.id}
            data-animation-overlay="emphasize"
            data-animation-emphasis-style={step.style}
            data-animation-emphasis-tone={visual.tone}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ delay, duration, times: [0, 0.1, 0.86, 1] }}
            style={{
              position: "fixed",
              left: position.left,
              top: position.top,
              width: EMPHASIS_SIZE,
              height: EMPHASIS_SIZE,
              display: "grid",
              placeItems: "center",
            }}
          >
            <motion.div
              initial={{
                opacity: 0,
                transform: emphasisTransform(0, reduceMotion ? 1 : 0.68),
              }}
              animate={{
                opacity: reduceMotion ? 0.38 : [0, 0.58, 0.2, 0],
                transform: reduceMotion
                  ? emphasisTransform(0, 1)
                  : [
                      emphasisTransform(0, 0.68),
                      emphasisTransform(0, 1.02),
                      emphasisTransform(visual.travel * 0.2, 1.42),
                      emphasisTransform(visual.travel * 0.6, 1.58),
                    ],
              }}
              transition={{
                delay: delay + duration * 0.06,
                duration: duration * 0.78,
                times: [0, 0.24, 0.72, 1],
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                position: "absolute",
                width: 142,
                height: 142,
                borderRadius: "50%",
                border: `2px ${visual.borderStyle} ${visual.color}`,
              }}
            />
            <motion.div
              initial={{
                opacity: 0.28,
                transform: emphasisTransform(0, reduceMotion ? 1 : 0.7),
              }}
              animate={{
                opacity: [0.28, 1, 0.12, 0],
                transform: reduceMotion
                  ? emphasisTransform(0, 1)
                  : [
                      emphasisTransform(0, 0.7),
                      emphasisTransform(0, 1.06),
                      emphasisTransform(visual.travel * 0.35, 1.26),
                      emphasisTransform(visual.travel, 1.34),
                    ],
              }}
              transition={{
                delay,
                duration: duration * 0.9,
                times: [0, 0.24, 0.78, 1],
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                position: "absolute",
                width: 120,
                height: 120,
                borderRadius: "50%",
                border: `4px ${visual.borderStyle} ${visual.color}`,
                boxShadow: `0 16px 38px color-mix(in srgb, ${visual.color} 58%, transparent)`,
              }}
            />
            {step.label ? (
              <motion.div
                initial={{
                  opacity: 0,
                  transform: emphasisTransform(8, reduceMotion ? 1 : 0.92),
                }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  transform: reduceMotion
                    ? emphasisTransform(0, 1)
                    : [
                        emphasisTransform(8, 0.92),
                        emphasisTransform(visual.travel, 1),
                        emphasisTransform(visual.travel, 1),
                      ],
                }}
                transition={{
                  delay: delay + duration * 0.08,
                  duration: duration * 0.86,
                  times: [0, 0.18, 0.82, 1],
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  position: "absolute",
                  top: visual.tone === "positive" ? 10 : visual.tone === "negative" ? 154 : 146,
                  minWidth: 146,
                  padding: "9px 15px",
                  border: `2px solid color-mix(in srgb, ${visual.color} 72%, transparent)`,
                  borderRadius: 12,
                  background: visual.surface,
                  boxShadow: "0 10px 24px rgba(0, 0, 0, 0.38)",
                  color: visual.color,
                  fontSize: 14,
                  fontWeight: 950,
                  letterSpacing: "0.1em",
                  lineHeight: 1,
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}
              >
                {step.label}
              </motion.div>
            ) : null}
          </motion.div>
        );
      }),
    ),
    document.body,
  );
}

function emphasisTransform(y: number, scale: number): string {
  return `translate3d(0, ${y}px, 0) scale(${scale})`;
}
