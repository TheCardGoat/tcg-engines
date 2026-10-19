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
  // Keep the same parent for the collection throughout the match. Switching
  // Fragment ↔ AnimatePresence on every move remounted every card at prepare
  // and finish, resetting focus and rebuilding drag/geometry registrations.
  if (!runtime) return <>{children}</>;

  return (
    <AnimatePresence initial={false} mode={mode}>
      {children}
    </AnimatePresence>
  );
}
