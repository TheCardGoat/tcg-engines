import { useCallback, useMemo, useState, type ReactNode } from "react";
import type { Side } from "../../engine";
import {
  AttackSelectionContext,
  type AttackSelectionContextValue,
  type AttackSelectionState,
} from "./attackSelectionContextValue";

export function AttackSelectionProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<AttackSelectionState | null>(null);

  const setAttacker = useCallback(
    (side: Side, attackerId: string, intent: AttackSelectionState["intent"] = "any") => {
      setSelection({ side, attackerId, intent });
    },
    [],
  );

  const clearSelection = useCallback(() => setSelection(null), []);

  const value = useMemo<AttackSelectionContextValue>(
    () => ({
      selection,
      setAttacker,
      clearSelection,
    }),
    [clearSelection, selection, setAttacker],
  );

  return (
    <AttackSelectionContext.Provider value={value}>{children}</AttackSelectionContext.Provider>
  );
}
