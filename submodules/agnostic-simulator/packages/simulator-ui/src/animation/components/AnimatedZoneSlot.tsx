import type { AnimationZoneRef } from "@tcg/protocol/animations";
import { motion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

import { useAnimationNode } from "../hooks/useAnimationNode";
import { hasZoneTransfer } from "../lib/entity-layout-transition";
import { useOptionalAnimationRuntime } from "../provider/contexts";

export interface AnimatedZoneSlotProps {
  readonly animationRef: AnimationZoneRef;
  readonly children: ReactNode;
  readonly className?: string;
  readonly style?: CSSProperties;
}

export function AnimatedZoneSlot({
  animationRef,
  children,
  className,
  style,
}: AnimatedZoneSlotProps) {
  const runtime = useOptionalAnimationRuntime();
  const ref = useAnimationNode(animationRef, { presence: "present" });
  const layoutActive = hasZoneTransfer(animationRef.id, runtime?.compiledPlan);
  return (
    <motion.div
      ref={ref}
      layout={layoutActive ? "position" : false}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
