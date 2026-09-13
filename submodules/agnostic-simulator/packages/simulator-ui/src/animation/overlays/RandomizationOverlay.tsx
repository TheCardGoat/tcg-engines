import { motion } from "motion/react";
import { createPortal } from "react-dom";

import { useAnimationRuntime } from "../provider/contexts";
import { centerForRef, overlayPortalRoot } from "./overlay-utils";

const RANDOMIZATION_LABELS = {
  shuffle: "SHUFFLE",
  die: "ROLL",
  coin: "FLIP",
  selection: "RANDOM",
} as const;

export function RandomizationOverlay() {
  const runtime = useAnimationRuntime();
  if (typeof document === "undefined" || runtime.activeTransition?.phase !== "running") return null;
  const items = (runtime.compiledPlan?.steps ?? []).flatMap((compiled) => {
    if (compiled.step.type !== "randomization") return [];
    const center = centerForRef(runtime.registry, compiled.step.at);
    return center ? [{ compiled, center }] : [];
  });
  if (items.length === 0) return null;
  return createPortal(
    overlayPortalRoot(
      items.map(({ compiled, center }) => {
        if (compiled.step.type !== "randomization") return null;
        if (compiled.step.kind === "shuffle") {
          return (
            <ShuffleRandomizationVisual
              key={compiled.step.id}
              center={center}
              delaySeconds={compiled.startAtMs / 1_000}
              durationSeconds={compiled.durationMs / 1_000}
              label={compiled.step.resultLabel ?? RANDOMIZATION_LABELS.shuffle}
            />
          );
        }
        return (
          <motion.div
            key={compiled.step.id}
            data-animation-overlay="randomization"
            data-animation-randomization-kind={compiled.step.kind}
            initial={{
              opacity: 0,
              transform: "translate3d(-50%, -50%, 0) rotate(-10deg) scale(0.8)",
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              transform: [
                "translate3d(-50%, -50%, 0) rotate(-10deg) scale(0.8)",
                "translate3d(-50%, -50%, 0) rotate(8deg) scale(1.1)",
                "translate3d(-50%, -50%, 0) rotate(-5deg) scale(1)",
                "translate3d(-50%, -50%, 0) rotate(0deg) scale(1)",
              ],
            }}
            transition={{
              delay: compiled.startAtMs / 1_000,
              duration: compiled.durationMs / 1_000,
            }}
            style={{
              position: "fixed",
              left: center.x,
              top: center.y,
              borderRadius: 999,
              background: "rgba(2, 6, 23, .9)",
              border: "1px solid var(--game-accent, #5eead4)",
              color: "white",
              padding: "7px 11px",
              fontWeight: 900,
            }}
          >
            {compiled.step.resultLabel ?? RANDOMIZATION_LABELS[compiled.step.kind]}
          </motion.div>
        );
      }),
    ),
    document.body,
  );
}

function ShuffleRandomizationVisual({
  center,
  delaySeconds,
  durationSeconds,
  label,
}: {
  readonly center: { x: number; y: number };
  readonly delaySeconds: number;
  readonly durationSeconds: number;
  readonly label: string;
}) {
  const cardStyle = {
    position: "absolute",
    inset: 0,
    borderRadius: 5,
    border: "1px solid color-mix(in srgb, var(--game-accent, #5eead4) 75%, white)",
    background:
      "linear-gradient(145deg, color-mix(in srgb, var(--game-accent, #5eead4) 38%, #020617), #020617 72%)",
    boxShadow: "0 8px 18px rgba(2, 6, 23, .38)",
  } as const;
  const transition = {
    delay: delaySeconds,
    duration: durationSeconds,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  return (
    <motion.div
      data-animation-overlay="randomization"
      data-animation-randomization-kind="shuffle"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={transition}
      style={{
        position: "fixed",
        left: center.x,
        top: center.y,
        width: 42,
        height: 58,
        transform: "translate3d(-50%, -50%, 0)",
      }}
    >
      <motion.div
        aria-hidden
        initial={{ transform: "translate3d(0, 0, 0) rotate(-3deg)" }}
        animate={{
          transform: [
            "translate3d(0, 0, 0) rotate(-3deg)",
            "translate3d(-18px, 2px, 0) rotate(-12deg)",
            "translate3d(10px, -1px, 0) rotate(7deg)",
            "translate3d(-8px, 1px, 0) rotate(-5deg)",
            "translate3d(0, 0, 0) rotate(-3deg)",
          ],
        }}
        transition={transition}
        style={cardStyle}
      />
      <motion.div
        aria-hidden
        initial={{ transform: "translate3d(0, 0, 0) rotate(3deg)" }}
        animate={{
          transform: [
            "translate3d(0, 0, 0) rotate(3deg)",
            "translate3d(18px, -2px, 0) rotate(12deg)",
            "translate3d(-10px, 1px, 0) rotate(-7deg)",
            "translate3d(8px, -1px, 0) rotate(5deg)",
            "translate3d(0, 0, 0) rotate(3deg)",
          ],
        }}
        transition={transition}
        style={cardStyle}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "calc(100% + 8px)",
          translate: "-50% 0",
          borderRadius: 999,
          background: "rgba(2, 6, 23, .9)",
          border: "1px solid var(--game-accent, #5eead4)",
          color: "white",
          padding: "4px 8px",
          fontSize: 10,
          fontWeight: 900,
          letterSpacing: ".08em",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    </motion.div>
  );
}
