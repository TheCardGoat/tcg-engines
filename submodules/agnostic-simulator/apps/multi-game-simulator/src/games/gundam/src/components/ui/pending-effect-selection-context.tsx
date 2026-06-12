import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { protocolTargetSelection, useInteractionView } from "../../game/index.ts";

export interface PendingEffectSelectionContextValue {
  readonly activeEffectId?: string;
  readonly selectedTargetIds: readonly string[];
  readonly selectedTargetSet: ReadonlySet<string>;
  readonly isComplete: boolean;
  readonly canSkip: boolean;
  readonly selectTarget: (cardId: string) => void;
  readonly clear: () => void;
}

const EMPTY_SET = new Set<string>();

const DEFAULT: PendingEffectSelectionContextValue = {
  selectedTargetIds: [],
  selectedTargetSet: EMPTY_SET,
  isComplete: false,
  canSkip: false,
  selectTarget: () => undefined,
  clear: () => undefined,
};

const PendingEffectSelectionContext = createContext<PendingEffectSelectionContextValue>(DEFAULT);

export function PendingEffectSelectionProvider({ children }: { readonly children: ReactNode }) {
  const interactionView = useInteractionView();
  const selection = protocolTargetSelection(interactionView);
  const [selectedTargetIds, setSelectedTargetIds] = useState<readonly string[]>([]);

  const activeEffectId = selection?.pendingEffectId;
  const actionId = selection?.actionId;
  const minTargets = selection?.minTargets ?? 0;
  const maxTargets = selection?.maxTargets ?? 0;
  const legalTargetKey = selection ? [...selection.targetIds].sort().join(",") : "";
  const legalTargetSet = useMemo(
    () => (legalTargetKey ? new Set(legalTargetKey.split(",").filter(Boolean)) : EMPTY_SET),
    [legalTargetKey],
  );

  useEffect(() => {
    setSelectedTargetIds([]);
  }, [activeEffectId, actionId]);

  useEffect(() => {
    if (!selection) return;
    setSelectedTargetIds((current) => {
      const filtered = current.filter((id) => legalTargetSet.has(id));
      return filtered.length === current.length ? current : filtered;
    });
  }, [legalTargetKey, legalTargetSet, selection]);

  const selectTarget = useCallback(
    (cardId: string) => {
      if (!selection) return;
      if (!legalTargetSet.has(cardId)) return;

      setSelectedTargetIds((current) => {
        if (maxTargets === 1) {
          return current[0] === cardId ? [] : [cardId];
        }

        if (current.includes(cardId)) {
          return current.filter((id) => id !== cardId);
        }

        if (current.length >= maxTargets) {
          return current;
        }

        return [...current, cardId];
      });
    },
    [legalTargetSet, maxTargets, selection],
  );

  const clear = useCallback(() => setSelectedTargetIds([]), []);

  const selectedLegalTargetIds = useMemo(
    () => (selection ? selectedTargetIds.filter((id) => legalTargetSet.has(id)) : []),
    [legalTargetKey, legalTargetSet, selectedTargetIds, selection],
  );

  const selectedTargetSet = useMemo(
    () => new Set(selectedLegalTargetIds),
    [selectedLegalTargetIds],
  );

  const isComplete =
    Boolean(selection) &&
    selectedLegalTargetIds.length >= minTargets &&
    selectedLegalTargetIds.length <= maxTargets;

  const canSkip = Boolean(selection && minTargets === 0);

  const value = useMemo<PendingEffectSelectionContextValue>(
    () => ({
      activeEffectId,
      selectedTargetIds: selectedLegalTargetIds,
      selectedTargetSet,
      isComplete,
      canSkip,
      selectTarget,
      clear,
    }),
    [
      activeEffectId,
      selectedLegalTargetIds,
      selectedTargetSet,
      isComplete,
      canSkip,
      selectTarget,
      clear,
    ],
  );

  return (
    <PendingEffectSelectionContext.Provider value={value}>
      {children}
    </PendingEffectSelectionContext.Provider>
  );
}

export function usePendingEffectSelection(): PendingEffectSelectionContextValue {
  return useContext(PendingEffectSelectionContext);
}
