import type { AnimationAnchorRef } from "@tcg/protocol/animations";
import type { CSSProperties } from "react";

import { useAnimationNode } from "../hooks/useAnimationNode";

export function AnimationAnchor({
  animationRef,
  className,
  style,
}: {
  readonly animationRef: AnimationAnchorRef;
  readonly className?: string;
  readonly style?: CSSProperties;
}) {
  const ref = useAnimationNode(animationRef, { presence: "present" });
  return <span ref={ref} aria-hidden className={className} style={style} />;
}
