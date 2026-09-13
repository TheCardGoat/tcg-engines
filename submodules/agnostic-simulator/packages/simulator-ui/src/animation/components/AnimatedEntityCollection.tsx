import { AnimatePresence } from "motion/react";
import type { ReactNode } from "react";

import { useOptionalAnimationRuntime } from "../provider/contexts";

export function AnimatedEntityCollection({
  children,
  mode = "sync",
}: {
  readonly children: ReactNode;
  readonly mode?: "sync" | "popLayout";
}) {
  const runtime = useOptionalAnimationRuntime();
  if (!runtime?.activeTransition) return <>{children}</>;

  return (
    <AnimatePresence initial={false} mode={mode}>
      {children}
    </AnimatePresence>
  );
}
