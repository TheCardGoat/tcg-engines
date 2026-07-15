import { useCallback } from "react";

import { useBoardProjection, useGundamGame } from "../../game/index.ts";
import { UndoButton } from "./UndoButton.tsx";

/**
 * Battlefield-edge undo affordance, rendered at the same right-center
 * position the old `LastActionUndoButton` toast used. Always present
 * (no auto-hide) so that desktop users with the sidebar collapsed —
 * who can't see the sidebar-footer undo button — still have a
 * reachable undo control. The shared `UndoButton` handles the
 * disabled/ready/fresh visual states.
 */
export function FloatingUndoButton() {
  const { adapter } = useGundamGame();
  // Subscribe to board updates so `canUndo()` is re-read every state change.
  useBoardProjection();

  const canUndo = adapter.canUndo();
  const onUndo = useCallback(() => {
    adapter.undo();
  }, [adapter]);

  return (
    <UndoButton
      canUndo={canUndo}
      onUndo={onUndo}
      className="absolute z-30 right-[22px] top-1/2 mt-[68px] -translate-y-1/2 min-w-[140px]"
    />
  );
}
