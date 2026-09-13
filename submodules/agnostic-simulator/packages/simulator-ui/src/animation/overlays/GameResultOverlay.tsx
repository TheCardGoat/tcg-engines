import { motion } from "motion/react";
import { createPortal } from "react-dom";

import { useAnimationRuntime } from "../provider/contexts";
import { centerForBoardOverlay, overlayPortalRoot } from "./overlay-utils";

export function GameResultOverlay() {
  const runtime = useAnimationRuntime();
  if (typeof document === "undefined" || runtime.activeTransition?.phase !== "running") return null;
  const boardCenter = centerForBoardOverlay(runtime.registry);
  const items = (runtime.compiledPlan?.steps ?? []).filter(
    (compiled) => compiled.step.type === "gameResult",
  );
  if (items.length === 0) return null;
  return createPortal(
    overlayPortalRoot(
      items.map((compiled) => {
        if (compiled.step.type !== "gameResult") return null;
        const label =
          compiled.step.outcome === "draw"
            ? "DRAW"
            : compiled.step.winner?.id === runtime.viewerSeatId
              ? "VICTORY"
              : runtime.viewerSeatId
                ? "DEFEAT"
                : "GAME OVER";
        return (
          <motion.div
            key={compiled.step.id}
            data-animation-overlay="game-result"
            data-animation-game-result={label.toLocaleLowerCase().replace(" ", "-")}
            initial={{ opacity: 0, transform: "translate3d(-50%, -50%, 0) scale(0.82)" }}
            animate={{
              opacity: [0, 1, 1, 0],
              transform: [
                "translate3d(-50%, -50%, 0) scale(0.82)",
                "translate3d(-50%, -50%, 0) scale(1.04)",
                "translate3d(-50%, -50%, 0) scale(1)",
                "translate3d(-50%, -50%, 0) scale(1)",
              ],
            }}
            transition={{
              delay: compiled.startAtMs / 1_000,
              duration: compiled.durationMs / 1_000,
            }}
            style={{
              position: "fixed",
              left: boardCenter?.x ?? "50%",
              top: boardCenter?.y ?? "45%",
              minWidth: 240,
              textAlign: "center",
              border: "1px solid var(--game-accent, #5eead4)",
              borderRadius: 12,
              background: "rgba(2, 6, 23, .94)",
              color: "white",
              padding: "20px 28px",
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 950, letterSpacing: "0.08em" }}>{label}</div>
            {compiled.step.reasonLabel ? (
              <div style={{ marginTop: 6, opacity: 0.78 }}>{compiled.step.reasonLabel}</div>
            ) : null}
          </motion.div>
        );
      }),
    ),
    document.body,
  );
}
