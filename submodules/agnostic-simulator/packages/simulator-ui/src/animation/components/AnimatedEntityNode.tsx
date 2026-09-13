import { motion, useIsPresent, type HTMLMotionProps } from "motion/react";

import { useAnimationNode } from "../hooks/useAnimationNode";
import {
  entityParticipatesInLayout,
  entityLayoutTransition,
  hasEntityTransfer,
  hasSourceCardExit,
} from "../lib/entity-layout-transition";
import type { AnimationNodeDensity } from "../lib/node-registry";
import { useOptionalAnimationRuntime } from "../provider/contexts";

export interface AnimatedEntityNodeProps extends Omit<
  HTMLMotionProps<"div">,
  "children" | "layout" | "layoutId" | "ref" | "transition" | "exit"
> {
  readonly entityId: string;
  readonly zoneRef?: { kind: "zone"; id: string; ownerId?: string };
  readonly density: AnimationNodeDensity;
  readonly children: React.ReactNode;
}

export function AnimatedEntityNode({
  entityId,
  zoneRef,
  density,
  children,
  style,
  ...divProps
}: AnimatedEntityNodeProps) {
  const runtime = useOptionalAnimationRuntime();
  const compiledPlan = runtime?.compiledPlan;
  const transferActive = hasEntityTransfer(entityId, compiledPlan);
  const sourceExitActive = hasSourceCardExit(entityId, compiledPlan);
  const layoutActive = entityParticipatesInLayout(entityId, zoneRef?.id, compiledPlan);
  const isPresent = useIsPresent();
  const ref = useAnimationNode(
    { kind: "entity", id: entityId },
    {
      zoneId: zoneRef?.id,
      density,
      presence: isPresent ? "present" : "exiting",
    },
  );
  return (
    <motion.div
      ref={ref}
      layout={layoutActive && !transferActive ? "position" : false}
      transition={{
        layout: {
          ...entityLayoutTransition(entityId, compiledPlan),
        },
        opacity: {
          duration: (compiledPlan?.primaryDurationMs ?? 560) / 1_000,
        },
      }}
      exit={transferActive ? { opacity: 0.999 } : { opacity: 0, transition: { duration: 0 } }}
      style={{ ...style, visibility: sourceExitActive ? "hidden" : style?.visibility }}
      {...divProps}
    >
      {children}
    </motion.div>
  );
}

export interface AnimatedEntityListItemProps extends Omit<
  HTMLMotionProps<"li">,
  "children" | "layout" | "layoutId" | "ref" | "transition" | "exit"
> {
  readonly entityId: string;
  readonly zoneRef?: { kind: "zone"; id: string; ownerId?: string };
  readonly density: AnimationNodeDensity;
  readonly children: React.ReactNode;
}

/** Semantic list-item endpoint that AnimatePresence can retain while a transfer exits. */
export function AnimatedEntityListItem({
  entityId,
  zoneRef,
  density,
  children,
  style,
  ...liProps
}: AnimatedEntityListItemProps) {
  const runtime = useOptionalAnimationRuntime();
  const compiledPlan = runtime?.compiledPlan;
  const transferActive = hasEntityTransfer(entityId, compiledPlan);
  const sourceExitActive = hasSourceCardExit(entityId, compiledPlan);
  const layoutActive = entityParticipatesInLayout(entityId, zoneRef?.id, compiledPlan);
  const isPresent = useIsPresent();
  const ref = useAnimationNode(
    { kind: "entity", id: entityId },
    {
      zoneId: zoneRef?.id,
      density,
      presence: isPresent ? "present" : "exiting",
    },
  );
  return (
    <motion.li
      ref={ref}
      layout={layoutActive && !transferActive ? "position" : false}
      transition={{
        layout: { ...entityLayoutTransition(entityId, compiledPlan) },
        opacity: { duration: (compiledPlan?.primaryDurationMs ?? 560) / 1_000 },
      }}
      exit={transferActive ? { opacity: 0.999 } : { opacity: 0, transition: { duration: 0 } }}
      style={{ ...style, visibility: sourceExitActive ? "hidden" : style?.visibility }}
      {...liProps}
    >
      {children}
    </motion.li>
  );
}
