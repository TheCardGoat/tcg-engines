import { motion } from "motion/react";
import type { ValueDeltaStepV2 } from "@tcg/protocol/animations";
import { createPortal } from "react-dom";

import { useAnimationRegistryVersion } from "../hooks/useAnimationRegistryVersion";
import { useAnimationRuntime } from "../provider/contexts";
import { centerForRef, overlayPortalRoot } from "./overlay-utils";

export function ValueDeltaOverlay() {
  const runtime = useAnimationRuntime();
  const ValueDeltaVisual = runtime.valueDeltaRenderer;
  useAnimationRegistryVersion(runtime.registry);
  if (typeof document === "undefined" || runtime.activeTransition?.phase !== "running") return null;
  const items = (runtime.compiledPlan?.steps ?? []).flatMap((compiled) => {
    if (compiled.step.type !== "valueDelta") return [];
    const center = centerForRef(runtime.registry, compiled.step.subject);
    return center
      ? [{ compiled: { ...compiled, step: compiled.step as ValueDeltaStepV2 }, center }]
      : [];
  });
  if (items.length === 0) return null;
  return createPortal(
    overlayPortalRoot(
      items.map(({ compiled, center }) => (
        <motion.div
          key={compiled.step.id}
          data-animation-overlay="value-delta"
          initial={{ transform: "translate3d(0, 8px, 0)", opacity: 0 }}
          animate={{ transform: "translate3d(0, -32px, 0)", opacity: [0, 1, 0] }}
          transition={{
            delay: compiled.startAtMs / 1_000,
            duration: compiled.durationMs / 1_000,
          }}
          style={{
            position: "fixed",
            left: center.x,
            top: center.y,
            color:
              compiled.step.tone === "neutral"
                ? "white"
                : compiled.step.tone === "negative" ||
                    (compiled.step.tone === undefined && compiled.step.delta < 0)
                  ? "#fda4af"
                  : "#6ee7b7",
            fontWeight: 900,
          }}
        >
          {ValueDeltaVisual ? (
            <ValueDeltaVisual step={compiled.step} />
          ) : (
            <>
              {compiled.step.delta >= 0 ? "+" : ""}
              {compiled.step.delta} {compiled.step.label}
            </>
          )}
        </motion.div>
      )),
    ),
    document.body,
  );
}
