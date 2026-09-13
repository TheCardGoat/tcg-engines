import type { SimulatorEntity } from "@tcg/simulator-contract";
import { motion, useIsPresent, type HTMLMotionProps } from "motion/react";
import { forwardRef, useCallback, type CSSProperties, type ReactNode } from "react";

import { useAnimationNode } from "../hooks/useAnimationNode";
import {
  entityParticipatesInLayout,
  entityLayoutTransition,
  hasEntityTransfer,
  hasSourceCardExit,
} from "../lib/entity-layout-transition";
import type { AnimationNodeDensity } from "../lib/node-registry";
import { useOptionalAnimationRuntime } from "../provider/contexts";

export interface AnimatedEntitySlotProps extends Omit<
  HTMLMotionProps<"div">,
  "children" | "layout" | "layoutId" | "ref" | "style" | "transition" | "exit"
> {
  readonly entity: SimulatorEntity;
  readonly zoneRef?: { kind: "zone"; id: string; ownerId?: string };
  readonly density: AnimationNodeDensity;
  readonly children: ReactNode;
  readonly className?: string;
  readonly style?: CSSProperties;
}

export const AnimatedEntitySlot = forwardRef<HTMLDivElement, AnimatedEntitySlotProps>(
  function AnimatedEntitySlot(
    { entity, zoneRef, density, children, className, style, ...divProps },
    forwardedRef,
  ) {
    const runtime = useOptionalAnimationRuntime();
    const compiledPlan = runtime?.compiledPlan;
    const transferActive = hasEntityTransfer(entity.id, compiledPlan);
    const sourceExitActive = hasSourceCardExit(entity.id, compiledPlan);
    const layoutActive = entityParticipatesInLayout(entity.id, zoneRef?.id, compiledPlan);
    const isPresent = useIsPresent();
    const animationRef = useAnimationNode(
      { kind: "entity", id: entity.id },
      {
        entity,
        zoneId: zoneRef?.id,
        density,
        presence: isPresent ? "present" : "exiting",
      },
    );
    const ref = useCallback(
      (node: HTMLDivElement | null) => {
        animationRef(node);
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [animationRef, forwardedRef],
    );
    return (
      <motion.div
        ref={ref}
        layout={layoutActive && !transferActive ? "position" : false}
        transition={{
          layout: entityLayoutTransition(entity.id, compiledPlan),
          opacity: { duration: (compiledPlan?.primaryDurationMs ?? 560) / 1_000 },
        }}
        // AnimatePresence needs a concrete exit change to release retained
        // nodes reliably (including reduced-motion and JSDOM). A 0.1% opacity
        // delta is visually indistinguishable while preserving the source slot
        // until the portal transfer has captured its source geometry.
        exit={transferActive ? { opacity: 0.999 } : { opacity: 0, transition: { duration: 0 } }}
        className={className}
        style={{ ...style, visibility: sourceExitActive ? "hidden" : style?.visibility }}
        {...divProps}
      >
        {children}
      </motion.div>
    );
  },
);
